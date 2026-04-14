/* ===========================
   GLOBAL JS — AgenticMD
   =========================== */

// ---- NAV SCROLL ----
(function () {
  const nav = document.getElementById('mainNav');
  if (!nav) return;
  window.addEventListener('scroll', function () {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  const hamburger = document.getElementById('navHamburger');
  const mobileMenu = document.getElementById('navMobile');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      mobileMenu.classList.toggle('open');
    });
  }
})();

// ---- COUNTER ANIMATION ----
function animateCounters(counters) {
  if (!counters || !counters.length) return;

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
      const el = entry.target;
      const conf = counters.find(c => c.id === el.id);
      if (!conf) return;
      runCounter(el, conf);
    });
  }, { threshold: 0.3 });

  counters.forEach(function (conf) {
    const el = document.getElementById(conf.id);
    if (el) observer.observe(el);
  });
}

function runCounter(el, conf) {
  const { target, prefix = '', suffix = '', decimals = 0, duration = 1500 } = conf;
  const start = performance.now();
  function frame(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = target * eased;
    const display = decimals > 0 ? current.toFixed(decimals) : Math.round(current);
    el.textContent = prefix + display + suffix;
    if (progress < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

// ---- BAR ANIMATION ----
function animateBars() {
  const bars = document.querySelectorAll('.roi-bar-fill[data-w], .kpi-bar-fill');

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
      const el = entry.target;
      const w = el.dataset.w;
      if (w) {
        el.style.width = w + '%';
      } else {
        const pct = getComputedStyle(el).getPropertyValue('--pct').trim();
        if (pct) el.style.width = pct;
      }
    });
  }, { threshold: 0.2 });

  bars.forEach(b => observer.observe(b));
}

// ---- INDEX PAGE COUNTERS (Auto-run on index) ----
if (document.querySelector('.kpi-grid')) {
  const kpiCounters = [
    { id: null, selector: '[data-target]' }
  ];

  const allTargets = document.querySelectorAll('[data-target]');
  const kpiObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      kpiObserver.unobserve(entry.target);
      const el = entry.target;
      const target = parseFloat(el.dataset.target);
      const prefix = el.dataset.prefix || '';
      const suffix = el.dataset.suffix || '';
      const decimals = parseInt(el.dataset.decimals || '0');
      runCounter(el, { target, prefix, suffix, decimals, duration: 2000 });
    });
  }, { threshold: 0.3 });

  allTargets.forEach(el => kpiObserver.observe(el));

  // KPI bars
  animateBars();
}

// ---- WORKFLOW STEP INTERACTION ----
document.querySelectorAll('.workflow-step').forEach(function (step, i, all) {
  step.addEventListener('click', function () {
    all.forEach(s => s.classList.remove('active'));
    step.classList.add('active');
  });
});

// ---- FADE IN ON SCROLL ----
const fadeEls = document.querySelectorAll('.content-section, .metric-box, .strat-card, .kpi-card');
const fadeObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

fadeEls.forEach(function (el, i) {
  el.style.opacity = '0';
  el.style.transform = 'translateY(16px)';
  el.style.transition = 'opacity 0.5s ease ' + (i * 0.04) + 's, transform 0.5s ease ' + (i * 0.04) + 's';
  fadeObserver.observe(el);
});
