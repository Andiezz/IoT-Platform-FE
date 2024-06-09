import React, { useState, useEffect } from 'react';
import 'chart.js/auto';
import styles from './doughnut-chart.module.less';
import { Doughnut } from 'react-chartjs-2';
import { Button, Col, Empty, Row } from 'antd';
import ArrowDown from 'src/assets/icons/arrow-down.svg';
import { useNavigate } from 'react-router';
import { PAGE_ROUTE } from 'src/constants/route';
import { IThingWarning } from 'src/interfaces/overview';
import { i18nKey } from 'src/locales/i18n';
import { useTranslation } from 'react-i18next';
import { createSearchParams } from 'react-router-dom';
// import { InfoCircleFilled } from '@ant-design/icons';
import useViewport from 'src/hooks/use-viewport';

const backgroundColor = [
  '#E1F45F',
  '#FF8060',
  '#2B7AE8',
  '#59BDF0',
  '#8CE6A4',
  '#EBEBF0'
];

const actions = [
  {
    name: 'Hide(0)',
    handler(chart: any) {
      chart.hide(0);
    }
  },
  {
    name: 'Show(0)',
    handler(chart: any) {
      chart.show(0);
    }
  },
  {
    name: 'Hide (0, 1)',
    handler(chart: any) {
      chart.hide(0, 1);
    }
  },
  {
    name: 'Show (0, 1)',
    handler(chart: any) {
      chart.show(0, 1);
    }
  }
];

interface IDoughnutChartProps {
  title?: string;
  datas?: IThingWarning[];
  display?: boolean;
  dataDaughtnut?: any;
  totalEmsStatus?: number;
  emsOrPlantName?: string;
  tooltip?: string;
  cellAlarm?: boolean;
}

