// Returns the widest zoom level that can be displayed without showing the grey div background
// above and below the map. Just makes things look nicer than using 'fitBounds(bounds)', which
// can often show the grey areas.
function calculateInitZoomLevel() {
  const mapHeight = document.getElementsByClassName('map')[0].clientHeight;
  if (mapHeight <= 295) {
    return 0;
  } else if (mapHeight <= 534) {
    return 1;
  } else if (mapHeight <= 1122) {
    return 2;
  } else if (mapHeight <= 2120) {
    return 3;
  }
  return 4;
}

export default calculateInitZoomLevel;
