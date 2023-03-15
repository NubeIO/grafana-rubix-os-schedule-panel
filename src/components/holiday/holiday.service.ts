import { RawData } from 'types';
import { v4 as uuidv4 } from 'uuid';
import { Holiday, HolidayOutputEvent } from './holiday.model';
import moment from 'moment-timezone';

export function getHolidayInstance(id: string | null, name: string, color: string, date: any, value: number): Holiday {
  return {
    id: id ? id : uuidv4(),
    name,
    color,
    date: typeof date === 'string' ? date : date.format('MM-DD'),
    value,
  };
}

export function updateData(holiday: Holiday, data: RawData) {
  const holidayData = data?.holiday ? data.holiday : {};
  return {
    ...data,
    holiday: {
      ...holidayData,
      [holiday.id]: {
        ...holiday,
      },
    },
  };
}
interface HolidayDTO {
  color: string;
  date: string;
  id: string;
  name: string;
  value: number;
}

export function transformHolidayEvent(event: HolidayDTO, selectedYear: number, timezone: string): HolidayOutputEvent {
  const start = moment.tz(selectedYear.toString().concat('-', event.date), timezone).startOf('day').toDate();
  const end = moment.tz(selectedYear.toString().concat('-', event.date), timezone).endOf('day').toDate();

  return {
    ...event,
    end: end,
    start: start,
    isHoliday: true,
    title: event.name,
  };
}

export const convertDateTimeToDate = (datetime: string, timezone: string) => {
  const m = moment.tz(datetime, timezone);
  return new Date(m.year(), m.month(), m.date(), 0, 0, 0);
};

export function getHolidayEvents(holiday: any = {}, selectedDate: string, timezone: string): HolidayOutputEvent[] {
  const sDate = new Date(selectedDate);
  const selectedYear = sDate.getFullYear();
  const selectedYears = [selectedYear - 1, selectedYear, selectedYear + 1];
  return selectedYears
    .map((currentYear) => Object.keys(holiday).map((key) => transformHolidayEvent(holiday[key], currentYear, timezone)))
    .flat();
}
