const form = document.getElementById('weather-form');
const cityInput = document.getElementById('city');
const output = document.getElementById('output');
const loader = document.getElementById('loader');
const locationBtn = document.getElementById("location-btn");

const historyList = document.getElementById('history-list');
const clearHistoryBtn = document.getElementById('clear-history');

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY; // Replace with your real OpenWeatherMap API key
let searchHistory = JSON.parse(localStorage.getItem("weatherHistory")) || [];


function displayHistory(){

  historyList.innerHTML = "";

  searchHistory.forEach(city => {

    const li = document.createElement("li");
    li.textContent = city;

    historyList.appendChild(li);

  });

}

displayHistory();


form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const city = cityInput.value.trim();

  if (!city) {
    output.textContent = 'Please enter a city name.';
    return;
  }

  loader.classList.remove("hidden");
   output.innerHTML = "";

  try {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);

    if (!res.ok) {
      throw new Error('City not found');
    }

    const data = await res.json();
    loader.classList.add("hidden");
    // Save search history

searchHistory = searchHistory.filter(
  item => item.toLowerCase() !== city.toLowerCase()
);


searchHistory.unshift(city);


// only last 3 searches
searchHistory = searchHistory.slice(0,3);


localStorage.setItem(
  "weatherHistory",
  JSON.stringify(searchHistory)
);


displayHistory();

    output.innerHTML = `
      <h3>${data.name}, ${data.sys.country}</h3>

      <img 
      src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png"
      alt="Weather Icon"
      />

      <p><strong>Temperature:</strong> ${data.main.temp} °C</p>
      <p><strong>Condition:</strong> ${data.weather[0].main}</p>
      <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
      <p><strong>Wind Speed:</strong> ${data.wind.speed} m/s</p>
`;
  } catch (err) {

    loader.classList.add("hidden");

    output.textContent = `Error: ${err.message}`;

}
});

clearHistoryBtn.addEventListener("click",()=>{

  localStorage.removeItem("weatherHistory");

  searchHistory = [];

  displayHistory();

});

//current Location
locationBtn.addEventListener("click", () => {

  if(navigator.geolocation){

    navigator.geolocation.getCurrentPosition(
      
      async (position)=>{

        const lat = position.coords.latitude;
        const lon = position.coords.longitude;


        loader.classList.remove("hidden");
        output.innerHTML = "";


        try{

          const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
          );


          if(!res.ok){
            throw new Error("Unable to fetch location weather");
          }


          const data = await res.json();


          loader.classList.add("hidden");


          output.innerHTML = `
            <h3>${data.name}, ${data.sys.country}</h3>

            <img 
            src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png"
            alt="Weather Icon"
            />

            <p><strong>Temperature:</strong> ${data.main.temp} °C</p>

            <p><strong>Condition:</strong> ${data.weather[0].main}</p>

            <p><strong>Humidity:</strong> ${data.main.humidity}%</p>

            <p><strong>Wind Speed:</strong> ${data.wind.speed} m/s</p>
          `;


        }
        catch(error){

          loader.classList.add("hidden");

          output.textContent = error.message;

        }

      },


      ()=>{
        output.textContent = 
        "Location permission denied.";
      }

    );


  }
  else{

    output.textContent =
    "Geolocation is not supported by your browser.";

  }

});