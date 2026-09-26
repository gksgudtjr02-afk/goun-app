/* ---------- Virtual makeup try-on: MediaPipe face landmarks + canvas overlay ---------- */

// Exact outer/inner lip contours from MediaPipe's FACEMESH_LIPS connection set,
// walked as a single closed loop rather than the raw (unordered) connection pairs.
const LIPS_OUTER = [61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291, 409, 270, 269, 267, 0, 37, 39, 40, 185];
const LIPS_INNER = [78, 95, 88, 178, 87, 14, 317, 402, 318, 324, 308, 415, 310, 311, 312, 13, 82, 81, 80, 191];

// Upper eyelid arcs only (FACEMESH_RIGHT_EYE / LEFT_EYE), used as the base of an
// approximate eyeshadow band lifted toward the brow.
const EYE_RIGHT_UPPER = [33, 246, 161, 160, 159, 158, 157, 173];
const EYE_LEFT_UPPER = [263, 466, 388, 387, 386, 385, 384, 398];

const EYE_OUTER_R = 33;
const EYE_OUTER_L = 263;
const MOUTH_CORNER_R = 61;
const MOUTH_CORNER_L = 291;

const MODEL_URL =
  'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/latest/face_landmarker.task';
const WASM_URL = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm';

let landmarkerPromise = null;

async function createLandmarker(filesetResolver, delegate) {
  const { FaceLandmarker } = await import('@mediapipe/tasks-vision');
  return FaceLandmarker.createFromOptions(filesetResolver, {
    baseOptions: { modelAssetPath: MODEL_URL, delegate },
    runningMode: 'VIDEO',
    numFaces: 1,
  });
}

async function getFaceLandmarker() {
  if (!landmarkerPromise) {
    landmarkerPromise = (async () => {
      const { FilesetResolver } = await import('@mediapipe/tasks-vision');
      const filesetResolver = await FilesetResolver.forVisionTasks(WASM_URL);
      try {
        return await createLandmarker(filesetResolver, 'GPU');
      } catch {
        return await createLandmarker(filesetResolver, 'CPU');
      }
    })();
  }
  return landmarkerPromise;
}

// object-fit:cover maps the raw video frame onto the canvas; this mirrors that
// mapping so drawn points land exactly where the visible (cropped) video is.
function coverTransform(videoW, videoH, canvasW, canvasH) {
  const scale = Math.max(canvasW / videoW, canvasH / videoH);
  return { scale, offsetX: (canvasW - videoW * scale) / 2, offsetY: (canvasH - videoH * scale) / 2 };
}

function toPoint(landmarks, idx, t) {
  const p = landmarks[idx];
  return { x: t.offsetX + p.x * t.videoW * t.scale, y: t.offsetY + p.y * t.videoH * t.scale };
}

function pathFromIndices(landmarks, indices, t) {
  const path = new Path2D();
  indices.forEach((idx, i) => {
    const { x, y } = toPoint(landmarks, idx, t);
    if (i === 0) path.moveTo(x, y);
    else path.lineTo(x, y);
  });
  path.closePath();
  return path;
}

function drawLips(ctx, landmarks, t, color) {
  const combined = new Path2D();
  combined.addPath(pathFromIndices(landmarks, LIPS_OUTER, t));
  combined.addPath(pathFromIndices(landmarks, LIPS_INNER, t));
  ctx.save();
  ctx.globalCompositeOperation = 'multiply';
  ctx.globalAlpha = 0.55;
  ctx.fillStyle = color;
  ctx.fill(combined, 'evenodd');
  ctx.restore();
}

function drawEyeshadowSide(ctx, landmarks, t, color, upperIndices) {
  const upperPts = upperIndices.map((idx) => toPoint(landmarks, idx, t));
  const first = upperPts[0];
  const last = upperPts[upperPts.length - 1];
  const eyeWidth = Math.hypot(last.x - first.x, last.y - first.y);
  const lift = Math.max(8, eyeWidth * 0.42);
  const path = new Path2D();
  upperPts.forEach((p, i) => (i === 0 ? path.moveTo(p.x, p.y) : path.lineTo(p.x, p.y)));
  for (let i = upperPts.length - 1; i >= 0; i--) path.lineTo(upperPts[i].x, upperPts[i].y - lift);
  path.closePath();
  ctx.save();
  ctx.globalCompositeOperation = 'multiply';
  ctx.globalAlpha = 0.4;
  ctx.fillStyle = color;
  ctx.fill(path);
  ctx.restore();
}

