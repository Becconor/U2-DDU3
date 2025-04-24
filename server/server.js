const cities = [
    { id: 2, name: "Lille", country: "France" },
    { id: 3, name: "Nantes", country: "France" },
    { id: 5, name: "Bremen", country: "Germany" },
    { id: 10, name: "Dresden", country: "Germany" },
    { id: 11, name: "Heidelberg", country: "Germany" },
    { id: 12, name: "Venice", country: "Italy" },
    { id: 13, name: "Rome", country: "Italy" },
    { id: 16, name: "Graz", country: "Austria" },
    { id: 20, name: "Basel", country: "Switzerland" },
    { id: 21, name: "Lucerne", country: "Switzerland" },
    { id: 22, name: "Kraków", country: "Poland" },
    { id: 23, name: "Warsaw", country: "Poland" },
    { id: 24, name: "Poznań", country: "Poland" },
    { id: 28, name: "Ghent", country: "Belgium" },
    { id: 31, name: "Maastricht", country: "Netherlands" },
    { id: 38, name: "Maribor", country: "Slovenia" },
    { id: 42, name: "Strasbourg", country: "France" },
];

async function handler(request) {
    const url = new URL(request.url);

    const headers = new Headers();
    headers.set("Access-Control-Allow-Origin", "*");
    headers.set("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
    headers.set("Access-Control-Allow-Headers", "Content-Type");
    headers.set("Content-Type", "application/json");

    if (request.method == "OPTIONS") {
        return new Response(null, { headers: headers });
    }

    if (request.method == "GET") {
        if (url.pathname == "/cities") {
            return new Response(JSON.stringify(cities), {
                status: 200,
                headers: headers
            });
        }

        if (url.pathname == "/cities/search") {
            const textValue = url.searchParams.get("text");

            if (!textValue) {
                return new Response(JSON.stringify("Sökparametern text finns inte med!"), {
                    status: 400,
                    headers: headers
                });
            }

            if (url.searchParams.has("text") && url.searchParams.has("country")) {
                const countryValue = url.searchParams.get("country");
                let includeBothValues = [];

                for (let city of cities) {
                    if (city.name.includes(textValue) && city.country == countryValue) {
                        includeBothValues.push(city);
                    }
                }

                return new Response(JSON.stringify(includeBothValues), {
                    status: 200,
                    headers: headers
                });
            }

            if (url.searchParams.has("text")) {
                const textValue = url.searchParams.get("text");
                let includeTextValue = [];

                for (let city of cities) {
                    if (city.name.includes(textValue)) {
                        includeTextValue.push(city);
                    }
                }

                return new Response(JSON.stringify(includeTextValue), {
                    status: 200,
                    headers: headers
                });
            }
        }

        const route = new URLPattern({ pathname: "/cities/:id" });
        const match = route.exec(url);

        if (match) {
            const id = Number(match.pathname.groups.id);

            for (let city of cities) {
                if (city.id == id) {
                    return new Response(JSON.stringify(city), {
                        status: 200,
                        headers: headers,
                    })
                }
            }

            return new Response(JSON.stringify("Det finns ingen stad med det id:et"), {
                status: 404,
                headers: headers
            });
        }
    }

    if (request.method == "POST") {
        if (url.pathname == "/cities") {
            const inputBody = await request.json();
            const inputName = inputBody.name;
            const inputCountry = inputBody.country;
            let counter = 0;

            if (!inputName || !inputCountry) {
                return new Response(JSON.stringify("Stad eller Land är saknas!"), {
                    status: 400,
                    headers: headers
                });
            }

            for (let city of cities) {
                if (city.name == inputName) {
                    return new Response(JSON.stringify("Staden finns redan i listan!"), {
                        status: 409,
                        headers: headers
                    })
                }

                if (city.id > counter) {
                    counter = city.id;
                }
            }

            let newCity = {
                id: counter + 1,
                name: inputName,
                country: inputCountry
            };

            cities.push(newCity);

            return new Response(JSON.stringify(newCity), {
                status: 200,
                headers: headers,
            });
        }
    }

    if (request.method == "DELETE") {
        if (url.pathname == "/cities") {
            const body = await request.json();
            const cityId = Number(body.id);

            if (!cityId) {
                return new Response(JSON.stringify("Id saknas!"), {
                    status: 400,
                    headers: headers
                });
            }

            for (let i = 0; i < cities.length; i++) {
                if (cityId == cities[i].id) {
                    cities.splice(i, 1);

                    return new Response(JSON.stringify("Delete ok!"), {
                        status: 200,
                        headers: headers
                    })
                }
            }

            return new Response(JSON.stringify("Det finns ingen stad med detta id:et!"), {
                status: 404,
                headers: headers
            });
        }
    }

    return new Response(JSON.stringify("Felaktig endpoint!"), {
        status: 400,
        headers: headers,
    });
}

Deno.serve(handler);