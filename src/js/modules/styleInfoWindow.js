// Dynamically style the border and background of the Info Window. We have to do some pretty nasty
// traversing of the DOM here, but I think the end result is far nicer than Google's default.
function styleInfoWindow() {
  const nearestRetrievableClass = document.getElementsByClassName('gm-style-iw')[0];
  const infoWindowStylingDiv = nearestRetrievableClass.previousElementSibling;
  infoWindowStylingDiv.children[1].style.borderRadius = '.75vh';

  const infoWindowUnderlayerParent = infoWindowStylingDiv.children[3];
  infoWindowUnderlayerParent.style.border = '.6vh solid rgb(172, 226, 234)';
  infoWindowUnderlayerParent.style.borderRadius = '.75vh';

  // Give the Info Window a glazed, glass-like background in desktop view, so the map can be seen
  // passing beneath. The combination of the two divs - with different background colours and
  // opacity settings layered on top of each other - is a subtle but nice effect I think. The same
  // effect can also be seen on '.textbox' and '.menu__icon-arrow' in desktop view.
  if (window.innerWidth >= 1366) {
    const infowindowUnderlayer = document.createElement('div');
    infowindowUnderlayer.style.backgroundColor = 'rgba(255, 255, 255, 0)';
    infowindowUnderlayer.style.width = '100%';
    infowindowUnderlayer.style.height = '100%';
    infoWindowUnderlayerParent.style.backgroundColor = 'rgba(232, 244, 248, 0.875)';
    infoWindowUnderlayerParent.appendChild(infowindowUnderlayer);
  } else {
    infoWindowUnderlayerParent.style.backgroundColor = 'rgb(232, 244, 248)';
  }

  // Styles the point of the infowindow.
  const infoWindowPoint = infoWindowStylingDiv.children[2];
  const [leftSideOfPoint, rightSideOfPoint] = infoWindowPoint.children;
  leftSideOfPoint.firstChild.style.backgroundColor = 'rgb(172, 226, 234)';
  rightSideOfPoint.firstChild.style.backgroundColor = 'rgb(172, 226, 234)';
}

export default styleInfoWindow;
