const $messageList = document.querySelector('ul');
const $messageForm = document.querySelector('#message');
const $nickForm = document.querySelector('#nickname');
const socket = new WebSocket(`ws://${window.location.host}`);

function makeMessage(type, payload) {
  const msg = { type, payload };
  return JSON.stringify(msg);
}

function handleOpen() {
  console.log('Connected to Server! ✅');
}

function handleSubmit(event) {
  event.preventDefault();
  const input = $messageForm.querySelector('input');
  socket.send(makeMessage('new_message', input.value));

  const $li = document.createElement('li');
  $li.innerText = `You: ${input.value}`;
  $messageList.append($li);

  input.value = '';
}

function handleNickSubmit(event) {
  event.preventDefault();
  const input = $nickForm.querySelector('input');
  socket.send(makeMessage('nickname', input.value));
  input.value = '';
}

socket.addEventListener('open', handleOpen);

socket.addEventListener('message', (message) => {
  const $li = document.createElement('li');
  $li.innerText = message.data;
  $messageList.append($li);
});

socket.addEventListener('close', () => {
  console.log('Disconnected from Server! ❌');
});

$messageForm.addEventListener('submit', handleSubmit);
$nickForm.addEventListener('submit', handleNickSubmit);
