/*! Lunar surface imagery: NASA/Goddard SVS, LRO and LROC. https://svs.gsfc.nasa.gov/4720/ */
import surfaceUrl from "./moon-surface.jpg";

// NASA LRO near-side surface, projected from its longitude/latitude mosaic.
const surface = new Image();
surface.src = surfaceUrl;
const texture = surface.decode().then(() => {
  const canvas = document.createElement("canvas");
  canvas.width = surface.width;
  canvas.height = surface.height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  ctx.drawImage(surface, 0, 0);
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
});
const frames = new Map();

export async function drawMoon(canvas, phase) {
  if (!canvas) return;
  const map = await texture;
  if (!canvas.isConnected) return;
  const width = canvas.width, radius = width * 0.43, center = width / 2;
  const key = `${width}:${phase.toFixed(4)}`;
  let frame = frames.get(key);
  if (!frame) {
    frame = new ImageData(width, width);
    const angle = phase * Math.PI * 2;
    const lightX = Math.sin(angle), lightZ = -Math.cos(angle);
    for (let y = 0; y < width; y++) {
      for (let x = 0; x < width; x++) {
        const nx = (x + 0.5 - center) / radius;
        const ny = (center - y - 0.5) / radius;
        const distance = Math.hypot(nx, ny);
        if (distance >= 1) continue;
        const nz = Math.sqrt(1 - nx * nx - ny * ny);
        const longitude = Math.atan2(nx, nz);
        const latitude = Math.asin(ny);
        const tx = Math.min(map.width - 1, Math.floor((0.5 + longitude / (2 * Math.PI)) * map.width));
        const ty = Math.min(map.height - 1, Math.floor((0.5 - latitude / Math.PI) * map.height));
        const source = (ty * map.width + tx) * 4;
        const target = (y * width + x) * 4;
        // Gentle lunar limb darkening, a soft terminator, and faint earthshine.
        const incidence = nx * lightX + nz * lightZ;
        const sunlight = Math.sqrt(Math.max(0, incidence));
        const brightness = 0.035 + 1.42 * sunlight;
        for (let channel = 0; channel < 3; channel++) {
          frame.data[target + channel] = Math.min(255, map.data[source + channel] * brightness);
        }
        frame.data[target + 3] = Math.min(1, (1 - distance) * radius) * 255;
      }
    }
    if (frames.size >= 6) frames.clear();
    frames.set(key, frame);
  }
  canvas.getContext("2d").putImageData(frame, 0, 0);
}
