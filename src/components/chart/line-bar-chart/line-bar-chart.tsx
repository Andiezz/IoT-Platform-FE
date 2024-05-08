import React, { useEffect, useMemo, useRef, useState } from 'react';
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
import { Bar, Line } from 'react-chartjs-2';
import moment from 'moment-timezone';
import ArrowDown from 'src/assets/icons/arrow-down.svg';
import ArrowDownBottom from 'src/assets/icons/arrow-down-bottom.svg';
import styles from './line-bar-chart.module.less';
import dayJs, { Dayjs } from 'dayjs';
import zoomPlugin from 'chartjs-plugin-zoom';
import { Button, Col, DatePicker, Form, Radio, Row, Select, Spin } from 'antd';
import { IAlarmChartData, IChart } from 'src/interfaces/overview';
import { useTranslation } from 'react-i18next';
import { i18nKey } from 'src/locales/i18n';
const { RangePicker } = DatePicker;

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Colors,
  Tooltip,
  Legend,
  BarElement,
  TimeScale,
  zoomPlugin
);

export enum TypeFilterDate {
  day = 'day',
  week = 'week',
  month = 'month',
  year = 'year',
  total = 'total'
}

enum OptionParam {
  UNIT_PERCENT = 'percent',
  UNIT_KW_OR_KWH = 'kwOrkwh',
  ALARM_STATUS = 'alarm'
}

const roundingTime: Record<string, moment.unitOfTime.StartOf> = {
  [TypeFilterDate.week]: 'day',
  [TypeFilterDate.month]: 'day',
  [TypeFilterDate.year]: 'month'
};

export interface IValueForm {
  unit: 'kwOrkwh' | 'percent';
  date: Dayjs;
  type: TypeFilterDate;
}

export interface SearchField {
  from: string;
  to: string;
  type: TypeFilterDate;
}
const itemInitChart: any = {
  '3PhaseSOH': 0,
  '3PhaseSOC': 0,
  '3PhasekWhAvailable': 0,
  'building/utilityMeter': 0,
  localLoadskW: 0,
  solarACkW: 0,
  solarTotalkWhInjected: 0,
  total3PhaseACkW: 0,
  totalkWhAbsorbed: 0,
  totalkWhInjected: 0
};

interface IProps {
  searchField: SearchField;
  onSetSearchField: (newSearchField: SearchField) => void;
  dataChart: IChart[]; //ITimeseriesData,
  loadingChart: boolean;
  dataChartAlarm?: IAlarmChartData[];
}
const unitTime = {
  [TypeFilterDate.day]: 'hour',
  [TypeFilterDate.week]: 'day',
  [TypeFilterDate.month]: 'day',
  [TypeFilterDate.year]: 'month'
};
const formatTime = {
  hour: 'HH:ss',
  day: 'YYYY-MM-DD',
  week: 'YYYY-MM-DD',
  month: 'YYYY-MM',
  year: 'YYYY'
};

