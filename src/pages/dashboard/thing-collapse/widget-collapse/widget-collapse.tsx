import React from 'react';
import { BackgroupColor, Color, TextTimeseries } from 'src/constants/thing';
import { Empty, Row } from 'antd';
import styles from './widget-collapse.module.less';
import { ITimeseriesData } from 'src/interfaces/overview';
import OverviewPointCell from 'src/components/overview/overview-point-cell/overview-point-cell';

export interface IProps {
  data?: ITimeseriesData;
  arrayTimes: any[];
}

const WidgetCollapse: React.FC<IProps> = ({ data, arrayTimes }) => {
  const renderData = (data: ITimeseriesData) => {
    return (
      <Row className={styles.wrapper_content_info__fullHeight} gutter={16}>
        {data['pm2.5'] ? (
          <div className={styles.wrapper_content_info_item}>
            <OverviewPointCell
              text={TextTimeseries.PM25}
              param={`${data['pm2.5']}`}
              backgroud={BackgroupColor.PM25}
              color={Color.PM25}
            />
          </div>
        ) : null}
        {data['pm10'] ? (
          <div className={styles.wrapper_content_info_item}>
            <OverviewPointCell
              text={TextTimeseries.PM10}
              param={`${data['pm10']}`}
              backgroud={BackgroupColor.PM10}
              color={Color.PM10}
            />
          </div>
        ) : null}
        {data['co2'] ? (
          <div className={styles.wrapper_content_info_item}>
            <OverviewPointCell
              text={TextTimeseries.CO2}
              param={`${data['co2']}`}
              backgroud={BackgroupColor.CO2}
              color={Color.CO2}
            />
          </div>
        ) : null}
        {data['temperature'] ? (
          <div className={styles.wrapper_content_info_item}>
            <OverviewPointCell
              text={TextTimeseries.Temp}
              param={`${data['temperature']}`}
              backgroud={BackgroupColor.Temp}
              color={Color.Temp}
            />
          </div>
        ) : null}
        {data['humidity'] ? (
          <div className={styles.wrapper_content_info_item}>
            <OverviewPointCell
              text={TextTimeseries.Humi}
              param={`${data['humidity']}`}
              backgroud={BackgroupColor.Humi}
              color={Color.Humi}
            />
          </div>
        ) : null}
        {data['lpg'] ? (
          <div className={styles.wrapper_content_info_item}>
            <OverviewPointCell
              text={TextTimeseries.LPG}
              param={`${data['lpg']}`}
              backgroud={BackgroupColor.LPG}
              color={Color.LPG}
            />
          </div>
        ) : null}
        {data['ch4'] ? (
          <div className={styles.wrapper_content_info_item}>
            <OverviewPointCell
              text={TextTimeseries.CH4}
              param={`${data['ch4']}`}
              backgroud={BackgroupColor.CH4}
              color={Color.CH4}
            />
          </div>
        ) : null}
        {data['co'] ? (
          <div className={styles.wrapper_content_info_item}>
            <OverviewPointCell
              text={TextTimeseries.CO}
              param={`${data['co']}`}
              backgroud={BackgroupColor.CO}
              color={Color.CO}
            />
          </div>
        ) : null}
        {data['alcohol'] ? (
          <div className={styles.wrapper_content_info_item}>
            <OverviewPointCell
              text={TextTimeseries.Alcohol}
              param={`${data['alcohol']}`}
              backgroud={BackgroupColor.Alcohol}
              color={Color.Alcohol}
            />
          </div>
        ) : null}
        {data['toluen'] ? (
          <div className={styles.wrapper_content_info_item}>
            <OverviewPointCell
              text={TextTimeseries.Toluen}
              param={`${data['toluen']}`}
              backgroud={BackgroupColor.Toluen}
              color={Color.Toluen}
            />
          </div>
        ) : null}
        {data['nh4'] ? (
          <div className={styles.wrapper_content_info_item}>
            <OverviewPointCell
              text={TextTimeseries.NH4}
              param={`${data['nh4']}`}
              backgroud={BackgroupColor.NH4}
              color={Color.NH4}
            />
          </div>
        ) : null}
        {data['aceton'] ? (
          <div className={styles.wrapper_content_info_item}>
            <OverviewPointCell
              text={TextTimeseries.Aceton}
              param={`${data['aceton']}`}
              backgroud={BackgroupColor.Aceton}
              color={Color.Aceton}
            />
          </div>
        ) : null}
        {data['tvoc'] ? (
          <div className={styles.wrapper_content_info_item}>
            <OverviewPointCell
              text={TextTimeseries.TVOC}
              param={`${data['tvoc']}`}
              backgroud={BackgroupColor.TVOC}
              color={Color.TVOC}
            />
          </div>
        ) : null}
      </Row>
    );
  };
  return (
    <>
      {data && arrayTimes.length > 2 ? (
        <div>{renderData(data)}</div>
      ) : (
        <Row justify={'center'}>
          <Empty image={Empty.PRESENTED_IMAGE_DEFAULT} />
        </Row>
      )}
    </>
  );
};

export default WidgetCollapse;
