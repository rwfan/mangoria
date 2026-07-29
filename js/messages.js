/* =====================================================
   Mangoria — messages.js
   ===================================================== */

/* ── Открыть диалог ── */
function openDialog(id) {
  document.querySelectorAll('.dialog-item').forEach(function(d) {
    d.classList.remove('active');
  });
  var item = document.querySelector('.dialog-item[data-id="' + id + '"]');
  if (item) {
    item.classList.add('active');
    item.classList.remove('unread');
    var badge = item.querySelector('.di-badge');
    if (badge) badge.remove();
  }
  /* На мобильном скрываем список */
  document.getElementById('dialogsPanel').classList.add('hidden');
  scrollToBottom(false);
}

function closeChat() {
  document.getElementById('dialogsPanel').classList.remove('hidden');
}

/* ── Скролл вниз ── */
function scrollToBottom(smooth) {
  var el = document.getElementById('chatMessages');
  if (el) el.scrollTo({ top: el.scrollHeight, behavior: smooth ? 'smooth' : 'auto' });
}

/* ── Авторесайз textarea ── */
function autoResize(el) {
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 120) + 'px';
}

/* ── Активация кнопки отправки ── */
function updateSendBtn() {
  var val = document.getElementById('chatInput').value.trim();
  document.getElementById('sendBtn').disabled = !val;
}

/* ── Enter = отправить, Shift+Enter = перевод строки ── */
function handleInputKey(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
}

/* ── Экранирование HTML ── */
function escHtml(t) {
  return t
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br>');
}

/* ── Текущее время ── */
function nowTime() {
  var d = new Date();
  return d.getHours() + ':' + String(d.getMinutes()).padStart(2, '0');
}

/* ── Отправить сообщение ── */
function sendMessage() {
  var input  = document.getElementById('chatInput');
  var text   = input.value.trim();
  if (!text) return;

  var msgs     = document.getElementById('chatMessages');
  var typing   = document.getElementById('typingIndicator');
  var replyBar = document.getElementById('replyBar');
  var replyTxt = document.getElementById('replyText').textContent;
  var t        = nowTime();

  /* Цитата если есть */
  var quoteHtml = '';
  if (replyBar.classList.contains('visible') && replyTxt) {
    quoteHtml = '<div class="msg-quote"><strong>В ответ:</strong>' + escHtml(replyTxt) + '</div>';
    cancelReply();
  }

  /* Строим пузырь */
  var group = document.createElement('div');
  group.className = 'msg-group';
  group.innerHTML =
    '<div class="msg-row own">' +
      '<span class="msg-status"><i class="fa fa-check"></i></span>' +
      '<span class="msg-time">' + t + '</span>' +
      '<div class="msg-bubble" ondblclick="replyTo(this)">' + quoteHtml + escHtml(text) + '</div>' +
    '</div>';

  msgs.insertBefore(group, typing);

  input.value = '';
  input.style.height = 'auto';
  updateSendBtn();
  scrollToBottom(true);

  /* Через 1с — «прочитано» */
  setTimeout(function() {
    var stat = group.querySelector('.msg-status');
    if (stat) {
      stat.innerHTML = '<i class="fa fa-check-double"></i>';
      stat.classList.add('read');
    }
  }, 1000);

  /* Через 1.5с — индикатор печатания */
  setTimeout(function() {
    typing.classList.add('visible');
    scrollToBottom(true);
  }, 1500);

  /* Через 3.5с — ответ собеседника */
  setTimeout(function() {
    typing.classList.remove('visible');
    var replyGroup = document.createElement('div');
    replyGroup.className = 'msg-group';
    replyGroup.innerHTML =
      '<div class="msg-row">' +
        '<div class="msg-ava"><img src="https://api.dicebear.com/8.x/bottts/svg?seed=voidwriter&backgroundColor=061a17" alt=""/></div>' +
        '<div class="msg-bubble" ondblclick="replyTo(this)">Понял, спасибо! Продолжу работу 🙏</div>' +
        '<span class="msg-time">' + nowTime() + '</span>' +
      '</div>';
    msgs.insertBefore(replyGroup, typing);
    scrollToBottom(true);

    /* Обновляем превью в списке диалогов */
    var activePreview = document.querySelector('.dialog-item.active .di-preview');
    if (activePreview) activePreview.textContent = 'Понял, спасибо! Продолжу работу 🙏';
    var activeTime = document.querySelector('.dialog-item.active .di-time');
    if (activeTime) activeTime.textContent = nowTime();
  }, 3500);

  /* Обновляем превью немедленно */
  var activePreview = document.querySelector('.dialog-item.active .di-preview');
  if (activePreview) activePreview.textContent = text.slice(0, 40) + (text.length > 40 ? '…' : '');
  var activeTime = document.querySelector('.dialog-item.active .di-time');
  if (activeTime) activeTime.textContent = t;
}

