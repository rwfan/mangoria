/* =====================================================
   Mangoria — navbar.js
   Общий скрипт навбара: язык, поиск, мобильное меню.
   ===================================================== */

/* ── Переводы ── */
var I18N = {
  uk: {
    nav_manga:          'Манга',
    nav_ranobe:         'Ранобе',
    nav_catalog:        'Каталог',
    nav_genres:         'Жанри',
    nav_rating:         'Рейтинг',
    nav_authors:        'Автори',
    nav_new:            'Новинки',
    nav_publish:        'Публікувати',
    lang_label:         'УК',
    search_title:       'Пошук по Mangoria',
    search_placeholder: 'Назва, автор, жанр або тег…',
    search_btn:         'Знайти',
    search_hint:        'Популярні жанри:',
    search_recent:      'Нещодавні пошуки',
    search_types:       ['Всі', 'Манга', 'Ранобе', 'Автори'],
    footer_copy:        '© 2025 Mangoria. Усі права захищені.',
  },
  ru: {
    nav_manga:          'Манга',
    nav_ranobe:         'Ранобэ',
    nav_catalog:        'Каталог',
    nav_genres:         'Жанры',
    nav_rating:         'Рейтинг',
    nav_authors:        'Авторы',
    nav_new:            'Новинки',
    nav_publish:        'Публиковать',
    lang_label:         'РУ',
    search_title:       'Поиск по Mangoria',
    search_placeholder: 'Название, автор, жанр или тег…',
    search_btn:         'Найти',
    search_hint:        'Популярные жанры:',
    search_recent:      'Недавние поиски',
    search_types:       ['Все', 'Манга', 'Ранобэ', 'Авторы'],
    footer_copy:        '© 2025 Mangoria. Все права защищены.',
  },
  en: {
    nav_manga:          'Manga',
    nav_ranobe:         'Light Novel',
    nav_catalog:        'Catalog',
    nav_genres:         'Genres',
    nav_rating:         'Rating',
    nav_authors:        'Authors',
    nav_new:            'New',
    nav_publish:        'Publish',
    lang_label:         'EN',
    search_title:       'Search Mangoria',
    search_placeholder: 'Title, author, genre or tag…',
    search_btn:         'Search',
    search_hint:        'Popular genres:',
    search_recent:      'Recent searches',
    search_types:       ['All', 'Manga', 'Light Novel', 'Authors'],
    footer_copy:        '© 2025 Mangoria. All rights reserved.',
  }
};

var GENRES_I18N = {
  uk: ['Фентезі','Сьонен','Хоррор','Ісекай','Романтика','Детектив','Меха','Sci-Fi'],
  ru: ['Фэнтези','Сёнэн','Хоррор','Исэкай','Романтика','Детектив','Меха','Sci-Fi'],
  en: ['Fantasy','Shounen','Horror','Isekai','Romance','Mystery','Mecha','Sci-Fi'],
};

var RECENT_SEARCHES = {
  uk: ['Демонічний Клинок','Зоряний Бог','VoidWriter'],
  ru: ['Демонический Клинок','Звёздный Бог','VoidWriter'],
  en: ['Demonic Blade','Star God','VoidWriter'],
};

var currentLang = localStorage.getItem('mangoria_lang') || 'ru';

/* ── DOM Ready ── */
document.addEventListener('DOMContentLoaded', function () {
  buildSearchModal();
  applyLang(currentLang);
  bindNavEvents();
});

/* =====================================================
   LANGUAGE SWITCHER — выпадающий список
   ===================================================== */
function applyLang(lang) {
  currentLang = lang;
  localStorage.setItem('mangoria_lang', lang);
  var t = I18N[lang];

  /* Обновляем метку дропдауна */
  var langLabel = document.getElementById('langDropdownLabel');
  if (langLabel) langLabel.textContent = t.lang_label;

  /* Отмечаем активный пункт в списке */
  document.querySelectorAll('.lang-option').forEach(function (el) {
    el.classList.toggle('active', el.dataset.lang === lang);
  });

  /* Все элементы с data-i18n — просто заменяем textContent */
  document.querySelectorAll('[data-i18n]').forEach(function (el) {
    var key = el.dataset.i18n;
    if (t[key] !== undefined) el.textContent = t[key];
  });

  /* Обновляем поисковое модальное окно */
  updateSearchModal(lang);

  /* Footer copyright */
  var copy = document.querySelector('.footer-copy');
  if (copy) copy.textContent = t.footer_copy;

  /* html[lang] */
  document.documentElement.lang = lang === 'uk' ? 'uk' : lang === 'en' ? 'en' : 'ru';

  /* Закрываем дропдаун если открыт */
  closeLangDropdown();
}

