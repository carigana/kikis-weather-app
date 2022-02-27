let now = new Date();
// current time
function currentTime(now) {
  let hours = now.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = now.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let newTime = `${hours}:${minutes}`;
  return newTime;
}
// days of the week
let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
let today = days[now.getDay()];
document.querySelector("#date").innerHTML = today;
document.querySelector("#time").innerHTML = currentTime(now);

//format timestamp to weekday- forecast

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();

  return days[day];
}
// forecast

function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = `<div class="row weekdays">`;

  forecast.forEach(function (forecastDay, index) {
    if (index < 5) {
      forecastHTML =
        forecastHTML +
        `	
		<div class="col">
      ${formatDay(forecastDay.dt)} <br />
      <img class="wkd-icon" src="http://openweathermap.org/img/wn/${
        forecastDay.weather[0].icon
      }@2x.png" /> <br />
      <span class="low-temp">${Math.round(
        forecastDay.temp.min
      )}°</span> <span class="divider">/</span> <span class="high-temp">${Math.round(
          forecastDay.temp.max
        )}°</span>
		</div>
	`;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

// search bar
function enterCity(event) {
  event.preventDefault();
  let cityInput = document.querySelector("#enter-city").value;
  searchCity(cityInput);

  let searchInput = document.querySelector("#enter-city");
  searchInput.value = "";
}

let cityForm = document.querySelector("#city-search");
cityForm.addEventListener("submit", enterCity);

// search current location
function searchLocation(position) {
  let apiKey = "1f983d213665d2d7dbab69270eb302b3";
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
  axios.get(apiUrl).then(showWeather);
}

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchLocation);
}

// api call City

function searchCity(cityInput) {
  let apiKey = "1f983d213665d2d7dbab69270eb302b3";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&appid=${apiKey}&units=metric`;

  axios.get(apiUrl).then(showWeather);
}
// api call coordinates

function getForecast(coordinates) {
  let apiKey = "1f983d213665d2d7dbab69270eb302b3";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;

  axios.get(apiUrl).then(displayForecast);
}

// show weather

function showWeather(response) {
  document
    .querySelector("#icon")
    .setAttribute(
      "src",
      `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
    );
  document.querySelector("#city").innerHTML = response.data.name;
  document.querySelector("#current-temp").innerHTML = Math.round(
    response.data.main.temp
  );
  document.querySelector("#wind-speed").innerHTML = Math.round(
    response.data.wind.speed
  );
  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  document.querySelector("#blue-temp").innerHTML = Math.round(
    response.data.main.temp_min
  );
  document.querySelector("#red-temp").innerHTML = Math.round(
    response.data.main.temp_max
  );

  document.querySelector("#we-description").innerHTML =
    response.data.weather[0].main;

  celTemp = response.data.main.temp;

  getForecast(response.data.coord);
}

//

// current
let currentLocation = document.querySelector("#current");
currentLocation.addEventListener("click", getCurrentLocation);

// cel-fa temp
function showFaTemp(event) {
  event.preventDefault();
  let tempElement = document.querySelector("#current-temp");
  let faTemp = (celTemp * 9) / 5 + 32;

  tempElement.innerHTML = Math.round(faTemp);
}
function showCelTemp(event) {
  event.preventDefault();
  let tempElement = document.querySelector("#current-temp");
  tempElement.innerHTML = Math.round(celTemp);
}

let celTemp = null;
let fahrenheitLink = document.querySelector("#fa-link");
fahrenheitLink.addEventListener("click", showFaTemp);
let celciusLink = document.querySelector("#cel-link");
celciusLink.addEventListener("click", showCelTemp);

// default city
searchCity("Osaka");
