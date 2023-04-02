import React from 'react';
import fieldStyles from './fieldStyle';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete/Autocomplete';

function AutoCompleteSearchField(props: any) {
  const { options, name, touched, value, label, errors, autoCompleteFilter, onChange } = props;
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
          // Regular option
          return option[name] || '';
        }}
        renderInput={(params) => {
          return (
            <TextField
              {...params}
              name="name"
              label={label}
              size="small"
              variant="outlined"
              error={touched[name] && Boolean(errors[name])}
              helperText={(touched[name] && errors[name]) || ''}
            />
          );
        }}
        value={value}
        onChange={onChange}
        filterOptions={(options, params) => autoCompleteFilter(options, params)}
      />
    </div>
  );
}

export default AutoCompleteSearchField;
