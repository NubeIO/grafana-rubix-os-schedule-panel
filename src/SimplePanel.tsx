import React, { useEffect, useMemo, useState } from 'react';
import { PanelProps } from '@grafana/data';
import { PanelOptions, RawData } from 'types';
import { css, cx } from 'emotion';
import { stylesFactory, useTheme } from '@grafana/ui';
import ScheduleCalendar from './components/ScheduleCalendar';
import { createTheme, ThemeProvider } from '@material-ui/core';
import { blue, red } from '@material-ui/core/colors';
import { getDataSourceSrv, config as grafanaConfig } from '@grafana/runtime';
import * as writerUiService from './services/writerUiService';

interface Props extends PanelProps<PanelOptions> {}

const RUBIX_FRAMEWORK_DATASOURCE_ID = 'grafana-rubix-os-data-source';

export const SimplePanel: React.FC<Props> = ({ data: input, width, height }) => {
  const [isDatasourceConfigured, changeIsDatasourceConfigured] = useState(false);
  const [writable] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const writerValue = writerUiService.getFieldValue(writerUiService.dataFieldKeys.WRITER, input);
  const [value, setValue] = useState(writerValue);

  const [dataSource, setDataSource] = useState<any>({});
  const theme = useTheme();
  const palletType = theme.isDark ? 'dark' : 'light';
  const mainPrimaryColor = theme.isDark ? blue[500] : blue[900];
  const mainSecondaryColor = theme.isDark ? red[500] : red[900];

  const isNotEditable = useMemo(
    () => grafanaConfig.bootData?.user?.orgRole === 'Viewer',
    [grafanaConfig.bootData?.user?.orgRole]
  );

  useEffect(() => {
    if (isDatasourceConfigured) {
      const writerValue = writerUiService.getFieldValue(writerUiService.dataFieldKeys.WRITER, input);
      setValue(writerValue);
    }

    const datasources = input?.request?.targets?.map((x) => x.datasource);

    if (Array.isArray(datasources) && datasources.length > 0) {
      datasources.map((datasource) => {
        return getDataSourceSrv()
          .get(datasource)
          .then((res) => {
            if (res.meta.id === RUBIX_FRAMEWORK_DATASOURCE_ID) {
              setDataSource(res);
              changeIsDatasourceConfigured(true);
            } else {
              changeIsDatasourceConfigured(false);
            }
          })
          .catch((err) => {
            console.error(err);
          });
      });
    }
  }, [input]);

  const materialTheme = createTheme({
    palette: {
      type: palletType,
      primary: {
        main: mainPrimaryColor,
      },
      secondary: {
        main: mainSecondaryColor,
      },
    },
  });

  const { config = {} } = value.schedule || {};

  const syncData = async (data: RawData) => {
    if (!value) {
      throw new Error('Something went wrong while trying to write to data source.');
    }
    const schedules = {
      events: { ...data.events },
      weekly: { ...data.weekly },
      exception: { ...data.exception },
    };

    setIsRunning(true);

    const output = {
      schedules: schedules,
      config,
    };
    const scheduleService = dataSource?.services?.scheduleService;

    if (scheduleService && value) {
      const response = await scheduleService.writeToScheduleId(value.uuid, value.host_uuid, output);
      setValue({ ...value, schedule: response, host_uuid: value.host_uuid });
    } else {
      throw new Error('Something went wrong while trying to write to data source.');
    }
    setIsRunning(false);
  };

  const styles = getStyles();

  if (!isDatasourceConfigured) {
    return (
      <div className={styles.container}>
        <p className={styles.warningText}>Selected datasource is not correct!</p>
      </div>
    );
  }

  if (!value) {
    return (
      <div className={styles.container}>
        <p className={styles.warningText}>Please select a schedule from appropriate Host!</p>
      </div>
    );
  }

  const options: PanelOptions = {
    default: value.default_payload,
    defaultTitle: config.default_name,
    disableWeeklyEvent: config.disable_weekly,
    disableException: config.disable_exception,
    disableEvent: config.disable_event,
    hasPayload: value.enable_payload,
    inputType: config.input_type,
    max: value.max_payload,
    inputName: config.input_name,
    min: value.min_payload,
    scheduleNames: config.names,
    step: config.step,
  };

  return (
    <div
      className={cx(
        styles.wrapper,
        css`
          width: ${width}px;
          height: ${height}px;
        `
      )}
    >
      <ThemeProvider theme={materialTheme}>
        <ScheduleCalendar
          syncData={syncData}
          value={value}
          isRunning={isRunning}
          options={options}
          setIsRunning={setIsRunning}
          isNotEditable={isNotEditable}
        />
      </ThemeProvider>
      {isRunning && <div className={styles.overlayRunning} />}
      {!writable && <div className={styles.overlay} />}
    </div>
  );
};

const getStyles = stylesFactory(() => {
  return {
    wrapper: css`
      position: relative;
    `,
    svg: css`
      position: absolute;
      top: 0;
      left: 0;
    `,
    overlayRunning: css`
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;

      background: black;
      background: rgba(0, 0, 0, 0.3);

      filter: blur(4px);
      -o-filter: blur(4px);
      -ms-filter: blur(4px);
      -moz-filter: blur(4px);
      -webkit-filter: blur(4px);
    `,
    overlay: css`
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      transparent: 100%;
    `,
    textBox: css`
      position: absolute;
      bottom: 0;
      left: 0;
      padding: 10px;
    `,
    container: css`
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      height: 100%;
    `,
    warningText: css`
      margin-bottom: 8px;
      font-size: 14px;
      font-weight: 500;
      color: #999;
      text-transform: uppercase;
      text-align: center;
      width: 100%;
    `,
  };
});
