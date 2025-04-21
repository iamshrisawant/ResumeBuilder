import { sendToGemini, constructResumePrompt } from './ai.js';

document.addEventListener('DOMContentLoaded', () => {
  const openChatbotBtn = document.querySelector('.chatbot-btn');
  const chatOverlay = document.querySelector('.chat-overlay');
  const closeBtn = document.querySelector('.close-btn');
  const refreshBtn = document.querySelector('.refresh-btn');
  const sendBtn = document.querySelector('.send-btn');
  const userInput = document.querySelector('.chatbot-input input, .chatbot-input textarea');
  const chatbotContent = document.querySelector('.chatbot-content');

  // Open chatbot
  openChatbotBtn?.addEventListener('click', () => {
    chatOverlay.classList.add('open');
    userInput.focus();
  });

  // Close chatbot
  closeBtn?.addEventListener('click', () => {
    chatOverlay.classList.remove('open');
  });

  // Clear chat
  refreshBtn?.addEventListener('click', () => {
    chatbotContent.innerHTML = '';
    userInput.value = '';
    userInput.focus();
  });

  // Send message on button click or Enter (without Shift)
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

    // Use the resume data to create the prompt for the AI
    const botReply = await sendToGemini(constructResumePrompt()); // Fetch AI response
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
