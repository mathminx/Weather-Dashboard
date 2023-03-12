// 

//$(function() {

const myAPI = "610436e018c9609da870c73640ddef6a";

let currentURL = "https://api.openweathermap.org/data/2.5/weather?lat=45.278752&lon=-66.058044&units=metric&appid=610436e018c9609da870c73640ddef6a"
let fiveDayURL = "https://api.openweathermap.org/data/2.5/forecast?lat=45.278752&lon=-66.058044&appid=610436e018c9609da870c73640ddef6a&units=metric";
let geocodeURL = "https://api.openweathermap.org/geo/1.0/direct?q=saint john, ca&appid=610436e018c9609da870c73640ddef6a"
let iconURL = "https://openweathermap.org/img/wn/04d@2x.png"
var stateCode;
var countryCode;
var cityLat;
var cityLon;

let searchButton = document.getElementById("search-button");
searchButton.addEventListener("click", function (event) {
  event.preventDefault();
  let searchCity = document.getElementById("search-city").value
  getWeather(searchCity);
  let saveMe = {
    "city": searchCity,
    "timestamp": dayjs().unix()
  }
  let cityArray = [];
  let myCities = JSON.parse(localStorage.getItem("savedCities"));
  if (myCities !== null) {
    cityArray = myCities;
  }
  cityArray.push(saveMe);
  cityArray.sort((a, b) => b.timestamp - a.timestamp);
  for (let i = 0; i < cityArray.length; i++) {
    let cityList = document.getElementById("city-list");
    let cityListItem = document.createElement("li");
    cityListItem.textContent = (cityArray[i].city);
    cityList.appendChild(cityListItem);
  }
  console.log(cityArray);
});

// Retrieve and display locations saved in localStorage 
function getSavedCities() {
  
  //for (let i = 0; i < myCities.length; i++) {
  //  document.getElementById("city-list").innerHTML = myCities[i];
  //}
  return cityArray;
}

function getWeather(searchCity) {
  let geocodeURL = "https://api.openweathermap.org/geo/1.0/direct?q=" + searchCity + "&appid=610436e018c9609da870c73640ddef6a"
  fetch(geocodeURL)
    // fetch() returns a promise. When we have received a response from the server,
    // the promise's `then()` handler is called with the response.
    .then(function (response) {
      return response.json();
    })
    .then(function (geoData) {
      let cityInfo = geoData[0];
      let cityDetails = (Object.values(cityInfo));
      let cityName = cityDetails[0];
      let country = cityDetails[4];
      if (cityDetails[5] !== "") {
        let state = cityDetails[5];
        var fullName = cityName + ", " + state + " " + country;
      }
      else {
        var fullName = cityName + ", " + country;
      }
      let mainCardTitle = document.querySelector("h2");
      mainCardTitle.innerHTML = fullName;
    });
    
  //Current Weather
  fetch(currentURL)
  // fetch() returns a promise. When we have received a response from the server,
  // the promise's `then()` handler is called with the response.
    .then(function (response) {
      return response.json();
    })
    .then(function (weatherData) {
      let weatherDate = dayjs(weatherData.weather.dt).format("dddd" + "<br>" + "MMMM D, YYYY");
      document.getElementById("current-date").innerHTML = weatherDate;
      let weatherTime = dayjs(weatherData.weather.dt).format("HH:mm");
      let iconCode = weatherData.weather[0].icon;
      document.getElementById("current-icon").src = "https://openweathermap.org/img/wn/" + iconCode + "@2x.png";
      let description = weatherData.weather[0].description;
      let capitalised = description.charAt(0).toUpperCase()+description.slice(1);
      document.getElementById("current-desc").innerHTML = capitalised;
      let currentTemp = weatherData.main.temp;
      document.getElementById("current-temp").innerHTML = parseInt(currentTemp) + "C";
      let feelsLike = weatherData.main.feels_like;
      document.getElementById("current-feels-like").innerHTML = "feels like " + parseInt(feelsLike) + "C";
      let humidity = weatherData.main.humidity;
      document.getElementById("current-humidity").innerHTML = parseInt(humidity) + "%";
      let windSpeed = weatherData.wind.speed;
      document.getElementById("current-wind").innerHTML = parseInt(windSpeed) + " km/h";
    });

  //Five-Day Forecast
  fetch(fiveDayURL)
  // fetch() returns a promise. When we have received a response from the server,
  // the promise's `then()` handler is called with the response.
    .then(function (response) {
      return response.json();
    })
    .then(function (weatherData) {
      let weatherDataList = weatherData.list;
      let currentTime = weatherDataList[0].dt;
      let nextDay = dayjs(dayjs.unix(currentTime).startOf("day").add(32, "hour").unix());
      let dayNum = 1;
      for (let day = nextDay; day < nextDay+345601; day+=86400) {
        for (let i=0; i<weatherDataList.length; i++) {
          if (weatherDataList[i].dt == day) {
            let getId = "day-" + dayNum;
            document.getElementById(getId).innerHTML = dayjs.unix(weatherDataList[i].dt).format("dddd" + "<br>" + "MMMM D");
            let getIcon = getId + "-icon";
            let iconCode = weatherDataList[i].weather[0].icon;
            document.getElementById(getIcon).src = "https://openweathermap.org/img/wn/" + iconCode + "@2x.png";
            let getDescription = getId + "-desc";
            let description = weatherDataList[i].weather[0].description;
            description = description.charAt(0).toUpperCase()+description.slice(1);
            document.getElementById(getDescription).innerHTML = description;
            let getTemp = getId + "-temp";
            let temp = weatherDataList[i].main.temp;
            document.getElementById(getTemp).innerHTML = parseInt(temp) + "C";
            let getFeel = getId + "-feels-like";
            let feelsLike = weatherDataList[i].main.feels_like;
            document.getElementById(getFeel).innerHTML = "feels like " + parseInt(feelsLike) + "C";
            let getHumidity = getId + "-humidity";
            let humidity = weatherDataList[i].main.humidity;
            document.getElementById(getHumidity).innerHTML = parseInt(humidity) + "%";
            let getWind = getId + "-wind"
            let windSpeed = weatherDataList[i].wind.speed;
            document.getElementById(getWind).innerHTML = parseInt(windSpeed) + " km/h";
          }
        }
      dayNum = dayNum + 1;
      }
    });
  }     

/*
//Add current city to past searhced cities and store in local storage
searchedCities.push(currentCity);
localStorage.setItem("savedCities", JSON.stringify(searchedCities));
*/