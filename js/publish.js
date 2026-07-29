/* =====================================================
   Mangoria — publish.js
   JS для страницы публикации (publish.html)
   ===================================================== */

/* ── State ── */
let currentStep = 1;
let currentType = 'manga';

/* ── DOM Ready ── */
document.addEventListener('DOMContentLoaded', function () {

  /* Choices.js — жанры */
  if (document.getElementById('genresSelect')) {
    window.genresChoices = new Choices('#genresSelect', {
      removeItemButton:      true,
      searchResultLimit:     10,
      placeholder:           true,
      placeholderValue:      'Выберите жанры…',
      noResultsText:         'Ничего не найдено',
      searchPlaceholderValue:'Искать…',
      itemSelectText:        '',
      maxItemCount:          8,
    });
  }

  /* Choices.js — теги */
  if (document.getElementById('tagsInput')) {
    window.tagsChoices = new Choices('#tagsInput', {
      delimiter:         ',',
      editItems:         true,
      maxItemCount:      20,
      removeItemButton:  true,
      addItems:          true,
      placeholder:       true,
      placeholderValue:  'Добавляйте теги…',
      noResultsText:     '',
      noChoicesText:     '',
      itemSelectText:    '',
    });
  }

  /* Счётчик символов описания */
  const descTextarea = document.getElementById('descTextarea');
  if (descTextarea) {
    descTextarea.addEventListener('input', function () {
      const el = document.getElementById('descCount');
      if (el) el.textContent = this.value.length + ' / 1000';
    });
  }

  /* Счётчик знаков RTE */
  const rteArea = document.getElementById('rteArea');
  if (rteArea) {
    rteArea.addEventListener('input', updateRteCount);
  }

  /* RTE toolbar — toggle active */
  document.querySelectorAll('.rte-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      this.classList.toggle('active');
    });
  });

  /* Drag-over highlight для зон загрузки */
  ['coverZone', 'pagesZone'].forEach(function (id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('dragover',  function (e) { e.preventDefault(); el.classList.add('dragover'); });
    el.addEventListener('dragleave', function ()  { el.classList.remove('dragover'); });
    el.addEventListener('drop',      function ()  { el.classList.remove('dragover'); });
  });

  /* Кнопки черновика */
  document.querySelectorAll('.btn-draft, #btnSaveDraft').forEach(function (btn) {
    btn.addEventListener('click', function () {
      showToast('Черновик сохранён', 'Вы можете вернуться позже', '#d4a017');
    });
  });

});

/* =====================================================
   TYPE TOGGLE (Манга / Ранобэ)
   ===================================================== */
function setType(type) {
  currentType = type;
  var isR = (type === 'ranobe');

  document.body.classList.toggle('ranobe-mode', isR);

  /* Кнопки в сайдбаре */
  var btnManga  = document.getElementById('btnManga');
  var btnRanobe = document.getElementById('btnRanobe');
  if (btnManga)  btnManga.classList.toggle('active', !isR);
  if (btnRanobe) btnRanobe.classList.toggle('active', isR);

  /* Пилюли в hero */
  var heroPillManga  = document.getElementById('heroPillManga');
  var heroPillRanobe = document.getElementById('heroPillRanobe');
  if (heroPillManga)  heroPillManga.classList.toggle('active', !isR);
  if (heroPillRanobe) heroPillRanobe.classList.toggle('active', isR);

  /* Hero text */
  var heroAccent = document.getElementById('heroAccent');
  var heroKanji  = document.getElementById('heroKanji');
  var heroSub    = document.getElementById('heroSub');
  if (heroAccent) heroAccent.textContent = isR ? 'ранобэ' : 'произведением';
  if (heroKanji)  heroKanji.textContent  = isR ? '文章'   : '投稿';
  if (heroSub) {
    heroSub.textContent = isR
      ? 'Напишите ранобэ и найдите своих читателей. Встроенный редактор, главы, авторские заметки — всё готово.'
      : 'Загрузите мангу и найдите своих читателей. Поддержка страниц, глав и режимов чтения — всё готово.';
  }

  /* Теги типа в панелях */
  var icon  = isR ? '<i class="fa fa-book"></i>' : '<i class="fa fa-image"></i>';
  var label = isR ? ' Ранобэ' : ' Манга';
  ['typeTag', 'typeTag2', 'typeTag4'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) {
      el.innerHTML   = icon + label;
      el.className   = 'content-type-tag' + (isR ? ' ranobe' : '');
    }
  });

  /* Подпись шага 3 в сайдбаре */
  var stepSub3 = document.getElementById('stepSub3');
  if (stepSub3) stepSub3.textContent = isR ? 'Текст главы' : 'Страницы манги';

  /* Если сейчас открыт шаг 3 — переключаем контент */
  if (currentStep === 3) {
    document.getElementById('step3manga').classList.toggle('active', !isR);
    document.getElementById('step3ranobe').classList.toggle('active', isR);
  }
}

/* =====================================================
   STEP NAVIGATION
   ===================================================== */
