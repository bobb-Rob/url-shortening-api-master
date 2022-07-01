/* eslint-disable no-useless-escape */

import logoBottom from '../images/logo-bottom.svg';
import logo from '../images/logo.svg';
import illustrationImg from '../images/illustration-working.svg';
import hamburger from '../images/menu-icon.svg';
import iconBrandRecog from '../images/icon-brand-recognition.svg';
import iconDetailedRecords from '../images/icon-detailed-records.svg';
import iconFullyCustomizable from '../images/icon-fully-customizable.svg';
import uniqid from 'uniqid';
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
            <button type="button" id='${uniqid()}' class="btn btn-copy">Copy</button>
          </div>          
  </li> `;
  document.querySelector('.link-result').insertAdjacentHTML('beforeend', element);
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

const copyShortLink = (targetBtn,shortlink) => {   
    const input = document.createElement('input');
    input.type = 'text';
    input.value = shortlink;
    console.log(input.value)
    input.select();
    input.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(input.value);

    const allCopyBtn = document.querySelectorAll('.btn-copy');
    allCopyBtn.forEach((button) => {
        button.classList.remove('copied');
        button.textContent = 'Copy';
        if(button.id === targetBtn.id){
          button.classList.add('copied');
          button.textContent = 'Copied!';  
        }
    })
          
}

const attachedCopyEvent = () => {
    const allCopyBtn = document.querySelectorAll('.btn-copy');
    allCopyBtn.forEach((button) => {
        button.addEventListener('click', (e) => {
            const button = e.target;
            const shortlink = button.previousElementSibling.textContent;
            console.log(shortlink.textContent)
            copyShortLink(button, shortlink)
        })
    })
    
    
}


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
        return res;
      }).then((response) => {
        attachedCopyEvent();
        return response;
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

