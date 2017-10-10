// Sets the min and max zoom levels allowed so that each island is always seen at its most
// appropriate zoom level without overflowing the browser window. Also determines the min and max
// zoom levels to display overlay tiles at.
function setMinAndMaxZoomLevels(currentIsland) {
  let minZoomLevel;
  let maxZoomLevel;
  switch (currentIsland) {
    case 'Rudolph Island':
      minZoomLevel = 8;
      maxZoomLevel = 9;
      break;
    case 'Peter I Island':
      minZoomLevel = 9;
      maxZoomLevel = 10;
      break;
    case 'Deception Island':
      minZoomLevel = 9;
      maxZoomLevel = 11;
      break;
    case 'Easter Island':
      minZoomLevel = 10;
      maxZoomLevel = 12;
      break;
    case 'Tristan da Cunha':
      minZoomLevel = 10;
      maxZoomLevel = 12;
      break;
    case 'Christmas Island':
      minZoomLevel = 10;
      maxZoomLevel = 12;
      break;
    case 'Amsterdam Island':
      minZoomLevel = 9;
      maxZoomLevel = 12;
      break;
    case 'Brava':
      minZoomLevel = 11;
      maxZoomLevel = 13;
      break;
    case 'Antipodes Island':
      minZoomLevel = 11;
      maxZoomLevel = 13;
      break;
    case 'Ascension Island':
      minZoomLevel = 10;
      maxZoomLevel = 13;
      break;
    case 'St Kilda':
      minZoomLevel = 10;
      maxZoomLevel = 13;
      break;
    case 'Pukapuka':
      minZoomLevel = 11;
      maxZoomLevel = 13;
      break;
    case 'Banaba Island':
      minZoomLevel = 12;
      maxZoomLevel = 14;
      break;
    case 'Pingelap':
      minZoomLevel = 13;
      maxZoomLevel = 14;
      break;
    default:
      throw new Error('Error setting minimum and maximum zoom levels.');
  }

  return [minZoomLevel, maxZoomLevel];
} // End of setMinAndMaxZoomLevels().

export default setMinAndMaxZoomLevels;
