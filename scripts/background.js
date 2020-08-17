let audioEnabled = true;

chrome.tabs.onActivated.addListener(function (activeInfo) {
  changeIcon();
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo) {
  changeIcon();
});

function changeIcon() {
  chrome.tabs.query(
    {
      active: true,
      lastFocusedWindow: true,
    },
    function (tabs) {
      // and use that tab to fill in out title and url
      var tab = tabs[0];
      if (
        tab.url.includes("cifraclub") ||
        tab.url.includes("ultimate-guitar") || 
        tab.url.includes("e-chords")
      ) {
        chrome.browserAction.setIcon({
          path: "images/scrollmic-logo-recording.png",
        });
      } else {
        chrome.browserAction.setIcon({
          path: "images/scrollmic-logo-gray.png",
        });
      }
    }
  );
}
