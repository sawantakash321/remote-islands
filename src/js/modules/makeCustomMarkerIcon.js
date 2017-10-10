import leftLeaningBrownPin from '../../img/pins/left-leaning-brown-pin.png';
import straightBrownPin from '../../img/pins/straight-brown-pin.png';
import rightLeaningBrownPin from '../../img/pins/right-leaning-brown-pin.png';
import leftLeaningGreenPin from '../../img/pins/left-leaning-green-pin.png';
import straightGreenPin from '../../img/pins/straight-green-pin.png';
import rightLeaningGreenPin from '../../img/pins/right-leaning-green-pin.png';

function makeCustomMarkerIcon(color, markerSrcPathPosition, mapObject) {
  let customMarkerIcon;

  // These two arrays contains src paths for pin images leaning at different angles. In the
  // makeCustomeMarkerIcon() we will randomly select one of them for each colour, just to add a bit
  // of variety to our pin icons.
  const brownMarkerSrcPaths = [leftLeaningBrownPin, straightBrownPin, rightLeaningBrownPin];
  const greenMarkerSrcPaths = [leftLeaningGreenPin, straightGreenPin, rightLeaningGreenPin];

  if (color === 'brown') {
    const randomlySelectedBrownPin = brownMarkerSrcPaths[markerSrcPathPosition];
    customMarkerIcon = new mapObject.MarkerImage(
      randomlySelectedBrownPin,
      new mapObject.Size(34, 40),
      new mapObject.Point(0, 0),
      new mapObject.Point(10, 34),
      new mapObject.Size(34, 40)
    );
  } else if (color === 'green') {
    const randomlySelectedGreenPin = greenMarkerSrcPaths[markerSrcPathPosition];
    customMarkerIcon = new mapObject.MarkerImage(
      randomlySelectedGreenPin,
      new mapObject.Size(34, 40),
      new mapObject.Point(0, 0),
      new mapObject.Point(10, 34),
      new mapObject.Size(34, 40)
    );
  }
  return customMarkerIcon;
} // End of makeCustomMarkerIcon().

export default makeCustomMarkerIcon;
