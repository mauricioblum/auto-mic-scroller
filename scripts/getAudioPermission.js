const scrollScript = document.createElement("script");

scrollScript.src = chrome.runtime.getURL("./scripts/scroll.js");

const soundmeter = document.createElement("script");

soundmeter.src = chrome.runtime.getURL("./scripts/soundmeter.js");

document.head.appendChild(scrollScript);
document.head.appendChild(soundmeter);
