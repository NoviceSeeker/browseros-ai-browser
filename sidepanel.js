const messages = document.getElementById('messages');
const chatForm = document.getElementById('chatForm');
const promptInput = document.getElementById('promptInput');
const currentUrl = document.getElementById('currentUrl');

function addMessage(type, text) {
  const message = document.createElement('div');
  message.className = `message ${type}`;

  const meta = document.createElement('div');
  meta.className = 'meta';
  meta.textContent = type === 'user' ? 'Sen' : 'Ajan';

  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  bubble.textContent = text;

  message.appendChild(meta);
  message.appendChild(bubble);
  messages.appendChild(message);
  messages.scrollTop = messages.scrollHeight;
}

async function populateActiveUrl() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  currentUrl.textContent = tab?.url || 'Pencere açık değil';
}

async function handleQuickAction(action) {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab) {
    addMessage('bot', 'Aktif bir sekme bulunamadı.');
    return;
  }

  if (action === 'summarize') {
    addMessage('bot', 'Sayfa analiz ediliyor...');
    const response = await chrome.runtime.sendMessage({ type: 'summarize-page' });
    const result = response?.data || {};
    addMessage('bot', result.summary || 'Sayfa özeti alınamadı.');
  }

  if (action === 'extract') {
    addMessage('bot', 'Sayfa içeriği taranıyor...');
    const response = await chrome.runtime.sendMessage({ type: 'extract-data' });
    const lines = response?.data || [];
    addMessage('bot', lines.slice(0, 12).join('\n') || 'Veri çıkarılamadı.');
  }

  if (action === 'mcp') {
    addMessage('bot', 'MCP araçları ayarlandı. Daha sonra tool serverları bağlanacak.');
  }

  if (action === 'voice') {
    addMessage('bot', 'Sesli giriş özelliği daha sonra eklenecek. Şu an yazılı mod aktif.');
  }
}

chatForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const prompt = promptInput.value.trim();
  if (!prompt) return;

  addMessage('user', prompt);
  promptInput.value = '';

  const response = await chrome.runtime.sendMessage({
    type: 'chat-request',
    payload: { prompt }
  });

  addMessage('bot', response?.message || 'Yanıt alınamadı.');
});

document.querySelectorAll('[data-action]').forEach((button) => {
  button.addEventListener('click', () => handleQuickAction(button.dataset.action));
});

document.getElementById('newTaskBtn').addEventListener('click', () => {
  addMessage('bot', 'Yeni görev başlatıldı. İstediğiniz iş akışını yazabilirsiniz.');
});

document.getElementById('attachBtn').addEventListener('click', () => {
  addMessage('bot', 'Dosya/ek bağlantısı daha sonra eklenecek.');
});

addMessage('bot', 'Merhaba! Bu panelle sayfayı anlayabilir, verileri çıkarabilir ve MCP araçlarını hazırlayabilirim.');
populateActiveUrl();
