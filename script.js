// My API Key:  610436e018c9609da870c73640ddef6a
// API Call:  http://api.openweathermap.org/data/2.5/forecast?id=524901&appid={API key}
// Sample API Call:  api.openweathermap.org/data/2.5/forecast?id=524901&appid={API key}
//api.openweathermap.org/data/2.5/forecast?id=524901&appid=610436e018c9609da870c73640ddef6a

var APIKey = "610436e018c9609da870c73640ddef6a";
var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=london&appid=610436e018c9609da870c73640ddef6a";
var city = "London";
var weatherData = [];
fetch(queryURL)
  // fetch() returns a promise. When we have received a response from the server,
  // the promise's `then()` handler is called with the response.
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log(data);
    let weatherData = data;
    console.log(weatherData.main.temp)
  });



  /*
  <coord lon="10.99" lat="44.34"/>
  <weather number="501" value="moderate rain" icon="10d"/>
  <country>IT</country>
  <timezone>7200</timezone>
  <sun rise="2022-08-30T04:36:27" set="2022-08-30T17:57:28"/>
  </city>
  <temperature value="298.48" min="297.56" max="300.05" unit="kelvin"/>
  <feels_like value="298.74" unit="kelvin"/>
  <humidity value="64" unit="%"/>
  <pressure value="1015" unit="hPa"/>
  <wind>
  <speed value="0.62" unit="m/s" name="Calm"/>
  <gusts value="1.18"/>
  <direction value="349" code="N" name="North"/>
  </wind>
  <clouds value="100" name="overcast clouds"/>
  <visibility value="10000"/>
  <precipitation value="3.37" mode="rain" unit="1h"/>
  <weather number="501" value="moderate rain" icon="10d"/>
  <lastupdate value="2022-08-30T14:45:57"/>
  </current>
  */