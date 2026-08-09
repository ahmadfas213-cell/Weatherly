const API_KEY = "95d23560f8a57138be4e890edc66be0a";

const form = document.getElementById("weatherForm");
const cityInput = document.getElementById("cityInput");

const weather = document.getElementById("weather");
const loading = document.getElementById("loading");
const error = document.getElementById("error");

const city = document.getElementById("city");
const country = document.getElementById("country");

const temperature = document.getElementById("temperature");
const temperatureUnit = document.getElementById("temperatureUnit");

const description = document.getElementById("description");
const feelsLike = document.getElementById("feelsLike");
const feelsLikeUnit = document.getElementById("feelsLikeUnit");

const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const pressure = document.getElementById("pressure");
const clouds = document.getElementById("clouds");

const sunrise = document.getElementById("sunrise");
const sunset = document.getElementById("sunset");

const weatherIcon = document.getElementById("weatherIcon");

const favoriteBtn =
    document.getElementById("favoriteBtn");

const locationBtn =
    document.getElementById("locationBtn");

const unitBtn =
    document.getElementById("unitBtn");


let currentWeatherData = null;
let isFahrenheit = false;


/* =========================
   SEARCH
========================= */

if (form) {

    form.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            const cityName =
                cityInput.value.trim();

            if (!cityName) {

                showError(
                    "Masukkan nama kota dulu."
                );

                return;
            }

            getWeather(cityName);

        }
    );

}


/* =========================
   GET WEATHER
========================= */

async function getWeather(cityName) {

    loading.classList.remove("hidden");

    weather.classList.add("hidden");

    error.classList.add("hidden");


    const url =
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName)}&appid=${API_KEY}&units=metric&lang=id`;


    try {

        const response =
            await fetch(url);


        if (!response.ok) {

            if (response.status === 404) {

                throw new Error(
                    "Kota nggak ditemukan."
                );

            }

            if (response.status === 401) {

                throw new Error(
                    "API key tidak valid."
                );

            }

            if (response.status === 429) {

                throw new Error(
                    "Terlalu banyak request."
                );

            }

            throw new Error(
                "Gagal mengambil data cuaca."
            );

        }


        const data =
            await response.json();


        currentWeatherData = data;


        displayWeather(data);


        updateFavoriteButton();


    } catch (err) {

        showError(
            err.message
        );


    } finally {

        loading.classList.add(
            "hidden"
        );

    }

}


/* =========================
   DISPLAY WEATHER
========================= */

function displayWeather(data) {

    city.textContent =
        data.name;

    country.textContent =
        data.sys.country;


    temperature.textContent =
        Math.round(data.main.temp);


    feelsLike.textContent =
        Math.round(
            data.main.feels_like
        );


    description.textContent =
        data.weather[0].description;


    humidity.textContent =
        `${data.main.humidity}%`;


    const windSpeed =
        (
            data.wind.speed * 3.6
        ).toFixed(1);


    wind.textContent =
        `${windSpeed} km/h`;


    pressure.textContent =
        `${data.main.pressure} hPa`;


    clouds.textContent =
        `${data.clouds.all}%`;


    weatherIcon.src =
        `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;


    weatherIcon.alt =
        data.weather[0].description;


    sunrise.textContent =
        formatTime(
            data.sys.sunrise,
            data.timezone
        );


    sunset.textContent =
        formatTime(
            data.sys.sunset,
            data.timezone
        );


    temperatureUnit.textContent =
        "°C";


    feelsLikeUnit.textContent =
        "°C";


    isFahrenheit = false;


    weather.classList.remove(
        "hidden"
    );

}


/* =========================
   FORMAT TIME
========================= */

function formatTime(
    timestamp,
    timezoneOffset
) {

    const date =
        new Date(
            timestamp * 1000
        );


    const localTime =
        new Date(
            date.getTime() +
            timezoneOffset * 1000
        );


    return localTime
        .toISOString()
        .slice(11, 16);

}


/* =========================
   ERROR
========================= */

function showError(message) {

    error.textContent =
        message;

    error.classList.remove(
        "hidden"
    );

    weather.classList.add(
        "hidden"
    );

}


/* =========================
   FAVORITES
========================= */

