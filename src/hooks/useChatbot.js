export function initChatbot() {
  const fab    = document.getElementById('chatFab');
  const panel  = document.getElementById('chatPanel');
  const body   = document.getElementById('chatBody');
  const input  = document.getElementById('chatInput');
  const send   = document.getElementById('chatSend');
  const chips  = document.getElementById('chatChips');
  const transferBtn = document.getElementById('chatTransferWa');

  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${API_KEY}`;

  const SYSTEM_PROMPT = `Eres el asistente virtual experto en ventas de Imperio Multiservicios (Soluciones y Suministros). 
Reglas estrictas:
1. Tu único propósito es responder dudas sobre los servicios de sublimación industrial y DTF de la empresa, convencer al cliente de nuestra calidad/rapidez, y persuadirlo sutilmente de contactar a un asesor real por WhatsApp.
2. NUNCA respondas preguntas de programación, código, historia, o cualquier tema que no sea impresión textil y sublimación. Si te preguntan algo fuera de tema (ej. 'hola mundo en js'), responde amablemente que solo puedes ayudar con temas de estampados y sublimación textil.
3. Sé directo, amable, persuasivo y muy seguro de tu servicio. Usa emojis.
4. Responde de manera MUY CONCISA, máximo 3 o 4 líneas.

Contexto del Negocio:
- Nuestro mayor diferenciador: Entregas ultra rápidas en 24 a 48 horas hábiles. (La competencia tarda 4 días).
- Precios de sublimación por metro: 1-9m: $15.000, 10-49m: $11.000, 50-99m: $8.000, 100m+: $7.000.
- Telas para sublimación: Deben ser poliéster o mezcla alta en poliéster (licra, perchado, microdurazno). 
- Si quieren algodón: Ofrecemos DTF.
- No hay mínimo de compra: Imprimimos desde 1 metro (ideal para emprendedores).
- Somos aliados B2B para picos de producción de empresas de confección.
- Ubicación: San Nicolás, Cali, Colombia.`;

  // Historial para Gemini API
  let conversationHistory = [
    { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
    { role: "model", parts: [{ text: "Entendido. Actuaré como el experto en ventas de Soluciones y Suministros respetando todas las reglas." }] }
  ];

  // Historial para WhatsApp (solo el chat real visible)
  let chatLogText = [];

  function toggle(){
    const abierto = panel.classList.toggle('abierto');
    fab.setAttribute('aria-expanded', abierto);
    if (abierto) input.focus();
  }
  fab.addEventListener('click', toggle);

  function agregar(texto, quien){
    const div = document.createElement('div');
    div.className = 'msg ' + quien;
    div.textContent = texto;
    body.appendChild(div);
    body.scrollTop = body.scrollHeight;
    
    // Guardar para WA
    chatLogText.push(`${quien === 'user' ? 'Cliente' : 'Asistente'}: ${texto}`);
    
    // Mostrar el botón de WA si hay mensajes reales del usuario
    if (quien === 'user' && transferBtn) {
      transferBtn.style.display = 'block';
    }
    return div;
  }

  async function llamarGemini(textoUsuario) {
    // Añadir al historial de la API
    conversationHistory.push({ role: "user", parts: [{ text: textoUsuario }] });

    const payload = {
      contents: conversationHistory,
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 200
      }
    };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      
      if (data.error) {
        console.error("Gemini API Error:", data.error);
        return "Hubo un error de conexión con mi sistema. Por favor, intenta de nuevo o escríbenos directo a WhatsApp.";
      }

      const respuestaBot = data.candidates[0].content.parts[0].text;
      
      // Guardar en historial
      conversationHistory.push({ role: "model", parts: [{ text: respuestaBot }] });
      return respuestaBot;

    } catch (err) {
      console.error(err);
      return "Hubo un problema procesando tu mensaje. Escríbenos directamente a WhatsApp.";
    }
  }

  async function enviar(textoUsuario){
    agregar(textoUsuario, 'user');
    
    const typing = document.createElement('div');
    typing.className = 'msg bot typing';
    typing.innerHTML = '<span></span><span></span><span></span>';
    body.appendChild(typing);
    body.scrollTop = body.scrollHeight;

    if (!API_KEY) {
      typing.remove();
      agregar("Error: No se encontró la API Key de Gemini en el entorno.", 'bot');
      return;
    }

    const respuestaBot = await llamarGemini(textoUsuario);
    typing.remove();
    agregar(respuestaBot, 'bot');
  }

  chips.addEventListener('click', (e)=>{
    const chip = e.target.closest('.chip');
    if (!chip) return;
    enviar(chip.textContent.trim());
  });

  send.addEventListener('click', ()=>{
    const v = input.value.trim();
    if (!v) return;
    input.value = '';
    enviar(v);
  });

  input.addEventListener('keydown', (e)=>{
    if (e.key === 'Enter') send.click();
  });

  if (transferBtn) {
    transferBtn.addEventListener('click', () => {
      const waNumber = '573046669893';
      const preamble = "¡Hola! Estuve hablando con su asistente virtual y quiero continuar la conversación. Aquí les comparto mi consulta:\n\n---\n";
      const textToWa = encodeURIComponent(preamble + chatLogText.join('\n'));
      window.open(`https://wa.me/${waNumber}?text=${textToWa}`, '_blank', 'noopener');
    });
  }
}
