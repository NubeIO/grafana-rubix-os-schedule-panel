import { EventDate, RawData } from 'types';
import { v4 as uuidv4 } from 'uuid';
import { Exception, ExceptionOutputEvent } from './exception.model';
import moment from 'moment-timezone';
import { DATE_FORMAT } from 'components/EventModal';

export function getExceptionInstance(
  id: string | null,
  name: string,
  color: string,
  dates: EventDate[],
  value: number
): Exception {
  return {
    id: id ? id : uuidv4(),
    name,
    color,
    dates: dates,
    value,
  };
}

export function updateData(exception: Exception, data: RawData) {
  const exceptionData = data?.exception ? data.exception : {};
  return {
    ...data,
    exception: {
      ...exceptionData,
      [exception.id]: {
        ...exception,
      },
    },
  };
}
interface ExceptionDTO {
  color: string;
  dates: EventDate[];
  id: string;
  name: string;
  value: number;
}

export function transformExceptionEvent(
  event: ExceptionDTO,
  selectedYear: number,
  timezone: string
): ExceptionOutputEvent {
  return {
    ...event,
    dates:
      event?.dates?.map(function (date) {
        return {
          start: moment.tz(date.start, DATE_FORMAT, timezone).format(DATE_FORMAT),
          end: moment.tz(date.end, DATE_FORMAT, timezone).format(DATE_FORMAT),
        };
      }) || [],
    title: event.name,
  };
}

export const convertDateTimeToDate = (datetime: string, timezone: string) => {
  const m = moment.tz(datetime, timezone);
  return new Date(m.year(), m.month(), m.date(), 0, 0, 0);
};

export function getExceptionEvents(
  exception: any = {},
  selectedDate: string,
  timezone: string
): ExceptionOutputEvent[] {
  const sDate = new Date(selectedDate);
  const selectedYear = sDate.getFullYear();
  const selectedYears = [selectedYear - 1, selectedYear, selectedYear + 1];
  return selectedYears
    .map((currentYear) =>
      Object.keys(exception).map((key) => transformExceptionEvent(exception[key], currentYear, timezone))
    )
    .flat();
}
