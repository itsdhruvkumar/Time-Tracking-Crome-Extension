let timerInterval;
let startTime;
let elapsedTime = 0;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "start") {
    startTime = Date.now();
    chrome.storage.local.set({ startTime, isRunning: true });
    timerInterval = setInterval(() => {
      elapsedTime = Date.now() - startTime;
      chrome.storage.local.set({ elapsedTime });
    }, 1000);
    sendResponse({ status: "started" });
  } else if (request.action === "stop") {
    clearInterval(timerInterval);
    chrome.storage.local.set({ elapsedTime, isRunning: false });
    sendResponse({ status: "stopped", elapsedTime });
  } else if (request.action === "reset") {
    clearInterval(timerInterval);
    elapsedTime = 0;
    chrome.storage.local.set({ elapsedTime, isRunning: false });
    sendResponse({ status: "reset" });
  }
});

chrome.runtime.onStartup.addListener(() => {
  chrome.storage.local.get(["isRunning", "startTime", "elapsedTime"], (result) => {
    if (result.isRunning) {
      startTime = result.startTime;
      elapsedTime = result.elapsedTime || 0;
      timerInterval = setInterval(() => {
        elapsedTime = Date.now() - startTime;
        chrome.storage.local.set({ elapsedTime });
      }, 1000);
    }
  });
});
