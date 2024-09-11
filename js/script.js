// Criação das vairiáveis e seleção de elementos
const apiKey = "0846f37a06e9059e35f8fd8f4b8c0c2d";
const apiCountryURL = "https://countryflagsapi.com/png/";

const cityInput = document.querySelector("#city-input")
const searchBtn = document.querySelector("#search")

const cityElement = document.querySelector("#city");
const tempElement = document.querySelector("#temperature span");
const descElement = document.querySelector("#description");
const weatherIconElement = document.querySelector("#weather-icon");
const countryElement = document.querySelector("#country");
const umidityElement = document.querySelector("#umidity sapan");
const windElement = document.querySelector("#wind span");

// Funções
const getWeaherData = async(city) =>
{
    const apiWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}&lang=pt_br`;

    const res = await fetch(apiWeatherURL)
    const data = await res.json();

    console.log(data)

}

const showWeatherData = (city) =>
{
    console.log(city)
}

// Eventos
searchBtn.addEventListener("click", (e) => 
{
    e.preventDefault();

    const city = cityInput.Value;

    showWeatherData(city);
});