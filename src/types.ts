import moment from 'moment-timezone';

type InputType = 'number' | 'slider';
export type Operation = 'add' | 'edit';

export interface PanelOptions {
  defaultTitle: string;
  hasPayload: boolean;
  min?: number;
  max?: number;
  default?: number;
  step?: number;
  inputName?: string;
  scheduleNames?: any;
  inputType: InputType;
  disableWeeklyEvent: boolean;
  disableException: boolean;
  disableEvent: boolean;
}

export interface EventDate {
  start: string; // 2020-07-20T02:00:00.000Z
  end: string; // 2020-07-20T08:00:00.000Z
  error?: string;
  isIncomplete?: boolean;
}

export interface Weekly {
  id: string;
  name: string;
  value: number | string;
  color: string;
  days: string[];
  start: string; // 1:00
  end: string; // 2:00
}

export interface ExceptionPayload {
  title: string;
  month: string | number;
  day: string | number;
}

export interface ExceptionEvent {
  id: string;
  name: string;
  value: number | string;
  color: string;
  dates: EventDate[];
}

export interface Event {
  id: string;
  name: string;
  value: number | string;
  color: string;
  dates: EventDate[];
}

export interface ExtractionOption {
  day: moment.Moment;
  dayString: string;
}

export interface EventOutput {
  id: string;
  start: Date;
  end: Date;
  title: string;
  value: number | string;
  color: string;
  isWeekly: boolean;
  isHoliday?: boolean;
  event: Weekly | Event;
  backupEvent: Weekly | Event;
  dates?: EventDate[];
  days?: moment.Moment[] | string[]; // string[] when even got selected
  dayString?: string;
}

export interface RawData {
  events: any;
  weekly: any;
  exception: any;
}

export interface InputData {
  schedule: {
    schedules: {
      events: any;
      weekly: any;
      exception: any;
    };
  };
}
export interface DataFieldKeyI {
  [key: string]: string;
}
