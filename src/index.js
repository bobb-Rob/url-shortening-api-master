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




const fetchLink = async (url) => {
  const response = await fetch(url);
  return response.json();
};
const url = `https://api.shrtco.de/v2/shorten?url=${'https://www.udemy.com/course/react-the-complete-guide-incl-redux/learn/lecture/25597250#overview'}`

fetchLink(url).then(res => {
    console.log(res)
})