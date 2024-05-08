/*eslint-disable*/
import ReactApexChart from 'react-apexcharts';
import React, { useEffect, useMemo, useState } from 'react';
import { ApexOptions } from 'apexcharts';
import moment from 'moment-timezone';
import {
  Button,
  Col,
  DatePicker,
  Form,
  Modal,
  Radio,
  Row,
  Select,
  Spin
} from 'antd';
import { useTranslation } from 'react-i18next';
import { i18nKey } from 'src/locales/i18n';
import dayJs, { Dayjs } from 'dayjs';
import ArrowDown from 'src/assets/icons/arrow-down.svg';
import ArrowDownBottom from 'src/assets/icons/arrow-down-bottom.svg';
import styles from 'src/components/chart/line-bar-chart/line-bar-chart.module.less';
import {
  IAlarmChartData,
  IChart,
  IChartPercent,
  IChartThingKw
} from 'src/interfaces/overview';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Colors,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
  TimeScale,
  Chart
} from 'chart.js';
import 'chartjs-adapter-moment';
import { Bar } from 'react-chartjs-2';
import zoomPlugin from 'chartjs-plugin-zoom';
import { observer } from 'mobx-react-lite';
import _ from 'lodash';

const { RangePicker } = DatePicker;

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Colors,
//   Tooltip,
//   Legend,
//   BarElement,
//   TimeScale,
//   zoomPlugin
// );
enum OptionParam {
  UNIT_PERCENT = 'percent',
  UNIT_KW = 'kW',
  UNIT_KWH = 'kWh',
  ALARM_STATUS = 'alarm'
}

export enum TypeFilterDate {
  day = 'day',
  week = 'week',
  month = 'month',
  year = 'year',
  total = 'total'
}

const formatTime = {
  hour: 'HH:ss',
  day: 'YYYY-MM-DD',
  week: 'YYYY-MM-DD',
  month: 'YYYY-MM',
  year: 'YYYY'
};

const formatTimeTooltip = {
  day: 'YYYY-MM-DD HH:ss',
  week: 'YYYY-MM-DD',
  month: 'YYYY-MM-DD',
  year: 'YYYY-MM',
  total: 'YYYY'
};

export interface IValueForm {
  unit: 'kwOrkwh' | 'percent';
  date: Dayjs;
  type: TypeFilterDate;
}
const unitTime = {
  [TypeFilterDate.day]: 'hour',
  [TypeFilterDate.week]: 'day',
  [TypeFilterDate.month]: 'day',
  [TypeFilterDate.year]: 'month'
};

interface IDatakW {
  total3PhaseACkW: number;

  localLoadskW: number;
  solarACkW: number;
}

interface IDatakWh {
  totalkWhInjected: number;
  totalkWhAbsorbed: number;
  '3PhasekWhAvailable': number;
  solarTotalkWhInjected: number;
}
interface IDataPercent {
  '3PhaseSOC': number;
  '3PhaseSOH': number;
}
type keyKW = keyof IDatakW;
type keyKwh = keyof IDatakWh;
type keyPercent = keyof IDataPercent;

type DataSeries = number[];

export interface SearchField {
  from: string;
  to: string;
  type: TypeFilterDate;
}

interface IProps {
  searchField: SearchField;
  onSetSearchField: (newSearchField: SearchField) => void;
  //   dataChart: IChart[]; //ITimeseriesData,
  loadingChart: boolean;
  dataChartAlarm?: IAlarmChartData[];
  dataChartKwKwh: IChartThingKw[];
  dataChartPercent: IChartPercent[];
}

interface IPropsAlarm {
  searchField: SearchField;
  //   loadingChart: boolean;

