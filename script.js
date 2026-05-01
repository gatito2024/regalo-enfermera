const canvas = document.getElementById("sunsetCanvas");
const ctx = canvas.getContext("2d");
const poemLine = document.getElementById("poemLine");
const poemCard = document.querySelector(".poem-card");
const letterScene = document.getElementById("letterScene");
const neonBox = document.getElementById("neonBox");
const letterLine = document.getElementById("letterLine");
const workerMessage = document.getElementById("workerMessage");
const finalCard = document.getElementById("finalCard");

const poem = [
  "Feliz D\u00eda del Trabajador, mi amor.",
  "Para mi enfermera favorita.",
  "Admiro mucho tu esfuerzo, mi amor.",
  "Tu paciencia y tu gran coraz\u00f3n me inspiran.",
  "Ser enfermera no es solo un trabajo, es una vocaci\u00f3n hermosa.",
  "Cada d\u00eda cuidas, ayudas y das esperanza.",
  "Estoy muy orgulloso de ti.",
  "Eres una mujer fuerte, noble y especial.",
  "Te amo mucho."
];

const deliveryRows = [
  { className: "title-row", words: ["FELIZ", "D\u00cdA"] },
  { className: "subtitle-row", words: ["MI", "ENFERMERA", "FAVORITA", "\u{1F49C}"] }
];
const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
const tulips = [];
const clouds = [];
const fireflies = [];
let width = 0;
let height = 0;
let dpr = 1;
let poemIndex = 0;
let lastTime = 0;

function random(min, max) {
  return Math.random() * (max - min) + min;
}

function pick(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function sleep(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function resize() {
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  createScene();
}

function createScene() {
  tulips.length = 0;
  clouds.length = 0;
  fireflies.length = 0;

  const tulipCount = Math.floor(width < 700 ? 95 : 170);
  const palette = [
    ["#ff75bd", "#8b5cf6"],
    ["#ffd1e7", "#ff6fb4"],
    ["#c084fc", "#9de7ff"],
    ["#ffffff", "#ff9eca"],
    ["#b779ff", "#ff8fc7"],
    ["#9de7ff", "#f9b4d8"]
  ];

  for (let i = 0; i < tulipCount; i += 1) {
    const depth = Math.random();
    const y = height * random(0.72, 1.02);
    const size = random(10, 25) * (0.65 + depth * 0.9);
    tulips.push({
      x: random(-40, width + 40),
      y,
      size,
      height: random(42, 100) * (0.72 + depth),
      colors: pick(palette),
      sway: random(0.8, 1.8),
      phase: random(0, Math.PI * 2),
      depth,
      lean: random(-0.18, 0.18)
    });
  }

  tulips.sort((a, b) => a.y - b.y);

  const cloudCount = width < 700 ? 5 : 8;
  for (let i = 0; i < cloudCount; i += 1) {
    clouds.push({
      x: random(-width * 0.2, width * 1.1),
      y: random(height * 0.1, height * 0.38),
      scale: random(0.7, 1.7),
      speed: random(4, 13),
      alpha: random(0.15, 0.34)
    });
  }

  const flyCount = width < 700 ? 38 : 70;
  for (let i = 0; i < flyCount; i += 1) {
    fireflies.push({
      x: random(0, width),
      y: random(height * 0.18, height * 0.82),
      r: random(1.1, 3.2),
      phase: random(0, Math.PI * 2),
      speed: random(0.25, 0.8),
      drift: random(8, 28),
      color: pick(["#ffffff", "#ffc7e5", "#b9f2ff", "#d8c5ff"])
    });
  }
}

function drawSky(time) {
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, "#150b35");
  gradient.addColorStop(0.28, "#3c1b63");
  gradient.addColorStop(0.55, "#a8497a");
  gradient.addColorStop(0.78, "#ff9b78");
  gradient.addColorStop(1, "#331438");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  const glowX = width * 0.5 + pointer.x * 12;
  const glowY = height * 0.52 + pointer.y * 8;
  const glow = ctx.createRadialGradient(glowX, glowY, 0, glowX, glowY, Math.max(width, height) * 0.58);
  glow.addColorStop(0, "rgba(255, 210, 172, 0.52)");
  glow.addColorStop(0.25, "rgba(255, 143, 199, 0.24)");
  glow.addColorStop(0.58, "rgba(157, 231, 255, 0.08)");
  glow.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, height);

  drawStars(time);
}

