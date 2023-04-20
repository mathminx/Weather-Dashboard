// 
const myAPI = "610436e018c9609da870c73640ddef6a";
var timezone;

// Get the array of previously searched cities from 
// local storage and add the input city 
let cityArray = [];
let myCities = JSON.parse(localStorage.getItem("savedCities"));
if (myCities !== null) {
  cityArray = myCities;
}
// Display the array of cities
cityArray.forEach(city => {
  let cityList = document.getElementById("city-list");
  let cityListItem = document.createElement("li");
  cityListItem.textContent = (city.city);
  cityList.appendChild(cityListItem);
  cityListItem.onclick = function() {
    getWeather(cityListItem.textContent);
  }
});
//Add event listener to the search button
let searchButton = document.getElementById("search-button");
searchButton.addEventListener("click", function (event) {
  event.preventDefault();
  // Get the input city
  let searchCity = document.getElementById("search-city").value;
  // Capitalise the first letter of the city
  searchCity = searchCity.charAt(0).toUpperCase()+searchCity.slice(1);
  // Call the getWeather function
  getWeather(searchCity);
});
//Get the latitude and logitude of the searched city
function getWeather(searchCity) {
  console.log(searchCity);
  let geocodeURL = "https://api.openweathermap.org/geo/1.0/direct?q=" + searchCity + "&appid=" + myAPI;
  fetch(geocodeURL)
  .then(function (response) {
    return response.json();
  })
  .then(function (geoData) {
    console.log(geoData);
    if (geoData.length === 0) {
      alert("City not found - please try again");
      searchCity = "";
      return;
    }
    // Extract city, state, and country from response
    let cityDetails = geoData[0];
    console.log(cityDetails);
    let city = cityDetails.name
    let country = cityDetails.country;
    let state = cityDetails.state;
    if (!state) {
      state = "";
    }
    let fullName = city + ", " + state + " " + country;
    let latitude = cityDetails.lat;
    let longitude = cityDetails.lon;
    //Create an object containing the input city and the UNIX timestamp
    let saveMe = {
      "city": fullName,
      "timestamp": dayjs().unix()
    };
    // Check if the input city is in the array of previously searched cities
    const isDuplicate = (element) => element.city === fullName;
    const sameCity = cityArray.findIndex(isDuplicate);
    if (sameCity !== -1) {
      cityArray.splice(sameCity, 1);
    }
    cityArray.unshift(saveMe);// Clear the list of searched cities
    let cityList = document.getElementById("city-list");
    while(cityList.firstChild) cityList.removeChild(cityList.firstChild);
    // Display the updated array of cities
    cityArray.forEach(city => {
    let cityList = document.getElementById("city-list");
    let cityListItem = document.createElement("li");
    cityListItem.textContent = (city.city);
    cityList.appendChild(cityListItem);
    cityListItem.onclick = function() {
      getWeather(cityListItem.textContent);
    }
    });
    // Save the updated array to local storage
    localStorage.setItem("savedCities", JSON.stringify(cityArray));
    let currentURL = "https://api.openweathermap.org/data/2.5/weather?lat=" + latitude + "&lon=" + longitude + "&units=metric&appid=610436e018c9609da870c73640ddef6a"
    getCurrentWeather(currentURL, fullName);
    let fiveDayURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + latitude + "&lon=" + longitude + "&units=metric&appid=610436e018c9609da870c73640ddef6a&units=metric";
    getForecast(fiveDayURL);
  });
}
// Get the current weather
function getCurrentWeather (currentURL, fullName) {
  fetch(currentURL)
  .then(function (response) {
    return response.json();
  })
  .then(function (weatherData) {
    console.log("Current ", weatherData);
    let mainCardTitle = document.querySelector("h2");
    mainCardTitle.innerHTML = fullName;
    console.log(weatherData.dt);
    let weatherDate = dayjs(weatherData.weather.dt).format("dddd" + "<br>" + "MMMM D, YYYY");
    document.getElementById("current-date").innerHTML = weatherDate;
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
  .then(function (forecastData) {
    console.log(forecastData);
    timezone = forecastData.city.timezone;
    console.log(forecastData.list);
    let firstForecastTime = forecastData.list[0].dt_txt;
    console.log(firstForecastTime, typeof firstForecastTime);
    let utcForecastHour = Number(firstForecastTime.substring(11, 13))
    let localForecastHour = utcForecastHour - timezone/3600;
    if (localForecastHour > 24) {
      localForecastHour = localForecastHour-24
    }
    console.log(localForecastHour);
    let dayNum = 1;
    for (let i=0; i<forecastData.list.length; i++) {
      if (localForecastHour - Number(forecastData.list[i].dt_txt.substring(11, 13)) >= 0 && localForecastHour - Number(forecastData.list[i].dt_txt.substring(11, 13)) < 3)  {
        console.log(forecastData.list[i].dt_txt);
        let getId = "day-" + dayNum;
        let getDate = getId + "-date";
        document.getElementById(getDate).innerHTML = dayjs.unix(forecastData.list[i].dt).format("dddd" + "<br>" + "MMMM D");
        let getIcon = getId + "-icon";
        let iconCode = forecastData.list[i].weather[0].icon;
        document.getElementById(getIcon).src = "https://openweathermap.org/img/wn/" + iconCode + "@2x.png";
        let getDescription = getId + "-desc";
        let description = forecastData.list[i].weather[0].description;
        description = description.charAt(0).toUpperCase()+description.slice(1);
        document.getElementById(getDescription).innerHTML = description;
        let getTemp = getId + "-temp";
        let temp = forecastData.list[i].main.temp;
        document.getElementById(getTemp).innerHTML = parseInt(temp) + "C";
        let getFeel = getId + "-feels-like";
        let feelsLike = forecastData.list[i].main.feels_like;
        document.getElementById(getFeel).innerHTML = "feels like " + parseInt(feelsLike) + "C";
        let getHumidity = getId + "-humidity";
        let humidity = forecastData.list[i].main.humidity;
        document.getElementById(getHumidity).innerHTML = parseInt(humidity) + "%";
        let getWind = getId + "-wind"
        let windSpeed = forecastData.list[i].wind.speed;
        document.getElementById(getWind).innerHTML = parseInt(windSpeed) + " km/h";
        console.log("Done with day " + dayNum);
        dayNum = dayNum + 1;
      }
    }
  })
}  
