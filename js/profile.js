/* =====================================================
   Mangoria — profile.js
   ===================================================== */

document.addEventListener('DOMContentLoaded', function () {

  /* ── Табы ── */
  document.querySelectorAll('.ptab-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var target = this.dataset.tab;
      document.querySelectorAll('.ptab-btn').forEach(function (b) { b.classList.remove('active'); });
      document.querySelectorAll('.ptab-content').forEach(function (c) { c.classList.remove('active'); });
      this.classList.add('active');
      var el = document.getElementById('ptab-' + target);
      if (el) el.classList.add('active');
    });
  });

  /* ── Фильтр работ ── */
  document.querySelectorAll('.wfilter-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.wfilter-btn').forEach(function (b) { b.classList.remove('active'); });
      this.classList.add('active');

      var filter = this.dataset.filter;
      document.querySelectorAll('.work-card').forEach(function (card) {
        if (filter === 'all') {
          card.style.display = '';
        } else {
          var type = card.querySelector('.work-cover-type');
          var match = type && type.classList.contains(filter);
          card.style.display = match ? '' : 'none';
        }
      });
    });
  });

  /* ── Кнопка «Подписаться» ── */
  var followBtn = document.getElementById('followBtn');
  if (followBtn) {
    followBtn.addEventListener('click', function () {
      var on = this.classList.toggle('following');
      this.innerHTML = on
        ? '<i class="fa fa-check"></i> Вы подписаны'
        : '<i class="fa fa-plus"></i> Подписаться';
    });
  }

  /* ── Дропдаун «...» ── */
  var moreBtn      = document.getElementById('moreBtn');
  var moreDropdown = document.getElementById('moreDropdown');
  if (moreBtn && moreDropdown) {
    moreBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = moreDropdown.classList.contains('open');
      if (isOpen) {
        moreDropdown.classList.remove('open');
        return;
      }
      /* Позиционируем fixed-дропдаун относительно кнопки */
      var rect = moreBtn.getBoundingClientRect();
      moreDropdown.style.top   = (rect.bottom + 8) + 'px';
      moreDropdown.style.right = (window.innerWidth - rect.right) + 'px';
      moreDropdown.classList.add('open');
    });
    document.addEventListener('click', function (e) {
      if (!moreDropdown.contains(e.target) && e.target !== moreBtn) {
        moreDropdown.classList.remove('open');
      }
    });
    /* При скролле закрываем */
    window.addEventListener('scroll', function() {
      moreDropdown.classList.remove('open');
    }, { passive: true });
  }

  /* ── «Загрузить ещё» заглушка ── */
  document.querySelectorAll('.btn-load-more').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var icon = this.querySelector('i');
      if (icon) icon.className = 'fa fa-spinner fa-spin';
      var self = this;
      setTimeout(function () {
        if (icon) icon.className = 'fa fa-chevron-down';
      }, 1200);
    });
  });

  /* ── Копирование ссылки ── */
  var copyBtn = document.querySelector('.more-dropdown-item:nth-child(2)');
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      navigator.clipboard && navigator.clipboard.writeText(window.location.href);
      this.innerHTML = '<i class="fa fa-check" style="color:#22c55e;"></i> Скопировано!';
      var self = this;
      setTimeout(function () {
        self.innerHTML = '<i class="fa fa-copy"></i> Скопировать ссылку';
      }, 2000);
      moreDropdown && moreDropdown.classList.remove('open');
    });
  }

});
