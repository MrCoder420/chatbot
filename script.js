const messages = [];
let isLoading = false;


const messagesContainer = document.getElementById('chatMessages');
const input = document.getElementById('input');
const sendButton = document.getElementById('sendButton');
const apikey = "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";

function scrollToBottom() {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
  
  function renderMessages() {
    messagesContainer.innerHTML = '';
    messages.forEach(msg => {
      const messageDiv = document.createElement('div');
      messageDiv.className = 'message';
      if (msg.isUser) messageDiv.classList.add('user');
  
      const avatar = document.createElement('div');
      avatar.className = 'avatar';
      if (msg.isUser) avatar.classList.add('user');
      avatar.textContent = msg.isUser ? 'U' : 'A';
  
      const content = document.createElement('div');
      content.className = 'message-content';
      content.textContent = msg.text;
  
      messageDiv.appendChild(avatar);
      messageDiv.appendChild(content);
      messagesContainer.appendChild(messageDiv);
    });
  
    if (isLoading) {
      const loadingDiv = document.createElement('div');
      loadingDiv.className = 'message loading';
  
      const avatar = document.createElement('div');
      avatar.className = 'avatar';
      avatar.textContent = 'A';
  
      const dots = document.createElement('div');
      dots.className = 'loading-dots';
      for (let i = 0; i < 3; i++) {
        const dot = document.createElement('span');
        dots.appendChild(dot);
      }
  
      loadingDiv.appendChild(avatar);
      loadingDiv.appendChild(dots);
      messagesContainer.appendChild(loadingDiv);
    }
  
    scrollToBottom();
  }
  
  async function handleSend() {
    const userMessage = input.value.trim();
    if (!userMessage || isLoading) return;
  
    input.value = '';
    messages.push({ text: userMessage, isUser: true });
    isLoading = true;
    renderMessages();
  
    try {
      const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
        model: "qwen/qwen2.5-vl-3b-instruct:free",
        messages: [
          ...messages.map(msg => ({
            role: msg.isUser ? "user" : "assistant",
            content: msg.text
          })),
          {
            role: "user",
            content: userMessage
          }
        ]
      }, {
        headers: {
          'Authorization': 'Bearer ' + apikey,
          'Content-Type': 'application/json'
        }
      });
  
      const botResponse = response.data.choices[0].message.content;
      messages.push({ text: botResponse, isUser: false });
    } catch (error) {
      console.error('Error:', error);
      messages.push({
        text: "I apologize, but I'm having trouble connecting to the server. Please try again later.",
        isUser: false
      });
    }
  
    isLoading = false;
    renderMessages();
  }
  
  input.addEventListener('keypress', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  });
  
  sendButton.addEventListener('click', handleSend);