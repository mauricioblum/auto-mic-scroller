let scrollSpeed = 1;
let audioStatus = true;
window.micScroller = {
  start: () => resumeAfterStopped(),
  stop: () => stopAllRecordings(),
  setScrollSpeed: (speed) => {
    scrollSpeed = speed;
  },
};
try {
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  window.audioContext = new AudioContext();
} catch (e) {
  alert('Web Audio API not supported.');
}

// Put variables in global scope to make them available to the browser console.
const constraints = (window.constraints = {
  audio: true,
  video: false,
});

navigator.mediaDevices
  .getUserMedia(constraints)
  .then((mediaStream) => {
    //in promise will be triggered user permission request
    console.log('success', mediaStream);

    handleSuccess(mediaStream);
  })
  .catch((error) => {
    //manage error
    console.log(error);
  });

function resumeAfterStopped() {
  try {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    window.audioContext = new AudioContext();
  } catch (e) {
    alert('Web Audio API not supported.');
  }

  audioStatus = true;
  navigator.mediaDevices
    .getUserMedia(constraints)
    .then((mediaStream) => {
      //in promise will be triggered user permission request
      console.log('success', mediaStream);

      handleSuccess(mediaStream);
    })
    .catch((error) => {
      //manage error
      console.log(error);
    });
}

function stopAllRecordings() {
  window.soundMeter.instant = 0;
  window.soundMeter.stop();
  window.stream.getTracks().forEach(function (track) {
    track.stop();
  });
  audioStatus = false;
}

function handleSuccess(stream) {
  window.stream = stream;
  const soundMeter = (window.soundMeter = new SoundMeter(window.audioContext));
  window.soundMeter = soundMeter;
  soundMeter.connectToSource(stream, function (e) {
    if (e) {
      alert(e);
      return;
    }
    setInterval(() => {
      scrollByVolume(soundMeter.instant.toFixed(2));
    }, 100);
  });
}

function scrollByVolume(volume) {
  window.focus();
  if (volume > 0.09) {
    if (window.location.host.includes('cifraclub')) {
      window.scrollBy(
        0,
        document.querySelector('div.wrapper').offsetHeight /
          (scrollSpeed * 1500)
      );
    } else if (window.location.host.includes('ultimate-guitar')) {
      window.scrollBy(0, document.body.offsetHeight / (scrollSpeed * 1500));
    } else if (window.location.host.includes('e-chords')) {
      window.scrollBy(0, document.body.offsetHeight / (scrollSpeed * 1500));
    } else {
      return;
    }
  }
}

function renderControls() {
  const controlDiv = document.createElement('div');
  controlDiv.className = 'mic-scroller';

  controlDiv.innerHTML = `
  <p class="title">
    Auto Mic Scroller
  </p>
  <div class="controls">
    <button type="button" class="play" id="mic-scroller-play">
      Play
    </button>
    
    <button type="button" class="pause" id="mic-scroller-pause">
      Stop
    </button>
    
    <label for="scrollSpeed">Speed</label>
      <select name="scrollSpeed" id="scrollSpeed">
        <option value="2">0.5x</option>
        <option value="1.5">0.7x</option>
        <option selected value="1">1.0x</option>
        <option value="0.8">1.2x</option>
        <option value="0.65">1.3x</option>
        <option value="0.5">1.5x</option>
        <option value="0.2">2.0x</option>
        <option value="0.15">2.5x</option>
      </select>
  </div>
  `;
  document.body.appendChild(controlDiv);
}

renderControls();

const buttonPlay = document.getElementById('mic-scroller-play');
const buttonPause = document.getElementById('mic-scroller-pause');
const scrollSpeedControl = document.getElementById('scrollSpeed');

buttonPlay.addEventListener('click', () => {
  window.micScroller.start();
});

buttonPause.addEventListener('click', () => {
  window.micScroller.stop();
});

scrollSpeedControl.addEventListener('click', (e) => {
  window.micScroller.setScrollSpeed(Number(e.target.value));
});
