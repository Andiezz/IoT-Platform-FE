import React, { useEffect, useState } from 'react';
import styles from './ems-overview.module.less';
import { Breadcrumb, Col, Empty, Row, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { i18nKey } from 'src/locales/i18n';
import OverviewItemWidget from 'src/components/overview/overview-item-widget/overview-item';
// import { ReactComponent as IconLocation } from 'src/assets/icons/Location.svg';
import useStore from 'src/hooks/use-store';
// import { OverviewStore } from 'src/store/overview/overview.store';
// import { IOverviewFetch } from 'src/dto/overview.dto';
import moment from 'moment-timezone';
import { useNavigate } from 'react-router';
import { observer } from 'mobx-react-lite';
import { PAGE_ROUTE } from 'src/constants/route';
import {
  SearchField,
  TypeFilterDate
} from 'src/components/line-bar-chart/line-bar-chart';
import Loader from 'src/components/loader';
// import CurrentData from '../current-data/current-data';
import { useParams } from 'react-router-dom';
import { IThingListStore } from 'src/store/thing.store';
import { IThingItem } from 'src/dto/thing.dto';
import CurrentData from '../current-data/current-data';
import { IOverviewStore } from 'src/store/overview/overview.store';
import { IOverviewFetch } from 'src/dto/overview.dto';
import LineChart from 'src/components/line-chart/line-chart';
import {
  IChartParam,
  IOverviewDaily,
  IThingWarning
} from 'src/interfaces/overview';
import DoughnutChart from 'src/components/doughnut-chart/doughnut-chart';
import { GaugeChart } from 'src/components/gauge-chart/gauge-chart';
// import LineChart from 'src/components/chart/line-chart/line-chart';
// import { IOverviewThing } from 'src/interfaces/overview';

export interface DataType {
  key: React.Key;
  name: string;
  version: number;
  status: string;
}

// interface IWrapperComponent {
//   children?: React.ReactNode;
//   isRenderNodata?: boolean;
// }

const TenantOverview: React.FC = () => {
  const thingListStore: IThingListStore = useStore('listThingStore');
  const overviewStore: IOverviewStore = useStore('overviewStore');
  const params = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const arrayTimes: any = [];
  const [loadingChart, setLoadingChart] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchField, setSearchField] = useState<SearchField>({
    type: TypeFilterDate.day,
    from: moment().startOf('day').toISOString(),
    to: moment().endOf('day').toISOString()
  });
  const [dataThing, setDataThing] = useState<IThingItem>();
  const [dataDaily, setDataDaily] = useState<IOverviewDaily[] | undefined>();

  const result = overviewStore.overviewThing?.thingWarning;
  // console.log('🚀 ~ overviewStore.overviewThing:', overviewStore.overviewThing)

  if (overviewStore?.overviewThing?.timeseriesData) {
    Object.entries(overviewStore?.overviewThing.timeseriesData).forEach(
      (item) => {
        return item[1] ? arrayTimes.push(item) : null;
      }
    );
  }

  const handleSetSearchField = (searchField: SearchField) => {
    setSearchField({ ...searchField });
  };

  const getOverviewThing = async (id: string) => {
    setLoadingChart(true);
    await thingListStore
      .getDetailThing({ id })
      .then((rs) => {
        setLoading(false);
        setDataThing(rs.data);
      })
      .catch(() => {
        throw Error;
      });
    setLoadingChart(false);
  };

  const getOverview = async (
    param: { id: string },
    request: IOverviewFetch | undefined
  ) => {
    setLoadingChart(true);
    await overviewStore.fetchThing(param, request).catch(() => {
      throw Error;
    });
    setLoadingChart(false);
  };

  const getOverviewDaily = async (param: { id: string }) => {
    setLoadingChart(true);
    const res = await overviewStore.getDaily(param).catch(() => {
      throw Error;
    });
    setDataDaily(res.data);
    setLoadingChart(false);
  };

  useEffect(() => {
    if (params?.id) {
      getOverviewThing(params.id);
    }
  }, [params]);

  useEffect(() => {
    if (params?.id) {
      getOverviewDaily({ id: params.id });
      getOverview(
        { id: params.id },
        {
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          ...searchField
        }
      );
    }
  }, [searchField]);

  const renderDashboard = () => {
    return (
      <div className={styles.wrapper_content}>
        <Row gutter={24}>
          <Col span={24} className={styles.wrapper_content_info}>
            <OverviewItemWidget title={dataThing?.name} info={dataThing?._id}>
              <CurrentData
                data={dataDaily && dataDaily[0]}
                arrayTimes={Object.values(
                  dataDaily && dataDaily[0]
                    ? dataDaily[0]
                    : ({} as IOverviewDaily)
                ).filter((value) => value !== null && value !== undefined)}
              />
            </OverviewItemWidget>
          </Col>
        </Row>
        <Row style={{ marginTop: 24 }} gutter={[24, 24]}>
          <Col sm={24} xs={24} md={24} lg={24} xl={16} xxl={16}>
            <Row className={styles.wrapper_content_alarms} gutter={[24, 24]}>
              <Col sm={24} xs={24} md={24} lg={24} xl={24} xxl={24}>
                <LineChart
                  loadingChart={loadingChart}
                  dataChart={
                    overviewStore.overviewThing?.timeseriesData as IChartParam[]
                  }
                  searchField={searchField}
                  onSetSearchField={handleSetSearchField}
                />
              </Col>
            </Row>
            <Row
              style={{ marginTop: 20 }}
              className={styles.wrapper_content_alarms}
              gutter={[24, 24]}>
              <Col sm={24} xs={24} md={24} lg={24} xl={12} xxl={12}>
                <div className={styles.wrapper_content_alarms}>
                  <DoughnutChart
                    title={`${t(i18nKey.dashboard.label.thingWarning)}`}
                    tooltip="Group by Alarm Description"
                    datas={result}
                  />
                </div>
              </Col>
              <Col sm={24} xs={24} md={24} lg={24} xl={12} xxl={12}>
                <div className={styles.wrapper_content_alarms}>
                  <GaugeChart
                    title={`${t(i18nKey.dashboard.label.airQualityReport)}`}
                    qualityReport={overviewStore.overviewThing?.qualityReport}
                  />
                </div>
              </Col>
            </Row>
          </Col>
          <Col sm={24} xs={24} md={24} lg={24} xl={8} xxl={8}>
            <Row gutter={[0, 24]}>
              <Col className={styles.drives_map} span={24}>
                <Row gutter={[0, 16]}>
                  <Col span={24}>
                    <div className={styles.wrapper_content_driver}>
                      <Row gutter={[0, 24]}>
                        <Col
                          className={styles.wrapper_content_driver_title}
                          span={24}>
                          {t(i18nKey.dashboard.label.thingList)}
                        </Col>
                        <Col span={24}>
                          <Row
                            className={styles.wrapper_content_driver_list}
                            gutter={[0, 16]}>
                            {overviewStore.overviewThing?.thingDetail.devices
                              .length ? (
                              overviewStore.overviewThing?.thingDetail.devices.map(
                                (item, key) => (
                                  <Col
                                    key={key}
                                    className={
                                      styles.wrapper_content_driver_item
                                    }
                                    onClick={() => {
                                      navigate(`${PAGE_ROUTE.DEVICE_MODEL}`);
                                    }}
                                    span={24}>
                                    <Row
                                      gutter={[4, 4]}
                                      justify={'space-between'}
                                      align={'middle'}>
                                      <Col>
                                        <Row className={styles.name}>
                                          {item.name}
                                        </Row>
                                        <Row
                                          className={styles.driverID}
                                          align={'middle'}>
                                          <span>
                                            {t(
                                              i18nKey.dashboard.label
                                                .deviceListId
                                            )}
                                          </span>
                                          {item._id}
                                        </Row>
                                      </Col>
                                    </Row>
                                  </Col>
                                )
                              )
                            ) : (
                              <Col span={24}>
                                <Empty image={Empty.PRESENTED_IMAGE_DEFAULT} />
                              </Col>
                            )}
                          </Row>
                        </Col>
                      </Row>
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    );
  };

  const onClickTenant = () => {
    return navigate(`${PAGE_ROUTE.DASHBOARD}`);
  };

  return (
    <>
      {loading ? (
        <Row
          justify="center"
          align="middle"
          style={{ width: '100%', height: '100%', minHeight: '100vh' }}>
          <Loader />
        </Row>
      ) : (
        <div className={styles.wrapper}>
          <div className={styles.wrapper_header}>
            <Row gutter={[0, 16]}>
              <Col span={24} className={styles.wrapper_header_info}>
                <Row justify={'space-between'} align={'middle'}>
                  <Col>
                    <Row gutter={[0, 8]}>
                      <Col span={24}>
                        <Typography.Title
                          level={2}
                          className={styles.wrapper_header_title}>
                          {t(i18nKey.dashboard.title.thingOverview)}
                        </Typography.Title>
                      </Col>
                      {dataThing ? (
                        <Col span={24}>
                          <Breadcrumb
                            className={styles.wrapper_header_breadcrumb}
                            items={[
                              {
                                title: (
                                  <button
                                    style={{
                                      cursor: 'pointer',
                                      border: 0,
                                      backgroundColor: 'transparent'
                                    }}
                                    onClick={onClickTenant}>
                                    {t(i18nKey.dashboard.title.dashboard)}
                                  </button>
                                )
                              },
                              {
                                title: `${dataThing.name}`
                              }
                            ]}
                          />
                        </Col>
                      ) : (
                        <Col span={24}>
                          <Empty image={Empty.PRESENTED_IMAGE_DEFAULT} />
                        </Col>
                      )}
                    </Row>
                  </Col>
                </Row>
              </Col>
              <Col span={24}>
                <Row justify={'space-between'}>
                  <Col span={24}>{renderDashboard()}</Col>
                </Row>
              </Col>
            </Row>
          </div>
        </div>
      )}
    </>
  );
};

export default observer(TenantOverview);
