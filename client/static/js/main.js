if (location.protocol !== "https:" && !location.href.includes("localhost")) {
  location.replace(`https:${location.href.substring(location.protocol.length)}`);
}

let prevScrollPos = window.pageYOffset;
const floatingMenuBar = document.querySelector("#fmb-ctnr");
let toggleMenuOnScroll = true;

window.addEventListener("load", function () {
  if (window.innerWidth > 670) {
    toggleMenuOnScroll = true;
  } else {
    toggleMenuOnScroll = false;
  }
});

window.addEventListener("scroll", () => {
  const sections = document.querySelectorAll(".fade");
  const position = window.innerHeight;
  for (section of sections) {
    if (section.getBoundingClientRect().top / 0.7 < position) {
      section.classList.add("active");
    } else if (section.getBoundingClientRect().top / 0.5 > position) {
      section.classList.remove("active");
    }
  }

  if (toggleMenuOnScroll) {
    let currentScrollPos = window.pageYOffset;
    if (prevScrollPos > currentScrollPos) {
      floatingMenuBar.style.top = "0";
    } else {
      floatingMenuBar.style.top = "-54px";
    }

    prevScrollPos = currentScrollPos;
  }
});

window.addEventListener("resize", function () {
  if (window.innerWidth > 670) {
    toggleMenuOnScroll = true;
  } else {
    toggleMenuOnScroll = false;
  }
});

const aboutButton = document.querySelector("#about-button");
const aboutSection = document.querySelector("#about-section");
aboutSection.classList.add("hidden");
aboutButton.addEventListener("click", () => {
  aboutSection.classList.toggle("hidden");
});

function setCookie(name, value) {
  const YEAR = 60 * 60 * 24 * 365;
  document.cookie = `${name}=${value}; max-age=${YEAR}; path=/`;
}

function getCookies(name = "") {
  let cookies = {};
  for (cookie of document.cookie.split(";")) {
    let [key, value] = cookie.split("=");
    cookies[key] = value;
  }
  if (name) {
    // return value if cookie exist, return undefined otherwise
    return Object.keys(cookies).includes(name) ? cookies[name] : undefined;
  }
  return cookies;
}

if (getCookies("selectedLanguage") === undefined) {
  setCookie("selectedLanguage", "en");
}

const languagePicker = document.querySelectorAll(".select-lang");
languagePicker.forEach((item) => {
  item.addEventListener("click", (evt) => {
    const selectedLanguage = evt.target.attributes.lang.value;
    setCookie("selectedLanguage", selectedLanguage);
    location.reload();
  });
});
