import 'howler';
import oceanOGG from '../../sounds/ocean.ogg';
import oceanMP3 from '../../sounds/ocean.mp3';
import slideLeftOGG from '../../sounds/slide-left.ogg';
import slideLeftMP3 from '../../sounds/slide-left.mp3';
import slideRightOGG from '../../sounds/slide-right.ogg';
import slideRightMP3 from '../../sounds/slide-right.mp3';
import filterChangeOGG from '../../sounds/filter-change.ogg';
import filterChangeMP3 from '../../sounds/filter-change.mp3';
import mouseEnterIslandNameOrHomeLinkOGG from '../../sounds/mouse-enter-island-name-or-home-link.ogg';
import mouseEnterIslandNameOrHomeLinkMP3 from '../../sounds/mouse-enter-island-name-or-home-link.mp3';
import mouseEnterArrowButtonOrMarkerOrHomeLinkOGG from '../../sounds/mouse-enter-arrow-button-or-marker-or-home-link.ogg';
import mouseEnterArrowButtonOrMarkerOrHomeLinkMP3 from '../../sounds/mouse-enter-arrow-button-or-marker-or-home-link.mp3';
import mouseClickOGG from '../../sounds/mouse-click.ogg';
import mouseClickMP3 from '../../sounds/mouse-click.mp3';
import ajaxSuccessOGG from '../../sounds/ajax-success.ogg';
import ajaxSuccessMP3 from '../../sounds/ajax-success.mp3';
import ajaxErrorOGG from '../../sounds/ajax-error.ogg';
import ajaxErrorMP3 from '../../sounds/ajax-error.mp3';
import seagull1OGG from '../../sounds/seagull-1.ogg';
import seagull1MP3 from '../../sounds/seagull-1.mp3';
import seagull2OGG from '../../sounds/seagull-2.ogg';
import seagull2MP3 from '../../sounds/seagull-2.mp3';
import seagull3OGG from '../../sounds/seagull-3.ogg';
import seagull3MP3 from '../../sounds/seagull-3.mp3';
import seagull4OGG from '../../sounds/seagull-4.ogg';
import seagull4MP3 from '../../sounds/seagull-4.mp3';
import seagull5OGG from '../../sounds/seagull-5.ogg';
import seagull5MP3 from '../../sounds/seagull-5.mp3';
import seagull6OGG from '../../sounds/seagull-6.ogg';
import seagull6MP3 from '../../sounds/seagull-6.mp3';
import seagull7OGG from '../../sounds/seagull-7.ogg';
import seagull7MP3 from '../../sounds/seagull-7.mp3';
import seagull8OGG from '../../sounds/seagull-8.ogg';
import seagull8MP3 from '../../sounds/seagull-8.mp3';
import seagull9OGG from '../../sounds/seagull-9.ogg';
import seagull9MP3 from '../../sounds/seagull-9.mp3';
import seagull10OGG from '../../sounds/seagull-10.ogg';
import seagull10MP3 from '../../sounds/seagull-10.mp3';
import seagull11OGG from '../../sounds/seagull-11.ogg';
import seagull11MP3 from '../../sounds/seagull-11.mp3';
import seagull12OGG from '../../sounds/seagull-12.ogg';
import seagull12MP3 from '../../sounds/seagull-12.mp3';
import seagull13OGG from '../../sounds/seagull-13.ogg';
import seagull13MP3 from '../../sounds/seagull-13.mp3';
import seagull14OGG from '../../sounds/seagull-14.ogg';
import seagull14MP3 from '../../sounds/seagull-14.mp3';
import seagull15OGG from '../../sounds/seagull-15.ogg';
import seagull15MP3 from '../../sounds/seagull-15.mp3';

let oceanURL;

// This is to test if the browser supports playback of '.ogg' files or not. If not, then we'll
// load 'oceanMP3' instead of 'oceanOGG'.
const el = document.createElement('audio');
el.canPlayType('audio/ogg') ? (oceanURL = oceanOGG) : (oceanURL = oceanMP3);

// We're using the Web Audio API for playback of 'ocean.ogg/mp3' because, unlike Howler.js, it
// allows us to filter our audio source. Why would we want to filter it? Well, when the user
// loads the page we'll set the lowpass filter to 2khz, so the ocean sounds far away, then when they
// zoom down to an island we'll raise the frequency to 22000khz, effectively disabling the filter,
// so that the ocean will then sound closer to them. We'll also increase the volume. For all other
// sounds we'll use Howler.js because it's got better cross-browser support and we don't need to
// use filters for any of the other sounds.
window.AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();
const ocean = audioCtx.createBufferSource();
const biquadFilter = audioCtx.createBiquadFilter(); // eslint-disable-line import/no-mutable-exports
const gainNode = audioCtx.createGain();
const request = new XMLHttpRequest();

