
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

scrollSelector.addEventListener("change", (e) => {
  console.log(e);
  chrome.tabs.executeScript({
    code: `alert(${23123312})`,
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
  },
  false
);

chrome.runtime.onConnect.addListener((port) => {
  console.log(port);
});

function getAudioStatus() {
  chrome.storage.sync.get("audioStatus", function (result) {
    return result;
  });
}
