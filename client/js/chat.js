let chatText = document.getElementById('chat-text');
let chatInput = document.getElementById('chat-input');
let chatForm = document.getElementById('chat-form');


socket.on('addToChat', (data) => {
  chatText.innerHTML += '<div>' + data + '</div>';
})

chatForm.onsubmit = (e) => {
  e.preventDefault();
  socket.emit('chatMessage', chatInput.value)
  chatInput.value = '';
}