function DoughnutChart({
  title,
  datas,
  display = true,
  dataDaughtnut,
  totalEmsStatus,
  emsOrPlantName,
  cellAlarm
}: IDoughnutChartProps) {
  const { t } = useTranslation();
  const [isOpenCollapse, setIsOpenConllapse] = useState<boolean>(false);
  const [values, setValues] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  const [contentOther, setContentOther] = useState<string>('');
  const [total, setTotal] = useState<number>(0);
  const navigate = useNavigate();
  const handleOpenChart = () => {
    setIsOpenConllapse(!isOpenCollapse);
  };
  const viewPort = useViewport();
  const isMobile = viewPort.width < 768;
  const [isRender, setIsRender] = useState<boolean>(false);

  // const renderTooltip = () => {
  //   return (
  //     <Tooltip title={tooltip}>
  //       <InfoCircleFilled className={styles.iconTooltip} />
  //     </Tooltip>
  //   );
  // };

  useEffect(() => {
    if (datas?.length) {
      const _values: number[] = [];
      const _labels: string[] = [];
      let _total = 0;
      let _valuesOther = 0;
      let _contentOther = '';
      datas.forEach((item: IThingWarning, index: number) => {
        if (index > 4) {
          _valuesOther += item.receivers.length;
          _total += item.receivers.length;
          _contentOther = _contentOther.concat(
            `${item.title || item._id} : ${item.receivers.length} \n`
          );
        } else {
          _values.push(item.receivers.length);
          _labels.push(item.title || item._id);
          _total += item.receivers.length;
        }
      });

      if (datas.length > 5) {
        _labels.push('Other');
        _values.push(_valuesOther);
        setContentOther(_contentOther);
      }

      setValues(_values);
      setLabels(_labels);
      setTotal(_total);
      setIsRender(true);
    }
  }, [datas]);

  const options = {
    aspectRatio: 2,
    responsive: false,
    plugins: {
      legend: {
        display: false
        // position: 'bottom',
        // maxHeight: 78,
        // labels: {
        //   font: {
        //     family: 'DM Sans',
        //     size: 12,
        //     weight: 400,
        //     lineHeight: '150%'
        //   },
        //   usePointStyle: true,
        //   pointStyle: 'rectRounded',
        //   padding: 12,
        //   color: '#212426'
        // },
        // align: 'start'
      },
      tooltip: {
        rlt: true,
        callbacks: {
          footer: (context: any[]) => {
            return context[0].label === 'Other' ? contentOther : '';
          }
        },
        titleFont: {
          size: 12
        },
        bodyFont: {
          size: 12
        }
      }
    },
    onHover: (event: any, chartElement: any) => {
      if (chartElement.length === 1) {
        event.native.target.style.cursor = 'pointer';
      } else {
        event.native.target.style.cursor = 'context-menu';
      }
    },
    borderWidth: 0,
    actions: { actions }
  } as any;

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Value',
        data: values,
        backgroundColor: [
          '#E1F45F',
          '#FF8060',
          '#2B7AE8',
          '#59BDF0',
          '#8CE6A4',
          '#EBEBF0'
        ],
        cutout: '80%',
        borderRadius: 33,
        spacing: -15
      }
    ]
  } as any;

  const textCenter = {
    id: 'textCenter',
    beforeDatasetsDraw(chart: any) {
      const { ctx } = chart;
      ctx.save();
      ctx.font = 'bolder 18px DM Sans';
      ctx.fillStyle = '#212426';
      ctx.textAlign = 'center';
      ctx.textBaseLine = 'middle';
      ctx.fillText(
        `${totalEmsStatus ?? total}`,
        chart.getDatasetMeta(0).data[0]?.x,
        chart.getDatasetMeta(0).data[0]?.y - 5
      );
      ctx.restore();

      ctx.font = '12px DM Sans ';
      ctx.fillStyle = '#848484';
      ctx.textAlign = 'center';
      ctx.textBaseLine = 'middle';
      ctx.fillText(
        'Total',
        chart.getDatasetMeta(0).data[0]?.x,
        chart.getDatasetMeta(0).data[0]?.y + 15
      );
      ctx.restore();
    }
  };

  return (
    <div
      className={styles.wrapper}
      style={{
        transition: 'all .2s ease',
        minHeight: !isOpenCollapse ? '250px' : '61px',
        height: !isOpenCollapse ? '100%' : 'auto'
      }}>
      <Row gutter={[0, 16]}>
        {display && (
          <Col span={24}>
            <Row justify={'space-between'} align={'middle'}>
              <Col>
                <Row gutter={8} align={'middle'}>
                  <Col className={styles.title}>{title}</Col>
                  {/* <Col>
                    {
                      tooltip && renderTooltip()
                    }
                  </Col> */}
                </Row>
              </Col>
              {/* <Col>
                <Row justify={'end'} gutter={16} className={styles.wrapper_btn}>
                  {
                    !isMobile && !cellAlarm && <Col >
                      <Button
                        className={styles.wrapper_btn_alarm}
                        onClick={() => {
                          navigate({
                            pathname: PAGE_ROUTE.DASHBOARD_ALARM,
                            search: `?${createSearchParams({
                              alarmType: title?.slice(0, -1) as string,
                              emsOrPlantName: emsOrPlantName as string
                            })}`,
                          });
                        }}>
                        {t(i18nKey.dashboard.label.alarmDetails)}
                      </Button>
                    </Col>
                  }

                </Row>
              </Col> */}
            </Row>
          </Col>
        )}
        {/* {!isOpenCollapse && ( */}
        <Row style={{ width: '100%' }} gutter={[0, 24]}>
          <Col span={24}>
            {datas?.length ? (
              isRender && (
                <Row gutter={[0, 16]}>
                  <Col span={24}>
                    <div className={styles.wrapperChart}>
                      <Doughnut
                        style={{
                          transition: 'all .2s ease',
                          minHeight: !isOpenCollapse ? '114px' : '0px'
                        }}
                        height={'114px'}
                        plugins={[textCenter]}
                        data={dataDaughtnut ?? data}
                        options={options}
                      />
                    </div>
                  </Col>
                  <Col span={24}>
                    <Row gutter={[12, 12]}>
                      {labels.map((item: any, index: number) => {
                        return (
                          <Col
                            key={index}
                            sm={12}
                            xs={12}
                            md={12}
                            lg={12}
                            xl={12}
                            xxl={12}
                            className={styles.wrapper_legend}>
                            <span
                              className={styles.wrapper_legend_label}
                              style={{
                                backgroundColor: `${backgroundColor[index]}`
                              }}></span>
                            {item}: {values[index]}
                          </Col>
                        );
                      })}
                    </Row>
                  </Col>
                </Row>
              )
            ) : (
              <Row justify={'center'}>
                <Empty image={Empty.PRESENTED_IMAGE_DEFAULT} />
              </Row>
            )}
          </Col>
          {/* {
              !cellAlarm && <Col xs={24} sm={24} md={0} lg={0} xl={0} xxl={0}>
                <Button
                  className={styles.wrapper_btn_alarm}
                  onClick={() => {
                    navigate({
                      pathname: PAGE_ROUTE.DASHBOARD_ALARM,
                      search: `?${createSearchParams({
                        alarmType: title?.slice(0, -1) as string,
                        emsOrPlantName: emsOrPlantName as string
                      })}`,
                    });
                  }}>
                  {t(i18nKey.dashboard.label.alarmDetails)}
                </Button>
              </Col>
            } */}
        </Row>
        {/* )} */}
      </Row>
    </div>
  );
}

export default DoughnutChart;
