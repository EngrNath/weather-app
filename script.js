const apiKey = '760056f730824edb95e101721251403'; // Replace with your WeatherAPI.com API key
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const locationBtn = document.getElementById('location-btn');
const weatherInfo = document.getElementById('weather-info');
const forecastDays = document.getElementById('forecast-days');
const searchList = document.getElementById('search-list');

// Fetch Weather Data
async function getWeather(city) {
    const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=3`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.error) {
            weatherInfo.innerHTML = `<p class="error">${data.error.message}</p>`;
        } else {
            displayWeather(data);
            saveSearch(city);
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
        weatherInfo.innerHTML = `<p class="error">An error occurred. Please try again later.</p>`;
    }
}

// Display Weather Data
function displayWeather(data) {
    const { location, current, forecast } = data;

    // Update current weather
    document.getElementById('city-name').textContent = `${location.name}, ${location.country}`;
    document.getElementById('weather-icon').src = current.condition.icon;
    document.getElementById('temperature').textContent = `Temperature: ${current.temp_c}°C`;
    document.getElementById('weather-condition').textContent = `Weather: ${current.condition.text}`;
    document.getElementById('humidity').textContent = `Humidity: ${current.humidity}%`;
    document.getElementById('wind-speed').textContent = `Wind: ${current.wind_kph} km/h`;

    // Update 3-Day Forecast
    forecastDays.innerHTML = forecast.forecastday.map(day => `
    <div class="forecast-day">
      <p>Date: ${day.date}</p>
      <img src="${day.day.condition.icon}" alt="${day.day.condition.text}">
      <p>Max Temp: ${day.day.maxtemp_c}°C</p>
      <p>Min Temp: ${day.day.mintemp_c}°C</p>
      <p>Condition: ${day.day.condition.text}</p>
    </div>
  `).join('');
}

// Save Recent Searches
function saveSearch(city) {
    let searches = JSON.parse(localStorage.getItem('recentSearches')) || [];
    if (!searches.includes(city)) {
        searches.push(city);
        if (searches.length > 5) searches.shift(); // Keep only the last 5 searches
        localStorage.setItem('recentSearches', JSON.stringify(searches));
        displayRecentSearches();
    }
}

// Display Recent Searches
function displayRecentSearches() {
    const searches = JSON.parse(localStorage.getItem('recentSearches')) || [];
    searchList.innerHTML = searches.map(city => `
    <li onclick="getWeather('${city}')">${city}</li>
  `).join('');
}

// Event Listeners
searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        getWeather(city);
    } else {
        alert('Please enter a city name.');
    }
});

locationBtn.addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                getWeather(`${latitude},${longitude}`);
            },
            (error) => {
                console.error('Error getting location:', error);
                alert('Unable to retrieve your location.');
            }
        );
    } else {
        alert('Geolocation is not supported by your browser.');
    }
});

// Display recent searches on page load
displayRecentSearches();