import { DateTime } from '@grafana/data';

export interface Holiday {
  id: string;
  name: string;
  date: string | Date | DateTime;
  color: string;
  value: number;
}

export interface HolidayOutputEvent {
  id: string;
  name: string;
  date: string | Date | DateTime;
  color: string;
  value: number | string;
  start: Date;
  isHoliday?: boolean;
  end: Date;
  title: string;
}
