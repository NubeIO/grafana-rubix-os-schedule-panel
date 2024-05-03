import React, { useState, useEffect } from 'react';
import Slider from '@material-ui/core/Slider';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import fieldStyle from './fieldStyle';

interface Props {
  min: any;
  max: any;
  step: any;
  value: string | number | number[] | undefined;
  label: string;
  inputType?: string;
  touched: any;
  errors: any;
  name: string;
  onChange: (eventDates: number, error: string) => void;
}

function SliderValueField(props: Props) {
  const { min, max, step, label, value: input = 0, inputType, errors, name, onChange } = props;
  let parseValue: number;
  if (input instanceof String) {
    parseValue = parseFloat(input.toString());
  } else {
    parseValue = input as number;
  }
  const classes = fieldStyle();

  const [value, setValue] = useState(parseValue);
  const [error, setError] = useState('');

  useEffect(() => {
    onChange(value, error);
  }, [value, error]);

  switch (inputType) {
    case 'number':
      return (
        <div className={classes.input}>
          <TextField
            label={label}
            type="number"
            id="number-input"
            variant="outlined"
            size="small"
            name={name}
            value={value}
            className={classes.textField}
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              step: step,
              min: min,
              max: max,
            }}
            onChange={(event) => {
              const value = event.target.value;
              try {
                setValue(parseFloat(value));
                if (value > min && value < max) {
                  setError('');
                } else {
                  setError('Input should be less than ' + max + ' and greater than ' + min);
                }
              } catch (e) {
                setError('Input should be a number.');
              }
            }}
            helperText={errors[name] || ''}
            error={Boolean(errors[name])}
          />
        </div>
      );
    default:
      return (
        <div className={classes.input}>
          <Typography gutterBottom>{label}</Typography>
          <Slider
            id="slider"
            name="value"
            min={min}
            max={max}
            value={parseValue ?? 0}
            step={step}
            marks={[
              { value: min, label: min },
              { value: max, label: max },
            ]}
            valueLabelDisplay="auto"
            aria-labelledby="continuous-slider"
            onChange={(_, value) => {
              return onChange(value as number, '');
            }}
          />
        </div>
      );
  }
}

export default SliderValueField;
