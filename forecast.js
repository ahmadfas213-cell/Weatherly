const API_KEY = "95d23560f8a57138be4e890edc66be0a";


const form =
    document.getElementById("forecastForm");

const cityInput =
    document.getElementById("forecastCity");

const result =
    document.getElementById("forecastResult");

const loading =
    document.getElementById("forecastLoading");

const error =
    document.getElementById("forecastError");

const locationName =
    document.getElementById("forecastLocation");

const forecastList =
    document.getElementById("forecastList");



form.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const city =
            cityInput.value.trim();


        if (!city) {

            showError(
                "Masukkan nama kota dulu."
            );

            return;
        }


        getForecast(city);

    }
);



async function getForecast(city) {

    loading.classList.remove("hidden");

    result.classList.add("hidden");

    error.classList.add("hidden");


    try {

        /*
         * CARI KOORDINAT KOTA
         */

        const geoUrl =
            `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${API_KEY}`;


        const geoResponse =
            await fetch(geoUrl);


        if (!geoResponse.ok) {

            if (
                geoResponse.status === 401
            ) {

                throw new Error(
                    "API key tidak valid."
                );

            }


            throw new Error(
                "Gagal mencari lokasi."
            );
        }


        const geoData =
            await geoResponse.json();


        if (!geoData.length) {

            throw new Error(
                "Kota nggak ditemukan."
            );
        }


        const latitude =
            geoData[0].lat;

        const longitude =
            geoData[0].lon;



        /*
         * AMBIL FORECAST
         */

        const forecastUrl =
            `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric&lang=id`;


        const response =
            await fetch(
                forecastUrl
            );


        if (!response.ok) {

            if (
                response.status === 401
            ) {

                throw new Error(
                    "API key tidak valid."
                );
            }


            if (
                response.status === 429
            ) {

                throw new Error(
                    "Terlalu banyak request."
                );
            }


            throw new Error(
                "Gagal mengambil forecast."
            );
        }


        const data =
            await response.json();


        displayForecast(
            data,
            geoData[0]
        );


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



/*
 * TAMPILKAN FORECAST
 */

function displayForecast(
    data,
    location
) {

    locationName.textContent =
        `${location.name}${location.country ? ", " + location.country : ""}`;


    forecastList.innerHTML =
        "";


    const daily = {};


    /*
     * KELOMPOKKAN BERDASARKAN TANGGAL
     */

    data.list.forEach(
        function (item) {

            const date =
                item.dt_txt.split(" ")[0];


            if (!daily[date]) {

                daily[date] = [];

            }


            daily[date].push(item);

        }
    );


    /*
     * AMBIL 5 HARI
     */

    const dates =
        Object.keys(daily)
            .slice(0, 5);


    dates.forEach(
        function (date) {

            const items =
                daily[date];


            /*
             * CARI SUHU MIN & MAX
             */

            const temps =
                items.map(
                    function (item) {
                        return item.main.temp;
                    }
                );


            const minTemp =
                Math.round(
                    Math.min(...temps)
                );


            const maxTemp =
                Math.round(
                    Math.max(...temps)
                );


            /*
             * CARI DATA JAM 12 SIANG
             */

            const midday =
                items.find(
                    function (item) {

                        return item.dt_txt
                            .includes(
                                "12:00:00"
                            );

                    }
                )
                ||
                items[
                    Math.floor(
                        items.length / 2
                    )
                ];


            const weatherData =
                midday.weather[0];


            /*
             * BUAT CARD
             */

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "forecast-card";


            card.innerHTML = `

                <div class="forecast-day">

                    <strong>
                        ${formatDate(date)}
                    </strong>

                    <span>
                        ${midday.dt_txt.slice(11, 16)}
                    </span>

                </div>


                <img
                    src="https://openweathermap.org/img/wn/${weatherData.icon}@2x.png"
                    alt="${weatherData.description}"
                >


                <div class="forecast-info">

                    <strong>
                        ${maxTemp}°
                    </strong>

                    <span>
                        ${minTemp}°
                    </span>

                    <p>
                        ${weatherData.description}
                    </p>

                </div>

            `;


            forecastList.appendChild(
                card
            );

        }
    );


    result.classList.remove(
        "hidden"
    );
}



/*
 * FORMAT TANGGAL
 */

function formatDate(
    dateString
) {

    const date =
        new Date(
            dateString +
            "T12:00:00"
        );


    return date.toLocaleDateString(
        "id-ID",
        {
            weekday: "long",
            day: "numeric",
            month: "short"
        }
    );
}



/*
 * ERROR
 */

function showError(
    message
) {

    error.textContent =
        message;


    error.classList.remove(
        "hidden"
    );


    result.classList.add(
        "hidden"
    );

}