import React, { useEffect, useState } from 'react';
import DateRange from './DateRange';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { EventDate } from '../types';
import { v4 as uuidv4 } from 'uuid';
import _clone from 'lodash/clone';

const useStyles = makeStyles(() =>
  createStyles({
    dateRangeCollection: {
      '&:not(:last-child)': {
        marginBottom: '2px',
      },
    },
  })
);

interface DateDict {
  [key: string]: EventDate;
}

interface DateRangeCollectionModel {
  inputDates: EventDate[];
  onChange: (eventDates: EventDate[], error: string) => void;
}

export default function DateRangeCollection(props: DateRangeCollectionModel) {
  const { inputDates, onChange, ...restProps } = props;
  const [dates, setDates] = useState<DateDict>({});
  const [lastDateKey, setLastDateKey] = useState('');
  const [errorKey, setErrorKey] = useState('');
  const [error, setError] = useState('');
  const classes = useStyles();

  useEffect(() => {
    let convertedDict: DateDict = {};
    inputDates.forEach((date) => {
      convertedDict[uuidv4()] = date;
    });
    if (!Object.keys(convertedDict).length) {
      const key = uuidv4();
      setLastDateKey(lastDateKey);
      convertedDict[key] = { start: '', end: '', isIncomplete: true };
    }
    setDates(convertedDict);
  }, inputDates);

  useEffect(() => {
    const reformattedEditedDates: EventDate[] = [];
    const errors: string[] = [];
    Object.keys(dates).forEach((key) => {
      const error = dates[key].error;
      if (error) {
        errors.push(error);
      }
      if (dates[key].start && dates[key].end) {
        delete dates[key].isIncomplete;
        delete dates[key].error;
        reformattedEditedDates.push(dates[key]);
      }
    });
    onChange(reformattedEditedDates, error ? error : errors.length ? errors[0] : '');
  }, [dates]);

  const handleChange = (eventDate: EventDate, key: string) => {
    let editedDates: DateDict = _clone(dates);
    editedDates[key] = eventDate;
    setDates(editedDates);
    if (key === errorKey) {
      setError('');
    }
  };

  const handleDelete = (key: string) => {
    const convertedDict: DateDict = _clone(dates);
    delete convertedDict[key];
    if (!Object.keys(convertedDict).length) {
      const key = uuidv4();
      setLastDateKey(lastDateKey);
      convertedDict[key] = { start: '', end: '', isIncomplete: true };
      setError('At least a date is required');
      setErrorKey(key);
    }
    setDates(convertedDict);
  };

  const handleAdd = () => {
    const convertedDict: DateDict = _clone(dates);
    if (!error) {
      const key = uuidv4();
      setLastDateKey(lastDateKey);
      convertedDict[key] = { start: '', end: '', isIncomplete: true };
      setError('At least a date is required');
      setErrorKey(key);
    }
    setDates(convertedDict);
  };

  return (
    <>
      {Object.keys(dates).map((key) => {
        const eventDate: EventDate = dates[key];
        return (
          <div key={key} className={classes.dateRangeCollection}>
            <DateRange
              {...restProps}
              isIncomplete={Boolean(eventDate.isIncomplete)}
              values={[eventDate.start, eventDate.end]}
              onChange={(event) => handleChange(event, key)}
              onDelete={() => handleDelete(key)}
              onAdd={() => handleAdd()}
            />
          </div>
        );
      })}
    </>
  );
}