  dataChartAlarm?: IAlarmChartData[];
  selectUnit: OptionParam;
}
//------------------Alarm Component--------------------//
const AlarmChartComponent = ({
  searchField,
  //   loadingChart,
  dataChartAlarm,
  selectUnit
}: IPropsAlarm) => {
  const dataAlarmClone: IAlarmChartData[] | undefined = useMemo(
    () => JSON.parse(JSON.stringify(dataChartAlarm)),
    [dataChartAlarm]
  );
  const [t] = useTranslation();
  const renderDataChartAlarm = () => {
    return dataAlarmClone?.map((item) => {
      //   const notFound = { count: 0 };
      const alarmNew = item.alarms.find((alarm) => alarm.status === 'new');
      const alarmResolved = item.alarms.find(
        (alarm) => alarm.status === 'resolved'
      );
      const alarmAcknowledged = item.alarms.find(
        (alarm) => alarm.status === 'acknowledged'
      );
      return {
        new: alarmNew,
        resolved: alarmResolved,
        acknowledged: alarmAcknowledged,
        time:
          searchField.type === TypeFilterDate.day
            ? moment(searchField.from).add(+item.time!, 'hour')
            : moment(item.time!)
      };
    });
  };

  const renderUnitTime = (type: TypeFilterDate, selectOption: OptionParam) => {
    if (type === TypeFilterDate.total) {
      const lengthTime = dataAlarmClone?.at(0)?.time?.length;

      const newUnit =
        lengthTime && lengthTime > String('YYYY').length ? 'month' : 'year';
      return newUnit;
    }
    return unitTime[type];
  };

  const datasetAlarm = () => {
    return [
      {
        fill: false,
        tension: 0.5,
        label: 'New',
        data: renderDataChartAlarm(),
        pointRadius: 7,
        pointHoverRadius: 7,
        backgroundColor: '#FF8060',
        showLine: false,
        parsing: {
          yAxisKey: 'new.count',
          xAxisKey: 'time'
        },
        yAxisID: 'countAlarm'
      },
      {
        fill: false,
        tension: 0.5,
        label: 'Resolved',
        pointRadius: 7,
        pointHoverRadius: 7,
        data: renderDataChartAlarm(),
        backgroundColor: '#5E6984',
        parsing: {
          yAxisKey: 'resolved.count',
          xAxisKey: 'time'
        },
        yAxisID: 'countAlarm'
      },
      {
        fill: false,
        tension: 0.5,
        pointRadius: 7,
        pointHoverRadius: 7,
        label: 'Acknowledge',
        data: renderDataChartAlarm(),
        backgroundColor: '#FFA300',
        parsing: {
          yAxisKey: 'acknowledged.count',
          xAxisKey: 'time'
        },
        yAxisID: 'countAlarm'
      }
    ];
  };

  const scalesAlarm = {
    x: {
      stacked: true,
      min: searchField.from,
      max: searchField.to,
      type: 'time',
      time: {
        unit: renderUnitTime(searchField.type, selectUnit),
        displayFormats: formatTime
      },
      grid: {
        drawTicks: false,
        color: '#DBDEE5'
      },
      ticks: {
        color: '#848484',
        font: {
          family: 'DM Sans',
          size: 12,
          weight: 'normal'
        },
        padding: 19
      }
    },
    countAlarm: {
      stacked: true,
      min: 0,
      position: 'left',
      grid: {
        display: false,
        drawTicks: false
      },
      title: {
        display: true
      },
      ticks: {
        stepSize: 1,
        color: '#212426',
        font: {
          family: 'DM Sans',
          size: 12,
          weight: 'normal'
        },
        padding: 19
      }
    }
  };

  const optionBar = {
    scales: scalesAlarm,
    interaction: {
      mode: 'index',
      intersect: false,
      events: ['mousemove', 'click', 'touchstart', 'touchmove']
    },

    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          padding: 30,
          pointStyle: 'rectRounded'
        }
      },
      tooltip:
        selectUnit === OptionParam.ALARM_STATUS &&
        searchField.type === TypeFilterDate.day
          ? {
              enabled: false,

              external: function (context: any) {
                // Tooltip Element
                let tooltipEl: any = document.getElementById('chartjs-tooltip');
                // Create element on first render
                if (!tooltipEl) {
                  tooltipEl = document.createElement('div');
                  tooltipEl.id = 'chartjs-tooltip';
                  tooltipEl.innerHTML = '<table></table>';
                  document.body.appendChild(tooltipEl);
                }

                // Hide if no tooltip
                const tooltipModel = context.tooltip;
                if (tooltipModel.opacity === 0) {
                  tooltipEl.style.opacity = 0;
                  return;
                }

                // // Set caret Position
                tooltipEl.classList.remove('above', 'below', 'no-transform');
                if (tooltipModel.yAlign) {
                  tooltipEl.classList.add(tooltipModel.yAlign);
                } else {
                  tooltipEl.classList.add('no-transform');
                }

                // // function getBody(bodyItem: any) {
                // //   return bodyItem.lines;
                // // }

                // Set Text
                if (tooltipModel.body) {
                  // const titleLines = tooltipModel.title || [];
                  // const bodyLines = tooltipModel.body.map(getBody);

                  let innerHtml = '<thead>';

                  context.tooltip.dataPoints?.forEach((itemData: any) => {
                    const dataLabel: any =
                      itemData?.dataset?.data[itemData.dataIndex] ?? {};
                    const dataWithDataset = (dataLabel ?? {})[
                      itemData?.dataset?.parsing?.yAxisKey?.replace(
                        '.count',
                        ''
                      )
                    ]?.info;
                    dataWithDataset &&
                      (innerHtml += `<tr><td>------------${itemData.dataset.parsing.yAxisKey.replace(
                        '.count',
                        ''
                      )}: ${
                        (dataLabel ?? {})[
                          itemData.dataset.parsing.yAxisKey.replace(
                            '.count',
                            ''
                          )
                        ]?.count
                      }-------------</td></tr>`);

                    (dataWithDataset ?? []).forEach((item: any) => {
                      const time = moment(item.timestamp).format(
                        'YYYY/MM/DD HH:ss'
                      );
                      const faultType = `${t(
                        i18nKey.alarmCenter.label.faultType
                      )}: ${item?.faultType}`;
                      const phase = `${t(i18nKey.alarmCenter.label.phase)}: ${
                        item?.phase || '-'
                      }`;
                      const phaseVac = `${t(
                        i18nKey.alarmCenter.label.phaseVAC
                      )}: ${item?.phaseVac || '-'}`;
                      const systemState = `${t(
                        i18nKey.alarmCenter.label.systemState
                      )}: ${item?.systemState || '-'}`;
                      const systemAlarm = `${t(
                        i18nKey.alarmCenter.label.systemAlarm
                      )}: ${item?.systemAlarms || '-'}`;
                      const batteryAlarm = `${t(
                        i18nKey.alarmCenter.label.batteryAlarm
                      )}: ${item?.batteryAlarms || '-'}`;
                      [
                        `--- Time: ${time}`,
                        faultType,
                        phase,
                        phaseVac,
                        systemState,
                        systemAlarm,
                        batteryAlarm
                      ].forEach((item) => {
                        innerHtml += `<tr><td>${item}</td></tr>`;
                      });
                    });
                  });

                  innerHtml += '</thead><tbody>';
                  innerHtml += '</tbody>';

                  const tableRoot = tooltipEl.querySelector('table');
                  tableRoot.innerHTML = innerHtml;
                }

                const position = context.chart.canvas.getBoundingClientRect();
                // const bodyFont = (barChartRef as any)?.helpers?.toFont(tooltipModel.options.bodyFont);

                // Display, position, and set styles for font
                tooltipEl.style.opacity = 1;
                tooltipEl.style.position = 'absolute';
                tooltipEl.style.left =
                  position.left +
                  window.pageXOffset +
                  tooltipModel.caretX +
                  'px';
                tooltipEl.style.top =
                  position.top +
                  window.pageYOffset +
                  tooltipModel.caretY +
                  'px';
                tooltipEl.style.maxHeight = 500 + 'px';
                (tooltipEl.style.overflow = 'auto'),
                  (tooltipEl.style.background = 'black');
                tooltipEl.style.color = '#fff';
                tooltipEl.style.padding = '5px 0';
                tooltipEl.style.borderRadius = '6px';
                tooltipEl.style.fontSize = '14px';
                // // tooltipEl.style.font = bodyFont.string;
                // tooltipEl.style.padding = tooltipModel.padding + 'px ' + tooltipModel.padding + 'px';
                // tooltipEl.style.pointerEvents = 'none';
              }
            }
          : {
              callbacks: {
                title: function (context?: { label: string }[]) {
                  const label = context?.at(0)?.label || '';
                  const lengthTime = dataAlarmClone?.at(0)?.time?.length;

                  const newUnit =
                    lengthTime && lengthTime > String('YYYY').length
                      ? 'year'
                      : 'total';
                  if (searchField.type === TypeFilterDate.total) {
                    return moment(label).format(formatTimeTooltip[newUnit]);
                  } else {
                    return moment(label).format(
                      formatTimeTooltip[searchField.type]
                    );
                  }
                }
              }
            },
      zoom: {
        limits: {
          x: {
            min: moment(searchField.from).valueOf(),
            max: moment(searchField.to).valueOf()
          }
        },
        zoom: {
          mode: 'x',
          wheel: {
            enabled: true
          },
          drag: {
            enabled: true,
            threshold: 7,
            backgroundColor: 'rgba(0,255,255,0.3)'
          }
        }
      }
    }
  } as any;

  useEffect(() => {
    const handleRemoveTooltip = () => {
      const tooltipEl = document.getElementById('chartjs-tooltip') || {
        style: { opacity: 1 }
      };
      tooltipEl.style.opacity = 0;
    };
    window.addEventListener('click', handleRemoveTooltip);
    return () => {
      window.removeEventListener('click', handleRemoveTooltip);
      const tooltipEl = document.getElementById('chartjs-tooltip') || {
        style: { opacity: 1 }
      };
      tooltipEl.style.opacity = 0;
    };
  }, [selectUnit, searchField]);

  return (
    <div className="canvas-container">
      <Bar data={{ datasets: datasetAlarm() }} options={optionBar} />
    </div>
  );
};

