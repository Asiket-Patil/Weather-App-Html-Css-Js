const inputBox = document.querySelector("#search");
const searchBtn = document.querySelector("#btn");
const text = document.querySelector("#text");
const temp = document.querySelector("#temp");
const humidity = document.querySelector("#humidity");
const wind = document.querySelector("#wind");
const description = document.querySelector("#description");
const error = document.querySelector(".error");
const adjust = document.querySelector(".adjust");

let countries = [];
const list = document.querySelector(".list");
const input = document.querySelector("#search");

async function fetchCountries() {
    try {
        const response = await fetch("https://restcountries.com/v3.1/all");
        const data = await response.json();
        countries = data.map((x) => x.name.common);
        countries.sort();
    } catch (error) {
        console.error("Error fetching countries:", error);
    }
}

function loadData(countries, list) {
    if (countries) {
        list.innerHTML = "";
        countries.forEach((item) => {
            const li = document.createElement("li");
            li.textContent = item;
            list.appendChild(li);

            li.addEventListener("click", function () {
                input.value = item;
                list.innerHTML = "";
            });
        });
    }
}

function filterData(countries, searchText) {
    return countries.filter((x) =>
        x.toLowerCase().startsWith(searchText.toLowerCase())
    );
}

fetchCountries();

let Visible = false;

input.addEventListener("click", function () {
    if (!Visible) {
        loadData(countries, list);
        Visible = true;
    }
});

input.addEventListener("input", function () {
    const searchText = input.value.trim();
    const filteredData = filterData(countries, searchText);
    loadData(filteredData, list);
    Visible = false;
});

async function checkWeather(city) {
    const API_KEY = "c4dfc05553f7741e31c63b7996e07415";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        

        if (response.ok) {
            error.style.display = "none";
            adjust.style.display = "flex";

            temp.innerHTML = `${data.main.temp} °C`;
            text.innerHTML = `Weather in ${inputBox.value}`;
            description.innerHTML = `${data.weather[0].description}`;
            humidity.innerHTML = `Humidity ${data.main.humidity} %`;
            wind.innerHTML = `Wind speed ${data.wind.speed} Km/H`;
        } else {
            error.style.display = "flex";
            adjust.style.display = "none";
        }
    } catch (error) {
        console.error("Error !! something went wrong:", error);
        error.style.display = "flex";
        adjust.style.display = "none";
    }
}

searchBtn.addEventListener("click", () => {
    checkWeather(inputBox.value);
});
