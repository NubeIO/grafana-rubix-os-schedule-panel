import { PanelData } from '@grafana/data';
import _get from 'lodash/get';
import { DataFieldKeyI } from 'types';

export const dataFieldKeys: DataFieldKeyI = {
  TIME: '0',
  WRITER: '1',
  PRIORITY: '2',
};

export const getFieldValue = (fieldKey: string, data: PanelData): any => {
  const series = _get(data, 'series', []);
  if (!series.length) {
    return null;
  }
  const latestIdx = series.length - 1;
  if (!fieldKey) {
    throw new Error('Data field key is required');
  }

  return _get(series, `${latestIdx}.fields[${Number(fieldKey)}].values.buffer[0]`, null);
};
