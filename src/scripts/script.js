import Location from './location';
import Background from './background';
import Time from './time';
import Weather from './weather';
import Language from './language';

class Search {
  constructor() {
    this.apiKeyLocation = '2a4d4dfb92e136';
    this.apiKeyMap =
      'pk.eyJ1IjoiZmVhdHVyaXN0NTA1MDk1IiwiYSI6ImNrYXBvazRzbTBmZGgzMHFuM3ZwZHVkcTYifQ.VBLvZx74fC__9nAL_m7tLw';
    this.apiKeyPicture =
      '877b54221588186a14b2315eee9944f9d33ea1244bdcf2522e03ac224b8361b5';
    this.apiKeyWeather = '37a504ca84ad41b8a4dd5cc52a3993bd';
    this.apiKeyAnyLocation = 'fe7ba0228d7b46b18923874c0782eea6';
    this.languages = ['en', 'ru', 'by'];
    this.weather = new Weather(this.apiKeyWeather, this.languages);
    this.background = new Background(this.apiKeyPicture);
    this.location = new Location(
      this.apiKeyLocation,
      this.apiKeyMap,
      this.apiKeyAnyLocation,
      this.languages
    );
    this.time = new Time();
    this.language = new Language(this.languages);
    this.city = {};
    //https://api.opencagedata.com/geocode/v1/json?q=Izhevsk&key=fe7ba0228d7b46b18923874c0782eea6
  }

  async initialize() {
    this.city = await this.location.getCurrentLocationData();
    this.background.getNewBackGround();
    this.timerID = this.time.addTimer(this.city.timezone);
    this.time.addCurrentData();
    this.weather.getWeather(this.city.name);
    this.language.setLanguage();
    this.addRefreshBackGround();
    this.addChangeDegreeMeasure();
    this.addChangeLanguage();
    this.findNewCityData();
  }

  addRefreshBackGround() {
    const refreshButton = document.querySelector('.refresh');

    refreshButton.addEventListener('click', () => {
      this.background.getNewBackGround();
    });
  }

  addChangeDegreeMeasure() {
    const degrees = document.querySelector('.degrees');

    degrees.addEventListener('click', event => {
      const degreesTargets = document.querySelectorAll('.degrees div');
      const degreeMeasure = event.target.innerHTML;
      degreesTargets.forEach(item => {
        item.classList.remove('selected');
      });
      event.target.classList.add('selected');

      this.weather.toggleDegrees(degreeMeasure);
    });
  }

  addChangeLanguage() {
    const language = document.querySelector('.languages .current');
    const languages = document.querySelector('.languages');
    const languagesList = document.querySelectorAll('.languages li');

    language.addEventListener('click', () => {
      languagesList.forEach((item, i) => {
        if (i) {
          item.classList.toggle('selected');
          item.classList.toggle('disable');
        }
      });
    });

    languages.addEventListener('click', event => {
      const languagesList = document.querySelectorAll('.languages li');

      if (event.target.classList.contains('selected')) {
        language.innerHTML = event.target.innerHTML;

        languagesList.forEach((item, i) => {
          if (i) {
            item.classList.toggle('selected');
            item.classList.toggle('disable');
          }
        });

        this.location.changeLanguage(language.innerHTML);
        this.language.setLanguage(language.innerHTML);
        this.weather.setWeatherDescription(language.innerHTML);
        this.time.addCurrentData();
        this.time.updateWeekDays();
      }
    });
  }

  async findNewCityData() {
    const searchInput = document.querySelector('.search-input');
    const searchButton = document.querySelector('.search-button');

    searchButton.addEventListener('click', async () => {
      this.city = await this.location.getNewCityData(searchInput.value);
      if (this.city !== false) {
        this.background.getNewBackGround();
        clearInterval(this.timerID);
        this.time.addTimer(this.city.timezone);
        this.time.addCurrentData();
        this.weather.getWeather(this.city.name);
      }
    });

    document.addEventListener('keyup', async event => {
      if (event.code === 'Enter') {
        this.city = await this.location.getNewCityData(searchInput.value);
        if (this.city !== false) {
          this.background.getNewBackGround();
          clearInterval(this.timerID);
          this.time.addTimer(this.city.timezone);
          this.time.addCurrentData();
          this.weather.getWeather(this.city.name);
        }
      }
    });
  }
}

export default function() {
  const search = new Search();

  search.initialize();
}
