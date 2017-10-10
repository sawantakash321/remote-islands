function getNumberToDivideTextboxHeightBy(currentIsland) {
  let number;
  switch (currentIsland) {
    case 'Amsterdam Island':
      number = 1.85;
      break;
    case 'Christmas Island':
      number = 1.7;
      break;
    case 'St Kilda':
      number = 1.875;
      break;
    case 'Ascension Island':
      number = 1.74;
      break;
    case 'Brava':
      number = 1.75;
      break;
    case 'Tristan da Cunha':
      number = 1.7;
      break;
    case 'Antipodes Island':
      number = 1.55;
      break;
    case 'Banaba Island':
      number = 1.61;
      break;
    case 'Pingelap':
      number = 1.55;
      break;
    case 'Easter Island':
      number = 1.5;
      break;
    case 'Pukapuka':
      number = 1.8;
      break;
    case 'Peter I Island':
      number = 1.9;
      break;
    case 'Deception Island':
      number = 1.85;
      break;
    case 'Rudolph Island':
      number = 1.4;
      break;
    default:
      throw new Error('Error adjusting pan position in desktop view.');
  }
  return number;
} // End of getNumberToDivideTextboxHeightBy().

export default getNumberToDivideTextboxHeightBy;
