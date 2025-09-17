(() => {
  const countEl = document.getElementById('count');
  const inc = document.getElementById('inc');
  const dec = document.getElementById('dec');
  let count = Number(localStorage.getItem('demo-count') || '0');
  const render = () => (countEl.textContent = String(count));
  render();
  inc.addEventListener('click', () => { count++; localStorage.setItem('demo-count', String(count)); render(); });
  dec.addEventListener('click', () => { count--; localStorage.setItem('demo-count', String(count)); render(); });
  const infoEl = document.getElementById('build-info');
  const time = new Date().toISOString();
  infoEl.textContent = `Built at: ${time}\nUserAgent: ${navigator.userAgent}`;

  // placecat.com demo: 讀取 config.json 組出圖片 URL
  const catImg = document.getElementById('cat');
  const sizeEl = document.getElementById('size');
  const urlEl = document.getElementById('url');
  fetch('config.json', { cache: 'no-store' })
    .then(r => r.json())
    .then(cfg => {
      const w = Number(cfg.width || 400);
      const h = Number(cfg.height || 300);
      const url = `https://placecats.com/${w}/${h}`;
      sizeEl.textContent = `${w} x ${h}`;
      urlEl.textContent = url;
      catImg.src = url;
    })
    .catch(() => {
      sizeEl.textContent = '讀取 config.json 失敗';
    });
})();


