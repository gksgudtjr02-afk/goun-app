/* ---------- Virtual makeup try-on: capture a photo, apply makeup once (higher quality than live video) ---------- */

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
    runningMode: 'IMAGE',
    numFaces: 1,
  });
}

// Single shared IMAGE-mode landmarker: one photo, processed once, so we can
// afford a more careful detection pass than a 30fps live-video loop would.
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

function toPoint(landmarks, idx, w, h) {
  const p = landmarks[idx];
  return { x: p.x * w, y: p.y * h };
}

function pathFromIndices(landmarks, indices, w, h) {
  const path = new Path2D();
  indices.forEach((idx, i) => {
    const { x, y } = toPoint(landmarks, idx, w, h);
    if (i === 0) path.moveTo(x, y);
    else path.lineTo(x, y);
  });
  path.closePath();
  return path;
}

function drawLips(ctx, landmarks, w, h, color) {
  const combined = new Path2D();
  combined.addPath(pathFromIndices(landmarks, LIPS_OUTER, w, h));
  combined.addPath(pathFromIndices(landmarks, LIPS_INNER, w, h));

  const rCorner = toPoint(landmarks, MOUTH_CORNER_R, w, h);
  const lCorner = toPoint(landmarks, MOUTH_CORNER_L, w, h);
  const width = Math.hypot(lCorner.x - rCorner.x, lCorner.y - rCorner.y);
  const blurPx = Math.min(6, Math.max(1.5, width * 0.05));

  // Base tint: 'color' blend keeps the lips' own shading/highlights and only
  // swaps the hue, so it reads as makeup rather than a flat paint fill.
  ctx.save();
  ctx.globalCompositeOperation = 'color';
  ctx.globalAlpha = 0.8;
  ctx.filter = `blur(${blurPx}px)`;
  ctx.fillStyle = color;
  ctx.fill(combined, 'evenodd');
  ctx.filter = 'none';
  ctx.restore();

  // Gloss highlight on the lower lip, like a tint/gloss product catching light.
  const lowerCenter = toPoint(landmarks, 14, w, h);
  const glossR = Math.max(width * 0.09, 3);
  const gloss = ctx.createRadialGradient(lowerCenter.x, lowerCenter.y, 0, lowerCenter.x, lowerCenter.y, glossR);
  gloss.addColorStop(0, 'rgba(255,255,255,0.85)');
  gloss.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  ctx.globalAlpha = 0.5;
  ctx.filter = `blur(${blurPx * 0.6}px)`;
  ctx.fillStyle = gloss;
  ctx.beginPath();
  ctx.arc(lowerCenter.x, lowerCenter.y, glossR, 0, Math.PI * 2);
  ctx.fill();
  ctx.filter = 'none';
  ctx.restore();
}

function drawEyeshadowSide(ctx, landmarks, w, h, color, upperIndices) {
  const upperPts = upperIndices.map((idx) => toPoint(landmarks, idx, w, h));
  const first = upperPts[0];
  const last = upperPts[upperPts.length - 1];
  const eyeWidth = Math.hypot(last.x - first.x, last.y - first.y);
  const lift = Math.max(8, eyeWidth * 0.42);
  const path = new Path2D();
  upperPts.forEach((p, i) => (i === 0 ? path.moveTo(p.x, p.y) : path.lineTo(p.x, p.y)));
  for (let i = upperPts.length - 1; i >= 0; i--) path.lineTo(upperPts[i].x, upperPts[i].y - lift);
  path.closePath();

  // Darker near the lash line, fading out toward the brow, instead of a flat block of color.
  const mid = upperPts[Math.floor(upperPts.length / 2)];
  const gradient = ctx.createLinearGradient(mid.x, mid.y, mid.x, mid.y - lift);
  gradient.addColorStop(0, color);
  gradient.addColorStop(1, 'rgba(255,255,255,0)');
  const blurPx = Math.min(5, Math.max(1.5, eyeWidth * 0.06));

  ctx.save();
  ctx.globalCompositeOperation = 'color';
  ctx.globalAlpha = 0.65;
  ctx.filter = `blur(${blurPx}px)`;
  ctx.fillStyle = gradient;
  ctx.fill(path);
  ctx.filter = 'none';
  ctx.restore();
}

