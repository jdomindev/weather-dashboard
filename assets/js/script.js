
// WHEN I search for a city
// THEN I am presented with current and future conditions for that city and that city is added to the search history
    // WHEN I view current weather conditions for that city
  // X THEN I am presented with the city name, the date, an icon representation of weather conditions, the        temperature, the humidity, the wind speed, and the UV index
    // WHEN I view the UV index
  // X THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
// WHEN I view future weather conditions for that city
// THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city

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
        // current city name
        var currentCity = data[0].name
        var currentState = data[0].state
        var cityEl = document.querySelector(".current-city");
        cityEl.append(currentCity);
        cityEl.append(", " + currentState);
        var searchedCity = document.querySelector(".searched-city")
        var searchedEl = document.createElement("button")
        searchedEl.classList.add("btn","btn-dark","w-100","mt-2")
        searchedEl.append(currentCity)
        searchedCity.append(searchedEl) 
        // add event listener for searchedEl

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
        // convert unix to regular
        var currentDate = document.querySelector(".current-date");
        var date = moment.unix(currentUnixString).format("l");
        currentDate.append(date);
        var weatherIconCurrent = document.querySelector(".weather-icon");
        weatherIconCurrent.setAttribute("src", iconSrc);
        var currentTempEl = document.querySelector("#current-temp");
        var currentWindEl = document.querySelector("#current-wind");
        var currentHumidEl = document.querySelector("#current-humid");
        var currentUVEl = document.querySelector("#current-uv");
        // UV Conditional
        if (currentUV <= 2) {
          currentUVEl.classList.add("uv-background","uv-background-low");
        } else if (currentUV > 2 && currentUV < 6) {
          currentUVEl.classList.add("uv-background","uv-background-moderate");
        } else if (currentUV >= 6 && currentUV < 8) {
          currentUVEl.classList.add("uv-background","uv-background-high");
        }else if (currentUV >= 8 && currentUV < 11) {
          currentUVEl.classList.add("uv-background","uv-background-very-high");
        }else {
          currentUVEl.classList.add("uv-background","uv-background-extreme");
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
        var unixString = []

        // get data for daily weather
        for (let i = 0; i < 6; i++) {
          dailyWeather.push(data.daily[i].weather[0].icon);
          dailyTemps.push(data.daily[i].temp.day);
          dailyWind.push(data.daily[i].wind_speed);
          dailyHumid.push(data.daily[i].humidity);
          unixString.push(data.daily[i].dt.toString());
        }
        
        // console.log(dailyDate);
        // var cardTitle = document.querySelector(".card-title");
        // for (let i = 1; i < unixString.length; i++) {
        // var dailyDates = unixString[i]
        // var dailyDate = moment.unix(dailyDates).format("l")
        // console.log(dailyDates);
        // console.log(dailyDate);
        // // cardTitle.append(dailyDate)
        
        // }
        
  
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
