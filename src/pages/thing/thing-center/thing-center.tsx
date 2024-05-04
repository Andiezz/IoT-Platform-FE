import {
  Avatar,
  Button,
  Col,
  Form,
  List,
  Popover,
  Row,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { observer } from 'mobx-react-lite';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import LocationPlantIcon from 'src/assets/icons/LocationPlants.svg';

import { ReactComponent as UpdateIcon } from 'src/assets/icons/Edit-icon.svg';
import ListOperation from 'src/components/list-operations/ListOperation';
import SearchComponent, {
  ISearchValues
} from 'src/components/search-option-status-role/search-component';
import Widget from 'src/components/widget/widget';
import { PAGE_ROUTE } from 'src/constants/route';
import { getStatus, tagColorStatus } from 'src/constants/utils';
import {
  IThingItem,
  IThingListRequest,
} from 'src/dto/thing.dto';
import { uniqueKey } from 'src/helpers/string.utils';
import useStore from 'src/hooks/use-store';
import { i18nKey } from 'src/locales/i18n';
import { IThingListStore, IThingStore } from 'src/store/thing.store';
import styles from './plant-center.module.less';
import { IAuthenticationService } from 'src/services/authentication.service';
import useService from 'src/hooks/use-service';
import { ReactComponent as DieselGenerator } from 'src/assets/icons/Diesel-generator.svg';
import { ReactComponent as WindTurbine } from 'src/assets/icons/Wind-turbine.svg';
import { ReactComponent as PVInverter } from 'src/assets/icons/PV-invertor.svg';
import TooltipParagraph from 'src/components/tooltip-paragraph/tooltip-paragraph';
import { normalizeFormatDate } from 'src/helpers/common.utils';
import WidgetHeader from 'src/components/widget-header/widget-header';
import useViewport from 'src/hooks/use-viewport';
import { ReactComponent as MoreIcon } from 'src/assets/icons/more-icon.svg';
import { ReactComponent as ElementIcon } from 'src/assets/icons/elemant.svg';
import * as _ from 'lodash';
import moment from 'moment-timezone';
import { STATUS } from 'src/constants/status';

const optionStatus = [
  {
    label: STATUS.ACTIVE,
    value: STATUS.ACTIVE.toLowerCase(),
    key: STATUS.ACTIVE
  },
  {
    label: STATUS.INACTIVE,
    value: STATUS.INACTIVE.toLowerCase(),
    key: STATUS.INACTIVE
  },
  {
    label: STATUS.PENDING_SETUP,
    value: STATUS.PENDING_SETUP.toLowerCase().replace(' ', '-'),
    key: STATUS.PENDING_SETUP
  }
];

const ThingCenterPage: React.FC = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const navigator = useNavigate();
  const navigate = useNavigate();
  const viewPort = useViewport();
  const isMobile = viewPort.width < 768;
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [loading, setLoading] = useState(false);
  const [map, setMap] = useState(false);
  const [isDrag, setIsDrag] = useState<boolean>(false);
  const refTable = useRef<any>();

  const [searchFields, setSearchFields] = useState<IThingListRequest | null>(
    null
  );

  const dataPlant: IThingListStore = useStore('listThingStore');

  const onboardingPlantStore: IThingStore = useStore('thingStore');

  const fetchDataThingList = async (request?: IThingListRequest) => {
    setLoading(true);
    try {
      await dataPlant.fetchList(request);
      setLoading(false);
    } catch (error) {
      throw Error;
    }
  };
  useEffect(() => {
    onboardingPlantStore.setThing(undefined as any, NaN);
  }, []);

  

  useEffect(() => {
    fetchDataThingList({
      ...searchFields,
      page: pageNumber,
      limit: pageSize
    });
  }, [pageNumber,searchFields?.status,searchFields?.q,pageSize]);

  useEffect(() => {
    refTable.current?.addEventListener('mousedown', () => setIsDrag(false));

    refTable.current?.addEventListener('mousemove', () => setIsDrag(true));
    return () => {
      refTable.current?.removeEventListener('mousedown', () => setIsDrag(true));
      refTable.current?.removeEventListener('mousemove', () => setIsDrag(true));
    };
  }, []);

  const handleChangeFormSearch = useCallback(
    (valueChange: Partial<ISearchValues>) => {
      setPageNumber(1);
      setSearchFields((prev) => ({ ...prev, ...valueChange }));
      if (valueChange.q) {
        setSearchFields((prev) => ({
          ...prev,
          q: valueChange?.q && valueChange?.q.trim()
        }));
      }
    },
    []
  );
  const onTableChange = async (pagination: TablePaginationConfig) => {
    console.log('pagination', pagination)
    setPageNumber(pagination.current as number);
    setPageSize(pagination.pageSize as number); 
  };

  const data = React.useMemo(() => {
    const tempData = [
      {
        title: `${t(i18nKey.label.goToDashboard)}`,
        icon: <ElementIcon />,
        onClick: (record: IThingItem) => {
          navigate(
            `${PAGE_ROUTE.DASHBOARD.replace(
              ':id',
              `${record._id}`
            )}`
          );
        }
      }
    ];
      tempData.push(
        {
          title: `${t(i18nKey.thingEntity.button.updateThing)}`,
          icon: <UpdateIcon />,
          onClick: (record: IThingItem) =>
            navigator(
              `${PAGE_ROUTE.THING_UPDATE.replace(
                ':id',
                `${record._id}`
              )}`
            )
        },
      );

    return tempData;
  }, []);


  const OperationsComponent = ({ record }: { record: IThingItem }) => {
    return (
      <Popover
        arrow={false}
        content={
          <List
            bordered
            className={styles.container_listOperation}
            dataSource={data}
            renderItem={(item) => (
              <ListOperation
                key={uniqueKey(10)}
                record={record}
                item={item}
                messageDelete={`${t(
                  i18nKey.messageIndicator.deleteThingUnavailable
                )}`}
              />
            )}
          />
        }
        trigger={[isMobile ? 'click' : 'hover']}
        placement="bottom"
        overlayInnerStyle={{ padding: '0', cursor: 'pointer', zIndex: 100 }}>
        <MoreIcon
          className={styles.container_more}
          onClick={(e) => e.stopPropagation()}
        />
      </Popover>
    );
  };

  const columns: ColumnsType<IThingItem> = [
    {
      title: `${t(i18nKey.label.status)}`,
      key: 'status',
      width: '12%',
      render: (record: IThingItem) => (
        <Space>
          <Tag
            style={record.status ? tagColorStatus(record.status) : {}}
            icon={'• '}>
            {getStatus(record?.status)}
          </Tag>
        </Space>
      ),
      shouldCellUpdate: (record, prevRecord) => !_.isEqual(record, prevRecord)
    },
    {
      title: `${t(i18nKey.label.thingLocation)}`,
      key: 'plantLocation',
      ellipsis: true,
      render: (record: IThingItem) => (
        <>
          <Typography>{record.name}</Typography>
          {record?.location.name && (
            <div className={styles.plantLocations}>
              <Space align="center" style={{ width: '100%' }}>
                <img src={LocationPlantIcon} />
                <Typography className={styles.tableLocationPlant}>
                  <TooltipParagraph>{record.location.name}</TooltipParagraph>
                </Typography>
              </Space>
            </div>
          )}
        </>
      ),
      shouldCellUpdate: (record, prevRecord) => !_.isEqual(record, prevRecord)
    },
    {
      title: `${t(i18nKey.label.owner)}`,
      key: 'thingOwner',
      width: '15%',
      render: (record: IThingItem) => (
        <>
          {
          record.managers ? (
            record?.managers.find((item) => item.isOwner)?.email
          ) : (
            <Typography>-</Typography>
          )}
        </>
      )
    },
    {
      title: `${t(i18nKey.label.devices)}`,
      width: '20%',
      key: 'devices',
      render: (record: IThingItem) => {
        return record?.devices &&
          record?.devices.length > 0 ? (
          <Row gutter={[16, 16]}>
            {/* {record.devices.map((item) => {
              switch (item.model) {
                case DeviceType.PV_Inverter:
                  return (
                    <Tooltip
                      key={uniqueKey(17)}
                      title={
                        item &&
                        `${nameDeviceType} | ${item.capacity + 'kW'}`
                      }>
                      <Tag
                        icon={<PVInverter style={{ marginRight: '5px' }} />}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          color: '#FF8060',
                          background: 'rgba(255, 128, 96, 0.1)'
                        }}>
                        {item.capacity + 'kW'}
                      </Tag>
                    </Tooltip>
                  );
                case DeviceType.Diesel_Generator:
                  return (
                    <Tooltip
                      key={uniqueKey(18)}
                      title={
                        item &&
                        `${nameDeviceType} | ${item.capacity + 'kW'}`
                      }>
                      <Tag
                        icon={
                          <DieselGenerator style={{ marginRight: '5px' }} />
                        }
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          color: '#8B75FF',
                          background: 'rgba(139, 117, 255, 0.1)'
                        }}>
                        {item.capacity + 'kW'}
                      </Tag>
                    </Tooltip>
                  );
                case DeviceType.Wind_Turbine:
                  return (
                    <Tooltip
                      key={uniqueKey(19)}
                      title={
                        item &&
                        `${nameDeviceType} | ${item.capacity + 'kW'}`
                      }>
                      <Tag
                        icon={<WindTurbine style={{ marginRight: '5px' }} />}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          color: '#50C878',
                          background: 'rgba(80, 200, 120, 0.1)'
                        }}>
                        {item.capacity + 'kW'}
                      </Tag>
                    </Tooltip>
                  );
              }
            })} */}
          </Row>
        ) : (
          <Typography.Text>-</Typography.Text>
        );
      },
      shouldCellUpdate: (record, prevRecord) => !_.isEqual(record, prevRecord)
    },
    {
      title: `${t(i18nKey.label.createdDate)}`,
      dataIndex: 'createdOn',
      width: '12%',
      key: 'createdOn',
      render: (value: string) => normalizeFormatDate(value),
      sorter: (a, b) => moment(a.createdOn).valueOf() -  moment(b.createdOn).valueOf(),
      shouldCellUpdate: (record, prevRecord) => !_.isEqual(record, prevRecord)
    },
    {
      title: `${t(i18nKey.label.operations)}`,
      width: '8%',
      key: 'operations',
      render: (record: IThingItem) => <OperationsComponent record={record} />,
      align: 'center',
      shouldCellUpdate: (record, prevRecord) => !_.isEqual(record, prevRecord)
    }
  ];

  const handleResetSearch = () => {
    if (searchFields?.q !== undefined || searchFields?.status !== undefined) {
      form.resetFields();
      setSearchFields({ q: undefined, status: undefined });
      setPageNumber(1);
    }
  };

  const handleMap = () => {
    setMap(!map);
  };

  return (
    <div className={styles.container}>
      <WidgetHeader>
        <Row gutter={[0, 16]} className={styles.container_header}>
          <Col span={24}>
            <Row justify={'space-between'} align={'middle'}>
              <Col>
                <Typography.Title
                  className={styles.container_header_title}
                  level={4}>
                  {t(i18nKey.menu.thingCenter)}
                </Typography.Title>
              </Col>
                <Col>
                  <Button
                    className={styles.container_header_btn}
                    onClick={() => navigator(PAGE_ROUTE.THING_CREATE)}
                    type="primary">
                    {t(i18nKey.thingEntity.button.createThing)}
                  </Button>
                </Col>
            </Row>
          </Col>
          <Col xs={24} sm={24} md={0} lg={0} xl={0} xxl={0}>
            <SearchComponent
              formInstanceSearch={form}
              handleChangeFormSearch={handleChangeFormSearch}
              handleResetSearch={handleResetSearch}
              optionStatus={optionStatus}
              nameSelectStatus={'status'}
              handleMap={handleMap}
              map={map}
              placeholder={`${t(i18nKey.thingEntity.placeholder.search)}`}
            />
          </Col>
        </Row>
      </WidgetHeader>
      <Widget>
        <Row>
          <Col xs={0} sm={0} md={24} lg={24} xl={24} xxl={24}>
            <SearchComponent
              formInstanceSearch={form}
              handleChangeFormSearch={handleChangeFormSearch}
              handleResetSearch={handleResetSearch}
              optionStatus={optionStatus}
              nameSelectStatus={'status'}
              handleMap={handleMap}
              map={map}
              placeholder={`${t(i18nKey.thingEntity.placeholder.search)}`}
            />
          </Col>
        </Row>

        <div className={styles.wrapperTable}>
          <Table
            ref={refTable}
            className={styles.container_tablePlant}
            dataSource={dataPlant.listThing}
            columns={columns}
            onChange={onTableChange}
            pagination={{
              showTotal: (total) =>
                `${t(i18nKey.button.totalEntries, {
                  totalEntries: `${total}`
                })}`,
              current: pageNumber,
              pageSize: pageSize,
              total: dataPlant.totalPages
            }}
            scroll={{ x: 1000 }}
            size="middle"
            loading={loading}
            rowKey={'_id'}
            onRow={(record) => {
              return {
                onClick: (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  !isDrag &&
                    navigator(
                      `${PAGE_ROUTE.THING_DETAIL.replace(
                        ':id',
                        record._id ?? ''
                      )}`,
                      { state: { name: record?.name } }
                    );
                } // click row
              };
            }}
          />
        </div>
      </Widget>
    </div>
  );
};

export default observer(ThingCenterPage);
