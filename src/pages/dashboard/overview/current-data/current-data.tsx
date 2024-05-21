import React, { useState, useEffect } from 'react';
import styles from './current-data.module.less';
import { Col, Empty, Row } from 'antd';
import OverviewPointWidget from 'src/components/overview/overview-point-widget/overview-point';
import { BackgroupColor, Color, TextTimeseries } from 'src/constants/thing';
import { IChart, ITimeseriesData } from 'src/interfaces/overview';
import { useTranslation } from 'react-i18next';
import { i18nKey } from 'src/locales/i18n';

export interface IProps {
  data?: IChart;
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

  const renderTimeseriesThing = (data: IChart) => {
    return (
      <>
        {data['pm2.5'] !== 0 && (
          <OverviewPointWidget
            text={TextTimeseries.PM25}
            param={`${data['pm2.5']}`}
            backgroud={BackgroupColor.PM25}
            color={Color.PM25}
          />
        )}
        {data['pm10'] !== 0 && (
          <OverviewPointWidget
            text={TextTimeseries.PM10}
            param={`${data['pm10']}`}
            backgroud={BackgroupColor.PM10}
            color={Color.PM10}
          />
        )}
        {data['co2'] !== 0 && (
          <OverviewPointWidget
            text={TextTimeseries.CO2}
            param={`${data['co2']}`}
            backgroud={BackgroupColor.CO2}
            color={Color.CO2}
          />
        )}
        {data['temperature'] !== 0 && (
          <OverviewPointWidget
            text={TextTimeseries.Temp}
            param={`${data['temperature']}`}
            backgroud={BackgroupColor.Temp}
            color={Color.Temp}
          />
        )}
        {data['humidity'] !== 0 && (
          <OverviewPointWidget
            text={TextTimeseries.Humi}
            param={`${data['humidity']}`}
            backgroud={BackgroupColor.Humi}
            color={Color.Humi}
          />
        )}
        {data['lpg'] !== 0 && (
          <OverviewPointWidget
            text={TextTimeseries.LPG}
            param={`${data['lpg']}`}
            backgroud={BackgroupColor.LPG}
            color={Color.LPG}
          />
        )}
        {data['ch4'] !== 0 && (
          <OverviewPointWidget
            text={TextTimeseries.CH4}
            param={`${data['ch4']}`}
            backgroud={BackgroupColor.CH4}
            color={Color.CH4}
          />
        )}
        {data['co'] !== 0 && (
          <OverviewPointWidget
            text={TextTimeseries.CO}
            param={`${data['co']}`}
            backgroud={BackgroupColor.CO}
            color={Color.CO}
          />
        )}
        {data['alcohol'] !== 0 && (
          <OverviewPointWidget
            text={TextTimeseries.Alcohol}
            param={`${data['alcohol']}`}
            backgroud={BackgroupColor.Alcohol}
            color={Color.Alcohol}
          />
        )}
        {data['toluen'] !== 0 && (
          <OverviewPointWidget
            text={TextTimeseries.Toluen}
            param={`${data['toluen']}`}
            backgroud={BackgroupColor.Toluen}
            color={Color.Toluen}
          />
        )}
        {data['nh4'] !== 0 && (
          <OverviewPointWidget
            text={TextTimeseries.NH4}
            param={`${data['nh4']}`}
            backgroud={BackgroupColor.NH4}
            color={Color.NH4}
          />
        )}
        {data['aceton'] !== 0 && (
          <OverviewPointWidget
            text={TextTimeseries.Aceton}
            param={`${data['aceton']}`}
            backgroud={BackgroupColor.Aceton}
            color={Color.Aceton}
          />
        )}
        {data['tvoc'] !== 0 && (
          <OverviewPointWidget
            text={TextTimeseries.TVOC}
            param={`${data['tvoc']}`}
            backgroud={BackgroupColor.TVOC}
            color={Color.TVOC}
          />
        )}
      </>
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
            {renderTimeseriesThing(data)}
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
