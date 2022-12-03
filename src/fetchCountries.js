import { Notify } from 'notiflix/build/notiflix-notify-aio';

export function fetchCountries(name) {
  return (
    fetch(`https://restcountries.com/v3.1/name/${name}`)
      .then(response => {
        if (!response.ok) {
          return Notify.failure('Oops, there is no country with that name');
        }

        return response.json();
      })
      // .then(value => {
      //   console.log(value);
      // })
      .catch(error => {
        Notify.failure('Oops, there is no country with that name');
      })
  );
}
