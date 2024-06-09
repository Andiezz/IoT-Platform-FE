import React, { useState, useEffect } from 'react';
import styles from './current-data.module.less';
import { Col, Empty, Row } from 'antd';
import OverviewPointWidget from 'src/components/overview/overview-point-widget/overview-point';
import { BackgroupColor, Color, TextTimeseries } from 'src/constants/thing';
import { useTranslation } from 'react-i18next';
import { i18nKey } from 'src/locales/i18n';
import { IParameterStandardModel } from 'src/dto/thing.dto';

export interface IProps {
  data?: IParameterStandardModel;
  arrayTimes: any[];
}

const CurrentData: React.FC<IProps> = ({ data, arrayTimes }) => {
  const { t } = useTranslation();
  const [more, setMore] = useState<boolean>(false);
  useEffect(() => {
    if (arrayTimes.length > 5) {
      setMore(true);
    }
  }, [arrayTimes]);

  const renderData = (data: IParameterStandardModel) => {
    return (
      <Row className={styles.wrapper_content_info__fullHeight} gutter={16}>
        {data.name.toLocaleLowerCase() === 'pm2.5' ? (
          <div className={styles.wrapper_content_info_item}>
            <OverviewPointWidget
              text={TextTimeseries.PM25}
              param={`${data.weight} ${data.unit}`}
              backgroud={BackgroupColor.PM25}
              color={Color.PM25}
            />
          </div>
        ) : null}
        {data.name.toLocaleLowerCase() === 'pm10' ? (
          <div className={styles.wrapper_content_info_item}>
            <OverviewPointWidget
              text={TextTimeseries.PM10}
              param={`${data.weight} ${data.unit}`}
              backgroud={BackgroupColor.PM10}
              color={Color.PM10}
            />
          </div>
        ) : null}
        {data.name.toLocaleLowerCase() === 'co2' ? (
          <div className={styles.wrapper_content_info_item}>
            <OverviewPointWidget
              text={TextTimeseries.CO2}
              param={`${data.weight} ${data.unit}`}
              backgroud={BackgroupColor.CO2}
              color={Color.CO2}
            />
          </div>
        ) : null}
        {data.name.toLocaleLowerCase() === 'temperature' ? (
          <div className={styles.wrapper_content_info_item}>
            <OverviewPointWidget
              text={TextTimeseries.Temp}
              param={`${data.weight} ${data.unit}`}
              backgroud={BackgroupColor.Temp}
              color={Color.Temp}
            />
          </div>
        ) : null}
        {data.name.toLocaleLowerCase() === 'humidity' ? (
          <div className={styles.wrapper_content_info_item}>
            <OverviewPointWidget
              text={TextTimeseries.Humi}
              param={`${data.weight} ${data.unit}`}
              backgroud={BackgroupColor.Humi}
              color={Color.Humi}
            />
          </div>
        ) : null}
        {data.name.toLocaleLowerCase() === 'lpg' ? (
          <div className={styles.wrapper_content_info_item}>
            <OverviewPointWidget
              text={TextTimeseries.LPG}
              param={`${data.weight} ${data.unit}`}
              backgroud={BackgroupColor.LPG}
              color={Color.LPG}
            />
          </div>
        ) : null}
        {data.name.toLocaleLowerCase() === 'ch4' ? (
          <div className={styles.wrapper_content_info_item}>
            <OverviewPointWidget
              text={TextTimeseries.CH4}
              param={`${data.weight} ${data.unit}`}
              backgroud={BackgroupColor.CH4}
              color={Color.CH4}
            />
          </div>
        ) : null}
        {data.name.toLocaleLowerCase() === 'co' ? (
          <div className={styles.wrapper_content_info_item}>
            <OverviewPointWidget
              text={TextTimeseries.CO}
              param={`${data.weight} ${data.unit}`}
              backgroud={BackgroupColor.CO}
              color={Color.CO}
            />
          </div>
        ) : null}
        {data.name.toLocaleLowerCase() === 'alcohol' ? (
          <div className={styles.wrapper_content_info_item}>
            <OverviewPointWidget
              text={TextTimeseries.Alcohol}
              param={`${data.weight} ${data.unit}`}
              backgroud={BackgroupColor.Alcohol}
              color={Color.Alcohol}
            />
          </div>
        ) : null}
        {data.name.toLocaleLowerCase() === 'toluen' ? (
          <div className={styles.wrapper_content_info_item}>
            <OverviewPointWidget
              text={TextTimeseries.Toluen}
              param={`${data.weight} ${data.unit}`}
              backgroud={BackgroupColor.Toluen}
              color={Color.Toluen}
            />
          </div>
        ) : null}
        {data.name.toLocaleLowerCase() === 'nh4' ? (
          <div className={styles.wrapper_content_info_item}>
            <OverviewPointWidget
              text={TextTimeseries.NH4}
              param={`${data.weight} ${data.unit}`}
              backgroud={BackgroupColor.NH4}
              color={Color.NH4}
            />
          </div>
        ) : null}
        {data.name.toLocaleLowerCase() === 'aceton' ? (
          <div className={styles.wrapper_content_info_item}>
            <OverviewPointWidget
              text={TextTimeseries.Aceton}
              param={`${data.weight} ${data.unit}`}
              backgroud={BackgroupColor.Aceton}
              color={Color.Aceton}
            />
          </div>
        ) : null}
        {data.name.toLocaleLowerCase() === 'tvoc' ? (
          <div className={styles.wrapper_content_info_item}>
            <OverviewPointWidget
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
      {data && arrayTimes.length > 1 ? (
        <div>
          <Row
            className={
              more
                ? styles.wrapper_content_info_halfHeight
                : styles.wrapper_content_info__fullHeight
            }
            style={{ width: '100%' }}
            gutter={16}>
            {renderData(data)}
          </Row>
          {arrayTimes.length > 5 && (
            <Row style={{ width: '100%' }}>
              <Col sm={24} xs={24} md={0} lg={0} xl={0} xxl={0}>
                {more ? (
                  <button
                    className={styles.wrapper_btn_more}
                    onClick={() => setMore(false)}>
                    {t(i18nKey.dashboard.button.showMore)}
                  </button>
                ) : (
                  <button
                    className={styles.wrapper_btn_more}
                    onClick={() => setMore(true)}>
                    {t(i18nKey.dashboard.button.showLess)}
                  </button>
                )}
              </Col>
            </Row>
          )}
        </div>
      ) : (
        <Row justify={'center'}>
          <Empty image={Empty.PRESENTED_IMAGE_DEFAULT} />
        </Row>
      )}
    </>
  );
};

export default CurrentData;
