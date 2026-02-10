// 1) PASTE YOUR WEATHERAPI KEY HERE
const API_KEY = "a47033b8a9dd4f1f81120048261002";

// WeatherAPI endpoint for current weather
const BASE_URL = "https://api.weatherapi.com/v1/current.json";

// Grab elements from the HTML
const locationSelect = document.querySelector("#locationSelect");
const getWeatherBtn = document.querySelector("#getWeatherBtn");

const locationEl = document.querySelector("#location");
const temperatureEl = document.querySelector("#temperature");
const conditionEl = document.querySelector("#condition");
const weatherIconEl = document.querySelector("#weatherIcon");

const weatherResult = document.querySelector("#weatherResult");

// Optional: hide result until first search
weatherResult.style.display = "none";

function buildUrl(city) {
  // key + q are required by WeatherAPI
  // aqi=no just keeps the response smaller
  return `${BASE_URL}?key=${API_KEY}&q=${encodeURIComponent(city)}&aqi=no`;
}

async function getWeather(city) {
  if (!API_KEY || API_KEY.includes("PASTE_YOUR_KEY_HERE")) {
    throw new Error("Missing API key. Paste your WeatherAPI key into script.js.");
  }

  const url = buildUrl(city);
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Request failed (${response.status}). Check your API key and try again.`);
  }

  return response.json();
}

function displayWeather(data) {
  // Pull values from the WeatherAPI response
  const cityName = data.location.name;
  const region = data.location.region ? `, ${data.location.region}` : "";
  const country = data.location.country ? `, ${data.location.country}` : "";

  const tempC = data.current.temp_c;
  const conditionText = data.current.condition.text;
  const iconPath = data.current.condition.icon; // usually starts with "//cdn..."
  const iconUrl = iconPath.startsWith("http") ? iconPath : `https:${iconPath}`;

  // Update the DOM (this is what your prof wants to see)
  locationEl.textContent = `${cityName}${region}${country}`;
  temperatureEl.textContent = `${tempC} °C`;
  conditionEl.textContent = conditionText;

  weatherIconEl.src = iconUrl;
  weatherIconEl.alt = conditionText;

  // Show the result box
  weatherResult.style.display = "inline-block";
}

// Event handler for button click
async function handleWeatherClick() {
  const city = locationSelect.value;

  // Simple loading UI
  getWeatherBtn.disabled = true;
  getWeatherBtn.textContent = "Loading...";

  try {
    const data = await getWeather(city);
    displayWeather(data);
  } catch (err) {
    // Show an error message in the UI
    locationEl.textContent = "Error";
    temperatureEl.textContent = "";
    conditionEl.textContent = err.message;
    weatherIconEl.src = "";
    weatherIconEl.alt = "";
    weatherResult.style.display = "inline-block";
  } finally {
    getWeatherBtn.disabled = false;
    getWeatherBtn.textContent = "Get Weather";
  }
}

// Make the page interactive
getWeatherBtn.addEventListener("click", handleWeatherClick);

// BONUS interactivity (optional): auto-fetch when changing the dropdown
locationSelect.addEventListener("change", handleWeatherClick);
