import React from 'react';
import { Select } from '@grafana/ui';
import _get from 'lodash/get';

function getOptions(props: any) {
  const scheduleNames = _get(props, 'context.options.scheduleNames.scheduleNames', {});
  const scheduleNameIds = _get(props, 'context.options.scheduleNames.scheduleNameIds', []);
  if (!(scheduleNameIds.length > 0)) {
    return [];
  }
  return scheduleNameIds.map((id: string) => scheduleNames[id]);
}

function DefaultScheduleName(props: any) {
  const { value, onChange } = props;
  const val = typeof value === 'string' ? value : value?.name;

  return (
    <Select
      {...props}
      options={getOptions(props)}
      getOptionLabel={(option) => option?.name}
      getOptionValue={(option) => option?.id}
      value={val}
      onChange={(v) => {
        onChange(v.name);
      }}
    />
  );
}

export default DefaultScheduleName;
