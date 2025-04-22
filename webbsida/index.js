const addCityButton = document.getElementById("addCityButton");
const searchCityButton = document.getElementById("searchCityButton");

// 1
async function GETHandler() {
    const response = await fetch("http://localhost:8000/cities");
    if (!response.ok) {
        console.log("Någonting gick fel!");
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

    const responseText = await response.text();
    return responseText;
}

async function GETDriver() {
    const resource = await GETHandler();
    console.log("Förfrågan 1: Alla städer");
    console.log(resource);

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
            console.log(city.id);

            async function DELETEDriver() {
                const resource = await DELETEHandler(city);
                console.log("Förfrågan 3: Staden är borttagen från listan:", resource);

                if (resource.includes("Delete ok")) {
                    cityDiv.remove();
                }
            }

            DELETEDriver();
        });
    }
}

GETDriver();


// 2
async function POSTHandler() {
    const response = await fetch("http://localhost:8000/cities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: inputName.value,
            country: inputCountry.value
        })
    });

    const city = await response.json();
    return city;
}

addCityButton.addEventListener("click", function () {
    const inputName = document.getElementById("inputName");
    const inputCountry = document.getElementById("inputCountry");

    async function POSTDriver() {
        const POSTResource = await POSTHandler();

        if (inputName.value == "" || inputCountry.value == "") {
            alert("Stad eller Land saknas!");
            return;
        }

        if (!POSTResource.name || !POSTResource.country) {
            alert("Staden finns redan i listan");
            inputName.value = "";
            inputCountry.value = "";
            return;
        }

        console.log("Förfrågan 2: Staden är tillagd i listan:", POSTResource);

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
            console.log(POSTResource.id);

            async function DELETEDriver() {
                const resource = await DELETEHandler(POSTResource);
                console.log("Förfrågan 3: Staden är borttagen från listan:", resource);

                if (resource.includes("Delete ok")) {
                    cityDiv.remove(); // Tar bort stadens div från DOM:en
                }
            }

            DELETEDriver();
        });

        inputName.value = "";
        inputCountry.value = "";
    }

    POSTDriver();
});


// // 3
async function GETHandlerSearchCities(text) {
    const response = await fetch(`http://localhost:8000/cities/search?text=${text}`);
    const allCitiesWithText = await response.json();
    return allCitiesWithText;
}

async function GETHandlerSearchCitiesWithCountry(text, country) {
    const response = await fetch(`http://localhost:8000/cities/search?text=${text}&country=${country}`);
    const allCitiesWithTextAndCountry = await response.json();
    return allCitiesWithTextAndCountry;
}

searchCityButton.addEventListener("click", async function () {
    const textInput = document.getElementById("textInput").value;
    const countryTextInput = document.getElementById("countryTextInput").value;

    const resultContainer = document.getElementById("searchList");
    resultContainer.innerHTML = "";

    let cities;

    if (textInput && countryTextInput) {
        cities = await GETHandlerSearchCitiesWithCountry(textInput, countryTextInput);
        console.log("Förfrågan 7: Städer som uppfyller både text och land");
        console.log(cities);
    } else if (textInput) {
        cities = await GETHandlerSearchCities(textInput);
        console.log("Förfrågan 6: Städer som innehåller din text");
        console.log(cities);
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