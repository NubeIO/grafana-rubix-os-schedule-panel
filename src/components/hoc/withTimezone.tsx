import React, { Component } from 'react';
// @ts-ignore
import { accessor } from 'react-big-calendar/lib/utils/accessors';
import moment from 'moment-timezone';
import { DAY_MAP, enumerateDaysBetweenDates, getFromStartAndEnd } from 'utils';
import { EventOutput, RawData } from '../../types';

export const convertDateTimeToDate = (datetime: string) => {
  const m = moment(datetime);
  return new Date(m.year(), m.month(), m.date(), m.hour(), m.minute(), 0);
};

export const convertTimeFromTimezone = (dateM: moment.Moment) => {
  return moment({
    year: dateM.year(),
    month: dateM.month(),
    date: dateM.date(),
    hour: dateM.hour(),
    minute: dateM.minute(),
  });
};

export const convertWeekFromTimezone = (days: string[], start: string) => {
  return enumerateDaysBetweenDates(moment().startOf('week'), moment().endOf('week'), true, true)
    .map((el) => getFromStartAndEnd(el, start))
    .filter((day) => days.includes(DAY_MAP[day.day()]))
    .map((el) => el.format('dddd').toLowerCase());
};

interface Props {
  events: EventOutput[];
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
    accessor = (event: object, field: string) => {
      const value = accessor(event, field);
      return convertDateTimeToDate(value);
    };

    static defaultProps = {
      events: [],
      startAccessor: 'start',
      endAccessor: 'end',
    };

    render() {
      const { startAccessorField, endAccessorField, onSelectEvent } = this.props;

      const bigCalendarProps = {
        ...this.props,
        startAccessor: (event: object) => this.accessor(event, startAccessorField),
        endAccessor: (event: object) => this.accessor(event, endAccessorField),
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
                start: start ? convertDateTimeToDate(start) : undefined,
                end: end ? convertDateTimeToDate(end) : undefined,
              });
            }
            const { dates } = event;
            onSelectEvent({
              ...restProps,
              ...event,
              days: days ? days.map((day) => moment(day).format('dddd').toLowerCase()) : [],
              dates: dates,
              start: start ? convertDateTimeToDate(start) : undefined,
              end: end ? convertDateTimeToDate(end) : undefined,
            });
          }),
      };

      return <Calendar {...bigCalendarProps} views={['month', 'week', 'day']} showMultiDayTimes />;
    }
  };
}
