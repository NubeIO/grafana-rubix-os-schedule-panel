import React, { useEffect, useRef, useState } from 'react';
import { DataFrame, Field, PanelProps } from '@grafana/data';
import { PanelOptions, RawData } from 'types';
import { css, cx } from 'emotion';
import { stylesFactory, useTheme } from '@grafana/ui';
import ScheduleCalendar from './components/ScheduleCalendar';
import { createTheme, ThemeProvider } from '@material-ui/core';
import { blue, red } from '@material-ui/core/colors';
import { getDataSourceSrv } from '@grafana/runtime';

interface Props extends PanelProps<PanelOptions> {}

const FLOW_FRAMEWORK_DATASOURCE_ID = 'nubeio-flow-framework-data-source';

export const SimplePanel: React.FC<Props> = ({ options, data: input, width, height }) => {

  const [isDatasourceConfigured, changeIsDatasourceConfigured] = useState(false);
  const [writable] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  // @ts-ignore
  const [value, setValue] = useState(input.series[0].fields[1].values.buffer[0]);

  const [dataSource, setDataSource] = useState<any>({});
  const theme = useTheme();
  const palletType = theme.isDark ? 'dark' : 'light';
  const mainPrimaryColor = theme.isDark ? blue[500] : blue[900];
  const mainSecondaryColor = theme.isDark ? red[500] : red[900];


  useEffect(() => {
    if (isDatasourceConfigured) {
      return;
    }
    const datasources = input?.request?.targets.map((x) => x.datasource);

    if (Array.isArray(datasources) && datasources.length > 0) {
      datasources.map((datasource) => {
        return getDataSourceSrv()
          .get(datasource)
          .then((res) => {
            if (res.meta.id === FLOW_FRAMEWORK_DATASOURCE_ID) {
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
  }, [value]);

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

  const syncData = async (data: RawData) => {
    if (!value) {
      throw new Error('Something went wrong while trying to write to data source.');
    }
    const oldSchedules = value.schedule.schedules;
    const schedules = {
      events: { ...oldSchedules.events, ...data.events },
      weekly: { ...oldSchedules.weekly, ...data.weekly },
      exception: { ...data.exception },
    };

    setIsRunning(true);

    const output = {
      schedule: { schedules: schedules }
    }
    const scheduleService = dataSource?.services?.scheduleService;

    if (scheduleService && value) {
      const response = await scheduleService.writeToScheduleId(value.uuid, output)
      setValue(response);
    } else {
      throw new Error('Something went wrong while trying to write to data source.');
    }
    setIsRunning(false);
  };

  const styles = getStyles();
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
  };
});
