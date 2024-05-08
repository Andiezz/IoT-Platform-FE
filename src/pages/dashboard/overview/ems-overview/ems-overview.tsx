import React, { useState, useEffect } from 'react';
import styles from './ems-overview.module.less';
import {
  Breadcrumb,
  Col,
  Empty,
  Row,
  Tabs,
  TabsProps,
  Typography,
} from 'antd';
import { useTranslation } from 'react-i18next';
import { i18nKey } from 'src/locales/i18n';
import OverviewItemWidget from 'src/components/overview/overview-item-widget/overview-item';
import { ReactComponent as IconLocation } from 'src/assets/icons/Location.svg';
import useStore from 'src/hooks/use-store';
import { OverviewStore } from 'src/store/overview/overview.store';
import { IOverviewFetch } from 'src/dto/overview.dto';
import moment from 'moment-timezone';
import { useNavigate, useParams } from 'react-router';
import { observer } from 'mobx-react-lite';
import { PAGE_ROUTE } from 'src/constants/route';
import {
  SearchField,
  TypeFilterDate
} from 'src/components/chart/line-bar-chart/line-bar-chart';
import { IHttpService } from 'src/services/http.service';
import Loader from 'src/components/loader';
import CurrentData from '../current-data/current-data';
import { IThingMap } from 'src/interfaces';
import { ITenantOverviewStore } from 'src/store/overview/tenant/tenant-overview';
import useViewport from 'src/hooks/use-viewport';
import LineChart from 'src/components/chart/line-chart/line-chart';

export interface DataType {
  key: React.Key;
  name: string;
  version: number;
  status: string;
}

interface IWrapperComponent {
  children?: React.ReactNode;
  isRenderNodata?: boolean;
}

