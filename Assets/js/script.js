const apiKey = '3486951f861301667f6e3ee3e0064c8b';

const cityForm = document.getElementById('city-form');
const cityInput = document.getElementById('city-input');
const currentWeatherDiv = document.getElementById('current-weather');
const forecastDiv = document.getElementById('forecast');
const forecastTextDiv = document.getElementById('forecast-text');
const historyList = document.getElementById('history-list');

currentWeatherDiv.style.display = 'none';

let searchHistory = [];

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

function getCoordinates(city) {
    const queryURL = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;
    fetch(queryURL)
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

function getWeather(lat, lon, city) {
    const currentWeatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    fetch(currentWeatherURL)
        .then(response => response.json())
        .then(data => displayCurrentWeather(data, city))
        .catch(error => console.error('Error fetching current weather:', error));

    const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    fetch(forecastURL)
        .then(response => response.json())
        .then(data => displayForecast(data))
        .catch(error => console.error('Error fetching forecast:', error));
}

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
    currentWeatherDiv.style.display = 'block';
}

function displayForecast(data) {
    forecastTextDiv.innerHTML = '<h2>5-Day Forecast</h2>'; // Add text for 5-day forecast
    forecastDiv.innerHTML = '';
    const dailyData = data.list.filter(reading => reading.dt_txt.includes("12:00:00"));
    dailyData.forEach(day => {
        const forecastHTML = `
            <div class="forecast-day">
                <p>Date: ${new Date(day.dt_txt).toLocaleDateString()}</p>
                <p><img src="http://openweathermap.org/img/wn/${day.weather[0].icon}.png" alt="${day.weather[0].description}"></p>
                <p>Temperature: ${day.main.temp} °C</p>
                <p>Humidity: ${day.main.humidity} %</p>
                <p>Wind Speed: ${day.wind.speed} m/s</p>
            </div>
        `;
        forecastDiv.innerHTML += forecastHTML;
    });
}

function addToHistory(city) {
    if (!searchHistory.includes(city)) {
        searchHistory.push(city);
        const historyItem = document.createElement('li');
        historyItem.textContent = city;
        historyList.appendChild(historyItem);
    }
}