
const WEATER_API_KEY = "366e7a28647c4da4803184927231209";
const BASE_URL = "http://api.weatherapi.com/v1";
const FORECAST = "/forecast.json";
const MAIN_CURRENT_WEATHER= document.querySelector("#MAIN_CURRENT_WEATHER");

const createCurrentWeather = (temp,time,type,icon) => {
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
    MAIN_CURRENT_WEATHER.appendChild(div);
}



const weaterApi = async (city) => {
    try {
        const response = await fetch(`${BASE_URL}${FORECAST}?key=${WEATER_API_KEY}&q=${city}&days=7&aqi=yes&lang=pl&alerts=yes`);
        if (!response.ok) {
            throw new Error(`${response.status}`);
        }
        const weater = await response.json();
        console.log(weater);
        const iconPng = "https://i.ibb.co/wgDMm61/113.png";
        const {current: {temp_c,condition: {icon}}} = weater;


        
        await createCurrentWeather(26,"Now","",iconPng);

        
    } catch (err) {
        console.log(err);
    }
}




weaterApi("walbrzych");



