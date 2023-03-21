import { DATE_FORMAT } from 'components/EventModal';
import moment from 'moment-timezone';
import { ExtractionOption, Weekly, Event, EventOutput } from './types';

/**
 * Gets the list of dates that would be visible in calendar view with dates from
 * previous and next month, that lies in the week of starting-1 and ending+1 day.
 * Here we are including starting-1 and ending+1 day to include all timezone dates on this range.
 * @param {number|string} [visibleDate] Date of the month whose output is required
 * @return {moment.Moment[]}
 */
export function getDaysArrayByMonth(visibleDate: moment.Moment) {
  const start = visibleDate.clone().startOf('week').add(-1, 'day');
  const end = moment(visibleDate).endOf('month').endOf('week').add(1, 'day');
  return enumerateDaysBetweenDates(start, end, true, true);
}

/**
 * Dict of days of the week mapped to their full texts
 * @type {Object.<number, string>}
 */
export const DAY_MAP: { [index: number]: string } = {
  0: 'sunday',
  1: 'monday',
  2: 'tuesday',
  3: 'wednesday',
  4: 'thursday',
  5: 'friday',
  6: 'saturday',
};

/**
 * Gets a list of dates that lie between the startDate and endDate
 * @param {number|string} [startDate] - Input date, output doesn't include this day by default
 * @param {number|string} [endDate] - Input date, output doesn't include this day by default
 * @param {boolean} [inclusiveStart = false] - If true adds startDate to output
 * @param {boolean} [inclusiveEnd = false] - If true adds endDate to output
 * @return {moment[]}
 */
export function enumerateDaysBetweenDates(
  startDate: moment.Moment,
  endDate: moment.Moment,
  inclusiveStart = false,
  inclusiveEnd = false
) {
  const dates: moment.Moment[] = [];

  const currDate = startDate.clone().startOf('day');
  const lastDate = endDate.clone().startOf('day');
  if (inclusiveStart) {
    dates.push(currDate.clone());
  }
  while (currDate.add(1, 'days').diff(lastDate) < 0) {
    dates.push(currDate.clone());
  }
  if (inclusiveEnd && currDate !== lastDate) {
    dates.push(currDate.clone());
  }

  return dates;
}

export function getStartAndEndWithTimezone(baseDate: moment.Moment, time: string, timezone: string) {
  const startTime = time.split(':');
  return moment.tz(
    {
      year: baseDate.year(),
      month: baseDate.month(),
      date: baseDate.date(),
      hour: startTime[0],
      minute: startTime[1],
      second: startTime[2] || 0,
    },
    timezone
  );
}

/**
 * Converts the given time into UTC by using the base date for date
 * @param baseDate - Used for setting the date (year, month, day)
 * @param time - Time in format HH:mm:ss or HH:mm
 * @return {moment} Time in UTC
 */
export function getTimezoneFromStartAndEnd(baseDate: moment.Moment, time: string, timezone: string): moment.Moment {
  const startTime = time.split(':');
  return moment.tz(
    {
      year: baseDate.year(),
      month: baseDate.month(),
      date: baseDate.date(),
      hour: startTime[0],
      minute: startTime[1],
      second: startTime[2] || 0,
    },
    timezone
  );
}

/**
 * @param {Weekly} event - Get Start and end date from data according to options
 * @param {ExtractionOption} options - Options used while extracting data from event
 * @return {{startDate: (moment.Moment), endDate: (moment.Moment)}}
 */
function getStartAndEndDateTimezone(
  event: Weekly,
  options: ExtractionOption,
  timezone: string,
): { startDate: moment.Moment; endDate: moment.Moment } {
  const { day } = options;
  let time = day.clone();
  const startDate = getTimezoneFromStartAndEnd(time, event.start, timezone);

  let endDate = day.clone();
  time = event.start > event.end ? moment(endDate).add(1, 'days') : endDate;
  endDate = getTimezoneFromStartAndEnd(time, event.end, timezone);
  return { startDate, endDate };
}

export const convertWeekToTimezone = (event: Weekly, timezone: string): moment.Moment[] => {
  const { start, days } = event;
  return enumerateDaysBetweenDates(moment().startOf('week'), moment().endOf('week'), true, true)
    .map((el) => getTimezoneFromStartAndEnd(el, start, timezone))
    .filter((day) => days.includes(DAY_MAP[day.day()]));
};

/**
 * Processes the data from API to input for calendar.
 * @param {Object.<string, Weekly|Event>} events - Dict of events where key represents the id
 * @param {ExtractionOption} options - Options used while extracting data from event
 * @return {EventOutput[]}
 */
export function extractEvents(events: { [id: string]: Weekly | Event }, timezone: string, isHoliday: boolean = false, options?: ExtractionOption,): EventOutput[] {
  const eventsCollection: EventOutput[] = [];
  for (const eventId in events) {
    if (events[eventId]) {
      const event = events[eventId];
      if (!options) {
        let { dates } = event as Event;
        dates = dates || [];
        dates.forEach((date) => {
          const { start, end } = date;
          eventsCollection.push({
            id: eventId,
            start: moment.tz(start, DATE_FORMAT, timezone).toDate(),
            end: moment.tz(end, DATE_FORMAT, timezone).toDate(),
            title: event.name,
            value: event.value,
            color: event.color,
            isWeekly: false,
            isHoliday: isHoliday,
            event: event,
            backupEvent: event,
          });
        });
      } else {
        const { dayString } = options;
        const { startDate, endDate } = getStartAndEndDateTimezone(event as Weekly, options, timezone);

        eventsCollection.push({
          id: eventId,
          start: moment.tz(startDate, timezone).toDate(),
          end: moment.tz(endDate, timezone).toDate(),
          title: event.name,
          value: event.value,
          color: event.color,
          days: convertWeekToTimezone(event as Weekly, timezone),
          isWeekly: true,
          dayString,
          event: event,
          backupEvent: event,
        });
      }
    }
  }
  return eventsCollection;
}
