// ------------------------------------------------------------------
// YOUR LINKS. Paste a real URL to make that item clickable.
// Anything still holding a [PLACEHOLDER] stays plain text on the page.
// Email: just the address (e.g. "me@example.com"), no "mailto:".
// CV: a full URL, or a file in this repo (e.g. "assets/Rayan-Dahdooly-CV.pdf").
// ------------------------------------------------------------------
const LINKS = {
  meno: "[APP_STORE_LINK]",
  agentsFarm: "[GITHUB_REPO_LINK]",
  codeforces: "https://codeforces.com/profile/RayanDahdooly",
  xtreme2025: "[RESULT_OR_CERTIFICATE_LINK]",
  xtreme2024: "[RESULT_OR_CERTIFICATE_LINK]",
  github: "https://github.com/RayanDahdooly",
  linkedin: "https://www.linkedin.com/in/rayan-dahdooly/",
  email: "rayan.dahdooly@gmail.com",
  cv: "[PLACEHOLDER]",
};

const isReady = (v) => typeof v === "string" && v.trim() !== "" && !/[[\]]/.test(v);

// What the small line under a contact item shows once it has a link.
const pretty = (key, v) => {
  if (key === "email") return v;
  if (key === "cv") return "Open PDF";
  return v.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
};

// Each <span class="lk" data-link="key"> becomes a real link once its URL is set.
document.querySelectorAll(".lk[data-link]").forEach((el) => {
  const key = el.dataset.link;
  const v = LINKS[key];
  if (!isReady(v)) return;
  const a = document.createElement("a");
  a.className = "lk is-link";
  a.textContent = el.textContent;
  if (key === "email") {
    a.href = "mailto:" + v;
  } else {
    a.href = v;
    a.target = "_blank";
    a.rel = "noopener";
  }
  el.replaceWith(a);
  const sub = document.querySelector(`[data-sub="${key}"]`);
  if (sub) sub.textContent = pretty(key, v);
});

// Real Codeforces activity, Sun 1 Jun 2025 to Sat 30 May 2026 (Amman time),
// one character per day, Sunday-first weeks like the Codeforces heatmap:
//   "." no submissions, "0" submitted but nothing accepted, "1".."9" problems solved.
// Pulled from codeforces.com/api/user.status?handle=RayanDahdooly on 10 Oct 2026.
const CF_START = new Date(2025, 5, 1);
const CF_DAYS =
  "21210.1111.12..............11.0.311.2211.1...11121.1" +
  "2.31.12313311413312112111112112211111111111221223121" +
  "3111111111123112111111111122121111123311221312314526" +
  "5413211221422212111211214211132121112222011012011130" +
  "2031013122012111133133244413403314112331121031122111" +
  "4233111312012131330211112211102000110122213154231043" +
  "11131502431233431101341101.123212101220411332.3.....";

(() => {
  const grid = document.getElementById("streak-grid");
  if (!grid) return;
  // Same shading as Codeforces: tried -> 1 solved -> 2 solved -> 3 or more
  const level = (c) => (c === "." ? 0 : c === "0" ? 1 : c === "1" ? 2 : c === "2" ? 3 : 4);
  const fmt = new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" });
  const frag = document.createDocumentFragment();
  let lastMonth = -1;
  for (let i = 0; i < CF_DAYS.length; i++) {
    const day = new Date(CF_START);
    day.setDate(day.getDate() + i);
    const week = Math.floor(i / 7);
    // Month name above the first week that starts in a new month
    if (i % 7 === 0 && day.getMonth() !== lastMonth) {
      lastMonth = day.getMonth();
      const m = document.createElement("span");
      m.className = "streak-month";
      m.textContent = day.toLocaleString("en", { month: "short" });
      m.style.gridColumn = `${week + 1} / span 4`;
      frag.appendChild(m);
    }
    const c = CF_DAYS[i];
    const cell = document.createElement("i");
    cell.className = "l" + level(c);
    cell.style.gridColumn = week + 1;
    cell.style.gridRow = (i % 7) + 2;
    const what = c === "." ? "no submissions" : c === "0" ? "practised, nothing accepted"
      : `${c} problem${c === "1" ? "" : "s"} solved`;
    cell.title = `${fmt.format(day)}: ${what}`;
    frag.appendChild(cell);
  }
  grid.appendChild(frag);
  // On a phone only part of the year fits: start at the recent months, lined up
  // so the first visible column is the start of a month (no half-cut label).
  const win = document.getElementById("streak-window");
  const maxScroll = win.scrollWidth - win.clientWidth;
  if (maxScroll > 0) {
    const months = [...grid.querySelectorAll(".streak-month")];
    const fit = months.find((m) => m.offsetLeft - grid.offsetLeft >= maxScroll);
    win.scrollLeft = fit ? fit.offsetLeft - grid.offsetLeft - 1 : maxScroll;
  }
})();

