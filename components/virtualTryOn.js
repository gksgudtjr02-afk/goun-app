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
const FOREHEAD = 10;
const NOSE_TIP = 4;

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

  // Base tint. 'color' blend keeps the lips' own shading/highlights and only
  // swaps the hue, so it reads as makeup rather than a flat paint fill.
  ctx.save();
  ctx.globalCompositeOperation = 'color';
  ctx.globalAlpha = 0.85;
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
  const lift = Math.max(10, eyeWidth * 0.5);
  const path = new Path2D();
  upperPts.forEach((p, i) => (i === 0 ? path.moveTo(p.x, p.y) : path.lineTo(p.x, p.y)));
  for (let i = upperPts.length - 1; i >= 0; i--) path.lineTo(upperPts[i].x, upperPts[i].y - lift);
  path.closePath();

  // Solid near the lash line, fading out toward the brow, instead of a flat block of color.
  const mid = upperPts[Math.floor(upperPts.length / 2)];
  const gradient = ctx.createLinearGradient(mid.x, mid.y, mid.x, mid.y - lift);
  gradient.addColorStop(0, color);
  gradient.addColorStop(0.55, color);
  gradient.addColorStop(1, 'rgba(255,255,255,0)');
  const blurPx = Math.min(5, Math.max(1.5, eyeWidth * 0.06));

  ctx.save();
  ctx.globalCompositeOperation = 'color';
  ctx.globalAlpha = 0.8;
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
  gradient.addColorStop(0.6, color);
  gradient.addColorStop(1, 'rgba(255,255,255,0)');
  const blurPx = Math.min(8, Math.max(2, radius * 0.15));
  ctx.save();
  ctx.globalCompositeOperation = 'color';
  ctx.globalAlpha = 0.7;
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
export async function capturePhotoWithMakeup(video, products) {
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
    const list = Array.isArray(products) ? products : [products];
    list.forEach((product) => drawForProduct(ctx, face, canvas.width, canvas.height, product));
  }
  return { canvas, faceFound: !!face };
}

/* ---------- Look analysis: read the colors already in a photo, instead of drawing new ones ---------- */

function boundingBox(points) {
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  return { minX: Math.min(...xs), maxX: Math.max(...xs), minY: Math.min(...ys), maxY: Math.max(...ys) };
}

