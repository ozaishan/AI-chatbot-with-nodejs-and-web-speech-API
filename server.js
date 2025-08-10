// server.js — Ollama-enabled backend
require('dotenv').config();
const express = require('express');
const fetch = (...args) => import('node-fetch').then(({default: f}) => f(...args));
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Serve index.html from views when accessing root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3.2';

// Basic fallback
function fallbackResponse(msg) {
  const text = msg.toLowerCase();
  if (text.includes('hello') || text.includes('hi')) return 'Hello! How can I help you today?';
  if (text.includes('time')) return `The server time is ${new Date().toLocaleTimeString()}.`;
  if (text.includes('name')) return "I'm your friendly local AI chatbot (offline fallback).";
  return "I couldn't reach Ollama and I don't have an offline answer for that.";
}

app.post('/api/chat', async (req, res) => {
  const { message } = req.body || {};
  if (!message) return res.status(400).json({ error: 'No message provided' });

  // Prepare payload for Ollama generate endpoint
  const payload = {
    model: OLLAMA_MODEL,
    prompt: message,
    stream: false
  };

  try {
    const r = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!r.ok) {
      const text = await r.text();
      console.error('Ollama error', r.status, text);
      // fallback
      return res.json({ reply: fallbackResponse(message), meta: { error: text } });
    }

    const data = await r.json();
    // Ollama returns { response: "..." , ... }
    const reply = data.response ?? data.responses ?? JSON.stringify(data);
    return res.json({ reply });
  } catch (err) {
    console.error('Server error', err);
    return res.json({ reply: fallbackResponse(message), meta: { error: String(err) } });
  }
});

app.get('/api/health', async (req, res) => {
  try {
    const r = await fetch(`${OLLAMA_URL}/api/ping`);
    if (r.ok) return res.json({ status: 'ok', ollama: true });
  } catch (e) {
    // ignore
  }
  res.json({ status: 'ok', ollama: false });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening on http://localhost:${port}`));
