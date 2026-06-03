/* ── detik AI Floating Widget (Merged — all scenarios) ── */
(function () {

  const SCENARIO_GROUPS = [
    {
      label: 'Hukum',
      color: '#f59e0b',
      items: [
        { q: 'Siapa Tom Lembong dan kenapa ia jadi tersangka?', icon: '⚖️', scenario: 'tom_lembong', url: 'ai-chat.html' }
      ]
    },
    {
      label: 'Kesehatan',
      color: '#10b981',
      items: [
        { q: 'Wabah campak 2026: seberapa luas penyebarannya?',      icon: '🦠', scenario: 'campak_outbreak', url: 'ai-chat.html' },
        { q: 'Campak ini berbahaya nggak?',                           icon: '💉', scenario: 'campak_bahaya',  url: 'ai-chat.html' },
        { q: 'Masih bahaya nggak campaknya? Ada perkembangan baru?',  icon: '🔄', scenario: 'campak_depth',   url: 'ai-chat.html' },
        { q: 'Kirana sudah vaksin kemarin. Masih perlu khawatir?',    icon: '✅', scenario: 'campak_resolved',url: 'ai-chat.html' }
      ]
    },
    {
      label: 'Properti',
      color: '#818cf8',
      items: [
        { q: 'Kapan waktu terbaik untuk take over KPR?', icon: '💵', scenario: 'cicilan_kpr', url: 'ai-chat.html' }
      ]
    }
  ];

  const SCENARIOS = SCENARIO_GROUPS.flatMap(g => g.items);

  const css = `
    #detik-ai-fab {
      position: fixed;
      bottom: 28px;
      right: 28px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 12px;
      font-family: 'Lato', sans-serif;
    }
    #detik-ai-bubble-btn {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: #e8192c;
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 20px rgba(232,25,44,0.45);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.2s, box-shadow 0.2s;
      position: relative;
      flex-shrink: 0;
    }
    #detik-ai-bubble-btn:hover { transform: scale(1.08); box-shadow: 0 6px 28px rgba(232,25,44,0.55); }
    #detik-ai-bubble-btn svg { display: block; }
    .detik-ai-pulse {
      position: absolute;
      inset: -4px;
      border-radius: 50%;
      border: 2px solid rgba(232,25,44,0.4);
      animation: aipulse 2s ease-out infinite;
    }
    @keyframes aipulse { 0% { transform: scale(1); opacity: 1; } 100% { transform: scale(1.5); opacity: 0; } }
    #detik-ai-badge {
      position: absolute;
      top: -2px;
      right: -2px;
      width: 16px;
      height: 16px;
      background: #fff;
      border-radius: 50%;
      border: 2px solid #e8192c;
      font-size: 9px;
      font-weight: 900;
      color: #e8192c;
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 1;
    }
    #detik-ai-panel {
      width: 360px;
      background: #fff;
      border-radius: 14px;
      box-shadow: 0 8px 40px rgba(0,0,0,0.18);
      display: none;
      flex-direction: column;
      overflow: hidden;
      border: 1px solid #eee;
      max-height: 540px;
    }
    #detik-ai-panel.open { display: flex; animation: panelIn 0.22s cubic-bezier(.34,1.56,.64,1) both; }
    @keyframes panelIn { from { opacity: 0; transform: scale(0.88) translateY(12px); } to { opacity: 1; transform: scale(1) translateY(0); } }
    .ai-panel-head { background: #e8192c; padding: 12px 16px; display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
    .ai-panel-head .ai-avatar { width: 32px; height: 32px; border-radius: 50%; background: rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .ai-panel-head .ai-info { flex: 1; }
    .ai-panel-head .ai-name { font-size: 14px; font-weight: 900; color: #fff; }
    .ai-panel-head .ai-status { font-size: 11px; color: rgba(255,255,255,0.8); display: flex; align-items: center; gap: 4px; }
    .ai-panel-head .ai-status::before { content:''; width:6px; height:6px; border-radius:50%; background:#4ade80; display:inline-block; }
    .ai-panel-head .close-btn { background: none; border: none; color: rgba(255,255,255,0.7); font-size: 20px; cursor: pointer; line-height: 1; padding: 0; }
    .ai-panel-head .close-btn:hover { color: #fff; }
    .ai-panel-msgs { flex: 1; overflow-y: auto; padding: 14px 14px 8px; display: flex; flex-direction: column; gap: 10px; background: #fafafa; min-height: 160px; }
    .ai-msg { max-width: 88%; font-size: 13px; line-height: 1.55; padding: 9px 12px; border-radius: 12px; animation: msgIn 0.18s ease both; }
    @keyframes msgIn { from { opacity:0; transform: translateY(6px); } to { opacity:1; transform: translateY(0); } }
    .ai-msg.bot { background: #fff; border: 1px solid #eee; border-bottom-left-radius: 3px; align-self: flex-start; color: #1a1a1a; }
    .ai-msg.user { background: #e8192c; color: #fff; border-bottom-right-radius: 3px; align-self: flex-end; }
    .ai-suggestions {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 8px 14px 10px;
      background: #fafafa;
      overflow-y: auto;
      max-height: 210px;
    }
    .ai-sug-group { display: flex; flex-direction: column; gap: 4px; }
    .ai-sug-group-label {
      font-size: 9px;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      display: flex;
      align-items: center;
      gap: 5px;
    }
    .ai-sug-group-label::before {
      content: '';
      display: inline-block;
      width: 5px; height: 5px;
      border-radius: 50%;
    }
    .ai-sug-btn {
      background: #fff;
      border: 1px solid #e5e5e5;
      color: #1a1a1a;
      border-radius: 8px;
      padding: 6px 10px;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      text-align: left;
      font-family: inherit;
      transition: border-color 0.15s, background 0.15s;
      display: flex;
      align-items: center;
      gap: 7px;
      line-height: 1.4;
    }
    .ai-sug-btn .sug-icon { flex-shrink: 0; font-size: 13px; }
    .ai-sug-btn .sug-text { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .ai-sug-btn:hover { border-color: #e8192c; background: #fff5f5; }
    .ai-panel-footer { border-top: 1px solid #eee; padding: 10px 12px; display: flex; gap: 8px; background: #fff; flex-shrink: 0; }
    .ai-panel-footer input { flex: 1; border: 1px solid #ddd; border-radius: 20px; padding: 8px 14px; font-size: 13px; outline: none; font-family: inherit; }
    .ai-panel-footer input:focus { border-color: #e8192c; }
    .ai-panel-footer .send-btn { width: 34px; height: 34px; border-radius: 50%; background: #e8192c; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: opacity 0.15s; }
    .ai-panel-footer .send-btn:hover { opacity: 0.85; }
  `;

  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  const sugBtnsHtml = SCENARIO_GROUPS.map(g => `
    <div class="ai-sug-group">
      <div class="ai-sug-group-label" style="color:${g.color}; --dot:${g.color};">
        <span style="width:5px;height:5px;border-radius:50%;background:${g.color};flex-shrink:0;"></span>
        ${g.label}
      </div>
      ${g.items.map(s => `<button class="ai-sug-btn" data-q="${s.q}"><span class="sug-icon">${s.icon}</span><span class="sug-text">${s.q}</span></button>`).join('')}
    </div>`).join('');

  const fab = document.createElement('div');
  fab.id = 'detik-ai-fab';
  fab.innerHTML = `
    <div id="detik-ai-panel">
      <div class="ai-panel-head">
        <div class="ai-avatar">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="white" stroke-width="1.5" fill="none"/>
            <path d="M8 10h8M8 14h5" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </div>
        <div class="ai-info">
          <div class="ai-name">detik AI</div>
          <div class="ai-status">Online — siap membantu</div>
        </div>
        <button class="close-btn" id="detik-ai-close">&times;</button>
      </div>
      <div class="ai-panel-msgs" id="detik-ai-msgs"></div>
      <div class="ai-suggestions" id="detik-ai-sugs">
        ${sugBtnsHtml}
      </div>
      <div class="ai-panel-footer">
        <input id="detik-ai-input" type="text" placeholder="Ketik pertanyaanmu..." autocomplete="off" />
        <button class="send-btn" id="detik-ai-send">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
          </svg>
        </button>
      </div>
    </div>

    <button id="detik-ai-bubble-btn" title="detik AI">
      <span class="detik-ai-pulse"></span>
      <span id="detik-ai-badge">AI</span>
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" fill="white" fill-opacity="0.15"/>
        <path d="M8 10h8M8 14h5" stroke="white" stroke-width="2" stroke-linecap="round"/>
        <path d="M12 3v2M12 19v2M3 12h2M19 12h2" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
        <circle cx="12" cy="12" r="3" stroke="white" stroke-width="1.5" fill="none"/>
      </svg>
    </button>
  `;
  document.body.appendChild(fab);

  const panel     = document.getElementById('detik-ai-panel');
  const bubbleBtn = document.getElementById('detik-ai-bubble-btn');
  const closeBtn  = document.getElementById('detik-ai-close');
  const msgs      = document.getElementById('detik-ai-msgs');
  const input     = document.getElementById('detik-ai-input');
  const sendBtn   = document.getElementById('detik-ai-send');
  const sugs      = document.getElementById('detik-ai-sugs');

  bubbleBtn.addEventListener('click', () => {
    panel.classList.toggle('open');
    if (panel.classList.contains('open') && msgs.children.length === 0) {
      addMsg('bot', 'Halo! Saya detik AI. Teman kamu dalam memahami peristiwa.');
    }
    if (panel.classList.contains('open')) input.focus();
  });
  closeBtn.addEventListener('click', () => panel.classList.remove('open'));

  function addMsg(role, html) {
    const el = document.createElement('div');
    el.className = `ai-msg ${role}`;
    el.innerHTML = html;
    msgs.appendChild(el);
    msgs.scrollTop = msgs.scrollHeight;
    return el;
  }

  function showSugs() {
    sugs.style.display = 'flex';
  }

  function hideSugs() {
    sugs.style.display = 'none';
  }

  function ask(text) {
    const trimmed = text.trim();
    hideSugs();
    addMsg('user', trimmed);

    const match = SCENARIOS.find(s => s.q === trimmed);

    if (match) {
      addMsg('bot', 'Mengarahkan ke chat lengkap...');
      sessionStorage.setItem('detik_ai_scenario', match.scenario);
      sessionStorage.setItem('detik_ai_first_query', match.q);
      setTimeout(() => { window.location.href = match.url; }, 600);
    } else {
      addMsg('bot', 'Saat ini saya hanya dapat menjawab topik-topik berikut. Pilih salah satu di bawah atau ketik ulang pertanyaanmu:');
      setTimeout(showSugs, 600);
    }
  }

  sugs.querySelectorAll('.ai-sug-btn').forEach(btn => {
    btn.addEventListener('click', () => ask(btn.dataset.q));
  });

  sendBtn.addEventListener('click', () => {
    const val = input.value.trim();
    if (!val) return;
    input.value = '';
    ask(val);
  });

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') sendBtn.click();
  });

})();
