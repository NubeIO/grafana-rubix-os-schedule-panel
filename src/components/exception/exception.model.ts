import { EventDate } from 'types';

export interface Exception {
  id: string;
  name: string;
  dates: EventDate[];
  color: string;
  value: number;
}

export interface ExceptionOutputEvent {
  id: string;
  name: string;
  dates: EventDate[];
  color: string;
  value: number | string;
  title: string;
}