function openLangDropdown() {
  var menu = document.getElementById('langDropdownMenu');
  var btn  = document.getElementById('langDropdownBtn');
  if (!menu) return;
  var isOpen = menu.classList.contains('open');
  if (isOpen) { closeLangDropdown(); return; }
  menu.classList.add('open');
  btn && btn.classList.add('open');
}

function closeLangDropdown() {
  var menu = document.getElementById('langDropdownMenu');
  var btn  = document.getElementById('langDropdownBtn');
  if (menu) menu.classList.remove('open');
  if (btn)  btn.classList.remove('open');
}

/* =====================================================
   SEARCH MODAL
   ===================================================== */
function buildSearchModal() {
  var modal = document.createElement('div');
  modal.id = 'searchModal';
  modal.className = 'search-modal';
  modal.innerHTML = [
    '<div class="search-modal-backdrop" id="searchBackdrop"></div>',
    '<div class="search-modal-box" id="searchBox">',
    '  <div class="search-modal-header">',
    '    <div class="search-modal-brand">',
    '      <span class="search-brand-icon"><i class="fa fa-torii-gate"></i></span>',
    '      <span class="search-brand-name">Mang<span>oria</span></span>',
    '    </div>',
    '    <div style="display:flex;align-items:center;gap:0.5rem;">',
    '      <span class="search-kbd">Esc</span>',
    '      <button class="search-close-btn" id="searchClose"><i class="fa fa-xmark"></i></button>',
    '    </div>',
    '  </div>',
    '  <div class="search-modal-body">',
    '    <p class="search-modal-title" id="searchTitle"></p>',
    '    <div class="search-type-row" id="searchTypeRow"></div>',
    '    <div class="search-input-wrap">',
    '      <i class="fa fa-search search-input-icon"></i>',
    '      <input type="text" class="search-input" id="searchInput" autocomplete="off"/>',
    '      <button class="search-input-btn" id="searchSubmit"></button>',
    '    </div>',
    '    <div class="search-block" id="searchRecentBlock">',
    '      <p class="search-block-label" id="searchRecentLabel"></p>',
    '      <div class="search-recent-list" id="searchRecentList"></div>',
    '    </div>',
    '    <div class="search-block">',
    '      <p class="search-block-label" id="searchGenreLabel"></p>',
    '      <div class="search-genres-list" id="searchGenreList"></div>',
    '    </div>',
    '  </div>',
    '</div>',
  ].join('');

  document.body.appendChild(modal);

  document.getElementById('searchClose').addEventListener('click', closeSearch);
  document.getElementById('searchBackdrop').addEventListener('click', closeSearch);
  document.getElementById('searchInput').addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeSearch();
    if (e.key === 'Enter')  submitSearch();
  });
  document.getElementById('searchSubmit').addEventListener('click', submitSearch);
  document.getElementById('searchInput').addEventListener('input', function () {
    document.getElementById('searchRecentBlock').style.display = this.value.trim() ? 'none' : '';
  });

  updateSearchModal(currentLang);
}

