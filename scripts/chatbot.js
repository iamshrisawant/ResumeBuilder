// scripts/chatbot.js

import { getAIResponse } from './ai.js';

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

  function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    addMessage(message, 'user');
    userInput.value = '';
    userInput.focus();

    // Use your AI response method (replace with actual getAIResponse logic)
    simulateBotReply(message);
  }

  function addMessage(text, type) {
    const msgEl = document.createElement('div');
    msgEl.classList.add(type === 'user' ? 'user-message' : 'bot-message');
    msgEl.textContent = text;
    chatbotContent.appendChild(msgEl);
    chatbotContent.scrollTop = chatbotContent.scrollHeight;
  }

  function simulateBotReply(userMsg) {
    // Replace this with actual async call if getAIResponse is implemented
    setTimeout(() => {
      const botReply = generateReply(userMsg);
      addMessage(botReply, 'bot');
    }, 500);
  }

  function generateReply(userMsg) {
    const msg = userMsg.toLowerCase();
    if (msg.includes('hello') || msg.includes('hi')) {
      return "Hey there! How can I help you with your resume?";
    } else if (msg.includes('format')) {
      return "Sure! I can help you reformat your resume. Which section would you like to work on?";
    } else if (msg.includes('skills')) {
      return "Try listing your skills like:\n• JavaScript\n• Python\n• Problem Solving\nWould you like to tailor them to a specific job?";
    } else {
      return "Hmm... could you tell me a bit more about what you're trying to do with your resume?";
    }
  }
});
