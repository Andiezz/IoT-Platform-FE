/*eslint-disable*/
import { SearchOutlined } from '@ant-design/icons';
import {
  Button,
  Col,
  Divider,
  Drawer,
  Empty,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Tag,
  Typography
} from 'antd';
import 'chart.js/auto';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import AccessDeniedDashboard from 'src/components/access-denied/access-denied-dashboard';
import Loader from 'src/components/loader';
import GoogleMap from 'src/components/map/map';
import NoData from 'src/components/no-data/no-data';
import { PAGE_ROUTE } from 'src/constants/route';
import {
  Severity,
  Status,
  getStatus,
  tagColorSeverity
} from 'src/constants/utils';
import { ITenantItem, ITenantListRequest } from 'src/dto/tenant-list.dto';
import { normalizeFormatDate } from 'src/helpers/common.utils';
import { uniqueKey } from 'src/helpers/string.utils';
import useStore from 'src/hooks/use-store';
import { IThingMap } from 'src/interfaces';
import { i18nKey } from 'src/locales/i18n';
import { ITenantOverviewStore } from 'src/store/overview/tenant/tenant-overview';
import { ITenantListStore } from 'src/store/tenant/tenant-list.store';
import styles from './dashboard.module.less';
import DropDownWithSearch, {
  IDropDownThing
} from 'src/components/drop-down-with-search/drop-down-with-search';
import { IAlarmItem } from 'src/dto/alarm.dto';
import TenantCollapse from './thing-collapse/thing-collapse';
import ArrowDown from 'src/assets/icons/arrow-down.svg';
import useViewport from 'src/hooks/use-viewport';
import TenantAlarm from './tenant-alarm/tenant-alarm';

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
  const [loading, setLoading] = useState<boolean>(true);
  const [statisticalStatusThing, setStatisticalThingStatus] = useState<
    IStatistical[]
  >([]);
  const [thingLocation, setThingLocation] = useState<IThingMap[]>([]);
  const tenantStore: ITenantOverviewStore = useStore('tenantOverviewStore');
  const tenantListStore: ITenantListStore = useStore('listTenantStore');
  const [dropDownThing, setDropDownThing] = useState<IDropDownThing[]>();
  const [isOpenCollapse, setIsOpenConllapse] = useState<boolean>(true);
  const [fullName, setFullName] = useState<string>();
  const [valueSelect, setValueSelect] = useState<string>();
  const [tenantListFilter, setTenantListFilter] = useState<any[]>([]);
  const [displaySelect, setDisplaySelect] = useState<boolean>(false);

  const fetchData = async (request?: ITenantListRequest) => {
    try {
      await tenantListStore.fetchListNoPermission(request).then((rs) => {
        const listAccountConcat: ITenantItem[] = tenantListFilter.concat(
          tenantListStore.listTenantAccount
        );
        const idsAccount = listAccountConcat.map(({ _id }) => _id);
        const filTenantAccount = listAccountConcat.filter(
          ({ _id }, index) => !idsAccount.includes(_id, index + 1)
        );
        setTenantListFilter(filTenantAccount);
      });
    } catch (error) {
      throw Error;
    }
  };

  useEffect(() => {
    fetchData({ limit: 20, page: 1 });
  }, []);

  useEffect(() => {
    if (
      (!params.id || params.id === 'undefined') &&
      tenantListStore.listTenantAccount.length === tenantListStore.totalPages
    ) {
      navigator(
        `${PAGE_ROUTE.DASHBOARD}overview/tenant/${
          tenantListStore.currentTenantId ??
          tenantListStore?.listTenantAccount[0]?._id
        }`
      );
    }
  }, [tenantListStore.listTenantAccount]);

  useEffect(() => {
    if (params.id) {
      const isExistId = !!tenantListStore.listTenantAccount.find(
        (item) => item._id === params.id
      );
      isExistId && tenantListStore.setCurrentId(params.id);
    }
  }, [params?.id]);

  const handlePopupScroll = async (e: any) => {
    const isLoadMore =
      e.target.scrollTop + e.target.offsetHeight === e.target.scrollHeight;
    if (isLoadMore && tenantListFilter.length < tenantListStore.totalPages) {
      await fetchData({
        limit: 20,
        page: tenantListStore.pageNumber + 1
      });
    }
  };

  const onClickItem = (id: string) => {
    navigator(PAGE_ROUTE.DASHBOARD_OVERVIEW_PLANT.replace(':id', id ?? ''));
  };

  const renderSelect = () => {
    const checkAccount = tenantListStore.listTenantAccount.find(
      (item) => item._id === tenantStore.tenantOverview?._id
    );
    if (!checkAccount) {
      tenantListFilter.push(tenantStore.tenantOverview);
      setDisplaySelect(true);
    } else {
      setDisplaySelect(true);
    }
  };

  const getTenantOverview = async () => {
    try {
      setLoading(true);
      await tenantStore
        .getTenantOverview({ id: params.id ?? '' })
        .then((rs) => {
          setLoading(false);
          setValueSelect(tenantStore.tenantOverview?._id);
          const dropDownItemThing =
            tenantStore?.tenantOverview?.owners?.map((items) => {
              return { key: items.thing?._id, label: items.thing?.name };
            }) ?? [];
          const fullName = `${tenantStore.tenantOverview?.first_name} ${tenantStore.tenantOverview?.last_name}`;

          setFullName(fullName);
          setDropDownThing(dropDownItemThing as IDropDownThing[]);
          const dataMap: IThingMap[] = [];
          tenantStore.tenantOverview?.owners?.forEach((item) => {
            dataMap.push({
              thingName: item?.thing?.name,
              lng: item?.thing?.longitude || 0,
              lat: item?.thing?.latitude || 0
            });
          });
          setThingLocation(dataMap);
          const statusCounts: any = {};
          tenantStore.tenantOverview?.owners?.length &&
            tenantStore.tenantOverview?.owners.forEach(function (owner) {
              const status: string = owner.thing?.status ?? '';
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
          renderSelect();
        });
    } catch (error) {
      throw Error;
    }
  };

  useEffect(() => {
    if (params.id) {
      getTenantOverview();
    }
  }, [params.id]);

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

  const handleChange = (values: string) => {
    tenantListStore.setCurrentId(values);
    navigator(`${PAGE_ROUTE.DASHBOARD}overview/tenant/${values}`);
  };

  const toggleDrawerAlarm = () => {
    setDrawerAlarm(!drawerAlarm);
  };

  const WrapperComponentNoData: React.FC<IWrapperComponent> = ({
    children,
    isRenderNodata
  }: IWrapperComponent) => {
    return <>{isRenderNodata ? <NoData /> : children}</>;
  };

  const handleCollapse = () => {
    setIsOpenConllapse(!isOpenCollapse);
  };

  const redirectAlarm = () => {
    return navigator(`${PAGE_ROUTE.DASHBOARD_ALARM}`);
  };

  const renderInfo = () => {
    return (
      <Row justify={'space-between'}>
        <Col xs={18} sm={18} md={20} lg={20} xl={20} xxl={20}>
          <Row className={styles.info} gutter={[16, 8]} align={'middle'}>
            <Col>
              <Typography className={styles.info_title}>{fullName}</Typography>
            </Col>
            <Col className={styles.info_email}>
              <Row align={'middle'}>
                {!isMobile && (
                  <Col>
                    <Divider type="vertical"></Divider>
                  </Col>
                )}
                <Col>
                  Email: <span>{tenantStore.tenantOverview?.email}</span>
                </Col>
              </Row>
            </Col>
            <Col className={styles.info_list}>
              <DropDownWithSearch
                onClickItem={onClickItem}
                items={dropDownThing}>
                <Tag color="blue">
                  {t(i18nKey.label.things)}: {''}
                  {tenantStore?.tenantOverview?.owners?.length}
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
        <Col xs={6} sm={6} md={4} lg={4} xl={4} xxl={4}>
          <Row justify={'end'}>
            <Button
              onClick={handleCollapse}
              className={styles.wrapper_btn_collapse}>
              Map
              <img
                style={{
                  transition: 'all .2s ease',
                  transform: isOpenCollapse ? 'rotate(180deg)' : ''
                }}
                src={ArrowDown}
              />
            </Button>
          </Row>
        </Col>
      </Row>
    );
  };

  const getArrSort = (item: IAlarmItem['description']) => {
    return (
      item &&
      item.sort((a) => (a.alarm_type === Severity.Fault.toLowerCase() ? -1 : 1))
    );
  };

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
                {displaySelect && tenantStore.tenantOverview ? (
                  <Col sm={24} xs={24} md={0} lg={0} xl={0} xxl={0}>
                    <Select
                      value={valueSelect}
                      showSearch={true}
                      allowClear={true}
                      onPopupScroll={handlePopupScroll}
                      filterOption={(inputValue, option: any) =>
                        option?.label &&
                        option?.label
                          .toLowerCase()
                          .includes(inputValue.toLowerCase().trim())
                      }
                      className={styles.wrapper_header_select}
                      onChange={handleChange}
                      options={tenantListFilter.map((item) => ({
                        key: item._id,
                        value: item._id,
                        label: item?.email
                      }))}
                    />
                  </Col>
                ) : null}

                <Col span={24}>
                  <Row align={'middle'} justify={'space-between'}>
                    <Col>
                      <Typography.Title className={styles.wrapper_header_title}>
                        {t(i18nKey.dashboard.title.tenantOverview)}
                      </Typography.Title>
                    </Col>
                    <Col>
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
                    </Col>
                  </Row>
                </Col>
              </Row>
            </header>
            {(tenantStore.tenantOverview === null ||
              tenantStore.tenantOverview === undefined) &&
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
                                {t(i18nKey.dashboard.label.thingList)}
                              </Typography.Title>
                            </Col>
                            <Col span={24}>
                              <Row
                                className={styles.wrapper_content_thing_content}
                                gutter={[0, 24]}>
                                {tenantStore.tenantOverview?.owners?.length ? (
                                  tenantStore.tenantOverview?.owners?.map(
                                    (owner, idx) => {
                                      return (
                                        <Col
                                          className={
                                            styles.wrapper_content_thing_item
                                          }
                                          span={24}
                                          key={idx}>
                                          <TenantCollapse
                                            onClickItem={onClickItem}
                                            data={owner.thing}
                                          />
                                        </Col>
                                      );
                                    }
                                  )
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
                      <Col
                        xs={24}
                        sm={24}
                        md={24}
                        lg={24}
                        xl={24}
                        xxl={8}
                        className={styles.wrapper_content_alarm}
                        style={{ display: 'flex', flexDirection: 'column' }}>
                        <TenantAlarm
                          title={`${t(i18nKey.dashboard.label.alarmInfo)}`}
                          seeMore={true}
                          redirectAlarm={redirectAlarm}>
                          <WrapperComponentNoData
                            isRenderNodata={
                              tenantStore.tenantOverview?.alarms?.length === 0
                            }>
                            <div className={styles.wrapper_content_alarm_list}>
                              {tenantStore.tenantOverview?.alarms?.map(
                                (item: IAlarmItem, idx: number) => {
                                  const sortedDescriptions = getArrSort(
                                    item.description
                                  );
                                  return (
                                    <Row gutter={[0, 8]} key={item._id}>
                                      <Col span={24}>
                                        <Row
                                          justify={'space-between'}
                                          align={'middle'}
                                          className={
                                            styles.wrapper_content_alarm_list_content
                                          }>
                                          <Col
                                            className={
                                              styles.wrapper_content_alarm_list_content_item
                                            }>
                                            <Row
                                              align={'middle'}
                                              className={
                                                styles.wrapper_content_alarm_list_content_item_top
                                              }>
                                              <Col>
                                                <div></div>
                                              </Col>
                                              <Col>
                                                <Typography>
                                                  {item?.thing?.name}/
                                                  {item?.thing?.location_name}
                                                </Typography>
                                                <Typography>
                                                  {t(
                                                    i18nKey.dashboard.tenant
                                                      .label.AlarmID
                                                  )}{' '}
                                                  : {item._id}
                                                </Typography>
                                              </Col>
                                            </Row>
                                          </Col>
                                          <Col>
                                            {normalizeFormatDate(
                                              item.timestamp
                                            )}
                                          </Col>
                                        </Row>
                                      </Col>
                                      <Col span={24}>
                                        <Row
                                          className={
                                            styles.wrapper_content_alarm_list_content
                                          }
                                          gutter={[6, 6]}>
                                          {sortedDescriptions?.length &&
                                            sortedDescriptions.map((x) => {
                                              return (
                                                x.message &&
                                                x.message.map((y: any) => {
                                                  return (
                                                    <Col key={uniqueKey(10)}>
                                                      <Tag
                                                        style={tagColorSeverity(
                                                          `${x.alarm_type}`
                                                        )}>
                                                        {y}
                                                      </Tag>
                                                    </Col>
                                                  );
                                                })
                                              );
                                            })}
                                        </Row>
                                      </Col>
                                    </Row>
                                  );
                                }
                              )}
                            </div>
                          </WrapperComponentNoData>
                        </TenantAlarm>
                      </Col>
                    </Row>
                  </Col>
                  {isOpenCollapse && (
                    <Col span={24}>
                      <GoogleMap
                        style={heightMap}
                        marker={thingLocation}></GoogleMap>
                    </Col>
                  )}
                </Row>
                <Drawer
                  className={styles.container_menuDrawer}
                  title={`${i18nKey.dashboard.label.alarmInfo}`}
                  placement="right"
                  width={375}
                  closable={drawerAlarm}
                  onClose={toggleDrawerAlarm}
                  open={drawerAlarm}>
                  <div className={styles.wrapper_content_alarm}>
                    <WrapperComponentNoData
                      isRenderNodata={
                        tenantStore.tenantOverview?.alarms?.length === 0
                      }>
                      <div
                        style={{ maxHeight: '100vh' }}
                        className={styles.wrapper_content_alarm_list}>
                        {tenantStore.tenantOverview?.alarms?.map(
                          (item: IAlarmItem) => {
                            const sortedDescriptions = getArrSort(
                              item.description
                            );
                            return (
                              <div key={item._id} style={{ marginBlock: 10 }}>
                                <Row
                                  justify={'space-between'}
                                  align={'top'}
                                  className={
                                    styles.wrapper_content_alarm_list_content
                                  }>
                                  <Col
                                    className={
                                      styles.wrapper_content_alarm_list_content_item
                                    }>
                                    <Row
                                      align={'middle'}
                                      className={
                                        styles.wrapper_content_alarm_list_content_item_top
                                      }>
                                      <div></div>
                                      <Typography>
                                        {item?.thing?.name}/
                                        {item?.thing?.location_name}
                                      </Typography>
                                    </Row>
                                    <Typography>
                                      {t(
                                        i18nKey.dashboard.tenant.label.AlarmID
                                      )}
                                      : {item._id}
                                    </Typography>
                                  </Col>
                                  <Typography>
                                    {normalizeFormatDate(item.timestamp)}
                                  </Typography>
                                </Row>
                                <Row
                                  style={{ marginLeft: 10 }}
                                  className={
                                    styles.wrapper_content_alarm_list_content
                                  }>
                                  <Col
                                    className={
                                      styles.wrapper_content_alarm_list_content_item
                                    }>
                                    <Space
                                      direction="vertical"
                                      className={
                                        styles.wrapper_content_alarm_list_content_item_bot
                                      }>
                                      {sortedDescriptions?.length &&
                                        sortedDescriptions.map((x) => {
                                          return x.message.map((y) => {
                                            return (
                                              <Tag
                                                key={uniqueKey(10)}
                                                style={tagColorSeverity(
                                                  `${x.alarm_type}`
                                                )}>
                                                {y}
                                              </Tag>
                                            );
                                          });
                                        })}
                                    </Space>
                                  </Col>
                                </Row>
                              </div>
                            );
                          }
                        )}
                      </div>
                    </WrapperComponentNoData>
                  </div>
                </Drawer>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default observer(Dashboard);
