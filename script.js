// ---------- Hero: letters hop and wiggle near the cursor ----------
const name = document.getElementById("name");
const text = name.textContent;
name.textContent = "";
const colors = ["var(--pink)", "var(--sky)", "var(--mint)", "var(--sun)"];
const letters = [...text].map((ch, i) => {
  const s = document.createElement("span");
  s.textContent = ch === " " ? "\u00A0" : ch;
  s.style.color = colors[i % colors.length];
  s.setAttribute("aria-hidden", "true");
  name.appendChild(s);
  return s;
});
const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
function hop(x, y) {
  letters.forEach((s, i) => {
    const r = s.getBoundingClientRect();
    const d = Math.hypot(x - (r.left + r.width / 2), y - (r.top + r.height / 2));
    const k = Math.max(0, 1 - d / 160);
    const dir = i % 2 ? 1 : -1;
    s.style.transform = `translateY(${-32 * k}px) rotate(${dir * 14 * k}deg) scale(${1 + 0.15 * k})`;
  });
}
if (!still) {
  window.addEventListener("pointermove", e => hop(e.clientX, e.clientY));
  name.addEventListener("pointerleave", () => letters.forEach(s => s.style.transform = ""));
}

// ---------- Filters ----------
const tiles = [...document.querySelectorAll(".tile")];
document.querySelectorAll(".chip").forEach(chip => {
  chip.addEventListener("click", () => {
    document.querySelectorAll(".chip").forEach(c => c.classList.toggle("on", c === chip));
    tiles.forEach(t => t.hidden = chip.dataset.f !== "all" && t.dataset.cat !== chip.dataset.f);
  });
});

// ---------- Thumbnails ----------
tiles.forEach(t => {
  if (t.dataset.thumb) {
    t.style.backgroundImage = `url("${t.dataset.thumb}"), linear-gradient(135deg, var(--a), var(--b))`;
    t.style.backgroundSize = "contain, cover";
    t.style.backgroundRepeat = "no-repeat, no-repeat";
    t.style.backgroundPosition = "center, center";
  }
});

// ---------- Lightbox ----------
const box = document.getElementById("box");
const stage = document.getElementById("stage");
const visit = document.getElementById("bl");

tiles.forEach(t => t.addEventListener("click", () => {
  if (t.tagName === "A") return; // link tiles open their own page

  const d = t.dataset;
  stage.style.setProperty("--a", getComputedStyle(t).getPropertyValue("--a"));
  stage.style.setProperty("--b", getComputedStyle(t).getPropertyValue("--b"));
  stage.innerHTML = "";
  let m;
  if (d.image) {
    m = document.createElement("img");
    m.src = d.image;
    m.alt = d.title;
    m.onerror = () => { stage.textContent = "Image not found: " + d.image; };
  } else if (d.video) {
    m = document.createElement("video");
    m.src = d.video;
    m.controls = true;
  } else if (d.embed) {
    m = document.createElement("iframe");
    m.src = d.embed;
    m.allowFullscreen = true;
    m.title = d.title;
  } else {
    m = document.createElement("p");
    m.textContent = "Add your media to this project (see the comment in index.html).";
  }
  stage.appendChild(m);
  document.getElementById("bt").textContent = d.title;
  document.getElementById("bd").textContent = d.desc;
  document.getElementById("bm").textContent = "Made with: " + d.tools;

  // "Visit website" button (only shown when the tile has data-link)
  if (visit) {
    if (d.link) { visit.href = d.link; visit.hidden = false; }
    else { visit.hidden = true; }
  }

  box.showModal();
}));

function closeBox() {
  const v = stage.querySelector("video");
  if (v) v.pause();
  stage.innerHTML = "";
  box.close();
}
document.getElementById("close").addEventListener("click", closeBox);
box.addEventListener("click", e => { if (e.target === box) closeBox(); });
box.addEventListener("cancel", () => { stage.innerHTML = ""; });

// ---------- Theme ----------
const root = document.documentElement, btn = document.getElementById("theme");
function setTheme(t) { root.setAttribute("data-theme", t); btn.textContent = t === "dark" ? "Light" : "Dark"; }
setTheme(matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
btn.addEventListener("click", () => setTheme(root.dataset.theme === "dark" ? "light" : "dark"));
document.getElementById("year").textContent = new Date().getFullYear();