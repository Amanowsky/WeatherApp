const WEATER_API_KEY = "366e7a28647c4da4803184927231209";
const BASE_URL = "http://api.weatherapi.com/v1";
const FORECAST = "/forecast.json";

const weater_api = async (city) => {
    try {
        const response = await fetch(`${BASE_URL}${FORECAST}?key=${WEATER_API_KEY}&q=${city}&days=7&aqi=yes&lang=pl&alerts=yes`);
        if (!response.ok) {
            throw new Error(`${response.status}`);
        }
        const weater = await response.json();
        const {current:{temp_c:current_temp_c},current:{temp_f:current_temp_f}} = weater;
        console.log(weater);
    } catch (err) {
        console.log(err);
    }
}


weater_api("walbrzych");



