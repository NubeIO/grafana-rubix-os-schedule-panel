import { PanelPlugin } from '@grafana/data';
import moment from 'moment-timezone';
import { PanelOptions } from './types';
import { SimplePanel } from './SimplePanel';
import ScheduleNamesPanelPlugin from './components/scheduleNamesPlugin';
import DefaultScheduleNamePlugin from './components/defaultScheduleNamePlugin';

export const plugin = new PanelPlugin<PanelOptions>(SimplePanel).setPanelOptions((builder) => {
  return builder
    .addCustomEditor({
      id: 'scheduleName',
      path: 'scheduleNames',
      name: 'Schedule Names',
      description: 'Add Schedule Names',
      editor: ScheduleNamesPanelPlugin,
    })
    .addCustomEditor({
      id: 'defaultTitle',
      path: 'defaultTitle',
      name: 'Default Schedule Name',
      description: 'Select default schedule name',
      editor: DefaultScheduleNamePlugin,
    })
    .addBooleanSwitch({
      path: 'hasPayload',
      name: 'Has Payload',
      defaultValue: true,
    })
    .addNumberInput({
      path: 'min',
      name: 'Min value',
      defaultValue: 0,
      showIf: (config) => config.hasPayload,
    })
    .addNumberInput({
      path: 'max',
      name: 'Max value',
      defaultValue: 100,
      showIf: (config) => config.hasPayload,
    })
    .addNumberInput({
      path: 'default',
      name: 'Default value',
      defaultValue: 20,
      showIf: (config) => config.hasPayload,
    })
    .addNumberInput({
      path: 'step',
      name: 'Step',
      defaultValue: 1,
      showIf: (config) => config.hasPayload,
    })
    .addRadio({
      path: 'inputType',
      defaultValue: 'slider',
      name: 'Input Type',
      settings: {
        options: [
          {
            value: 'slider',
            label: 'Slider',
          },
          {
            value: 'number',
            label: 'Number',
          },
        ],
      },
    })
    .addBooleanSwitch({
      path: 'disableWeeklyEvent',
      name: 'Disable Weekly Event',
      defaultValue: false,
    })
    .addBooleanSwitch({
      path: 'disableEvent',
      name: 'Disable Event',
      defaultValue: false,
    })
    .addSelect({
      path: 'timezone',
      name: 'Timezone',
      settings: {
        options: moment.tz.names().map((it) => ({ value: it, label: it })),
      },
      defaultValue: moment.tz.guess(),
    });
});
