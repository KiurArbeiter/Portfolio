const canvas = document.getElementById("glitchCanvas");
const ctx = canvas.getContext("2d");

const protectedElement = document.querySelector(".wrapper");

// margin around protected area
const SAFE_MARGIN = 99;

// how much smaller the area should be
const SHRINK = 20;

// the corner radius of the mask
const RADIUS = 99;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const letters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*+=";
const fontSize = 16;
let columns = Math.floor(canvas.width / fontSize);
let drops = Array(columns).fill(1);

// helper: distance from point to rounded rectangle edge
function distanceToRoundedRect(x, y, left, top, right, bottom, radius) {
  const clampedX = Math.max(left + radius, Math.min(x, right - radius));
  const clampedY = Math.max(top + radius, Math.min(y, bottom - radius));
  const dx = x - clampedX;
  const dy = y - clampedY;
  return Math.sqrt(dx * dx + dy * dy);
}

function draw() {
  ctx.fillStyle = "rgba(0,0,0,0.08)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.font = `${fontSize}px monospace`;

  // measure protected zone
  const rect = protectedElement.getBoundingClientRect();
  const protectedLeft   = rect.left   - SAFE_MARGIN + SHRINK;
  const protectedRight  = rect.right  + SAFE_MARGIN - SHRINK;
  const protectedTop    = rect.top    - SAFE_MARGIN + SHRINK;
  const protectedBottom = rect.bottom + SAFE_MARGIN - SHRINK;

  for (let i = 0; i < drops.length; i++) {

    const x = i * fontSize;
    const y = drops[i] * fontSize;

    // distance to rounded rectangle border
    const dist = distanceToRoundedRect(
      x,
      y,
      protectedLeft,
      protectedTop,
      protectedRight,
      protectedBottom,
      RADIUS
    );

    let alpha = 1;

    // inside fully protected zone (completely hidden)
    if (dist < 0) {
      drops[i]++;
      continue;
    }

    // fade out within 70px of the boundary
    const fadeDistance = 70;
    if (dist < fadeDistance) {
      alpha = dist / fadeDistance;  // fades from 0 → 1
    }

    const char = letters[Math.floor(Math.random() * letters.length)];

    ctx.fillStyle = `hsla(${Math.random() * 360}, 80%, 50%, ${alpha})`;
    ctx.fillText(char, x, y);

    // normal matrix reset
    if (Math.random() > 0.975) drops[i] = 0;
    drops[i]++;
  }
}

setInterval(draw, 30);

window.addEventListener("resize", () => {
  columns = Math.floor(canvas.width / fontSize);
  drops = Array(columns).fill(1);
});
