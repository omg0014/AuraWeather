// API Configuration
const url = 'https://api.openweathermap.org/data/2.5/weather';
const apiKey = 'f00c38e0279b7bc85480c3fe775d518c'; // Replace with your API Key

// DOM Elements
const citySelect = $('#city-input');
const cityName = $('#city-name');
const dateElement = $('#date');
const weatherIcon = $('#weather-icon');
const temperature = $('#temperature');
const description = $('#description');
const windSpeed = $('#wind-speed');
const humidity = $('#humidity');
const pressure = $('#pressure');
const weatherInfo = $('#weather-info');
const tempBarFill = $('#temp-bar-fill');

// Initialize app
$(document).ready(function () {
  citySelect.select2({ placeholder: "Select a city", allowClear: true });
  getWeather('Pune');

  citySelect.on('change', function () {
    getWeather();
  });
});

// Get weather data
async function getWeather(city) {
  const selectedCity = city || citySelect.val().trim();

  if (!selectedCity) {
    alert('Please select a city.');
    return;
  }

  const apiUrl = `${url}?q=${selectedCity}&appid=${apiKey}&units=metric`;

  try {
    showLoading();
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (response.ok) {
      displayWeather(data);
    } else {
      showError(data.message || 'City not found.');
    }
  } catch (error) {
    showError('Failed to fetch weather data.');
    console.error(error);
  }
}

// Display data
function displayWeather(data) {
  cityName.text(`${data.name}, ${data.sys.country}`);
  dateElement.text(moment().format('dddd, MMMM Do YYYY | h:mm A'));
  temperature.html(`${Math.round(data.main.temp)}<span>°C</span>`);
  description.text(data.weather[0].description);
  weatherIcon.attr('src', `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`);
  weatherIcon.attr('alt', data.weather[0].main);

  windSpeed.text(`${data.wind.speed} m/s`);
  humidity.text(`${data.main.humidity}%`);
  pressure.text(`${data.main.pressure} hPa`);

  tempBarFill.css('width', `${Math.min(100, Math.round(data.main.temp))}%`);

  updateBackground(data.weather[0].main);
  weatherInfo.fadeIn();
}

// Helpers
function showLoading() {
  weatherInfo.hide();
}

function showError(message) {
  alert(message);
  weatherInfo.hide();
}

function updateBackground(condition) {
  const lower = condition.toLowerCase();
  const body = $('body');

  const gradients = {
    clear: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    clouds: 'linear-gradient(135deg, #bdc3c7 0%, #2c3e50 100%)',
    rain: 'linear-gradient(135deg, #3a7bd5 0%, #00d2ff 100%)',
    snow: 'linear-gradient(135deg, #e6e9f0 0%, #eef1f5 100%)',
    thunderstorm: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
    drizzle: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)',
    mist: 'linear-gradient(135deg, #bdc3c7 0%, #cfd9df 100%)',
    fog: 'linear-gradient(135deg, #bdc3c7 0%, #cfd9df 100%)',
    haze: 'linear-gradient(135deg, #bdc3c7 0%, #cfd9df 100%)',
    default: 'linear-gradient(135deg, #4361ee 0%, #3f37c9 50%, #4cc9f0 100%)'
  };

  body.css('background', gradients[lower] || gradients.default);
}
