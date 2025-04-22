async function GETHandler() {
    const response = await fetch("http://localhost:8000/cities");
    if (!response.ok) {
        console.log("Någonting gick fel!");
    } else {
        const cityList = await response.json();
        return cityList;
    }
}

async function GETDriver() {
    const resource = await GETHandler();
    console.log("Förfrågan 1: Alla städer");
    console.log(resource);
}

GETDriver();


async function POSTHandler() {
    const response = await fetch("http://localhost:8000/cities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: "Malmö",
            country: "Swenden"
        })
    });

    const city = await response.json();
    return city;
}

async function POSTDriver() {
    const resource = await POSTHandler();
    console.log("Förfrågan 2: Staden Malmö är tillagd i listan:", resource);
}

POSTDriver();


async function DELETEHandler() {
    const response = await fetch("http://localhost:8000/cities", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: 2 })
    });

    const responseText = await response.text();
    return responseText;
}

async function DELETEDriver() {
    const resource = await DELETEHandler();
    console.log("Förfrågan 3: Staden med id 2 är borttagen från listan:", resource);

    await GETDriverAllCities();
    await GETDriverCityById(43);                                // Till förfrågan 5
    await GETDriverSearchCities("en");                          // Till förfrågan 6
    await GETDriverSearchCitiesWithCountry("en", "Sweden");     // Till förfrågan 7
}

DELETEDriver();


async function GETHandlerAllCities() {
    const response = await fetch("http://localhost:8000/cities");
    const citiesList = await response.json();
    return citiesList;
}

async function GETDriverAllCities() {
    const resource = await GETHandlerAllCities();
    console.log("Förfrågan 4: Array minus Lille pluss Malmö");
    console.log(resource);
}


async function GETHandlerCityById(id) {
    const response = await fetch(`http://localhost:8000/cities/${id}`);
    const cityWithId = await response.json();
    return cityWithId;
}

async function GETDriverCityById(id) {
    const resource = await GETHandlerCityById(id);
    console.log(`Förfrågan 5: Malmö med id ${id}`);
    console.log(resource);
}


async function GETHandlerSearchCities(text) {
    const response = await fetch(`http://localhost:8000/cities/search?text=${text}`);
    const allCitiesWithText = await response.json();
    return allCitiesWithText;
}

async function GETDriverSearchCities(text) {
    const resource = await GETHandlerSearchCities(text);
    console.log("Förfrågan 6: Städer som innehåller 'en'");
    console.log(resource);
}


async function GETHandlerSearchCitiesWithCountry(text, country) {
    const response = await fetch(`http://localhost:8000/cities/search?text=${text}&country=${country}`);
    const allCitiesWithTextAndCountry = await response.json();
    return allCitiesWithTextAndCountry;
}

async function GETDriverSearchCitiesWithCountry(text, country) {
    const resource = await GETHandlerSearchCitiesWithCountry(text, country);
    console.log("Förfrågan 7: Städer som uppfyller både text och land");
    console.log(resource);
}




fetch("http://localhost:8000/cities", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
        name: "Dresden",
        country: "Germany"
    })
})
    .then((response) => {
        console.log("Förfrågan 8: Dresden finns redan i listan");
        return response.text();
    });


fetch("http://localhost:8000/cities", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
        name: "Ystad"
    })
})
    .then((response) => {
        console.log("Förfrågan 9: För att lägga till Ystad måste du ange ett land också");
        return response.text();
    });


fetch("http://localhost:8000/cities", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: 56 })
})
    .then((response) => {
        console.log("Förfrågan 10: Du försöker ta bort en stad som inte finns i listan");
        return response.text();
    });


fetch("http://localhost:8000/cities", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({})
})
    .then((response) => {
        console.log("Förfrågan 11: Du försöker ta bort utan att ange ett id");
        return response.text();
    });


fetch("http://localhost:8000/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
        from: 2,
        to: 1,
        password: "pass"
    })
})
    .then((response) => {
        console.log("Förfrågan 12: POST till ogiltig endpoint /messages");
        return response.text();
    });


fetch("http://localhost:8000/cities/search")
    .then((response) => {
        console.log("Förfrågan 13: Sökning utan text-param");
        return response.text();
    });


fetch("http://localhost:8000/mordor", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({})
})
    .then((response) => {
        console.log("Förfrågan 14: DELETE till ogiltig endpoint /mordor");
        return response.text();
    });