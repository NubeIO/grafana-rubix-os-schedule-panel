import React from 'react';
import { makeStyles } from '@material-ui/core';

interface Props {
  event: any;
  title: string;
  isHoliday?: boolean;
}

const useStyles = makeStyles({
  title: {
    fontWeight: 500,
  },
  value: {
    fontSize: 10,
  },
  holiday: {
    '&span': {
      fontWeight: 'normal',
      fontSize: 8,
    },
  },
  event: {
    opacity: 1,
  },
});

const CustomEvent = (props: Props) => {
  const classes = useStyles();
  return (
    <div className={classes.event}>
      <span className={classes.title}>{props.title}</span>
      {props.title && <br />}
      <span className={classes.value}>{props.event.value}</span>
    </div>
  );
};

export default CustomEvent;
