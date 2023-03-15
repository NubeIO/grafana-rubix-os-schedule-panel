import React, { useState } from 'react';
import { createStyles, TextField, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import moment from 'moment-timezone';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import { EventDate } from '../types';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    dateRange: {
      display: 'flex',
    },
    textField: {
      marginRight: theme.spacing(2),
      flex: 1,
    },
    buttonWrapper: {
      flex: 0,
      display: 'flex',
      alignItems: 'center',
      '&:not(:last-child)': {
        marginRight: theme.spacing(1),
      },
    },
    button: {
      backgroundColor: theme.palette.type === 'dark' ? '#3e3e3e' : '#eaeaea',
    },
  })
);

interface DateRangeProps {
  values: [string, string];
  onChange: (eventDate: EventDate) => void;
  onDelete: () => void;
  onAdd: () => void;
  isIncomplete: boolean;
}

export default function DateRange(props: DateRangeProps) {
  const classes = useStyles();
  const [start, setStart] = useState(props.values[0]);
  const [end, setEnd] = useState(props.values[1]);
  const [error, setError] = useState(false);

  const handleStartDateChange = (e: any) => {
    setStart(e.target.value);
    if (!moment(e.target.value).isBefore(end)) {
      setError(true);
      props.onChange({ start: e.target.value, end, error: 'Invalid range' });
    } else {
      setError(false);
      props.onChange({ start: e.target.value, end, error: '' });
    }
  };

  const handleEndDateChange = (e: any) => {
    setEnd(e.target.value);
    if (!moment(e.target.value).isAfter(start)) {
      setError(true);
      props.onChange({ start, end: e.target.value, error: 'Invalid range' });
    } else {
      setError(false);
      props.onChange({ start, end: e.target.value, error: '' });
    }
  };

  return (
    <div className={classes.dateRange}>
      <TextField
        {...props}
        className={classes.textField}
        id="datetime-local"
        label="Start Date"
        type="datetime-local"
        value={start}
        onChange={handleStartDateChange}
        error={error}
        InputLabelProps={{
          shrink: true,
        }}
      />
      <TextField
        {...props}
        className={classes.textField}
        id="datetime-local"
        label="End Date"
        type="datetime-local"
        value={end}
        onChange={handleEndDateChange}
        error={error}
        InputLabelProps={{
          shrink: true,
        }}
      />
      <div className={classes.buttonWrapper}>
        <IconButton
          aria-label="add"
          className={classes.button}
          onClick={() => {
            props.onAdd();
          }}
        >
          <AddIcon color="primary" fontSize="small" />
        </IconButton>
      </div>
      <div className={classes.buttonWrapper}>
        {!props.isIncomplete ? (
          <IconButton
            aria-label="delete"
            className={classes.button}
            onClick={() => {
              props.onDelete();
            }}
          >
            <DeleteIcon color="secondary" fontSize="small" />
          </IconButton>
        ) : (
          <div style={{ width: 41.5 }} />
        )}
      </div>
    </div>
  );
}
