// Criação das vairiáveis e seleção de elementos
const geolocationAPI = new URL(`https://geocoding-api.open-meteo.com/v1/search`)
const temperatureAPI = new URL(`https://api.open-meteo.com/v1/forecast`)
const apiCountryURL = "https://countryflagsapi.com/png/";
const apiUnsplash = "https://source.unsplash.com/1600x900/?";
const locationSearch = document.querySelector('#city-input')
const searchButton = document.querySelector('#search')
//const apiKey = "0846f37a06e9059e35f8fd8f4b8c0c2d";
const cityInput = document.querySelector("#city-input");
const searchBtn = document.querySelector("#search");
    
const cityElement = document.querySelector("#city");
const tempElement = document.querySelector("#temperature span");
const descElement = document.querySelector("#description");
const weatherIconElement = document.querySelector("#weather-icon");
const countryElement = document.querySelector("#country");
const humidityElement = document.querySelector("#humidity sapan");
const windElement = document.querySelector("#wind span");

const weatherContainer = document.querySelector("#weather-data");

const errorMessageContainer = document.querySelector("#error-message");
const loader = document.querySelector("#loader");

const suggestionContainer = document.querySelector("#suggestions");
const suggestionButtons = document.querySelectorAll("#suggestions button");

// Funções
async function requestGeolocation()
{
    let url = geolocationAPI + '?' + new URLSearchParams(
    {
        name: locationSearch.value,
        count: '10',
        language: 'en',
        format: 'json'
    })
    const geolocationRequest = new Request(url)
    const response = await fetch(geolocationRequest)

    if(!response.ok)
    {
        throw new Error(response.statusText)
    }

    const json = await getGeolocation(response)
    const geoArray = json.results

    await temperatureRequest(geoArray[0].latitude, geoArray[0].longitude) // Arumar para pegar o certo
}

function getGeolocation(res)
{
    return res.json()
}

async function temperatureRequest(latitude, longitude)
{
    let url = temperatureAPI + '?' + new URLSearchParams(
    {
        latitude: latitude,
        longitude: longitude,
        current: ['temperature_2m','relative_humidity_2m', 'wind_speed_10m'],
    })

    const temperatureRequest = new Request(url)
    const response = await fetch(temperatureRequest)

    if(!response.ok)
    {
        throw new Error(response.statusText)
    }

    const json = await response.json()

    const temperatures = json.current.temperature_2m
    const humidity = json.current.relative_humidity_2m
    const windSpeed = json.current.wind_speed_10m
 
    console.log('Temperaturas: ',temperatures)
    console.log('Humidade: ',humidity)
    console.log('Vento: ', windSpeed)
}
    /////////////////////////////////////////////////////////////////////////////////////////////////
searchButton.addEventListener('click', (e) => {
    requestGeolocation()
})

// Loader
const toggleLoader = () =>
{
  loader.classList.toggle("hide");
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

  suggestionContainer.classList.add("hide");
};

/*const showWeatherData = async (temperature, des) =>
{
  hideInformation();

  if (data.cod === "404") {
    showErrorMessage();
    return;
  }

  cityElement.innerText = ;
  tempElement.innerText = ;
  descElement.innerText = ;
  weatherIconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`
  );
  umidityElement.innerText = `${data.main.humidity}%`;
  windElement.innerText = `${data.wind.speed}km/h`;

  // Change bg image
  document.body.style.backgroundImage = `url("${apiUnsplash + city}")`;

  weatherContainer.classList.remove("hide");
};
*/

searchBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  const city = cityInput.value;

  showWeatherData(city);
});

cityInput.addEventListener("keyup", (e) =>
{
  if (e.code === "Enter") {
    const city = e.target.value;

    showWeatherData(city);
  }
});

// Sugestões
suggestionButtons.forEach((btn) =>
{
  btn.addEventListener("click", () =>
  {
    const city = btn.getAttribute("id");

    showWeatherData(city);
  });
});