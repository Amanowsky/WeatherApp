const axios = require("axios").default;



const WEATHER_API_KEY = "366e7a28647c4da4803184927231209";
const BASE_URL = "https://api.weatherapi.com/v1";
const FORECAST_ENDPOINT = "/forecast.json";
const FORECAST_KEYWORDS = "&days=7&aqi=yes&lang=en&alerts=yes";


//CurrentWeather
const CURRENTWEATHER_CITY = document.querySelector('#currentWeather-city');
const CURRENTWEATHER_TEMP = document.querySelector('#currentWeather-temp');
const CURRENTWEATHER_WEATHER = document.querySelector('#currentWeather-weather');
const CURRENTWEATHER_HL = document.querySelector('#currentWeather-hl');


//TodayWeather
const HOURS_TO_DISPLAY = 13;
const TODAYWEATHER_WEATHERBOXES = document.querySelector("#todayWeather-weatherBoxes");
const TODAYWEATHER_ALERT = document.querySelector('#todayWeather-alert');


//ForecastWeather
const DAYS_TO_DISPLAY = 3;
const FORECAST_CONTAINER = document.querySelector("#forecast-container");



//AirQuality
const AIRQUALITY_VALUE = document.querySelector("#airquality-value");
const AIRQUALITY_DESC = document.querySelector("#airquality-desc");

//Moon
const MOON = document.querySelector("#moon");




const fetchWeatherData = async (city, type, keywords) => {
    try {
        const response = await axios.get(`${BASE_URL}${type}?key=${WEATHER_API_KEY}&q=${city}${keywords}`);
        return response.data;
    } catch (err) {
        console.log(err);
        return null;
    }
}



const setCurrentWeather = (weather) => {
    const { current: { condition: { text }, temp_c }, location: { name }, forecast: { forecastday: [today] } } = weather;
    const { day: { maxtemp_c, mintemp_c } } = today;
    CURRENTWEATHER_CITY.textContent = `${name}`;
    CURRENTWEATHER_TEMP.textContent = `${temp_c}`;
    CURRENTWEATHER_WEATHER.textContent = `${text}`;
    CURRENTWEATHER_HL.textContent = `H:${maxtemp_c} L:${mintemp_c}`
}


const createTodayWeather = (weather) => {
    const template = document.getElementById("weatherBoxes-box");
    const createHourBox = (temp, time, type, icon) => {
        const copy = document.importNode(template.content, true)
        const h2Elements = copy.querySelectorAll('h2');

        h2Elements[0].querySelector('span').textContent = `${type}`;
        h2Elements[0].textContent = `${time}` + h2Elements[0].textContent;
        copy.querySelector('img').src = `${icon}`;
        copy.querySelectorAll('h2')[1].innerText = `${temp}`;

        return copy;
    }
    const { alerts: { alert } } = weather
    TODAYWEATHER_ALERT.textContent = alert.length === 0 ? "No active RCB alerts" : alert[0];
    const hour = new Date().getHours();
    let nextDay = 0;
    let isFirst = true;
    const { forecast: { forecastday } } = weather;

 
    let i = hour;
    do {
        const { temp_c, condition: { icon } } = forecastday[nextDay].hour[i];
        const time = isFirst ? "Now" : `${i}`;
        const type = isFirst ? "" : ":00";
        const box = createHourBox(temp_c, time, type, icon);
        TODAYWEATHER_WEATHERBOXES.append(box);
        

        
        
        isFirst = false;


        i++;
        if (i == 24) {
            nextDay = 1;
            i = 0;
        }
    } while (i != (hour + HOURS_TO_DISPLAY) % 24)

   

}


const createForecastWeather = (weather) => {
    const template = document.querySelector("#forecast-container-box");
    const createDayBox = (day,temp_lowest,temp_highest,icon) => {
        const copy = document.importNode(template.content, true);
        const h3Elements = copy.querySelectorAll("h3");
        const width = (temp_highest - temp_lowest) * 2;
        const left = (50+temp_lowest);
       
        copy.querySelector("img").src = `${icon}`;
        copy.querySelector(".forecast__ratio__range").style = `width: ${width}px; left: ${left}%;`

        h3Elements[0].textContent = `${temp_lowest}`;
        h3Elements[1].textContent = `${temp_highest}`;

        copy.querySelector("h2").textContent = `${day}`;

        
        
        
        return copy;
    }
    const daysArray = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    const date = new Date();
    let isToday = true;
    for(let i=0;i<DAYS_TO_DISPLAY;i++){
        const {forecast:{forecastday}} = weather;
        const {day: {maxtemp_c,mintemp_c, condition: {icon}}} = forecastday[i];
        const today = isToday ? "Today" : daysArray[(date.getDay()+i)%7];
        isToday = false;
        const box = createDayBox(today,Math.round(mintemp_c),Math.round(maxtemp_c),icon)
        FORECAST_CONTAINER.append(box);
        
    }
    
}




const createAirQuality = (weather) => {
    const { current: { air_quality: { co, o3 } } } = weather;
    const grade = co < 350 ? "Very good" :
        co < 700 ? "Good" :
            co < 1000 ? "Bad" :
                co < 1400 ? "Very bad" : "Dangerous";
    AIRQUALITY_VALUE.innerText = `${co} - ${grade}`;
    AIRQUALITY_DESC.innerHTML = `The amount of O<sub>3</sub> in the air is ${o3}.`;
    document.documentElement.style.setProperty('--airqualityDot', `${co / 20}%`);
}




    


const mainApp = async (city) => {
    let weather;
    try {
    weather = await fetchWeatherData(city, FORECAST_ENDPOINT, FORECAST_KEYWORDS);
    }catch (err) {
        console.log(err);
        return
    }
    console.log(weather);
    setCurrentWeather(weather);
    createTodayWeather(weather);
    createForecastWeather(weather);
    createAirQuality(weather);
}

mainApp('walbrzych');
