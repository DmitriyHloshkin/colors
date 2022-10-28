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

  if (elem && elem.dataset.type === "link") {
    let hash, parent;
    const nameTag = elem.tagName.toLowerCase();

    switch (nameTag) {
      case "div":
        hash = elem.querySelector("color__hash").textContent;
        parent = elem.parentElement;
        break;

      case "span":
        hash = elem.nextElementSibling.textContent;
        parent = elem.parentElement.parentElement;
        break;
      
      default:
        hash = elem.textContent;
        parent = elem.parentElement.parentElement;
    }
    
    await copyHashColor(hash, parent);
  }

  if (elem && elem.dataset.type === "modal-close") {
      closeModal();
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

async function copyHashColor(hash, parent) {
  const luminate = chroma(hash).luminance() > 0.5 ? "black" : "white",
        elemLinkIsCopy = parent.querySelector(".color__copy-effect");

  let text = "Link is copy";
  elemLinkIsCopy.style.color = luminate;
  
  try {
    await navigator.clipboard.writeText(hash);
    elemLinkIsCopy.textContent = text;

  } catch (err) {
    text = "not copied";
    
  } finally {
    elemLinkIsCopy.textContent = text;
    elemLinkIsCopy.classList.add("color__copy-effect-active");
    setTimeout( () => {
      elemLinkIsCopy.classList.remove("color__copy-effect-active");
    }, 1000);
  }

}

function setColors(colors = []) {
  const colorsColumn = document.querySelectorAll(".color");

  colorsColumn.forEach((elem, index) => {
    const columnText = elem.querySelector(".color__hash"),
      hash = colors[index] ? colors[index] : generateColors(),
      lock = elem.querySelector(".color__lock-img"),
      iconLink = elem.querySelector(".icon-link");

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

    const luminate = chroma(hash).luminance() > 0.5 ? "black" : "white";

    lock.style.color        = luminate ;
    iconLink.style.color    = luminate;
    columnText.style.color  = luminate;

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

function showModal() {
  const modal = document.querySelector(".modal-instructions");

  const timerId = setTimeout( () => {
    modal.classList.add("modal-instructions_active");
  },1000);

}

function closeModal() {
  document.querySelector(".modal-instructions").classList.remove("modal-instructions_active");
}

setColors(getColors());
showModal();