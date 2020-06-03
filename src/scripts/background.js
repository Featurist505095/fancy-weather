export default class Background {
  constructor(apiKeyPicture) {
    this.apiKeyPicture = apiKeyPicture;
  }

  async getNewBackGround() {
    const url = `https://api.unsplash.com/photos/random?orientation=landscape&per_page=1&query=nature&client_id=${this.apiKeyPicture}`;

    const response = await fetch(url);
    const picture = await response.json();

    this.constructor.changeBackGround(picture.urls.regular);
  }

  static changeBackGround(imageID) {
    const backgroundWrapper = document.querySelector('.wrapper');

    backgroundWrapper.style.backgroundImage = `url(${imageID})`;
  }
}
