import { Form, Row, Col, Select, Spin, Button, Empty } from 'antd';
import styles from '../doughnut-chart/doughnut-chart.module.less';
import { ApexOptions } from 'apexcharts';
import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { IQualityReport } from 'src/interfaces/overview';
import ProgressBar from '../progress-bar/ProgressBar';
import { round } from 'lodash';

type Props = {
  title: string;
  qualityReport: IQualityReport | undefined;
};
export const GaugeChart = ({ title, qualityReport }: Props) => {
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
      <Row style={{ width: '100%' }} justify={'space-between'} align={'middle'}>
        <Col>
          <Row gutter={8} align={'middle'}>
            <Col className={styles.title}>{title}</Col>
          </Row>
        </Col>
        <Col>
          <Button
            onClick={() => setSeeDetail(!seeDetail)}
            className={styles.wrapper_btn_alarm}>
            See Detail
          </Button>
        </Col>
      </Row>
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
                padding: 10
              }}>
              <Col>
                <Row style={{ fontSize: 20, fontWeight: 'bold' }}>
                  Acceptable Subtances
                </Row>
                <Row style={{ marginLeft: 5 }}>
                  <Col>
                    {qualityReport?.iaqResult.acceptableSubstances.map(
                      (item) => (
                        <div key={item.unit}>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 5,
                              width: '100%'
                            }}>
                            <div>{item.name}: </div>
                            <div
                              style={{
                                padding: 3,
                                alignItems: 'center'
                              }}>
                              {round(item.value, 2)}
                            </div>
                            <div
                              style={{
                                color: 'black',
                                display: 'flex',
                                backgroundColor: `${item.threshold.color}`,
                                paddingLeft: 10,
                                paddingRight: 10,
                                borderRadius: 50,
                                alignItems: 'center'
                              }}>
                              {item.threshold.name}
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </Col>
                </Row>
                <Row style={{ fontSize: 20, fontWeight: 'bold' }}>
                  Unacceptable Subtances
                </Row>
                <Row style={{ marginLeft: 5 }}>
                  <Col>
                    {qualityReport?.iaqResult.unAcceptableSubstances.map(
                      (item) => (
                        <div key={item.unit}>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              gap: 5
                            }}>
                            <div>{item.name}: </div>
                            <div
                              style={{
                                padding: 3,
                                alignItems: 'center'
                              }}>
                              {round(item.value, 2)}
                            </div>
                            <div
                              style={{
                                color: 'black',
                                display: 'flex',
                                backgroundColor: `${item.threshold.color}`,
                                paddingLeft: 10,
                                paddingRight: 10,
                                borderRadius: 50,
                                alignItems: 'center'
                              }}>
                              {item.threshold.name}
                            </div>
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
                height={300}
              />
              <Row
                className={styles.title}
                style={{
                  position: 'absolute',
                  width: '100%',
                  justifyContent: 'center'
                }}>
                {round(
                  qualityReport.iaqResult.generalIaqiReport.generalIaqi,
                  2
                )}
              </Row>
            </Row>
          )}
        </Row>
      ) : (
        <Row justify={'center'}>
          <Empty image={Empty.PRESENTED_IMAGE_DEFAULT} />
        </Row>
      )}
    </div>
  );
};
