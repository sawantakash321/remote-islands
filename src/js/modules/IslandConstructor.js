function IslandConstructor(island) {
  this.name = island.name;
  this.ocean = island.ocean;
  this.latLngBounds = island.latLngBounds;
  this.markerPosition = island.markerPosition;
  this.bookExcerpt = island.bookExcerpt;
}

export default IslandConstructor;
