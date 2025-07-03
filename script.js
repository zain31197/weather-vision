const apiKey = "YourApiKey";
const output = document.getElementById("weather-output");
const nextDays = document.getElementById("next-days");






function getWeather() {
    const city = document.getElementById("city").value.trim();

    if (city === "") {
        output.textContent = "Please enter a city name";
        return;
    }

    fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`)
        .then(response => response.json())
        .then(locationData => {
            if (locationData.length === 0) {
                output.textContent = "City not found";
                return;
            }

            const { lat, lon } = locationData[0];

            // ✅ Fetch current weather
            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`)
                .then(response => response.json())
                .then(weatherData => {
                    const temp = weatherData.main.temp;
                    const condition = weatherData.weather[0].description;
                    output.textContent = `${temp}°C, ${condition}`;
                });
        })
        
}


function showfivedayforecast(event) {
    // Ripple animation
    const button = event.currentTarget;
    const circle = document.createElement("span");
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - button.getBoundingClientRect().left - radius}px`;
    circle.style.top = `${event.clientY - button.getBoundingClientRect().top - radius}px`;
    circle.classList.add("ripple");
    
    const oldRipple = button.querySelector('.ripple');
    if (oldRipple) oldRipple.remove();
    button.appendChild(circle);

    
    const city = document.getElementById("city").value.trim();
    if (city === "") {
        output.textContent = "Please enter a city name";
        return;
    }
    setTimeout(() => {
        window.open(`forecast.html?city=${encodeURIComponent(city)}`, '_blank');
    }, 350); 
}