function updateSearchModal(lang) {
  var t  = I18N[lang];
  var g  = GENRES_I18N[lang];
  var rs = RECENT_SEARCHES[lang];

  var el;
  el = document.getElementById('searchTitle');       if (el) el.textContent = t.search_title;
  el = document.getElementById('searchInput');       if (el) el.placeholder  = t.search_placeholder;
  el = document.getElementById('searchSubmit');      if (el) el.textContent  = t.search_btn;
  el = document.getElementById('searchRecentLabel'); if (el) el.textContent  = t.search_recent;
  el = document.getElementById('searchGenreLabel');  if (el) el.textContent  = t.search_hint;

  var typeRow = document.getElementById('searchTypeRow');
  if (typeRow) {
    typeRow.innerHTML = '';
    t.search_types.forEach(function (label, i) {
      var b = document.createElement('button');
      b.className = 'search-type-btn' + (i === 0 ? ' active' : '');
      b.textContent = label;
      b.addEventListener('click', function () {
        typeRow.querySelectorAll('.search-type-btn').forEach(function (x) { x.classList.remove('active'); });
        b.classList.add('active');
      });
      typeRow.appendChild(b);
    });
  }

  var recentList = document.getElementById('searchRecentList');
  if (recentList) {
    recentList.innerHTML = '';
    rs.forEach(function (q) {
      var chip = document.createElement('button');
      chip.className = 'search-recent-chip';
      chip.innerHTML = '<i class="fa fa-clock-rotate-left"></i> ' + q;
      chip.addEventListener('click', function () {
        document.getElementById('searchInput').value = q;
        document.getElementById('searchInput').focus();
        document.getElementById('searchRecentBlock').style.display = 'none';
      });
      recentList.appendChild(chip);
    });
  }

  var genreList = document.getElementById('searchGenreList');
  if (genreList) {
    genreList.innerHTML = '';
    g.forEach(function (genre) {
      var chip = document.createElement('button');
      chip.className = 'search-genre-chip';
      chip.textContent = genre;
      chip.addEventListener('click', function () {
        document.getElementById('searchInput').value = genre;
        document.getElementById('searchInput').focus();
        document.getElementById('searchRecentBlock').style.display = 'none';
      });
      genreList.appendChild(chip);
    });
  }
}

function openSearch() {
  var modal = document.getElementById('searchModal');
  if (!modal) return;
  closeLangDropdown();
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  setTimeout(function () {
    var inp = document.getElementById('searchInput');
    if (inp) inp.focus();
  }, 120);
}

function closeSearch() {
  var modal = document.getElementById('searchModal');
  if (!modal) return;
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

function submitSearch() {
  var val = document.getElementById('searchInput').value.trim();
  if (!val) return;
  closeSearch();
  console.log('Search:', val); /* TODO: redirect to catalog */
}

/* =====================================================
   BIND ALL NAV EVENTS
   ===================================================== */
function bindNavEvents() {
  /* Мобильный тоггл */
  var navToggle = document.getElementById('navToggle');
  var navCenter = document.getElementById('navCenter');
  var navRight  = document.getElementById('navRight');
  if (navToggle) {
    navToggle.addEventListener('click', function () {
      if (navCenter) navCenter.classList.toggle('open');
      if (navRight)  navRight.classList.toggle('open');
    });
  }

  /* Кнопка поиска */
  document.querySelectorAll('[data-action="search"], .nav-search-btn').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      openSearch();
    });
  });

  /* Language dropdown toggle */
  var langBtn = document.getElementById('langDropdownBtn');
  if (langBtn) {
    langBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      openLangDropdown();
    });
  }

  /* Language option click */
  document.querySelectorAll('.lang-option').forEach(function (opt) {
    opt.addEventListener('click', function () {
      applyLang(this.dataset.lang);
    });
  });

  /* Закрываем lang dropdown при клике вне */
  document.addEventListener('click', function (e) {
    var wrap = document.getElementById('langDropdownWrap');
    if (wrap && !wrap.contains(e.target)) closeLangDropdown();
  });

  /* Nav type switcher */
  document.querySelectorAll('.nav-type-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.nav-type-btn').forEach(function (b) { b.classList.remove('active'); });
      this.classList.add('active');
    });
  });

  /* Nav links active */
  document.querySelectorAll('.nav-link-custom').forEach(function (link) {
    link.addEventListener('click', function () {
      document.querySelectorAll('.nav-link-custom').forEach(function (l) { l.classList.remove('active'); });
      this.classList.add('active');
    });
  });

  /* Genre pills */
  document.querySelectorAll('.genre-pill').forEach(function (pill) {
    pill.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelectorAll('.genre-pill').forEach(function (p) { p.classList.remove('active'); });
      this.classList.add('active');
    });
  });

  /* Ctrl+K / Cmd+K */
  document.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      openSearch();
    }
    if (e.key === 'Escape') closeLangDropdown();
  });
}

/* =====================================================
   DEMO USER — заменится данными из CMS/API
   ===================================================== */
var DEMO_USER = {
  name:   'ShadowBrush',
  handle: '@shadowbrush · Автор',
  avatar: 'https://i.pinimg.com/736x/06/5d/b5/065db53a1b7c59cafb67e14f1d722437.jpg',
  works:  3,
};

