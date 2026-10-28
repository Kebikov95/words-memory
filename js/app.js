// Ядро: вход/профили, тема, экраны, тосты, статистика
window.WM = window.WM || {};

WM.esc = s => String(s)
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;').replaceAll("'", '&#39;');

WM.app = (() => {
  const $ = sel => document.querySelector(sel);
  const esc = WM.esc;

  const state = { uid: null, user: null, lang: 'it' };
  let toastTimer = null;
  let confirmResolve = null;
  let modulesBound = false;

  // ---------- служебное ----------

  function showView(name) {
    ['auth', 'app', 'game', 'results'].forEach(v =>
      $('#view-' + v).classList.toggle('hidden', v !== name));
  }

  function toast(msg, isErr = false) {
    const t = $('#toast');
    t.textContent = msg;
    t.className = 'toast' + (isErr ? ' err' : '');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.add('hidden'), 2600);
  }

  function confirm(text, okLabel = 'Удалить') {
    return new Promise(resolve => {
      confirmResolve = resolve;
      $('#confirm-text').textContent = text;
      $('#confirm-yes').textContent = okLabel;
      $('#modal-confirm').showModal();
    });
  }

  // ---------- тема ----------

  function applyTheme() {
    const stored = localStorage.getItem('wm_theme') || '';
    document.documentElement.dataset.theme = stored;
    $('#btn-theme').innerHTML = effectiveDark() ? ICONS.sun : ICONS.moon;
  }
  const effectiveDark = () =>
    (localStorage.getItem('wm_theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')) === 'dark';

  function toggleTheme() {
    localStorage.setItem('wm_theme', effectiveDark() ? 'light' : 'dark');
    applyTheme();
  }

  // ---------- вход ----------

  function renderAuth() {
    showView('auth');
    const users = WM.storage.getUsers();
    const box = $('#auth-users');
    if (!users.length) { box.innerHTML = ''; return; }
    box.innerHTML = `<div class="hint" style="margin-bottom:4px">Продолжить как…</div>` + users.map(u => `
      <button class="auth-user-btn" data-uid="${u.id}">
        <span class="auth-user-ava">${esc(u.name[0].toUpperCase())}</span>
        <span class="auth-user-name">${esc(u.name)}</span>
        ${u.pin ? `<span class="auth-user-lock">${ICONS.lock}</span>` : ''}
      </button>`).join('');

    box.querySelectorAll('[data-uid]').forEach(btn => {
      btn.addEventListener('click', () => {
        const user = users.find(u => u.id === btn.dataset.uid);
        if (user.pin) askPin(user);
        else enterApp(user);
      });
    });
  }

  function askPin(user) {
    const box = $('#auth-users');
    box.innerHTML = `
      <form class="auth-form" id="pin-form">
        <div class="hint">Профиль «${esc(user.name)}» защищён PIN-кодом</div>
        <input type="password" id="pin-input" placeholder="PIN" maxlength="12" inputmode="numeric" autocomplete="off">
        <div style="display:flex;gap:8px">
          <button type="button" class="btn btn-ghost" id="pin-back">Назад</button>
          <button type="submit" class="btn btn-primary" style="flex:1">Войти</button>
        </div>
      </form>`;
    $('#pin-back').addEventListener('click', renderAuth);
    $('#pin-input').focus();
    $('#pin-form').addEventListener('submit', async e => {
      e.preventDefault();
      if (await WM.storage.verifyPin(user, $('#pin-input').value)) enterApp(user);
      else toast('Неверный PIN', true);
    });
  }

  async function createProfile(e) {
    e.preventDefault();
    const name = $('#auth-name').value.trim();
    if (!name) return;
    try {
      const user = await WM.storage.createUser(name, $('#auth-pin').value.trim());
      enterApp(user);
    } catch (err) {
      toast(err.message, true);
    }
  }

  function enterApp(user) {
    state.uid = user.id;
    state.user = user;
    WM.storage.setCurrentUser(user.id);

    $('#btn-profile').innerHTML =
      `<span class="auth-user-ava" style="width:26px;height:26px;font-size:12px">${esc(user.name[0].toUpperCase())}</span>${esc(user.name)}`;

    if (!modulesBound) {
      bindApp();
      modulesBound = true;
    }
    showView('app');
    showPage('words');
  }

  function logout() {
    WM.storage.clearCurrentUser();
    state.uid = state.user = null;
    location.reload();
  }

  // ---------- приложение ----------

  function bindApp() {
    WM.words.init();
    WM.games.init();
    WM.groups.init();

    // страницы: Словарь / Группы
    $('#nav-words').addEventListener('click', () => showPage('words'));
    $('#nav-groups').addEventListener('click', () => showPage('groups'));

    // вкладки
    document.querySelectorAll('.tab').forEach(tab =>
      tab.addEventListener('click', () => setLang(tab.dataset.lang)));

    // импорт/экспорт
    $('#btn-export').innerHTML = ICONS.download;
    $('#btn-import').innerHTML = ICONS.upload;
    $('#btn-export').addEventListener('click', () => {
      const words = WM.storage.getWords(state.uid);
      if (!words.length) return toast('Словарь пуст — нечего экспортировать', true);
      WM.io.exportJSON(state.user, words);
      toast(`Экспортировано слов: ${words.length}`);
    });
    $('#btn-import').addEventListener('click', () => $('#file-import').click());
    $('#file-import').addEventListener('change', async e => {
      const file = e.target.files[0];
      if (!file) return;
      try {
        const { added, skipped } = await WM.io.importJSON(file, state.uid);
        WM.words.render();
        toast(`Импорт: добавлено ${added}, пропущено ${skipped}`);
      } catch (err) {
        toast(err.message, true);
      }
      e.target.value = '';
    });

    // профиль, тема, статистика, настройки
    $('#btn-profile').addEventListener('click', async () => {
      if (await confirm(`Выйти из профиля «${state.user.name}»? Данные останутся сохранены.`, 'Выйти')) logout();
    });
    $('#btn-theme').addEventListener('click', toggleTheme);
    $('#btn-stats').innerHTML = ICONS.chart;
    $('#btn-stats').addEventListener('click', openStats);

    // подтверждение
    $('#confirm-yes').addEventListener('click', () => { $('#modal-confirm').close(); confirmResolve?.(true); });
    $('#confirm-no').addEventListener('click', () => { $('#modal-confirm').close(); confirmResolve?.(false); });

    // закрытие модалок
    document.querySelectorAll('.modal [data-close]').forEach(btn => {
      btn.innerHTML = ICONS.x;
      btn.addEventListener('click', () => btn.closest('dialog').close());
    });
    document.querySelectorAll('dialog.modal').forEach(d =>
      d.addEventListener('click', e => { if (e.target === d) d.close(); }));

    // иконки
    $('#ic-add').innerHTML = ICONS.plus;
    $('#ic-play').innerHTML = ICONS.play;
    $('#ic-play2').innerHTML = ICONS.play;
    $('#btn-game-exit').innerHTML = ICONS.x;
  }

  function setLang(lang) {
    state.lang = lang;
    document.querySelectorAll('.tab').forEach(t =>
      t.classList.toggle('active', t.dataset.lang === lang));
    WM.words.render();
  }

  function showPage(page) {
    $('#page-words').classList.toggle('hidden', page !== 'words');
    $('#page-groups').classList.toggle('hidden', page !== 'groups');
    document.querySelector('.tabs').style.display = page === 'groups' ? 'none' : '';
    document.querySelectorAll('.page-tab').forEach(t =>
      t.classList.toggle('active', t.dataset.page === page));
    if (page === 'groups') WM.groups.render();
    else WM.words.render();
  }

  function openStats() {    const stats = WM.storage.getStats(state.uid);
    const words = WM.storage.getWords(state.uid);
    const it = words.filter(w => w.lang === 'it').length;
    const en = words.filter(w => w.lang === 'en').length;
    const avg = stats.length
      ? Math.round(stats.reduce((s, x) => s + x.percent, 0) / stats.length)
      : 0;

    const fmtDate = iso => new Date(iso).toLocaleString('ru-RU',
      { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
    const modeName = id => ({
      assemble: 'Сборка', dictation: 'Диктант', 'match-word': 'Слово↔перевод',
      'match-image': 'Картинка↔перевод', mix: 'Микс',
    }[id] || id);

    $('#stats-content').innerHTML = `
      <div class="stat-line"><span>Всего слов</span><b>${words.length} (🇮🇹 ${it} · 🇬🇧 ${en})</b></div>
      <div class="stat-line"><span>Голос озвучки</span><b>🇮🇹 ${WM.tts.currentVoice('it') || 'системный'} · 🇬🇧 ${WM.tts.currentVoice('en') || 'системный'}</b></div>
      <div class="stat-line"><span>Тренировок пройдено</span><b>${stats.length}</b></div>
      <div class="stat-line"><span>Средний результат</span><b>${avg}%</b></div>
      ${stats.slice(-5).reverse().map(s =>
        `<div class="stat-line"><span>${fmtDate(s.date)} · ${modeName(s.mode)}</span><b>${s.percent}% (${s.correct}/${s.total})</b></div>`).join('')}
    `;
    $('#modal-stats').showModal();
  }

  // ---------- запуск ----------

  function init() {
    WM.tts.init();
    applyTheme();
    $('#auth-create').addEventListener('submit', createProfile);

    const cur = WM.storage.currentUserId();
    const user = cur && WM.storage.getUsers().find(u => u.id === cur);
    if (user) enterApp(user);
    else renderAuth();
  }

  return { state, init, showView, toast, confirm };
})();

WM.app.init();