function averageColorInBox(ctx, canvasW, canvasH, box) {
  const x = Math.max(0, Math.min(canvasW - 1, Math.round(box.minX)));
  const y = Math.max(0, Math.min(canvasH - 1, Math.round(box.minY)));
  const w = Math.max(1, Math.min(canvasW - x, Math.round(box.maxX - box.minX)));
  const h = Math.max(1, Math.min(canvasH - y, Math.round(box.maxY - box.minY)));
  const { data } = ctx.getImageData(x, y, w, h);
  let r = 0, g = 0, b = 0, n = 0;
  for (let i = 0; i < data.length; i += 4) {
    r += data[i]; g += data[i + 1]; b += data[i + 2]; n++;
  }
  if (!n) return null;
  const toHex = (v) => Math.round(v / n).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function mixHex(a, b) {
  if (!a) return b;
  if (!b) return a;
  const toRgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  const [ra, ga, ba] = toRgb(a);
  const [rb, gb, bb] = toRgb(b);
  const toHex = (v) => Math.round(v).toString(16).padStart(2, '0');
  return `#${toHex((ra + rb) / 2)}${toHex((ga + gb) / 2)}${toHex((ba + bb) / 2)}`;
}

/**
 * Given an already-loaded <img> (a photo the user picked — their own selfie or
 * someone else's, e.g. a celebrity's look), finds a face and reads back the
 * actual lip / eye / cheek colors in the photo. Returns hex colors, not a
 * rendered image — callers match these against a product catalog themselves.
 */
export async function analyzeLookColors(imageEl) {
  const w = imageEl.naturalWidth || imageEl.width;
  const h = imageEl.naturalHeight || imageEl.height;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(imageEl, 0, 0, w, h);

  const landmarker = await getFaceLandmarker();
  const result = landmarker.detect(canvas);
  const face = result?.faceLandmarks?.[0];
  if (!face) return { faceFound: false };

  const lipBox = boundingBox(LIPS_OUTER.map((i) => toPoint(face, i, w, h)));
  const lipColor = averageColorInBox(ctx, w, h, lipBox);

  const rEyePts = EYE_RIGHT_UPPER.map((i) => toPoint(face, i, w, h));
  const lEyePts = EYE_LEFT_UPPER.map((i) => toPoint(face, i, w, h));
  const eyeWidth = Math.hypot(rEyePts[rEyePts.length - 1].x - rEyePts[0].x, rEyePts[rEyePts.length - 1].y - rEyePts[0].y);
  const lift = Math.max(6, eyeWidth * 0.25);
  const rEyeBox = boundingBox(rEyePts.map((p) => ({ x: p.x, y: p.y - lift })));
  const lEyeBox = boundingBox(lEyePts.map((p) => ({ x: p.x, y: p.y - lift })));
  const eyeColor = mixHex(averageColorInBox(ctx, w, h, rEyeBox), averageColorInBox(ctx, w, h, lEyeBox));

  const rCorner = toPoint(face, MOUTH_CORNER_R, w, h);
  const lCorner = toPoint(face, MOUTH_CORNER_L, w, h);
  const rEyeOuter = toPoint(face, EYE_OUTER_R, w, h);
  const lEyeOuter = toPoint(face, EYE_OUTER_L, w, h);
  const cheekSize = Math.max(10, eyeWidth * 0.35);
  const rCheek = { x: (rEyeOuter.x + rCorner.x) / 2, y: (rEyeOuter.y + rCorner.y) / 2 };
  const lCheek = { x: (lEyeOuter.x + lCorner.x) / 2, y: (lEyeOuter.y + lCorner.y) / 2 };
  const cheekBox = (c) => ({ minX: c.x - cheekSize / 2, maxX: c.x + cheekSize / 2, minY: c.y - cheekSize / 2, maxY: c.y + cheekSize / 2 });
  const blushColor = mixHex(averageColorInBox(ctx, w, h, cheekBox(rCheek)), averageColorInBox(ctx, w, h, cheekBox(lCheek)));

  // T-zone (forehead + nose bridge): sampled for oiliness/shine comparison, not
  // makeup color matching, so it's kept separate from the lip/eye/blush trio above.
  const tSize = Math.max(10, eyeWidth * 0.3);
  const tBox = (c) => ({ minX: c.x - tSize / 2, maxX: c.x + tSize / 2, minY: c.y - tSize / 2, maxY: c.y + tSize / 2 });
  const foreheadPt = toPoint(face, FOREHEAD, w, h);
  const noseTipPt = toPoint(face, NOSE_TIP, w, h);
  const tzoneColor = mixHex(averageColorInBox(ctx, w, h, tBox(foreheadPt)), averageColorInBox(ctx, w, h, tBox(noseTipPt)));

  return { faceFound: true, lip: lipColor, eye: eyeColor, blush: blushColor, tzone: tzoneColor };
}

/**
 * Draws the given lip/eye/blush hex colors (usually the output of
 * analyzeLookColors on a reference photo) onto a *different* photo — used to
 * show "here's that look on you" next to the original reference image.
 * Returns a canvas with the result; callers turn it into an <img> src themselves.
 */
export async function applyDetectedLook(imageEl, colors) {
  const w = imageEl.naturalWidth || imageEl.width;
  const h = imageEl.naturalHeight || imageEl.height;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(imageEl, 0, 0, w, h);

  const landmarker = await getFaceLandmarker();
  const result = landmarker.detect(canvas);
  const face = result?.faceLandmarks?.[0];
  if (!face) return { canvas, faceFound: false };

  if (colors.lip) drawLips(ctx, face, w, h, colors.lip);
  if (colors.eye) drawEyeshadow(ctx, face, w, h, colors.eye);
  if (colors.blush) drawBlush(ctx, face, w, h, colors.blush);
  return { canvas, faceFound: true };
}

/* ---------- Background swap: cut the person out (free MediaPipe segmentation), composite onto a preset background ---------- */

const SEGMENTER_MODEL_URL =
  'https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_segmenter/float16/latest/selfie_segmenter.tflite';

let segmenterPromise = null;

async function createSegmenter(filesetResolver, delegate) {
  const { ImageSegmenter } = await import('@mediapipe/tasks-vision');
  return ImageSegmenter.createFromOptions(filesetResolver, {
    baseOptions: { modelAssetPath: SEGMENTER_MODEL_URL, delegate },
    runningMode: 'IMAGE',
    outputCategoryMask: false,
    outputConfidenceMasks: true,
  });
}

// Separate lazy model from the face landmarker above — different task, loaded
// only once a user actually taps a background preset (not on every photo).
// CPU only (not GPU-then-fallback like the face landmarker): on several real
// phones the GPU delegate "succeeded" but returned a garbage/near-empty mask
// with no error — CPU is slower but has been reliably correct.
async function getImageSegmenter() {
  if (!segmenterPromise) {
    segmenterPromise = (async () => {
      const { FilesetResolver } = await import('@mediapipe/tasks-vision');
      const filesetResolver = await FilesetResolver.forVisionTasks(WASM_URL);
      return createSegmenter(filesetResolver, 'CPU');
    })();
  }
  return segmenterPromise;
}

/**
 * Runs person segmentation on a canvas and returns a soft alpha mask
 * (0 = background, 1 = person) the same pixel size as the source.
 */
export async function segmentPerson(sourceCanvas) {
  const segmenter = await getImageSegmenter();
  const result = segmenter.segment(sourceCanvas);
  const maskObj = result.confidenceMasks?.[0];
  if (!maskObj) throw new Error('배경을 분리하지 못했어요');
  // The model's output mask is often a different (usually smaller, fixed)
  // resolution than the source photo — NOT necessarily sourceCanvas's own
  // width/height. Keep the mask's own dimensions here; compositeOntoBackground
  // upscales it to match the actual photo before blending.
  const w = maskObj.width;
  const h = maskObj.height;
  const mask = maskObj.getAsFloat32Array();
  result.confidenceMasks.forEach((m) => m.close());

  // Sanity check: a real selfie should have a meaningfully large "person"
  // region. If the mask is essentially all-zero (segmentation silently
  // failed — seen on some phones with no error thrown), bail out here
  // instead of letting the caller composite a photo of nothing but background.
  let maxVal = 0;
  for (let i = 0; i < mask.length; i++) if (mask[i] > maxVal) maxVal = mask[i];
  if (maxVal < 0.3) throw new Error('사람을 찾지 못했어요');

  return { mask, w, h };
}

/**
 * Composites `sourceCanvas` onto `backgroundFill` (a color, gradient, or
 * pattern usable as a canvas fillStyle) using a mask from segmentPerson().
 * `maskW`/`maskH` are the mask's OWN resolution (from segmentPerson), which
 * this upscales (smoothly, via canvas scaling) to sourceCanvas's actual size
 * before blending — the two are frequently not the same resolution.
 * Returns a new canvas; the inputs are left untouched.
 */
export function compositeOntoBackground(sourceCanvas, mask, maskW, maskH, backgroundFill) {
  const w = sourceCanvas.width;
  const h = sourceCanvas.height;

  const maskCanvas = document.createElement('canvas');
  maskCanvas.width = maskW;
  maskCanvas.height = maskH;
  const maskCtx = maskCanvas.getContext('2d');
  const maskImg = maskCtx.createImageData(maskW, maskH);
  for (let i = 0; i < mask.length; i++) {
    const v = Math.max(0, Math.min(255, Math.round(mask[i] * 255)));
    maskImg.data[i * 4] = v;
    maskImg.data[i * 4 + 1] = v;
    maskImg.data[i * 4 + 2] = v;
    maskImg.data[i * 4 + 3] = 255;
  }
  maskCtx.putImageData(maskImg, 0, 0);

  // Upscale the mask to the photo's real size using the canvas's own
  // (smoothed) image scaling, instead of indexing it 1:1 against full-res pixels.
  const upCanvas = document.createElement('canvas');
  upCanvas.width = w;
  upCanvas.height = h;
  const upCtx = upCanvas.getContext('2d');
  upCtx.drawImage(maskCanvas, 0, 0, w, h);
  const upscaledMask = upCtx.getImageData(0, 0, w, h).data;

  const out = document.createElement('canvas');
  out.width = w;
  out.height = h;
  const outCtx = out.getContext('2d');
  outCtx.fillStyle = backgroundFill;
  outCtx.fillRect(0, 0, w, h);
  const bgData = outCtx.getImageData(0, 0, w, h);

  const srcCtx = sourceCanvas.getContext('2d');
  const srcData = srcCtx.getImageData(0, 0, w, h);

  for (let p = 0; p < bgData.data.length; p += 4) {
    const alpha = upscaledMask[p] / 255;
    bgData.data[p] = srcData.data[p] * alpha + bgData.data[p] * (1 - alpha);
    bgData.data[p + 1] = srcData.data[p + 1] * alpha + bgData.data[p + 1] * (1 - alpha);
    bgData.data[p + 2] = srcData.data[p + 2] * alpha + bgData.data[p + 2] * (1 - alpha);
    bgData.data[p + 3] = 255;
  }
  outCtx.putImageData(bgData, 0, 0);
  return out;
}
