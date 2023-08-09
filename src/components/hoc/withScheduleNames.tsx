import React, { useState, useEffect } from 'react';
import _cloneDeep from 'lodash/cloneDeep';

import { PanelOptions } from 'types';
import _get from 'lodash/get';

interface Props {
  _client: any;
  value: any;
  topics: string[];
  setIsRunning: any;
  isRunning: boolean;
  options: PanelOptions;
  syncData: Function;
  openGenericDialog?: Function;
}

const withScheduleNames = (ComposedComponent: any) => (props: Props) => {
  const [scheduleNameCollection, setScheduleNameCollection] = useState<string[]>([]);
  const [defaultScheduleName, updateDefaultScheduleName] = useState<string | undefined>();

  useEffect(() => {
    let { scheduleNames = [], defaultTitle } = props.options || {};
    setScheduleNameCollection(scheduleNames);
    updateDefaultScheduleName(defaultTitle);
  }, [props.options]);

  return (
    <ComposedComponent {...props} scheduleNames={scheduleNameCollection} defaultScheduleName={defaultScheduleName} />
  );
};

export default withScheduleNames;
