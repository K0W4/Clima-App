const apiKeyPixabay = "45935026-50e3298f885c52b053a9abf5f";
const apiPixabay = "https://pixabay.com/api/?key=";

const container = document.querySelector('.container');
const search = document.querySelector(".search-box button");
const weatherBox = document.querySelector(".weather-box");
const weatherDetails = document.querySelector(".weather-details");
const error404 = document.querySelector(".not-found");
const cityInput = document.querySelector('.search-box input');

const showWeatherData = async (city) =>
{
  const APIKey = "0846f37a06e9059e35f8fd8f4b8c0c2d";

  if (city === '')
    return;

  const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIKey}&lang=pt_br`);
  const json = await weatherResponse.json();

  if (json.cod == '404')
  {
    container.style.height = '400px';
    weatherBox.classList.remove('active');
    weatherDetails.classList.remove('active');
    error404.classList.add('active');
    return;
  }

  container.style.height = '555px';
  weatherBox.classList.add('active');
  weatherDetails.classList.add('active');
  error404.classList.remove('active');

  const image = document.querySelector('.weather-box img');
  const temperature = document.querySelector('.weather-box .temperature');
  const description = document.querySelector('.weather-box .description');
  const humidity = document.querySelector('.weather-details .humidity span');
  const wind = document.querySelector('.weather-details .wind span');

  switch (json.weather[0].main)
  {
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

  const backgroundImage = await getPixabayImage(city);
  const img = new Image();
  img.src = backgroundImage;
  img.onload = () => {
    document.body.style.backgroundImage = `url("${backgroundImage}")`;
  };
};

search.addEventListener("click", () =>
{
  const city = cityInput.value;
  showWeatherData(city);
});

cityInput.addEventListener("keyup", (e) =>
{
  if (e.code === "Enter")
  {
    const city = e.target.value;
    showWeatherData(city);
  }
});

const getPixabayImage = async (city) =>
{
  const apiImageURL = `${apiPixabay}${apiKeyPixabay}&q=${city}&image_type=photo&orientation=horizontal`;

  const res = await fetch(apiImageURL);
  const data = await res.json();

  return data.hits[0].largeImageURL;
};