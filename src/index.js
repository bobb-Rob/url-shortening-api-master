/* eslint-disable no-useless-escape */

import uniqid from 'uniqid';
import insertImages from './modules/images.js';
import './style/style.css';
import './style/headline.css';
import './style/statistic.css';
import './style/link.css';

insertImages();

const linkCard = (longlink, shortlink) => {
  const element = `
  <li class="link-card">
          <span class="long-link">${longlink}</span>
          <div>
            <span class="short-link">${shortlink}</span>
            <button type="button" id='${uniqid()}' class="btn-copy">Copy</button>
          </div>          
  </li> `;
  document.querySelector('.link-result').insertAdjacentHTML('beforeend', element);
};

const insertloading = () => {
  const element = `
    <div class='loader-wrapper'>
      <div class="loader"></div>
    </div>`;
  document.querySelector('.link-result').insertAdjacentHTML('beforeend', element);
};

const failedToFetcherrorMessage = () => {
  const element = `
    <div class='error-modal'>
    <div class='error-pop-up'>
        <h3>Error</h3>
        <span>Failed to fetch short link:</span> <br>
        <span>Please try again</span> <br>
        <button type='button' class='btn error-ok-btn'>OK</button>
    </div>
  </div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', element);
};

const errorOkBtnEvent = () => {
  document.querySelector('.error-ok-btn').addEventListener('click', () => {
    document.querySelector('.error-modal').remove();
  });
};

const removeloading = () => document.querySelector('.loader-wrapper').remove();

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

const copyShortLink = (targetBtn, shortlink) => {
  const input = document.createElement('input');
  input.type = 'text';
  input.value = shortlink;
  input.select();
  input.setSelectionRange(0, 99999);
  navigator.clipboard.writeText(input.value);

  const allCopyBtn = document.querySelectorAll('.btn-copy');
  allCopyBtn.forEach((button) => {
    button.classList.remove('copied');
    button.textContent = 'Copy';
    if (button.id === targetBtn.id) {
      button.classList.add('copied');
      button.textContent = 'Copied!';
    }
  });
};

const attachedCopyEvent = () => {
  const allCopyBtn = document.querySelectorAll('.btn-copy');
  allCopyBtn.forEach((button) => {
    button.addEventListener('click', (e) => {
      const button = e.target;
      const shortlink = button.previousElementSibling.textContent;
      copyShortLink(button, shortlink);
    });
  });
};

const getShortLink = (e) => {
  e.preventDefault();
  const baseUrl = (url) => `https://api.shrtco.de/v2/shorten?url=${url}`;

  const linkInput = document.querySelector('#link-input');
  const longlink = linkInput.value;

  if (longlink !== '') {
    if (isValidURL(longlink)) { // Check if supplied link is a valid url
      const url = baseUrl(longlink);
      insertloading();
      fetchLink(url).then((res) => {
        if (res.ok) {
          removeloading();
          linkCard(longlink, res.result.short_link);
          linkInput.value = '';
        } else {
          setTimeout(() => {
            removeloading();
            failedToFetcherrorMessage();
            errorOkBtnEvent();
          }, 4000);
        }
        return res;
      }).then((response) => {
        attachedCopyEvent();
        return response;
      }).catch(() => {
        failedToFetcherrorMessage();
        errorOkBtnEvent();
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

const hamburgerBtn = document.querySelector('.hamburger-btn');
hamburgerBtn.addEventListener('click', () => {
  const menu = document.querySelector('#mobile-menu');
  menu.classList.add('active');
});

const menuClose = document.querySelector('.menu-close-icon');
menuClose.addEventListener('click', () => {
  const menu = document.querySelector('#mobile-menu');
  menu.classList.remove('active');
});
