// API Key
const apiKey = `3486951f861301667f6e3ee3e0064c8b`;

// Must match HTML
const cityForm = document.getElementById('city-form');
const cityInput = document.getElementById('city-input');
const currentWeatherDiv = document.getElementById('current-weather');
const forecastDiv = document.getElementById('forecast');
const historyList = document.getElementById('history-list');
const queryURL = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}`;

// Previous cities searched
let searchHistory = [];

// Function for Form
cityForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const city = cityInput.value.trim();
    if (city) {
        getCoordinates(city);
        addToHistory(city);
        cityInput.value = '';
    }
});

historyList.addEventListener('click', function(event) {
    if (event.target.tagName === 'LI') {
        const city = event.target.textContent;
        getCoordinates(city);
    }
});

// Function for coordinates
function getCoordinates(city) {
    fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                const { lat, lon } = data[0];
                getWeather(lat, lon, city);
            } else {
                alert('City not found');
            }
        })
        .catch(error => console.error('Error fetching coordinates:', error));
}

// Adding functions for retrieving weather according to latitude and longitude, and city information
function getWeather(lat, lon, city) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => displayCurrentWeather(data, city))
        .catch(error => console.error('Error fetching current weather:', error));

    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => displayForecast(data))
        .catch(error => console.error('Error fetching forecast:', error));
}

// Function for displaying current weather
function displayCurrentWeather(data, city) {
    const weatherHTML = `
        <h2>${city}</h2>
        <p>Date: ${new Date().toLocaleDateString()}</p>
        <p><img src="http://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="${data.weather[0].description}"></p>
        <p>Temperature: ${data.main.temp} °C</p>
        <p>Humidity: ${data.main.humidity} %</p>
        <p>Wind Speed: ${data.wind.speed} m/s</p>
    `;
    currentWeatherDiv.innerHTML = weatherHTML;
}

// Function for displaying forecast
function displayForecast(data) {
    forecastDiv.innerHTML = '<h2>5-Day Forecast</h2>';
    for (let i = 0; i < data.list.length; i += 8) { // OpenWeatherMap provides data every 3 hours; 8 intervals represent a day
        const forecast = data.list[i];
        const forecastHTML = `
            <div>
                <p>Date: ${new Date(forecast.dt_txt).toLocaleDateString()}</p>
                <p><img src="http://openweathermap.org/img/wn/${forecast.weather[0].icon}.png" alt="${forecast.weather[0].description}"></p>
                <p>Temperature: ${forecast.main.temp} °C</p>
                <p>Humidity: ${forecast.main.humidity} %</p>
                <p>Wind Speed: ${forecast.wind.speed} m/s</p>
            </div>
        `;
        forecastDiv.innerHTML += forecastHTML;
    }
}

// Function for search history
function addToHistory(city) {
    if (!searchHistory.includes(city)) {
        searchHistory.push(city);
        const historyItem = document.createElement('li');
        historyItem.textContent = city;
        historyList.appendChild(historyItem);
    }
}
