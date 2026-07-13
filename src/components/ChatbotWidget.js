export function ChatbotWidget() {
  return `
<button class="chat-fab" id="chatFab" aria-label="Abrir asistente" aria-expanded="false">
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a8 8 0 0 1-8 8H5l-2 2V12a8 8 0 0 1 8-8h2a8 8 0 0 1 8 8z"/></svg>
</button>

<div class="chat-panel" id="chatPanel" role="dialog" aria-label="Asistente S&S">
  <div class="chat-head">
    <span class="dot"></span>
    <div><b>Asistente S&amp;S</b><small>Responde en segundos · 24/7</small></div>
  </div>
  <div class="chat-body" id="chatBody">
    <div class="msg bot">¡Hola! 👋 Soy el asistente de Soluciones y Suministros. Puedo ayudarte con precios, tiempos de entrega y elección de telas. ¿Qué necesitas?</div>
  </div>
  <div class="chips" id="chatChips">
    <button class="chip" data-q="precios">💰 ¿Cuánto cuesta?</button>
    <button class="chip" data-q="tiempos">⚡ ¿Tiempos de entrega?</button>
    <button class="chip" data-q="telas">🧵 ¿Qué telas puedo usar?</button>
  </div>
  <div class="chat-input">
    <input type="text" id="chatInput" placeholder="Escribe tu pregunta…" aria-label="Escribe tu pregunta">
    <button id="chatSend" aria-label="Enviar">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
    </button>
  </div>
  <div class="chat-badge">
    <span>Asistente impulsado por Inteligencia Artificial</span>
    <button id="chatTransferWa" class="btn-transfer-wa" aria-label="Transferir a WhatsApp" style="display:none; width: 100%; margin-top: 8px; padding: 6px; background: #25D366; color: white; border: none; border-radius: 4px; font-weight: bold; cursor: pointer;">
      Continuar por WhatsApp
    </button>
  </div>
</div>`;
}