const LineBarChart = ({
  searchField,
  onSetSearchField,
  dataChart,
  loadingChart,
  dataChartAlarm
}: IProps) => {
  const [selectUnit, setSelectUnit] = useState<OptionParam>(
    OptionParam.UNIT_KW_OR_KWH
  );
  const { t } = useTranslation();
  const [isOpenConsolapse, setIsOpenConsolapse] = useState<boolean>(true);
  const [form] = Form.useForm();

  const lineChartRef = useRef<Chart<'line'>>();
  const barChartRef = useRef<Chart<'bar'>>();

  ///---------List Option-----------//

  const optionParam: { key: string; label: string; value: OptionParam }[] = [
    { key: 'percent', value: OptionParam.UNIT_PERCENT, label: '%' },
    { key: 'kwOrkwh', value: OptionParam.UNIT_KW_OR_KWH, label: 'kW/kWh' },
    {
      key: 'alarm',
      value: OptionParam.ALARM_STATUS,
      label: `${t(i18nKey.alarmCenter.label.alarmStatus)}`
    }
  ];

  //-----Exclude Alarm Option ---------///
  const optionSelectParam: {
    key: string;
    label: string;
    value: OptionParam;
  }[] = useMemo(
    () => (dataChartAlarm ? optionParam : optionParam.slice(0, 2)),
    [dataChartAlarm]
  );

  //-----------------------------//
  const renderUnitTime = (type: TypeFilterDate, selectOption: OptionParam) => {
    if (type === TypeFilterDate.day) {
      return selectOption === OptionParam.ALARM_STATUS
        ? undefined
        : unitTime[TypeFilterDate.day];
    }
    if (type === TypeFilterDate.total) {
      const lengthTime =
        selectOption === OptionParam.ALARM_STATUS
          ? dataChartAlarm?.at(0)?.time?.length
          : dataChart[0]?.time?.length;
      const newUnit =
        lengthTime && lengthTime > String('YYYY').length ? 'month' : 'year';
      return newUnit;
    }
    return unitTime[type];
  };

  const lisHour = React.useRef<string[]>(
    Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'))
  );

  //-------------------------//
  const convertDateDataChart = useMemo(() => {
    if (dataChart.length && searchField.type === TypeFilterDate.day) {
      const mapKeyTime = dataChart.reduce(
        (map: Map<string, IChart>, item: IChart) => {
          map.set(item.time as string, item);
          return map;
        },
        new Map()
      );
      return lisHour.current.map((item) => {
        const data: IChart = mapKeyTime.get(item) || itemInitChart;
        return { ...data, time: moment(searchField.from).add(item, 'hour') };
      });
    }
    return dataChart;
  }, [searchField, dataChart]);

  //--------------Convert Status in Data like Dataset-------------------------//

  const renderMinTime = (timeStart: string, selectOption: OptionParam) => {
    if (searchField.type === TypeFilterDate.day) {
      return selectOption === OptionParam.ALARM_STATUS ? undefined : timeStart;
    }
    if (searchField.type === TypeFilterDate.total) {
      return;
    }
    return timeStart;
  };
  const renderMaxTime = (timeEnd: moment.Moment, selectOption: OptionParam) => {
    if (searchField.type === TypeFilterDate.day) {
      return selectOption === OptionParam.ALARM_STATUS
        ? undefined
        : moment(timeEnd).add(1, 'm');
    }
    if (searchField.type === TypeFilterDate.total) {
      return;
    }
    return moment(timeEnd).startOf(roundingTime[searchField.type]);
  };

  const renderDataChartAlarm = () => {
    const dataTemp = dataChartAlarm as any;
    return dataTemp?.map((item: any) => {
      const alarmNew = item.alarms.find((alarm: any) => alarm.status === 'new');
      const alarmResolved = item.alarms.find(
        (alarm: any) => (alarm.status = 'resolved')
      );
      const alarmAcknowledged = item.alarms.find(
        (alarm: any) => (alarm.status = 'acknowledged')
      );
      return {
        new: alarmNew,
        resolved: alarmResolved,
        acknowledged: alarmAcknowledged,
        time:
          searchField.type === TypeFilterDate.day
            ? moment(searchField.from).add(+item.time, 'hour')
            : new Date(item.time)
      };
    });
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
      stepSize: 100,
      position: 'left',
      grid: {
        display: false,
        drawTicks: false
      },
      title: {
        display: true
      },
      ticks: {
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
  //-------------------------------------------//
  const scalesPercent = {
    x: {
      min: renderMinTime(searchField.from, selectUnit),
      max: renderMaxTime(moment(searchField.to), selectUnit),
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
    percent: {
      beginAtZero: true,
      min: 0,
      position: 'left',
      grid: {
        display: false,
        drawTicks: false
      },
      title: {
        display: true,
        text: '%'
      },
      ticks: {
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

  //----------Scales Unit KwOr Kwh------------//
  const scalesKWOrKwh = {
    x: {
      min: renderMinTime(searchField.from, selectUnit),
      max: renderMaxTime(moment(searchField.to), selectUnit),
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

    kW: {
      title: {
        display: true,
        text: 'kW'
      },
      position: 'left',
      grid: {
        display: false,
        drawTicks: false
      },
      ticks: {
        color: '#212426',
        font: {
          family: 'DM Sans',
          size: 12,
          weight: 'normal'
        }
      }
    },
    kWh: {
      title: {
        display: true,
        text: 'kWh'
      },
      position: 'right',
      grid: {
        display: false,
        drawTicks: false
      },
      ticks: {
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

  const renderScalesOptionParam = {
    [OptionParam.ALARM_STATUS]: scalesAlarm,
    [OptionParam.UNIT_KW_OR_KWH]: scalesKWOrKwh,
    [OptionParam.UNIT_PERCENT]: scalesPercent
  };

  const switchColor = (
    red: number,
    green: number,
    blue: number,
    alpha: number
  ) => {
    if (searchField.type === TypeFilterDate.day) {
      return `rgba(${red},${green},${blue},${alpha})`;
    }
    return `rgb(${red},${green},${blue}`;
  };
  //
  const optionsLine = {
    scales: renderScalesOptionParam[selectUnit],
    interaction: {
      mode: 'index',
      intersect: false
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
      }
    }
  } as any;

  const optionBar = {
    scales: renderScalesOptionParam[selectUnit],
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
          : {},
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
  //------------------------------//
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

  const datasetPercent = [
    {
      fill: true,
      tension: 0.5,
      label: '3PhaseSOH',
      data: convertDateDataChart,
      borderColor: '#FF8060',
      backgroundColor: switchColor(255, 128, 96, 0.2),

      parsing: {
        yAxisKey: '3PhaseSOH',
        xAxisKey: 'time'
      },
      yAxisID: 'percent'
    },
    {
      fill: true,
      tension: 0.5,
      label: '3PhaseSOC',
      data: convertDateDataChart,

      parsing: {
        yAxisKey: '3PhaseSOC',
        xAxisKey: 'time'
      },
      yAxisID: 'percent'
    }
  ];

  const dataSetKwOrKwh = [
    {
      fill: true,
      tension: 0.5,
      label: 'Total-kWh-Injected',
      data: convertDateDataChart,
      borderColor: 'rgb(255,102,102)',
      backgroundColor: switchColor(255, 102, 102, 0.2),
      parsing: {
        yAxisKey: 'totalkWhInjected',
        xAxisKey: 'time'
      },
      yAxisID: 'kWh'
    },
    {
      fill: true,
      tension: 0.5,
      label: 'Total-kWh-Absorbed',
      data: convertDateDataChart,
      borderColor: 'rgb(255,255,102)',
      backgroundColor: switchColor(255, 255, 102, 0.2),
      parsing: {
        yAxisKey: 'totalkWhAbsorbed',
        xAxisKey: 'time'
      },
      yAxisID: 'kWh'
    },
    {
      fill: true,
      tension: 0.5,
      label: 'Total-3-Phase-AC-kW',
      data: convertDateDataChart,
      borderColor: 'rgb(29,215,109)',
      backgroundColor: switchColor(29, 215, 109, 0.2),
      parsing: {
        yAxisKey: 'total3PhaseACkW',
        xAxisKey: 'time'
      },
      yAxisID: 'kW'
    },
    {
      fill: true,
      tension: 0.5,
      label: '3-Phase-kWh-Available',
      data: convertDateDataChart,
      borderColor: 'rgb(188,79,215)',
      backgroundColor: switchColor(188, 79, 215, 0.2),
      parsing: {
        yAxisKey: '3PhasekWhAvailable',
        xAxisKey: 'time'
      },
      yAxisID: 'kWh'
    },
    {
      fill: true,
      tension: 0.5,
      label: 'Local-Loads-kW',
      data: convertDateDataChart,
      borderColor: 'rgb(79,133,215)',
      backgroundColor: switchColor(79, 133, 215, 0.2),
      parsing: {
        yAxisKey: 'localLoadskW',
        xAxisKey: 'time'
      },
      yAxisID: 'kW'
    },

    {
      fill: true,
      tension: 0.5,
      label: 'Solar-AC-kW',
      data: convertDateDataChart,
      borderColor: 'rgb(0,0,102)',
      backgroundColor: switchColor(0, 0, 102, 0.2),
      parsing: {
        yAxisKey: 'solarACkW',
        xAxisKey: 'time'
      },
      yAxisID: 'kW'
    },
    {
      fill: true,
      tension: 0.5,
      label: 'Solar-Total-kWh-Injected',
      data: convertDateDataChart,
      borderColor: '#154c79',
      backgroundColor: switchColor(21, 76, 121, 0.2),
      parsing: {
        yAxisKey: 'solarTotalkWhInjected',
        xAxisKey: 'time'
      },
      yAxisID: 'kWh'
    },
    {
      fill: true,
      tension: 0.5,
      label: 'Building/Utility-meter',
      data: convertDateDataChart,
      borderColor: 'rgb(238,151,72)',
      backgroundColor: switchColor(238, 151, 72, 0.2),
      parsing: {
        yAxisKey: 'building/utilityMeter',
        xAxisKey: 'time'
      },
      yAxisID: 'kWh'
    }
  ];

  const renderDataSetOptionParam = {
    [OptionParam.ALARM_STATUS]: datasetAlarm(),
    [OptionParam.UNIT_KW_OR_KWH]: dataSetKwOrKwh,
    [OptionParam.UNIT_PERCENT]: datasetPercent
  };
  const data = {
    datasets: renderDataSetOptionParam[selectUnit]
  };

  const handleOpenChart = () => {
    setIsOpenConsolapse(!isOpenConsolapse);
  };

  //----------------Change Value Form ----------------------------//
  const handleFormChange = (valueChange: Partial<IValueForm>) => {
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

  //--------------------Render Date Picker -------------------------------//
  const checkDateDisable = (current: Dayjs) => {
    return current && current.valueOf() > Date.now();
  };

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
    <div className={`${styles.container}`}>
      <Form
        onValuesChange={handleFormChange}
        form={form}
        className={styles.form_chart}
        initialValues={{
          unit: selectUnit,
          type: searchField.type,
          date: dayJs()
        }}>
        <Row gutter={[16, 16]}>
          <Col sm={24} xs={24} md={24} lg={24} xl={10} xxl={10}>
            <Row gutter={16} className={styles.form_chart_right}>
              <Col xs={12} sm={12} md={8} lg={8} xl={10} xxl={10}>
                <Form.Item name="unit">
                  <Select
                    style={{ width: '100%' }}
                    placeholder="Select Pramater"
                    onChange={(value) => {
                      setSelectUnit(value);
                      lineChartRef.current && lineChartRef.current?.update();
                      barChartRef.current && barChartRef.current?.update();
                    }}
                    options={optionSelectParam}
                  />
                </Form.Item>
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
                <Form.Item name="type">
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
                </Form.Item>
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
                    src={isOpenConsolapse ? ArrowDown : ArrowDownBottom}></img>
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
            {searchField.type === TypeFilterDate.day &&
            selectUnit !== OptionParam.ALARM_STATUS ? (
              <div className="canvas-container">
                <Line
                  ref={lineChartRef}
                  options={optionsLine}
                  data={data as any}
                />
              </div>
            ) : (
              <div className="canvas-container">
                <Bar ref={barChartRef} data={data as any} options={optionBar} />
              </div>
            )}
          </>
        ))}
    </div>
  );
};

export default LineBarChart;
