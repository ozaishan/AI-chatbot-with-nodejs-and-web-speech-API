# 🤖 AI Chatbot with Node.js, Ollama, and Web Speech API 🎙️

This project is a voice-enabled AI chatbot web app built with Node.js and Express on the backend, integrated with a local Ollama LLM model (e.g., LLaMA 3.2). The frontend uses the browser’s Web Speech API for voice input (speech-to-text) and speech synthesis (text-to-speech).

---

## ✨ Features

- 🔗 Connects to a local Ollama server running LLaMA 3.2 or other models  
- 🎤 Speech input via microphone with toggle button  
- 🔊 Voice replies using Web Speech API speech synthesis  
- 💬 Text chat interface with chat history  
- ⚙️ Basic fallback responses if Ollama is unreachable  
- 🎨 Clean and responsive UI  

---

## 🛠️ Requirements

- 🟢 Node.js   
- 🦙 Ollama installed and running locally ([https://ollama.com/](https://ollama.com/))  
- 📥 Ollama model(s) pulled locally, e.g. `ollama pull llama3.2`  
- 🌐 Modern Chromium-based browser (Chrome, Edge) for Web Speech API support  
- 📶 Internet connection (needed for browser speech recognition)  

---

## 🚀 Setup & Run

1. 📂 Clone or download the project files.

2. 🔧 Copy `.env.example` to `.env` and configure if needed:  
   ```env
   PORT=3000
   OLLAMA_URL=http://localhost:11434
   OLLAMA_MODEL=llama3.2
   LANG=en-US
   
3. 📦 install dependencies:  
   ```env
   npm install
4. 🦙 Start the Ollama server if not already running::  
   ```env
   ollama serve
5. ⚡ Run the Node.js backend: 
   ```env
   npm start
6. 🌐 Open your browser and visit: 
   ```env
   http://localhost:3000
