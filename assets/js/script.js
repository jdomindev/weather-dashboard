var citySubmitButton = document.querySelector("#city-submit-button");
var citySubmitForm = document.querySelector("#city-submit-form");
var citySearch = document.querySelector("#city-search");
function searchCity(event) {
  event.preventDefault();
  if (citySubmitForm === null) {
    console.log("NULL");
  } else {
    var city = citySearch.value;
    var apiKey = "appid=13ac4c2d8bb2ff4c49a57881f07758ad";
    var requestUrlGeocode =
      "http://api.openweathermap.org/geo/1.0/direct?q=" +
      city +
      "&limit=1&" +
      apiKey;

    fetch(requestUrlGeocode)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log(data);
        for (let i = 0; i < data.length; i++) {
          var longitude = data[i].lon;
          var latitude = data[i].lat;
        }
        var requestUrl =
          "https://api.openweathermap.org/data/2.5/onecall?" +
          "lat=" +
          latitude +
          "&lon=" +
          longitude +
          "&" +
          "units=imperial" +
          "&" +
          apiKey;
        return fetch(requestUrl);
      })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        // get data for current weather
        console.log(data.current);
        var currentUnixString = data.current.dt.toString();
        var iconCode = data.current.weather[0].icon;
        var iconSrc = "http://openweathermap.org/img/w/" + iconCode + ".png";
        var currentTemp = data.current.temp;
        var currentWind = data.current.wind_speed;
        var currentHumid = data.current.humidity;
        var currentUV = data.current.uvi;
        // add current weather to document
        var currentCity = document.querySelector(".current-city");
        currentCity.append(city);
        // convert unix to regular
        var date = moment.unix(currentUnixString).format("l");
        currentCity.append(" -- " + date);
        var weatherIconCurrent = document.querySelector(".weather-icon");
        weatherIconCurrent.setAttribute("src", iconSrc);
        var currentTempEl = document.querySelector("#current-temp");
        var currentWindEl = document.querySelector("#current-wind");
        var currentHumidEl = document.querySelector("#current-humid");
        var currentUVEl = document.querySelector("#current-uv");
        currentUVEl.classList.add("class", "uv-background");
        // UV Conditional
        if (currentUV <= 2) {
          currentUVEl.classList.add("class", "uv-background-low");
        } else if (currentUV > 2 && currentUV < 6) {
          currentUVEl.classList.add("class", "uv-background-moderate");
        } else if (currentUV >= 6 && currentUV < 8) {
          currentUVEl.classList.add("class", "uv-background-high");
        }else if (currentUV >= 8 && currentUV < 11) {
          currentUVEl.classList.add("class", "uv-background-very-high");
        }else {
          currentUVEl.classList.add("class", "uv-background-extreme");
        }
        currentTempEl.append(currentTemp + " F");
        currentWindEl.append(currentWind + " MPH");
        currentHumidEl.append(currentHumid + "%");
        currentUVEl.append(currentUV);
        // make arrays for daily weather
        console.log(data.daily);
        var dailyWeather = [];
        var dailyTemps = [];
        var dailyWind = [];
        var dailyHumid = [];
        // get data for daily weather
        for (let i = 0; i < 5; i++) {
          dailyWeather.push(data.daily[i].weather[0].icon);
          dailyTemps.push(data.daily[i].temp.day);
          dailyWind.push(data.daily[i].wind_speed);
          dailyHumid.push(data.daily[i].humidity);
          var unixString = data.daily[0].dt.toString();
        }
      });
  }
}

// function addContent() {
// }

citySubmitForm.addEventListener("submit", searchCity);

// Left to do:
// need to rework css

// in script:
// on load needs to display philadelphia weather stats
// needs to clear when searching another result
// break down big function into smaller bits if possible