/* ── Реакция на сообщение ── */
function toggleReact(el, emoji) {
  el.classList.toggle('reacted');
  var parts = el.textContent.match(/(\S+)\s+(\d+)/);
  if (parts) {
    var count = parseInt(parts[2]);
    el.textContent = parts[1] + ' ' + (el.classList.contains('reacted') ? count + 1 : Math.max(1, count - 1));
  }
}

/* ── Reply: двойной клик по пузырю ── */
function replyTo(bubble) {
  var text = bubble.innerText.trim().slice(0, 80);
  if (text.length === 80) text += '…';
  document.getElementById('replyText').textContent = text;
  document.getElementById('replyBar').classList.add('visible');
  document.getElementById('chatInput').focus();
}

function cancelReply() {
  document.getElementById('replyBar').classList.remove('visible');
  document.getElementById('replyText').textContent = '';
}

/* ── Emoji ── */
document.addEventListener('DOMContentLoaded', function() {
  var emojiBtn    = document.getElementById('emojiBtn');
  var emojiPicker = document.getElementById('emojiPicker');

  if (emojiBtn) {
    emojiBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      emojiPicker.classList.toggle('open');
    });
  }

  document.addEventListener('click', function() {
    if (emojiPicker) emojiPicker.classList.remove('open');
  });
});

function insertEmoji(em) {
  var inp = document.getElementById('chatInput');
  if (!inp) return;
  var pos = inp.selectionStart;
  inp.value = inp.value.slice(0, pos) + em + inp.value.slice(inp.selectionEnd);
  inp.selectionStart = inp.selectionEnd = pos + em.length;
  inp.focus();
  autoResize(inp);
  updateSendBtn();
  document.getElementById('emojiPicker').classList.remove('open');
}

/* ── Поиск по диалогам ── */
function filterDialogs(q) {
  var ql = (q || '').toLowerCase();
  document.querySelectorAll('.dialog-item').forEach(function(d) {
    var name = (d.querySelector('.di-name') || {}).textContent || '';
    var prev = (d.querySelector('.di-preview') || {}).textContent || '';
    d.style.display = (!ql || name.toLowerCase().includes(ql) || prev.toLowerCase().includes(ql)) ? '' : 'none';
  });
}

/* ── Поиск по сообщениям ── */
function toggleChatSearch() {
  var bar = document.getElementById('chatSearchBar');
  bar.classList.toggle('open');
  if (bar.classList.contains('open')) {
    document.getElementById('chatSearchInput').focus();
  } else {
    clearMessageSearch();
  }
}

function searchMessages(q) {
  var ql = (q || '').toLowerCase();
  document.querySelectorAll('.msg-bubble').forEach(function(b) {
    var original = b.getAttribute('data-original') || b.innerText;
    b.setAttribute('data-original', original);
    if (!ql) {
      b.innerHTML = escHtml(original);
      b.style.opacity = '';
      return;
    }
    if (original.toLowerCase().includes(ql)) {
      b.style.opacity = '';
      var highlighted = escHtml(original).replace(
        new RegExp('(' + escHtml(ql).replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi'),
        '<mark style="background:rgba(212,160,23,0.35);color:var(--paper);border-radius:2px;padding:0 1px;">$1</mark>'
      );
      b.innerHTML = highlighted;
    } else {
      b.style.opacity = '0.25';
    }
  });
}

function clearMessageSearch() {
  document.querySelectorAll('.msg-bubble').forEach(function(b) {
    var original = b.getAttribute('data-original');
    if (original) b.innerHTML = escHtml(original);
    b.style.opacity = '';
    b.removeAttribute('data-original');
  });
  var inp = document.getElementById('chatSearchInput');
  if (inp) inp.value = '';
}

/* ── Новый диалог (заглушка) ── */
function showNewDialog() {
  alert('Поиск пользователей для нового диалога — будет реализовано с CMS');
}

/* ── Init ── */
window.addEventListener('load', function() {
  scrollToBottom(false);
});
