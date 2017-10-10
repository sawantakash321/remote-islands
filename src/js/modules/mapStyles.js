const mapStyles = [
  {
    featureType: 'landscape',
    elementType: 'all',
    stylers: [
      {
        lightness: -5
      },
      {
        saturation: -24
      },
      {
        gamma: 0.95
      }
    ]
  },
  {
    featureType: 'road',
    elementType: 'all',
    stylers: [
      {
        visibility: 'on'
      }
    ]
  },
  {
    featureType: 'road.local',
    elementType: 'all',
    stylers: [
      {
        lightness: 0
      }
    ]
  },
  {
    featureType: 'road.local',
    elementType: 'geometry.fill',
    stylers: [
      {
        lightness: -3
      }
    ]
  },
  {
    featureType: 'water',
    elementType: 'all',
    stylers: [
      {
        color: '#51AFBC'
      }
    ]
  },
  {
    elementType: 'labels',
    stylers: [
      {
        visibility: 'off'
      }
    ]
  }
]; // End of mapStyles.

export default mapStyles;
