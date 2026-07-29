/* =====================================================
   MangaOni — main.js
   JS для главной страницы (index.html)
   ===================================================== */

document.addEventListener('DOMContentLoaded', function () {

  /* ── Mobile nav toggle ── */
  const navToggle = document.getElementById('navToggle');
  const navCenter = document.getElementById('navCenter');
  const navRight  = document.getElementById('navRight');

  if (navToggle) {
    navToggle.addEventListener('click', function () {
      navCenter.classList.toggle('open');
      navRight.classList.toggle('open');
    });
  }

  /* ── Nav type switcher (Манга / Ранобэ) ── */
  document.querySelectorAll('.nav-type-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.nav-type-btn').forEach(function (b) {
        b.classList.remove('active');
      });
      this.classList.add('active');
    });
  });

  /* ── Nav link active state ── */
  document.querySelectorAll('.nav-link-custom').forEach(function (link) {
    link.addEventListener('click', function () {
      document.querySelectorAll('.nav-link-custom').forEach(function (l) {
        l.classList.remove('active');
      });
      this.classList.add('active');
    });
  });

  /* ── Genre pills active state ── */
  document.querySelectorAll('.genre-pill').forEach(function (pill) {
    pill.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelectorAll('.genre-pill').forEach(function (p) {
        p.classList.remove('active');
      });
      this.classList.add('active');
    });
  });

  /* ── Upload CTA tabs ── */
  document.querySelectorAll('.upload-tab').forEach(function (tab) {
    tab.addEventListener('click', function (e) {
      e.preventDefault();
    });
  });

});

/* =====================================================
   HERO STRIPES — жалюзи-коллаж
   Десктоп: вертикальные полоски, позиционирование по X
   Мобильный: горизонтальные полоски, позиционирование по Y
   ===================================================== */
function initHeroStripes() {
  var wrap = document.getElementById('heroStripes');
  if (!wrap) return;

  var spans = wrap.querySelectorAll('span');
  if (!spans.length) return;

  function layout() {
    var isMobile = window.innerWidth <= 768;
    var wrapW    = wrap.offsetWidth;
    var wrapH    = wrap.offsetHeight;
    var n        = spans.length;

    if (isMobile) {
      /* ── Горизонтальные полоски (мобильный) ── */
      var gap       = window.innerWidth <= 480 ? 6 : 9;
      var totalSpanH = wrapH - gap * (n - 1);
      var spanH      = totalSpanH / n;

      spans.forEach(function(span, i) {
        var spanTop = i * (spanH + gap);
        span.style.backgroundSize  = '100% ' + wrapH + 'px';
        span.style.backgroundPosition = '50% -' + spanTop + 'px';
      });
    } else {
      /* ── Вертикальные полоски (десктоп) ── */
      var gap2      = 9;
      var totalSpanW = wrapW - gap2 * (n - 1);
      var spanW      = totalSpanW / n;

      spans.forEach(function(span, i) {
        var spanLeft = i * (spanW + gap2);
        span.style.backgroundSize  = wrapW + 'px 100%';
        span.style.backgroundPosition = '-' + spanLeft + 'px 0';
      });
    }
  }

  layout();
  window.addEventListener('resize', layout);
}

document.addEventListener('DOMContentLoaded', initHeroStripes);
