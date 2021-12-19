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
        var unixDate = data.current.dt
        var iconCode = data.current.weather[0].icon
        var iconSrc = "http://openweathermap.org/img/w/" + iconCode + ".png";
        var currentTemp = data.current.temp;
        var currentWind = data.current.wind_speed;
        var currentHumid = data.current.humidity;
        var currentUV = data.current.uvi;
        // add current weather to document 
        var currentCity = document.querySelector(".current-city");
        currentCity.append(city);
        // Need to convert unix to regular
        var currentCity = document.querySelector(".current-date");
        currentCity.append();
        var weatherIconCurrent = document.querySelector(".weather-icon")
        weatherIconCurrent.setAttribute("src", iconSrc)
        var currentTempEl = document.querySelector("#current-temp");
        var currentWindEl = document.querySelector("#current-wind");
        var currentHumidEl = document.querySelector("#current-humid");
        var currentUVEl = document.querySelector("#current-uv");
        currentTempEl.append("Temperature: " + currentTemp + " F");
        currentWindEl.append("Wind speed: " + currentWind + " MPH");
        currentHumidEl.append("Humidity: " + currentHumid + "%");
        currentUVEl.append("UV Index: " + currentUV);
        // make arrays for daily weather
        console.log(data.daily);
        var dailyWeather = []
        var dailyTemps = []
        var dailyWind = []
        var dailyHumid = []
        // get data for daily weather
        for (let i = 0; i < 5; i++) {
          dailyWeather.push(data.daily[i].weather[0].icon)
          dailyTemps.push(data.daily[i].temp.day);
          dailyWind.push(data.daily[i].wind_speed);
          dailyHumid.push(data.daily[i].humidity);
          var unixNum = data.daily[0].dt
          var unixString = unixNum.toString()
        } 
        // console.log(unixString);
        console.log(moment.unix(unixString).format("MMMM Do, YYYY"));
      });
  }
}

// function addContent() {
// }

citySubmitForm.addEventListener("submit", searchCity);


// Left to do:
// need to rework css 

// in script:
// need to convert unix timestamp to date format
// needs to clear when searching another result
// break down big function into smaller bits if possible