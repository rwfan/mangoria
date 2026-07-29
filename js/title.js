/* =====================================================
   Mangoria — title.js
   ===================================================== */

document.addEventListener('DOMContentLoaded', function () {

  /* ── Табы ── */
  document.querySelectorAll('.tab-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var target = this.dataset.tab;
      document.querySelectorAll('.tab-btn').forEach(function (b) { b.classList.remove('active'); });
      document.querySelectorAll('.tab-content').forEach(function (c) { c.classList.remove('active'); });
      this.classList.add('active');
      var el = document.getElementById('tab-' + target);
      if (el) el.classList.add('active');
    });
  });

  /* ── Описание: развернуть/свернуть ── */
  var descFull   = document.getElementById('descFull');
  var descShort  = document.getElementById('descShort');
  var descToggle = document.getElementById('descToggle');
  if (descToggle) {
    descToggle.addEventListener('click', function () {
      var expanded = descFull.style.display !== 'none';
      descFull.style.display  = expanded ? 'none'  : 'block';
      descShort.style.display = expanded ? 'block' : 'none';
      this.innerHTML = expanded
        ? '<i class="fa fa-chevron-down" style="font-size:0.65rem;"></i> Читать далее'
        : '<i class="fa fa-chevron-up"   style="font-size:0.65rem;"></i> Свернуть';
    });
  }

  /* ── Кнопки лайк / закладка / в список ── */
  var btnLike     = document.getElementById('btnLike');
  var btnBookmark = document.getElementById('btnBookmark');
  var btnStar     = document.getElementById('btnStar');

  if (btnLike) {
    btnLike.addEventListener('click', function () {
      var on = this.classList.toggle('liked');
      this.innerHTML = on
        ? '<i class="fa-solid fa-heart"></i>'
        : '<i class="fa-regular fa-heart"></i>';
    });
  }
  if (btnBookmark) {
    btnBookmark.addEventListener('click', function () {
      var on = this.classList.toggle('bookmarked');
      this.innerHTML = on
        ? '<i class="fa-solid fa-bookmark"></i>'
        : '<i class="fa-regular fa-bookmark"></i>';
    });
  }
  if (btnStar) {
    btnStar.addEventListener('click', function () {
      var on = this.classList.toggle('stared');
      this.innerHTML = on
        ? '<i class="fa-solid fa-star"></i>'
        : '<i class="fa-regular fa-star"></i>';
    });
  }

  /* ── Лайки комментариев ── */
  document.querySelectorAll('.comment-btn[data-like]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var on = this.classList.toggle('liked');
      var counter = this.querySelector('.like-count');
      var n = parseInt(counter ? counter.textContent : '0') || 0;
      if (counter) counter.textContent = on ? n + 1 : Math.max(0, n - 1);
      var icon = this.querySelector('i');
      if (icon) {
        icon.className = on ? 'fa-solid fa-heart' : 'fa-regular fa-heart';
      }
    });
  });

  /* ── Подписка на автора ── */
  var subBtn = document.getElementById('subscribeBtn');
  if (subBtn) {
    subBtn.addEventListener('click', function () {
      var on = this.classList.toggle('subbed');
      this.innerHTML = on
        ? '<i class="fa fa-check"></i><span>Вы подписаны</span>'
        : '<i class="fa fa-plus"></i><span>Подписаться</span>';
    });
  }

  /* ── Сортировка глав ── */
  document.querySelectorAll('.sort-pill').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.sort-pill').forEach(function (b) { b.classList.remove('active'); });
      this.classList.add('active');
    });
  });

  /* ── Пагинация глав ── */
  document.querySelectorAll('.pg-btn:not(.dots)').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.pg-btn:not(.dots)').forEach(function (b) { b.classList.remove('active'); });
      this.classList.add('active');
    });
  });

  /* ── Отправка комментария (заглушка) ── */
  var commentSubmit = document.getElementById('commentSubmit');
  if (commentSubmit) {
    commentSubmit.addEventListener('click', function () {
      var inp = document.getElementById('commentInput');
      if (!inp || !inp.value.trim()) return;
      inp.value = '';
    });
  }

});
