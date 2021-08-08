if (location.protocol !== 'https:' && !location.href.includes("localhost")) {
  location.replace(`https:${location.href.substring(location.protocol.length)}`);
}

window.addEventListener('scroll', () => {
  const sections = document.querySelectorAll('.myd_fade')
  const position = window.innerHeight
  for (section of sections) {
    if (section.getBoundingClientRect().top / 0.7 < position) {
      section.classList.add('myd_active')
    } else if (section.getBoundingClientRect().top / 0.5 > position) {
      section.classList.remove('myd_active')
    }
  }
})

const aboutButton = document.querySelector('#about-button')
const aboutSection = document.querySelector('#about-section')
aboutSection.classList.add('hidden')
aboutButton.addEventListener('click', () => {
  aboutSection.classList.toggle('hidden')
})

function setCookie (name, value) {
  const YEAR = 60 * 60 * 24 * 365
  document.cookie = `${name}=${value}; max-age=${YEAR}; path=/`
}

function getCookies(name='') {
  let cookies = {}
  for(cookie of document.cookie.split(';')) {
    let [key, value] = cookie.split('=')
    cookies[key] = value
  }
  if(name) {
    // return value if cookie exist, return undefined otherwise
    return Object.keys(cookies).includes(name) ? cookies[name] : undefined
  }
  return cookies
}

if(getCookies("selectedLanguage") === undefined) {
  setCookie('selectedLanguage', 'en')
}

const languagePicker = document.querySelector('#language-picker-select')
languagePicker.addEventListener('change', () => {
  const selectedLanguage = languagePicker.selectedOptions[0].getAttribute('lang')
  setCookie('selectedLanguage', selectedLanguage)
  window.location.reload();
})
