import ko from 'knockout';
import islands from './islands';
import ViewModel from './ViewModel';
import calculateInitZoomLevel from './calculateInitZoomLevel';
import calculateResponsiveLatLng from './calculateResponsiveLatLng';
import getNumberToDivideTextboxHeightBy from './getNumberToDivideTextboxHeightBy';
import makeMarker from './makeMarker';
import setMinAndMaxZoomLevels from './setMinAndMaxZoomLevels';
import getOverlayTileURL from './getOverlayTileURL';
import mapStyles from './mapStyles';

function generateMap() {
  // Google Maps API key.
  const key = 'AIzaSyDvNMjcb6i4p55qJpL3vzSiCp9KRwW4QQ0';

  // 'google-maps-api' npm package by 'Jam3'.
  // For more details, visit https://github.com/Jam3/google-maps-api
  const googleMapsAPIModule = require('google-maps-api')(key); // eslint-disable-line global-require

  googleMapsAPIModule().then(mapObject => {
    const { lat, lng } = calculateResponsiveLatLng();
    const map = new mapObject.Map(document.getElementsByClassName('map')[0], {
      center: {
        lat,
        lng
      },
      disableDefaultUI: true,
      styles: mapStyles,
      scrollwheel: window.innerWidth <= 768
    });

    // Changes the default grey map background. While page loads we'll set the background to
    // white, so that the map seems to fade in from white nicely. Then after a 100ms timeout we
    // change the background to a top-to-bottom blue/white gradient, so that the ocean blends
    // nicely with the blue at the top of the map, and the Antarctic blends nicely with the white
    // at the bottom.
    map.background = document.getElementsByClassName('map')[0].children[0];
    map.background.style.background = 'rgb(255, 255, 255)';
    setTimeout(() => {
      map.background.style.background =
        'linear-gradient(rgb(81, 175, 188) 41%, rgb(233, 240, 244) 59%)';
    }, 100);

    global.map = map;

    // Helpful later for when we want to filter the markers.
    map.markers = [];

    // This tracks if the map is displaying its initial global view or not, i.e. is the viewport
    // showing all the islands or has a user selected an island from the menu and thus zoomed in
    // on that island. This boolean will determine if the viewport pans to a marker when it is
    // selected. In global view the viewport will pan, but when zoomed in on an island the
    // viewport won't pan to the marker when clicked.
    map.globalView = true;

    const infoWindow = new mapObject.InfoWindow();

    map.dropMarkers = () => {
      // 'index * 300' is passed into the makeMarker function so that it receives a longer timeout
      // value each time it is called. This results in a 'falling rain' effect when the markers
      // drop into view on page load.
      islands.forEach((item, index) =>
        makeMarker(index, index * 300, map, mapObject, infoWindow)
      );
    };

    map.bounceMarker = (island, iteration = 1) => {
      for (let i = 0; i < map.markers.length; i++) {
        if (island.name === map.markers[i].title) {
          map.markers[i].setAnimation(null);
          map.markers[i].setAnimation(mapObject.Animation.BOUNCE);
          stopBounce(i);
        }
      }

      function stopBounce(index) {
        setTimeout(() => {
          map.markers[index].setAnimation(null);
        }, 710 * iteration);
      }
    };

    map.getIslandBounds = island => {
      const [southWestCoordinates, northEastCoordinates] = island.latLngBounds;
      const islandBounds = new mapObject.LatLngBounds(southWestCoordinates, northEastCoordinates);
      return islandBounds;
    };

    map.showOverlayTiles = (islandName, islandBounds, currentZoomLevel, minZoomLevel,
      maxZoomLevel) => {
      const overlayMinZoom = minZoomLevel;
      const overlayMaxZoom = maxZoomLevel;
      const tileURL = getOverlayTileURL(map, mapObject, islandName, islandBounds,
        currentZoomLevel, overlayMinZoom, overlayMaxZoom);
      map.overlayMapTypes.insertAt(0, tileURL);
    };

    map.goToSelectedIsland = island => {
      // Empties cache of any previously loaded overlays. This ensures overlay fonts are correctly
      // rendered if the previous island is ever selected again - the tyopgraphy won't be doubled
      // up and thickened each time the overlay tiles are loaded.
      map.overlayMapTypes.removeAt(0);

      mapObject.event.trigger(map, 'resize');

      const islandBounds = map.getIslandBounds(island);
      map.fitBounds(islandBounds);

      const islandName = island.name;
      const currentZoomLevel = map.getZoom();
      const [minZoomLevel, maxZoomLevel] = setMinAndMaxZoomLevels(islandName);

      // Caps the maximum zoom level so that each island is seen at its most appropriate zoom
      // level without overflowing the browser window.
      if (currentZoomLevel > maxZoomLevel) {
        map.setZoom(maxZoomLevel);
      }

      // This conditional adjusts the 'y' position of the map to account for the
      // <section class='textbox'> being absolutely positioned over the map in desktop view.
      if (document.body.clientWidth >= 1366) {
        const textboxHeight = document.getElementsByClassName('textbox')[0].clientHeight;
        const numberToDivideTextboxHeightBy = getNumberToDivideTextboxHeightBy(islandName);
        const textboxCompensation = textboxHeight / numberToDivideTextboxHeightBy;
        map.panBy(0, textboxCompensation);
      }

      // Finally, we'll get and set the appropriate overlay tiles for the selected island.
      map.showOverlayTiles(islandName, islandBounds, currentZoomLevel, minZoomLevel,
        maxZoomLevel);
    }; // End of goToSelectedIsland().

    return map;
  }).then(map => {
    ko.applyBindings(new ViewModel(map));

    const zoomLevel = calculateInitZoomLevel();
    map.setZoom(zoomLevel);

    // Updates the height of '.textbox-underlayer' with the value obtained by querying the height
    // of '.textbox' after it's been loaded with new data. By blending the opacity of the
    // background colours of each div we get a very subtle but pleasing effect.
    setTimeout(() => {
      const textbox = document.getElementsByClassName('textbox')[0];
      const textboxUnderlayer = document.getElementsByClassName('textbox-underlayer')[0];
      textboxUnderlayer.style.height = `${textbox.clientHeight}px`;
    }, 50);
  }).catch(err => {
    console.warn(err);
    alert(
      'Google Maps was unable to load. Please check your network connection or try again later.'
    );
  }); // End of googleMapsAPIModule().
} // End of googleMapView().

export default generateMap;
