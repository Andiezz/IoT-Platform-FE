/*eslint-disable*/
import {
  Button,
  Col,
  Divider,
  Empty,
  // Drawer,
  // Empty,
  Row,
  Select,
  Tag,
  // Space,
  // Tag,
  Typography
} from 'antd';
import 'chart.js/auto';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import AccessDeniedDashboard from 'src/components/access-denied/access-denied-dashboard';
import Loader from 'src/components/loader';
// import NoData from 'src/components/no-data/no-data';
// import { PAGE_ROUTE } from 'src/constants/route';
import { getStatus, Status } from 'src/constants/utils';
// import { normalizeFormatDate } from 'src/helpers/common.utils';
// import { uniqueKey } from 'src/helpers/string.utils';
import useStore from 'src/hooks/use-store';
import { IThingMap } from 'src/interfaces';
import { i18nKey } from 'src/locales/i18n';
// import { ITenantOverviewStore } from 'src/store/overview/tenant/tenant-overview';
import styles from './dashboard.module.less';
import DropDownWithSearch, {
  IDropDownThing
} from 'src/components/drop-down-with-search/drop-down-with-search';
import TenantCollapse from './thing-collapse/thing-collapse';
import ArrowDown from 'src/assets/icons/arrow-down.svg';
import useViewport from 'src/hooks/use-viewport';
import { IThingListStore, IThingStore } from 'src/store/thing.store';
import { IThingItem, IThingListRequest } from 'src/dto/thing.dto';
import { IUserStore } from 'src/store/user.store';
import { PAGE_ROUTE } from 'src/constants/route';

interface IStatistical {
  status?: string;
  count?: number;
}

interface IWrapperComponent {
  children?: React.ReactNode;
  isRenderNodata?: boolean;
}

