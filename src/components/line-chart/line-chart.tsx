/*eslint-disable*/
import ReactApexChart from 'react-apexcharts';
import React, { useEffect, useMemo, useState } from 'react';
import { ApexOptions } from 'apexcharts';
import moment from 'moment-timezone';
import { Col, DatePicker, Form, Radio, Row, Select, Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import { i18nKey } from 'src/locales/i18n';
import dayJs, { Dayjs } from 'dayjs';
import styles from 'src/components/line-bar-chart/line-bar-chart.module.less';
import { IChartParam } from 'src/interfaces/overview';
import 'chartjs-adapter-moment';
import _ from 'lodash';

const { RangePicker } = DatePicker;

enum OptionParam {
  UNIT_TEMPERATURE = '°C',
  UNIT_HUMIDITY = '%',
  UNIT_PARTICULATEMATTER = 'μg/m³',
  UNIT_TOXICGASES = 'ppm'
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
  unit: '°C' | '%' | 'μg/m³' | 'ppm';
  date: Dayjs;
  type: TypeFilterDate;
}
const unitTime = {
  [TypeFilterDate.day]: 'hour',
  [TypeFilterDate.week]: 'day',
  [TypeFilterDate.month]: 'day',
  [TypeFilterDate.year]: 'month'
};

interface IDataTemperature {
  temperature: number;
}

interface IDataHumidity {
  humidity: number;
}

interface IDataParticulateMatter {
  pm25: number;
  pm10: number;
}

interface IDataToxicGases {
  lpg: number;
  co: number;
  co2: number;
  tvoc: number;
}
type keyTemperature = keyof IDataTemperature;
type keyHumidity = keyof IDataHumidity;
type keyParticulateMatter = keyof IDataParticulateMatter;
type keyToxicGases = keyof IDataToxicGases;

type DataSeries = number[];

export interface SearchField {
  from: string;
  to: string;
  type: TypeFilterDate;
}

interface IProps {
  searchField: SearchField;
  onSetSearchField: (newSearchField: SearchField) => void;
  dataChart: IChartParam[]; //ICurrentData,
  loadingChart: boolean;
}

const LineChart = ({
  searchField,
  onSetSearchField,
  dataChart,
  loadingChart
}: IProps) => {
  const { t } = useTranslation();
  const [selectUnit, setSelectUnit] = useState<OptionParam>(
    OptionParam.UNIT_TOXICGASES
  );

  const [isOpenConsolapse, setIsOpenConsolapse] = useState<boolean>(true);
  const [form] = Form.useForm();
  const [dataMapTemperature, setDataMapTemperature] = useState<
    Map<keyTemperature, DataSeries[]>
  >(new Map());
  const [dataMapHumidity, setDataMapHumidity] = useState<
    Map<keyHumidity, DataSeries[]>
  >(new Map());
  const [dataMapParticulateMatter, setDataMapParticulateMatter] = useState<
    Map<keyParticulateMatter, DataSeries[]>
  >(new Map());
  const [dataMapToxicGases, setDataMapToxicGases] = useState<
    Map<keyToxicGases, DataSeries[]>
  >(new Map());

  const convertData = () => {
    const listKeyTemperature: keyTemperature[] = ['temperature'];
    const listKeyHumidity: keyHumidity[] = ['humidity'];
    const listKeyParticulateMatter: keyParticulateMatter[] = ['pm10', 'pm25'];
    const listKeyToxicGases: keyToxicGases[] = ['lpg', 'co', 'co2', 'tvoc'];

    const dataTemperature: Map<keyTemperature, DataSeries[]> = new Map();
    const dataHumidity: Map<keyHumidity, DataSeries[]> = new Map();
    const dataParticulateMatter: Map<keyParticulateMatter, DataSeries[]> =
      new Map();
    const dataToxicGases: Map<keyToxicGases, DataSeries[]> = new Map();

    dataChart?.forEach((item) => {
      const timeX = (() => {
        if (searchField.type === TypeFilterDate.day) {
          const timeA = item.time!;

          const timeFormat = moment(timeA, ['HH:mm']);
          return moment(searchField.from)
            .add(timeFormat.minutes(), 'minute')
            .add(timeFormat.hour(), 'h');
        } else {
          const timeA = item.time!;
          return moment(timeA);
        }
      })();

      listKeyHumidity.forEach((key: keyHumidity) => {
        const currentData = dataHumidity.get(key) || [];
        // currentData
        const newData: DataSeries[] = [
          ...currentData,
          [timeX.valueOf(), item[key]]
        ];
        dataHumidity.set(key, newData);
      });

      listKeyTemperature.forEach((key: keyTemperature) => {
        const currentData = dataTemperature.get(key) || [];
        // currentData
        const newData: DataSeries[] = [
          ...currentData,
          [timeX.valueOf(), item[key]]
        ];
        dataTemperature.set(key, newData);
      });

      listKeyParticulateMatter.forEach((key: keyParticulateMatter) => {
        const currentData = dataParticulateMatter.get(key) || [];
        // currentData
        const newData: DataSeries[] = [
          ...currentData,
          [timeX.valueOf(), item[key]]
        ];
        dataParticulateMatter.set(key, newData);
      });

      listKeyToxicGases.forEach((key: keyToxicGases) => {
        const currentData = dataToxicGases.get(key) || [];
        // currentData
        const newData: DataSeries[] = [
          ...currentData,
          [timeX.valueOf(), item[key]]
        ];
        dataToxicGases.set(key, newData);
      });
    });

    setDataMapHumidity(() => {
      const temp = new Map(dataHumidity);
      return temp;
    });

    setDataMapTemperature(() => {
      const temp = new Map(dataTemperature);
      return temp;
    });

    setDataMapParticulateMatter(() => {
      const temp = new Map(dataParticulateMatter);
      return temp;
    });

    setDataMapToxicGases(() => {
      const temp = new Map(dataToxicGases);
      return temp;
    });
  };

  useEffect(() => {
    convertData();
  }, [dataChart]);

  const handleOpenChart = () => {
    setIsOpenConsolapse(!isOpenConsolapse);
  };

  const renderSeriesTemperature = (): ApexAxisChartSeries => {
    const series2: ApexAxisChartSeries = [];
    dataMapTemperature.forEach((value: DataSeries[], key: keyTemperature) => {
      series2.push({ name: key, type: 'line', data: value });
    });
    return series2;
  };

  //---------------------------------

  const renderSeriesParticulateMatter = (): ApexAxisChartSeries => {
    const series2: ApexAxisChartSeries = [];
    dataMapParticulateMatter.forEach(
      (value: DataSeries[], key: keyParticulateMatter) => {
        series2.push({ name: key, type: 'line', data: value });
      }
    );
    return series2;
  };

  //-------------------------------------------------//
  const renderSeriesToxicGases = (): ApexAxisChartSeries => {
    const series2: ApexAxisChartSeries = [];
    dataMapToxicGases.forEach((value: DataSeries[], key: keyToxicGases) => {
      series2.push({ name: key, type: 'line', data: value });
    });
    return series2;
  };

  const renderSeriesHumidity = (): ApexAxisChartSeries => {
    const series2: ApexAxisChartSeries = [];
    dataMapHumidity.forEach((value: DataSeries[], key: keyHumidity) => {
      series2.push({ name: key, type: 'line', data: value });
    });
    return series2;
  };

  const seriesTemperature: ApexAxisChartSeries = useMemo(() => {
    return renderSeriesTemperature();
  }, [dataMapTemperature]);

  const seriesHumidity: ApexAxisChartSeries = useMemo(() => {
    return renderSeriesHumidity();
  }, [dataMapHumidity]);

  const seriesParticulateMatter: ApexAxisChartSeries = useMemo(() => {
    return renderSeriesParticulateMatter();
  }, [dataMapParticulateMatter]);

  const seriesToxicGases: ApexAxisChartSeries = useMemo(() => {
    return renderSeriesToxicGases();
  }, [dataMapToxicGases]);

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

  const optionTemperature: ApexOptions = {
    chart: {
      height: 500,
      type: 'line',
      id: 'plantChart',
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
          text: '°C'
        }
      }
    ]
  };

  const optionsHumidity: ApexOptions = {
    chart: {
      height: 500,
      type: 'line',
      id: 'plantChart',
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

  const optionsParticulateMatter: ApexOptions = {
    chart: {
      height: 500,
      type: 'line',
      id: 'plantChart',
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
          text: 'μg/m³'
        }
      }
    ]
  };

  const optionsToxicGases: ApexOptions = {
    chart: {
      height: 500,
      type: 'line',
      id: 'plantChart',
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
        max: 1000,
        title: {
          text: 'ppm'
        }
      }
    ]
  };

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

  const renderFilterDate = () => {
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
  };

  const checkDateDisable = (current: Dayjs) => {
    return current && current.valueOf() > Date.now();
  };

  ///---------List Option-----------//

  const optionParam: { key: string; label: string; value: OptionParam }[] = [
    { key: 'temperature', value: OptionParam.UNIT_TEMPERATURE, label: '°C' },
    { key: 'humidity', value: OptionParam.UNIT_HUMIDITY, label: '%' },
    {
      key: 'particulateMatter',
      value: OptionParam.UNIT_PARTICULATEMATTER,
      label: 'μg/m³'
    },
    { key: 'toxicGases', value: OptionParam.UNIT_TOXICGASES, label: 'ppm' }
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
    [OptionParam.UNIT_HUMIDITY]: optionsHumidity,
    [OptionParam.UNIT_TEMPERATURE]: optionTemperature,
    [OptionParam.UNIT_PARTICULATEMATTER]: optionsParticulateMatter,
    [OptionParam.UNIT_TOXICGASES]: optionsToxicGases
  };

  const renderSeries: { [key in OptionParam]?: ApexAxisChartSeries } = {
    [OptionParam.UNIT_HUMIDITY]: seriesHumidity,
    [OptionParam.UNIT_TEMPERATURE]: seriesTemperature,
    [OptionParam.UNIT_PARTICULATEMATTER]: seriesParticulateMatter,
    [OptionParam.UNIT_TOXICGASES]: seriesToxicGases
  };

  const handleOnChangeUnit = (value: OptionParam) => {
    const isTypeNotFetch = [TypeFilterDate.day, TypeFilterDate.week].includes(
      searchField.type
    );
    setSelectUnit(value);
    if (!isTypeNotFetch) {
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
              <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
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
            </Row>
          </Col>
        </Row>
      </Form>
      {loadingChart ? (
        <Row
          justify="center"
          align="middle"
          style={{ width: '100%', height: '60vh' }}>
          <Spin />
        </Row>
      ) : (
        <ReactApexChart
          options={renderOption[selectUnit]}
          series={renderSeries[selectUnit]}
          height={300}
        />
      )}
    </div>
  );
};

export default React.memo(LineChart);
