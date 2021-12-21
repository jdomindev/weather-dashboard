//      WHEN I search for a city
//    X THEN I am presented with current and future conditions for that city and that city is added to the search history
//      WHEN I view current weather conditions for that city
//    X THEN I am presented with the city name, the date, an icon representation of weather conditions, the        temperature, the humidity, the wind speed, and the UV index
//      WHEN I view the UV index
//    X THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
//      WHEN I view future weather conditions for that city
//    X THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city

// variables for search form
var citySubmitButton = document.querySelector("#city-submit-button");
var citySubmitForm = document.querySelector("#city-submit-form");
var citySearch = document.querySelector("#city-search");
// variable for fetch
var apiKey = "appid=13ac4c2d8bb2ff4c49a57881f07758ad";

// variables for current day weather
var currentTempEl = document.querySelector("#current-temp");
var currentWindEl = document.querySelector("#current-wind");
var currentHumidEl = document.querySelector("#current-humid");
var currentUVEl = document.querySelector("#current-uv");
var cityEl = document.querySelector(".current-city");
// Search history variables
var searchedCities = document.querySelector(".searched-cities");

function onLoad() {
  // citySearch.value = "Philadelphia";
  // searchCity(event);
  // get searched cities from local storage
  var savedSearchedCitiesTexts = JSON.parse(
    localStorage.getItem("searchedCities")
  );
   
  if (!savedSearchedCitiesTexts) {
    savedSearchedCitiesTexts = []
  }
   // loop over searched cities array.length to populate city buttons
  for (let i = 0; i < savedSearchedCitiesTexts.length; i++) {
    var searchedEl = document.createElement("button");
    searchedEl.classList.add(
      "searched-city",
      "btn",
      "btn-dark",
      "w-100",
      "mt-2"
    );
    searchedEl.append(savedSearchedCitiesTexts[i]);
    searchedCities.append(searchedEl);
    searchedEl.addEventListener("click", function (e) {
      onClickCityButton(e);
    });
  }
  
 
 
}

function searchCity(event) {
  event.preventDefault();
  var city = citySearch.value;
  
  var requestUrlGeocode =
    "https://api.openweathermap.org/geo/1.0/direct?q=" +
    city +
    "&limit=1&" +
    apiKey;

  fetch(requestUrlGeocode)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      clearName()
      var [latitude, longitude] = getCurrentCity(data);

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
      clear();
      // get data for current weather
      getCurrentWeather(data);
      // make cards for daily weather + get data for daily weather
      createDailyCards(data);
      // save searched cities to local storage
      saveSearchedCities();
      // clear search bar
      document.querySelector("#city-search").value = ""
    });
}

function clearName() {
  document.querySelector(".current-city").innerHTML = "";
}

function clear() {
  // clear daily weather cards
  document.querySelector("#row").innerHTML = "";
  // clear current weather
  document.querySelector(".current-date").innerHTML = "";
  document.querySelector(".weather-icon").innerHTML = "";
  document.querySelector("#current-temp").innerHTML = "";
  document.querySelector("#current-wind").innerHTML = "";
  document.querySelector("#current-humid").innerHTML = "";
  document.querySelector("#current-uv").innerHTML = "";
}

function onClickCityButton(event) {
  citySearch.value = event.target.innerText;
  searchCity(event);

  // set Local storage
  // save city to searched cities array in local storage
  // get searched cities array from local storage
  // push searched city to searched cities array
  // save updated cities array back to local storage
}

function getCurrentCity(data) {
  for (let i = 0; i < data.length; i++) {
    var longitude = data[i].lon;
    var latitude = data[i].lat;
  }
  // current city name and state
  var currentCity = data[0].name;
  var currentState = data[0].state;
  // added to document
  cityEl.append(currentCity);
  cityEl.append(", " + currentState);
  // add searched city buttons
  var searchedEl = document.createElement("button");
  searchedEl.classList.add("searched-city", "btn", "btn-dark", "w-100", "mt-2");
  searchedEl.append(currentCity);
  searchedCities.append(searchedEl);
  searchedEl.addEventListener("click", function (e) {
    onClickCityButton(e);
  });

  return [latitude, longitude];
}

