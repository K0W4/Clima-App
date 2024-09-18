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

  if (!weatherResponse.ok){
    onJsonError(city)
    return;
  }

  if (cityHide.textContent === city){
    return;
  } else {
    onFirstSearch(city);

    setTimeout(() => {
      container.classList.remove('active')
    }, 2500);

    await setWeatherData(json)

    const newInfoWeather = infoWeather.cloneNode(true);
    const newInfoHumidity = infoHumidity.cloneNode(true);
    const newInfoWind = infoWind.cloneNode(true);

    newInfoWeather.id = 'clone-info-weather';
    newInfoWeather.classList.add('active-clone');

    newInfoHumidity.id = 'clone-info-humidity';
    newInfoHumidity.classList.add('active-clone');

    newInfoWind.id = 'clone-info-wind';
    newInfoWind.classList.add('active-clone');

    setTimeout(() => {
      infoWeather.insertAdjacentElement("afterend", newInfoWeather);
      infoHumidity.insertAdjacentElement("afterend", newInfoHumidity);
      infoWind.insertAdjacentElement("afterend", newInfoWind);
    }, 2200);

    const infoWeatherClone = document.querySelectorAll('.info-weather.active-clone');
    const totalWeatherInfoClone = infoWeatherClone.length;
    const firstWeatherInfo = infoWeatherClone[0];
    const infoHumidityClone = document.querySelectorAll('.info-humidity.active-clone');
    const firstInfoHumidity = infoHumidityClone[0];
    const infoWindClone = document.querySelectorAll('.info-wind.active-clone');
    const firstInfoWind = infoWindClone[0];

    if (totalWeatherInfoClone > 0) {
      firstWeatherInfo.classList.remove('active-clone')
      firstInfoHumidity.classList.remove('active-clone')
      firstInfoWind.classList.remove('active-clone')

      setTimeout(() => {
        firstWeatherInfo.remove();
        firstInfoHumidity.remove();
        firstInfoWind.remove();
      }, 2200);
    }

    await getPixabayImage(city)
        .then(res =>
            setBackgroundImage(res)
        )
  }
}

/**
 * Error: se ocorrer erro na response da API, edita o layout para exibir uma tela de erro.
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

// UI Functions

/**
 * Apos a primeira pesquisa muda o layout
 * @param city
 */
function onFirstSearch(city){
  cityHide.textContent = city;
  container.style.height = '555px';
  container.classList.add('active')
  weatherBox.classList.add('active');
  weatherDetails.classList.add('active');
  error404.classList.remove('active');
}

/**
 * Edita as informacoes de clima com base na response da API
 * @param json com informacoes da cidade pesquisada
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