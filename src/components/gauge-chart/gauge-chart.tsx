import { Form, Row, Col, Select, Spin, Button, Empty } from 'antd';
import styles from '../doughnut-chart/doughnut-chart.module.less';
import { ApexOptions } from 'apexcharts';
import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { IQualityReport } from 'src/interfaces/overview';
import ProgressBar from '../progress-bar/ProgressBar';
import { round } from 'lodash';
import { useTranslation } from 'react-i18next';
import { i18nKey } from 'src/locales/i18n';

type Props = {
  title: string;
  qualityReport: IQualityReport | undefined;
};
export const GaugeChart = ({ title, qualityReport }: Props) => {
  const [t] = useTranslation();
  const [seeDetail, setSeeDetail] = useState(false);
  const series = [
    (qualityReport &&
      qualityReport.iaqResult.generalIaqiReport.generalIaqi / 5) ||
      0
  ];
  const options: ApexOptions = {
    chart: {
      height: 280,
      type: 'radialBar',
      id: 'plantChart'
    },
    colors: ['#20E647'],
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        track: {
          background: '#333',
          startAngle: -90,
          endAngle: 90
        },
        dataLabels: {
          name: {
            show: false
          },
          value: {
            fontSize: '30px',
            show: false
          }
        }
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'white',
        type: 'horizontal',
        gradientToColors: ['red'],
        stops: [0, 100]
      }
    },
    stroke: {
      lineCap: 'butt'
    },
    labels: ['Progress']
  };

  return (
    <div
      className={styles.wrapper}
      style={{
        transition: 'all .2s ease'
      }}>
      <Row gutter={[0, 16]}>
        <Col>
          <Row justify={'space-between'} align={'middle'}>
            <Col className={styles.title}>{title}</Col>
          </Row>
        </Col>
        <Col offset={8}>
          <Button
            onClick={() => setSeeDetail(!seeDetail)}
            className={styles.wrapper_btn_alarm}>
            See Detail
          </Button>
        </Col>
      </Row>
      <Row justify={'center'} style={{ marginTop: 10, marginBottom: 10 }}>
        {qualityReport?.iaqResult.generalIaqiReport.generalIaqi ? (
          <Row gutter={[0, 16]}>
            {seeDetail ? (
              <div
                style={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: 10,
                  backdropFilter: 'blur',
                  color: 'black',
                  padding: 0
                }}>
                <Col>
                  <Row style={{ fontSize: 15, fontWeight: 'bold' }}>
                    Acceptable Subtances
                  </Row>
                  <Row>
                    <Col>
                      {qualityReport?.iaqResult.acceptableSubstances.map(
                        (item) => (
                          <div
                            key={item.unit}
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              padding: '10px 0',
                              borderBottom: '1px solid #ccc',
                              alignItems: 'center',
                              position: 'relative',
                              gap: '10px' // Uniform gap between columns
                            }}>
                            <div
                              style={{
                                flex: '1 1 0',
                                textAlign: 'left',
                                paddingLeft: '5px',
                                position: 'relative',
                                minWidth: '100px' // Fixed width for consistency
                              }}>
                              {item.name}
                            </div>
                            <div
                              style={{
                                flex: '1 1 0',
                                textAlign: 'center',
                                position: 'relative',
                                minWidth: '100px' // Fixed width for consistency
                              }}>
                              {round(item.iaqiValue as number, 2)}
                            </div>
                            <div
                              style={{
                                flex: '1 1 0',
                                textAlign: 'center',
                                color: 'black',
                                backgroundColor: `${item.threshold.color}`,
                                padding: '3px',
                                borderRadius: '50px',
                                whiteSpace: 'nowrap', // Prevent text from wrapping
                                minWidth: '150px', // Fixed width for consistency
                                fontWeight: 'revert'
                              }}>
                              {t(
                                (i18nKey.parameterEntity.thresholdName as any)[
                                  item.threshold.name
                                ]
                              )}
                            </div>
                          </div>
                        )
                      )}
                    </Col>
                  </Row>
                  <Row style={{ fontSize: 15, fontWeight: 'bold' }}>
                    Unacceptable Subtances
                  </Row>
                  <Row style={{ marginLeft: 5 }}>
                    <Col>
                      {qualityReport?.iaqResult.unAcceptableSubstances.map(
                        (item) => (
                          <div
                            key={item.unit}
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              padding: '10px 0',
                              borderBottom: '1px solid #ccc',
                              alignItems: 'center',
                              position: 'relative',
                              gap: '10px' // Uniform gap between columns
                            }}>
                            <div
                              style={{
                                flex: '1 1 0',
                                textAlign: 'left',
                                paddingLeft: '5px',
                                position: 'relative',
                                minWidth: '100px' // Fixed width for consistency
                              }}>
                              {item.name}
                            </div>
                            <div
                              style={{
                                flex: '1 1 0',
                                textAlign: 'center',
                                position: 'relative',
                                minWidth: '100px' // Fixed width for consistency
                              }}>
                              {round(item.iaqiValue as number, 2)}
                            </div>
                            <div
                              style={{
                                flex: '1 1 0',
                                textAlign: 'center',
                                color: 'black',
                                backgroundColor: `${item.threshold.color}`,
                                padding: '3px',
                                borderRadius: '50px',
                                whiteSpace: 'nowrap', // Prevent text from wrapping
                                minWidth: '150px', // Fixed width for consistency
                                fontWeight: 'revert'
                              }}>
                              {t(
                                (i18nKey.parameterEntity.thresholdName as any)[
                                  item.threshold.name
                                ]
                              )}
                            </div>
                          </div>
                        )
                      )}
                    </Col>
                  </Row>
                </Col>
              </div>
            ) : (
              <Row
                justify={'center'}
                style={{ position: 'relative', padding: 5 }}>
                <ReactApexChart
                  options={options}
                  type="radialBar"
                  series={series}
                  height={400}
                />
                <Row
                  className={styles.title}
                  style={{
                    position: 'absolute',
                    width: '100%',
                    justifyContent: 'center'
                  }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 5
                    }}>
                    <div
                      style={{
                        padding: 3,
                        alignItems: 'center'
                      }}>
                      {round(
                        qualityReport.iaqResult.generalIaqiReport.generalIaqi,
                        2
                      )}
                    </div>
                    <div
                      style={{
                        color: 'black',
                        display: 'flex',
                        backgroundColor: `${qualityReport.iaqResult.generalIaqiReport.color}`,
                        paddingLeft: 10,
                        paddingRight: 10,
                        borderRadius: 50,
                        alignItems: 'center'
                      }}>
                      {t(
                        (i18nKey.parameterEntity.thresholdName as any)[
                          `${qualityReport.iaqResult.generalIaqiReport.name}`
                        ]
                      )}
                    </div>
                  </div>
                </Row>
              </Row>
            )}
          </Row>
        ) : (
          <Row justify={'center'}>
            <Empty image={Empty.PRESENTED_IMAGE_DEFAULT} />
          </Row>
        )}
      </Row>
    </div>
  );
};
