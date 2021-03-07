// I began this exercise using React but after back to read
// the requirements I saw that yours want in this exercise
// JS HTML and CSS, so I made it with Vanilla JS

// Define some constants
const loadButton = document.querySelector(".button__load");
const searchBox = document.querySelector(".search__input");
const radios = document.getElementsByClassName("custom-control-input");

//var for pagination
var numPage = 1;

//This function trigger the data's load on the load button
loadButton.onclick = function () {
  getData(numPage);
};

//Handlers for the search box
searchBox.onkeydown = searchBox.onkeyup = searchBox.onkeypress = checkLetter;

// this function disable the load button
function desactiveButton() {
  loadButton.innerHTML = "There is not more to show";
  loadButton.setAttribute("disabled", "");
}

//this return the visibility of the card's planet
function resetVisibility() {
  let columns = document.querySelectorAll(".col");
  for (let index = 0; index < columns.length; index++) {
    let el = columns[index];
    el.classList.remove("d-none");
  }
}
//this change the placeholder prop input on the change of the radios
function changePlaceholder() {
  for (let index = 0; index < radios.length; index++) {
    let el = radios[index];
    el.addEventListener("change", function () {
      let name = el.nextSibling.nextSibling.textContent;
      searchBox.setAttribute("placeholder", "Search by " + name);
    });
  }
}

//Detects which radios is checked
function whoisChecked() {
  for (let index = 0; index < radios.length; index++) {
    let element = radios[index];
    if (element.checked) {
      let nameElement = element.getAttribute("data-js");
      return nameElement;
    }
  }
}

// this gets the events and the input's value and compares them
function checkLetter(ev) {
  let nameElement = whoisChecked();
  resetVisibility();
  let letter = ev.target.value;

  planetTarget = document.querySelectorAll(
    "[data-js-value='" + nameElement + "']"
  );

  let planetsVisible = [];
  let planetsNoVisible = [];

  for (let index = 0; index < planetTarget.length; index++) {
    let element = planetTarget[index];
    let parent =
      element.parentElement.parentElement.parentElement.parentElement;

    //this separates those that are equals and those that are not
    let text = element.textContent;
    if (text.indexOf(letter) === -1) {
      planetsNoVisible.push(parent);
    } else {
      planetsVisible.push(parent);
    }
  }

  for (let index = 0; index < planetsNoVisible.length; index++) {
    let element = planetsNoVisible[index];
    element.classList.add("d-none");
  }
  for (let index = 0; index < planetsVisible.length; index++) {
    let element = planetsVisible[index];
    element.classList.remove("d-none");
  }
}

//creates each planet and props
function eachPlanet(index, { ...res }) {
  let col = document.createElement("div");
  let planet = document.createElement("div");
  let body = document.createElement("div");
  let planetList = document.createElement("ul");
  let textName = document.createElement("h5");

  col.className = "col mb-4";
  col.setAttribute("id", index);
  planet.className = "card planet";
  body.className = "card-body";
  planetList.className = "list-group list-group-flush";

  textName.className = "card-title planet__title mb-0";
  textName.textContent = res.name;

  // Planet attributes
  body.appendChild(textName);

  const datos = { ...res };
  Object.entries(datos).forEach(([key, value]) => {
    const container = document.createElement("li");
    const label = document.createElement("strong");
    const pValue = document.createElement("span");

    container.className = "list-group-item planet__info-item";
    container.setAttribute("data-label-js", key);
    label.className = "planet__label";
    pValue.className = "planet__value";
    keyData = key.replace("_", "-");
    pValue.setAttribute("data-js-value", keyData);
    key = key.charAt(0).toUpperCase() + key.slice(1);
    key = key.replace("_", " ");
    label.textContent = key + ": ";
    pValue.textContent = value;
    container.append(label);
    container.append(pValue);
    planetList.append(container);
  });

  planet.appendChild(body);
  planet.appendChild(planetList);
  col.appendChild(planet);

  return col;
}
//Show the planets
function allPlanets(response) {
  let parent = document.querySelectorAll("[data-menu-js]")[0];
  response.forEach((res, index) => {
    let planet = eachPlanet(index, { ...res });
    parent.appendChild(planet);
  });
}
//Get the data
function getData(page) {
  //manage the paginations
  if (page) {
    var pageId = "?page=" + page;
  } else {
    var pageId = "?page=1";
  }
  let response = fetch("https://swapi.dev/api/planets/" + pageId)
    .then((response) => response.json())
    .then((data) => {
      allPlanets(data.results);
      numPage++;
    })
    .catch((error) => {
      switch (error.name) {
        case "TypeError":
          console.log(error);
          desactiveButton();
          break;
        default:
          console.log(error);
          break;
      }
    });
}
changePlaceholder();
getData();
