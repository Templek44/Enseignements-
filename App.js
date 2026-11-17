window.addEventListener("load", function(){
  var loader = document.getElementById("loader");
  if (loader) setTimeout(function(){ loader.classList.add("hidden"); }, 700);
});

var yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

var header = document.getElementById("header");
var progress = document.getElementById("progress");
var backTop = document.getElementById("backTop");

window.addEventListener("scroll", function(){
  var st = window.scrollY;
  if (header) header.classList.toggle("scrolled", st > 10);
  if (progress && backTop) {
    var h = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (st / h * 100) + "%";
    backTop.classList.toggle("visible", st > 400);
  }
});

if (backTop) {
  backTop.addEventListener("click", function(){
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

var burger = document.getElementById("burger");
var nav = document.getElementById("nav");

if (burger && nav) {
  burger.addEventListener("click", function(){
    var open = nav.classList.toggle("open");
    burger.classList.toggle("open", open);
  });
  var navLinksAll = nav.querySelectorAll("a");
  for (var i = 0; i < navLinksAll.length; i++) {
    navLinksAll[i].addEventListener("click", function(){
      nav.classList.remove("open");
      burger.classList.remove("open");
    });
  }
}

var pages = document.querySelectorAll(".page");
var navLinks = document.querySelectorAll('.nav a[href^="#/"]');

var revealObs = null;

function initReveal(){
  if (revealObs) revealObs.disconnect();
  revealObs = new IntersectionObserver(function(entries){
    entries.forEach(function(x){
      if (x.isIntersecting) {
        x.target.classList.add("visible");
        revealObs.unobserve(x.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  var els = document.querySelectorAll(".page.active .reveal");
  for (var i = 0; i < els.length; i++) {
    els[i].classList.remove("visible");
    revealObs.observe(els[i]);
  }
}

function router(){
  var h = location.hash.replace("#/", "") || "accueil";
  for (var i = 0; i < pages.length; i++) {
    pages[i].classList.toggle("active", pages[i].id === "page-" + h);
  }
  for (var j = 0; j < navLinks.length; j++) {
    var href = navLinks[j].getAttribute("href");
    navLinks[j].classList.toggle("active", href === "#/" + h);
  }
  window.scrollTo(0, 0);
  initReveal();
  setTimeout(initCounters, 100);
  setTimeout(initTilt, 300);
}

window.addEventListener("hashchange", router);function initCounters(){
  var els = document.querySelectorAll(".page.active [data-count]");
  for (var i = 0; i < els.length; i++) {
    (function(el){
      if (el.dataset.done) return;
      var target = parseInt(el.dataset.count, 10);
      var dur = 1800;
      var start = performance.now();
      function tick(now){
        var p = Math.min((now - start) / dur, 1);
        var ease = 1 - Math.pow(1 - p, 3);
        var val = Math.floor(target * ease);
        el.textContent = val + (target >= 100 ? "+" : "");
        if (p < 1) requestAnimationFrame(tick);
        else {
          el.textContent = target + (target >= 100 ? "+" : "");
          el.dataset.done = "1";
        }
      }
      requestAnimationFrame(tick);
    })(els[i]);
  }
}

function initTilt(){
  var els = document.querySelectorAll(".page.active .tilt");
  for (var i = 0; i < els.length; i++) {
    (function(el){
      if (el.dataset.tilt) return;
      el.dataset.tilt = "1";
      el.addEventListener("mousemove", function(e){
        var r = el.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = "perspective(800px) rotateY(" + (x*12) + "deg) rotateX(" + (-y*12) + "deg) translateY(-4px)";
      });
      el.addEventListener("mouseleave", function(){
        el.style.transform = "";
      });
    })(els[i]);
  }
}

var filterBtns = document.querySelectorAll(".filter");
for (var fi2 = 0; fi2 < filterBtns.length; fi2++) {
  (function(btn){
    btn.addEventListener("click", function(){
      var all = document.querySelectorAll(".filter");
      for (var k = 0; k < all.length; k++) all[k].classList.remove("is-active");
      btn.classList.add("is-active");
      var c = btn.dataset.filter;
      var cards = document.querySelectorAll(".card");
      for (var m = 0; m < cards.length; m++) {
        var show = (c === "all" || cards[m].dataset.category === c);
        cards[m].classList.toggle("hidden", !show);
      }
    });
  })(filterBtns[fi2]);
}

var JOURS = ["dimanche","lundi","mardi","mercredi","jeudi","vendredi","samedi"];
var MOIS = ["janvier","f\u00e9vrier","mars","avril","mai","juin","juillet","ao\u00fbt","septembre","octobre","novembre","d\u00e9cembre"];

function updateCountdown(){
  var el = document.getElementById("d");
  var accueil = document.getElementById("page-accueil");
  if (!el || !accueil || !accueil.classList.contains("active")) return;

  var now = new Date();
  var utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  var cmr = new Date(utc + 3600000);
  var day = cmr.getDay();
  var hour = cmr.getHours();

  var sessions = [{ day: 4, name: "jeudi" }, { day: 5, name: "vendredi" }];
  var target = null;

  for (var o = 0; o <= 7; o++) {
    var d = (day + o) % 7;
    var s = null;
    for (var i2 = 0; i2 < sessions.length; i2++) {
      if (sessions[i2].day === d) { s = sessions[i2]; break; }
    }
    if (!s) continue;
    var c = new Date(cmr);
    c.setDate(cmr.getDate() + o);
    c.setHours(17, 0, 0, 0);
    if (o === 0 && hour >= 18) continue;
    target = { date: c, name: s.name };
    break;
  }

  if (!target) {
    var d2 = new Date(cmr);
    d2.setDate(d2.getDate() + ((4 - day + 7) % 7));
    d2.setHours(17, 0, 0, 0);
    target = { date: d2, name: "jeudi" };
  }

  var isSessDay = (day === 4 || day === 5);
  var isSessTime = isSessDay && hour === 17;
  var nl = document.getElementById("next-label");
  var head = document.querySelector(".countdown-head");
  var dot = document.querySelector(".dot");

  if (isSessTime) {
    if (head) head.innerHTML = '<span class="dot" style="background:#d9534f;box-shadow:0 0 15px #d9534f"></span> EN DIRECT';
    if (nl) nl.innerHTML = '<strong>Session en cours !</strong> Rejoins-nous.';
    var ids = ["d","h","m","s"];
    for (var ii = 0; ii < ids.length; ii++) {
      var e2 = document.getElementById(ids[ii]);
      if (e2) e2.textContent = "0";
    }
    return;
  }

  var diff = target.date - cmr;
  var dd = Math.floor(diff / 86400000);
  var hh = Math.floor((diff / 3600000) % 24);
  var mm = Math.floor((diff / 60000) % 60);
  var ss = Math.floor((diff / 1000) % 60);

  el.textContent = dd;
  var hEl = document.getElementById("h");
  var mEl = document.getElementById("m");
  var sEl = document.getElementById("s");
  if (hEl) hEl.textContent = String(hh).padStart(2, "0");
  if (mEl) mEl.textContent = String(mm).padStart(2, "0");
  if (sEl) sEl.textContent = String(ss).padStart(2, "0");

  var ds = JOURS[target.date.getDay()] + " " + target.date.getDate() + " " + MOIS[target.date.getMonth()];
  if (nl) nl.innerHTML = "Prochaine session : <strong>" + target.name + " " + ds + " à 17h</strong>";
  if (head) head.innerHTML = '<span class="dot"></span> Prochaine session';
}

setInterval(updateCountdown, 1000);var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function showError(input, msg){
  input.classList.toggle("invalid", !!msg);
  var field = input.closest(".field");
  var e = field ? field.querySelector("[data-error]") : null;
  if (e) e.textContent = msg || "";
  return !msg;
}

function validateField(input){
  var v = input.value.trim();
  if (input.hasAttribute("required") && !v) return showError(input, "Champ obligatoire.");
  if (input.type === "email" && v && !emailRegex.test(v)) return showError(input, "Email invalide.");
  if (input.tagName === "TEXTAREA" && input.minLength > 0 && v.length < input.minLength) {
    return showError(input, "Minimum " + input.minLength + " car. (" + v.length + ")");
  }
  return showError(input, "");
}

var fi = document.getElementById("form-inscription");
if (fi) {
  fi.addEventListener("submit", function(e){
    e.preventDefault();
    var valid = true;
    var fields = fi.querySelectorAll("input[required],select[required],textarea[required]");
    for (var i = 0; i < fields.length; i++) {
      if (!validateField(fields[i])) valid = false;
    }
    var consent = document.getElementById("consent");
    var consentErr = fi.querySelector('[data-error][data-for="consent"]');
    if (consent && consentErr) {
      if (!consent.checked) { consentErr.textContent = "Cochez cette case."; valid = false; }
      else consentErr.textContent = "";
    }
    if (!valid) {
      var inv = fi.querySelector(".invalid");
      if (inv) inv.focus();
      return;
    }
    var data = {};
    var fd = new FormData(fi);
    fd.forEach(function(val, key){ data[key] = val; });
    console.log("Candidature :", data);
    fi.reset();
    var sm = document.getElementById("success-msg");
    if (sm) {
      sm.hidden = false;
      setTimeout(function(){ sm.hidden = true; }, 6000);
    }
  });
}

var fc = document.getElementById("form-contact");
if (fc) {
  fc.addEventListener("submit", function(e){
    e.preventDefault();
    var valid = true;
    var fields = fc.querySelectorAll("[required]");
    for (var i = 0; i < fields.length; i++) {
      if (!validateField(fields[i])) valid = false;
    }
    if (!valid) {
      var inv = fc.querySelector(".invalid");
      if (inv) inv.focus();
      return;
    }
    var data = {};
    var fd = new FormData(fc);
    fd.forEach(function(val, key){ data[key] = val; });
    console.log("Message :", data);
    fc.reset();
    var cs = document.getElementById("contact-success");
    if (cs) {
      cs.hidden = false;
      setTimeout(function(){ cs.hidden = true; }, 6000);
    }
  });
}

var lb = document.getElementById("lightbox");
var lbc = document.getElementById("lightboxContent");
var lbx = document.getElementById("lightboxClose");

var galleryItems = document.querySelectorAll(".gallery-item");
for (var g = 0; g < galleryItems.length; g++) {
  (function(it){
    it.addEventListener("click", function(){
      if (!lb || !lbc) return;
      var src = it.dataset.src;
      var img = it.querySelector("img");
      lbc.innerHTML = "";
      var finalSrc = src || (img ? img.src : null);
      if (finalSrc) {
        var newImg = document.createElement("img");
        newImg.src = finalSrc;
        newImg.alt = "";
        lbc.appendChild(newImg);
      }
      lb.classList.add("open");
    });
  })(galleryItems[g]);
}

if (lbx && lb) {
  lbx.addEventListener("click", function(){ lb.classList.remove("open"); });
  lb.addEventListener("click", function(e){
    if (e.target === lb) lb.classList.remove("open");
  });
}

router();
updateCountdown();