console.log("🔥 Background Running");

const DEFAULT_SETTINGS = {
  waterInterval: 30,
  waterGoal: 8,
  glasses: 0,
  streak: 0,
  lastUpdated: new Date().toDateString(),
  history: {}
};

// Ensure settings exist
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get("settings", (data) => {
    if (!data.settings) {
      chrome.storage.local.set({ settings: DEFAULT_SETTINGS });
    }
  });

  createAlarm(30);
});

// Create alarm
function createAlarm(minutes) {
  chrome.alarms.clear("waterReminder", () => {
    chrome.alarms.create("waterReminder", {
      delayInMinutes: minutes,   // first trigger
      periodInMinutes: minutes   // repeat
    });
  });

  console.log("⏳ Alarm scheduled for every", minutes, "minutes");
}

// Alarm fires
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "waterReminder") {
    console.log("⏰ Alarm Fired");

    chrome.notifications.create({
      type: "basic",
      iconUrl: "icons/icon128.png",
      title: "💧 Time to Drink Water!",
      message: "Stay hydrated and keep your streak alive!",
      priority: 2
    });
  }
});

// Listen from popup
chrome.runtime.onMessage.addListener((message) => {
  console.log("📩 Message:", message);

  if (message.action === "drinkWater") {
    incrementWater();
  }

  if (message.action === "updateInterval") {
    createAlarm(message.interval);
  }
});

// Increment water
function incrementWater() {
  chrome.storage.local.get("settings", (result) => {
    let settings = result.settings || DEFAULT_SETTINGS;
    const today = new Date().toDateString();

    if (settings.lastUpdated !== today) {
      settings.glasses = 0;
      settings.lastUpdated = today;
    }

    settings.glasses += 1;

    if (!settings.history) settings.history = {};
    settings.history[today] = settings.glasses;

    chrome.storage.local.set({ settings }, () => {
      console.log("💧 Water Incremented:", settings.glasses);
    });
  });
}