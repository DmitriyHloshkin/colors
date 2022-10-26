'use strict';
window.addEventListener("keydown", event => {
  if (event.code.toLowerCase() === "space") {
    setColors();
  }
});

document.documentElement.addEventListener("click", async (event) => {
  const elem = event.target;

  if (elem && elem.dataset.type === "lock") {

    document.querySelectorAll("[data-type='lock']").forEach(elem => {
      elem.blur();
    });

    const imgLock = elem.tagName.toLowerCase() === "span" ? elem : elem.firstElementChild;
    imgLock.classList.toggle("icon-unlocked");
    imgLock.classList.toggle("icon-lock");

  }

  if (elem && elem.dataset.type === "text") {
    await copyHashColor(elem.textContent);
  }

});

function generateColors() {
  const colorsSembols = "0123456789ABCDEF";

  let hash = "";
  while (hash.length < 6) {
    let index = Math.floor(Math.random() * colorsSembols.length);
    hash += colorsSembols[index];
  }
  return hash;
}

async function copyHashColor(hash) {
  try {
    await navigator.clipboard.writeText(hash);
    console.log('hash страницы скопирован в буфер обмена');
  } catch (err) {
    console.error('Не удалось скопировать: ', err);
  }
}

function setColors(colors = []) {
  const colorsColumn = document.querySelectorAll(".color");

  colorsColumn.forEach((elem, index) => {
    const columnText = elem.querySelector(".color__hash"),
      hash = colors[index] ? colors[index] : generateColors(),
      lock = elem.querySelector(".color__lock-img");

    if (lock.classList.contains("icon-lock")) {
      if (!colors[index]) {
        colors.push(columnText.textContent.substring(1));
      }
      return;
    }

    if (!colors[index]) {
      colors.push(hash);
    }

    elem.style.background = "#" + hash;
    columnText.textContent = "#" + hash;

    const luminate = chroma(hash).luminance();

    lock.style.color = luminate > 0.5 ? "black" : "white";
    columnText.style.color = luminate > 0.5 ? "black" : "white";

  });

  setHashURI(colors);
  saveColorsInLocalStorage(colors);

}

function setHashURI(hash = []) {
  location.hash = hash.reduce((acc, elem) => {
    return `${acc}-${elem}`;
  });
}

function saveColorsInLocalStorage(hash) {
  hash.forEach((elem, index) => {
    localStorage.setItem(`color${++index}`, elem);
  });
}

function getColors() {
  if (location.hash) {
    return location.hash.substring(1)
      .split("-");
  }

  return Object.entries(JSON.parse(JSON.stringify(localStorage)))
    .sort((a, b) => +a[0].replace(/\D+/gi, "") - +b[0].replace(/\D+/gi, ""))
    .map(elem => elem[1]);
}

setColors(getColors());