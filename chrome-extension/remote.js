console.log('[Netflix Remote]');

var socket = io('ws://localhost:4545');
var currentVideoTitle = null;
var lastTimeUpdate = 0;

function findVideoPlayer() {
  var el = document.getElementsByTagName('video');
  
  if(el.length) {
    return el[0];
  } else {
    return null;
  }
}

function onTimeUpdate(event) {
  if(typeof lastTimeUpdate === 'number' && event.target.currentTime >= lastTimeUpdate + 1) {
    lastTimeUpdate = event.target.currentTime;
    
    socket.emit('player-update', {
      elapsed: lastTimeUpdate,
      duration: event.target.duration,
      title: currentVideoTitle
    });
  }
}

var updateInterval = setInterval(() => {
  var vp = findVideoPlayer();
  
  try {
    if(vp === null || !vp.currentTime) return;
    
    currentVideoTitle = document.getElementsByClassName('player-status-main-title')[0].innerText;
    
    vp.addEventListener('timeupdate', onTimeUpdate);
    
    clearInterval(updateInterval);
  }
  catch(e) {
    //console.error(e);
  }
  
}, 1000);

socket.on('pause', () => {
  try {
    document.getElementsByTagName('video')[0].pause();
  }
  catch(e) {
    console.error(e);
  }
});

socket.on('play', () => {
  try {
    document.getElementsByTagName('video')[0].play();
  }
  catch(e) {
    console.error(e);
  }
});
