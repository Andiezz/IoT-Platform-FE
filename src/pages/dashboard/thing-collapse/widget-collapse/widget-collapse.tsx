import React from 'react';
import { BackgroupColor, Color, TextTimeseries } from 'src/constants/thing';
import { Empty, Row } from 'antd';
import styles from './widget-collapse.module.less';
import OverviewPointCell from 'src/components/overview/overview-point-cell/overview-point-cell';
import { IParameterStandardModel } from 'src/dto/thing.dto';

export interface IProps {
  data?: IParameterStandardModel;
  arrayTimes?: any[];
}

const WidgetCollapse: React.FC<IProps> = ({ data }) => {
  const renderData = (data: IParameterStandardModel) => {
    return (
      <Row className={styles.wrapper_content_info__fullHeight} gutter={16}>
        {data.name.toLocaleLowerCase() === 'pm2.5' ? (
          <div className={styles.wrapper_content_info_item}>
            <OverviewPointCell
              text={TextTimeseries.PM25}
              param={`${data.weight} ${data.unit}`}
              backgroud={BackgroupColor.PM25}
              color={Color.PM25}
            />
          </div>
        ) : null}
        {data.name.toLocaleLowerCase() === 'pm10' ? (
          <div className={styles.wrapper_content_info_item}>
            <OverviewPointCell
              text={TextTimeseries.PM10}
              param={`${data.weight} ${data.unit}`}
              backgroud={BackgroupColor.PM10}
              color={Color.PM10}
            />
          </div>
        ) : null}
        {data.name.toLocaleLowerCase() === 'co2' ? (
          <div className={styles.wrapper_content_info_item}>
            <OverviewPointCell
              text={TextTimeseries.CO2}
              param={`${data.weight} ${data.unit}`}
              backgroud={BackgroupColor.CO2}
              color={Color.CO2}
            />
          </div>
        ) : null}
        {data.name.toLocaleLowerCase() === 'temperature' ? (
          <div className={styles.wrapper_content_info_item}>
            <OverviewPointCell
              text={TextTimeseries.Temp}
              param={`${data.weight} ${data.unit}`}
              backgroud={BackgroupColor.Temp}
              color={Color.Temp}
            />
          </div>
        ) : null}
        {data.name.toLocaleLowerCase() === 'humidity' ? (
          <div className={styles.wrapper_content_info_item}>
            <OverviewPointCell
              text={TextTimeseries.Humi}
              param={`${data.weight} ${data.unit}`}
              backgroud={BackgroupColor.Humi}
              color={Color.Humi}
            />
          </div>
        ) : null}
        {data.name.toLocaleLowerCase() === 'lpg' ? (
          <div className={styles.wrapper_content_info_item}>
            <OverviewPointCell
              text={TextTimeseries.LPG}
              param={`${data.weight} ${data.unit}`}
              backgroud={BackgroupColor.LPG}
              color={Color.LPG}
            />
          </div>
        ) : null}
        {data.name.toLocaleLowerCase() === 'ch4' ? (
          <div className={styles.wrapper_content_info_item}>
            <OverviewPointCell
              text={TextTimeseries.CH4}
              param={`${data.weight} ${data.unit}`}
              backgroud={BackgroupColor.CH4}
              color={Color.CH4}
            />
          </div>
        ) : null}
        {data.name.toLocaleLowerCase() === 'co' ? (
          <div className={styles.wrapper_content_info_item}>
            <OverviewPointCell
              text={TextTimeseries.CO}
              param={`${data.weight} ${data.unit}`}
              backgroud={BackgroupColor.CO}
              color={Color.CO}
            />
          </div>
        ) : null}
        {data.name.toLocaleLowerCase() === 'alcohol' ? (
          <div className={styles.wrapper_content_info_item}>
            <OverviewPointCell
              text={TextTimeseries.Alcohol}
              param={`${data.weight} ${data.unit}`}
              backgroud={BackgroupColor.Alcohol}
              color={Color.Alcohol}
            />
          </div>
        ) : null}
        {data.name.toLocaleLowerCase() === 'toluen' ? (
          <div className={styles.wrapper_content_info_item}>
            <OverviewPointCell
              text={TextTimeseries.Toluen}
              param={`${data.weight} ${data.unit}`}
              backgroud={BackgroupColor.Toluen}
              color={Color.Toluen}
            />
          </div>
        ) : null}
        {data.name.toLocaleLowerCase() === 'nh4' ? (
          <div className={styles.wrapper_content_info_item}>
            <OverviewPointCell
              text={TextTimeseries.NH4}
              param={`${data.weight} ${data.unit}`}
              backgroud={BackgroupColor.NH4}
              color={Color.NH4}
            />
          </div>
        ) : null}
        {data.name.toLocaleLowerCase() === 'aceton' ? (
          <div className={styles.wrapper_content_info_item}>
            <OverviewPointCell
              text={TextTimeseries.Aceton}
              param={`${data.weight} ${data.unit}`}
              backgroud={BackgroupColor.Aceton}
              color={Color.Aceton}
            />
          </div>
        ) : null}
        {data.name.toLocaleLowerCase() === 'tvoc' ? (
          <div className={styles.wrapper_content_info_item}>
            <OverviewPointCell
              text={TextTimeseries.TVOC}
              param={`${data.weight} ${data.unit}`}
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
      {data ? (
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
