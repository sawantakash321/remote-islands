import islands from './islands';
import populateInfoWindow from './populateInfoWindow';
import makeCustomMarkerIcon from './makeCustomMarkerIcon';
import tinygif from '../../img/misc/tinygif.gif';
import * as audio from './audio';

function makeMarker(position, timeout, map, mapObject, infoWindow) {
  // We'll make two custom marker icons, each a different colour, so that the default brown
  // marker turns green when it is hovered over, or when the relevant island name is hovered
  // over in the menu. The markerSrcPathPosition variable is passed into makeCustomMarkerIcon()
  // so a different angled pin image is selected each time we make a marker.
  const markerSrcPathPosition = Math.floor(Math.random() * 3);
  const defaultIcon = makeCustomMarkerIcon('brown', markerSrcPathPosition, mapObject);
  const highlightedIcon = makeCustomMarkerIcon('green', markerSrcPathPosition, mapObject);

  setTimeout(() => {
    const markerPosition = islands[position].markerPosition;
    const islandName = islands[position].name;
    const ocean = islands[position].ocean;
    const marker = new mapObject.Marker({
      icon: tinygif,
      map,
      position: markerPosition,
      title: islandName,
      ocean,
      class: `marker${position}`,
      optimized: false,
      flat: true,
      draggable: true,
      animation: mapObject.Animation.DROP
    });

    // Setting 'marker.icon' to the 'tinygif.gif' image above and then switching it to the
    // actual desired icon 20ms later fixes a marker flicker bug that Google have yet to
    // address. For more info on this bug see... https://issuetracker.google.com/issues/35820791
    // For more info on the tinygif graphic (which comes in handy for all sorts of things!)
    // see... http://probablyprogramming.com/2009/03/15/the-tiniest-gif-ever
    setTimeout(() => {
      marker.setIcon(defaultIcon);
    }, 20);

    map.markers.push(marker);

    // Setting each 'marker.draggable' to 'true' above prevents the markers from
    // appearing in multiple places at once when the map is zoomed out as wide as possible. If a
    // user actually does then try to drag a marker the marker's position is reset to it's
    // original position on 'mouseup'.
    marker.addListener('mouseup', function() {
      this.setPosition(markerPosition);
    });

    // Changes the colour of a marker when a user hovers over it.
    marker.addListener('mouseover', function() {
      map.globalView
        ? audio.mouseEnterArrowButtonOrMarkerOrHomeLink.volume(0.35)
        : audio.mouseEnterArrowButtonOrMarkerOrHomeLink.volume(0.7);
      audio.mouseEnterArrowButtonOrMarkerOrHomeLink.play();
      this.setIcon(highlightedIcon);
    });

    marker.addListener('mouseout', function() {
      this.setIcon(defaultIcon);
    });

    marker.addListener('click', function() {
      map.globalView ? audio.mouseClick.volume(0.25) : audio.mouseClick.volume(0.35);
      audio.mouseClick.play();
      populateInfoWindow(this, infoWindow, map, mapObject);
    });
  }, timeout);
} // End of makeMarker().

export default makeMarker;
