import React, { useState, useEffect } from 'react';
import styles from './current-data.module.less';
import { Col, Empty, Row } from 'antd';
import OverviewPointWidget from 'src/components/overview/overview-point-widget/overview-point';
import { useTranslation } from 'react-i18next';
import { i18nKey } from 'src/locales/i18n';
import { BackgroupColor, Color, TextTimeseries } from 'src/constants/thing';
import { IOverviewDaily } from 'src/interfaces/overview';

export interface IProps {
  data?: IOverviewDaily;
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

  const renderTimeseries = (data: IOverviewDaily) => {
    return (
      <>
        {data['co'] !== 0 && (
          <OverviewPointWidget
            text={TextTimeseries.CO}
            param={`${data['co']?.toFixed(2)}`}
            backgroud={BackgroupColor.CO}
            color={Color.CO}
          />
        )}
        {data['toluen'] !== 0 && (
          <OverviewPointWidget
            text={TextTimeseries.Toluen}
            param={`${data['toluen']?.toFixed(2)}`}
            backgroud={BackgroupColor.Toluen}
            color={Color.Toluen}
          />
        )}
        {data['alcohol'] !== 0 && (
          <OverviewPointWidget
            text={TextTimeseries.Alcohol}
            param={`${data['alcohol']?.toFixed(2)}`}
            backgroud={BackgroupColor.Alcohol}
            color={Color.Alcohol}
          />
        )}
        {data['ch4'] !== 0 && (
          <OverviewPointWidget
            text={TextTimeseries.CH4}
            param={`${data['ch4']?.toFixed(2)}`}
            backgroud={BackgroupColor.CH4}
            color={Color.CH4}
          />
        )}
        {data['aceton'] !== 0 && (
          <OverviewPointWidget
            text={TextTimeseries.Aceton}
            param={`${data['aceton']?.toFixed(2)}`}
            backgroud={BackgroupColor.Aceton}
            color={Color.Aceton}
          />
        )}
        {data['co2'] !== 0 && (
          <OverviewPointWidget
            text={TextTimeseries.CO2}
            param={`${data['co2']?.toFixed(2)}`}
            backgroud={BackgroupColor.CO2}
            color={Color.CO2}
          />
        )}
        {data['humidity'] !== 0 && (
          <OverviewPointWidget
            text={TextTimeseries.Humi}
            param={`${data['humidity']?.toFixed(2)}`}
            backgroud={BackgroupColor.Humi}
            color={Color.Humi}
          />
        )}
        {data['lpg'] !== 0 && (
          <OverviewPointWidget
            text={TextTimeseries.LPG}
            param={`${data['lpg']?.toFixed(2)}`}
            backgroud={BackgroupColor.LPG}
            color={Color.LPG}
          />
        )}
        {data['temperature'] !== 0 && (
          <OverviewPointWidget
            text={TextTimeseries.Temp}
            param={`${data['temperature']?.toFixed(2)}`}
            backgroud={BackgroupColor.Temp}
            color={Color.Temp}
          />
        )}
        {data['nh4'] !== 0 && (
          <OverviewPointWidget
            text={TextTimeseries.NH4}
            param={`${data['nh4']?.toFixed(2)}`}
            backgroud={BackgroupColor.NH4}
            color={Color.NH4}
          />
        )}
        {data['tvoc'] !== 0 && (
          <OverviewPointWidget
            text={TextTimeseries.TVOC}
            param={`${data['tvoc']?.toFixed(2)}`}
            backgroud={BackgroupColor.TVOC}
            color={Color.TVOC}
          />
        )}
        {data['pm25'] !== 0 && (
          <OverviewPointWidget
            text={TextTimeseries.PM25}
            param={`${data['pm25']?.toFixed(2)}`}
            backgroud={BackgroupColor.PM25}
            color={Color.PM25}
          />
        )}
        {data['pm10'] !== 0 && (
          <OverviewPointWidget
            text={TextTimeseries.PM10}
            param={`${data['pm10']?.toFixed(2)}`}
            backgroud={BackgroupColor.PM10}
            color={Color.PM10}
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
            {renderTimeseries(data)}
          </Row>
          {arrayTimes.length > 5 && (
            <Row style={{ width: '100%' }}>
              <Col sm={24} xs={24} md={0} lg={0} xl={0} xxl={0}>
                {more ? (
                  <div
                    className={styles.wrapper_btn_more}
                    onClick={() => setMore(false)}>
                    {t(i18nKey.dashboard.button.showMore)}
                  </div>
                ) : (
                  <div
                    className={styles.wrapper_btn_more}
                    onClick={() => setMore(true)}>
                    {t(i18nKey.dashboard.button.showLess)}
                  </div>
                )}
              </Col>
            </Row>
          )}
        </div>
      ) : (
        <Row justify="center" align={'middle'}>
          <Empty image={Empty.PRESENTED_IMAGE_DEFAULT} />
        </Row>
      )}
    </>
  );
};

export default CurrentData;
