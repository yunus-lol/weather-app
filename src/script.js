let weatherData;
let isCelcius = true;

export async function getTodaysData(city) {
  const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?key=AA9MY8ADE5P5E9RVNAB4XYZX6`;
  const response = await fetch(url);
  const data = await response.json();
  weatherData = data;
  displayInfo();
}

function displayInfo() {
  const todayTemp = document.querySelector(".today-temp");
  todayTemp.textContent = `${isCelcius ? toCelsius(weatherData.currentConditions.temp) : (weatherData.currentConditions.temp).toFixed()}${isCelcius ? "°C" : "°F"}`;

  const weatherIcon = document.querySelector(".weather-icon")
  weatherIcon.textContent = displayIcon(weatherData.currentConditions.icon);

  const minTemp = document.querySelector(".min");
  const maxTemp = document.querySelector(".max");

  modeSwitcher.textContent = `${isCelcius ? "Toggle Fahrenheit" : "Toggle Celcius"}`
  minTemp.textContent = `Min: ${isCelcius ? toCelsius(weatherData.days[0].tempmin) : (weatherData.days[0].tempmin).toFixed()}${isCelcius ? "°C" : "°F"}`;
  maxTemp.textContent = `Max: ${isCelcius ? toCelsius(weatherData.days[0].tempmax) : (weatherData.days[0].tempmax).toFixed()}${isCelcius ? "°C" : "°F"}`;

  const todaysDate = document.querySelector(".today-date");
  todaysDate.textContent = getDate();

  displayFutureTemps();
  displayFeelsLike();
  displaySunriseSunset();
  displayCards();
}

function displayIcon(icon) {
  if (icon === "cloudy" || icon === "partly-cloudy-night") {
    return "☁️";
  } else if (icon === "partly-cloudy-day") {
    return "⛅";
  } else if (icon === "rain" || icon === "showers-day" || icon === "showers-night") {
    return "🌧️";
  } else if (icon === "clear-day" || icon === "clear-night") {
    return "🌤️";
  } else if (icon === "fog") {
    return "🌫️";
  } else if (icon === "wind") {
    return "💨";
  } else if (icon === "thunder-rain" || icon === "thunder-showers-day" || icon === "thunder-showers-night") {
    return "⛈️";
  } else if (icon === "snow") {
    return "❄️";
  } else if (icon === "snow-showers-day" || icon === "snow-showers-night") {
    return "🌨️";
  } else {
    return "☀️";
  }
}

function toCelsius(temp) {
  return ((temp - 32) * 5/9).toFixed();
}

function formatCityName(data) {
  return data.split(" ").map(word => word[0].toUpperCase() + word.substr(1, 100)).join(" ")
}

function getDate() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const date = new Date();
  const offsetMinutes = weatherData.tzoffset * 60;
  const adjustedDate = new Date(date.getTime() + (offsetMinutes * 60000));

  const dayIndex = adjustedDate.getDay() - 1;
  const day = dayIndex === -1 ? "Sun" : days[dayIndex]

  const monthIndex = adjustedDate.getMonth();
  const month = months[monthIndex];

  return `${day}, ${month} ${adjustedDate.getDate()}`;
}

function getWeekDates() {
  const dates = [];
  for (let x = 1; x < 7; x++) {
    const date = new Date;
    date.setDate(date.getDate() + x);
    dates.push(date.toDateString());
  }

  return dates;
}

function getFutureTemps() {
  const date = new Date;
  const offsetMinutes = weatherData.tzoffset * 60;
  const adjustedDate = new Date(date.getTime() + (offsetMinutes * 60000));

  let count = 0;
  let arr = [];
  for (let x = 0; x < weatherData.days[0].hours.length; x++) {
    if (x > adjustedDate.getHours() && count !== 5) {
      count++;
      arr.push(weatherData.days[0].hours[x]);
    }
  }

  return arr;
}

function displayFutureTemps() {
  const futureTempsTable = document.querySelector(".future-temps-table");

  futureTempsTable.innerHTML = "";
  const arr = getFutureTemps();
  arr.forEach(item => {
    const card = document.createElement("div");
    card.innerHTML = `
      <div class="temps-row">
        <div class="future-time">${item.datetime.substr(0,5)}</div>
        <div class="future-temp">${isCelcius ? toCelsius(item.temp) : item.temp.toFixed()}${isCelcius ? "°C" : "°F"}</div>
      </div>
    `;

    futureTempsTable.appendChild(card);
  })
}

function displayFeelsLike() {
  const feelsLike = document.querySelector(".feels-like");
  const card = document.createElement("div");
  feelsLike.innerHTML = "";
  card.innerHTML = `
    <div class="feels-like-title">Feels Like</div>
    <h1 class="feels-like-temp">${isCelcius ? toCelsius(weatherData.days[0].feelslike) : weatherData.days[0].feelslike.toFixed()}${isCelcius ? "°C" : "°F"}</h1>
    <p class="feels-like-description">${weatherData.days[0].description}</p>
  `;

  feelsLike.appendChild(card);
}

function displaySunriseSunset() {
  const sunriseSunset = document.querySelector(".sunrise-sunset");
  sunriseSunset.innerHTML = "";
  const card = document.createElement("div");
  card.innerHTML = `
    <div class="sunrise-sunset-title">Sunrise/Sunset</div>
    <div class="times-section">
      <div class="sunrise">Sunrise: ${weatherData.currentConditions.sunrise.substr(1,4)}am</div>
      <div class="sunset">Sunset: ${(weatherData.currentConditions.sunset.substr(0,2) - 12) + weatherData.currentConditions.sunset.substr(2,3)}pm</div>
    </div>
  `;

  sunriseSunset.appendChild(card);
}

function getCardData() {
  let arr = [];
  for (let x = 1; x < 7; x++) {
    arr.push(weatherData.days[x]);
  }

  return arr;
}

function displayCards() {
  const cards = document.querySelector(".cards");
  const cardData = getCardData();
  cards.innerHTML = "";
  let count = 0;

  cardData.forEach(item => {
    const card = document.createElement("div");
    const index = cardData.indexOf(item)
    count++;
    card.innerHTML = `
      <div class="card-item">
        <div class="card-date today-date">${[getWeekDates()[index].substring(0,10).slice(0, 3), ",", getWeekDates()[index].substring(0,10).slice(3)].join("")}</div>
        <div class="card-icon">${displayIcon(item.icon)}</div>
        <div class="card-temp">${isCelcius ? toCelsius(item.temp) : item.temp.toFixed()}${isCelcius ? "°C" : "°F"}</div>
        <div class="card-description">${item.description}</div>
      </div>
    `;

    cards.appendChild(card);
  });
}

const searchBtn = document.querySelector(".search-button");
const cityName = document.querySelector(".city-name");

searchBtn.addEventListener("click", () => {
  const city = document.querySelector("#city-search").value.toLowerCase();
  if (city) {
    try {
      getTodaysData(city);
      cityName.textContent = formatCityName(city);
    } catch(error) {

    }
  }
});

const modeSwitcher = document.querySelector(".toggle-unit");
modeSwitcher.addEventListener("click", () => {
  isCelcius = !isCelcius;
  displayInfo();
});