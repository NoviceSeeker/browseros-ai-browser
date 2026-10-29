chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get(['apiBaseUrl', 'apiKey', 'model'], (result) => {
    if (!result.apiBaseUrl) {
      chrome.storage.sync.set({
        apiBaseUrl: 'https://api.openai.com/v1',
        model: 'gpt-4o-mini',
        apiKey: ''
      });
    }
  });

  if (chrome.sidePanel) {
    chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'get-page-content') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      if (!tab?.id) {
        sendResponse({ success: false, error: 'No active tab' });
        return;
      }

      chrome.scripting.executeScript(
        {
          target: { tabId: tab.id },
          func: () => ({
            title: document.title || 'Untitled page',
            text: document.body ? (document.body.innerText || '').slice(0, 12000) : '',
            url: window.location.href
          })
        },
        (results) => {
          const result = results?.[0]?.result || null;
          sendResponse({ success: !!result, data: result });
        }
      );
    });
    return true;
  }

  if (message.type === 'summarize-page') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      if (!tab?.id) {
        sendResponse({ success: false, error: 'No active tab' });
        return;
      }

      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => ({
          title: document.title || 'Untitled page',
          text: document.body ? (document.body.innerText || '') : '',
          url: window.location.href
        })
      }, (results) => {
        const page = results?.[0]?.result || { title: 'Untitled', text: '', url: '' };
        sendResponse({ success: true, data: buildSummary(page) });
      });
    });
    return true;
  }

  if (message.type === 'extract-data') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      if (!tab?.id) {
        sendResponse({ success: false, error: 'No active tab' });
        return;
      }

      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          const text = document.body ? (document.body.innerText || '') : '';
          return text
            .split(/\n+/)
            .map((line) => line.trim())
            .filter(Boolean)
            .slice(0, 60);
        }
      }, (results) => {
        const lines = results?.[0]?.result || [];
        sendResponse({ success: true, data: lines });
      });
    });
    return true;
  }

  if (message.type === 'chat-request') {
    const prompt = message.payload?.prompt || 'No prompt';
    const response = {
      ok: true,
      message: `İstek alındı: ${prompt}\n\nBu demo sürümünde gerçek LLM çağrısı kullanılmıyor. Sonraki adımda OpenAI-compatible API veya yerel model bağlayacağız.`
    };
    sendResponse(response);
    return true;
  }

  if (message.type === 'get-config') {
    chrome.storage.sync.get(['apiBaseUrl', 'model'], (result) => {
      sendResponse({ success: true, data: result });
    });
    return true;
  }

  return false;
});

function buildSummary(page) {
  const text = page.text || '';
  const sample = text
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 7)
    .join(' ');

  return {
    title: page.title || 'Untitled page',
    url: page.url || '',
    summary: `Bu sayfanın başlığı "${page.title || 'Untitled page'}". Sayfa içeriği genel olarak: ${sample.slice(0, 240)}${sample.length > 240 ? '...' : ''}`
  };
}