function getFavorites() {

    const data =
        localStorage.getItem(
            "weatherlyFavorites"
        );


    return data
        ? JSON.parse(data)
        : [];

}


function saveFavorites(
    favorites
) {

    localStorage.setItem(
        "weatherlyFavorites",
        JSON.stringify(favorites)
    );

}


/* =========================
   ADD FAVORITE
========================= */

if (favoriteBtn) {

    favoriteBtn.addEventListener(
        "click",
        function () {

            const currentCity =
                city.textContent.trim();

            const currentCountry =
                country.textContent.trim();


            if (
                !currentCity ||
                currentCity === "--"
            ) {

                return;

            }


            let favorites =
                getFavorites();


            const exists =
                favorites.some(
                    function (item) {

                        return (
                            item.name.toLowerCase() ===
                            currentCity.toLowerCase()
                        );

                    }
                );


            if (exists) {

                favoriteBtn.textContent =
                    "★ Sudah di Favorites";

                return;

            }


            favorites.push({

                name:
                    currentCity,

                country:
                    currentCountry

            });


            saveFavorites(
                favorites
            );


            favoriteBtn.textContent =
                "★ Added to Favorites";

        }
    );

}


/* =========================
   UPDATE FAVORITE BUTTON
========================= */

function updateFavoriteButton() {

    if (!favoriteBtn) {
        return;
    }


    const currentCity =
        city.textContent.trim();


    const favorites =
        getFavorites();


    const exists =
        favorites.some(
            function (item) {

                return (
                    item.name.toLowerCase() ===
                    currentCity.toLowerCase()
                );

            }
        );


    if (exists) {

        favoriteBtn.textContent =
            "★ Sudah di Favorites";

    } else {

        favoriteBtn.textContent =
            "☆ Add to Favorites";

    }

}


/* =========================
   CELSIUS / FAHRENHEIT
========================= */

if (unitBtn) {

    unitBtn.addEventListener(
        "click",
        function () {

            if (!currentWeatherData) {

                return;

            }


            isFahrenheit =
                !isFahrenheit;


            let temp =
                currentWeatherData.main.temp;

            let feels =
                currentWeatherData.main.feels_like;


            if (isFahrenheit) {

                temp =
                    (temp * 9 / 5) + 32;

                feels =
                    (feels * 9 / 5) + 32;


                temperatureUnit.textContent =
                    "°F";

                feelsLikeUnit.textContent =
                    "°F";


            } else {

                temperatureUnit.textContent =
                    "°C";

                feelsLikeUnit.textContent =
                    "°C";

            }


            temperature.textContent =
                Math.round(temp);


            feelsLike.textContent =
                Math.round(feels);

        }
    );

}


/* =========================
   LOCATION
========================= */

if (locationBtn) {

    locationBtn.addEventListener(
        "click",
        function () {

            if (!navigator.geolocation) {

                showError(
                    "Browser lu nggak mendukung lokasi."
                );

                return;

            }


            loading.classList.remove(
                "hidden"
            );


            navigator.geolocation.getCurrentPosition(

                async function (position) {

                    const lat =
                        position.coords.latitude;

                    const lon =
                        position.coords.longitude;


                    const url =
                        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=id`;


                    try {

                        const response =
                            await fetch(url);


                        if (!response.ok) {

                            throw new Error(
                                "Gagal mengambil lokasi."
                            );

                        }


                        const data =
                            await response.json();


                        currentWeatherData =
                            data;


                        displayWeather(
                            data
                        );


                        updateFavoriteButton();


                    } catch (err) {

                        showError(
                            err.message
                        );

                    } finally {

                        loading.classList.add(
                            "hidden"
                        );

                    }

                },


                function () {

                    loading.classList.add(
                        "hidden"
                    );

                    showError(
                        "Lokasi tidak bisa diakses."
                    );

                }

            );

        }
    );

}


/* =========================
   LOAD CITY FROM URL
========================= */

const params =
    new URLSearchParams(
        window.location.search
    );


const urlCity =
    params.get("city");


if (
    urlCity &&
    cityInput
) {

    cityInput.value =
        urlCity;

    getWeather(
        urlCity
    );

}