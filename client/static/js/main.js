"use strict";

if (location.protocol !== "https:" && !location.href.includes("localhost")) {
  location.replace(`https:${location.href.substring(location.protocol.length)}`);
}

const floatingMenuBar = document.querySelector(".hide-on-scroll");
let prevScrollPos = window.pageYOffset;

const btn_scrollToTop = document.querySelector("#myd_button-scrolltotop");
let isScrolling;
let isGlobalMenuHidden;

window.addEventListener("scroll", () => {
  let navbar_height = document.querySelector(".navbar").offsetHeight;
  const sections = document.querySelectorAll(".myd_fade");
  const position = window.innerHeight;
  for (let section of sections) {
    if (section.getBoundingClientRect().top / 0.7 < position) {
      section.classList.add("myd_active");
    } else if (section.getBoundingClientRect().top / 0.5 > position) {
      section.classList.remove("myd_active");
    }
  }

  let currentScrollPos = window.pageYOffset;
  if (prevScrollPos > currentScrollPos) {
    floatingMenuBar.style.top = `0px`;
    isGlobalMenuHidden = false;
  } else {
    floatingMenuBar.style.top = `-${navbar_height}px`;
    isGlobalMenuHidden = true;
  }

  prevScrollPos = currentScrollPos;

  if (window.pageYOffset > 300) {
    btn_scrollToTop.style.bottom = `2rem`;
  } else {
    btn_scrollToTop.style.bottom = `-3rem`;
  }

  window.clearTimeout(isScrolling);
  isScrolling = setTimeout(function () {
    showGlobalMenu();
  }, 700);
});

const showGlobalMenu = function () {
  if (isGlobalMenuHidden) {
    floatingMenuBar.style.top = `0px`;
    isGlobalMenuHidden = false;
  }
};

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
  for (let cookie of document.cookie.split(";")) {
    let [key, value] = cookie.split("=");
    cookies[key.trim()] = value.trim();
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

const languagePicker = document.querySelector("#language-picker-select");
languagePicker.addEventListener("change", () => {
  const selectedLanguage = languagePicker.selectedOptions[0].getAttribute("lang");
  setCookie("selectedLanguage", selectedLanguage);
  window.location.reload();
});

btn_scrollToTop.addEventListener("click", function () {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
});

// show popup at startup
let recruitment_popup_cookie = getCookies("recruitment_popup");
let recruitment_modal = new bootstrap.Modal(document.getElementById("recruitment_modal"));
let btn_doNotShow = document.querySelector("#recruitment_modal_donotshow");

/** do not show again checkbox action */
btn_doNotShow.addEventListener("change", function () {
  setCookie("recruitment_popup", 1);

  if (this.checked) {
    setCookie("recruitment_popup", 0);
  }
});

// if cookie is set
if (typeof recruitment_popup_cookie !== "undefined") {
  // 0 or 1
  recruitment_popup_cookie = parseInt(recruitment_popup_cookie);
  // has cookie but enabled to show
  if (recruitment_popup_cookie) {
    recruitment_modal.show();
  }
} else {
  setCookie("recruitment_popup", 1);
  recruitment_modal.show();
}
