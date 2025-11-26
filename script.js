const canvas = document.getElementById("glitchCanvas");
const ctx = canvas.getContext("2d");

const protectedElement = document.querySelector(".wrapper");

// margin around protected area
const SAFE_MARGIN = 99;
const SHRINK = 20;
const RADIUS = 99;

function resizeCanvas() {
    // limit canvas to hero section height only
    const hero = document.getElementById("hero");
    canvas.width = hero.offsetWidth;
    canvas.height = hero.offsetHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const letters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*+=";
const fontSize = 16;
let columns = Math.floor(canvas.width / fontSize);
let drops = Array(columns).fill(1);

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

    const rect = protectedElement.getBoundingClientRect();
    const heroRect = canvas.getBoundingClientRect();
    const offsetY = rect.top - heroRect.top;

    const protectedLeft = rect.left - SAFE_MARGIN + SHRINK;
    const protectedRight = rect.right + SAFE_MARGIN - SHRINK;
    const protectedTop = offsetY - SAFE_MARGIN + SHRINK;
    const protectedBottom = offsetY + rect.height + SAFE_MARGIN - SHRINK;

    for (let i = 0; i < drops.length; i++) {
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        const dist = distanceToRoundedRect(
            x, y,
            protectedLeft, protectedTop,
            protectedRight, protectedBottom,
            RADIUS
        );

        let alpha = 1;
        if (dist < 0) { drops[i]++; continue; }

        const fadeDistance = 70;
        if (dist < fadeDistance) {
            alpha = dist / fadeDistance;
        }

        const char = letters[Math.floor(Math.random() * letters.length)];
        ctx.fillStyle = `hsla(${Math.random() * 360}, 80%, 50%, ${alpha})`;
        ctx.fillText(char, x, y);

        if (Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
    }
}

setInterval(draw, 30);

window.addEventListener("resize", () => {
    const hero = document.getElementById("hero");
    columns = Math.floor(hero.offsetWidth / fontSize);
    drops = Array(columns).fill(1);
});

// SCROLL TO SECOND SECTION
const scroller = document.querySelector(".scroller");
scroller.addEventListener("click", () => {
    const aboutSection = document.getElementById("about");
    aboutSection.scrollIntoView({ behavior: "smooth" });
});