var DEMO_NOTIFS = [
  { id:1, type:'comment', unread:true,  ava:'https://api.dicebear.com/8.x/bottts/svg?seed=reader1&backgroundColor=0e1a1e', text:'<strong>NightReader_92</strong> прокомментировал главу 34 «Демонического Клинка»', time:'2 мин. назад', iconBg:'', iconColor:'' },
  { id:2, type:'follow',  unread:true,  ava:'https://api.dicebear.com/8.x/bottts/svg?seed=user2&backgroundColor=120a1e',  text:'<strong>DarkInk</strong> подписался на вас', time:'15 мин. назад', iconBg:'', iconColor:'' },
  { id:3, type:'like',    unread:true,  ava:'', iconBg:'rgba(192,57,43,0.15)', iconColor:'#e8726a', icon:'fa-heart', text:'<strong>3 пользователя</strong> лайкнули «Демонический Клинок»', time:'1 час назад' },
  { id:4, type:'update',  unread:false, ava:'', iconBg:'rgba(26,155,138,0.12)', iconColor:'#5dcfc2', icon:'fa-book-open', text:'<strong>VoidWriter</strong> выпустил главу 113 «Призывателя Бездны»', time:'3 часа назад' },
  { id:5, type:'team',    unread:false, ava:'', iconBg:'rgba(212,160,23,0.12)', iconColor:'#d4a017', icon:'fa-users', text:'<strong>KaijuManga</strong> подал заявку на роль переводчика в ваш проект', time:'вчера' },
];

/* =====================================================
   BUILD: вставляем иконки профиля и уведомлений
   в .nav-right перед кнопкой «Публиковать»
   ===================================================== */
function buildNavDropdowns() {
  var navRight = document.getElementById('navRight');
  if (!navRight) return;

  /* Не строим повторно если уже есть (например, hardcoded) */
  if (document.getElementById('notifWrap')) {
    _bindDropdownEvents();
    return;
  }

  var publishBtn = navRight.querySelector('.btn-publish');

  /* ── HTML: Уведомления ── */
  var notifUnread = DEMO_NOTIFS.filter(function(n){ return n.unread; }).length;
  var notifItems  = DEMO_NOTIFS.map(function(n) {
    var avaHtml = n.ava
      ? '<div class="nd-ava nd-ava-user"><img src="' + n.ava + '" alt=""/></div>'
      : '<div class="nd-ava nd-ava-system" style="background:' + n.iconBg + ';color:' + n.iconColor + ';"><i class="fa ' + n.icon + '"></i></div>';
    var dotHtml = n.unread ? '<span class="nd-unread-dot"></span>' : '';
    return [
      '<div class="nd-item' + (n.unread ? ' nd-unread' : '') + '" data-id="' + n.id + '">',
      avaHtml,
      '<div class="nd-body">',
      '<p class="nd-text">' + n.text + '</p>',
      '<span class="nd-time">' + n.time + '</span>',
      '</div>',
      dotHtml,
      '</div>',
    ].join('');
  }).join('');

  var notifWrapHtml = [
    '<div class="nav-dropdown-wrap" id="notifWrap">',
    '  <button class="nav-icon-btn" id="notifBtn" title="Уведомления">',
    '    <i class="fa-regular fa-bell"></i>',
    (notifUnread > 0 ? '    <span class="badge-dot" id="notifDot"></span>' : '    <span class="badge-dot" id="notifDot" style="display:none"></span>'),
    '  </button>',
    '  <div class="nav-dropdown notif-dropdown" id="notifDropdown">',
    '    <div class="nd-header">',
    '      <span class="nd-title">Уведомления</span>',
    '      <button class="nd-mark-all" id="markAllRead">Прочитать все</button>',
    '    </div>',
    '    <div class="nd-list">' + notifItems + '</div>',
    '    <div class="nd-footer">',
    '      <button class="nd-all-btn" id="openAllNotifs"><i class="fa fa-bell fa-xs"></i> Все уведомления</button>',
    '    </div>',
    '  </div>',
    '</div>',
  ].join('');

  /* ── HTML: Профиль ── */
  var profileWrapHtml = [
    '<div class="nav-dropdown-wrap" id="profileWrap">',
    '  <button class="nav-icon-btn nav-profile-btn" id="profileBtn" title="Профиль">',
    '    <img src="' + DEMO_USER.avatar + '" alt="" class="nav-avatar-img"/>',
    '  </button>',
    '  <div class="nav-dropdown profile-dropdown" id="profileDropdown">',
    '    <div class="pd-user">',
    '      <div class="pd-user-ava"><img src="' + DEMO_USER.avatar + '" alt=""/></div>',
    '      <div class="pd-user-info">',
    '        <div class="pd-username">' + DEMO_USER.name + '</div>',
    '        <div class="pd-handle">' + DEMO_USER.handle + '</div>',
    '      </div>',
    '      <span class="pd-online" title="Онлайн"></span>',
    '    </div>',
    '    <div class="pd-sep"></div>',
    '    <a href="profile.html" class="pd-item"><span class="pd-icon"><i class="fa fa-user"></i></span><span>Мой профиль</span></a>',
    '    <a href="settings.html" class="pd-item"><span class="pd-icon"><i class="fa fa-sliders"></i></span><span>Настройки</span></a>',
    '    <div class="pd-sep"></div>',
    '    <a href="profile.html" class="pd-item"><span class="pd-icon"><i class="fa fa-book-open"></i></span><span>Мои работы</span><span class="pd-badge">' + DEMO_USER.works + '</span></a>',
    '    <a href="publish.html" class="pd-item"><span class="pd-icon"><i class="fa fa-plus"></i></span><span>Добавить материал</span></a>',
    '    <div class="pd-sep"></div>',
    '    <button class="pd-item pd-danger" id="logoutBtn"><span class="pd-icon"><i class="fa fa-right-from-bracket"></i></span><span>Выйти</span></button>',
    '  </div>',
    '</div>',
  ].join('');

  /* Вставляем перед кнопкой «Публиковать» */
  var tempNotif   = document.createElement('div');
  var tempProfile = document.createElement('div');
  tempNotif.innerHTML   = notifWrapHtml;
  tempProfile.innerHTML = profileWrapHtml;

  if (publishBtn) {
    navRight.insertBefore(tempProfile.firstElementChild, publishBtn);
    navRight.insertBefore(tempNotif.firstElementChild, publishBtn);
    /* добавляем ms-1 к кнопке публикации если его нет */
    publishBtn.classList.add('ms-1');
  } else {
    navRight.appendChild(tempNotif.firstElementChild);
    navRight.appendChild(tempProfile.firstElementChild);
  }

  _bindDropdownEvents();
}

