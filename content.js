const floatingButtonId = 'browseros-ai-floating-button';

function createFloatingButton() {
  if (document.getElementById(floatingButtonId)) return;

  const button = document.createElement('button');
  button.id = floatingButtonId;
  button.textContent = 'AI';
  button.title = 'BrowserOS AI';

  Object.assign(button.style, {
    position: 'fixed',
    right: '22px',
    bottom: '22px',
    zIndex: '2147483647',
    border: 'none',
    borderRadius: '18px',
    padding: '14px 16px',
    background: 'linear-gradient(135deg, #4f8cff, #7c5cff)',
    color: '#fff',
    fontWeight: '800',
    fontSize: '14px',
    cursor: 'pointer',
    boxShadow: '0 22px 40px rgba(79, 140, 255, 0.4)',
    letterSpacing: '0.04em'
  });

  button.addEventListener('click', async () => {
    const response = await chrome.runtime.sendMessage({ type: 'get-page-content' });
    const payload = response?.data || {};
    const message = payload.title ? `${payload.title}\n\n${payload.url}` : 'Sayfa bilgisi alınamadı.';
    alert(message);
  });

  document.body.appendChild(button);
}

createFloatingButton();
