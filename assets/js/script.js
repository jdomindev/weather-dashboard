var citySubmitButton = document.querySelector("#city-submit-button");
var citySubmitForm = document.querySelector("#city-submit-form");
var citySearch = document.querySelector("#city-search");

function searchCity(event) {
  event.preventDefault();
  if (citySubmitForm === null) {
    console.log("NULL");
  } else {
    var currentCitySearch = citySearch.value;
    var city = currentCitySearch.toLowerCase();
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
        for (var i = 0; i < data.length; i++) {
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
        console.log(data);
        for (var i = 0; i < data.length; i++) {
          console.log(data.current.temp);
        }
      });
  }
}

citySubmitForm.addEventListener("submit", searchCity);