const TenantOverview: React.FC = () => {
  const overviewStore: OverviewStore = useStore('overviewStore');
  const httpService: IHttpService = useStore('httpClient');
  const tenantStore: ITenantOverviewStore = useStore('tenantOverviewStore');
  const [thingLocation, setThingLocation] = useState<IThingMap[]>([]);
  const params = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const viewPort = useViewport();
  const arrayTimes: any = [];
  const [loadingChart, setLoadingChart] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchField, setSearchField] = useState<SearchField>({
    type: TypeFilterDate.day,
    from: moment().startOf('day').toISOString(),
    to: moment().endOf('day').toISOString()
  });
  const [dataTenant, setDataTenant] = useState<IOwnersItem>();

  if (overviewStore?.overviewThing?.timeseries_data) {
    Object.entries(overviewStore?.overviewThing.timeseries_data).forEach(
      (item) => {
        return item[1] ? arrayTimes.push(item) : null;
      }
    );
  }

  const handleSetSearchField = (searchField: SearchField) => {
    setSearchField({ ...searchField });
  };

  const getOverviewThing = async (request: IOverviewFetch) => {
    setLoadingChart(true);
    await overviewStore
      .fetchThing(request)
      .then(() => {
        setLoading(false);
        function isCherries(fruit: any) {
          return fruit.user_id === tenantStore.tenantOverview?._id;
        }
        const dataTenant =
          overviewStore.overviewThing?.thing.owners?.find(isCherries);
        setDataTenant(dataTenant);
      })
      .catch(() => {
        throw Error;
      });
    setLoadingChart(false);
  };

  useEffect(() => {
    getOverviewThing({
      thing_id: params.id,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      ...searchField
    });
  }, [searchField]);

  useEffect(() => {
    const dataMap: IThingMap[] = [
      {
        address: overviewStore.overviewThing?.thing?.address,
        thingName: overviewStore.overviewThing?.thing?.name,
        lng: overviewStore.overviewThing?.thing?.longitude || 0,
        lat: overviewStore.overviewThing?.thing?.latitude || 0
      }
    ];
    setThingLocation(dataMap);
  }, [overviewStore.overviewThing]);

  const renderDashboard = () => {
    return (
      <div className={styles.wrapper_content}>
        <Row gutter={24}>
          <Col span={24} className={styles.wrapper_content_info}>
            <OverviewItemWidget
              title={overviewStore.overviewThing?.thing?.name}
              info={overviewStore.overviewThing?.thing?._id}>
              <CurrentData
                data={overviewStore.overviewThing?.timeseries_data}
                arrayTimes={arrayTimes}
              />
            </OverviewItemWidget>
          </Col>
        </Row>
        <Row style={{ marginTop: 24 }} gutter={[24, 24]}>
          <Col sm={24} xs={24} md={24} lg={24} xl={24} xxl={16}>
            <Row gutter={[0, 24]}>
              <Col span={24}>
                <Row gutter={[24, 24]}>
                  <Col sm={24} xs={24} md={24} lg={24} xl={12} xxl={12}>
                    <div className={styles.wrapper_content_weather}>
                      <Row gutter={[0, 24]}>
                        <Col span={24}>
                          <div
                            className={styles.wrapper_content_weather_address}>
                            <IconLocation style={{ marginRight: 8 }} />
                            <p>{overviewStore.overviewThing?.thing?.address}</p>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </Col>
                </Row>
              </Col>
              <Col span={24}>
                <Row>
                  <Col span={24}>
                    <LineChart
                      loadingChart={loadingChart}
                      dataChartPercent={overviewStore.listChartPercent}
                      dataChartKwKwh={overviewStore.listChartThingKwKwh || []}
                      searchField={searchField}
                      onSetSearchField={handleSetSearchField}
                      dataChartAlarm={overviewStore.listChartAlarm || []}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
          <Col sm={24} xs={24} md={24} lg={24} xl={24} xxl={8}>
            <Row gutter={[0, 24]}>
              <Col className={styles.drives_map} span={24}>
                <Row gutter={[0, 16]}>
                  <Col span={24}>
                    <div className={styles.wrapper_content_driver}>
                      <Row gutter={[0, 24]}>
                        <Col
                          className={styles.wrapper_content_driver_title}
                          span={24}>
                          {t(i18nKey.dashboard.label.deviceList)}
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

  const items: TabsProps['items'] = (() => {
    const listItem: TabsProps['items'] = [
      {
        key: '1',
        label: 'Dashboard',
        children: renderDashboard()
      }
    ];
    return listItem;
  })();

  const onChangeTab = (item: any) => {
    setTabIndex(item);
  };

  const onClickTenant = () => {
    if (dataTenant) {
      return navigate(
        `${PAGE_ROUTE.DASHBOARD}overview/tenant/${dataTenant.user_id}`
      );
    } else if (
      !dataTenant &&
      overviewStore.overviewThing?.thing.owners?.length
    ) {
      return navigate(
        `${PAGE_ROUTE.DASHBOARD}overview/tenant/${overviewStore.overviewThing?.thing.owners[0].user_id}`
      );
    } else {
      return navigate(`${PAGE_ROUTE.DASHBOARD}overview/tenant/${undefined}`);
    }
  };

  const renderTenantText = () => {
    if (dataTenant) {
      return `${dataTenant.user?.first_name} ${dataTenant.user?.last_name}`;
    } else if (
      !dataTenant &&
      overviewStore.overviewThing?.thing.owners?.length
    ) {
      return `${overviewStore.overviewThing.thing.owners[0].user?.first_name} ${overviewStore.overviewThing.thing.owners[0].user?.last_name}`;
    } else {
      return 'Dashboard';
    }
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
                      {overviewStore?.overviewThing ? (
                        <Col span={24}>
                          <Breadcrumb
                            className={styles.wrapper_header_breadcrumb}
                            items={[
                              {
                                title: (
                                  <button onClick={onClickTenant}>
                                    {renderTenantText()}
                                  </button>
                                )
                              },
                              {
                                title: `${overviewStore.overviewThing?.thing?.name}`
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
                  <Col span={24}>
                    <Tabs
                      className={styles.wrapper_tab}
                      defaultActiveKey="1"
                      items={items}
                      onChange={(value) => onChangeTab(value)}
                    />
                  </Col>
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
