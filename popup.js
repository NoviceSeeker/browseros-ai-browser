document.getElementById('openPanelBtn').addEventListener('click', async () => {
  const currentWindow = await chrome.windows.getCurrent();
  if (chrome.sidePanel) {
    await chrome.sidePanel.open({ windowId: currentWindow.id });
  }
});

document.getElementById('summaryBtn').addEventListener('click', async () => {
  const response = await chrome.runtime.sendMessage({ type: 'summarize-page' });
  const summary = response?.data?.summary || 'Sayfa özeti alınamadı.';
  alert(summary);
});