request.open('GET', oceanURL, true);
request.responseType = 'arraybuffer';
request.onload = () => {
  audioCtx.decodeAudioData(request.response, buffer => {
    // This setTimeout is to delay the playback of the ocean audio until the application starts
    // fading into view after the initial loading screen.
    setTimeout(() => {
      ocean.buffer = buffer;
      ocean.connect(biquadFilter);
      biquadFilter.type = 'lowpass';
      biquadFilter.frequency.value = 2500;
      biquadFilter.connect(gainNode);
      gainNode.gain.setValueAtTime(0.01, 0);
      gainNode.gain.exponentialRampToValueAtTime(0.2, audioCtx.currentTime + 2.5);
      gainNode.connect(audioCtx.destination);
      ocean.loop = true;
    }, 1650);
  }, e => {
    console.log(`Error with decoding audio data: ${e.err}`);
  });
};
request.send();

const slideRight = new Howl({
  src: [slideRightOGG, slideRightMP3],
  volume: 0.55
});
const slideLeft = new Howl({
  src: [slideLeftOGG, slideLeftMP3],
  volume: 0.55
});
const filterChange = new Howl({
  src: [filterChangeOGG, filterChangeMP3],
  volume: 0.3
});
const mouseEnterIslandNameOrHomeLink = new Howl({
  src: [mouseEnterIslandNameOrHomeLinkOGG, mouseEnterIslandNameOrHomeLinkMP3],
  volume: 0.3
});
const mouseEnterArrowButtonOrMarkerOrHomeLink = new Howl({
  src: [mouseEnterArrowButtonOrMarkerOrHomeLinkOGG, mouseEnterArrowButtonOrMarkerOrHomeLinkMP3],
  volume: 0.35
});
const mouseClick = new Howl({
  src: [mouseClickOGG, mouseClickMP3],
  volume: 0.25
});
const ajaxSuccess = new Howl({
  src: [ajaxSuccessOGG, ajaxSuccessMP3],
  volume: 0.4
});
const ajaxError = new Howl({
  src: [ajaxErrorOGG, ajaxErrorMP3],
  volume: 0.4
});
const seagull1 = new Howl({
  src: [seagull1OGG, seagull1MP3],
  volume: 0.5
});
const seagull2 = new Howl({
  src: [seagull2OGG, seagull2MP3],
  volume: 0.6
});
const seagull3 = new Howl({
  src: [seagull3OGG, seagull3MP3],
  volume: 0.5
});
const seagull4 = new Howl({
  src: [seagull4OGG, seagull4MP3],
  volume: 0.6
});
const seagull5 = new Howl({
  src: [seagull5OGG, seagull5MP3],
  volume: 1.0
});
const seagull6 = new Howl({
  src: [seagull6OGG, seagull6MP3],
  volume: 0.5
});
const seagull7 = new Howl({
  src: [seagull7OGG, seagull7MP3],
  volume: 0.4
});
const seagull8 = new Howl({
  src: [seagull8OGG, seagull8MP3],
  volume: 0.1
});
const seagull9 = new Howl({
  src: [seagull9OGG, seagull9MP3],
  volume: 0.075
});
const seagull10 = new Howl({
  src: [seagull10OGG, seagull10MP3],
  volume: 0.05
});
const seagull11 = new Howl({
  src: [seagull11OGG, seagull11MP3],
  volume: 0.05
});
const seagull12 = new Howl({
  src: [seagull12OGG, seagull12MP3],
  volume: 0.1
});
const seagull13 = new Howl({
  src: [seagull13OGG, seagull13MP3],
  volume: 0.15
});
const seagull14 = new Howl({
  src: [seagull14OGG, seagull14MP3],
  volume: 0.7
});
const seagull15 = new Howl({
  src: [seagull15OGG, seagull15MP3],
  volume: 0.35
});

const seagulls = [];

seagulls.push(seagull1, seagull2, seagull3, seagull4, seagull5, seagull6, seagull7, seagull8,
  seagull9, seagull10, seagull11, seagull12, seagull13, seagull14, seagull15);

// Randomises the playback of the seagull sfx, or else stops it altogether when user clicks on link
// to home screen.
function playOrStopSeagullSFX() {
  if (map.globalView) {
    const randomIndex = () => Math.floor(Math.random() * 15);
    const randomTimeoutDuration = () => Math.floor((Math.random() * 5000) + 1000);

    let lastSelectedSeagull = null;

    /* eslint-disable  no-underscore-dangle, no-inner-declarations */
    function playRandomlySelectedSeagull() {
      if (!map.globalView) {
        const randomlySelectedSeagull = seagulls[randomIndex()];
        if (randomlySelectedSeagull._src === lastSelectedSeagull) {
          playRandomlySelectedSeagull();
        } else {
          randomlySelectedSeagull.play();
          lastSelectedSeagull = randomlySelectedSeagull._src;
          setTimeout(() => {
            playRandomlySelectedSeagull();
          }, randomTimeoutDuration());
        }
      }
    }
    /* eslint-enable  no-underscore-dangle, no-innerdeclarations */

    setTimeout(() => {
      playRandomlySelectedSeagull();
    }, 1000);
  } else if (!map.globalView) {
    seagulls.forEach(seagull => {
      seagull.stop();
    });
  }
}

export {
  audioCtx,
  biquadFilter,
  gainNode,
  slideLeft,
  slideRight,
  filterChange,
  mouseEnterIslandNameOrHomeLink,
  mouseEnterArrowButtonOrMarkerOrHomeLink,
  mouseClick,
  ajaxSuccess,
  ajaxError,
  playOrStopSeagullSFX,
  ocean
};
