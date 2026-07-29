/* =====================================================
   Mangoria — settings.js
   ===================================================== */

document.addEventListener('DOMContentLoaded', function () {

  /* ── Переключение панелей ── */
  document.querySelectorAll('.settings-nav-item[data-panel]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var target = this.dataset.panel;

      /* Навигация — активный пункт */
      document.querySelectorAll('.settings-nav-item').forEach(function (b) {
        b.classList.remove('active');
      });
      this.classList.add('active');

      /* Панели */
      document.querySelectorAll('.settings-panel').forEach(function (p) {
        p.classList.remove('active');
      });
      var panel = document.getElementById('panel-' + target);
      if (panel) panel.classList.add('active');

      /* На мобильном — скролл вверх к контенту */
      var main = document.querySelector('.settings-main');
      if (main && window.innerWidth < 900) {
        main.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ── Счётчик символов биографии ── */
  document.querySelectorAll('textarea.field-input').forEach(function (ta) {
    var label = ta.closest('.field-group');
    if (!label) return;
    var countEl = label.querySelector('.char-count');
    if (!countEl) return;
    ta.addEventListener('input', function () {
      var max = parseInt(countEl.textContent.split('/')[1]) || 300;
      countEl.textContent = this.value.length + ' / ' + max;
      countEl.style.color = this.value.length > max * 0.9
        ? 'rgba(224,94,80,0.7)'
        : 'rgba(221,214,200,0.25)';
    });
  });

  /* ── Кнопки «Отменить» — сброс формы ── */
  document.querySelectorAll('.btn-cancel').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var panel = btn.closest('.settings-panel');
      if (!panel) return;
      panel.querySelectorAll('input[type="text"], input[type="email"], input[type="url"], textarea').forEach(function (el) {
        el.value = el.defaultValue;
        el.classList.remove('valid', 'invalid');
      });
      /* Сбросить статус сохранения */
      var status = panel.querySelector('.save-status');
      if (status) { status.textContent = ''; status.className = 'save-status'; }
    });
  });

  /* ── URL хэш — открыть нужную панель при загрузке ── */
  var hash = window.location.hash.replace('#', '');
  var validPanels = ['profile', 'media', 'roles', 'account', 'notifications', 'privacy', 'security', 'danger'];
  if (hash && validPanels.includes(hash)) {
    var targetBtn = document.querySelector('.settings-nav-item[data-panel="' + hash + '"]');
    if (targetBtn) targetBtn.click();
  }

});

/* =====================================================
   SAVE SETTINGS
   ===================================================== */
function saveSettings(btn) {
  /* Спиннер */
  btn.classList.add('loading');
  btn.disabled = true;

  /* Имитация запроса */
  setTimeout(function () {
    btn.classList.remove('loading');
    btn.disabled = false;

    /* Статус-метка рядом с кнопкой */
    var panel   = btn.closest('.settings-panel');
    var statusEl = panel ? panel.querySelector('.save-status') : null;
    if (statusEl) {
      statusEl.className = 'save-status success';
      statusEl.innerHTML = '<i class="fa fa-circle-check"></i> Сохранено';
      clearTimeout(statusEl._timer);
      statusEl._timer = setTimeout(function () {
        statusEl.textContent = '';
        statusEl.className   = 'save-status';
      }, 3500);
    }

    /* Toast */
    showToast('Изменения сохранены', 'Настройки успешно применены', '#4ade80');
  }, 1200);
}

/* =====================================================
   TOAST
   ===================================================== */
function showToast(title, msg, color) {
  var t     = document.getElementById('settingsToast');
  var icon  = t.querySelector('.fa-circle-check');
  var tTitle = document.getElementById('toastTitle');
  var tMsg   = document.getElementById('toastMsg');

  tTitle.textContent = title;
  tMsg.textContent   = msg;
  if (icon) icon.style.color = color || '#4ade80';
  t.style.borderLeftColor   = color || '#4ade80';

  t.style.display = 'flex';
  t.style.animation = 'slideIn 0.3s ease';

  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(function () {
    t.style.display = 'none';
  }, 3200);
}

/* =====================================================
   PREVIEW IMAGE (аватар / баннер)
   ===================================================== */
function previewImage(event, containerId) {
  var file = event.target.files[0];
  if (!file) return;

  var container = document.getElementById(containerId);
  if (!container) return;

  var img = container.querySelector('img');
  if (!img) {
    img = document.createElement('img');
    container.appendChild(img);
  }

  var reader = new FileReader();
  reader.onload = function (e) {
    img.src = e.target.result;
    img.style.objectFit = 'cover';
    img.style.width  = '100%';
    img.style.height = '100%';
  };
  reader.readAsDataURL(file);

  /* Toast-подсказка */
  showToast('Изображение выбрано', 'Нажмите «Сохранить», чтобы применить', 'var(--gold)');
}

/* =====================================================
   END SESSION
   ===================================================== */
function endSession(btn) {
  var item = btn.closest('.session-item');
  if (!item) return;

  btn.textContent = '...';
  btn.disabled = true;

  setTimeout(function () {
    item.style.opacity = '0';
    item.style.transform = 'translateX(12px)';
    item.style.transition = 'opacity 0.3s, transform 0.3s';
    setTimeout(function () { item.remove(); }, 320);
    showToast('Сессия завершена', 'Устройство отключено от аккаунта', 'var(--red)');
  }, 800);
}

/* =====================================================
   CONFIRM DELETE ACCOUNT
   ===================================================== */
function confirmDelete() {
  var confirmed = window.confirm(
    'Вы уверены, что хотите удалить аккаунт?\n\n' +
    'Это действие необратимо. Все данные, произведения и история будут уничтожены.'
  );
  if (confirmed) {
    showToast('Запрос отправлен', 'На email придёт ссылка для подтверждения удаления', 'var(--red)');
  }
}
