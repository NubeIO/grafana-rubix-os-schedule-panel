import React, { useEffect, useState } from 'react';
import moment from 'moment-timezone';
import { ButtonGroup, RadioButtonGroup, Spinner, ToolbarButton, ToolbarButtonRow, useTheme } from '@grafana/ui';
import flowRight from 'lodash/flowRight';
import _cloneDeep from 'lodash/cloneDeep';
import MomentUitls from '@date-io/moment';
import red from '@material-ui/core/colors/red';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { makeStyles, ThemeProvider, createTheme } from '@material-ui/core/styles';

import EventModal from './EventModal';
import CustomEvent from './CustomEvent';
import withTimeZone from './hoc/withTimezone';
import { DIALOG_NAMES } from '../constants/dialogNames';
import withGenericDialog from './hoc/withGenericDialog';
import withScheduleNames from './hoc/withScheduleNames';
import withCalendarExceptions from './hoc/withCalendarExceptions';
import { DAY_MAP, extractEvents, getDaysArrayByMonth } from '../utils';
import { EventOutput, Event, Weekly, PanelOptions, Operation, RawData } from '../types';

interface Props {
  value: any;
  setIsRunning: any;
  isRunning: boolean;
  options: PanelOptions;
  syncData: Function;
  openGenericDialog?: Function;
  scheduleNames: string[];
}

const CalendarHOC = flowRight(withTimeZone, withCalendarExceptions)(Calendar);

function AppContainer(props: any) {
  return (
    <ThemeProvider theme={createTheme({})}>
      <MuiPickersUtilsProvider utils={MomentUitls}>{props.children}</MuiPickersUtilsProvider>
    </ThemeProvider>
  );
}

function ScheduleCalendar(props: Props) {
  const { value, options, isRunning, setIsRunning, syncData, openGenericDialog = (f: any) => f } = props;

  const classes = useStyles();
  const theme = useTheme();
  if (theme.isDark) {
    require('./ScheduleCalendarDark.scss');
  } else {
    require('./ScheduleCalendarLight.scss');
  }

  const staticLocalizer = momentLocalizer(moment);
  const timezone = options.timezone || 'UTC';

  const [eventCollection, setEventCollection] = useState<EventOutput[]>([]);
  const [visibleDate, setVisibleDate] = useState(moment());
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isWeekly, setIsWeekly] = useState(false);
  const [eventOutput, setEventOutput] = useState<EventOutput | null>(null);
  const [operation, setOperation] = useState<Operation>('add');

  useEffect(() => {
    updateEvents();
  }, [value, visibleDate]);

  const updateEvents = () => {
    const {
      schedule: {
        schedules: { events = {}, weekly = {}, exception = {} },
      },
    } = value || {};
    let eventsCollection: EventOutput[] = [];

    const isolatedEvents = extractEvents(events, timezone);
    const exceptionEvents = extractEvents(exception, timezone, true);

    const days = getDaysArrayByMonth(visibleDate);

    const dayEventsCollection = [];

    const dayEventMap: { [day: string]: { [id: string]: Weekly } } = {};
    for (const wKey in weekly) {
      if (weekly.hasOwnProperty(wKey) && weekly[wKey]) {
        const item: Weekly = weekly[wKey];
        item.days.forEach((d) => {
          if (!dayEventMap[d]) {
            dayEventMap[d] = {};
          }
          dayEventMap[d][wKey] = item;
        });
      }
    }

    for (let i = 0; i < days.length; i += 1) {
      const day = days[i];
      const dayNumeric = day.day();
      const dayString = DAY_MAP[dayNumeric];
      const dayEventsMap = dayEventMap[dayString];
      if (dayEventsMap) {
        const dayEvents = extractEvents(dayEventsMap, timezone, false, {
          day,
          dayString,
        });
        dayEventsCollection.push(dayEvents);
      }
    }
    eventsCollection = eventsCollection.concat(isolatedEvents, exceptionEvents, ...dayEventsCollection);
    setEventCollection(eventsCollection);

    if (!options.hasPayload) {
      setEventCollection(
        eventsCollection.map((eventOutput: any) => {
          eventOutput.value = '';
          return eventOutput;
        })
      );
    }
    setIsRunning(false);
  };

  const addEvent = (isWeekly: boolean) => {
    setIsOpenModal(true);
    setOperation('add');
    setIsWeekly(isWeekly);
    setEventOutput(null);
  };

  const onModalClose = () => {
    setIsOpenModal(false);
  };

  const onSelectEvent = (eventOutput: EventOutput) => {
    if (eventOutput.isHoliday) {
      return openGenericDialog(DIALOG_NAMES.editExceptionDialog, { exception: eventOutput });
    }
    setOperation('edit');
    setIsWeekly(eventOutput.isWeekly);
    setEventOutput(eventOutput);
    setIsOpenModal(true);
  };

  const syncOnServer = (output: RawData) => {
    syncData(output);
    setIsOpenModal(false);
  };

  const handleModalSubmit = (event: Weekly | Event, id: string) => {
    let output: RawData = { events: {}, weekly: {}, exception: {} };

    try {
      output = { events: { ...value.events }, weekly: { ...value.weekly }, exception: { ...value.exception } };
    } catch (e) {}
    if (isWeekly) {
      output.weekly[id] = event;
    } else {
      output.events[id] = event;
    }
    syncOnServer(output);
  };

  const handleModalDelete = (id: string) => {
    const output: RawData = _cloneDeep(value) || {};
    if (isWeekly) {
      delete output.weekly[id];
    } else {
      delete output.events[id];
    }
    syncOnServer(output);
  };

  const onNavigate = (visibleDate: any) => {
    setVisibleDate(moment(visibleDate));
  };

  const eventStyleGetter = (event: Event | Weekly) => {
    const style = {
      backgroundColor: event.color,
      borderRadius: '2px',
      opacity: 0.8,
      color: 'white',
      border: '0px',
      display: 'block',
    };
    return {
      style,
    };
  };

  return (
    <>
      <ToolbarButtonRow>
        <ToolbarButton variant="default" disabled>
          {timezone}
        </ToolbarButton>
        <div className={classes.blankSpace} />
        <ToolbarButton
          variant="default"
          icon="plus-circle"
          onClick={() => openGenericDialog(DIALOG_NAMES.exceptionDialog, { isAddForm: true })}
        >
          Exception
        </ToolbarButton>
        <ToolbarButton
          variant="default"
          icon="plus-circle"
          onClick={() => addEvent(true)}
          disabled={options.disableWeeklyEvent}
        >
          Weekly Event
        </ToolbarButton>
        <ToolbarButton
          variant="default"
          icon="plus-circle"
          onClick={() => addEvent(false)}
          disabled={options.disableEvent}
        >
          Event
        </ToolbarButton>
      </ToolbarButtonRow>
      <div className={classes.calendar}>
        <CalendarHOC
          value={value}
          events={eventCollection}
          startAccessorField="start"
          endAccessorField="end"
          timezone={timezone}
          onNavigate={onNavigate}
          onSelectEvent={onSelectEvent}
          eventPropGetter={eventStyleGetter}
          localizer={staticLocalizer}
          components={{
            event: CustomEvent,
            toolbar: HeaderCellContent,
          }}
          defaultView="week"
          date={visibleDate.toDate()}
        />
      </div>
      <EventModal
        isOpenModal={isOpenModal}
        scheduleNames={props.scheduleNames}
        isWeekly={isWeekly}
        operation={operation}
        eventOutput={eventOutput}
        options={options}
        timezone={timezone}
        onClose={onModalClose}
        onSubmit={handleModalSubmit}
        onDelete={handleModalDelete}
      />
      {isRunning && (
        <div className={classes.spinner}>
          <Spinner size={12} />
        </div>
      )}
    </>
  );
}

