const searchButton = document.querySelector(".search-btn")
const cityInput = document.querySelector(".city-input")
const weatherCard = document.querySelector(".weather-cards")
const currentWeather = document.querySelector(".current-weather")
const locationButton = document.querySelector(".location-btn")
const API_KEY = "3e4b9a19754b36e8df2dad43a92570da"
const createWeatherCard = (cityName, weatherItem, index) => {
    if (index === 0) {//main card
        return ` 
        <div class="details">
        <h2>${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
        <h4>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(2)} C</h4>
        <h4>Wind:${weatherItem.wind.speed} M/S</h4>
        <h4>Humidity:${weatherItem.main.humidity}</h4>
    </div>
    <div class="icon">
        <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="">
        <h4>${weatherItem.weather[0].description}</h4>
    </div> `;
    }
    else {
        return `<li class="card">
        <h2>(${weatherItem.dt_txt.split(" ")[0]})</h2>
        <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="">
        <h4>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(2)} C</h4>
        <h4>Wind:${weatherItem.wind.speed} M/S</h4>
        <h4>Humidity:${weatherItem.main.humidity}</h4>
    </li>`
    }

}
const getWeatherDetails = (cityName, lat, lon) => {
    const WEATHER_API = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    fetch(WEATHER_API).then(res => res.json()).then(data => {
        const Uniqueforecast = []
        // console.log(data)
        const fiveDaysForecast = data.list.filter(forecast => {
            const forecastDate = new Date(forecast.dt_txt).getDate()
            if (!Uniqueforecast.includes(forecastDate)) {
                return Uniqueforecast.push(forecastDate)
            }
        })
        // clearing the previous weather
        cityInput.value = "";
        weatherCard.innerHTML = "";
        currentWeather.innerHTML = "";

        // console.log(fiveDaysForecast)
        fiveDaysForecast.forEach((weatherItem, index) => {
            if (index === 0) {
                weatherCard.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index))

            } else {
                weatherCard.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index))

            }

        })
    }).catch(() => {
        alert(`An error has been occurred while fetching the coordinates!`)

    })
}
const getCityCoordinates = () => {
    const cityName = cityInput.value.trim()
    if (!cityName) return
    // console.log(cityName)
    const GEO_API = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`
    fetch(GEO_API).then(res => res.json()).then(data => {
        if (!data.length) return alert(`No Coordinates found for${cityName}`)
        const { name, lat, lon } = data[0]
        getWeatherDetails(name, lat, lon)
    }).catch(() => {
        alert(`An error has been occurred while fetching the coordinates! ${cityName}`)

    })
}
const getUserCoordinates = () => {
    navigator.geolocation.getCurrentPosition(
        position => {
            const { latitude, longitude } = position.coords
            const REVERSE_GEO = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`
            fetch(REVERSE_GEO).then(res => res.json()).then(data => {
                const { name } = data[0]
                getWeatherDetails(name, latitude, longitude)
            }).catch(() => {
                alert(`An error has been occurred while fetching the City! ${cityName}`)

            })
        }, error => {

            if (error.code === error.PERMISSION_DENIED) {
                alert("Geolocation has been denied, please reset the location to grant access again")
            }
        }
    )
}
searchButton.addEventListener("click", getCityCoordinates)
locationButton.addEventListener("click", getUserCoordinates)
cityInput.addEventListener("keyup", e => e.key === "Enter" && getCityCoordinates())