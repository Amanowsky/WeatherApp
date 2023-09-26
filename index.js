
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
const WEATHERBOXES_BOX_CLASS = "weatherBoxes__box";

//ForecastWeather
const DAYS_TO_DISPLAY = 3;
const FORECAST_CONTAINER = document.querySelector("#forecast-container");
const FORECAST_CONTAINER_BOX_CLASS = "forecast__container__box";


//AirQuality
const AIRQUALITY_VALUE = document.querySelector("#airquality-value");
const AIRQUALITY_DESC = document.querySelector("#airquality-desc");

//Moon
const MOON = document.querySelector("#moon");




const fetchWeatherData = async (city, type, keywords) => {
    try {
        const response = await fetch(`${BASE_URL}${type}?key=${WEATHER_API_KEY}&q=${city}${keywords}`);
        if (!response.ok) {
            throw new Error(`${response.status}`);
        }
        return await response.json();
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
    const createHourBox = (temp, time, type, icon) => {
        const weatherBoxes_box = document.createElement('div');
        weatherBoxes_box.className = `${WEATHERBOXES_BOX_CLASS}`;
        weatherBoxes_box.innerHTML = `
            <h2> ${time}<span>${type}</span> </h2>
            <img src="${icon}">
            <h2> ${temp} </h2>
        `
        return weatherBoxes_box;
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
    const createDayBox = (day,temp_lowest,temp_highest,icon) => {
        const forecast_container_box = document.createElement('div');
        forecast_container_box.className = `${FORECAST_CONTAINER_BOX_CLASS}`;
        const width = (temp_highest - temp_lowest) * 2;
        const left = (50+temp_lowest);
        forecast_container_box.innerHTML = `
            <img src="${icon}">
            <div class = "forecast__temp">
                <h3>${temp_lowest}°</h3>
                <div class="forecast__ratio">
                    <div class="forecast__ratio__range" style="width: ${width}px; left: ${left}%;"> </div>
                </div>
                <h3>${temp_highest}°</h3>
            </div>
            <h2>${day}</h2>`
        
        
        return forecast_container_box;
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
    const weather = await fetchWeatherData(city, FORECAST_ENDPOINT, FORECAST_KEYWORDS);
    console.log(weather);
    setCurrentWeather(weather);
    createTodayWeather(weather);
    createForecastWeather(weather);
    createAirQuality(weather);
}

mainApp('walbrzych');
