const WEATER_API_KEY = "366e7a28647c4da4803184927231209";
const BASE_URL = "http://api.weatherapi.com/v1";
const FORECAST_ENDPOINT = "/forecast.json";
const FORECAST_KEYWORDS = "&days=7&aqi=yes&lang=pl&alerts=yes";
const DAYS_TO_FETCH = 7;
const HOURS_TO_DISPLAY = 13;

const MAIN_CURRENT_WEATHER = document.querySelector("#MAIN_CURRENT_WEATHER");
const HEADER_CITY = document.querySelector('#HEADER_CITY');
const HEADER_TEMP = document.querySelector('#HEADER_TEMP');
const HEADER_WEATHER = document.querySelector('#HEADER_WEATHER');
const HEADER_HL = document.querySelector('#HEADER_HL');
const AIR_VALUE = document.querySelector("#AIR_VALUE");
const AIR_DESC = document.querySelector("#AIR_DESC");
const AIR_DOT = document.querySelector('#AIR_DOT');




const setCurrentTemp = (weather) => {
    const {current: {condition: {text},temp_c},location: {name},forecast:{forecastday:[today]}} = weather;
    const {day: {maxtemp_c,mintemp_c}} = today;
    HEADER_CITY.textContent = `${name}`;
    HEADER_TEMP.textContent = `${temp_c}`;
    HEADER_WEATHER.textContent = `${text}`;
    HEADER_HL.textContent = `H:${maxtemp_c}° L:${mintemp_c}°`

}


const createCurrentWeather = (temp, time, type, icon) => {
    const div = document.createElement('div');
    const h2_hour = document.createElement('h2');
    const h2_temp = document.createElement('h2');
    const span = document.createElement('span');
    const img = document.createElement('img');
    div.className = "current_weather_block";
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

const fetchWeatherData = async (city,type,keywords) => {
    try {
        const response = await fetch(`${BASE_URL}${type}?key=${WEATER_API_KEY}&q=${city}${keywords}`);
        if (!response.ok) {
            throw new Error(`${response.status}`);
        }
        return await response.json();
    } catch (err) {
        console.log(err);
        return null;
    }
}

const createForecastWeather = async (weather) => {
    const hour = new Date().getHours();
    let nextDay = 0;
    let isFirst = true;
    const { forecast: { forecastday } } = weather;
    const promises = [];

    for (let i = hour; i != (hour + HOURS_TO_DISPLAY) % 24; i++) {
        if (i == 24) {
            nextDay = 1;
            i = 0;
        }

        const { temp_c, condition: { icon } } = forecastday[nextDay].hour[i];
        const time = isFirst ? "Now" : `${i}`;
        const type = isFirst ? "" : ":00";
        promises.push(createCurrentWeather(temp_c, time, type, icon));
        if(isFirst) isFirst = !isFirst;
    }

    const weatherDivs = await Promise.all(promises);
    weatherDivs.forEach((div) => {
        MAIN_CURRENT_WEATHER.appendChild(div);
    })

}

const createAirQuality = (weather,history) => {
    const {current : {air_quality: {co,o3}}} = weather;
    const grade = co < 350 ? "Bardzo dobra":
                 co < 700 ? "Dobra": 
                 co < 1000 ? "Zła": 
                 co < 1400 ? "Bardzo zła": "Niebezpieczna";
    AIR_VALUE.innerText = `${co} - ${grade}`;
    AIR_DESC.innerText = `Ilość o3 w powietrzu wynosi ${o3}.`;
    document.documentElement.style.setProperty('--airqualityDot',`${co/20}%`);
}

const mainApp = async(city) => {
    const weather = await fetchWeatherData(city,FORECAST_ENDPOINT,FORECAST_KEYWORDS);
    console.log(weather);
    setCurrentTemp(weather);
    createForecastWeather(weather);
    createAirQuality(weather);
}

mainApp('walbrzych');
