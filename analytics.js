document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get("settings", (result) => {
    if (!result.settings) return;

    const history = result.settings.history || {};
    const goal = result.settings.waterGoal || 8;

    const labels = [];
    const data = [];

for (let i = 6; i >= 0; i--) {
  const d = new Date();
  d.setDate(d.getDate() - i);
  const key = d.toDateString();

  labels.push(
    d.toLocaleDateString(undefined, { weekday: "short" })
  );
  data.push(history[key] || 0);
}

// ✅ CALCULATE STATS AFTER LOOP
const total = data.reduce((a, b) => a + b, 0);
const avg = (total / 7).toFixed(1);
const goalHits = data.filter(d => d >= goal).length;
const percent = Math.round((goalHits / 7) * 100);

// ✅ SAFE UPDATE UI
const totalEl = document.getElementById("weeklyTotal");
const avgEl = document.getElementById("weeklyAvg");
const percentEl = document.getElementById("goalPercent");

if (totalEl && avgEl && percentEl) {
  totalEl.innerText = total;
  avgEl.innerText = avg;
  percentEl.innerText = percent + "%";
}

    const ctx = document.getElementById("chart").getContext("2d");

    new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Water Glasses",
            data: data,
            backgroundColor: "#00c6ff",
            borderRadius: 8,
            maxBarThickness: 50
          },
          {
            type: "line",
            label: "Daily Goal",
            data: Array(7).fill(goal),
            borderColor: "#22c55e",
            borderWidth: 2,
            borderDash: [6, 6],
            pointRadius: 0
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: "#cbd5e1",
              font: { size: 14 }
            }
          }
        },
        scales: {
          x: {
            ticks: { color: "#94a3b8" },
            grid: { display: false }
          },
          y: {
            beginAtZero: true,
            suggestedMax: Math.max(goal, ...data) + 1,
            ticks: {
              color: "#94a3b8",
              stepSize: 1
            },
            grid: {
              color: "rgba(255,255,255,0.05)"
            }
          }
        }
      }
    });
  });
});