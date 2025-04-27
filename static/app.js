// static/app.js

// ============================
// 🔥 Constants and API Key
// ============================
const API_KEY = "f177179db0f0626d810218f59cbb001b";  // <-- Replace this with your real OpenWeather key

// Storage for chart data
let solarInsightLabels = []; // timestamps
let solarInsightValues = []; // Good = 2, Moderate = 1, Poor = 0

// Initialize Chart.js
const ctx = document.getElementById('solarInsightChart').getContext('2d');
const solarChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: solarInsightLabels,
        datasets: [{
            label: 'Solar Condition',
            data: solarInsightValues,
            borderColor: 'orange',
            backgroundColor: 'rgba(255,165,0,0.2)',
            tension: 0.3,
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: {
                ticks: {
                    callback: function(value) {
                        if (value === 0) return 'Poor';
                        if (value === 1) return 'Moderate';
                        if (value === 2) return 'Good';
                        return value;
                    },
                    stepSize: 1,
                    min: 0,
                    max: 2
                }
            },
            x: {
                ticks: {
                    autoSkip: true,
                    maxTicksLimit: 10
                }
            }
        }
    }
});



// ============================
// 🌎 Initialize Maps
// ============================

// Solar Radiation Map
const solarMap = L.map('solar-map').setView([39.2904, -76.6122], 10);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(solarMap);

// (Later we'll add more maps like energyMap, tempMap, cloudMap)
// Solar Energy Prediction Map
const energyMap = L.map('energy-map').setView([39.2904, -76.6122], 10);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(energyMap);

// Temperature Map
const tempMap = L.map('temp-map').setView([39.2904, -76.6122], 10);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(tempMap);

// Cloud Cover and Irradiance Map
const cloudMap = L.map('cloud-map').setView([39.2904, -76.6122], 10);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(cloudMap);



// ============================
// 🔥 Functions
// ============================

// 1. Fetch Solar Radiation for Solar Map
async function fetchSolarRadiation() {
    const lat = 39.2904; // Baltimore
    const lon = -76.6122;

    const apiUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        console.log("Solar Radiation Data:", data);

        const solarRadiation = data.current.uvi; // UV index = basic solar radiation
        const solarStrength = Math.round(solarRadiation * 100) / 100;

        // Clear old marker
        if (window.solarMarker) {
            solarMap.removeLayer(window.solarMarker);
        }

        // Set color based on radiation strength
        let color = "green";
        if (solarRadiation > 6) color = "orange";
        if (solarRadiation > 8) color = "red";

        // Add new marker
        window.solarMarker = L.circleMarker([lat, lon], {
            radius: 12,
            color: color,
            fillColor: color,
            fillOpacity: 0.7
        }).addTo(solarMap)
          .bindPopup(`<b>Solar Radiation:</b> ${solarStrength} UV Index`)
          .openPopup();

    } catch (error) {
        console.error("Error fetching solar radiation data:", error);
    }
}
async function fetchSolarEnergyPrediction() {
    const lat = 39.2904;
    const lon = -76.6122;

    const apiUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        console.log("Solar Energy Prediction Data:", data);

        const solarRadiation = data.current.uvi; // UV index (proxy for solar radiation strength)

        // Estimate energy output
        // (simulating real solar panel calculation)
        const panelArea = 5; // 5 square meters
        const efficiency = 0.2; // 20% efficiency
        const timeHours = 1; // 1 hour snapshot

        // Simple estimate: Energy (kWh) = radiation × area × efficiency × time
        const estimatedEnergy = (solarRadiation * 1000) * panelArea * efficiency * timeHours / 1000; // in kWh

        const roundedEnergy = Math.round(estimatedEnergy * 100) / 100;

        // Clear old marker
        if (window.energyMarker) {
            energyMap.removeLayer(window.energyMarker);
        }

        // Color based on energy production
        let color = "gray";
        if (roundedEnergy > 1) color = "green";
        if (roundedEnergy > 2) color = "orange";
        if (roundedEnergy > 3) color = "red";

        // Add new marker
        window.energyMarker = L.circleMarker([lat, lon], {
            radius: 12,
            color: color,
            fillColor: color,
            fillOpacity: 0.7
        }).addTo(energyMap)
          .bindPopup(`<b>Estimated Energy:</b> ${roundedEnergy} kWh`)
          .openPopup();

    } catch (error) {
        console.error("Error fetching solar energy prediction data:", error);
    }
}

