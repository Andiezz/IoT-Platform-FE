import { Col, Divider, Row, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import styles from './thing-collapse.module.less';
import WidgetCollapse from './widget-collapse/widget-collapse';
import ArrowDown from 'src/assets/icons/arrow-down.svg';
// import { IThing } from 'src/interfaces/thing';
import { STATUS } from 'src/constants/status';
import { IThingItem } from 'src/dto/thing.dto';
import useStore from 'src/hooks/use-store';
import { IOverviewDaily } from 'src/interfaces/overview';
import { IOverviewStore } from 'src/store/overview/overview.store';
import CurrentData from '../overview/current-data/current-data';

export interface IThingCollapse {
  data?: IThingItem;
  onClickItem?: (value: string) => void;
}

const ThingCollapse: React.FC<IThingCollapse> = ({ data, onClickItem }) => {
  const [isOpenCollapse, setIsOpenCollapse] = useState<boolean>(true);
  const overviewStore: IOverviewStore = useStore('overviewStore');
  const [dataDaily, setDataDaily] = useState<IOverviewDaily[] | undefined>();

  const getOverviewDaily = async (param: { id: string }) => {
    const res = await overviewStore.getDaily(param).catch(() => {
      throw Error;
    });
    setDataDaily(res.data);
  };

  const handleCollapse = () => {
    setIsOpenCollapse(!isOpenCollapse);
  };

  const getDot = (status?: string) => {
    switch (status) {
      case STATUS.ACTIVE.toLowerCase():
        return { background: '#8CE6A4' };
      case STATUS.INACTIVE.toLowerCase():
        return { background: '#EBEBF0' };
      default:
        return { background: '#E1F45F' };
    }
  };

  useEffect(() => {
    if (data?._id) {
      getOverviewDaily({ id: data._id });
    }
  }, [data]);

  return (
    <Row gutter={[0, 12]} className={styles.wrapper}>
      <Col span={24} className={styles.wrapper_header}>
        <button
          style={{
            cursor: 'pointer',
            border: 0,
            backgroundColor: 'transparent'
          }}
          className={styles.wrapper_header_left}
          onClick={() => onClickItem && onClickItem(data?._id ?? '')}>
          <Row align={'middle'} justify={'space-between'} gutter={[16, 8]}>
            <Col>
              <Row align={'middle'} className={styles.wrapper_header_left_info}>
                <Col>
                  <Typography className={styles.wrapper_header_left_name}>
                    {data?.name}
                  </Typography>
                </Col>
                <Divider type="vertical"></Divider>
                <Col>ID: {data?._id}</Col>
              </Row>
            </Col>
          </Row>
        </button>
        <button
          className={styles.wrapper_header_right}
          onClick={handleCollapse}
          style={{
            cursor: 'pointer',
            border: 0,
            backgroundColor: 'transparent'
          }}>
          <Row gutter={8} justify={'end'} align={'middle'}>
            <Divider type="vertical" />
            <Col
              style={getDot(data?.status)}
              className={styles.wrapper_status_dot}></Col>
            <Col className={styles.wrapper_btn}>
              <img
                alt=""
                style={{
                  transition: 'all .2s ease',
                  transform: isOpenCollapse ? 'rotate(180deg)' : ''
                }}
                className={styles.wrapper_btn_collapse}
                src={ArrowDown}
              />
            </Col>
          </Row>
        </button>
      </Col>
      <Col
        onClick={() => onClickItem && onClickItem(data?._id ?? '')}
        style={{ cursor: 'pointer' }}
        className={
          isOpenCollapse ? styles.displayCollapse : styles.hideCollapse
        }
        span={24}>
        <Row gutter={[0, 12]}>
          <Col span={24}>
            <Divider
              className={styles.wrapper_divider}
              type="horizontal"></Divider>
          </Col>
          <Col span={24}>
            <Row gutter={[0, 12]}>
              <CurrentData
                data={dataDaily && dataDaily[0]}
                arrayTimes={Object.values(
                  dataDaily && dataDaily[0]
                    ? dataDaily[0]
                    : ({} as IOverviewDaily)
                ).filter((value) => value !== null && value !== undefined)}
              />
            </Row>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default ThingCollapse;
