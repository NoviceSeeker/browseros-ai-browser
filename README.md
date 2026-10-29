# BrowserOS AI Browser Starter

This project is a BrowserOS-style AI browser starter built as a Chrome extension.

Features:
- floating AI button on pages
- side panel assistant UI
- quick actions for summarize/extract
- browser page analysis hooks
- MCP-ready foundation for future tool integrations

## Load in Chrome

1. Open `chrome://extensions`
2. Turn on Developer mode
3. Click `Load unpacked`
4. Select this folder
5. Open any page and use the floating AI button or the extension popup

## Files

- `manifest.json` — Chrome extension config
- `background.js` — page analysis and runtime message handling
- `content.js` — creates floating AI button on pages
- `popup.html` / `popup.js` — quick action popup UI
- `sidepanel.html` / `sidepanel.css` / `sidepanel.js` — assistant side panel UI

## Next steps

This starter is intentionally simple and demo-ready. The next enhancements are:
- real OpenAI-compatible API integration
- MCP tool runner
- voice input / TTS
- browser automation actions
- broader BrowserOS-like UI
