const apiKey = "5eaff941d04fdb5e602395fcf3de857c";
const forecastOutput = document.getElementById("forecast-output");

function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

const city = getQueryParam("city");
if (!city) {
  forecastOutput.textContent = "No city provided.";
} else {
  fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`)
    .then(response => response.json())
    .then(locationData => {
      if (locationData.length === 0) {
        forecastOutput.textContent = "City not found.";
        return;
      }
      const { lat, lon } = locationData[0];
      fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
          const forecastList = data.list;
          // Group by day
          const days = {};
          forecastList.forEach(item => {
            const date = new Date(item.dt * 1000);
            const day = date.toLocaleDateString();
            if (!days[day]) days[day] = [];
            days[day].push(item);
          });
          const dayKeys = Object.keys(days).slice(0, 5);
          let html = `<h2 style='margin-bottom:1rem;'>5-Day Forecast for <span style='color:#00c6fb;'>${city}</span></h2>`;
          dayKeys.forEach(day => {
            // Get average temp and first condition/icon
            const temps = days[day].map(i => i.main.temp);
            const avgTemp = (temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(1);
            const condition = days[day][0].weather[0].description;
            const icon = days[day][0].weather[0].icon;
            html += `<div style='margin-bottom:1.2rem;display:flex;align-items:center;gap:1.2rem;justify-content:center;'>`;
            html += `<img src='https://openweathermap.org/img/wn/${icon}@2x.png' alt='${condition}' class='weather-icon'>`;
            html += `<div><strong>${day}</strong><br>${avgTemp}°C, ${condition}</div></div>`;
          });
          forecastOutput.innerHTML = html;
        })
        .catch(() => {
          forecastOutput.textContent = "Could not fetch forecast.";
        });
    })
    .catch(() => {
      forecastOutput.textContent = "Could not fetch location.";
    });
} 