let weatherData;

export async function getTodaysData(city) {
  let url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?key=AA9MY8ADE5P5E9RVNAB4XYZX6`;
  const response = await fetch(url);
  const data = await response.json();
  weatherData = data;
  displayInfo(data);
}

let isCelcius = true;

function displayInfo() {
  const todayTemp = document.querySelector(".today-temp");
  todayTemp.textContent = `${isCelcius ? toCelsius(weatherData.currentConditions.temp) : (weatherData.currentConditions.temp).toFixed()}${isCelcius ? "°C" : "°F"}`;

  displayIcon(weatherData.currentConditions.icon)

  const minTemp = document.querySelector(".min");
  const maxTemp = document.querySelector(".max");

  minTemp.textContent = `Min: ${isCelcius ? toCelsius(weatherData.days[0].tempmin) : (weatherData.days[0].tempmin).toFixed()}${isCelcius ? "°C" : "°F"}`;
  maxTemp.textContent = `Max: ${isCelcius ? toCelsius(weatherData.days[0].tempmax) : (weatherData.days[0].tempmax).toFixed()}${isCelcius ? "°C" : "°F"}`;

  const todaysDate = document.querySelector(".today-date");
  todaysDate.textContent = getDate();
}

function displayIcon(icon) {
  const weatherIcon = document.querySelector(".weather-icon");

  if (icon === "cloudy") {
    weatherIcon.textContent = "☁️"
  } else if (icon === "rain") {
    weatherIcon.textContent = "🌧️"
  }
}

function toCelsius(temp) {
  return ((temp - 32) * 5/9).toFixed();
}

function formatCityName(city) {
  let split = city.split("");
  const newValue = split[0].toUpperCase();
  split.splice(0,1);
  return newValue + split.join("");
}

function getDate() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const date = new Date();

  const dayIndex = date.getDay() - 1;
  const day = days[dayIndex];

  const monthIndex = date.getMonth();
  const month = months[monthIndex];

  const dateValue = date.getDate();
  return `${day}, ${month} ${dateValue}`;
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
      console.log(error);
    }
  }
});

const modeSwitcher = document.querySelector(".toggle-unit");
modeSwitcher.addEventListener("click", () => {
  isCelcius = !isCelcius
  displayInfo()
});