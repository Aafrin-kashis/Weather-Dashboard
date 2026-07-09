const form = document.getElementById('weather-form');
const cityInput = document.getElementById('city');
const output = document.getElementById('output');

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY; // Replace with your real OpenWeatherMap API key


form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const city = cityInput.value.trim();

  if (!city) {
    output.textContent = 'Please enter a city name.';
    return;
  }

  output.textContent = 'Loading...';

  try {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);

    if (!res.ok) {
      throw new Error('City not found');
    }

    const data = await res.json();

    output.innerHTML = `
      <h3>${data.name}, ${data.sys.country}</h3>
      <p><strong>Temperature:</strong> ${data.main.temp} °C</p>
      <p><strong>Condition:</strong> ${data.weather[0].main}</p>
      <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
      <p><strong>Wind Speed:</strong> ${data.wind.speed} m/s</p>
    `;
  } catch (err) {
    output.textContent = `Error: ${err.message}`;
  }
});