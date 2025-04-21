import { getAIResponse } from './ai.js';

document.addEventListener('DOMContentLoaded', () => {
  const openBtn = document.querySelector('.chatbot-btn');
  const overlay = document.querySelector('.chat-overlay');
  const closeBtn = document.querySelector('.close-btn');
  const refreshBtn = document.querySelector('.refresh-btn');
  const sendBtn = document.querySelector('.send-btn');
  const input = document.querySelector('.chatbot-input input');
  const chatbox = document.querySelector('.chatbot-content');

  if (!openBtn || !overlay || !closeBtn || !refreshBtn || !sendBtn || !input || !chatbox) {
    console.warn('Chatbot elements missing. Skipping initialization.');
    return;
  }

  openBtn.addEventListener('click', () => {
    overlay.classList.add('active');
    input.focus();
  });

  closeBtn.addEventListener('click', () => {
    overlay.classList.remove('active');
  });

  refreshBtn.addEventListener('click', () => {
    chatbox.innerHTML = '';
    input.value = '';
    input.focus();
  });

  sendBtn.addEventListener('click', sendMessage);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  async function sendMessage() {
    const message = input.value.trim();
    if (!message) return;

    displayMessage(message, 'user');
    input.value = '';
    input.focus();

    try {
      const reply = await getAIResponse(message);
      displayMessage(reply, 'bot');
    } catch (err) {
      console.error('AI response failed:', err);
      displayMessage('Sorry, I couldn’t process that. Try again!', 'bot');
    }
  }

  function displayMessage(text, type) {
    const bubble = document.createElement('div');
    bubble.className = type === 'user' ? 'user-message' : 'bot-message';
    bubble.textContent = text;
    chatbox.appendChild(bubble);
    chatbox.scrollTop = chatbox.scrollHeight;
  }
});