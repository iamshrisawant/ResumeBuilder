// scripts/chatbot.js
import { getAIResponse } from './ai.js';

document.addEventListener('DOMContentLoaded', () => {
  const openChatbotBtn = document.querySelector('.chatbot-btn');
  const chatOverlay = document.querySelector('.chat-overlay');
  const closeBtn = document.querySelector('.close-btn');
  const refreshBtn = document.querySelector('.refresh-btn');
  const sendBtn = document.querySelector('.send-btn');
  const userInput = document.querySelector('.chatbot-input input');
  const chatbotContent = document.querySelector('.chatbot-content');

  openChatbotBtn?.addEventListener('click', () => {
    chatOverlay.classList.add('open');
    userInput.focus();
  });

  closeBtn?.addEventListener('click', () => {
    chatOverlay.classList.remove('open');
  });

  refreshBtn?.addEventListener('click', () => {
    chatbotContent.innerHTML = '';
    userInput.value = '';
    userInput.focus();
  });

  sendBtn?.addEventListener('click', sendMessage);
  userInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    addMessage(message, 'user');
    userInput.value = '';
    userInput.focus();

    const botReply = await getAIResponse(message);
    addMessage(botReply, 'bot');
  }

  function addMessage(text, type) {
    const msgEl = document.createElement('div');
    msgEl.classList.add(type === 'user' ? 'user-message' : 'bot-message');
    msgEl.textContent = text;
    chatbotContent.appendChild(msgEl);
    chatbotContent.scrollTop = chatbotContent.scrollHeight;
  }
});
