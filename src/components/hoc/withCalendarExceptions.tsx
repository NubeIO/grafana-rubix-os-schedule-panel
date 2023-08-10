import React from 'react';
import { EventOutput, RawData } from 'types';
import * as exceptionService from 'components/exception/exception.service';

interface Props {
  events: EventOutput[];
  startAccessorField: string;
  value: RawData;
  endAccessorField: string;
  onNavigate: (visibleDate: any) => void;
  onSelectEvent: (event: EventOutput) => void;
  eventPropGetter: (event: any) => void;
  localizer: any;
  components: any;
  defaultView: string;
  dates: string;
}

function withCalendarExceptions(ComposedComponent: any) {
  // eslint-disable-next-line react/display-name
  return (props: Props) => {
    const exceptions = exceptionService.getExceptionEvents(props?.value?.exception, props.dates);

    return <ComposedComponent {...props} events={[...props.events, ...exceptions]} />;
  };
}

export default withCalendarExceptions;
