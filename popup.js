document.addEventListener("DOMContentLoaded", () => {
  loadSettings();

  document.getElementById("drinkBtn").addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "drinkWater" });

    // Optional: instantly refresh UI
    setTimeout(loadSettings, 200);
  });

  document.getElementById("saveBtn").addEventListener("click", saveSettings);

  document.getElementById("analyticsBtn").addEventListener("click", () => {
    chrome.tabs.create({ url: "analytics.html" });
  });
});

function loadSettings() {
  chrome.storage.local.get("settings", ({ settings }) => {
    if (!settings) return;

    document.getElementById("waterCount").innerText = settings.glasses;

    const percent = Math.min(
      (settings.glasses / settings.waterGoal) * 100,
      100
    );

    document.getElementById("progressFill").style.width = percent + "%";

    document.getElementById("waterGoal").innerText = settings.waterGoal;
    document.getElementById("streak").innerText = settings.streak;
    document.getElementById("waterInterval").value = settings.waterInterval;
    document.getElementById("strictMode").checked = settings.strictMode;
  });
}

function saveSettings() {
  chrome.storage.local.get("settings", ({ settings }) => {
    if (!settings) return;

    settings.waterInterval = parseInt(document.getElementById("waterInterval").value);
    settings.strictMode = document.getElementById("strictMode").checked;

    chrome.storage.local.set({ settings }, () => {
      chrome.runtime.sendMessage({
        action: "updateInterval",
        interval: settings.waterInterval
      });

      alert("Settings Saved!");
    });
  });
}