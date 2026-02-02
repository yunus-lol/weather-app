const city = "london"
const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?key=AA9MY8ADE5P5E9RVNAB4XYZX6`

export async function getTodaysData() {
  const response = await fetch(url);
  const data = await response.json();
  displayInfo(data)
}

function displayInfo(data) {
  const todayTemp = document.querySelector(".today-temp")
  todayTemp.textContent = `${toCelsius(data.currentConditions.temp)}°C`
}

function toCelsius(temp) {
  return ((temp - 32) * 5/9).toFixed();
}
