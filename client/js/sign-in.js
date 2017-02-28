let signInContainer = document.getElementById('sign-in-container');
let signInButton = document.getElementById('sign-in-button');
let signUpButton = document.getElementById('sign-up-button');
let username = document.getElementById('sign-username');
let password = document.getElementById('sign-password');

let gameContainer = document.getElementById('game');
// let statsContainer = document.getElementById('game-stats');

signInButton.onclick = () => {
  socket.emit('signIn', {
    username: username.value,
    password: password.value
  });
}

socket.on('signInResponse', (data) => {
  if (data.success) {
      signInContainer.style.display = 'none';
      gameContainer.style.display = 'inline-block';
      statsContainer.style.display = 'inline-block';

      statsContainer.innerHTML += '<div>Player: '+data.name+'</div>';
      statsContainer.innerHTML += '<div class="progress"><div class="progress-bar" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width:100%" <span class="sr-only"></span></div></div>';

  } else {
    alert("Sign in unsuccessful!");
  }
});

signUpButton.onclick = () => {
  socket.emit('signUp', {
    username: username.value,
    password: password.value
  })
}

socket.on('signUpResponse', (data) => {
  if (data.success) {
    alert('Sign Up Successful!');
    signInContainer.style.display = 'none';
    gameContainer.style.display = 'inline-block';
  } else {
    alert('Sign up Unsuccessful!');
  }
})