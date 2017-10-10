import ko from 'knockout';
import islands from './islands';
import IslandConstructor from './IslandConstructor';
import calculateInitZoomLevel from './calculateInitZoomLevel';
import calculateResponsiveLatLng from './calculateResponsiveLatLng';
import homeScreenLinkActive from '../../img/misc/home-screen-link-active.png';
import homeScreenLinkInactive from '../../img/misc/home-screen-link-inactive.png';
import * as audio from './audio';

function ViewModel(map) {
  // An array containing which islands should be shown in the menu.
  // Contents depend on whether a filter is currently selected or not.
  this.islandsToList = ko.observableArray();

  this.currentlySelectedIsland = ko.observable(null);

  // Updates the height of '.textbox-underlayer' with the value obtained by querying the height of
  // '.textbox' after it's been loaded with new data. By blending the opacity of the background
  // colours of each div we get a very subtle but pleasing glazed glass-like effect when the app is
  // viewed on desktop. Effect is disabled on mobile/tablet as the map doesn't pass beneath the
  // textbox when viewed on such devices.
  this.currentlySelectedIsland.subscribe(() => {
    setTimeout(() => {
      const textbox = document.getElementsByClassName('textbox')[0];
      const textboxUnderlayer = document.getElementsByClassName('textbox-underlayer')[0];
      textboxUnderlayer.style.height = `${textbox.clientHeight}px`;
    }, 0);
  });

  this.currentlySelectedOcean = ko.observable(null);

  // When true the 'filter' background colour flashes yellow.
  this.filterChanged = ko.observable(false);

  // See above.
  this.currentlySelectedOcean.subscribe(() => {
    this.filterChanged(true);
    map.globalView ? audio.filterChange.volume(0.3) : audio.filterChange.volume(0.8);
    audio.filterChange.play();
    setTimeout(() => {
      this.filterChanged(false);
    }, 170);
  });

  this.playMouseClick = () => {
    map.globalView ? audio.mouseClick.volume(0.25) : audio.mouseClick.volume(0.35);
    audio.mouseClick.play();
  };

  // When true the 'menu--visible' class is applied to the menu, causing it to animate into view.
  this.menuVisible = ko.observable(false);

  this.numberOfTimesUserHasOpenedMenu = ko.observable(0);

  this.userHasSeenMenuButton = ko.observable(false);

  // This observable makes sure the menu border colours only change when
  // the menu is toggled and not also when a filter is selected/unselected.
  this.menuHasBeenToggled = ko.observable(false);

  // Triggered each time the arrow button is clicked. Clicking outside the menu also closes the menu
  // due to '.fade-map-container' also having the below binding. CSS 'pointer-events' are
  // appropriately used on '.fade-map-container' to enable this behaviour without resorting to
  // jQuery.
  this.toggleMenuVisibility = () => {
    this.menuHasBeenToggled(true);

    this.playMouseClick();

    if (!this.menuVisible()) {
      this.menuVisible(true);
      map.globalView ? audio.slideRight.volume(0.55) : audio.slideRight.volume(1.0);
      audio.slideRight.play();
      this.numberOfTimesUserHasOpenedMenu(this.numberOfTimesUserHasOpenedMenu() + 1);
      if (this.numberOfTimesUserHasOpenedMenu() === 1) {
        this.userHasSeenMenuButton(true);
      }
    } else {
      map.globalView ? audio.slideLeft.volume(0.55) : audio.slideLeft.volume(1.0);
      this.menuVisible(false);
      setTimeout(() => {
        audio.slideLeft.play();
      }, 40);
    }
  };

  // This value of this observable determines what background color the menu arrow button has.
  // The colour varies depending on whether the menu is currently visible or not, and if the current
  // event is a mouseover or mouseout event. See the menu arrow button's data binding in the HTML
  // for more information.
  this.arrowButtonEventType = ko.observable();

  this.trackArrowButtonEventType = (data, event) => {
    this.arrowButtonEventType(event.type);
    if (event.type === 'mouseenter') {
      map.globalView
        ? audio.mouseEnterArrowButtonOrMarkerOrHomeLink.volume(0.35)
        : audio.mouseEnterArrowButtonOrMarkerOrHomeLink.volume(0.7);
      audio.mouseEnterArrowButtonOrMarkerOrHomeLink.play();
    }
  };

  // The colour scheme for the page is pretty, but because of it I think some first-time users
  // might not notice the menu button on the left of the screen. So if 15 seconds after page load
  // the user still hasn't clicked on the menu button then we'll flash its background color 5
  // times to get their attention.
  window.onload = () => {
    setTimeout(() => {
      if (this.userHasSeenMenuButton() === false) {
        this.timeToGetUsersAttention(true);
      }
    }, 15000);
  };

  this.timeToGetUsersAttention = ko.observable(false);

  this.flash = ko.observable(false);

  this.numberOfFlashes = ko.observable(0);

  this.timeToGetUsersAttention.subscribe(() => {
    const flashArrowButton = setInterval(() => {
      this.flash(true);
      setTimeout(() => {
        this.flash(false);
        this.numberOfFlashes(this.numberOfFlashes() + 1);
        if (this.numberOfFlashes() === 5) {
          clearInterval(flashArrowButton);
        }
      }, 255);
    }, 510);
  });

  this.cloudImgSrcPaths = ko.observableArray();

  // Using Webpack's code splitting feature, we'll only download the cloud .png files if the user is
  // viewing the site on a desktop, in which case they'll likely have a faster internet connection.
  // By not downloading the cloud .png files on mobile we'll improve the page load speed.
  if (window.innerWidth >= 1366) {
    System.import('./clouds').then(cloudsArray => {
      cloudsArray.default.forEach(cloudImgSrcPath => {
        this.cloudImgSrcPaths.push(cloudImgSrcPath);
      });
    });
  }

  this.showAllIslandsOnLoad = (() => {
    islands.forEach(island => this.islandsToList.push(new IslandConstructor(island)));

    // Caches all the islands on initial page load. This is useful later for when a filter is
    // unselected and all island names need to be displayed again in the menu. We can just pass this
    // 'islandsCached' array to 'islandsToList' without having to loop through the Model again.
    this.islandsCached = this.islandsToList();
  })();

  // Loops through the model to find out how many unique oceans there are. With this new returned
  // array we can then create a 'foreach' binding in our View to construct a filter icon for each
  // unique ocean.
  this.uniqueOceans = islands
    .map(island => island.ocean)
    .filter((ocean, index, array) => array.indexOf(ocean) === index);

  // Filters the island list and markers depending on which ocean is selected.
  this.selectOcean = selectedOcean => {
    this.menuHasBeenToggled(false);
    if (this.currentlySelectedOcean() === selectedOcean) {
      this.currentlySelectedOcean(null);
      this.islandsToList(this.islandsCached);
      map.markers.forEach(marker => marker.setMap(map));
    } else {
      const filteredIslands = this.islandsCached.filter(island => island.ocean === selectedOcean);
      this.islandsToList(filteredIslands);
      this.currentlySelectedOcean(selectedOcean);
      map.markers.forEach(marker => {
        marker.ocean === selectedOcean ? marker.setMap(map) : marker.setMap(null);
      });
    }
  };

  this.seagullSFXArePlaying = false;

  this.whiteCloudFlashWhenIslandSelected = ko.observable(false);

  this.islandSelectedFromMenu = selectedIsland => {
    if (selectedIsland !== this.currentlySelectedIsland()) {
      // Sets the map background color to the same colour as the ocean, so that each selected island
      // from the menu fades into view nicely, instead of a flash of the original blue/white
      // gradient background being briefly shown while each island loads.
      if (map.background.style.background !== 'rgb(81, 175, 188)') {
        map.background.style.background = 'rgb(81, 175, 188)';
      }

      this.toggleMenuVisibility();

      // Now we're gonna increase the volume of the ocean and lift the frequency of the lowpass
      // filter from 2khz to 22khz - the limit of human hearing - so that the ocean sounds a lot
      // closer when we zoom down to the selected island. On a related note, here's Father Ted
      // helping us better understand physics... https://www.youtube.com/watch?v=OXypyrutq_M
      if (map.globalView) {
        audio.gainNode.gain.exponentialRampToValueAtTime(1, audio.audioCtx.currentTime + 1);
        audio.biquadFilter.frequency.exponentialRampToValueAtTime(
          22000,
          audio.audioCtx.currentTime + 1
        );
      }

      if (!this.seagullSFXArePlaying) {
        audio.playOrStopSeagullSFX();
        this.seagullSFXArePlaying = true;
      }

      // We will now zoom in on an island, so we're no longer in 'global view'. This boolean will
      // determine if the viewport pans to a marker when it is selected. In global view the viewport
      // will pan, but when zoomed in on an island the viewport will not pan to the marker when
      // clicked.
      map.globalView = false;

      setTimeout(() => {
        this.currentlySelectedIsland(selectedIsland);
        map.goToSelectedIsland(this.currentlySelectedIsland());
        setTimeout(() => {
          map.bounceMarker(selectedIsland, 3);
        }, 480);
      }, 100);

      // Flashes a 100% width/height white div briefly while map loads the selected island. It's
      // meant to give a 'passing through clouds' type of effect! :)
      this.whiteCloudFlashWhenIslandSelected(true);
      setTimeout(() => this.whiteCloudFlashWhenIslandSelected(false), 700);
    } else {
      this.toggleMenuVisibility();
    }

    this.activateHomeScreenLinkWhenNotInGlobalView(true);
  };

  // This binding makes the appropriate marker bounce once when an island name is hovered over in
  // the menu in global view. It also plays the appropriate sound effect.
  this.islandNameHover = island => {
    if (map.globalView) {
      audio.mouseEnterIslandNameOrHomeLink.volume(0.3);
      map.bounceMarker(island);
    } else {
      audio.mouseEnterIslandNameOrHomeLink.volume(0.7);
    }
    audio.mouseEnterIslandNameOrHomeLink.play();
  };

  // Used to throttle window resize events in the subsequent 'resize' event listener.
  this.currentlyZoomingOrPanning = false;

  window.addEventListener('resize', () => {
    // This 'map' conditional prevents the rest of the callback from being executed if the map has
    // not finished loading yet on initial page load.
    if (map) {
      // This next conditional prevents the clouds from rendering again if the user loads
      // the application initially in desktop view, then switches to mobile view, and then
      // switches back to desktop view. We don't want the clouds reappearing and animating again
      // in that case. We only want the clouds to be seen after the initial page load.
      if (this.initialHomeScreenLoad() && window.innerWidth <= 1366) {
        this.initialHomeScreenLoad(false);
      }
      if (this.currentlySelectedIsland() !== null) {
        if (!this.currentlyZoomingOrPanning) {
          window.requestAnimationFrame(() => {
            map.goToSelectedIsland(this.currentlySelectedIsland());
            this.currentlyZoomingOrPanning = false;
          });
        }
        this.currentlyZoomingOrPanning = true;
      } else if (!this.currentlyZoomingOrPanning) {
        window.requestAnimationFrame(() => {
          const zoomLevel = calculateInitZoomLevel();
          map.setZoom(zoomLevel);
          const { lat, lng } = calculateResponsiveLatLng();
          map.setCenter({
            lat,
            lng
          });
          this.currentlyZoomingOrPanning = false;
        });
        this.currentlyZoomingOrPanning = true;
      }
    }
    map.setOptions({
      scrollwheel: window.innerWidth <= 768
    });
    this.getWindowWidth();
  }, { passive: true }); // https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md

  this.viewedOnDesktop = ko.observable();

  this.getWindowWidth = () => {
    window.innerWidth >= 1366 ? this.viewedOnDesktop(true) : this.viewedOnDesktop(false);
  };

  this.getWindowWidth();

  this.homeLinkEventType = ko.observable();

  this.trackHomeLinkEventType = (data, event) => {
    this.homeLinkEventType(event.type);
    if (event.type === 'mouseenter' && !map.globalView) {
      audio.mouseEnterArrowButtonOrMarkerOrHomeLink.volume(0.7);
      audio.mouseEnterArrowButtonOrMarkerOrHomeLink.play();
    }
  };

  // This observable ensures the clouds are only seen the first time the user loads the page, and
  // not again if the user clicks the home screen link in the menu later on.
  this.initialHomeScreenLoad = ko.observable(true);

  // This observable is 'false' by default for the initial page load and only set to 'true' whenever
  // an island is selected from the menu. When 'true' the image of the world map at the bottom of
  // the world map turns from a black and white image to a color image. Clicking on this image will
  // then take the user back to the home screen and set this observable to 'false' again.
  this.activateHomeScreenLinkWhenNotInGlobalView = ko.observable(false).extend({
    rateLimit: 350
  });

  this.getHomeScreenLink = () => {
    if (this.activateHomeScreenLinkWhenNotInGlobalView()) {
      return homeScreenLinkActive;
    }
    return homeScreenLinkInactive;
  };

  this.backToHomeScreen = () => {
    if (!map.globalView) {
      if (this.initialHomeScreenLoad()) {
        this.initialHomeScreenLoad(false);
      }

      setTimeout(() => {
        map.background.style.background =
          'linear-gradient(rgb(81, 175, 188) 41%, rgb(233, 240, 244) 59%)';
        map.setOptions({
          scrollwheel: window.innerWidth <= 768
        });
      }, 700);

      audio.mouseClick.volume(0.35);
      audio.mouseClick.play();
      this.menuVisible(false);
      this.whiteCloudFlashWhenIslandSelected(true);
      setTimeout(() => this.whiteCloudFlashWhenIslandSelected(false), 700);

      setTimeout(() => {
        const { lat, lng } = calculateResponsiveLatLng();
        map.setCenter({
          lat,
          lng
        });

        map.setZoom(calculateInitZoomLevel());
      }, 350);

      setTimeout(() => {
        this.currentlySelectedIsland(null);
      }, 100);

      this.activateHomeScreenLinkWhenNotInGlobalView(false);

      audio.gainNode.gain.exponentialRampToValueAtTime(0.2, audio.audioCtx.currentTime + 1);
      audio.biquadFilter.frequency.exponentialRampToValueAtTime(
        2500,
        audio.audioCtx.currentTime + 1.25
      );

      if (this.seagullSFXArePlaying) {
        audio.playOrStopSeagullSFX();
        this.seagullSFXArePlaying = false;
      }

      map.globalView = true;
    }
  };
} // End of ViewModel().

export default ViewModel;
