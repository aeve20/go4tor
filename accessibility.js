/*!
 * go4tor — תפריט נגישות
 * מותאם לתקן ישראלי ת"י 5568 (WCAG 2.0 AA)
 * קובץ עצמאי: מזריק כפתור, תפריט וסגנונות. אין תלות בספריות חיצוניות.
 * גרסה 2 — הפאנל נסתר לחלוטין כברירת מחדל; נפתח רק בלחיצה על הסמל.
 * שימוש: הוסף לכל עמוד לפני סגירת </body>:
 *   <script src="accessibility.js" defer></script>
 */
(function () {
  "use strict";

  // מונע טעינה כפולה אם הקובץ נכלל פעמיים
  if (window.__go4torA11yLoaded) return;
  window.__go4torA11yLoaded = true;

  var STORAGE_KEY = "go4tor_a11y";

  // ברירת מחדל של ההגדרות
  var defaults = {
    fontScale: 1,      // 1 = 100%, כל צעד 10%
    contrast: "",      // "", "dark", "light", "invert"
    grayscale: false,
    links: false,      // הדגשת קישורים
    readable: false,   // גופן קריא
    spacing: false,    // ריווח שורות מוגדל
    animations: false, // עצירת הנפשות
    cursor: false      // סמן גדול
  };

  var state = loadState();

  function loadState() {
    try {
      var saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (saved && typeof saved === "object") {
        return Object.assign({}, defaults, saved);
      }
    } catch (e) {}
    return Object.assign({}, defaults);
  }

  function saveState() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) {}
  }

  /* ---------- סגנונות ---------- */
  var css = [
    ":root{--a11y-navy:#0f2a47;--a11y-orange:#ff7a1a;--a11y-teal:#17b3b3;}",

    /* כפתור פתיחה קבוע */
    "#a11y-toggle{position:fixed;bottom:20px;inset-inline-start:20px;z-index:2147483000;",
    "width:56px;height:56px;border-radius:50%;border:none;cursor:pointer;",
    "background:var(--a11y-navy);color:#fff;box-shadow:0 4px 16px rgba(0,0,0,.28);",
    "display:flex;align-items:center;justify-content:center;transition:transform .15s ease,background .2s ease;}",
    "#a11y-toggle:hover{background:var(--a11y-orange);transform:scale(1.06);}",
    "#a11y-toggle:focus-visible{outline:3px solid var(--a11y-teal);outline-offset:3px;}",
    "#a11y-toggle svg{width:32px;height:32px;fill:currentColor;}",

    /* שכבת רקע */
    "#a11y-overlay{position:fixed;inset:0;background:rgba(0,0,0,.35);z-index:2147483001;",
    "opacity:0;visibility:hidden;transition:opacity .2s ease,visibility .2s ease;}",
    "#a11y-overlay.open{opacity:1;visibility:visible;}",

    /* הפאנל */
    "#a11y-panel{position:fixed;top:0;inset-inline-start:0;height:100%;width:330px;max-width:88vw;",
    "background:#fff;color:var(--a11y-navy);z-index:2147483002;box-shadow:2px 0 24px rgba(0,0,0,.25);",
    /* נסתר לחלוטין כברירת מחדל — לא מוזז בלבד אלא ממש לא נוכח, כדי שלא יסתיר את המסך גם אם ה-JS מתעכב */
    "transform:translateX(-105%);visibility:hidden;pointer-events:none;",
    "transition:transform .25s ease,visibility .25s ease;overflow-y:auto;direction:rtl;",
    "font-family:'Rubik','Segoe UI',Arial,sans-serif;font-size:16px;line-height:1.5;}",
    "#a11y-panel.open{transform:translateX(0);visibility:visible;pointer-events:auto;}",
    "#a11y-panel *{box-sizing:border-box;}",

    "#a11y-head{background:var(--a11y-navy);color:#fff;padding:18px 20px;display:flex;",
    "align-items:center;justify-content:space-between;position:sticky;top:0;z-index:1;}",
    "#a11y-head h2{margin:0;font-size:19px;font-weight:700;}",
    "#a11y-close{background:none;border:none;color:#fff;font-size:26px;line-height:1;",
    "cursor:pointer;padding:4px 8px;border-radius:6px;}",
    "#a11y-close:hover{background:rgba(255,255,255,.15);}",
    "#a11y-close:focus-visible{outline:3px solid var(--a11y-teal);outline-offset:2px;}",

    "#a11y-panel .a11y-body{padding:16px 18px 24px;}",
    "#a11y-panel .a11y-group{margin-bottom:20px;}",
    "#a11y-panel .a11y-label{font-weight:700;font-size:14px;color:#5a6b7d;margin-bottom:8px;}",

    /* כפתורי פעולה */
    ".a11y-btn{width:100%;text-align:start;padding:12px 14px;margin-bottom:8px;border-radius:10px;",
    "border:2px solid #e3e8ee;background:#f7f9fb;color:var(--a11y-navy);font-size:15px;font-weight:600;",
    "cursor:pointer;display:flex;align-items:center;gap:10px;transition:all .15s ease;}",
    ".a11y-btn:hover{border-color:var(--a11y-orange);background:#fff;}",
    ".a11y-btn:focus-visible{outline:3px solid var(--a11y-teal);outline-offset:2px;}",
    ".a11y-btn.active{border-color:var(--a11y-orange);background:var(--a11y-orange);color:#fff;}",
    ".a11y-btn .ico{font-size:20px;line-height:1;flex-shrink:0;}",

    /* בקרת גופן */
    ".a11y-font-row{display:flex;align-items:center;gap:8px;}",
    ".a11y-font-row .a11y-btn{margin:0;justify-content:center;flex:1;font-size:20px;padding:12px 0;}",
    ".a11y-font-val{min-width:56px;text-align:center;font-weight:700;font-size:15px;}",

    /* איפוס */
    "#a11y-reset{width:100%;padding:12px;border-radius:10px;border:none;background:#e3e8ee;",
    "color:var(--a11y-navy);font-weight:700;font-size:15px;cursor:pointer;margin-top:4px;}",
    "#a11y-reset:hover{background:#d3dae2;}",
    "#a11y-reset:focus-visible{outline:3px solid var(--a11y-teal);outline-offset:2px;}",

    /* קישור הצהרת נגישות */
    "#a11y-statement{display:block;text-align:center;margin-top:18px;padding-top:16px;",
    "border-top:1px solid #e3e8ee;color:var(--a11y-navy);font-size:14px;font-weight:600;text-decoration:underline;}",

    /* ---- כיתות שמופעלות על ה-<html> ---- */
    "html.a11y-grayscale{filter:grayscale(100%);}",
    "html.a11y-invert{filter:invert(100%) hue-rotate(180deg);}",
    "html.a11y-invert img,html.a11y-invert video,html.a11y-invert #a11y-toggle,html.a11y-invert #a11y-panel{filter:invert(100%) hue-rotate(180deg);}",

    "html.a11y-contrast-dark body,html.a11y-contrast-dark body *:not(#a11y-panel):not(#a11y-panel *):not(#a11y-toggle):not(#a11y-toggle *)",
    "{background-color:#000 !important;color:#ff0 !important;border-color:#ff0 !important;}",
    "html.a11y-contrast-dark a:not(#a11y-panel a){color:#0ff !important;}",

    "html.a11y-contrast-light body,html.a11y-contrast-light body *:not(#a11y-panel):not(#a11y-panel *):not(#a11y-toggle):not(#a11y-toggle *)",
    "{background-color:#fff !important;color:#000 !important;border-color:#000 !important;}",
    "html.a11y-contrast-light a:not(#a11y-panel a){color:#00e !important;}",

    "html.a11y-links a:not(#a11y-panel a):not(#a11y-toggle){text-decoration:underline !important;",
    "font-weight:700 !important;outline:2px dashed var(--a11y-orange);outline-offset:2px;}",

    "html.a11y-readable body,html.a11y-readable body *:not(.ico):not([class*='fa-']){",
    "font-family:Arial,'Segoe UI',sans-serif !important;letter-spacing:.5px !important;}",

    "html.a11y-spacing body,html.a11y-spacing body *:not(#a11y-panel):not(#a11y-panel *){",
    "line-height:2 !important;letter-spacing:1px !important;word-spacing:3px !important;}",

    "html.a11y-noanim *,html.a11y-noanim *::before,html.a11y-noanim *::after{",
    "animation:none !important;transition:none !important;scroll-behavior:auto !important;}",

    "html.a11y-bigcursor,html.a11y-bigcursor *{cursor:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Cpath d='M6 2l30 18-14 3 8 16-6 3-8-16-10 10z' fill='black' stroke='white' stroke-width='2'/%3E%3C/svg%3E\") 4 2,auto !important;}",

    /* מובייל */
    "@media(max-width:480px){#a11y-toggle{width:50px;height:50px;bottom:16px;inset-inline-start:16px;}",
    "#a11y-toggle svg{width:28px;height:28px;}}"
  ].join("");

  var styleEl = document.createElement("style");
  styleEl.id = "a11y-styles";
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  /* ---------- אייקון נגישות (ISA) ---------- */
  var a11yIcon =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="3.5" r="2"/>' +
    '<path d="M20 6.5c-2.6.9-5.2 1.4-8 1.4S6.6 7.4 4 6.5L3.4 8.4c1.9.7 3.9 1.1 5.9 1.3l-.7 4.2-1.6 6.4 2 .5 1.9-6.6h2.2l1.9 6.6 2-.5-1.6-6.4-.7-4.2c2-.2 4-.6 5.9-1.3L20 6.5z"/></svg>';

  /* ---------- כפתור פתיחה ---------- */
  var toggle = document.createElement("button");
  toggle.id = "a11y-toggle";
  toggle.setAttribute("aria-label", "פתיחת תפריט נגישות");
  toggle.setAttribute("aria-haspopup", "dialog");
  toggle.setAttribute("aria-expanded", "false");
  toggle.innerHTML = a11yIcon;

  /* ---------- שכבת רקע ---------- */
  var overlay = document.createElement("div");
  overlay.id = "a11y-overlay";

  /* ---------- הפאנל ---------- */
  var panel = document.createElement("div");
  panel.id = "a11y-panel";
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-modal", "true");
  panel.setAttribute("aria-label", "תפריט נגישות");

  panel.innerHTML =
    '<div id="a11y-head"><h2>תפריט נגישות</h2>' +
    '<button id="a11y-close" aria-label="סגירת תפריט נגישות">&times;</button></div>' +
    '<div class="a11y-body">' +

    '<div class="a11y-group">' +
    '<div class="a11y-label">גודל טקסט</div>' +
    '<div class="a11y-font-row">' +
    '<button class="a11y-btn" data-act="font-dec" aria-label="הקטנת גופן">A−</button>' +
    '<span class="a11y-font-val" id="a11y-font-val" aria-live="polite">100%</span>' +
    '<button class="a11y-btn" data-act="font-inc" aria-label="הגדלת גופן">A+</button>' +
    '</div></div>' +

    '<div class="a11y-group">' +
    '<div class="a11y-label">ניגודיות וצבע</div>' +
    '<button class="a11y-btn" data-toggle="contrast-dark"><span class="ico">◐</span> ניגודיות כהה</button>' +
    '<button class="a11y-btn" data-toggle="contrast-light"><span class="ico">◑</span> ניגודיות בהירה</button>' +
    '<button class="a11y-btn" data-toggle="invert"><span class="ico">⧉</span> היפוך צבעים</button>' +
    '<button class="a11y-btn" data-toggle="grayscale"><span class="ico">▨</span> גווני אפור</button>' +
    '</div>' +

    '<div class="a11y-group">' +
    '<div class="a11y-label">קריאוּת</div>' +
    '<button class="a11y-btn" data-toggle="links"><span class="ico">🔗</span> הדגשת קישורים</button>' +
    '<button class="a11y-btn" data-toggle="readable"><span class="ico">🅰</span> גופן קריא</button>' +
    '<button class="a11y-btn" data-toggle="spacing"><span class="ico">↕</span> ריווח שורות</button>' +
    '</div>' +

    '<div class="a11y-group">' +
    '<div class="a11y-label">ניווט</div>' +
    '<button class="a11y-btn" data-toggle="animations"><span class="ico">⏸</span> עצירת הנפשות</button>' +
    '<button class="a11y-btn" data-toggle="cursor"><span class="ico">➤</span> סמן גדול</button>' +
    '</div>' +

    '<button id="a11y-reset">↺ איפוס הגדרות</button>' +
    '<a id="a11y-statement" href="accessibility.html">הצהרת נגישות</a>' +
    '</div>';

  document.body.appendChild(toggle);
  document.body.appendChild(overlay);
  document.body.appendChild(panel);

  /* ---------- החלת מצב על הדף ---------- */
  var root = document.documentElement;

  function apply() {
    // גופן
    root.style.setProperty("font-size", (state.fontScale * 100) + "%");
    var valEl = document.getElementById("a11y-font-val");
    if (valEl) valEl.textContent = Math.round(state.fontScale * 100) + "%";

    // ניגודיות (בלעדית)
    root.classList.remove("a11y-contrast-dark", "a11y-contrast-light", "a11y-invert");
    if (state.contrast === "dark") root.classList.add("a11y-contrast-dark");
    else if (state.contrast === "light") root.classList.add("a11y-contrast-light");
    else if (state.contrast === "invert") root.classList.add("a11y-invert");

    toggleClass("a11y-grayscale", state.grayscale);
    toggleClass("a11y-links", state.links);
    toggleClass("a11y-readable", state.readable);
    toggleClass("a11y-spacing", state.spacing);
    toggleClass("a11y-noanim", state.animations);
    toggleClass("a11y-bigcursor", state.cursor);

    // סימון כפתורים פעילים
    setActive("contrast-dark", state.contrast === "dark");
    setActive("contrast-light", state.contrast === "light");
    setActive("invert", state.contrast === "invert");
    setActive("grayscale", state.grayscale);
    setActive("links", state.links);
    setActive("readable", state.readable);
    setActive("spacing", state.spacing);
    setActive("animations", state.animations);
    setActive("cursor", state.cursor);
  }

  function toggleClass(cls, on) {
    root.classList.toggle(cls, !!on);
  }

  function setActive(key, on) {
    var btn = panel.querySelector('[data-toggle="' + key + '"]');
    if (btn) {
      btn.classList.toggle("active", !!on);
      btn.setAttribute("aria-pressed", on ? "true" : "false");
    }
  }

  /* ---------- אירועים ---------- */
  panel.addEventListener("click", function (e) {
    var actBtn = e.target.closest("[data-act]");
    var togBtn = e.target.closest("[data-toggle]");

    if (actBtn) {
      var act = actBtn.getAttribute("data-act");
      if (act === "font-inc") state.fontScale = Math.min(1.6, state.fontScale + 0.1);
      if (act === "font-dec") state.fontScale = Math.max(0.8, state.fontScale - 0.1);
    } else if (togBtn) {
      var key = togBtn.getAttribute("data-toggle");
      if (key === "contrast-dark") state.contrast = state.contrast === "dark" ? "" : "dark";
      else if (key === "contrast-light") state.contrast = state.contrast === "light" ? "" : "light";
      else if (key === "invert") state.contrast = state.contrast === "invert" ? "" : "invert";
      else if (key === "grayscale") state.grayscale = !state.grayscale;
      else if (key === "links") state.links = !state.links;
      else if (key === "readable") state.readable = !state.readable;
      else if (key === "spacing") state.spacing = !state.spacing;
      else if (key === "animations") state.animations = !state.animations;
      else if (key === "cursor") state.cursor = !state.cursor;
    } else {
      return;
    }
    apply();
    saveState();
  });

  document.getElementById("a11y-reset").addEventListener("click", function () {
    state = Object.assign({}, defaults);
    apply();
    saveState();
  });

  /* ---------- פתיחה / סגירה ---------- */
  var lastFocused = null;

  function openPanel() {
    lastFocused = document.activeElement;
    overlay.classList.add("open");
    panel.classList.add("open");
    toggle.setAttribute("aria-expanded", "true");
    document.getElementById("a11y-close").focus();
    document.addEventListener("keydown", onKeydown);
  }

  function closePanel() {
    overlay.classList.remove("open");
    panel.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    document.removeEventListener("keydown", onKeydown);
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }

  function onKeydown(e) {
    if (e.key === "Escape") { closePanel(); return; }
    // כליאת פוקוס בתוך הפאנל
    if (e.key === "Tab") {
      var f = panel.querySelectorAll("button, a[href]");
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }

  toggle.addEventListener("click", openPanel);
  overlay.addEventListener("click", closePanel);
  document.getElementById("a11y-close").addEventListener("click", closePanel);

  // קיצור מקלדת: Alt+Shift+A לפתיחה
  document.addEventListener("keydown", function (e) {
    if (e.altKey && e.shiftKey && (e.key === "A" || e.key === "a")) {
      e.preventDefault();
      panel.classList.contains("open") ? closePanel() : openPanel();
    }
  });

  // החלת ההגדרות השמורות בטעינה
  apply();
})();
