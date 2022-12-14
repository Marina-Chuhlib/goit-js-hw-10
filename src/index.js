import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const debounce = require('lodash.debounce');
const DEBOUNCE_DELAY = 300;

const getCountryListMarkup = ({ flags, name }) => {
  return `
  <li class="country-list__item">
  <img  class="img" src = "${flags.svg}" alt = "${name.official}" width ="70" hight="50">
  <p>${name.official}</p>
  </li>
  `;
};

const getCountryMarkup = ({ flags, name, capital, population, languages }) => {
  return `<div class = "title">
  <img class="img" src = "${flags.svg}" alt = "${
    name.official
  }" width ="70" hight=""50>
  <h1>${name.official}</h1></div>
  <p>Capital: <b>${capital}</b></p>
  <p>Population: <b>${population}</b> </p>
  <p>Languages: <b>${Object.values(languages)}</b></p>
  `;
};

const refs = {
  input: document.querySelector('#search-box'),
  countriesList: document.querySelector('.country-list'),
  countryInfoBox: document.querySelector('.country-info'),
};

let inputValue = [];

function onResetValue() {
  refs.countryInfoBox.innerHTML = '';
  refs.countriesList.innerHTML = '';
}

function createInterface(ref, elem) {
  ref.insertAdjacentHTML('beforeend', elem.join(''));
}

const onSearchInput = e => {
  inputValue = e.target.value.trim();

  onResetValue();

  if (!inputValue) {
    return;
  }

  fetchCountries(inputValue)
    .then(response => {
      if (response.length > 10) {
        return Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      }

      if (response.length === 1) {
        const countryBox = response.map(getCountryMarkup);

        refs.countriesList.innerHTML = '';

        return createInterface(refs.countryInfoBox, countryBox);
        // return refs.countryInfoBox.insertAdjacentHTML(
        //   'beforeend',
        //   countryBox.join('')
        // );
      }

      const countriesList = response.map(getCountryListMarkup);

      refs.countryInfoBox.innerHTML = '';

      createInterface(refs.countriesList, countriesList);
      // refs.countriesList.insertAdjacentHTML(
      //   'beforeend',
      //   countriesList.join('')
      // );
    })
    .catch(error => {
      Notify.failure('Oops, there is no country with that name');
    });
};

refs.input.addEventListener('input', debounce(onSearchInput, DEBOUNCE_DELAY));
