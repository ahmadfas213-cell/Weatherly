const favoritesList =
    document.getElementById(
        "favoritesList"
    );

const emptyFavorites =
    document.getElementById(
        "emptyFavorites"
    );


/* =========================
   GET FAVORITES
========================= */

function getFavorites() {

    const data =
        localStorage.getItem(
            "weatherlyFavorites"
        );


    if (!data) {

        return [];

    }


    try {

        return JSON.parse(data);

    } catch (error) {

        console.error(
            "Data favorites rusak:",
            error
        );

        return [];

    }

}


/* =========================
   SAVE FAVORITES
========================= */

function saveFavorites(
    favorites
) {

    localStorage.setItem(
        "weatherlyFavorites",
        JSON.stringify(favorites)
    );

}


/* =========================
   DISPLAY
========================= */

function displayFavorites() {

    const favorites =
        getFavorites();


    favoritesList.innerHTML =
        "";


    if (
        favorites.length === 0
    ) {

        emptyFavorites.classList.remove(
            "hidden"
        );

        return;

    }


    emptyFavorites.classList.add(
        "hidden"
    );


    favorites.forEach(
        function (item) {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "favorite-card";


            card.innerHTML = `

                <div class="favorite-city">

                    <div class="favorite-location">
                        📍
                    </div>

                    <div>

                        <strong>
                            ${item.name}
                        </strong>

                        <span>
                            ${item.country || ""}
                        </span>

                    </div>

                </div>


                <div class="favorite-actions">

                    <a
                        href="index.html?city=${encodeURIComponent(item.name)}"
                        class="favorite-open"
                    >
                        Lihat
                    </a>


                    <button
                        type="button"
                        class="favorite-delete"
                    >
                        Hapus
                    </button>

                </div>

            `;


            const deleteButton =
                card.querySelector(
                    ".favorite-delete"
                );


            deleteButton.addEventListener(
                "click",
                function () {

                    removeFavorite(
                        item.name
                    );

                }
            );


            favoritesList.appendChild(
                card
            );

        }
    );

}


/* =========================
   REMOVE
========================= */

function removeFavorite(
    cityName
) {

    let favorites =
        getFavorites();


    favorites =
        favorites.filter(
            function (item) {

                return (
                    item.name.toLowerCase() !==
                    cityName.toLowerCase()
                );

            }
        );


    saveFavorites(
        favorites
    );


    displayFavorites();

}


/* =========================
   START
========================= */

displayFavorites();