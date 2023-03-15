import React, { useEffect, useState, MouseEvent } from 'react';
import moment from 'moment-timezone';

interface Props {
  timezone: string;
  children?: (toggleTimezone: (event: MouseEvent) => void, timezone: string, timezoneName: string) => void;
}

const defaultProps: Props = {
  timezone: 'UTC',
};

export default function TimezoneToggle<IProps>(props = defaultProps) {
  const [timezone, setTimezone] = useState('');
  const [timezoneName, setTimezoneName] = useState('');
  const [isLocal, setIsLocal] = useState(false);

  useEffect(() => {
    setTimezone(props.timezone);
    setTimezoneName(props.timezone);
  }, [props.timezone]);

  const toggleTimezone = () => {
    const isLocal$ = !isLocal;
    setIsLocal(isLocal$);
    setTimezone(isLocal$ ? moment.tz.guess() : props.timezone);
    setTimezoneName(isLocal$ ? 'Local' : props.timezone);
  };

  return (
    <>
      {props.children &&
        props.children(
          toggleTimezone,
          timezone, // Emits the current color
          timezoneName
        )}
    </>
  );
}