/* =====================================================
   BUILD: модальное окно всех уведомлений
   ===================================================== */
function buildNotifModal() {
  if (document.getElementById('notifModal')) return;

  var modal = document.createElement('div');
  modal.id = 'notifModal';
  modal.className = 'notif-modal-overlay';

  modal.innerHTML = [
    '<div class="notif-modal">',

    /* Хедер */
    '<div class="nm-header">',
    '  <div class="nm-header-left">',
    '    <div class="nm-icon"><i class="fa fa-bell"></i></div>',
    '    <div><div class="nm-title">Уведомления</div><div class="nm-sub">Все активности по вашему аккаунту</div></div>',
    '  </div>',
    '  <div class="nm-header-right">',
    '    <button class="nm-filter-btn active" onclick="filterNotifs(this,\'all\')">Все</button>',
    '    <button class="nm-filter-btn" onclick="filterNotifs(this,\'comment\')"><i class="fa fa-comment fa-xs"></i> Комментарии</button>',
    '    <button class="nm-filter-btn" onclick="filterNotifs(this,\'like\')"><i class="fa fa-heart fa-xs"></i> Лайки</button>',
    '    <button class="nm-filter-btn" onclick="filterNotifs(this,\'follow\')"><i class="fa fa-user-plus fa-xs"></i> Подписки</button>',
    '    <button class="nm-filter-btn" onclick="filterNotifs(this,\'update\')"><i class="fa fa-book fa-xs"></i> Обновления</button>',
    '    <button class="nm-close" onclick="closeNotifModal()"><i class="fa fa-xmark"></i></button>',
    '  </div>',
    '</div>',

    /* Тело */
    '<div class="nm-body" id="nmBody">',

    '<div class="nm-day-label">Сегодня</div>',

    _nmItem('comment',true,  'reader1','0e1a1e','','','',     '<strong>NightReader_92</strong> прокомментировал главу 34 «Последний удар» — <em>«34 глава просто взорвала мозг!»</em>',         '2 мин. назад',  'title.html', 'Перейти'),
    _nmItem('follow', true,  'user2',  '120a1e','','','',     '<strong>DarkInk</strong> подписался на вас. Теперь у вас <strong>1 241</strong> подписчик.',                                     '15 мин. назад', 'profile.html','Профиль'),
    _nmItem('like',   true,  '','',    'rgba(192,57,43,0.15)','#e8726a','fa-heart', '<strong>ShadowFan_RU</strong>, <strong>KaijuManga</strong> и ещё 1 пользователь лайкнули «Демонический Клинок»','1 час назад',   'title.html', 'Перейти'),
    _nmItem('update', false, '','',    'rgba(26,155,138,0.12)','#5dcfc2','fa-book-open','<strong>VoidWriter</strong> опубликовал главу 113 «Архив под чужим именем» в «Призывателе Бездны»',   '3 часа назад',  '#',          'Читать'),
    _nmItem('team',   false, '','',    'rgba(212,160,23,0.12)','#d4a017','fa-users',   '<strong>KaijuManga</strong> подал заявку на роль переводчика в проект «Демонический Клинок»',           '7 часов назад', '', '', true),
    _nmItem('comment',false, 'user3',  '061a17','','','',     '<strong>InkDemon</strong> ответил на ваш комментарий в «Чёрном Клинке»',                                                         '5 часов назад', '#',          'Перейти'),

    '<div class="nm-day-label">Вчера</div>',

    _nmItem('follow', false, 'user4','1a1505','','','',        '<strong>MoonPen_Art</strong> подписался на вас',                                                                                  'вчера, 18:22',  '#',          'Профиль'),
    _nmItem('like',   false, '','',  'rgba(192,57,43,0.15)','#e8726a','fa-heart', '<strong>5 пользователей</strong> добавили «Пепельный Рассвет» в закладки',                                   'вчера, 14:10',  '#',          'Перейти'),
    _nmItem('update', false, '','',  'rgba(26,155,138,0.12)','#5dcfc2','fa-book-open','<strong>StarPen</strong> завершил «Звёздный Бог» — глава 88 опубликована',                               'вчера, 11:05',  '#',          'Читать'),
    _nmItem('comment',false, 'user5','0a1030','','','',        '<strong>AbyssalReader</strong> оставил комментарий к «Демоническому Клинку»',                                                    'вчера, 09:33',  'title.html', 'Перейти'),

    '</div>',

    /* Футер */
    '<div class="nm-footer">',
    '  <button class="nm-mark-read-all" onclick="markAllAsRead()"><i class="fa fa-check-double fa-xs"></i> Отметить все прочитанными</button>',
    '</div>',
    '</div>',
  ].join('');

  document.body.appendChild(modal);

  /* Закрытие по клику на оверлей */
  modal.addEventListener('click', function(e) {
    if (e.target === modal) closeNotifModal();
  });
}

