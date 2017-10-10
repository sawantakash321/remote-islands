import loadingSpinnerGIF from '../../img/misc/loading.gif';

export default function initLoadingScreen() {
  return new Promise(resolve => {
    // The loading screen UI has to be generated without using Knockout because the Knockout
    // bindings are not applied until after the map is loaded.

    // Create and append loading spinner...
    const loadingSpinner = document.createElement('img');
    loadingSpinner.setAttribute('src', loadingSpinnerGIF);
    loadingSpinner.setAttribute('class', 'loading-spinner');
    const initMapContainerLoadingScreen = document.getElementsByClassName('init-map-container-loading-screen')[0];
    initMapContainerLoadingScreen.appendChild(loadingSpinner);

    // This conditional compensates the position of the loading spinner if the user is viewing
    // the application in desktop mode. We want to move the loading spinner up a bit because the
    // 'textbox' element is absolutely positioned over the map in desktop view, so it would look
    // better if we move the loading spinner to be roughly halfway between the top border of the
    // textbox and the top border of the viewport.
    if (document.body.clientWidth >= 1366) {
      const windowHeight = window.innerHeight;
      const compensation = windowHeight / 1.775;
      loadingSpinner.style.bottom = `${compensation}px`;
    }

    // Waits till all initial DOM content is loaded, then fades the loading spinner out and resolves
    // the promise, which in turn triggers the application to fade in to view.
    window.addEventListener('load', () => {
      loadingSpinner.style.opacity = 1;
      // Fade out the loading spinner before fading in the map area...
      setTimeout(function fadeOutLoadingSpinner() {
        loadingSpinner.style.opacity -= 0.05;
        if (loadingSpinner.style.opacity <= 0) {
          loadingSpinner.style.display = 'none';
          resolve();
        } else {
          requestAnimationFrame(fadeOutLoadingSpinner);
        }
      }, 1000);
    }, { passive: true }); // https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md
  });
}