function drawEyeshadow(ctx, landmarks, w, h, color) {
  drawEyeshadowSide(ctx, landmarks, w, h, color, EYE_RIGHT_UPPER);
  drawEyeshadowSide(ctx, landmarks, w, h, color, EYE_LEFT_UPPER);
}

function drawBlushSide(ctx, landmarks, w, h, color, eyeCornerIdx, mouthCornerIdx, dir) {
  const eyeP = toPoint(landmarks, eyeCornerIdx, w, h);
  const mouthP = toPoint(landmarks, mouthCornerIdx, w, h);
  const cx = (eyeP.x + mouthP.x) / 2 + dir * Math.abs(eyeP.x - mouthP.x) * 0.12;
  const cy = (eyeP.y + mouthP.y) / 2 - Math.abs(eyeP.y - mouthP.y) * 0.05;
  const radius = Math.hypot(mouthP.x - eyeP.x, mouthP.y - eyeP.y) * 0.32;
  const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
  gradient.addColorStop(0, color);
  gradient.addColorStop(1, 'rgba(255,255,255,0)');
  const blurPx = Math.min(8, Math.max(2, radius * 0.15));
  ctx.save();
  ctx.globalCompositeOperation = 'color';
  ctx.globalAlpha = 0.55;
  ctx.filter = `blur(${blurPx}px)`;
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(cx, cy, Math.max(radius, 1), 0, Math.PI * 2);
  ctx.fill();
  ctx.filter = 'none';
  ctx.restore();
}

function drawBlush(ctx, landmarks, w, h, color) {
  drawBlushSide(ctx, landmarks, w, h, color, EYE_OUTER_R, MOUTH_CORNER_R, -1);
  drawBlushSide(ctx, landmarks, w, h, color, EYE_OUTER_L, MOUTH_CORNER_L, 1);
}

function drawBase(ctx, w, h, color) {
  ctx.save();
  ctx.globalCompositeOperation = 'soft-light';
  ctx.globalAlpha = 0.18;
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, w, h);
  ctx.restore();
}

function drawForProduct(ctx, landmarks, w, h, product) {
  const color = product?.color || '#FF4D6D';
  switch (product?.type) {
    case 'lip':
      drawLips(ctx, landmarks, w, h, color);
      break;
    case 'eye':
      drawEyeshadow(ctx, landmarks, w, h, color);
      break;
    case 'blush':
      drawBlush(ctx, landmarks, w, h, color);
      break;
    case 'base':
    case 'skin':
    default:
      drawBase(ctx, w, h, color);
      break;
  }
}

/** Opens the front camera and attaches it to the given <video>. Returns the MediaStream. */
export async function startCameraPreview(video) {
  // No hard min/ideal aspect: forcing a tall 9:16 resolution makes some phones
  // digitally crop (zoom into) the sensor to satisfy it. A modest, unconstrained
  // request lets the browser use the camera's natural field of view.
  const stream = await navigator.mediaDevices.getUserMedia({
    video: {
      facingMode: 'user',
      width: { ideal: 960 },
      height: { ideal: 960 },
      resizeMode: 'none',
    },
    audio: false,
  });
  video.srcObject = stream;
  await video.play().catch(() => {});
  return stream;
}

export function stopStream(stream) {
  stream?.getTracks().forEach((tr) => tr.stop());
}

/**
 * Captures the current video frame (mirrored, to match what the user saw while framing
 * the shot), runs face-landmark detection once on that still photo, and draws the
 * selected product's makeup onto it.
 * Returns { canvas, faceFound }.
 */
export async function capturePhotoWithMakeup(video, product) {
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext('2d');
  ctx.translate(canvas.width, 0);
  ctx.scale(-1, 1);
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  ctx.setTransform(1, 0, 0, 1, 0, 0);

  const landmarker = await getFaceLandmarker();
  const result = landmarker.detect(canvas);
  const face = result?.faceLandmarks?.[0];
  if (face) {
    drawForProduct(ctx, face, canvas.width, canvas.height, product);
  }
  return { canvas, faceFound: !!face };
}