const useStyles = makeStyles({
  toolbar: {
    display: 'flex',
    flexWrap: 'wrap',
    marginBottom: '8px',
    marginTop: '4px',
  },
  holiday: {
    color: red[500],
    borderColor: red[500],
  },
  blankSpace: {
    flexGrow: 1,
  },
  calendar: {
    height: 'calc(100% - 30px)',
  },
  spinner: {
    top: '-32px',
    right: '-2px',
    position: 'absolute',
  },
  titleWrapper: {
    position: 'absolute',
    left: '50%',
  },
  titleLabel: {
    position: 'relative',
    left: '-50%',
    fontWeight: 500,
  },
});

const ScheduleCalendarHoc = flowRight(withScheduleNames, withGenericDialog)(ScheduleCalendar);

export default function ScheduleCalendarCom(props: any) {
  return (
    <AppContainer>
      <ScheduleCalendarHoc {...props} />
    </AppContainer>
  );
}

const HeaderCellContent: React.FC<any> = (props: any) => {
  const {
    localizer: { messages },
    label,
    views,
    view,
    onView,
    onNavigate,
  } = props;
  const classes = useStyles();

  return (
    <div>
      <div className={classes.titleWrapper}>
        <span className={classes.titleLabel}>{label}</span>
      </div>
      <div className={classes.toolbar}>
        <ButtonGroup>
          <ToolbarButton variant="default" onClick={() => onNavigate('TODAY')}>
            {messages.today}
          </ToolbarButton>
          <ToolbarButton variant="default" onClick={() => onNavigate('PREV')}>
            {messages.previous}
          </ToolbarButton>
          <ToolbarButton variant="default" onClick={() => onNavigate('NEXT')}>
            {messages.next}
          </ToolbarButton>
        </ButtonGroup>
        <div className={classes.blankSpace} />
        <RadioButtonGroup
          options={views.map((name: string) => {
            return { label: messages[name], value: name };
          })}
          value={view}
          onChange={(v) => onView(v!)}
        />
      </div>
    </div>
  );
};
