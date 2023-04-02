import React from 'react';
import fieldStyles from './fieldStyle';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete/Autocomplete';

interface Props {
  options: any[];
  name: string;
  touched: any;
  value: string;
  label: string;
  errors: any;
  autoCompleteFilter: Function;
  listItemButton: any;
  onChange: (e: any, val: any) => void;
}

function CreatableSelectField(props: Props) {
  const { options, name, touched, value, label, errors, autoCompleteFilter, listItemButton, onChange } = props;
  const classes = fieldStyles();
  return (
    <div className={classes.input}>
      <Autocomplete
        className={classes.input}
        selectOnFocus
        clearOnBlur={true}
        handleHomeEndKeys
        options={options}
        openOnFocus={true}
        classes={{
          listbox: classes.listbox,
        }}
        getOptionLabel={(option: any) => {
          // Value selected with enter, right from the input
          if (typeof option === 'string') {
            return option;
          }
          // Add "xxx" option created dynamically
          if (option.inputValue) {
            return option.inputValue || '';
          }
          // Regular option
          return option[name] || '';
        }}
        renderOption={(option: any) => (
          <div className="schedule-name-listitem">
            <span>{option[name]}</span>
            <span>{option.button}</span>
          </div>
        )}
        freeSolo
        renderInput={(params) => {
          return (
            <TextField
              {...params}
              name="name"
              label={label}
              size="small"
              variant="outlined"
              error={touched[name] && Boolean(errors[name])}
              helperText={(touched.name && errors.name) || ''}
            />
          );
        }}
        value={value}
        onChange={onChange}
        filterOptions={(options, params) => {
          let filtered: any = autoCompleteFilter(options, params).map((val: any) => ({
            ...val,
            button: typeof listItemButton === 'function' ? listItemButton(val.id) : null,
          }));
          if (params.inputValue !== '') {
            const newOption = {
              name: `Add ${params.inputValue}`,
              inputValue: params.inputValue,
              id: null,
            };
            filtered = filtered.concat(newOption);
          }
          return filtered;
        }}
      />
    </div>
  );
}

export default CreatableSelectField;
