
const status = document.getElementById("status");

let bgAudioEnabled;
if (localStorage.getItem('bgAudioStatus')){
  bgAudioEnabled = localStorage.getItem('bgAudioStatus');
  status.innerHTML = bgAudioEnabled === 'playing' ? 'Running' : 'Paused';
} else {
  bgAudioEnabled = localStorage.setItem('bgAudioStatus', 'playing');
}

const recordBtn = document.getElementById("start-stop");
const scrollSelector = document.getElementById("scrollSpeed");

let innerScrollSpeed;

if (localStorage.getItem('innerScrollSpeed')){
  innerScrollSpeed = localStorage.getItem('innerScrollSpeed');
  scrollSelector.value = innerScrollSpeed;
} else {
  innerScrollSpeed = localStorage.setItem('innerScrollSpeed', "1");
}

scrollSelector.addEventListener("change", (e) => {
  innerScrollSpeed = e.target.value;
  localStorage.setItem('innerScrollSpeed', e.target.value)
  chrome.tabs.executeScript({
    code: `
    function createScript() {
      const scriptSpeed = document.createElement('script');
      scriptSpeed.id = 'SCRIPT-SPEED-${e.target.value}';
      scriptSpeed.className = 'script-speed';
      scriptSpeed.type = 'text/javascript';
      scriptSpeed.async = true;
      scriptSpeed.onload = function(){
      };
      scriptSpeed.src = chrome.runtime.getURL("/scripts/setScrollSpeed.js");
      document.body.appendChild(scriptSpeed);
    }
    if (!document.querySelector('[id^="SCRIPT-SPEED-"]')) {
      createScript();
    } else {
      document.body.removeChild(document.querySelector('[id^="SCRIPT-SPEED-"]'));
      createScript();
    }
    `
  });
});

recordBtn.addEventListener(
  "click",
  () => {
    if (bgAudioEnabled === 'stopped') {
      console.log('Resumed recording');
      localStorage.setItem('bgAudioStatus', 'playing');
      status.innerHTML = 'Running';
      chrome.tabs.executeScript({
        code: `
        function createScript(){
          const scriptStart = document.createElement('script');
          scriptStart.id = 'start-script';
          scriptStart.type = 'text/javascript';
          scriptStart.async = true;
          scriptStart.onload = function(){
          };
          scriptStart.src = chrome.runtime.getURL("/scripts/resumeRecording.js");
          document.body.appendChild(scriptStart);
        }

        if (!document.getElementById('start-script')) {
          createScript();
        } else {
          document.body.removeChild(document.getElementById('start-script'));
          createScript();
        }
        `,
      });
    } else {
      console.log('Paused recording');
      localStorage.setItem('bgAudioStatus', 'stopped');
      status.innerHTML = 'Paused';
      chrome.tabs.executeScript({
        code: `
        function createScript(){
          const scriptStop = document.createElement('script');
          scriptStop.id = 'stop-script';
          scriptStop.type = 'text/javascript';
          scriptStop.async = true;
          scriptStop.onload = function(){
          };
          scriptStop.src = chrome.runtime.getURL("/scripts/stopRecording.js");
          document.body.appendChild(scriptStop);
        }

        if (!document.getElementById('stop-script')) {
          createScript();
        } else {
          document.body.removeChild(document.getElementById('stop-script'));
          createScript();
        }
        `,
      });
    }
    window.close();
  },
  false
);
