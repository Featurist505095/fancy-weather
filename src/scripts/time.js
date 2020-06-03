export default class Time {
  constructor() {
    this.weekDays = {
      Monday: 'Панядзелак',
      Tuesday: 'Аўторак',
      Wednesday: 'Серада',
      Thursday: 'Чацвер',
      Friday: 'Пятніца',
      Saturday: 'Субота',
      Sunday: 'Нядзеля'
    };
    this.months = {
      January: 'Студзень',
      February: 'Люты',
      March: 'Сакавiк',
      April: 'Сакавiк',
      May: 'Травень',
      June: 'Чэрвень',
      July: 'Лiпень',
      August: 'Жнiвень',
      September: 'Верасень',
      October: 'Кастрычнiк',
      November: 'Лiстапад',
      December: 'Снежань'
    };
  }

  addTimer(timeZone) {
    return window.setInterval(() => {
      const now = new Date();
      const clock = document.querySelector('.timer');
      const options = {
        timeZone: timeZone
      };
      clock.innerHTML = now.toLocaleTimeString('ru', options);
    }, 1000);
  }

  addCurrentData() {
    const currentDay = new Date();
    const currentLanguage = document.querySelector('.languages .current')
      .innerHTML;
    const dateDiv = document.querySelector('.current-time');
    const language = currentLanguage === 'ru' ? 'ru' : 'en';

    if (currentLanguage !== 'by') {
      const options = {
        month: 'long',
        day: 'numeric',
        weekday: 'long'
      };

      dateDiv.innerHTML = `${currentDay.toLocaleDateString(
        language,
        options
      )} <span class="timer"></span>`;
    } else {
      const weekday = this.weekDays[
        currentDay.toLocaleDateString('en', { weekday: 'long' })
      ];
      const day = currentDay.toLocaleDateString('en', { day: 'numeric' });
      const month = this.months[
        currentDay.toLocaleDateString('en', { month: 'long' })
      ];

      dateDiv.innerHTML = `${weekday}, ${day} ${month} <span class="timer"></span>`;
    }
  }

  getWeekDay(days) {
    let date = new Date();
    const options = {
      weekday: 'long'
    };
    date.setDate(date.getDate() + days);
    return date.toLocaleString('en', options);
  }

  updateWeekDays() {
    const currentLanguage = document.querySelector('.languages .current')
      .innerHTML;
    const nextDayNames = document.querySelectorAll('.next-day-name');
    const language = currentLanguage === 'ru' ? 'ru' : 'en';

    if (currentLanguage !== 'by') {
      nextDayNames.forEach((item, i) => {
        let date = new Date();
        const options = {
          weekday: 'long'
        };
        date.setDate(date.getDate() + i + 1);

        item.innerHTML = date.toLocaleString(language, options);
      });
    } else {
      nextDayNames.forEach((item, i) => {
        let date = new Date();
        const options = {
          weekday: 'long'
        };
        date.setDate(date.getDate() + i + 1);

        item.innerHTML = `${
          this.weekDays[date.toLocaleDateString('en', { weekday: 'long' })]
        }`;
      });
    }
  }
}
