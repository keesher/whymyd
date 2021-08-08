"use strict";

const toggleVisibility = function () {
  const selParent = document.querySelector(arguments[0]);
  if (selParent.classList.contains("menu-show")) {
    selParent.classList.remove("menu-show");
  } else {
    selParent.classList.add("menu-show");
  }
};

const menu = document.querySelector("#mobile");
menu.addEventListener("click", function () {
  toggleVisibility("#fmb-ctnr-wide-menu");
  if (document.querySelector("#show-lang-submenu").classList.contains("menu-show")) {
    toggleVisibility("#show-lang-submenu");
  }
});

const showLang = document.querySelector("#show-lang");
showLang.addEventListener("click", function () {
  toggleVisibility("#show-lang-submenu");
});

const globalMenu = document.querySelector("#fmb-ctnr-wide-menu");
for (let i = 0; i < globalMenu.children.length; i++) {
  let child = globalMenu.children[i];
  if (child.hasAttribute("to")) {
    child.addEventListener("click", function (evt) {
      window.location = child.attributes.to.value;
    });
  }
}
