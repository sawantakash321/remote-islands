import generateMap from './modules/generateMap';
import '../css/styles.css';
import initLoadingScreen from './modules/initLoadingScreen';
import * as audio from './modules/audio';

(function appInit() {
  // Enables Webpack's hot module replacement for index.html if in development mode.
  if (DEVELOPMENT) {
    require('../index.html'); // eslint-disable-line global-require
  }

  // This event handler solves an issue with the menu animation firing on initial page load.
  // See here for more details... https://css-tricks.com/transitions-only-after-page-load
  window.onanimationstart = () => {
    const body = document.getElementsByClassName('disable-init-animations')[0];
    body.classList.remove('disable-init-animations');
    window.onanimationstart = null;
  };

  generateMap();

  initLoadingScreen().then(() => {
    // Fades in the map area after all neccessary files are loaded for initial page render.
    const initMapContainerLoadingScreen = document.getElementsByClassName('init-map-container-loading-screen')[0];
    initMapContainerLoadingScreen.classList.add('init-map-container-loading-screen--fade');

    // Now that the map has faded into view we'll animate the clouds.
    // I'm using the ES6 spread operator here to spread the HTMLCollection object into an array.
    const cloudArray = [...document.getElementsByClassName('clouds')];
    cloudArray.forEach((cloud, index) => {
      cloud.classList.add(`clouds__cloud-${index + 1}--animate`);
    });

    audio.ocean.start(0);
    setTimeout(map.dropMarkers, 1100);
  });
})();
