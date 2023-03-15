import React, { Component } from 'react';
// @ts-ignore
import { accessor } from 'react-big-calendar/lib/utils/accessors';
import moment from 'moment-timezone';
import { DAY_MAP, enumerateDaysBetweenDates, getStartAndEndWithTimezone } from 'utils';
import { EventOutput, RawData } from '../../types';

export const convertDateTimeToDate = (datetime: string, timezone: string) => {
  const m = moment.tz(datetime, timezone);
  return new Date(m.year(), m.month(), m.date(), m.hour(), m.minute(), 0);
};

export const convertTimezoneFromUtc = (date: string, timezone: string) => {
  return moment.tz(moment.utc(date), timezone);
};

export const convertTimeFromTimezone = (dateM: moment.Moment, timezone: string) => {
  return moment
    .tz(
      {
        year: dateM.year(),
        month: dateM.month(),
        date: dateM.date(),
        hour: dateM.hour(),
        minute: dateM.minute(),
      },
      timezone
    )
    .utc();
};

export const convertWeekFromTimezoneToUTC = (days: string[], start: string, timezone: string) => {
  return enumerateDaysBetweenDates(moment().startOf('week'), moment().endOf('week'), true, true)
    .map((el) => getStartAndEndWithTimezone(el, start, timezone))
    .filter((day) => days.includes(DAY_MAP[day.day()]))
    .map((el) => el.utc().format('dddd').toLowerCase());
};

interface Props {
  events: EventOutput[];
  timezone: string;
  startAccessorField: string;
  endAccessorField: string;
  onNavigate: (visibleDate: any) => void;
  onSelectEvent: (event: EventOutput) => void;
  eventPropGetter: (event: any) => void;
  localizer: any;
  components: any;
  defaultView: string;
  date?: string | Date;
  value: RawData;
}

export default function withTimeZone(Calendar: any) {
  // eslint-disable-next-line react/display-name
  return class extends Component<Props> {
    accessor = (event: object, field: string, timezone: string) => {
      const value = accessor(event, field);
      return convertDateTimeToDate(value, timezone);
    };

    static defaultProps = {
      events: [],
      startAccessor: 'start',
      endAccessor: 'end',
      timezone: 'UTC',
    };

    render() {
      const { timezone, startAccessorField, endAccessorField, onSelectEvent } = this.props;

      const bigCalendarProps = {
        ...this.props,
        startAccessor: (event: object) => this.accessor(event, startAccessorField, timezone),
        endAccessor: (event: object) => this.accessor(event, endAccessorField, timezone),
        onSelectEvent:
          onSelectEvent &&
          (({
            start,
            end,
            days,
            event,
            isHoliday,
            ...restProps
          }: {
            start: string;
            end: string;
            days: moment.Moment[];
            event: any;
            isHoliday?: boolean;
          }) => {
            if (isHoliday) {
              return onSelectEvent({
                ...restProps,
                ...event,
                isHoliday: true,
                start: start ? convertDateTimeToDate(start, timezone) : undefined,
                end: end ? convertDateTimeToDate(end, timezone) : undefined,
              });
            }
            const { dates } = event;
            onSelectEvent({
              ...restProps,
              ...event,
              days: days ? days.map((day) => moment(day).tz(timezone).format('dddd').toLowerCase()) : [],
              dates: dates,
              start: start ? convertDateTimeToDate(start, timezone) : undefined,
              end: end ? convertDateTimeToDate(end, timezone) : undefined,
            });
          }),
      };

      return <Calendar {...bigCalendarProps} views={['month', 'week', 'day']} showMultiDayTimes />;
    }
  };
}
