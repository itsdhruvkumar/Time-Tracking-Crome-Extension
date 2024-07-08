const timerElement = document.getElementById("timer");
const startButton = document.getElementById("start-button");
const stopButton = document.getElementById("stop-button");
const resetButton = document.getElementById("reset-button");

let timerInterval;

startButton.addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "start" }, (response) => {
    if (response.status === "started") {
      startTimer();
    }
  });
});

stopButton.addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "stop" }, (response) => {
    if (response.status === "stopped") {
      stopTimer(response.elapsedTime);
    }
  });
});

resetButton.addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "reset" }, (response) => {
    if (response.status === "reset") {
      resetTimer();
    }
  });
});

function startTimer() {
  chrome.storage.local.get("elapsedTime", (result) => {
    let startTime = Date.now() - (result.elapsedTime || 0);
    timerInterval = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      timerElement.textContent = formatTime(elapsedTime);
    }, 1000);
  });
}

function stopTimer(elapsedTime) {
  clearInterval(timerInterval);
  timerElement.textContent = formatTime(elapsedTime);
}

function resetTimer() {
  clearInterval(timerInterval);
  timerElement.textContent = "00:00:00";
  chrome.storage.local.set({ elapsedTime: 0, isRunning: false });
}

function formatTime(ms) {
  let totalSeconds = Math.floor(ms / 1000);
  let hours = Math.floor(totalSeconds / 3600);
  let minutes = Math.floor((totalSeconds % 3600) / 60);
  let seconds = totalSeconds % 60;

  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

function pad(num) {
  return num.toString().padStart(2, '0');
}

document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get(["isRunning", "elapsedTime"], (result) => {
    if (result.isRunning) {
      startTimer();
    } else if (result.elapsedTime) {
      timerElement.textContent = formatTime(result.elapsedTime);
    }
  });
});
