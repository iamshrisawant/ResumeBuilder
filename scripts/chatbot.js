document.addEventListener("DOMContentLoaded", function () {
    const toggleBtn = document.getElementById("chatbotToggle");
    const chatWindow = document.getElementById("chatbotWindow");
    const sendBtn = document.getElementById("sendChat");
    const input = document.getElementById("chatInput");
    const chatMessages = document.getElementById("chatMessages");
  
    // Toggle chatbot visibility
    toggleBtn.addEventListener("click", () => {
      if (chatWindow.style.display === "none" || chatWindow.style.display === "") {
        chatWindow.style.display = "flex";
      } else {
        chatWindow.style.display = "none";
      }
    });
  
    // Send chat input
    sendBtn.addEventListener("click", async () => {
      const userInput = input.value.trim();
      if (userInput === "") return;
  
      // Append user message
      appendMessage("user", userInput);
      input.value = "";
  
      // Get AI response
      const aiReply = await getAIResponse(userInput); // ← from ai.js
      appendMessage("bot", aiReply);
    });
  
    // Display messages
    function appendMessage(type, text) {
      const msgDiv = document.createElement("div");
      msgDiv.className = type === "user" ? "user-message" : "bot-message";
      msgDiv.textContent = text;
      chatMessages.appendChild(msgDiv);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  });
  