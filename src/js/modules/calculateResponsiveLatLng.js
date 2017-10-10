function calculateResponsiveLatLng() {
  const windowWidth = document.body.clientWidth;
  const latLng = {};

  if (windowWidth > 1366) {
    latLng.lat = -2;
    latLng.lng = 12;
  } else if (windowWidth > 1226) {
    latLng.lat = 17;
    latLng.lng = 3;
  } else if (windowWidth > 1020) {
    latLng.lat = 20;
    latLng.lng = 2;
  } else if (windowWidth > 840) {
    latLng.lat = 24;
    latLng.lng = 9;
  } else if (windowWidth > 775) {
    latLng.lat = 27;
    latLng.lng = 7;
  } else if (windowWidth > 751) {
    latLng.lat = 21;
    latLng.lng = 7;
  } else if (windowWidth > 660) {
    latLng.lat = 9;
    latLng.lng = 10;
  } else if (windowWidth > 616) {
    latLng.lat = 11;
    latLng.lng = 0;
  } else if (windowWidth > 563) {
    latLng.lat = 9;
    latLng.lng = 7;
  } else if (windowWidth > 413) {
    latLng.lat = 14;
    latLng.lng = 4;
  } else if (windowWidth > 374) {
    latLng.lat = 9;
    latLng.lng = 6;
  } else {
    latLng.lat = 14;
    latLng.lng = 0;
  }

  return latLng;
} // End of calculateResponsiveLatLng().

export default calculateResponsiveLatLng;