// Highlight the tab for the page currently on screen.
const tabLinks = new Map(
  [...document.querySelectorAll(".tabs a")].map((a) => [a.getAttribute("href").slice(1), a])
);
const markTab = (id) => {
  tabLinks.forEach((a) => a.removeAttribute("aria-current"));
  const a = tabLinks.get(id);
  if (!a) return;
  a.setAttribute("aria-current", "true");
  // On a phone the tab strip scrolls sideways; keep the active tab in view
  // without touching the page's own scroll.
  const strip = a.closest(".tabs");
  if (strip.scrollWidth > strip.clientWidth) {
    strip.scrollTo({ left: a.getBoundingClientRect().left - strip.getBoundingClientRect().left + strip.scrollLeft - 24, behavior: "smooth" });
  }
};
const isBookMode = () => document.documentElement.classList.contains("book-mode");

(() => {
  const io = new IntersectionObserver(
    (entries) => {
      if (isBookMode()) return; // the notebook marks its own tab
      entries.forEach((e) => { if (e.isIntersecting) markTab(e.target.id); });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  document.querySelectorAll("main .page").forEach((s) => io.observe(s));
})();

// Laptop size: the site becomes one notebook showing one page at a time.
// Pages flip on their top edge the way BookView flips a week: swing to
// edge-on (0.22s ease-in), swap, swing back flat from the other side (0.22s ease-out).
(() => {
  const wide = matchMedia("(min-width: 900px) and (min-height: 600px)");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  const root = document.documentElement;
  const book = document.querySelector(".book");
  const pages = [...book.querySelectorAll(":scope > .page")];
  const prevBtn = document.getElementById("flip-prev");
  const nextBtn = document.getElementById("flip-next");
  const label = document.getElementById("flip-label");
  const topbar = document.querySelector(".topbar");
  let cur = 0;
  let on = false;
  let busy = false;

  const atTop = (p) => p.scrollTop <= 1;
  const atBottom = (p) => p.scrollTop + p.clientHeight >= p.scrollHeight - 2;
  const indexOf = (id) => pages.findIndex((p) => p.id === id);
  const updateMore = () => book.classList.toggle("has-more", on && !atBottom(pages[cur]));

  const paint = () => {
    pages.forEach((p, i) => {
      p.classList.toggle("is-current", i === cur);
      p.inert = on && i !== cur;
    });
    label.textContent = `Page ${cur + 1}. / ${pages.length}`;
    prevBtn.disabled = cur === 0;
    nextBtn.disabled = cur === pages.length - 1;
    markTab(pages[cur].id);
    updateMore();
  };

  const swing = (el, from, to, easing) =>
    el.animate(
      [
        { transform: `perspective(4200px) rotateX(${from}deg)`, filter: `brightness(${from ? 0.86 : 1})` },
        { transform: `perspective(4200px) rotateX(${to}deg)`, filter: `brightness(${to ? 0.86 : 1})` },
      ],
      { duration: 220, easing }
    ).finished;

  async function go(i) {
    if (!on || busy || i === cur || i < 0 || i >= pages.length) return;
    const from = pages[cur];
    const to = pages[i];
    const edge = i > cur ? 90 : -90;
    history.replaceState(null, "", "#" + to.id);
    to.scrollTop = 0;
    if (reduce.matches) { cur = i; paint(); return; }
    busy = true;
    book.classList.add("is-flipping");
    try {
      await swing(from, 0, edge, "ease-in");
      cur = i;
      paint();
      await swing(to, -edge, 0, "ease-out");
    } finally {
      book.classList.remove("is-flipping");
      busy = false;
      updateMore();
    }
  }
  const next = () => go(cur + 1);
  const prev = () => go(cur - 1);

  prevBtn.addEventListener("click", prev);
  nextBtn.addEventListener("click", next);

  // Top tabs, the name, and the skip link jump straight to their page.
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const i = indexOf(a.getAttribute("href").slice(1));
      if (!on || i < 0) return;
      e.preventDefault();
      go(i);
    });
  });

  // Keyboard: left/right always turn the page; up/down (and Page Up/Down)
  // scroll a long page first and turn it once you reach the end.
  document.addEventListener("keydown", (e) => {
    if (!on || e.altKey || e.ctrlKey || e.metaKey) return;
    if (e.target instanceof Element && e.target.closest("input, textarea, select")) return;
    const p = pages[cur];
    const down = e.key === "ArrowDown" || e.key === "PageDown";
    const up = e.key === "ArrowUp" || e.key === "PageUp";
    if (e.key === "ArrowRight") { e.preventDefault(); next(); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
    else if (down || up) {
      e.preventDefault();
      const step = e.key.startsWith("Page") ? p.clientHeight * 0.85 : 80;
      if (down) atBottom(p) ? next() : p.scrollBy({ top: step, behavior: "smooth" });
      else atTop(p) ? prev() : p.scrollBy({ top: -step, behavior: "smooth" });
    }
  });

  // Trackpad (two-finger swipe) and mouse wheel. A gesture only turns the page
  // if it STARTS at the end of the page, so the momentum of scrolling to the
  // bottom never flips by accident; after a flip, the rest of that gesture is ignored.
  let lastWheel = 0, acc = 0, gestureAtEdge = false, spent = false;
  book.addEventListener("wheel", (e) => {
    if (!on || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
    const p = pages[cur];
    const dir = e.deltaY > 0 ? 1 : -1;
    const atEdge = dir > 0 ? atBottom(p) : atTop(p);
    const now = performance.now();
    if (now - lastWheel > 260) { acc = 0; spent = false; gestureAtEdge = atEdge; }
    lastWheel = now;
    if (!atEdge) return; // let the page scroll
    e.preventDefault();
    if (busy || spent || !gestureAtEdge) return;
    acc += e.deltaY;
    if (Math.abs(acc) > 50) { spent = true; dir > 0 ? next() : prev(); }
  }, { passive: false });

  // Touch screens: swipe up for the next page, down for the previous one
  // (sideways works too). Same rule: a long page scrolls first.
  let t0 = null;
  book.addEventListener("touchstart", (e) => {
    if (!on || e.touches.length !== 1) return;
    const p = pages[cur];
    t0 = {
      x: e.touches[0].clientX, y: e.touches[0].clientY,
      top: atTop(p), bottom: atBottom(p),
      inStrip: !!e.target.closest(".streak-window"),
    };
  }, { passive: true });
  book.addEventListener("touchend", (e) => {
    if (!on || !t0) return;
    const dx = e.changedTouches[0].clientX - t0.x;
    const dy = e.changedTouches[0].clientY - t0.y;
    if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 50) {
      if (dy < 0 && t0.bottom) next();
      if (dy > 0 && t0.top) prev();
    } else if (Math.abs(dx) > 60 && !t0.inStrip) {
      dx < 0 ? next() : prev();
    }
    t0 = null;
  }, { passive: true });

  // Fit each sheet to the screen: if a page's content is taller than the
  // notebook, shrink just that content (never below 70%) so nothing hides
  // under the bar. Titles keep their size, so flipping still looks even.
  const fit = () => {
    pages.forEach((p) => {
      const body = p.querySelector(".page-body");
      if (!body) return;
      body.style.zoom = "";
      if (!on) return;
      for (let k = 0; k < 4; k++) {
        const over = p.scrollHeight - p.clientHeight;
        if (over <= 1) break;
        const h = body.getBoundingClientRect().height;
        const z = parseFloat(body.style.zoom) || 1;
        const next = Math.max(0.7, (z * (h - over)) / h);
        if (next >= z - 0.004) break;
        body.style.zoom = next.toFixed(3);
      }
    });
    updateMore();
  };
  let fitTimer;
  const refit = () => { clearTimeout(fitTimer); fitTimer = setTimeout(fit, 120); };

  pages.forEach((p) => p.addEventListener("scroll", updateMore, { passive: true }));
  window.addEventListener("hashchange", () => {
    const i = indexOf(location.hash.slice(1));
    if (on && i >= 0) go(i);
  });

  const setMode = () => {
    const want = wide.matches;
    if (want === on) { updateMore(); return; }
    if (want) {
      // Open on the page in the address bar, or the one that was on screen.
      const fromHash = indexOf(location.hash.slice(1));
      const onScreen = pages.findIndex((p) => p.getBoundingClientRect().bottom > window.innerHeight * 0.4);
      cur = fromHash >= 0 ? fromHash : Math.max(0, onScreen);
      on = true;
      root.style.setProperty("--topbar-h", topbar.offsetHeight + "px");
      root.classList.add("book-mode");
      window.scrollTo(0, 0);
      paint();
    } else {
      on = false;
      root.classList.remove("book-mode");
      pages.forEach((p) => { p.inert = false; p.classList.remove("is-current"); });
      book.classList.remove("has-more");
      pages[cur].scrollIntoView();
    }
  };
  wide.addEventListener("change", () => { setMode(); fit(); });
  window.addEventListener("resize", refit);
  setMode();
  fit();
  // Handwriting fonts change line lengths once they arrive; fit again then.
  if (document.fonts) document.fonts.ready.then(fit);
})();

document.getElementById("year").textContent = new Date().getFullYear();
