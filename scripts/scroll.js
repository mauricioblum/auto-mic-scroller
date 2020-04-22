try {
  if (!window.audioContext) {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    window.audioContext = new AudioContext();
  } else {
    window.audioContext.resume();
  }
} catch (e) {
  alert("Web Audio API not supported.");
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
    console.log("success", mediaStream);

    handleSuccess(mediaStream);
  })
  .catch((error) => {
    //manage error
    console.log(error);
  });

function handleSuccess(stream) {
  // Put variables in global scope to make them available to the
  // browser console.
  window.stream = stream;
  const soundMeter = (window.soundMeter = new SoundMeter(window.audioContext));
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
    if (window.location.host.includes("cifraclub")) {
      window.scrollBy(
        0,
        document.querySelector("div.wrapper").offsetHeight / 1500
      );
    } else if (window.location.host.includes("ultimate-guitar")) {
      window.scrollBy(0, document.body.offsetHeight / 1500);
    } else {
      return;
    }
  }
}
