(() => {
  // 移除互動小工具與版本資訊相關程式

  const catImg = document.getElementById('cat');
  const sizeEl = document.getElementById('size');
  const urlEl = document.getElementById('url');
  const wInput = document.getElementById('w-input');
  const hInput = document.getElementById('h-input');
  const previewBtn = document.getElementById('preview');
  const copyBtn = document.getElementById('copy-json');
  const msgEl = document.getElementById('msg');
  const toggleBtn = document.getElementById('sidebar-toggle');
  const sidebar = document.getElementById('sidebar-panel');
  const revealBtn = document.getElementById('sidebar-reveal');
  const stage = document.getElementById('stage');
  const img = document.getElementById('cat');
  const stageRight = document.getElementById('stage-right');
  const setLoading = (v) => {
    if (!stage) return;
    stage.classList.toggle('loading', !!v);
  };
  fetch('/config.json', { cache: 'no-store' })
    .then(r => r.json())
    .then(cfg => {
      // 標題與主題
      const title = typeof cfg.title === 'string' ? cfg.title : undefined;
      if (title) {
        const h1 = document.getElementById('title');
        if (h1) h1.textContent = title;
        document.title = title;
      }
      const subtitle = typeof cfg.subtitle === 'string' ? cfg.subtitle : undefined;
      if (subtitle) {
        const sub = document.getElementById('subtitle');
        if (sub) sub.textContent = subtitle;
      }
      const stageTitle = typeof cfg.stageTitle === 'string' ? cfg.stageTitle : undefined;
      if (stageTitle) {
        const st = document.getElementById('stage-title');
        if (st) st.textContent = stageTitle;
      }
      // 移除自訂 accent 支援，統一由主題定義色票
      const theme = (cfg.theme || 'light').toLowerCase();
      document.documentElement.setAttribute('data-theme', theme);

      const w = Number(cfg.width || 400);
      const h = Number(cfg.height || 300);
      const url = `https://placecats.com/${w}/${h}`;
      sizeEl.textContent = `${w} x ${h}`;
      urlEl.textContent = url;
      setLoading(true);
      img.onload = () => setLoading(false);
      img.onerror = () => { setLoading(false); img.alt = '圖片載入失敗'; };
      catImg.src = url;
      if (wInput) wInput.value = String(w);
      if (hInput) hInput.value = String(h);

      // 右側面板：依 config 切換 editor 或 calculator
      const mode = (cfg.rightPanel || 'editor').toLowerCase();
      if (stageRight) {
        if (mode === 'editor') {
          stageRight.innerHTML = `
            <div class="card">
              <h3>喵喵編輯器</h3>
              <textarea id="meow-input" class="meow-editor" placeholder="在此輸入內容，實際顯示將會變成喵喵語..." rows="10"></textarea>
              <div style="height:8px"></div>
              <div class="meow-display" id="meow-output"></div>
            </div>`;
          const input = document.getElementById('meow-input');
          const output = document.getElementById('meow-output');
          const toMeow = (text) => text.replace(/[^\n]/g, '喵');
          input.value = localStorage.getItem('meow-input') || (cfg.notes || '');
          output.textContent = toMeow(input.value);
          input.addEventListener('input', () => {
            localStorage.setItem('meow-input', input.value);
            output.textContent = toMeow(input.value);
          });
        } else if (mode === 'calculator') {
          stageRight.innerHTML = `
            <div class="card">
              <h3>貓咪計算機</h3>
              <div class="meow-calc">
                <input id="calc-display" placeholder="請使用下方按鍵" readonly aria-readonly="true" />
                <button data-k="7">7</button>
                <button data-k="8">8</button>
                <button data-k="9">9</button>
                <button data-k="/">/</button>
                <button data-k="4">4</button>
                <button data-k="5">5</button>
                <button data-k="6">6</button>
                <button data-k="*">*</button>
                <button data-k="1">1</button>
                <button data-k="2">2</button>
                <button data-k="3">3</button>
                <button data-k="-">-</button>
                <button data-k="0">0</button>
                <button data-k=".">.</button>
                <button id="calc-eq">=</button>
                <button data-k="+">+</button>
              </div>
            </div>`;
          const disp = document.getElementById('calc-display');
          const eq = document.getElementById('calc-eq');
          let expr = '';
          disp.value = '';
          // 禁止鍵盤輸入
          disp.addEventListener('keydown', (e) => e.preventDefault());
          stageRight.querySelectorAll('button[data-k]').forEach(btn => {
            btn.addEventListener('click', () => {
              expr += btn.getAttribute('data-k') || '';
              disp.value = expr;
            });
          });
          const compute = () => { disp.value = 'MEOW'; expr = ''; };
          eq.addEventListener('click', compute);
        }
      }
    })
    .catch(() => {
      sizeEl.textContent = '讀取 config.json 失敗';
    });

  const clamp = (val, min, max) => Math.min(Math.max(val, min), max);
  const doPreview = (w, h) => {
    const url = `https://placecats.com/${w}/${h}`;
    sizeEl.textContent = `${w} x ${h}`;
    urlEl.textContent = url;
    setLoading(true);
    img.onload = () => setLoading(false);
    img.onerror = () => { setLoading(false); img.alt = '圖片載入失敗'; };
    catImg.src = url;
  };
  let debounceTimer;
  const updatePreview = () => {
    const rawW = Number(wInput.value || 400);
    const rawH = Number(hInput.value || 300);
    const w = clamp(rawW, 50, 1200);
    const h = clamp(rawH, 50, 800);
    if (rawW !== w || rawH !== h) {
      msgEl.textContent = `已自動調整到建議範圍：${w}x${h}`;
    } else {
      msgEl.textContent = '';
    }
    wInput.value = String(w);
    hInput.value = String(h);
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => doPreview(w, h), 200);
  };

  if (previewBtn) previewBtn.addEventListener('click', updatePreview);
  if (wInput) wInput.addEventListener('change', updatePreview);
  if (hInput) hInput.addEventListener('change', updatePreview);

  if (copyBtn) copyBtn.addEventListener('click', async () => {
    const w = Math.max(1, Number(wInput.value || 400));
    const h = Math.max(1, Number(hInput.value || 300));
    const json = JSON.stringify({ width: w, height: h }, null, 2);
    try {
      await navigator.clipboard.writeText(json);
      copyBtn.textContent = '已複製！';
      setTimeout(() => (copyBtn.textContent = '複製 config.json'), 1200);
    } catch {
      alert('複製失敗，請手動複製');
    }
  });

  // Sidebar 展開/收合
  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', () => {
      const hidden = sidebar.getAttribute('aria-hidden') === 'true';
      sidebar.setAttribute('aria-hidden', hidden ? 'false' : 'true');
      toggleBtn.setAttribute('aria-expanded', hidden ? 'true' : 'false');
      toggleBtn.textContent = hidden ? '收合' : '展開';
      if (revealBtn) revealBtn.style.display = hidden ? 'none' : 'inline-block';
    });
  }

  if (revealBtn && sidebar) {
    revealBtn.addEventListener('click', () => {
      sidebar.setAttribute('aria-hidden', 'false');
      if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'true');
      if (toggleBtn) toggleBtn.textContent = '收合';
      revealBtn.style.display = 'none';
    });
  }

  // 已改為固定 Sidebar，移除拖曳邏輯
})();


