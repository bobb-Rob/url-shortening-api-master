/* eslint-disable no-useless-escape */

import logoBottom from '../images/logo-bottom.svg';
import logo from '../images/logo.svg';
import illustrationImg from '../images/illustration-working.svg';
import hamburger from '../images/menu-icon.svg';
import iconBrandRecog from '../images/icon-brand-recognition.svg';
import iconDetailedRecords from '../images/icon-detailed-records.svg';
import iconFullyCustomizable from '../images/icon-fully-customizable.svg';
import './style/style.css';
import './style/headline.css';
import './style/statistic.css';
import './style/link.css';

const logoEl = document.querySelector('.logo');
logoEl.src = logo;

const bottomLogoEl = document.querySelector('.logo-bottom');
bottomLogoEl.src = logoBottom;

const hamburgerEl = document.querySelector('.hamburger');
hamburgerEl.src = hamburger;

const illustration = document.querySelector('.bg-illustration > img');
illustration.src = illustrationImg;

const allStatisticsIcons = document.querySelectorAll('.statistics-icon-wrapper > img');
const [icon1, icon2, icon3] = allStatisticsIcons;
icon1.src = iconBrandRecog;
icon2.src = iconDetailedRecords;
icon3.src = iconFullyCustomizable;

const linkCard = (longlink, shortlink) => {
  const element = `
  <li class="link-card">
          <span class="long-link">${longlink}</span>
          <div>
            <span class="short-link">${shortlink}</span>
            <button type="button" class="btn btn-close">Copy</button>
          </div>          
  </li> `;
  document.querySelector('.link-result').insertAdjacentHTML('afterbegin', element);
};

const insertErrorMsg = (msg) => {
  document.querySelector('.get-link-section')
    .insertAdjacentHTML('afterbegin', `<span class='invalid-url'>${msg}</span>`);
};

const fetchLink = async (url) => {
  const response = await fetch(url);
  return response.json();
};

const isValidURL = (urlString) => {
  const regexPattern = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/ig;
  return regexPattern.test(urlString);
};

const getShortLink = (e) => {
  e.preventDefault();
  const baseUrl = (url) => `https://api.shrtco.de/v2/shorten?url=${url}`;

  const linkInput = document.querySelector('#link-input');
  const longlink = linkInput.value;

  if (longlink !== '') {
    if (isValidURL(longlink)) { // Check if supplied link is a valid url
      const url = baseUrl(longlink);

      fetchLink(url).then((res) => {
        linkCard(longlink, res.result.short_link);
        linkInput.value = '';
      });
    } else {
      insertErrorMsg('Please add a valid link');
      linkInput.classList.toggle('red');
      linkInput.focus();
      setTimeout(() => {
        document.querySelector('.invalid-url').remove();
        linkInput.classList.toggle('red');
      }, 4000);
    }
  } else {
    insertErrorMsg('Please add a link');
    linkInput.classList.add('red');
    linkInput.focus();
    const inputEvent = () => {
      linkInput.classList.remove('red');
      linkInput.removeEventListener('input', inputEvent);
    };
    linkInput.addEventListener('input', inputEvent);
    setTimeout(() => {
      document.querySelector('.invalid-url').remove();
    }, 4000);
  }
};

const shortenBtn = document.querySelector('#url-form button');
shortenBtn.addEventListener('click', getShortLink);