/* Вспомогательная функция — генерирует одно уведомление для модала */
function _nmItem(type, unread, avaSeed, avaBg, iconBg, iconColor, icon, text, time, href, linkLabel, hasActions) {
  var avaHtml = avaSeed
    ? '<div class="nm-ava nm-ava-user"><img src="https://api.dicebear.com/8.x/bottts/svg?seed=' + avaSeed + '&backgroundColor=' + avaBg + '" alt=""/></div>'
    : '<div class="nm-ava" style="background:' + iconBg + ';color:' + iconColor + ';"><i class="fa ' + icon + '"></i></div>';

  var linkHtml = (href && linkLabel) ? '<a href="' + href + '" class="nm-link">' + linkLabel + '</a>' : '';
  var actionsHtml = hasActions
    ? '<div class="nm-actions"><button class="nm-action-btn nm-accept" onclick="this.closest(\'.nm-item\').style.opacity=\'0.4\'"><i class="fa fa-check"></i> Принять</button><button class="nm-action-btn nm-reject" onclick="this.closest(\'.nm-item\').style.opacity=\'0.4\'"><i class="fa fa-xmark"></i> Отклонить</button></div>'
    : '';

  return [
    '<div class="nm-item' + (unread ? ' nm-unread' : '') + '" data-type="' + type + '">',
    avaHtml,
    '<div class="nm-content">',
    '<p class="nm-text">' + text + '</p>',
    '<div class="nm-meta"><span class="nm-time"><i class="fa fa-clock fa-xs"></i> ' + time + '</span>' + linkHtml + actionsHtml + '</div>',
    '</div>',
    (unread ? '<span class="nm-dot"></span>' : ''),
    '</div>',
  ].join('');
}

