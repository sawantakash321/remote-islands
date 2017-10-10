// Formats the date so that its contents are unabbreviated and properly suffixed, i.e. 'Mon' will
// become 'Monday', 'Aug' will become 'August', '04' will become '4th', etc. Here we also enable
// Webpack's code splitting feature. This allows us to withhold loading certain scripts until the
// time they're actually needed - in our case, when a user clicks a marker. The '_unabbreviateDate'
// script is small - only 2kb - so it hardly makes a difference for this website, but that's besides
// the point. You could imagine how handy code splitting could be when scaled up to much larger
// projects. Projects I'd like to work on! Hire me, for god's sake! :)
function unabbreviateDate(abbreviatedDate) {
  let [day, month, date, , time] = abbreviatedDate; // eslint-disable-line prefer-const

  switch (day) {
    case 'Mon':
      day = 'Monday';
      break;
    case 'Tue':
      day = 'Tuesday';
      break;
    case 'Wed':
      day = 'Wednesday';
      break;
    case 'Thu':
      day = 'Thursday';
      break;
    case 'Fri':
      day = 'Friday';
      break;
    case 'Sat':
      day = 'Saturday';
      break;
    case 'Sun':
      day = 'Sunday';
      break;
    default:
      throw new Error('Day of the week abbreviation not recognised.');
  }

  switch (month) {
    case 'Jan':
      month = 'January';
      break;
    case 'Feb':
      month = 'February';
      break;
    case 'Mar':
      month = 'March';
      break;
    case 'Apr':
      month = 'April';
      break;
    case 'May':
      month = 'May';
      break;
    case 'Jun':
      month = 'June';
      break;
    case 'Jul':
      month = 'July';
      break;
    case 'Aug':
      month = 'August';
      break;
    case 'Sep':
      month = 'September';
      break;
    case 'Oct':
      month = 'October';
      break;
    case 'Nov':
      month = 'November';
      break;
    case 'Dec':
      month = 'December';
      break;
    default:
      throw new Error('Month abbreviation not recognised.');
  }

  date = parseInt(date, 10);

  if (date === 1 || date === 21 || date === 31) {
    date += 'st';
  } else if (date === 2 || date === 22) {
    date += 'nd';
  } else if (date === 3 || date === 23) {
    date += 'rd';
  } else if ((date >= 4 && date <= 20) || (date >= 24 && date <= 30)) {
    date += 'th';
  } else {
    throw new Error('Date is not valid.');
  }

  return [day, month, date, time];
} // End of unabbreviateDate().

export default unabbreviateDate;