function drawStars(time) {
  ctx.save();
  for (let i = 0; i < 80; i += 1) {
    const x = ((i * 97) % width) + pointer.x * 4;
    const y = ((i * 43) % (height * 0.46)) + 16 + pointer.y * 3;
    const twinkle = 0.35 + Math.sin(time * 0.0015 + i) * 0.3;
    ctx.globalAlpha = Math.max(0.08, twinkle);
    ctx.fillStyle = i % 5 === 0 ? "#b9f2ff" : "#fff8ff";
    ctx.beginPath();
    ctx.arc(x, y, i % 7 === 0 ? 2 : 1.2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawSun(time) {
  const x = width * 0.5 + pointer.x * 18;
  const y = height * 0.55 + pointer.y * 10;
  const radius = Math.min(width, height) * 0.15;

  const halo = ctx.createRadialGradient(x, y, 0, x, y, radius * 3.1);
  halo.addColorStop(0, "rgba(255, 228, 174, 0.74)");
  halo.addColorStop(0.35, "rgba(255, 143, 199, 0.38)");
  halo.addColorStop(1, "rgba(139, 92, 246, 0)");
  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.arc(x, y, radius * 3.1, 0, Math.PI * 2);
  ctx.fill();

  const sun = ctx.createLinearGradient(x, y - radius, x, y + radius);
  sun.addColorStop(0, "#fff0b7");
  sun.addColorStop(0.5, "#ff98bc");
  sun.addColorStop(1, "#8b5cf6");
  ctx.fillStyle = sun;
  ctx.beginPath();
  ctx.arc(x, y + Math.sin(time * 0.0008) * 3, radius, 0, Math.PI * 2);
  ctx.fill();
}

function drawCloud(cloud, time) {
  cloud.x += cloud.speed * 0.016;
  if (cloud.x > width + 180 * cloud.scale) {
    cloud.x = -220 * cloud.scale;
  }

  const x = cloud.x + pointer.x * cloud.scale * 8;
  const y = cloud.y + Math.sin(time * 0.0005 + cloud.scale) * 5 + pointer.y * cloud.scale * 5;
  const s = cloud.scale;

  ctx.save();
  ctx.globalAlpha = cloud.alpha;
  ctx.fillStyle = "#fff8ff";
  ctx.beginPath();
  ctx.ellipse(x, y, 48 * s, 18 * s, 0, 0, Math.PI * 2);
  ctx.ellipse(x + 38 * s, y - 8 * s, 42 * s, 20 * s, 0, 0, Math.PI * 2);
  ctx.ellipse(x - 35 * s, y - 5 * s, 34 * s, 18 * s, 0, 0, Math.PI * 2);
  ctx.ellipse(x + 4 * s, y - 18 * s, 36 * s, 22 * s, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawMountainLayer(points, colorTop, colorBottom, offset, parallax) {
  const gradient = ctx.createLinearGradient(0, height * 0.42, 0, height);
  gradient.addColorStop(0, colorTop);
  gradient.addColorStop(1, colorBottom);

  ctx.save();
  ctx.translate(pointer.x * parallax, pointer.y * parallax * 0.5 + offset);
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.moveTo(-80, height);
  points.forEach(([x, y]) => ctx.lineTo(width * x, height * y));
  ctx.lineTo(width + 80, height);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawMountains() {
  drawMountainLayer(
    [[0, 0.62], [0.12, 0.49], [0.24, 0.65], [0.38, 0.43], [0.52, 0.66], [0.68, 0.48], [0.82, 0.64], [1, 0.46]],
    "#2c174d",
    "#130a27",
    0,
    -10
  );
  drawMountainLayer(
    [[0, 0.72], [0.1, 0.56], [0.23, 0.76], [0.36, 0.52], [0.49, 0.75], [0.63, 0.55], [0.77, 0.72], [0.9, 0.5], [1, 0.68]],
    "#1a102d",
    "#070611",
    18,
    -22
  );
}

function drawField() {
  const gradient = ctx.createLinearGradient(0, height * 0.7, 0, height);
  gradient.addColorStop(0, "rgba(19, 68, 59, 0.2)");
  gradient.addColorStop(0.45, "#123a36");
  gradient.addColorStop(1, "#061615");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, height * 0.66, width, height * 0.34);
}

function drawTulip(tulip, time) {
  const sway = Math.sin(time * 0.0013 * tulip.sway + tulip.phase) * 0.14 + tulip.lean;
  const x = tulip.x + pointer.x * tulip.depth * 18;
  const y = tulip.y + pointer.y * tulip.depth * 8;
  const stemHeight = tulip.height;
  const bloom = tulip.size;

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(sway);

  ctx.strokeStyle = "#2fa06e";
  ctx.lineWidth = Math.max(2, bloom * 0.12);
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(sway * 36, -stemHeight * 0.5, sway * 18, -stemHeight);
  ctx.stroke();

  ctx.fillStyle = "rgba(86, 202, 139, 0.78)";
  ctx.beginPath();
  ctx.ellipse(-bloom * 0.35, -stemHeight * 0.42, bloom * 0.46, bloom * 0.14, -0.7, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(bloom * 0.42, -stemHeight * 0.55, bloom * 0.5, bloom * 0.15, 0.55, 0, Math.PI * 2);
  ctx.fill();

  const bloomY = -stemHeight - bloom * 0.05;
  const petal = ctx.createLinearGradient(-bloom, bloomY - bloom, bloom, bloomY + bloom);
  petal.addColorStop(0, tulip.colors[0]);
  petal.addColorStop(1, tulip.colors[1]);
  ctx.fillStyle = petal;

  ctx.beginPath();
  ctx.moveTo(0, bloomY - bloom * 0.95);
  ctx.bezierCurveTo(bloom * 0.7, bloomY - bloom * 0.7, bloom * 0.78, bloomY + bloom * 0.2, 0, bloomY + bloom * 0.68);
  ctx.bezierCurveTo(-bloom * 0.78, bloomY + bloom * 0.2, -bloom * 0.7, bloomY - bloom * 0.7, 0, bloomY - bloom * 0.95);
  ctx.fill();

  ctx.globalAlpha = 0.72;
  ctx.fillStyle = tulip.colors[0];
  ctx.beginPath();
  ctx.moveTo(-bloom * 0.45, bloomY - bloom * 0.62);
  ctx.quadraticCurveTo(-bloom * 0.1, bloomY - bloom * 0.2, -bloom * 0.18, bloomY + bloom * 0.38);
  ctx.quadraticCurveTo(-bloom * 0.62, bloomY + bloom * 0.05, -bloom * 0.45, bloomY - bloom * 0.62);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(bloom * 0.45, bloomY - bloom * 0.62);
  ctx.quadraticCurveTo(bloom * 0.1, bloomY - bloom * 0.2, bloom * 0.18, bloomY + bloom * 0.38);
  ctx.quadraticCurveTo(bloom * 0.62, bloomY + bloom * 0.05, bloom * 0.45, bloomY - bloom * 0.62);
  ctx.fill();

  ctx.restore();
}

function drawFireflies(time) {
  fireflies.forEach((fly, index) => {
    const pulse = 0.4 + Math.sin(time * 0.002 * fly.speed + fly.phase) * 0.35;
    const x = fly.x + Math.sin(time * 0.0007 + fly.phase) * fly.drift + pointer.x * 16;
    const y = fly.y + Math.cos(time * 0.0008 + index) * fly.drift * 0.45 + pointer.y * 10;

    ctx.save();
    ctx.globalAlpha = Math.max(0.08, pulse);
    ctx.shadowColor = fly.color;
    ctx.shadowBlur = 16;
    ctx.fillStyle = fly.color;
    ctx.beginPath();
    ctx.arc(x, y, fly.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
}

function render(time = 0) {
  const delta = time - lastTime;
  lastTime = time;
  pointer.x += (pointer.tx - pointer.x) * Math.min(0.08, delta / 180);
  pointer.y += (pointer.ty - pointer.y) * Math.min(0.08, delta / 180);

  drawSky(time);
  drawSun(time);
  clouds.forEach((cloud) => drawCloud(cloud, time));
  drawMountains();
  drawField();
  tulips.forEach((tulip) => drawTulip(tulip, time));
  drawFireflies(time);

  requestAnimationFrame(render);
}

function setPointer(clientX, clientY) {
  pointer.tx = (clientX / width - 0.5) * 2;
  pointer.ty = (clientY / height - 0.5) * 2;
}

function showPoemLine() {
  poemLine.classList.remove("visible");

  window.setTimeout(() => {
    poemLine.textContent = poem[poemIndex];
    poemLine.classList.add("visible");
    poemIndex = (poemIndex + 1) % poem.length;
  }, 850);
}

async function showPoemSequence() {
  for (poemIndex = 0; poemIndex < poem.length; poemIndex += 1) {
    poemLine.classList.remove("visible");
    await sleep(850);
    poemLine.textContent = poem[poemIndex];
    poemLine.classList.add("visible");
    await sleep(4300);
  }

  poemLine.classList.remove("visible");
  poemCard.classList.add("finished");
  await sleep(950);
  finalCard.classList.add("visible");
}

function prepareLetters() {
  deliveryRows.forEach((rowData) => {
    const row = document.createElement("div");
    row.className = `letter-row ${rowData.className}`;

    rowData.words.forEach((wordText) => {
      const word = document.createElement("span");
      word.className = "word";

      [...wordText].forEach((char) => {
        const span = document.createElement("span");
        span.textContent = char;
        span.dataset.char = char;
        span.className = char === "\u{1F49C}" ? "neon-letter heart-symbol" : "neon-letter";
        word.appendChild(span);
      });

      row.appendChild(word);
    });

    letterLine.appendChild(row);
  });
}

async function startLetterDelivery() {
  const rows = [...document.querySelectorAll(".letter-row")];
  await sleep(300);
  neonBox.classList.add("intro-ready");
  await sleep(650);

  for (const row of rows) {
    row.classList.add("row-visible");
    await sleep(240);

    const letters = [...row.querySelectorAll(".neon-letter")];
    for (const letter of letters) {
      letter.classList.add("visible");
      await sleep(letter.classList.contains("heart-symbol") ? 300 : 90);
    }

    await sleep(row.classList.contains("title-row") ? 420 : 180);
  }

  await sleep(520);
  neonBox.classList.add("complete");
  await sleep(650);
  workerMessage.classList.add("visible");
  await sleep(3800);
  letterScene.classList.add("done");
  startPoem();
}

function startPoem() {
  showPoemSequence();
}

window.addEventListener("resize", resize);
window.addEventListener("mousemove", (event) => setPointer(event.clientX, event.clientY));
window.addEventListener("touchmove", (event) => {
  const touch = event.touches[0];
  if (touch) {
    setPointer(touch.clientX, touch.clientY);
  }
}, { passive: true });

resize();
prepareLetters();
startLetterDelivery();
requestAnimationFrame(render);