function drawEyeshadow(ctx, landmarks, t, color) {
  drawEyeshadowSide(ctx, landmarks, t, color, EYE_RIGHT_UPPER);
  drawEyeshadowSide(ctx, landmarks, t, color, EYE_LEFT_UPPER);
}

function drawBlushSide(ctx, landmarks, t, color, eyeCornerIdx, mouthCornerIdx, dir) {
  const eyeP = toPoint(landmarks, eyeCornerIdx, t);
  const mouthP = toPoint(landmarks, mouthCornerIdx, t);
  const cx = (eyeP.x + mouthP.x) / 2 + dir * Math.abs(eyeP.x - mouthP.x) * 0.12;
  const cy = (eyeP.y + mouthP.y) / 2 - Math.abs(eyeP.y - mouthP.y) * 0.05;
  const radius = Math.hypot(mouthP.x - eyeP.x, mouthP.y - eyeP.y) * 0.32;
  const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
  gradient.addColorStop(0, color);
  gradient.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.save();
  ctx.globalCompositeOperation = 'multiply';
  ctx.globalAlpha = 0.35;
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(cx, cy, Math.max(radius, 1), 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawBlush(ctx, landmarks, t, color) {
  drawBlushSide(ctx, landmarks, t, color, EYE_OUTER_R, MOUTH_CORNER_R, -1);
  drawBlushSide(ctx, landmarks, t, color, EYE_OUTER_L, MOUTH_CORNER_L, 1);
}

function drawBase(ctx, canvasCssW, canvasCssH, color) {
  ctx.save();
  ctx.globalCompositeOperation = 'soft-light';
  ctx.globalAlpha = 0.18;
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, canvasCssW, canvasCssH);
  ctx.restore();
}

function drawForProduct(ctx, landmarks, t, canvasCssW, canvasCssH, product) {
  const color = product?.color || '#FF4D6D';
  switch (product?.type) {
    case 'lip':
      drawLips(ctx, landmarks, t, color);
      break;
    case 'eye':
      drawEyeshadow(ctx, landmarks, t, color);
      break;
    case 'blush':
      drawBlush(ctx, landmarks, t, color);
      break;
    case 'base':
    case 'skin':
    default:
      drawBase(ctx, canvasCssW, canvasCssH, color);
      break;
  }
}

/**
 * Starts the camera + live AR overlay. Returns an async stop() function.
 * onStatus receives 'camera' | 'model' | 'running' | 'no-face' | 'error'.
 */
export async function startVirtualTryOn({ video, canvas, product, onStatus }) {
  let stopped = false;
  let stream = null;
  let rafId = null;

  try {
    onStatus?.('camera');
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'user', width: { ideal: 720 }, height: { ideal: 1280 } },
      audio: false,
    });
  } catch (err) {
    onStatus?.('error', err);
    return async () => {};
  }

  if (stopped) {
    stream.getTracks().forEach((tr) => tr.stop());
    return async () => {};
  }

  video.srcObject = stream;
  await video.play().catch(() => {});

  onStatus?.('model');
  let landmarker;
  try {
    landmarker = await getFaceLandmarker();
  } catch (err) {
    stream.getTracks().forEach((tr) => tr.stop());
    onStatus?.('error', err);
    return async () => {};
  }

  if (stopped) {
    stream.getTracks().forEach((tr) => tr.stop());
    return async () => {};
  }

  const ctx = canvas.getContext('2d');
  onStatus?.('searching');

  function loop() {
    if (stopped) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const cssW = rect.width || 1;
    const cssH = rect.height || 1;
    const pxW = Math.round(cssW * dpr);
    const pxH = Math.round(cssH * dpr);
    if (canvas.width !== pxW || canvas.height !== pxH) {
      canvas.width = pxW;
      canvas.height = pxH;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cssW, cssH);

    if (video.videoWidth && video.videoHeight) {
      const result = landmarker.detectForVideo(video, performance.now());
      const face = result?.faceLandmarks?.[0];
      if (face) {
        onStatus?.('running');
        const t = { ...coverTransform(video.videoWidth, video.videoHeight, cssW, cssH), videoW: video.videoWidth, videoH: video.videoHeight };
        drawForProduct(ctx, face, t, cssW, cssH, product);
      } else {
        onStatus?.('no-face');
      }
    }
    rafId = requestAnimationFrame(loop);
  }
  rafId = requestAnimationFrame(loop);

  return async function stop() {
    stopped = true;
    if (rafId) cancelAnimationFrame(rafId);
    if (stream) stream.getTracks().forEach((tr) => tr.stop());
  };
}
