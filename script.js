// 
const myAPI = "610436e018c9609da870c73640ddef6a";

//  Load the page
document.querySelectorAll("li").innerHTML = "";
document.querySelectorAll("h4").innerHTML = "";
document.querySelectorAll("h4 > p").innerHTML = "???";
document.querySelectorAll("h4 > img").innerHTML = "";
// Get the array of previously searched cities from 
// local storage and add the input city 
let cityArray = [];
let myCities = JSON.parse(localStorage.getItem("savedCities"));
if (myCities !== null) {
  cityArray = myCities;
}
// Display the array of cities sorted by  
// UNIX timestamp descending. Cities will be listed
// starting with the most recently searched
cityArray.sort((a, b) => b.timestamp - a.timestamp);
for (let i = 0; i < cityArray.length; i++) {
  let cityList = document.getElementById("city-list");
  let cityListItem = document.createElement("li");
  cityListItem.textContent = (cityArray[i].city);
  cityList.appendChild(cityListItem);
}
//Add event listener to the search button
let searchButton = document.getElementById("search-button");
searchButton.addEventListener("click", function (event) {
  event.preventDefault();
  //Get the input city
  let searchCity = document.getElementById("search-city").value;
  getWeather(searchCity);
  //Create an object containing the input city and the UNIX timestamp
  let saveMe = {
    "city": searchCity,
    "timestamp": dayjs().unix()
  }
/*
  // Get the array of previously searched cities from 
  // local storage and add the input city 
  let cityArray = [];
  let myCities = JSON.parse(localStorage.getItem("savedCities"));
  if (myCities !== null) {
    cityArray = myCities;
  }
*/
  cityArray.push(saveMe);
  // Display the array of cities sorted by  
  // UNIX timestampfrom most to least recent
  cityArray.sort((a, b) => b.timestamp - a.timestamp);
  for (let i = 0; i < cityArray.length; i++) {
    let cityList = document.getElementById("city-list");
    let cityListItem = document.createElement("li");
    cityListItem.textContent = (cityArray[i].city);
    cityList.appendChild(cityListItem);
  }
  // Save the updated array to local storage
  localStorage.setItem("savedCities", JSON.stringify(cityArray));
});

/*
//Get the latitude and logitude of the searched city
function getWeather(searchCity) {
  console.log(searchCity);
  let geocodeURL = "https://api.openweathermap.org/geo/1.0/direct?q=" + searchCity + "&appid=" + myAPI;
  fetch(geocodeURL)
  // fetch() returns a promise. When we have received a response from the server,
  // the promise's `then()` handler is called with the response.
  .then(function (response) {
    return response.json();
  })
  .then(function (geoData) {
    let cityInfo = geoData[0];
    let cityDetails = (Object.values(cityInfo));
    console.log(cityDetails);
    let latitude = cityDetails[2];
    let longitude = cityDetails[3];
    let currentURL = "https://api.openweathermap.org/data/2.5/weather?lat=" + latitude + "&lon=" + longitude + "&units=metric&appid=610436e018c9609da870c73640ddef6a"
    getCurrentWeather(currentURL);
    let fiveDayURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + latitude + "&lon=" + longitude + "&appid=610436e018c9609da870c73640ddef6a&units=metric";
    getForecast(fiveDayURL);
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
}

  // Get the current weather
function getCurrentWeather (currentURL) {
  fetch(currentURL)
  // fetch() returns a promise. When we have received a response from the server,
  // the promise's `then()` handler is called with the response.
  .then(function (response) {
    return response.json();
  })
  .then(function (weatherData) {
    console.log(weatherData);
    let weatherDate = dayjs(weatherData.weather.dt).format("dddd" + "<br>" + "MMMM D, YYYY");
    document.getElementById("current-date").innerHTML = weatherDate;
    let weatherTime = dayjs(weatherData.weather.dt).format("HH:mm");
    console.log(dayjs(weatherDate).unix());
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
}

//get the five-Day forecast
function getForecast(fiveDayURL) {
  fetch(fiveDayURL)
  // fetch() returns a promise. When we have received a response from the server,
  // the promise's `then()` handler is called with the response.
  .then(function (response) {
    return response.json();
  })
  .then(function (weatherData) {
    let timezone = weatherData.city.timezone;
    console.log("Offset to UTC: ",timezone);
    let weatherDataList = weatherData.list;
    console.log(weatherDataList);
    let currentTime = weatherDataList[0].dt;
    console.log("Current time UTC: ", currentTime);
    let nextDay = dayjs(dayjs.unix(currentTime).startOf("day").add(36, "hour").add(timezone, "second"));
    console.log("Noon local: ", nextDay.unix());
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
*/