import loading from '../../img/misc/loading.gif';
import closeButtonTransparentBackground from '../../img/misc/close-button-transparent-background.gif';
import styleInfoWindow from './styleInfoWindow';
import * as audio from './audio';

// Populates a marker's info window, first with a spinner loading graphic, then with the ajax
// response from the World Tides API. See https://www.worldtides.info/apidocs for more information.
function populateInfoWindow(marker, infoWindow, map, mapObject) {
  // This function isn't called until we get an AJAX response/error.
  function showCloseButton() {
    // See the following link for more info on reasons for using setTimeout with a 0ms delay...
    // https://stackoverflow.com/questions/779379/why-is-settimeoutfn-0-sometimes-useful
    // ...in our case, we need to do it or else the 'img.src' switch is done too early
    // then overwritten again.
    setTimeout(() => {
      // This unhides the 'x' close button in the info window, which is set to 'display: none'
      // while the loading spinner is shown. We then replace the close button image itself with
      // one that has a transparent background, so that it blends nicely with the background
      // color of the info window.
      const nearestRetrievableClass = document.getElementsByClassName('gm-style-iw')[0];
      const closeButton = nearestRetrievableClass.nextSibling;
      closeButton.style.display = 'block';
      const img = closeButton.firstChild;
      img.setAttribute('src', closeButtonTransparentBackground);
    }, 0);

    mapObject.event.addListenerOnce(infoWindow, 'closeclick', () => {
      map.globalView ? audio.mouseClick.volume(0.25) : audio.mouseClick.volume(0.35);
      audio.mouseClick.play();
      infoWindow.setContent(null);
      infoWindow.marker = null;
      infoWindow.close();
    });
  }

  infoWindow.marker = marker;

  // Ensures the marker only bounces three times.
  setTimeout(() => {
    marker.setAnimation(null);
  }, 2150);

  if (map.globalView) {
    map.panTo(marker.position);
  }

  infoWindow.setContent(`<img class='infowindow__loading-spinner' src='${loading}'/>`);

  infoWindow.open(map, marker);
  styleInfoWindow();

  const lat = marker.position.lat();
  const lng = marker.position.lng();
  const timestamp = Math.floor(Date.now() / 1000);

  // The target url for the ajax request queries the World Tides API for predicted tide heights in
  // the ocean surrounding the island. If the ajax request is successful the API responds with a
  // JSON object, which contains a 'heights' array property. This array contains the predicted
  // average tide height for each 30 minute period over the next week. By finding the time/date
  // of the maximum tide height, the user can then be told when it's safest to approach the
  // island, as obviously the higher the tide is then the less chance there is of hitting rocks
  // and getting shipwrecked. Sail safe folks! :)
  const targetUrl = `https://www.worldtides.info/api?heights&lat=${lat}&lon=${lng}&start=${timestamp}&length=604800&key=bf1c3079-2eee-4c95-8e55-ebc8fc0b33cc`;

  fetch(targetUrl).then(response => {
    if (!response.ok) {
      throw Error(response.statusText);
    }
    return response.json();
  }).then(data => {
    const parsedHeights = [];

    // Each object in the data.heights array contains the tide height and the date/time of
    // that tide height. We just want the height for now, so we push each value to the
    // 'parsedHeights' array.
    data.heights.forEach(item => parsedHeights.push(item.height));

    const highestTide = Math.max(...parsedHeights);
    const indexOfHighestTide = parsedHeights.indexOf(highestTide);

    // With the index number of the highest tide, we can now go to that same index number in
    // the original 'data.heights' array and retrieve the date and time of the highest tide.
    const dateAndTime = data.heights[indexOfHighestTide].date;

    // Lets parse that retrieved date and time into a format we can read.
    const parsedDateAndTime = new Date(dateAndTime);
    const string = parsedDateAndTime.toString();
    const splitString = string.split(' ');

    // Removes the time zone from the time shown eventually to the user.
    splitString.splice(5, 4);

    // Removes the seconds unit from the time eventually shown to the user,
    // i.e. turns '21:42:00' into '21:42'.
    splitString[4] = splitString[4].slice(0, -3);

    // We'll now format the date so that its contents are unabbreviated and properly suffixed,
    // i.e. 'Mon' will become 'Monday', 'Aug' will become 'August', '04' will become '4th', etc.
    // Here we also enable Webpack's code splitting feature. This allows us to withhold loading
    // certain scripts until the time they're actually needed - in our case, when a user clicks
    // a marker. The '_unabbreviateDate' script is small - only 2kb - so it hardly makes a
    // difference for this website, but that's besides the point. You could imagine how handy
    // code splitting could be when scaled up to much larger projects. Projects I'd like to work
    // on! Hire me, for god's sake! :)
    System.import('./unabbreviateDate').then(unabbreviateDate => {
      const dayMonthDateAndTime = unabbreviateDate.default(splitString);
      return dayMonthDateAndTime;
    }).then(([day, month, date, time]) => {
      const safestDateAndTimeToDock = `<p class="infowindow__text">According to
      <a class="infowindow__text__world-tides-link"
      target="_blank" href="https://www.worldtides.info">World Tides</a>,
      the safest date and time to travel to ${marker.title} over the next week is
      ${day}, ${month} ${date}, at ${time}.`;

      infoWindow.setContent(safestDateAndTimeToDock);

      // Even though the info window is already open, we're going to call its open method
      // again so the map auto pans to fit the newly populated info window on screen. If we
      // don't do this the info window text may not be fully readable. We'll also have to call
      // the styleInfoWindow function again, otherwise the info window will lose its custom
      // styling that we set first time around.
      infoWindow.open(map, marker);
      styleInfoWindow();

      showCloseButton();

      map.globalView ? audio.ajaxSuccess.volume(0.4) : audio.ajaxSuccess.volume(1.0);
      audio.ajaxSuccess.play();
    });
  }).catch(err => {
    map.globalView ? audio.ajaxError.volume(0.4) : audio.ajaxError.volume(1.0);
    audio.ajaxError.play();
    infoWindow.setContent(`<div class="infowindow__text infowindow__text--error">Can't retrieve information right now,
    please try again later.</div>`);
    showCloseButton();
    throw new Error(err);
  });
} // End of populateInfoWindow().

export default populateInfoWindow;
