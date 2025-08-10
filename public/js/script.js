// script.js — same UI, posts to /api/chat
const messagesEl = document.getElementById('messages');
const inputEl = document.getElementById('input');
const sendBtn = document.getElementById('sendBtn');
const micBtn = document.getElementById('micBtn');
const autoSpeakEl = document.getElementById('autoSpeak');

function appendMessage(text, who='bot'){
  const div = document.createElement('div');
  div.className = 'message ' + (who === 'user' ? 'user' : 'bot');
  div.textContent = text;
  messagesEl.appendChild(div);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

async function sendMessage(text){
  appendMessage(text, 'user');
  inputEl.value = '';
  try{
    const r = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text })
    });
    const data = await r.json();
    const reply = data.reply || (data.error ? ('Error: ' + data.error) : 'No reply');
    appendMessage(reply, 'bot');
    if (autoSpeakEl.checked) speakText(reply);
  }catch(err){
    console.error(err);
    appendMessage('Network error', 'bot');
  }
}

sendBtn.onclick = () => {
  const v = inputEl.value.trim();
  if (!v) return;
  sendMessage(v);
};

inputEl.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') sendBtn.click();
});

// Speech synthesis
function speakText(text){
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const ut = new SpeechSynthesisUtterance(text);

  window.speechSynthesis.speak(ut);
}

// Speech recognition (voice input)
let recognition = null;
let recognizing = false;
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window){
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SR();
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  let keepListening = false;

  recognition.onstart = () => {
    recognizing = true;
    micBtn.textContent = '⏺️';
    micBtn.classList.add('on');
  };
  recognition.onend = () => {
    recognizing = false;
    micBtn.textContent = '🎤';
    micBtn.classList.remove('on');
    if (keepListening) {
      try { recognition.start(); } catch (e) { /* ignore */ }
    }
  };
  recognition.onerror = (e) => {
  console.error('Speech Recognition error:', e.error);
  alert('Speech recognition error: ' + e.error + '. Please check your internet connection.');
  recognizing = false;
  micBtn.textContent = '🎤';
  micBtn.classList.remove('on');
};
  recognition.onresult = (ev) => {
    let t = '';
    if (ev.results && ev.results.length > 0) {
      t = ev.results[ev.resultIndex][0].transcript.trim();
    }
    if (!t) {
      appendMessage('No speech detected. Please try again.', 'bot');
      return;
    }
    inputEl.value = t;
    sendMessage(t);
  };
}

micBtn.onclick = () => {
  if (!recognition){
    alert('Speech recognition not supported in this browser. Try Chrome/Edge on desktop.');
    return;
  }
  if (recognizing || (typeof keepListening !== 'undefined' && keepListening)) {
    keepListening = false;
    recognition.stop();
    return;
  }
  keepListening = true;
  try {
    recognition.start();
  } catch (e) {
    appendMessage('Voice input is already active. Please wait.', 'bot');
  }
};


appendMessage('Hi there — click 🎤 to speak or type a message.');
