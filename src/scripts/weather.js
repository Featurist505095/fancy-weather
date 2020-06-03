import Time from './time';

export default class Weather {
  constructor(apiKeyWeather) {
    this.apiKeyWeather = apiKeyWeather;
    this.time = new Time();
    this.languages = ['en', 'ru', 'be'];
    this.city = 'Moscow';
    this.absoluteZeroC = -273.15;
    this.absoluteZeroF = -459.67;
    this.degrees = [];
    this.wind = 0;
    this.anyLanguageData = [];
  }

  async getAnyLanguageWeather(city, language) {
    const url = `https://api.weatherbit.io/v2.0/forecast/daily?city=${city}&days=4&units=S&lang=${language}&key=${this.apiKeyWeather}`;

    const response = await fetch(url);
    const weather = await response.json();

    this.anyLanguageData[language] = weather.data;

    return weather;
  }

  async getWeather(city) {
    const weather = await this.getAnyLanguageWeather(city, 'en');
    this.languages.forEach(async (item, i) => {
      if (i) {
        await this.getAnyLanguageWeather(city, item);
      }
    });

    weather.data.forEach(item => {
      this.degrees.push(item.temp);
    });
    this.wind = weather.data[0].wind_spd;
    this.data = weather.data;

    this.addCurrentWeather(weather.data[0]);
    this.addFutureWeather(weather.data);
  }

  addCurrentWeather(day) {
    const temperatureDiv = document.querySelector('.temperature');
    const weatherTypeDiv = document.querySelector('.weather-type');
    const weatherFeelDiv = document.querySelector('.weather-feel span');
    const weatherWindDiv = document.querySelector('.weather-wind span');
    const weatherHumidityDiv = document.querySelector('.weather-humidity span');
    const weatherIconImg = document.querySelector('.current-weather-icon');

    temperatureDiv.innerHTML = `${(this.absoluteZeroC + day.temp).toFixed()}°`;
    weatherIconImg.setAttribute(
      'src',
      `https://www.weatherbit.io/static/img/icons/${day.weather.icon}.png`
    );
    weatherTypeDiv.innerHTML = `${day.weather.description}`;
    weatherFeelDiv.innerHTML = `${(
      this.absoluteZeroC +
      day.temp -
      day.wind_spd * 2
    ).toFixed()}°`;
    weatherWindDiv.innerHTML = `${day.wind_spd.toFixed()} m/s`;
    weatherHumidityDiv.innerHTML = `${day.rh}%`;
  }

  addFutureWeather(data, degreesMeasure) {
    data.forEach((item, i) => {
      if (i) {
        const nextDayNameDiv = document.querySelector(
          `.day-plus-${i} .next-day-name`
        );
        const nextDayWeatherDiv = document.querySelector(
          `.day-plus-${i} .next-day-weather-temperature`
        );
        const nextDayIconDiv = document.querySelector(
          `.day-plus-${i} .next-day-weather-icon`
        );
        const degree =
          degreesMeasure === 'F'
            ? (this.absoluteZeroF + (item.temp * 9) / 5).toFixed()
            : (this.absoluteZeroC + item.temp).toFixed();
        nextDayNameDiv.innerHTML = this.time.getWeekDay(i);
        nextDayWeatherDiv.innerHTML = `${degree}°`;
        nextDayIconDiv.setAttribute(
          'src',
          `https://www.weatherbit.io/static/img/icons/${item.weather.icon}.png`
        );
      }
    });
  }

  toggleDegrees(degreesMeasure) {
    const temperatureDiv = document.querySelector('.temperature');
    const weatherFeelDegreeDiv = document.querySelector('.weather-feel span');

    if (degreesMeasure === 'F') {
      temperatureDiv.innerHTML = `${(
        (this.degrees[0] * 9) / 5 +
        this.absoluteZeroF
      ).toFixed()}°`;
      weatherFeelDegreeDiv.innerHTML = `${(
        (this.degrees[0] * 9) / 5 +
        this.absoluteZeroF -
        this.wind * 2
      ).toFixed()}°`;
    } else {
      temperatureDiv.innerHTML = `${(
        this.degrees[0] + this.absoluteZeroC
      ).toFixed()}°`;
      weatherFeelDegreeDiv.innerHTML = `${(
        this.degrees[0] +
        this.absoluteZeroC -
        this.wind * 2
      ).toFixed()}°`;
    }

    this.addFutureWeather(this.data, degreesMeasure);
  }

  setWeatherDescription(language) {
    if (language === 'by') {
      language = 'be';
    }
    const weatherTypeDiv = document.querySelector('.weather-type');

    weatherTypeDiv.innerHTML = this.anyLanguageData[
      language
    ][0].weather.description;
  }
}
