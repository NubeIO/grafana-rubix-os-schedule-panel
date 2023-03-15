import React from 'react';
import { EventOutput, RawData } from 'types';
import * as holidayService from 'components/holiday/holiday.service';

interface Props {
  events: EventOutput[];
  timezone: string;
  startAccessorField: string;
  value: RawData;
  endAccessorField: string;
  onNavigate: (visibleDate: any) => void;
  onSelectEvent: (event: EventOutput) => void;
  eventPropGetter: (event: any) => void;
  localizer: any;
  components: any;
  defaultView: string;
  date: string;
}

function withCalendarHolidays(ComposedComponent: any) {
  // eslint-disable-next-line react/display-name
  return (props: Props) => {
    const holidays = holidayService.getHolidayEvents(props?.value?.holiday, props.date, props.timezone);

    return <ComposedComponent {...props} events={[...props.events, ...holidays]} />;
  };
}

export default withCalendarHolidays;
