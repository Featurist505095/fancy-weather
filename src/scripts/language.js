export default class Language {
  constructor(languages) {
    this.languages = languages;
    this.languageSets = [
      {
        feel: 'feel',
        wind: 'wind',
        humidity: 'humidity',
        longtitude: 'longtitude',
        latitude: 'latitude',
        search: 'search',
        searchCity: 'Search city'
      },
      {
        feel: 'ощущается',
        wind: 'ветер',
        humidity: 'влажность',
        longtitude: 'долгота',
        latitude: 'широта',
        search: 'поиск',
        searchCity: 'Найти город'
      },
      {
        feel: 'адчувацца',
        wind: 'вецер',
        humidity: 'вільготнасць',
        longtitude: 'даўгата',
        latitude: 'шырата',
        search: 'пошук',
        searchCity: 'Знайсці горад'
      }
    ];
  }

  setLanguage(language = 'en') {
    const currentLanguage = this.languages.indexOf(language);
    const feelDiv = document.querySelector('.weather-feel');
    const feelInside = document.querySelector('.weather-feel span').innerHTML;
    const windDiv = document.querySelector('.weather-wind');
    const windInside = document.querySelector('.weather-wind span').innerHTML;
    const humidityDiv = document.querySelector('.weather-humidity');
    const humidityInside = document.querySelector('.weather-humidity span')
      .innerHTML;
    const latitudeDiv = document.querySelector('.latitude');
    const latitudeInside = document.querySelector('.latitude span').innerHTML;
    const longtitudeDiv = document.querySelector('.longtitude');
    const longtitudeInside = document.querySelector('.longtitude span')
      .innerHTML;
    const searchButton = document.querySelector('.search-button');
    const searchInput = document.querySelector('.search-input');

    feelDiv.innerHTML = `${this.languageSets[currentLanguage].feel}: <span>${feelInside}</span>`;
    windDiv.innerHTML = `${this.languageSets[currentLanguage].wind}: <span>${windInside}</span>`;
    humidityDiv.innerHTML = `${this.languageSets[currentLanguage].humidity}: <span>${humidityInside}</span>`;
    latitudeDiv.innerHTML = `${this.languageSets[currentLanguage].latitude}: <span>${latitudeInside}</span>`;
    longtitudeDiv.innerHTML = `${this.languageSets[currentLanguage].longtitude}: <span>${longtitudeInside}</span>`;
    searchButton.innerHTML = `${this.languageSets[currentLanguage].search}`;
    searchInput.setAttribute(
      'placeholder',
      this.languageSets[currentLanguage].searchCity
    );
  }
}
