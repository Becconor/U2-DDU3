const addCityButton = document.getElementById("addCityButton");
const searchCityButton = document.getElementById("searchCityButton");

async function GETHandler() {
    const response = await fetch("http://localhost:8000/cities");
    if (!response.ok) {
        alert("Någonting gick fel!");
        return;
    } else {
        const cityList = await response.json();
        return cityList;
    }
}

async function DELETEHandler(city) {
    const response = await fetch("http://localhost:8000/cities", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: city.id })
    });

    if (!response.ok) {
        alert("Någonting gick fel!");
        return;
    } else {
        const responseText = await response.text();
        return responseText;
    }
}

async function GETDriver() {
    const resource = await GETHandler();

    for (let city of resource) {
        let cityDiv = document.createElement("div");
        let cityName = document.createElement("p");
        let cityDeleteButton = document.createElement("div");

        cityDiv.classList.add("city");
        cityDeleteButton.classList.add("deleteButton");

        cityName.textContent = `${city.name},  ${city.country}`;
        cityDeleteButton.textContent = "delete";

        const cityItem = document.getElementById("listOfCities");
        cityItem.appendChild(cityDiv);
        cityDiv.appendChild(cityName);
        cityDiv.appendChild(cityDeleteButton);

        cityDeleteButton.addEventListener("click", async function () {
            const resource = await DELETEHandler(city);

            if (resource.includes("Delete ok")) {
                cityDiv.remove();
            }
        });
    }
}

GETDriver();


async function POSTHandler() {
    const response = await fetch("http://localhost:8000/cities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: inputName.value,
            country: inputCountry.value
        })
    });

    if (response.status == 409) {
        alert("Staden finns redan i listan");
        inputName.value = "";
        inputCountry.value = "";
        return;
    } else {
        const city = await response.json();
        return city;
    }
}

addCityButton.addEventListener("click", async function () {
    const inputName = document.getElementById("inputName");
    const inputCountry = document.getElementById("inputCountry");

    if (inputName.value == "" || inputCountry.value == "") {
        alert("Stad eller Land saknas!");
        return;
    }

    const POSTResource = await POSTHandler();

    let cityDiv = document.createElement("div");
    let cityName = document.createElement("p");
    let cityDeleteButton = document.createElement("div");

    cityDiv.classList.add("city");
    cityDeleteButton.classList.add("deleteButton");

    cityName.textContent = `${POSTResource.name},  ${POSTResource.country}`;
    cityDeleteButton.textContent = "delete";

    const cityItem = document.getElementById("listOfCities");
    cityItem.appendChild(cityDiv);
    cityDiv.appendChild(cityName);
    cityDiv.appendChild(cityDeleteButton);

    cityDeleteButton.addEventListener("click", async function () {
        const resource = await DELETEHandler(POSTResource);

        if (resource.includes("Delete ok")) {
            cityDiv.remove();
        }
    });

    inputName.value = "";
    inputCountry.value = "";
});


async function GETHandlerSearchCities(text) {
    const response = await fetch(`http://localhost:8000/cities/search?text=${text}`);

    if (!response.ok) {
        alert("Någonting gick fel!");
        return;
    } else {
        const allCitiesWithText = await response.json();
        return allCitiesWithText;
    }
}

async function GETHandlerSearchCitiesWithCountry(text, country) {
    const response = await fetch(`http://localhost:8000/cities/search?text=${text}&country=${country}`);

    if (!response.ok) {
        alert("Någonting gick fel!");
        return;
    } else {
        const allCitiesWithTextAndCountry = await response.json();
        return allCitiesWithTextAndCountry;
    }
}

searchCityButton.addEventListener("click", async function () {
    const textInput = document.getElementById("textInput").value;
    const countryTextInput = document.getElementById("countryTextInput").value;

    const resultContainer = document.getElementById("searchList");
    resultContainer.innerHTML = "";

    let cities;

    if (textInput && countryTextInput) {
        cities = await GETHandlerSearchCitiesWithCountry(textInput, countryTextInput);
    } else if (textInput) {
        cities = await GETHandlerSearchCities(textInput);
    } else {
        alert("Du måste skriva något i Text-fältet för att kunna söka!");
        return;
    }

    if (cities.length === 0) {
        const noResultDiv = document.createElement("div");
        noResultDiv.classList.add("searchCity");
        noResultDiv.textContent = "No cities found";
        resultContainer.appendChild(noResultDiv);
        return;
    }

    for (let city of cities) {
        let cityDiv = document.createElement("div");
        cityDiv.classList.add("searchCity");
        cityDiv.textContent = `${city.name}, ${city.country}`;
        resultContainer.appendChild(cityDiv);
    }

    document.getElementById("textInput").value = "";
    document.getElementById("countryTextInput").value = "";
});