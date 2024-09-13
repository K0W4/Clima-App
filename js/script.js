const apiKeyPixabay = "45935026-50e3298f885c52b053a9abf5f";
const apiPixabay = "https://pixabay.com/api/?key=";
const openWeatherAPIKey = "0846f37a06e9059e35f8fd8f4b8c0c2d";
const openWeatherAPI = "https://api.openweathermap.org/data/2.5/weather"

const container = document.querySelector('.container');
const search = document.querySelector(".search-box button");
const weatherBox = document.querySelector(".weather-box");
const weatherDetails = document.querySelector(".weather-details");
const error404 = document.querySelector(".not-found");
const cityInput = document.querySelector('.search-box input');
const cityHide = document.querySelector('.city-hide');

const image = document.querySelector('.weather-box img');
const temperature = document.querySelector('.weather-box .temperature');
const description = document.querySelector('.weather-box .description');
const humidity = document.querySelector('.weather-details .humidity span');
const wind = document.querySelector('.weather-details .wind span');

const infoWeather = document.querySelector('.info-weather');
const infoHumidity = document.querySelector('.info-humidity');
const infoWind = document.querySelector('.info-wind');

async function showWeatherData(city){
  if (city === ''){
    return;
  }

  const weatherRequestURL = openWeatherAPI + '?' + new URLSearchParams({
    q: city,
    units: 'metric',
    appid: openWeatherAPIKey,
    lang: 'pt_br'
  })
  const weatherResponse = await fetch(weatherRequestURL);
  const json = await weatherResponse.json();

  if (json.cod === '404'){
    onJsonError(city)
    return;
  }

  if (cityHide.textContent === city){
    return;
  } else {
    cityHide.textContent = city;
    container.style.height = '555px';
    container.classList.add('active')
    weatherBox.classList.add('active');
    weatherDetails.classList.add('active');
    error404.classList.remove('active');

    setTimeout(() => {
      container.classList.remove('active')
    }, 2500);

    await setWeatherData(json)

    const elCloneInfoWeather = infoWeather.cloneNode(true);
    const elCloneInfoHumidity = infoHumidity.cloneNode(true);
    const elCloneInfoWind = infoWind.cloneNode(true);

    elCloneInfoWeather.id = 'clone-info-weather';
    elCloneInfoWeather.classList.add('active-clone');

    elCloneInfoHumidity.id = 'clone-info-humidity';
    elCloneInfoHumidity.classList.add('active-clone');

    elCloneInfoWind.id = 'clone-info-wind';
    elCloneInfoWind.classList.add('active-clone');

    setTimeout(() => {
      infoWeather.insertAdjacentElement("afterend", elCloneInfoWeather);
      infoHumidity.insertAdjacentElement("afterend", elCloneInfoHumidity);
      infoWind.insertAdjacentElement("afterend", elCloneInfoWind);
    }, 2200);

    const cloneInfoWeather = document.querySelectorAll('.info-weather.active-clone');
    const totalCloneInfoWeather = cloneInfoWeather.length;
    const cloneInfoWeatherFirst = cloneInfoWeather[0];

    const cloneInfoHumidity = document.querySelectorAll('.info-humidity.active-clone');
    const cloneInfoHumidityFirst = cloneInfoHumidity[0];

    const cloneInfoWind = document.querySelectorAll('.info-wind.active-clone');
    const cloneInfoWindFirst = cloneInfoWind[0];

    if (totalCloneInfoWeather > 0) {
      cloneInfoWeatherFirst.classList.remove('active-clone')
      cloneInfoHumidityFirst.classList.remove('active-clone')
      cloneInfoWindFirst.classList.remove('active-clone')

      setTimeout(() => {
        cloneInfoWeatherFirst.remove();
        cloneInfoHumidityFirst.remove();
        cloneInfoWindFirst.remove();
      }, 2200);
    }

    await getPixabayImage(city)
        .then(res => setBackgroundImage(res))
  }
}

/**
 * Error
 */
function onJsonError(city){
  cityHide.textContent = city;
  container.style.height = '400px';
  weatherBox.classList.remove('active');
  weatherDetails.classList.remove('active');
  error404.classList.add('active');
}

/**
 * EVENTS
 */
search.addEventListener("click", () => {
  const city = cityInput.value;
  showWeatherData(city);
});

cityInput.addEventListener("keyup", (e) => {
  if (e.code === "Enter") {
    const city = e.target.value;
    showWeatherData(city);
  }
});

/**
 * UI Functions
 */
function setWeatherData(json){
  switch (json.weather[0].main) {
    case 'Clear':
      image.src = '../images/clear.png';
      break;
    case 'Rain':
      image.src = '../images/rain.png';
      break;
    case 'Snow':
      image.src = '../images/snow.png';
      break;
    case 'Clouds':
      image.src = '../images/cloud.png';
      break;
    case 'Mist':
      image.src = '../images/mist.png';
      break;
    case 'Haze':
      image.src = '../images/mist.png';
      break;
    default:
      image.src = '../images/cloud.png';
  }

  temperature.innerHTML = `${parseInt(json.main.temp)}<span>°C</span>`;
  description.innerHTML = `${json.weather[0].description}`;
  humidity.innerHTML = `${json.main.humidity}%`;
  wind.innerHTML = `${parseInt(json.wind.speed)}<span>°Km/h</span>`;
}

/**
 * Request para background do site
 * @param city cidade informada
 * @returns {Promise<*>} background
 */
async function getPixabayImage(city){
  let imageRequestURL = apiPixabay + apiKeyPixabay + '&' + new URLSearchParams({
    q:city,
    image_type: 'photo',
    orientation: 'horizontal'
  })

  const res = await fetch(imageRequestURL);
  const data = await res.json();
  return data.hits[0].largeImageURL;
}

/**
 * Define o plano de fundo
 * @param response promise da URL do json
 */
function setBackgroundImage(response) {
  const img = new Image();
  img.src = response;
  img.onload = () => {
    document.body.style.backgroundImage = `url("${response}")`;
  }
}