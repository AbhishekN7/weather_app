const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
const currentWeatherItems = document.getElementById('current-weather-items');
const timezone = document.getElementById('time-zone');
const countryEl = document.getElementById('country');
const weatherForecastEl = document.getElementById('weather-forecast');
const currentTempEl = document.getElementById('current-temp');

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

const API_KEY = '8dace469add8a262375a6af803f86bc9';


setInterval(() => {
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getHours();
    const hourIn12HrsFormat = hour >= 13 ? hour % 12 : hour;
    const minutes = (time.getMinutes() < 10 ? '0' : '') + time.getMinutes()
    const ampm = hour >= 12 ? 'PM' : 'AM';

    timeEl.innerHTML = hourIn12HrsFormat + ':' + minutes + ' ' + `<span id="am-pm">${ampm}</span>`;
    dateEl.innerHTML = days[day] + ', ' + date + ' ' + months[month];

}, 1000)

getWeatherData();

function getWeatherData() {
    navigator.geolocation.getCurrentPosition((success) => {
        let { latitude, longitude } = success.coords;
        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`).then(res => res.json()).then(data => {
            showWeatherData(data);
        })
    })
}

function showWeatherData(data) {
    let { humidity, sunrise, sunset, pressure, wind_speed } = data.current;
    countryEl.innerHTML = data.lat +'N ' + data.lon+'E';

    currentWeatherItems.innerHTML =
        ` <div class="weather-item">
        <div>Humidity</div>
        <div>${humidity}%</div>
    </div>
    <div class="weather-item">
        <div>Pressure</div>
        <div>${pressure}</div>
    </div>
    <div class="weather-item">
        <div>Wind-Speed&emsp;&emsp;</div>
        <div>${wind_speed}</div>
    </div>
    <div class="weather-item">
        <div>Sunrise&emsp;&emsp;&emsp;</div>
        <div>${window.moment(sunrise * 1000).format('HH:mm a')}</div>
    </div>
    <div class="weather-item">
        <div>Sunset&emsp;&emsp;&emsp;</div>
        <div>${window.moment(sunset * 1000).format('HH:mm a')}</div>
    </div>
    `;


    let otherDayForecast = ''
    data.daily.forEach((day, idx) => {
        if (idx == 0) {
            currentTempEl.innerHTML =` 
            <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@4x.png" class="w-icon" alt="weather icon">
            <div class="others">
                <div class="day">${window.moment(day.dt * 1000).format('ddd')}</div>
                <div class="temp">Night - ${day.temp.night}&#176; C</div>
                <div class="temp">Day - ${day.temp.day}&#176; C</div>
            </div>`

        } else {
            otherDayForecast += `<div class="weather-forecast-item">
            <div class="day">${window.moment(day.dt * 1000).format('ddd')}</div>
            <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" class="w-icon" alt="weather icon">
            <div class="temp">Night - ${day.temp.night}&#176; C</div>
            <div class="temp">Day - ${day.temp.day}&#176; C</div>
        </div>`

        }
    })


    weatherForecastEl.innerHTML = otherDayForecast; 
}