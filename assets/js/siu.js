/* Study Abroad By SiU — interactions */
(function () {
  "use strict";
  var WA = "923019510101";
  document.documentElement.classList.remove("no-js");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.dataLayer = window.dataLayer || [];
  function track(ev, d) { window.dataLayer.push(Object.assign({ event: ev }, d || {})); if (typeof gtag === "function") gtag("event", ev, d || {}); }

  var top = document.querySelector(".top");
  function onScroll() { if (top) top.classList.toggle("scrolled", scrollY > 10); journey(); }
  addEventListener("scroll", onScroll, { passive: true });

  var burger = document.querySelector(".burger");
  if (burger) {
    burger.addEventListener("click", function () { var o = document.body.classList.toggle("nav-open"); burger.setAttribute("aria-expanded", o); });
    document.querySelectorAll(".menu a").forEach(function (a) { a.addEventListener("click", function () { document.body.classList.remove("nav-open"); }); });
  }

  /* reveal */
  var rv = document.querySelectorAll(".rv");
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }); }, { threshold: .15, rootMargin: "0px 0px -40px 0px" });
    rv.forEach(function (el) { io.observe(el); });
  } else rv.forEach(function (el) { el.classList.add("in"); });

  /* boarding pass rotation */
  var pass = document.querySelector(".pass");
  if (pass && window.SIU_DEST) {
    var D = window.SIU_DEST, i = 0, pager = document.querySelector(".dots-pager"), timer;
    var f = function (k) { return pass.querySelector('[data-k="' + k + '"]'); };
    D.forEach(function (_, n) {
      var b = document.createElement("button"); b.type = "button"; b.setAttribute("aria-label", "Show " + D[n].name);
      b.addEventListener("click", function () { show(n); restart(); }); pager.appendChild(b);
    });
    function paint(n) {
      var d = D[n];
      f("code").textContent = d.code; f("city").textContent = d.city + ", " + d.name;
      f("intake").textContent = d.intake; f("perk").textContent = d.perk; f("flag").textContent = d.flag;
      f("status").textContent = d.status; pass.setAttribute("href", d.href);
      pager.querySelectorAll("button").forEach(function (b, k) { b.classList.toggle("on", k === n); });
    }
    function show(n) {
      if (reduce) { i = n; paint(n); return; }
      pass.classList.add("flip");
      setTimeout(function () { i = n; paint(n); pass.classList.remove("flip"); }, 360);
    }
    function restart() { clearInterval(timer); if (!reduce) timer = setInterval(function () { show((i + 1) % D.length); }, 3600); }
    paint(0); restart();
  }

  /* split-flap text */
  var CH = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  function flapIn(el) {
    var target = el.getAttribute("data-flap"), cells = [];
    el.innerHTML = "";
    for (var k = 0; k < target.length; k++) { var c = document.createElement("i"); c.textContent = target[k] === " " ? " " : CH[Math.floor(Math.random() * CH.length)]; el.appendChild(c); cells.push(c); }
    if (reduce) { cells.forEach(function (c, k) { c.textContent = target[k] === " " ? " " : target[k]; }); return; }
    cells.forEach(function (c, k) {
      var n = 0, max = 6 + k * 2;
      var t = setInterval(function () {
        if (++n >= max) { clearInterval(t); c.textContent = target[k] === " " ? " " : target[k]; }
        else c.textContent = CH[Math.floor(Math.random() * CH.length)];
      }, 55);
    });
  }
  var flaps = document.querySelectorAll("[data-flap]");
  if ("IntersectionObserver" in window) {
    var fo = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { flapIn(e.target); fo.unobserve(e.target); } }); }, { threshold: .6 });
    flaps.forEach(function (el) { fo.observe(el); });
  } else flaps.forEach(flapIn);

  /* journey progress */
  var jt = document.querySelector(".jtrack");
  function journey() {
    if (!jt) return;
    var r = jt.getBoundingClientRect(), vh = innerHeight;
    var p = Math.min(1, Math.max(0, (vh * .85 - r.top) / (r.height + vh * .35)));
    jt.style.setProperty("--p", p.toFixed(3));
    jt.querySelectorAll(".jstep").forEach(function (s, k, all) { s.classList.toggle("on", p >= (k + .2) / all.length); });
  }
  journey();

  /* tracking */
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a"); if (!a) return;
    var h = a.getAttribute("href") || "";
    if (h.indexOf("wa.me") > -1) track("whatsapp_click", { location: a.getAttribute("data-loc") || "link", page: location.pathname });
    if (h.indexOf("tel:") === 0) track("phone_click", { page: location.pathname });
  });

  /* lead form */
  document.querySelectorAll("form.lead").forEach(function (form) {
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var f = new FormData(form), err = form.querySelector(".err");
      var name = (f.get("name") || "").toString().trim(), phone = (f.get("phone") || "").toString().trim();
      if (name.length < 2) { err.textContent = "Please enter your full name."; form.querySelector('[name="name"]').focus(); return; }
      if (!/^[+\d][\d\s-]{9,15}$/.test(phone)) { err.textContent = "Please enter a valid WhatsApp number."; form.querySelector('[name="phone"]').focus(); return; }
      err.textContent = "";
      var msg = ["Assalam o Alaikum Study Abroad By SiU,", "I'd like free counselling.", "", "Name: " + name, "Phone: " + phone,
        "Destination: " + (f.get("country") || "-"), "Qualification: " + (f.get("qualification") || "-"), "Intake: " + (f.get("intake") || "-"), "IELTS: " + (f.get("ielts") || "-")].join("\n");
      track("generate_lead", { country: f.get("country") || "", page: location.pathname });
      window.open("https://wa.me/" + WA + "?text=" + encodeURIComponent(msg), "_blank", "noopener");
      form.reset();
    });
  });

  /* articles search + filter */
  var grid = document.getElementById("art-grid");
  if (grid) {
    var q = document.getElementById("art-q"), chips = document.querySelectorAll(".chip"), cat = "all", nr = document.getElementById("no-res");
    function apply() {
      var s = (q && q.value || "").toLowerCase().trim(), n = 0;
      grid.querySelectorAll(".acard").forEach(function (c) {
        var ok = (cat === "all" || c.dataset.cat === cat) && (!s || c.dataset.text.indexOf(s) > -1);
        c.hidden = !ok; if (ok) { n++; c.classList.add("in"); }
      });
      nr.hidden = n > 0;
    }
    chips.forEach(function (c) { c.addEventListener("click", function () { chips.forEach(function (x) { x.classList.remove("on"); }); c.classList.add("on"); cat = c.dataset.filter; apply(); }); });
    if (q) q.addEventListener("input", apply);
  }

  /* toc scrollspy */
  var links = document.querySelectorAll(".toc a");
  if (links.length && "IntersectionObserver" in window) {
    var m = {}; links.forEach(function (l) { m[l.getAttribute("href").slice(1)] = l; });
    var so = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { links.forEach(function (l) { l.classList.remove("active"); }); if (m[e.target.id]) m[e.target.id].classList.add("active"); } }); }, { rootMargin: "-100px 0px -65% 0px" });
    Object.keys(m).forEach(function (id) { var h = document.getElementById(id); if (h) so.observe(h); });
  }
  document.querySelectorAll(".copy-link").forEach(function (b) {
    b.addEventListener("click", function () { var done = function () { b.classList.add("copied"); setTimeout(function () { b.classList.remove("copied"); }, 1500); };
      navigator.clipboard ? navigator.clipboard.writeText(b.dataset.url).then(done, done) : done(); });
  });
  document.querySelectorAll("[data-year]").forEach(function (y) { y.textContent = new Date().getFullYear(); });
})();
