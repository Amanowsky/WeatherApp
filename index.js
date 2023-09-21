const WEATHER_API_KEY = "366e7a28647c4da4803184927231209";
const BASE_URL = "http://api.weatherapi.com/v1";
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
const WEATHERBOXES_BOXCLASS = "weatherBoxes__box";
const TODAYWEATHER_ALERT = document.querySelector('#todayWeather-alert');

//ForecastWeather
const DAYS_TO_DISPLAY = 4;
const FORECAST_CONTAINER = document.querySelector("#forecast-container");


//AirQuality
const AIRQUALITY_VALUE = document.querySelector("#airquality-value");
const AIRQUALITY_DESC = document.querySelector("#airquality-desc");






const setCurrentWeather = (weather) => {
    const { current: { condition: { text }, temp_c }, location: { name }, forecast: { forecastday: [today] } } = weather;
    const { day: { maxtemp_c, mintemp_c } } = today;
    CURRENTWEATHER_CITY.textContent = `${name}`;
    CURRENTWEATHER_TEMP.textContent = `${temp_c}`;
    CURRENTWEATHER_WEATHER.textContent = `${text}`;
    CURRENTWEATHER_HL.textContent = `H:${maxtemp_c} L:${mintemp_c}`

}


const createForecastWeather = (weather) => {
    const createDayBox = (day,temp_lowest,temp_highest,icon) => {
        const forecast_container_box = document.createElement('div');
        const img = document.createElement('img');
        const forecast_temp_div = document.createElement('div');
        const temp_lowest_h3 = document.createElement('h3');
        const temp_highest_h3 = document.createElement('h3');
        const forecast_ratio_div = document.createElement('div');
        const forecast_ratio_range_div = document.createElement('div');
        const day_h2 = document.createElement('h2');

        forecast_container_box.className = "forecast__container__box";
        forecast_temp_div.className = "forecast__temp";
        forecast_ratio_div.className = "forecast__ratio";
        forecast_ratio_range_div.className = "forecast__ratio__range";
        img.src = `${icon}`;
        temp_lowest_h3.textContent = `${temp_lowest}°`;
        temp_highest_h3.textContent = `${temp_highest}°`;
        day_h2.textContent = `${day}`;

        forecast_ratio_range_div.style.width = `${(temp_highest - temp_lowest) * 2}px`;
        forecast_ratio_range_div.style.left = `${50+temp_lowest}%`
        forecast_ratio_div.append(forecast_ratio_range_div);
        forecast_temp_div.append(temp_lowest_h3, forecast_ratio_div,temp_highest_h3);
        forecast_container_box.append(img,forecast_temp_div,day_h2);
        return forecast_container_box;
    }

    for(let i=0;i<DAYS_TO_DISPLAY;i++){
        const {forecast:{forecastday}} = weather;
        const {day: {maxtemp_c,mintemp_c, condition: {icon}}} = forecastday[i];

        FORECAST_CONTAINER.append(createDayBox("Today",Math.round(mintemp_c),Math.round(maxtemp_c),icon));
    }
    
}


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

const createTodayWeather = async (weather) => {
    const createHourBox = (temp, time, type, icon) => {
        const div = document.createElement('div');
        const h2_hour = document.createElement('h2');
        const h2_temp = document.createElement('h2');
        const span = document.createElement('span');
        const img = document.createElement('img');
        div.className = `${WEATHERBOXES_BOXCLASS}`;
        h2_hour.innerText = `${time}`;
        span.innerText = `${type}`;
        img.src = `${icon}`
        h2_hour.appendChild(span);
        div.appendChild(h2_hour);
        div.appendChild(img);
        h2_temp.innerText = `${temp}°`;
        div.appendChild(h2_temp);
        return div;
    }
    const { alerts: { alert } } = weather
    TODAYWEATHER_ALERT.textContent = alert.length === 0 ? "No active RCB alerts" : alert[0];
    const hour = new Date().getHours();
    let nextDay = 0;
    let isFirst = true;
    const { forecast: { forecastday } } = weather;
    const promises = [];


    let i = hour;
    do {
        const { temp_c, condition: { icon } } = forecastday[nextDay].hour[i];
        const time = isFirst ? "Now" : `${i}`;
        const type = isFirst ? "" : ":00";
        promises.push(createHourBox(temp_c, time, type, icon));
        if (isFirst) isFirst = !isFirst;


        i++;
        if (i == 24) {
            nextDay = 1;
            i = 0;
        }
    } while (i != (hour + HOURS_TO_DISPLAY) % 24)


    const weatherDivs = await Promise.all(promises);
    weatherDivs.forEach((div) => {
        TODAYWEATHER_WEATHERBOXES.appendChild(div);
    })

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
