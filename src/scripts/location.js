export default class Location {
  constructor(apiKeyLocation, apiKeyMap, apiKeyAnyLocation, languages) {
    this.apiKeyLocation = apiKeyLocation;
    this.apiKeyMap = apiKeyMap;
    this.apiKeyAnyLocation = apiKeyAnyLocation;
    this.languages = languages;
    this.data = {};
  }

  async getAnyLocationData(city, language) {
    const locationUrl = `https://api.opencagedata.com/geocode/v1/json?q=${city}&language=${language}&key=${this.apiKeyAnyLocation}`;

    const response = await fetch(locationUrl);
    const locationData = await response.json();
    this.data[language] = locationData.results[0];

    return locationData.results[0];
  }

  async addMap(latitude, longtitude) {
    mapboxgl.accessToken = this.apiKeyMap;
    const map = new mapboxgl.Map({
      container: 'map', // container id
      style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
      center: [longtitude, latitude], // starting position [lng, lat]
      zoom: 9 // starting zoom
    });

    map.on('load', () => {
      /* Image: An image is loaded and added to the map. */
      map.loadImage('https://i.imgur.com/MK4NUzI.png', (error, image) => {
        if (error) throw error;
        map.addImage('custom-marker', image);
        /* Style layer: A style layer ties together the source and image and specifies how they are displayed on the map. */
        map.addLayer({
          id: 'markers',
          type: 'symbol',
          /* Source: A data source specifies the geographic coordinate where the image marker gets placed. */
          source: {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: [
                {
                  type: 'Feature',
                  properties: {},
                  geometry: {
                    type: 'Point',
                    coordinates: [longtitude, latitude]
                  }
                }
              ]
            }
          },
          layout: {
            'icon-image': 'custom-marker'
          }
        });
      });
    });
  }

  async getCurrentLocationData(language = 'en') {
    const locationUrl = `https://ipinfo.io/json?token=${this.apiKeyLocation}`;

    const response = await fetch(locationUrl);
    const locationData = await response.json();

    const updatedLocationData = [
      await this.getAnyLocationData(locationData.city, 'en')
    ];

    this.languages.forEach(async (item, i) => {
      if (i) {
        await this.getAnyLocationData(locationData.city, item);
      }
    });

    const latitude = this.data[language].geometry.lat;
    const longtitude = this.data[language].geometry.lng;

    this.addMap(latitude, longtitude);

    this.constructor.getCity(this.data[language].formatted);
    this.constructor.getCoordinatePosition(
      latitude.toString(),
      longtitude.toString()
    );

    return {
      name: updatedLocationData[0].components.city,
      timezone: updatedLocationData[0].annotations.timezone.name
    };
  }

  async changeLanguage(language) {
    const locationNameDiv = document.querySelector('.location-name');

    locationNameDiv.innerHTML = this.data[language].formatted;
  }

  static getCity(city) {
    const locationNameDiv = document.querySelector('.location-name');

    locationNameDiv.innerHTML = `${city}`;
  }

  static getCoordinatePosition(latitude, longtitude) {
    const latitudeInside = document.querySelector('.latitude span');
    const longtitudeInside = document.querySelector('.longtitude span');

    latitudeInside.innerHTML = `${latitude.split('.')[0]}°${
      latitude.split('.')[1]
    }'`;
    longtitudeInside.innerHTML = `${longtitude.split('.')[0]}°${
      longtitude.split('.')[1]
    }'`;
  }

  async getNewCityData(city) {
    const language = document.querySelector('.languages .current').innerHTML;
    const updatedLocationData = [await this.getAnyLocationData(city, 'en')];

    if (!updatedLocationData[0]) {
      alert('Not found!');
      return false;
    }
    this.languages.forEach(async (item, i) => {
      if (i) {
        await this.getAnyLocationData(city, item);
      }
    });
    const latitude = this.data[language].geometry.lat;
    const longtitude = this.data[language].geometry.lng;

    this.addMap(latitude, longtitude);

    this.constructor.getCity(this.data[language].formatted);
    this.constructor.getCoordinatePosition(
      latitude.toString(),
      longtitude.toString()
    );

    return {
      name: updatedLocationData[0].components.city,
      timezone: updatedLocationData[0].annotations.timezone.name
    };
  }
}
