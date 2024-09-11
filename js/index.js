const geolocationAPI = new URL(`https://geocoding-api.open-meteo.com/v1/search`)
const temperatureAPI = new URL(`https://api.open-meteo.com/v1/forecast`)
const locationSearch = document.querySelector('#city-input')
const searchButton = document.querySelector('#search')

searchButton.addEventListener('click', (e) => {
    requestGeolocation()
})

async function requestGeolocation(){
    let url = geolocationAPI + '?' + new URLSearchParams({
        name: locationSearch.value,
        count: '10',
        language: 'en',
        format: 'json'
    })
    const geolocationRequest = new Request(url)
    const response = await fetch(geolocationRequest)

    if(!response.ok){
        throw new Error(response.statusText)
    }

    const json = await getGeolocation(response)
    const geoArray = json.results

    await temperatureRequest(geoArray[0].latitude, geoArray[0].longitude)

}

function getGeolocation(res){
    return res.json()
}



async function temperatureRequest(latitude, longitude){
    let url = temperatureAPI + '?' + new URLSearchParams({
        latitude: latitude,
        longitude: longitude,
        current: ['relative_humidity_2m', 'wind_speed_10m'],
        hourly: 'temperature_2m'
    })

    const temperatureRequest = new Request(url)
    const response = await fetch(temperatureRequest)

    if(!response.ok){
        throw new Error(response.statusText)
    }

    const json = await response.json()

    const hours = json.hourly.time
    const temperatures = json.hourly.temperature_2m
    const humidity = json.current.relative_humidity_2m
    const windSpeed = json.current.wind_speed_10m

    console.log('Horario: ',hours)
    console.log('Temperaturas: ',temperatures)
    console.log('Humidade: ',humidity)
    console.log('Vento: ', windSpeed)
}


