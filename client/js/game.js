let ctx = document.getElementById('ctx').getContext('2d');
let stats = document.getElementById('game-stats');
ctx.font = '30px Arial';
let random = Math.random();


socket.on('newPosition', (data) => {
  // position in game
  console.log(data);
  ctx.clearRect(0, 0, 500, 500);
  stats.innerHTML = '';
  data.player.forEach((client) => {
    ctx.fillText(client.name, client.x, client.y);
    stats.innerHTML += '<div>Player: '+client.name+', Health: '+client.health+'</div>';
  });
  data.bullet.forEach((client) => {
    ctx.fillText('•', client.x, client.y);
  });
  data.bomb.forEach((client) => {
    ctx.fillText('o', client.x, client.y);
  });
});

document.onkeydown = (e) => {
  if (e.keyCode === 68) {
    socket.emit('keyPress', {
      input:'right',
      state:true
    });
  } else if (e.keyCode === 87){
    socket.emit('keyPress', {
      input:'down',
      state:true
    });
  } else if (e.keyCode === 65){
    socket.emit('keyPress', {
      input:'left',
      state:true
    });
  } else if (e.keyCode === 83){
    socket.emit('keyPress', {
      input:'up',
      state:true
    });
  }
}

document.onkeyup = (e) => {
  if (e.keyCode === 68) {
    socket.emit('keyPress', {
      input: 'right',
      state: false
    });
  } else if (e.keyCode === 87){
    socket.emit('keyPress', {
      input: 'down',
      state: false
    });
  } else if (e.keyCode === 65){
    socket.emit('keyPress', {
      input: 'left',
      state: false
    });
  } else if (e.keyCode === 83){
    socket.emit('keyPress', {
      input: 'up',
      state: false
    });
  }
}

document.onmousedown = (e) => {
  socket.emit('keyPress', {
    input: 'attack',
    state: true
  });
}

document.onmouseup = (e) => {
  socket.emit('keyPress', {
    input: 'attack',
    state: false
  });
}

document.onmousemove = (e) => {
  let x = -250 + event.clientX - 8;
  let y = -250 + event.clientY - 8;
  let angle = Math.atan2(y, x) / Math.PI * 180;
  socket.emit('keyPress', {
    input: 'mouseAngle',
    state: angle
  })
}