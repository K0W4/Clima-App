const apiKeyWeather = "0846f37a06e9059e35f8fd8f4b8c0c2d";
const apiKeyPixabay = "45935026-50e3298f885c52b053a9abf5f";
const apiPixabay = "https://pixabay.com/api/?key=";

const cityInput = document.querySelector("#city-input");
const searchBtn = document.querySelector("#search");

const cityElement = document.querySelector("#city");
const tempElement = document.querySelector("#temperature span");
const descElement = document.querySelector("#description");
const weatherIconElement = document.querySelector("#weather-icon");
const umidityElement = document.querySelector("#umidity span");
const windElement = document.querySelector("#wind span");

const weatherContainer = document.querySelector("#weather-data");

const errorMessageContainer = document.querySelector("#error-message");
const loader = document.querySelector("#loader");

// Loader
const toggleLoader = () =>
{
  loader.classList.toggle("hide");
};

// Função para buscar dados do tempo
const getWeatherData = async (city) =>
{
  toggleLoader();

  const apiWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKeyWeather}&lang=pt_br`;

  const res = await fetch(apiWeatherURL);
  const data = await res.json();

  toggleLoader();

  return data;
};

// Função para buscar imagens no Pixabay
const getPixabayImage = async (city) =>
{
  const apiImageURL = `${apiPixabay}${apiKeyPixabay}&q=${city}&image_type=photo&orientation=horizontal`;

  const res = await fetch(apiImageURL);
  const data = await res.json();

  return data.hits[0].largeImageURL;
};

// Tratamento de erro
const showErrorMessage = () =>
{
  errorMessageContainer.classList.remove("hide");
};

const hideInformation = () =>
{
  errorMessageContainer.classList.add("hide");
  weatherContainer.classList.add("hide");
};

// Mostra os dados do tempo e define o background
const showWeatherData = async (city) =>
{
  hideInformation();

  const data = await getWeatherData(city);

  if (data.cod === "404")
  {
    showErrorMessage();
    return;
  }

  cityElement.innerText = data.name;
  tempElement.innerText = parseInt(data.main.temp);
  descElement.innerText = data.weather[0].description;
  weatherIconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`
  );
  umidityElement.innerText = `${data.main.humidity}%`;
  windElement.innerText = `${data.wind.speed}km/h`;

  const backgroundImage = await getPixabayImage(city);
  document.body.style.backgroundImage = `url("${backgroundImage}")`;

  weatherContainer.classList.remove("hide");
};

// Evento de clique no botão de busca
searchBtn.addEventListener("click", async (e) =>
{
  e.preventDefault();

  const city = cityInput.value;

  showWeatherData(city);
});

// Evento de pressionar "Enter" no input
cityInput.addEventListener("keyup", (e) =>
{
  if (e.code === "Enter")
  {
    const city = e.target.value;

    showWeatherData(city);
  }
});