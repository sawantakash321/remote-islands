import tinygif from '../../img/misc/tinygif.gif';
// This code is modified from examples provided by the Google Developers site and Maptiler,
// and to be honest I'm not entirely sure what some of it is doing! What's 'z2 = Math.pow()'?!
// Seems like witchcraft to me! But it's still working after feeding it my own variables and
// making a few adjustments, and that's the most important thing! #juniordevforlife
//
// https://developers.google.com/maps/documentation/javascript/examples/maptype-image
// https://www.maptiler.com/how-to/map-processing/
function getOverlayTileURL(map, mapObject, islandName, islandBounds, currentZoomLevel,
  overlayMinZoom, overlayMaxZoom) {
  const tileURL = new mapObject.ImageMapType({
    getTileUrl(coord, currentZoomLevel) {
      const proj = map.getProjection();
      const z2 = Math.pow(2, currentZoomLevel); // eslint-disable-line no-restricted-properties
      const tileXSize = 256 / z2;
      const tileYSize = 256 / z2;
      const mapTilesBaseURL = PRODUCTION
        ? `./img/overlays/${islandName}/`
        : `./src/img/overlays/${islandName}/`;
      const tileBounds = new mapObject.LatLngBounds(
        proj.fromPointToLatLng(new mapObject.Point(coord.x * tileXSize, (coord.y + 1) * tileYSize)),
        proj.fromPointToLatLng(new mapObject.Point((coord.x + 1) * tileXSize, coord.y * tileYSize))
      );
      const y = coord.y;
      const x = coord.x >= 0 ? coord.x : z2 + coord.x;
      if (
        islandBounds.intersects(tileBounds) &&
        overlayMinZoom <= currentZoomLevel &&
        currentZoomLevel <= overlayMaxZoom
      ) {
        const url = `${mapTilesBaseURL}${currentZoomLevel}/${x}/${y}.png`;
        return url;
      }
      return tinygif;
    },
    tileSize: new mapObject.Size(256, 256),
    isPng: true,
    opacity: 1.0
  });

  return tileURL;
}

export default getOverlayTileURL;
