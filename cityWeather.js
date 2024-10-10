let searchInput = document.getElementById("searchInput");
let alertButtom = document.getElementById("buttonShow");
//const stadt = searchInput.value.trim(); // nicht ausserhalb definiern , sonst ist es leer , error


const getData = (city) => {
  const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&include=days%2Ccurrent&key=W4AT46X6MVD6S5L4DE7GADYGL&contentType=json`;
  fetchAPI(url)
    .then(data =>{
      searchData(data)
  })
}


function fetchAPI(urlString){
    return fetch(urlString).then(response => {
      if(response.ok){
        return response.json();
      }else{
        alert("City not Found")
      }
    })
  
}
function splitAddress(addr) {
  const parts = addr.split(",");
  if (parts.length >= 1) {
      return parts[0].trim(); // Get the first part and remove leading/trailing spaces
  } else {
      return ""; 
  }
}

function normalizeString(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Normalisiert Unicode und entfernt diakritische Zeichen (z. B. Akzente)
}

function searchData(data) {
  let weatherDataFound = false;

  const currentDateObject = new Date();
  const dateString = currentDateObject.toJSON().slice(0, 10); // string zum vergleich

  const dataCity = normalizeString(splitAddress(data.resolvedAddress.toLowerCase()));
  const searchCity = normalizeString(data.address.toLowerCase());
  
  console.log("Normalized dataCity:", dataCity, "Normalized searchCity:", searchCity); // Debugging

  let invalidSearch = false;
  data.days.forEach(day => {
    
    const dayDateString = new Date(day.datetime).toJSON().slice(0, 10);
    if(dataCity === searchCity){
      if (dayDateString.slice(0, 10) === dateString) {
        showData(day);
        weatherDataFound = true;
      } 
    }
  });
  
  
  
  if (!weatherDataFound) {
    alert("Weather data not found or mismatch in city names");
  }


  
  if(weatherDataFound){

    const nextDayArray = [];
    
    for (let i = 1; i <= 3; i++) {
      const currentDate = new Date();
      currentDate.setDate(currentDate.getDate() + i);
      const dateChanged = currentDate.toJSON().slice(0, 10);
      
      const nextDayWeather = data.days.find(day => day.datetime === dateChanged);
      
      if (nextDayWeather) {
          const weatherInfo = dateChanged + "<br>" + "L:" + nextDayWeather.tempmin + "°" + "- H:" + nextDayWeather.tempmax + "°";
          nextDayArray.push(weatherInfo);
        }
      }
      
      const tomorrow = document.getElementById("tomorrow");
      const tomorrowPlusOne = document.getElementById("todayPlusTwo");
      const tomorrowPlusTwo = document.getElementById("todayPlusThree");
      

  if(nextDayArray[0]){
    tomorrow.innerHTML = nextDayArray[0]|| "No data available";
  }
  if(nextDayArray[1]){
    tomorrowPlusOne.innerHTML = nextDayArray[1] || "No data available";
  }
  if(nextDayArray[2]){
    tomorrowPlusTwo.innerHTML = nextDayArray[2] || "No data available";
  }
}

}





function showData(weatherData){
  const dataSearchedElement = document.getElementById("dataSearched");
  const condi = document.getElementById("con");

  const weatherDataSet = new Set();
  weatherDataSet.add("<span class = 'temp'>" + weatherData.temp +" °C" + "</span>");
  weatherDataSet.add("<span class = 'condition'>"  + weatherData.conditions + "</span>");
  weatherDataSet.add("<span class='minMax'>L:" + weatherData.tempmin+"°" + "   " + "H:" + weatherData.tempmax +"°" +"</span>"); //to style directly
  dataSearchedElement.innerHTML = Array.from(weatherDataSet).join("<br>");
}






alertButtom.addEventListener("click", () => {

  const city = searchInput.value;
  getData(city);
});