async function fetchTemperatureData() {
    const lat = 39.2904; // Baltimore
    const lon = -76.6122;

    const apiUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        console.log("Temperature Data:", data);

        const temperature = data.current.temp; // Real-time temperature in Celsius

        // Clear old marker
        if (window.tempMarker) {
            tempMap.removeLayer(window.tempMarker);
        }

        // Color based on temperature
        let color = "blue"; // default = cold
        if (temperature >= 15) color = "green"; // mild
        if (temperature >= 25) color = "red"; // hot

        // Add new marker
        window.tempMarker = L.circleMarker([lat, lon], {
            radius: 12,
            color: color,
            fillColor: color,
            fillOpacity: 0.7
        }).addTo(tempMap)
          .bindPopup(`<b>Temperature:</b> ${temperature} °C`)
          .openPopup();

    } catch (error) {
        console.error("Error fetching temperature data:", error);
    }
}
async function fetchCloudSolarData() {
    const lat = 39.2904; // Baltimore
    const lon = -76.6122;

    const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=shortwave_radiation,cloudcover`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        console.log("Cloud + Solar Data:", data);

        const cloudCover = data.current.cloudcover; // in %
        const solarRadiation = data.current.shortwave_radiation; // W/m²

        // Clear old marker
        if (window.cloudMarker) {
            cloudMap.removeLayer(window.cloudMarker);
        }

        // Color based on cloudiness
        let color = "yellow"; // good sun
        if (cloudCover >= 50) color = "gray"; // cloudy
        if (cloudCover >= 80) color = "black"; // very cloudy

        // Add new marker
        window.cloudMarker = L.circleMarker([lat, lon], {
            radius: 12,
            color: color,
            fillColor: color,
            fillOpacity: 0.7
        }).addTo(cloudMap)
          .bindPopup(`<b>Cloud Cover:</b> ${cloudCover}%<br><b>Solar Irradiance:</b> ${solarRadiation} W/m²`)
          .openPopup();

    } catch (error) {
        console.error("Error fetching cloud and solar data:", error);
    }
}
async function fetchSolarInsight() {
    const lat = 39.2904;
    const lon = -76.6122;

    const apiUrl = "https://api.open-meteo.com/v1/forecast?latitude=39.2904&longitude=-76.6122&current=temperature_2m,relative_humidity_2m,shortwave_radiation,cloudcover";

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        const weatherData = data.current;

        const payload = {
            temperature: weatherData.temperature_2m,
            humidity: weatherData.relative_humidity_2m,
            solar_radiation: weatherData.shortwave_radiation,
            cloud_cover: weatherData.cloudcover
        };

        // Send to backend for prediction
        const insightResponse = await fetch('http://127.0.0.1:8000/predict-insight', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const result = await insightResponse.json();

        // Update the page
        document.getElementById("solar-insight").innerText =
            `Solar Condition Prediction: ${result.solar_condition}`;

        // Save into chart data
        const now = new Date();
        const timeLabel = now.getHours().toString().padStart(2, '0') + ":" + now.getMinutes().toString().padStart(2, '0');

        solarInsightLabels.push(timeLabel);
        if (result.solar_condition === "Good") {
            solarInsightValues.push(2);
        } else if (result.solar_condition === "Moderate") {
            solarInsightValues.push(1);
        } else {
            solarInsightValues.push(0);
        }

        // Keep only latest 20 points
        if (solarInsightLabels.length > 20) {
            solarInsightLabels.shift();
            solarInsightValues.shift();
        }

        // Update the chart
        solarChart.update();

    } catch (error) {
        console.error("Error fetching solar insight:", error);
    }
}


// 2. Predict Function (from your earlier full-stack site)
async function sendPrediction() {
    const featureInput = document.getElementById("featureInput").value;

    if (!featureInput) {
        alert("Please enter a number first!");
        return;
    }

    const featureNumber = Number(featureInput);

    if (isNaN(featureNumber)) {
        alert("Input must be a valid number.");
        return;
    }

    const data = {
        features: [featureNumber]
    };

    try {
        const response = await fetch('http://127.0.0.1:8000/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();
        document.getElementById("prediction-result").innerText = `Prediction: ${result.prediction}`;
    } catch (error) {
        console.error('Error:', error);
        document.getElementById("prediction-result").innerText = "Error contacting server.";
    }
}

// 3. Fetch Live Weather Data (Temperature, Solar Radiation from Open-Meteo)
async function fetchWeatherData() {
    const apiUrl = "https://api.open-meteo.com/v1/forecast?latitude=39.2904&longitude=-76.6122&current=temperature_2m,relative_humidity_2m,shortwave_radiation,cloudcover";

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        const weatherData = data.current;
        console.log("Live Weather Data:", weatherData);

        document.getElementById("weather-data").innerText =
            `Temperature: ${weatherData.temperature_2m}°C, ` +
            `Humidity: ${weatherData.relative_humidity_2m}%, ` +
            `Solar Radiation: ${weatherData.shortwave_radiation} W/m², ` +
            `Cloud Cover: ${weatherData.cloudcover}%`;

    } catch (error) {
        console.error("Error fetching weather data:", error);
    }
}
// 4. Log Live Weather and Solar Data
async function logLiveData() {
    const lat = 39.2904;
    const lon = -76.6122;

    const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,shortwave_radiation,cloudcover`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        const weatherData = data.current;

        const payload = {
            temperature: weatherData.temperature_2m,
            humidity: weatherData.relative_humidity_2m,
            solar_radiation: weatherData.shortwave_radiation,
            cloud_cover: weatherData.cloudcover
        };

        console.log("Sending live data to backend:", payload);

        await fetch('http://127.0.0.1:8000/log-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

    } catch (error) {
        console.error("Error logging live data:", error);
    }
}

// ============================
// 🚀 Initial Fetches and Auto-Updates
// ============================

// Start immediately
fetchSolarRadiation();
fetchWeatherData();
// Fetch Solar Energy immediately
fetchSolarEnergyPrediction();
// Fetch Temperature immediately
fetchTemperatureData();
// Fetch Cloud Cover and Solar Irradiance immediately
fetchCloudSolarData();
// Start logging live data immediately
logLiveData();

// Log new data every 1 minute
setInterval(logLiveData, 60000);

// Update Solar Maps and Weather Data every 1 minute
setInterval(fetchSolarRadiation, 60000);
setInterval(fetchSolarEnergyPrediction, 60000);
setInterval(fetchTemperatureData, 60000);
setInterval(fetchCloudSolarData, 60000);

// Update Live Weather Data every 1 minute
setInterval(fetchWeatherData, 60000);

// Fetch Solar Insight immediately on page load
fetchSolarInsight();

// Update Solar Insight Prediction every 1 minute
setInterval(fetchSolarInsight, 60000);