function goStep(n) {

  /* Валидация шага 1 */
  if (n > 1 && currentStep === 1) {
    var titleInput = document.getElementById('titleInput');
    if (titleInput && !titleInput.value.trim()) {
      shakeField('titleInput');
      return;
    }
  }

  /* Обновляем стейт степпера */
  document.querySelectorAll('.step-item').forEach(function (item, i) {
    item.classList.remove('active', 'done');
    var numEl = item.querySelector('.step-num');
    if (i + 1 < n) {
      item.classList.add('done');
      numEl.innerHTML = '<i class="fa fa-check" style="font-size:0.58rem;"></i>';
    } else {
      numEl.textContent = String(i + 1);
    }
    if (i + 1 === n) item.classList.add('active');
  });

  /* Скрываем весь контент */
  document.querySelectorAll('.step-content').forEach(function (el) {
    el.classList.remove('active');
  });

  /* Показываем нужный */
  if (n === 3) {
    var id = (currentType === 'ranobe') ? 'step3ranobe' : 'step3manga';
    document.getElementById(id).classList.add('active');
  } else {
    document.getElementById('step' + n).classList.add('active');
  }

  currentStep = n;

  /* Прогресс-бар */
  var pct = Math.round((n / 4) * 100);
  var fill = document.getElementById('progressFill');
  var pctEl = document.getElementById('progressPct');
  if (fill)  fill.style.width  = pct + '%';
  if (pctEl) pctEl.textContent = pct + '%';

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* =====================================================
   HELPERS
   ===================================================== */

/* Подсветка невалидного поля */
function shakeField(id) {
  var el = document.getElementById(id);
  if (!el) return;
  el.style.borderColor = 'rgba(192,57,43,0.7)';
  el.style.boxShadow   = '0 0 0 3px rgba(192,57,43,0.2)';
  el.focus();
  setTimeout(function () {
    el.style.borderColor = '';
    el.style.boxShadow   = '';
  }, 2000);
}

/* Превью обложки */
function previewCover(e) {
  var file = e.target.files[0];
  if (!file) return;
  var zone = document.getElementById('coverZone');
  zone.innerHTML = '';
  var img = document.createElement('img');
  img.src = URL.createObjectURL(file);
  img.style.cssText = 'width:100%;height:100%;object-fit:cover;border-radius:10px;';
  zone.appendChild(img);
  zone.style.padding = '0';
  var inp = document.createElement('input');
  inp.type    = 'file';
  inp.accept  = 'image/*';
  inp.onchange = previewCover;
  inp.style.cssText = 'position:absolute;inset:0;opacity:0;cursor:pointer;';
  zone.appendChild(inp);
}

/* Превью страниц манги */
function previewPages(e) {
  var files  = Array.from(e.target.files);
  var thumbs = document.getElementById('pagesThumbs');
  thumbs.innerHTML = '';

  files.forEach(function (f, i) {
    var div = document.createElement('div');
    div.className = 'page-thumb';
    div.style.cssText = 'background-image:url(' + URL.createObjectURL(f) + ');background-size:cover;background-position:center;';
    var num = document.createElement('span');
    num.className   = 'page-thumb-num';
    num.textContent = i + 1;
    div.appendChild(num);
    thumbs.appendChild(div);
  });

  var zone = document.getElementById('pagesZone');
  var icon = zone.querySelector('i');
  var lbl  = zone.querySelector('.upload-zone-label');
  if (icon) icon.style.display = 'none';
  if (lbl)  lbl.textContent    = 'Загружено: ' + files.length + ' стр.';
}

/* Счётчик символов текстового редактора */
function updateRteCount() {
  var t  = document.getElementById('rteArea');
  var el = document.getElementById('rteCount');
  if (t && el) el.textContent = t.value.length.toLocaleString('ru') + ' знаков';
}

/* Кнопки ± для номера главы (манга) */
function changeNum(delta) {
  var el = document.getElementById('chapterNum');
  if (el) el.value = Math.max(0, parseFloat(el.value || 0) + delta);
}

/* Кнопки ± для номера главы (ранобэ) */
function changeNumR(delta) {
  var el = document.getElementById('rChapterNum');
  if (el) el.value = Math.max(0, parseFloat(el.value || 0) + delta);
}

/* Публикация — финальный шаг */
function handleSubmit() {
  var agree1 = document.getElementById('agree1');
  var agree2 = document.getElementById('agree2');
  if (!agree1.checked || !agree2.checked) {
    showToast('Внимание', 'Необходимо принять правила платформы', '#d4a017');
    return;
  }
  showToast('Опубликовано!', 'Произведение отправлено на модерацию', 'var(--red)');
  setTimeout(function () {
    window.location.href = 'index.html';
  }, 2200);
}

/* Toast-уведомление */
function showToast(title, msg, color) {
  var t    = document.getElementById('toast');
  var icon = t.querySelector('.fa');
  document.getElementById('toastTitle').textContent = title;
  document.getElementById('toastMsg').textContent   = msg;
  t.style.borderLeftColor   = color || 'var(--red)';
  if (icon) icon.style.color = color || 'var(--red)';
  t.style.display = 'flex';
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(function () {
    t.style.display = 'none';
  }, 3000);
}

/* =====================================================
   АДАПТАЦИЯ — показ/скрытие блока команды
   ===================================================== */
var ADAPTATION_HINTS = {
  forbidden: 'Адаптация запрещена — другие пользователи не смогут предлагать адаптацию.',
  allowed:   'Разрешена адаптация — пользователи смогут обращаться к вам с предложениями.',
  seeking:   'Ищем команду — на странице произведения появится блок с открытыми позициями.',
  found:     'Художник найден — на странице отобразится статус «Манга создаётся».',
};

function updateAdaptationHint(select) {
  var val   = select.value;
  var hint  = document.getElementById('adaptationHint');
  var panel = document.getElementById('teamPanel');

  if (hint) hint.textContent = ADAPTATION_HINTS[val] || '';

  /* Блок поиска команды показываем только при статусе seeking */
  if (panel) {
    panel.style.display = (val === 'seeking') ? 'block' : 'none';
    if (val === 'seeking') {
      panel.style.animation = 'fadeUp 0.25s ease';
    }
  }
}

/* Инициализируем при загрузке */
document.addEventListener('DOMContentLoaded', function () {
  var sel = document.getElementById('adaptationSelect');
  if (sel) updateAdaptationHint(sel);
});