function getCurrentWeather(data) {
  var currentUnixString = data.current.dt.toString();
  var iconCode = data.current.weather[0].icon;
  var iconSrc = "https://openweathermap.org/img/w/" + iconCode + ".png";
  var currentTemp = "Temperature: " + data.current.temp + "°F";
  var currentWind = "Wind Speed: " + data.current.wind_speed + " MPH";
  var currentHumid = "Humidity: " + data.current.humidity + "%";
  var currentUV = data.current.uvi;
  var currentDate = document.querySelector(".current-date");
  var date = moment.unix(currentUnixString).format("l");
  var weatherIconCurrent = document.querySelector(".weather-icon");
  weatherIconCurrent.setAttribute("src", iconSrc);

  // UV Conditional
  if (currentUV >= 0 && currentUV <= 2) {
    currentUVEl.classList.add("uv-background", "uv-background-low");
  } else if (currentUV > 2 && currentUV < 6) {
    currentUVEl.classList.add("uv-background", "uv-background-moderate");
  } else if (currentUV >= 6 && currentUV < 8) {
    currentUVEl.classList.add("uv-background", "uv-background-high");
  } else if (currentUV >= 8 && currentUV < 11) {
    currentUVEl.classList.add("uv-background", "uv-background-very-high");
  } else {
    currentUVEl.classList.add("uv-background", "uv-background-extreme");
  }
  currentDate.append(date);
  currentTempEl.append(currentTemp);
  currentWindEl.append(currentWind);
  currentHumidEl.append(currentHumid);
  currentUVEl.append(currentUV);
}

// get data for daily weather + append
function createDailyCards(data) {
  for (let i = 0; i < 5; i++) {
    // add row, column, container
    var row = document.querySelector("#row");
    var column = document.createElement("div");
    column.classList.add("col");
    var cardContainer = document.createElement("div");
    cardContainer.classList.add("card", "card-body", "bg-dark", "text-light");
    // add daily dates
    var cardTitle = document.createElement("h5");
    cardTitle.classList.add("card-title");
    dailyUnixString = data.daily[i].dt.toString();
    cardTitle.innerText = moment.unix(dailyUnixString).format("l");
    // add daily icons
    var dailyIcon = document.createElement("img");
    dailyIcon.classList.add("daily-icon", "w-50");
    // var dailyIcon = document.querySelector(".daily-icon")
    iconSrcDaily = data.daily[i].weather[0].icon;
    var dailyIconLink =
      "https://openweathermap.org/img/w/" + iconSrcDaily + ".png";
    dailyIcon.setAttribute("src", dailyIconLink);
    // add daily weather (temp, wind, humidity)
    var cardList = document.createElement("ul");
    cardList.classList.add("card-list", "list-unstyled");
    // add daily temp
    var cardListTemp = document.createElement("li");
    cardListTemp = "Temp: " + data.daily[i].temp.day + "°F";
    // add daily wind
    var cardListWind = document.createElement("li");
    cardListWind.innerText = "Wind: " + data.daily[i].wind_speed + " MPH";
    // add daily humidity
    var cardListHumid = document.createElement("li");
    cardListHumid = "Humidity: " + data.daily[i].humidity + "%";
    // append all
    row.append(column);
    column.append(cardContainer);
    cardContainer.append(cardTitle, dailyIcon, cardList);
    cardList.append(cardListTemp, cardListWind, cardListHumid);
  }
}

function saveSearchedCities() {
  var searchedCity = document.querySelector(".searched-cities").children;
  var savedSearchedCitiesTexts = [];
  savedSearchedCitiesTexts.concat(
    JSON.parse(localStorage.getItem("searchedCities"))
  );
  for (let i = 0; i < searchedCity.length; i++) {
    savedSearchedCitiesTexts.push(searchedCity[i].innerText);
  }
  localStorage.setItem(
    "searchedCities",
    JSON.stringify(savedSearchedCitiesTexts)
  );
}

citySubmitForm.addEventListener("submit", searchCity);

// Left to do:

// in script:
// needs to incorporate local storage
// needs to be able to re-search on button click of history

// add event listener for searchedEl
// on click of searchedEl run function to search innerhtml of searchedEl
// var searchedCity = document.querySelector("searched-city")
// searchedEl.addEventListener("click", searchCity);