//------------------------------------------///

const LineChart = ({
  searchField,
  onSetSearchField,
  dataChartKwKwh,
  dataChartPercent,
  loadingChart,
  dataChartAlarm
}: IProps) => {
  const { t } = useTranslation();
  const [selectUnit, setSelectUnit] = useState<OptionParam>(
    OptionParam.UNIT_KW
  );

  const [isOpenConsolapse, setIsOpenConsolapse] = useState<boolean>(true);
  const [form] = Form.useForm();
  const [loadingChartUpdate, setLoadingChartUpdate] = useState();
  const [dataMapKwh, setDataMapKwH] = useState<Map<keyKwh, DataSeries[]>>(
    new Map()
  );
  const [dataMapKw, setDataMapKw] = useState<Map<keyKW, DataSeries[]>>(
    new Map()
  );
  const [dataMapPercent, setDataMapPercent] = useState<
    Map<string, DataSeries[]>
  >(new Map());

  const convertData = () => {
    const listKeyKw: keyKW[] = ['total3PhaseACkW', 'localLoadskW', 'solarACkW'];
    const listKeyKwh: keyKwh[] = [
      '3PhasekWhAvailable',
      'totalkWhInjected',
      'totalkWhAbsorbed',
      'solarTotalkWhInjected'
    ];

    const dataKw: Map<keyKW, DataSeries[]> = new Map();
    const dataKwh: Map<keyKwh, DataSeries[]> = new Map();

    dataChartKwKwh?.forEach((item) => {
      const timeX = (() => {
        if (searchField.type === TypeFilterDate.day) {
          const timeA = item.time! as { time: string | Date };

          const timeFormat = moment(timeA.time, ['HH:mm']);
          return moment(searchField.from)
            .add(timeFormat.minutes(), 'minute')
            .add(timeFormat.hour(), 'h');
        } else {
          const timeA = item.time! as {
            overallTime: string | Date;
            interval: number;
          };

          return moment(timeA.overallTime).add(timeA.interval * 15, 'minute');
        }
        // return moment(searchField.from);
      })();

      listKeyKw.forEach((key: keyKW) => {
        const currentData = dataKw.get(key) || [];
        // currentData
        const newData: DataSeries[] = [
          ...currentData,
          [timeX.valueOf(), item[key]]
        ];
        dataKw.set(key, newData);
      });

      listKeyKwh.forEach((key: keyKwh) => {
        const currentData = dataKwh.get(key) || [];
        // currentData
        const newData: DataSeries[] = [
          ...currentData,
          [timeX.valueOf(), item[key]]
        ];
        dataKwh.set(key, newData);
      });
    });

    let daCellDriverMap = new Map();

    dataChartPercent.forEach((item) => {
      const dataSoH = item['3PhaseSOH'];
      const dataSoC = item['3PhaseSOC'];
      const nameCellDriverSoc = `Cell Driver_${item.time.hub_id}_SOC`;
      const nameCellDriverSoh = `Cell Driver_${item.time.hub_id}_SOH`;

      const currentDataSOC = daCellDriverMap.get(nameCellDriverSoc) || [];
      const currentDataSOH = daCellDriverMap.get(nameCellDriverSoh) || [];

      const timeX = (() => {
        if (searchField.type === TypeFilterDate.day) {
          const timeA = item.time! as { time: string | Date };

          const timeFormat = moment(timeA.time, ['HH:mm']);
          return moment(searchField.from)
            .add(timeFormat.minutes(), 'minute')
            .add(timeFormat.hour(), 'h');
        } else {
          const timeA = item.time! as {
            overallTime: string | Date;
            interval: number;
          };

          return moment(timeA.overallTime).add(timeA.interval * 15, 'minute');
        }
      })();

      daCellDriverMap.set(nameCellDriverSoc, [
        ...currentDataSOC,
        [timeX.valueOf(), dataSoC]
      ]);
      daCellDriverMap.set(nameCellDriverSoh, [
        ...currentDataSOH,
        [timeX.valueOf(), dataSoH]
      ]);
    });
    setDataMapPercent(() => {
      const temp = new Map([...daCellDriverMap.entries()].sort());
      return temp;
    });

    setDataMapKw(() => {
      const temp = new Map(dataKw);
      return temp;
    });

    setDataMapKwH(() => {
      const temp = new Map(dataKwh);
      return temp;
    });
  };

  useEffect(() => {
    convertData();
  }, [dataChartPercent, dataChartKwKwh]);

  const handleOpenChart = () => {
    setIsOpenConsolapse(!isOpenConsolapse);
  };

  const renderSeriesKw = (): ApexAxisChartSeries => {
    const series2: ApexAxisChartSeries = [];
    dataMapKw.forEach((value: DataSeries[], key: keyKW) => {
      series2.push({ name: key, type: 'line', data: value });
    });
    return series2;
  };

  //---------------------------------

  const renderSeriesKwh = (): ApexAxisChartSeries => {
    const series2: ApexAxisChartSeries = [];
    dataMapKwh.forEach((value: DataSeries[], key: keyKwh) => {
      series2.push({ name: key, type: 'line', data: value });
    });
    return series2;
  };

  //-------------------------------------------------//
  const renderSeriesPercent = (): ApexAxisChartSeries => {
    const series2: ApexAxisChartSeries = [];
    dataMapPercent.forEach((value: DataSeries[], key: string) => {
      series2.push({ name: key, type: 'line', data: value });
    });
    return series2;
  };

  const seriesKw: ApexAxisChartSeries = useMemo(() => {
    return renderSeriesKw();
  }, [dataMapKw]);

  const seriesKwh: ApexAxisChartSeries = useMemo(() => {
    return renderSeriesKwh();
  }, [dataMapKwh]);

  const seriesPercent: ApexAxisChartSeries = useMemo(() => {
    return renderSeriesPercent();
  }, [dataMapPercent]);

  const calTickAmount = (type: TypeFilterDate) => {
    switch (type) {
      case TypeFilterDate.day:
        return 24;
      case TypeFilterDate.week:
        return 7;
      case TypeFilterDate.month:
        return 31;
      case TypeFilterDate.year:
        return 12;
      case TypeFilterDate.total:
        return 'dataPoints';
    }
  };

  const optionkW: ApexOptions = {
    chart: {
      height: 500,
      type: 'line',
      id: 'thingChart',
      zoom: {
        type: 'x',
        enabled: true,
        autoScaleYaxis: true
      },
      toolbar: {
        autoSelected: 'zoom',
        export: {
          csv: {
            dateFormatter(timestamp: number) {
              return moment(timestamp).format('yyyy-MM-DD hh:mm:ss');
            }
          }
        }
      }
    },

    // annotations: annotations,
    fill: {
      type: 'solid'
    },
    colors: [
      '#b30000',
      '#7c1158',
      '#4421af',
      '#1a53ff',
      '#0d88e6',
      '#00b7c7',
      '#5ad45a',
      '#8be04e',
      '#ebdc78'
    ],
    // markers: {
    //   size: [1, 0]
    // },
    stroke: {
      curve: 'smooth',
      width: 2
    },
    tooltip: {
      x: {
        format: 'yyyy-MM-dd HH:mm:ss'
      },
      y: {
        formatter: function (
          value,
          { series, seriesIndex, dataPointIndex, w }
        ) {
          return value?.toString();
        }
      },
      shared: true,
      intersect: false,
      followCursor: true
    },
    xaxis: {
      type: 'datetime',
      min: moment(searchField.from).valueOf(),
      max: moment(searchField.to).valueOf(),
      tickAmount: calTickAmount(searchField.type),
      // tickAmount: 24,
      labels: {
        datetimeUTC: false,
        datetimeFormatter: {
          year: 'yyyy',
          month: "MMM 'yy",
          day: 'dd MMM',
          hour: 'HH:mm'
        }
      }
    },
    yaxis: [
      {
        labels: {
          formatter: function (val, index) {
            return val ? Math.ceil(+val).toString() : '0';
          }
        },
        title: {
          text: 'kW'
        }
      }
    ]
  };

  const optionsPercent: ApexOptions = {
    chart: {
      height: 500,
      type: 'line',
      id: 'thingChart',
      zoom: {
        type: 'x',
        enabled: true,
        autoScaleYaxis: true
      },
      toolbar: {
        autoSelected: 'zoom',
        export: {
          csv: {
            dateFormatter(timestamp: number) {
              return moment(timestamp).format('yyyy-MM-DD hh:mm:ss');
            }
          }
        }
      }
    },

    // annotations: annotations,
    fill: {
      type: 'solid'
    },
    colors: [
      '#b30000',
      '#7c1158',
      '#4421af',
      '#1a53ff',
      '#0d88e6',
      '#00b7c7',
      '#5ad45a',
      '#8be04e',
      '#ebdc78'
    ],
    // markers: {
    //   size: [1, 0]
    // },
    stroke: {
      curve: 'smooth',
      width: 2
    },
    tooltip: {
      x: {
        format: 'yyyy-MM-dd HH:mm:ss'
      },
      y: {
        formatter: function (
          value,
          { series, seriesIndex, dataPointIndex, w }
        ) {
          return value?.toString();
        }
      },
      shared: true,
      intersect: false,
      followCursor: true
    },
    xaxis: {
      type: 'datetime',
      min: moment(searchField.from).valueOf(),
      max: moment(searchField.to).valueOf(),
      tickAmount: calTickAmount(searchField.type),
      // tickAmount: 24,
      labels: {
        datetimeUTC: false,
        datetimeFormatter: {
          year: 'yyyy',
          month: "MMM 'yy",
          day: 'dd MMM',
          hour: 'HH:mm'
        }
      }
    },
    yaxis: [
      {
        labels: {
          formatter: function (val, index) {
            return val ? Math.ceil(+val).toString() : '0';
          }
        },

        min: 0,
        max: 100,
        title: {
          text: '%'
        }
      }
    ]
  };

  const optionskwkWH: ApexOptions = {
    chart: {
      height: 500,
      type: 'line',
      id: 'thingChart',
      zoom: {
        type: 'x',
        enabled: true,
        autoScaleYaxis: true
      },
      toolbar: {
        autoSelected: 'zoom',
        export: {
          csv: {
            dateFormatter(timestamp: number) {
              return moment(timestamp).format('yyyy-MM-DD hh:mm:ss');
            }
          }
        }
      }
    },

    // annotations: annotations,
    fill: {
      type: 'solid'
    },
    colors: [
      '#b30000',
      '#7c1158',
      '#4421af',
      '#1a53ff',
      '#0d88e6',
      '#00b7c7',
      '#5ad45a',
      '#8be04e',
      '#ebdc78'
    ],
    // markers: {
    //   size: [1, 0]
    // },
    stroke: {
      curve: 'smooth',
      width: 2
    },
    tooltip: {
      x: {
        format: 'yyyy-MM-dd HH:mm:ss'
      },
      y: {
        formatter: function (
          value,
          { series, seriesIndex, dataPointIndex, w }
        ) {
          return value?.toString();
        }
      },
      shared: true,
      intersect: false,
      followCursor: true
    },
    xaxis: {
      type: 'datetime',
      min: new Date(searchField.from).getTime(),
      max: new Date(searchField.to).getTime(),
      tickAmount: calTickAmount(searchField.type),
      // tickAmount: 24,
      labels: {
        datetimeUTC: false,
        datetimeFormatter: {
          year: 'yyyy',
          month: "MMM 'yy",
          day: 'dd MMM',
          hour: 'HH:mm'
        }
      }
    },
    yaxis: [
      {
        labels: {
          formatter: function (val, index) {
            return val ? Math.ceil(+val).toString() : '0';
          }
        },
        // min: 0,
        // max: 600000,
        title: {
          text: 'kWh'
        }
      }
    ]
  };

  const handleFormChange = (valueChange: Partial<IValueForm>) => {
    console.log('Vao Day');
    let { from, to, type } = searchField;
    if (valueChange.type) {
      type = valueChange.type;
      if (valueChange.type === TypeFilterDate.total) {
        form.setFieldValue('date', [dayJs().subtract(10, 'year'), dayJs()]);
        from = moment().subtract(10, 'y').toISOString();
        to = moment().toISOString();
      } else {
        form.setFieldValue('date', dayJs());
        from = moment()
          .startOf(valueChange.type as moment.unitOfTime.StartOf)
          .toISOString();
        to = moment()
          .endOf(valueChange.type as moment.unitOfTime.StartOf)
          .toISOString();
      }
    }
    if (valueChange.date) {
      from = valueChange.date
        .startOf(searchField.type as dayJs.OpUnitType)
        .toISOString();
      to = valueChange.date
        .endOf(searchField.type as dayJs.OpUnitType)
        .toISOString();
    }
    onSetSearchField({ from, to, type });
  };

  const renderFilterDate = () => {
    if (selectUnit === OptionParam.UNIT_PERCENT) {
      return (
        <Radio.Group buttonStyle="solid">
          <Radio.Button value="day">
            {t(i18nKey.dashboard.chart.duration.day)}
          </Radio.Button>
          <Radio.Button value="week">
            {t(i18nKey.dashboard.chart.duration.week)}
          </Radio.Button>
        </Radio.Group>
      );
    }
    if (selectUnit === OptionParam.ALARM_STATUS) {
      return (
        <Radio.Group buttonStyle="solid">
          <Radio.Button value="day">
            {t(i18nKey.dashboard.chart.duration.day)}
          </Radio.Button>
          <Radio.Button value="week">
            {t(i18nKey.dashboard.chart.duration.week)}
          </Radio.Button>
          <Radio.Button value="month">
            {t(i18nKey.dashboard.chart.duration.month)}
          </Radio.Button>
          <Radio.Button value="year">
            {t(i18nKey.dashboard.chart.duration.year)}
          </Radio.Button>
          <Radio.Button value="total">
            {t(i18nKey.dashboard.chart.duration.total)}
          </Radio.Button>
        </Radio.Group>
      );
    }
    return (
      <Radio.Group buttonStyle="solid">
        <Radio.Button value="day">
          {t(i18nKey.dashboard.chart.duration.day)}
        </Radio.Button>
        <Radio.Button value="week">
          {t(i18nKey.dashboard.chart.duration.week)}
        </Radio.Button>
        <Radio.Button disabled value="month">
          {t(i18nKey.dashboard.chart.duration.month)}
        </Radio.Button>
        <Radio.Button disabled value="year">
          {t(i18nKey.dashboard.chart.duration.year)}
        </Radio.Button>
        <Radio.Button disabled value="total">
          {t(i18nKey.dashboard.chart.duration.total)}
        </Radio.Button>
      </Radio.Group>
    );
  };
  const checkDateDisable = (current: Dayjs) => {
    return current && current.valueOf() > Date.now();
  };

  ///---------List Option-----------//

  const optionParam: { key: string; label: string; value: OptionParam }[] = [
    { key: 'kW', value: OptionParam.UNIT_KW, label: 'kW' },
    { key: 'kWh', value: OptionParam.UNIT_KWH, label: 'kWh' },
    { key: 'percent', value: OptionParam.UNIT_PERCENT, label: '%' },
    {
      key: 'alarm',
      value: OptionParam.ALARM_STATUS,
      label: `${t(i18nKey.alarmCenter.label.alarmStatus)}`
    }
  ];

  const renderDatePicked: { [key in TypeFilterDate]: React.ReactNode } = {
    [TypeFilterDate.day]: (
      <DatePicker
        style={{ width: '100%' }}
        allowClear={false}
        disabledDate={checkDateDisable}
      />
    ),
    [TypeFilterDate.week]: (
      <DatePicker
        style={{ width: '100%' }}
        allowClear={false}
        disabledDate={checkDateDisable}
        picker="week"
      />
    ),
    [TypeFilterDate.month]: (
      <DatePicker
        style={{ width: '100%' }}
        allowClear={false}
        disabledDate={checkDateDisable}
        picker="month"
      />
    ),
    [TypeFilterDate.year]: (
      <DatePicker
        style={{ width: '100%' }}
        allowClear={false}
        disabledDate={checkDateDisable}
        picker="year"
      />
    ),
    [TypeFilterDate.total]: (
      <RangePicker style={{ width: '100%' }} disabled picker="year" />
    )
  };
  const renderOption: { [key in OptionParam]?: ApexOptions } = {
    [OptionParam.UNIT_KW]: optionkW,
    [OptionParam.UNIT_KWH]: optionskwkWH,
    [OptionParam.UNIT_PERCENT]: optionsPercent
  };

  const renderSeries: { [key in OptionParam]?: ApexAxisChartSeries } = {
    [OptionParam.UNIT_KW]: seriesKw,
    [OptionParam.UNIT_KWH]: seriesKwh,
    [OptionParam.UNIT_PERCENT]: seriesPercent
  };

  const handleOnChangeUnit = (value: OptionParam) => {
    const isTypeNotFetch = [TypeFilterDate.day, TypeFilterDate.week].includes(
      searchField.type
    );
    setSelectUnit(value);
    if (selectUnit === OptionParam.ALARM_STATUS && !isTypeNotFetch) {
      form.setFieldValue('date', dayJs());
      form.setFieldValue('type', TypeFilterDate.day);
      const from = moment()
        .startOf(TypeFilterDate.day as moment.unitOfTime.StartOf)
        .toISOString();
      const to = moment()
        .endOf(TypeFilterDate.day as moment.unitOfTime.StartOf)
        .toISOString();
      onSetSearchField({ from, to, type: TypeFilterDate.day });
    }
  };

  return (
    <>
      <div className={styles.container}>
        <Form
          onValuesChange={handleFormChange}
          form={form}
          className={styles.form_chart}
          initialValues={{
            type: searchField.type,
            date: dayJs()
          }}>
          <Row gutter={[16, 16]}>
            <Col sm={24} xs={24} md={24} lg={24} xl={10} xxl={10}>
              <Row gutter={16} className={styles.form_chart_right}>
                <Col xs={12} sm={12} md={8} lg={8} xl={10} xxl={10}>
                  <Select
                    value={selectUnit}
                    style={{ width: '100%' }}
                    placeholder="Select Pramater"
                    onChange={handleOnChangeUnit}
                    options={optionParam}
                  />
                </Col>

                <Col xs={12} sm={12} md={8} lg={8} xl={8} xxl={8}>
                  <Form.Item name="date" style={{ width: '100%' }}>
                    {renderDatePicked[searchField.type]}
                  </Form.Item>
                </Col>
              </Row>
            </Col>
            <Col sm={24} xs={24} md={24} lg={24} xl={14} xxl={14}>
              <Row gutter={16} className={styles.form_chart_left}>
                <Col flex={1} className={styles.form_chart_date}>
                  <Form.Item name="type">{renderFilterDate()}</Form.Item>.
                </Col>
                <Col
                  onClick={handleOpenChart}
                  className={styles.form_chart_collapse}>
                  <Button>
                    {isOpenConsolapse
                      ? t(i18nKey.dashboard.collapse)
                      : t(i18nKey.dashboard.expand)}
                    <img
                      className={
                        isOpenConsolapse ? styles.form_chart_collapse_open : ''
                      }
                      src={
                        isOpenConsolapse ? ArrowDown : ArrowDownBottom
                      }></img>
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </Form>
        {isOpenConsolapse &&
          (loadingChart ? (
            <Row
              justify="center"
              align="middle"
              style={{ width: '100%', height: '60vh' }}>
              <Spin />
            </Row>
          ) : (
            <>
              {selectUnit === OptionParam.ALARM_STATUS ? (
                <AlarmChartComponent
                  searchField={searchField}
                  selectUnit={selectUnit}
                  dataChartAlarm={dataChartAlarm || []}
                />
              ) : (
                <ReactApexChart
                  options={renderOption[selectUnit]}
                  series={renderSeries[selectUnit]}
                  height={300}
                />
              )}
            </>
          ))}
      </div>
    </>
  );
};

export default React.memo(LineChart);