const Dashboard: React.FC = () => {
  const params = useParams();
  const { t } = useTranslation();
  const viewPort = useViewport();
  const isMobile = viewPort.width < 768;
  const navigator = useNavigate();
  const [drawerAlarm, setDrawerAlarm] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [statisticalStatusThing, setStatisticalThingStatus] = useState<
    IStatistical[]
  >([]);
  const [thingLocation, setThingLocation] = useState<IThingMap[]>([]);
  const thingStore: IThingStore = useStore('thingStore');
  const thingListStore: IThingListStore = useStore('listThingStore');
  const userStore: IUserStore = useStore('userStore');
  const [dropDownThing, setDropDownThing] = useState<IDropDownThing[]>();
  const [isOpenCollapse, setIsOpenConllapse] = useState<boolean>(true);
  const [fullName, setFullName] = useState<string>();
  const [valueSelect, setValueSelect] = useState<string>();
  const [thingList, setThingList] = useState<IThingItem[]>([]);
  const [displaySelect, setDisplaySelect] = useState<boolean>(false);

  const fetchData = async (request?: IThingListRequest) => {
    try {
      await thingListStore.fetchList(request);
      setThingList(thingListStore.listThing);
    } catch (error) {
      throw Error;
    }
  };

  useEffect(() => {
    if (userStore.userInfo?.id) {
      fetchData({ userId: userStore.userInfo?.id });
    }
  }, [userStore.userInfo?.id]);

  // useEffect(() => {
  //   if (
  //     (!params.id || params.id === 'undefined') &&
  //     tenantListStore.listTenantAccount.length === tenantListStore.totalPages
  //   ) {
  //     navigator(
  //       `${PAGE_ROUTE.DASHBOARD}overview/tenant/${
  //         tenantListStore.currentTenantId ??
  //         tenantListStore?.listTenantAccount[0]?._id
  //       }`
  //     );
  //   }
  // }, [tenantListStore.listTenantAccount]);

  // useEffect(() => {
  //   if (params.id) {
  //     const isExistId = !!tenantListStore.listTenantAccount.find(
  //       (item) => item._id === params.id
  //     );
  //     isExistId && tenantListStore.setCurrentId(params.id);
  //   }
  // }, [params?.id]);

  // const handlePopupScroll = async (e: any) => {
  //   const isLoadMore =
  //     e.target.scrollTop + e.target.offsetHeight === e.target.scrollHeight;
  //   if (isLoadMore && tenantListFilter.length < tenantListStore.totalPages) {
  //     await fetchData({
  //       limit: 20,
  //       page: tenantListStore.pageNumber + 1
  //     });
  //   }
  // };

  const onClickItem = (id: string) => {
    navigator(`/dashboard/overview/${id}`);
  };

  // const renderSelect = () => {
  //   const checkAccount = tenantListStore.listTenantAccount.find(
  //     (item) => item._id === tenantStore.tenantOverview?._id
  //   );
  //   if (!checkAccount) {
  //     tenantListFilter.push(tenantStore.tenantOverview);
  //     setDisplaySelect(true);
  //   } else {
  //     setDisplaySelect(true);
  //   }
  // };

  const getThingOverview = async () => {
    try {
      // setLoading(true);
      // await tenantStore
      //   .getTenantOverview({ id: params.id ?? '' })
      //   .then((rs) => {
      //     setLoading(false);
      //     setValueSelect(tenantStore.tenantOverview?._id);
      //     const dropDownItemThing =
      //       tenantStore?.tenantOverview?.owners?.map((items) => {
      //         return { key: items.thing?._id, label: items.thing?.name };
      //       }) ?? [];
      //     const fullName = `${tenantStore.tenantOverview?.first_name} ${tenantStore.tenantOverview?.last_name}`;

      //     setFullName(fullName);
      //     setDropDownThing(dropDownItemThing as IDropDownThing[]);
      //     const dataMap: IThingMap[] = [];
      //     tenantStore.tenantOverview?.owners?.forEach((item) => {
      //       dataMap.push({
      //         thingName: item?.thing?.name,
      //         lng: item?.thing?.longitude || 0,
      //         lat: item?.thing?.latitude || 0
      //       });
      //     });
      //     setThingLocation(dataMap);
      const statusCounts: any = {};
      thingListStore.listThing.length &&
        thingListStore.listThing.forEach(function (item) {
          const status: string = item.status ?? '';
          if (status in statusCounts) {
            statusCounts[status]++;
          } else {
            statusCounts[status] = 1;
          }
        });

      const result = Object.keys(statusCounts).map(function (status) {
        return {
          status: status,
          count: statusCounts[status]
        };
      });
      setStatisticalThingStatus(result);
      // renderSelect();
      // });
    } catch (error) {
      throw Error;
    }
  };

  useEffect(() => {
    if (userStore.userInfo?.id) {
      getThingOverview();
    }
  }, [thingList]);

  const getDot = (status?: string) => {
    switch (status) {
      case Status.Active.toLowerCase():
        return { background: '#8CE6A4' };
      case Status.Inactive.toLowerCase():
        return { background: '#EBEBF0' };
      case Status.Idle.toLowerCase():
        return { background: '#59BDF0' };
      default:
        return { background: '#E1F45F' };
    }
  };

  // const handleChange = (values: string) => {
  //   tenantListStore.setCurrentId(values);
  //   navigator(`${PAGE_ROUTE.DASHBOARD}overview/tenant/${values}`);
  // };

  // const toggleDrawerAlarm = () => {
  //   setDrawerAlarm(!drawerAlarm);
  // };

  // const WrapperComponentNoData: React.FC<IWrapperComponent> = ({
  //   children,
  //   isRenderNodata
  // }: IWrapperComponent) => {
  //   return <>{isRenderNodata ? <NoData /> : children}</>;
  // };

  // const handleCollapse = () => {
  //   setIsOpenConllapse(!isOpenCollapse);
  // };

  // const redirectAlarm = () => {
  //   return navigator(`${PAGE_ROUTE.DASHBOARD_ALARM}`);
  // };

  const renderInfo = () => {
    return (
      <Row justify={'space-between'}>
        <Col xs={18} sm={18} md={20} lg={20} xl={20} xxl={20}>
          <Row className={styles.info} gutter={[16, 8]} align={'middle'}>
            <Col>
              <Typography className={styles.info_title}>
                {userStore.userInfo?.firstName} {userStore.userInfo?.lastName}
              </Typography>
            </Col>
            <Col className={styles.info_email}>
              <Row align={'middle'}>
                {!isMobile && (
                  <Col>
                    <Divider type="vertical"></Divider>
                  </Col>
                )}
                <Col>
                  Email: <span>{userStore.userInfo?.email}</span>
                </Col>
              </Row>
            </Col>
            <Col className={styles.info_list}>
              <DropDownWithSearch
                onClickItem={onClickItem}
                items={dropDownThing}>
                <Tag color="blue">
                  {t(i18nKey.label.devices)}: {''}
                  {thingListStore.listThing.length}
                </Tag>
              </DropDownWithSearch>
            </Col>
            {statisticalStatusThing.map((item: IStatistical, idx) => {
              return (
                <Col className={styles.info_status} key={idx}>
                  <Row gutter={8} align={'middle'}>
                    <Divider type="vertical" />
                    <Col
                      style={getDot(item.status)}
                      className={styles.info_status_dot}></Col>
                    <Col>{getStatus(item.status)}</Col>
                    <Col className={styles.info_status_count}>{item.count}</Col>
                  </Row>
                </Col>
              );
            })}
          </Row>
        </Col>
      </Row>
    );
  };

  // const getArrSort = (item: IAlarmItem['description']) => {
  //   return (
  //     item &&
  //     item.sort((a) => (a.alarm_type === Severity.Fault.toLowerCase() ? -1 : 1))
  //   );
  // };

  const heightMap = {
    height: isMobile ? '200px' : '407px',
    borderRadius: 8
  };

  return (
    <>
      <div className={styles.wrapper}>
        {loading ? (
          <Row
            justify="center"
            align="middle"
            style={{ width: '100%', height: '100%', minHeight: '100vh' }}>
            <Loader />
          </Row>
        ) : (
          <>
            <header className={styles.wrapper_header}>
              <Row gutter={[0, 16]}>
                {displaySelect && thingStore.thingDetail ? (
                  <Col sm={24} xs={24} md={0} lg={0} xl={0} xxl={0}>
                    <Select
                      value={valueSelect}
                      showSearch={true}
                      allowClear={true}
                      // onPopupScroll={handlePopupScroll}
                      filterOption={(inputValue, option: any) =>
                        option?.label &&
                        option?.label
                          .toLowerCase()
                          .includes(inputValue.toLowerCase().trim())
                      }
                      className={styles.wrapper_header_select}
                      // onChange={handleChange}
                      options={thingList.map((item) => ({
                        key: item._id,
                        value: item._id,
                        label: item?.name
                      }))}
                    />
                  </Col>
                ) : null}

                <Col span={24}>
                  <Row align={'middle'} justify={'space-between'}>
                    <Col>
                      <Typography.Title className={styles.wrapper_header_title}>
                        {t(i18nKey.dashboard.title.dashboard)}
                      </Typography.Title>
                    </Col>
                    {/* <Col>
                      <Row justify={'end'}>
                        {isMobile ? (
                          <Col>
                            <Button
                              onClick={() => setDrawerAlarm(true)}
                              className={styles.wrapper_btn_alarm}>
                              {t(i18nKey.dashboard.tenant.alarms)}{' '}
                              <span className={styles.count}>
                                {tenantStore.tenantOverview?.alarms?.length ||
                                  0}
                              </span>
                            </Button>
                          </Col>
                        ) : (
                          <Col>
                            {displaySelect && tenantStore.tenantOverview ? (
                              <Select
                                value={valueSelect}
                                style={{ width: 300 }}
                                onChange={handleChange}
                                onPopupScroll={handlePopupScroll}
                                showSearch={true}
                                filterOption={(inputValue, option: any) =>
                                  option?.label &&
                                  option?.label
                                    .toLowerCase()
                                    .includes(inputValue.toLowerCase().trim())
                                }
                                options={tenantListFilter.map((item) => ({
                                  key: item._id,
                                  value: item._id,
                                  label: item?.email
                                }))}></Select>
                            ) : null}
                          </Col>
                        )}
                      </Row>
                    </Col> */}
                  </Row>
                </Col>
              </Row>
            </header>
            {(thingStore.thingDetail === null ||
              thingStore.thingDetail === undefined) &&
            params.id === 'undefined' ? (
              <AccessDeniedDashboard />
            ) : (
              <>
                <Row className={styles.wrapper_content} gutter={[0, 24]}>
                  <Col span={24} className={styles.wrapper_content_info}>
                    {renderInfo()}
                  </Col>
                  <Col span={24}>
                    <Row gutter={[24, 24]}>
                      <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={16}>
                        <div className={styles.wrapper_content_thing}>
                          <Row gutter={[0, 24]} align={'middle'}>
                            <Col span={24}>
                              <Typography.Title
                                className={styles.wrapper_content_thing_title}>
                                {t(i18nKey.dashboard.label.deviceList)}
                              </Typography.Title>
                            </Col>
                            <Col span={24}>
                              <Row
                                className={styles.wrapper_content_thing_content}
                                gutter={[0, 24]}>
                                {thingListStore.listThing?.length ? (
                                  thingListStore.listThing?.map((item, idx) => {
                                    return (
                                      <Col
                                        className={
                                          styles.wrapper_content_thing_item
                                        }
                                        span={24}
                                        key={idx}>
                                        <TenantCollapse
                                          onClickItem={onClickItem}
                                          data={item}
                                        />
                                      </Col>
                                    );
                                  })
                                ) : (
                                  <Col span={24}>
                                    <Empty
                                      image={Empty.PRESENTED_IMAGE_DEFAULT}
                                    />
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
              </>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default observer(Dashboard);
