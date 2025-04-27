async function GETHandler() {
    const response = await fetch("http://localhost:8000/cities");
    if (!response.ok) {
        console.log("Någonting gick fel!");
    } else {
        const cityList = await response.json();
        console.log("Förfrågan 1: Alla städer");
        console.log(cityList);
        return cityList;
    }
}

async function POSTHandler() {
    const response = await fetch("http://localhost:8000/cities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: "Malmö",
            country: "Sweden"
        })
    });

    if (response.status == 200) {
        console.log("Förfrågan 2: Staden Malmö är tillagd i listan");
    }
}

async function DELETEHandler() {
    const response = await fetch("http://localhost:8000/cities", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: 2 })
    });

    if (response.status == 200) {
        console.log("Förfrågan 3: Staden med id 2 är borttagen från listan");

        await GETHandlerAllCities();
        await GETHandlerCityById(43);
        await GETHandlerSearchCities("en");
        await GETHandlerSearchCitiesWithCountry("en", "Sweden");
    }
}

async function GETHandlerAllCities() {
    const response = await fetch("http://localhost:8000/cities");

    if (response.status == 200) {
        console.log("Förfrågan 4: Array minus Lille pluss Malmö");
    }
}

async function GETHandlerCityById(id) {
    const response = await fetch(`http://localhost:8000/cities/${id}`);

    if (response.status == 200) {
        console.log(`Förfrågan 5: Malmö med id ${id}`);
    }
}

async function GETHandlerSearchCities(text) {
    const response = await fetch(`http://localhost:8000/cities/search?text=${text}`);

    if (response.status == 200) {
        console.log("Förfrågan 6: Städer som innehåller 'en'");
    }
}

async function GETHandlerSearchCitiesWithCountry(text, country) {
    const response = await fetch(`http://localhost:8000/cities/search?text=${text}&country=${country}`);

    if (response.status == 200) {
        console.log("Förfrågan 7: Städer som uppfyller både text och land");
    }
}


function f8() {
    fetch("http://localhost:8000/cities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: "Dresden",
            country: "Germany"
        })
    })
        .then((response) => {
            if (response.status == 409) {
                console.log("Förfrågan 8: Dresden finns redan i listan");
                f9();
            } else {
                console.log("Fel");
            }
        });
}

function f9() {
    fetch("http://localhost:8000/cities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: "Ystad"
        })
    })
        .then((response) => {
            if (response.status == 400) {
                console.log("Förfrågan 9: För att lägga till Ystad måste du ange ett land också");
                f10();
            } else {
                console.log("Fel");
            }
        });
}

function f10() {
    fetch("http://localhost:8000/cities", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: 56 })
    })
        .then((response) => {
            if (response.status == 404) {
                console.log("Förfrågan 10: Du försöker ta bort en stad som inte finns i listan");
                f11();
            } else {
                console.log("Fel");
            }
        });
}

function f11() {
    fetch("http://localhost:8000/cities", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({})
    })
        .then((response) => {
            if (response.status == 400) {
                console.log("Förfrågan 11: Du försöker ta bort utan att ange ett id");
                f12();
            } else {
                console.log("Fel");
            }
        });
}

function f12() {
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
            if (response.status == 400) {
                console.log("Förfrågan 12: POST till ogiltig endpoint /messages");
                f13();
            } else {
                console.log("Fel");
            }
        });
}

function f13() {
    fetch("http://localhost:8000/cities/search")
        .then((response) => {
            if (response.status == 400) {
                console.log("Förfrågan 13: Sökning utan text-param");
                f14();
            } else {
                console.log("Fel");
            }
        });
}

function f14() {
    fetch("http://localhost:8000/mordor", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({})
    })
        .then((response) => {
            if (response.status == 400) {
                console.log("Förfrågan 14: DELETE till ogiltig endpoint /mordor");
            } else {
                console.log("Fel");
            }
        });
}


async function testDriver() {
    await GETHandler();
    await POSTHandler();
    await DELETEHandler();
    f8();
}

testDriver();