/* =====================================================
   BIND DROPDOWN EVENTS
   ===================================================== */
function _bindDropdownEvents() {

  function closeAllDrops() {
    document.querySelectorAll('.nav-dropdown').forEach(function(d) { d.classList.remove('open'); });
    document.querySelectorAll('.nav-dropdown-wrap').forEach(function(w) { w.classList.remove('active'); });
  }

  function toggleDrop(btnId, dropId, wrapId) {
    var btn  = document.getElementById(btnId);
    var drop = document.getElementById(dropId);
    var wrap = document.getElementById(wrapId);
    if (!btn || !drop) return;
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      var isOpen = drop.classList.contains('open');
      closeAllDrops();
      closeLangDropdown();
      if (!isOpen) {
        drop.classList.add('open');
        if (wrap) wrap.classList.add('active');
      }
    });
  }

  toggleDrop('notifBtn',   'notifDropdown',   'notifWrap');
  toggleDrop('profileBtn', 'profileDropdown', 'profileWrap');

  /* Закрытие по клику вне */
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.nav-dropdown-wrap')) closeAllDrops();
  });

  /* Закрытие по Escape */
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') { closeAllDrops(); closeNotifModal(); }
  });

  /* «Прочитать все» в дропдауне */
  var markBtn = document.getElementById('markAllRead');
  if (markBtn) {
    markBtn.addEventListener('click', function() {
      markAllAsRead();
      this.textContent = 'Все прочитаны ✓';
    });
  }

  /* «Все уведомления» — открывает модал */
  var allBtn = document.getElementById('openAllNotifs');
  if (allBtn) {
    allBtn.addEventListener('click', function() {
      closeAllDrops();
      openNotifModal();
    });
  }

  /* Выход */
  var logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
      if (confirm('Выйти из аккаунта?')) window.location.href = 'auth.html';
    });
  }
}

/* =====================================================
   NOTIFICATION MODAL — публичные функции
   ===================================================== */
function openNotifModal() {
  var m = document.getElementById('notifModal');
  if (m) { m.classList.add('open'); document.body.style.overflow = 'hidden'; }
}

function closeNotifModal() {
  var m = document.getElementById('notifModal');
  if (m) { m.classList.remove('open'); document.body.style.overflow = ''; }
}

function filterNotifs(btn, type) {
  document.querySelectorAll('.nm-filter-btn').forEach(function(b) { b.classList.remove('active'); });
  btn.classList.add('active');
  document.querySelectorAll('.nm-item').forEach(function(item) {
    item.style.display = (type === 'all' || item.dataset.type === type) ? '' : 'none';
  });
  /* Скрываем пустые day-label */
  document.querySelectorAll('.nm-day-label').forEach(function(lbl) {
    var sib = lbl.nextElementSibling;
    var hasVisible = false;
    while (sib && !sib.classList.contains('nm-day-label')) {
      if (sib.style.display !== 'none') hasVisible = true;
      sib = sib.nextElementSibling;
    }
    lbl.style.display = hasVisible ? '' : 'none';
  });
}

function markAllAsRead() {
  ['nd-item','nm-item'].forEach(function(cls) {
    document.querySelectorAll('.' + cls + '.nd-unread, .' + cls + '.nm-unread').forEach(function(it) {
      it.classList.remove('nd-unread', 'nm-unread');
    });
  });
  document.querySelectorAll('.nd-unread-dot, .nm-dot').forEach(function(d) { d.style.display = 'none'; });
  var dot = document.getElementById('notifDot');
  if (dot) dot.style.display = 'none';
}

/* ── Добавляем buildNavDropdowns и buildNotifModal в DOMContentLoaded ── */
(function patchInit() {
  /* navbar.js уже слушает DOMContentLoaded через bindNavEvents.
     Добавляем наши функции в тот же поток. */
  var _orig = document.addEventListener;
  /* Если DOM уже готов — запускаем сразу */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      buildNavDropdowns();
      buildNotifModal();
    });
  } else {
    buildNavDropdowns();
    buildNotifModal();
  }
})();
