import { PanelPlugin } from '@grafana/data';
import { PanelOptions } from './types';
import { SimplePanel } from './SimplePanel';

export const plugin = new PanelPlugin<PanelOptions>(SimplePanel).setPanelOptions((builder) => {
  return builder;
});
