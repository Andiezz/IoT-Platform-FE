import {
  DeleteOutlined,
  MoreOutlined,
  SearchOutlined,
  SyncOutlined
} from '@ant-design/icons';
import {
  Button,
  Col,
  Form,
  Grid,
  Input,
  List,
  Popover,
  Row,
  Space,
  Table,
  Tooltip
} from 'antd';
import { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { observer } from 'mobx-react-lite';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Widget from 'src/components/widget/widget';
import { PAGE_ROUTE } from 'src/constants/route';
import { i18nKey } from 'src/locales/i18n';
import { TABLE_SORT_DIRECTION } from 'src/constants';
import { HTTP_STATUS_RESPONSE_KEY } from 'src/constants/api';
import useDebounce from 'src/hooks/use-debounce';
import useService from 'src/hooks/use-service';
import useStore from 'src/hooks/use-store';
import { IUserInfo } from 'src/interfaces/user';
import { IUserService } from 'src/services/user.service';
import { IUserStore } from 'src/store/user.store';
import styles from './device-model.module.less';
import { HeaderTitle } from 'src/components/header-title/header-title';
import { IDeviceModelListRequest } from 'src/dto/device-model.dto';
import {
  IDeviceModelItem,
  IDeviceModelStore
} from 'src/store/device-model/device-model.store';

const DeviceModelPage: React.FC = () => {
  const [t] = useTranslation();
  const [loading, setLoading] = useState(false);
  const [searchFields, setSearchFields] =
    useState<IDeviceModelListRequest | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const screen = Grid.useBreakpoint();
  const navigator = useNavigate();
  const [form] = Form.useForm();
  const debouncedValue = useDebounce<string | undefined>(searchFields?.q, 1000);
  const deviceModelListStore: IDeviceModelStore = useStore('deviceModelStore');
  const userStore: IUserStore = useStore('userStore');
  const userService: IUserService = useService('userService');

  const getProfile = async () => {
    const res = await userService.getUserProfile();
    if (res.responseCode === HTTP_STATUS_RESPONSE_KEY.SUCCESS) {
      userStore.updateUserInfo(res.data as IUserInfo);
    }
  };

  const fetchData = async (request?: IDeviceModelListRequest) => {
    setLoading(true);
    try {
      await deviceModelListStore.fetchList(request);
      const listAccountManagement = deviceModelListStore.listDeviceModel;
      if (listAccountManagement.length === 0) {
        setPageNumber(1);
      }
      setLoading(false);
    } catch (error) {
      throw Error;
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deviceModelListStore.deleteDeviceModel({ id: id });
      fetchData();
    } catch (error) {
      throw Error;
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  useEffect(() => {
    fetchData({
      ...searchFields,
      page: pageNumber,
      limit: pageSize,
      sort_order: TABLE_SORT_DIRECTION.DESC
    });
  }, [pageNumber, pageSize, debouncedValue]);

  const OperationsComponent = ({ record }: { record: IDeviceModelItem }) => {
    const isDisable = false;

    return (
      <Popover
        arrow={false}
        content={
          <List className={styles.list}>
            <Tooltip>
              <List.Item
                className={isDisable ? styles.listItemDisable : styles.listItem}
                onClick={() => {
                  !isDisable &&
                    navigator(
                      `${PAGE_ROUTE.DEVICE_MODEL}/update/${record._id}`
                    );
                }}>
                <div style={{ marginRight: '10px' }}>
                  <SyncOutlined />
                </div>
                <span>{t(i18nKey.parameterEntity.button.updateParameter)}</span>
              </List.Item>
              <List.Item
                className={isDisable ? styles.listItemDisable : styles.listItem}
                onClick={() => {
                  !isDisable && handleDelete(record._id);
                }}>
                <div style={{ marginRight: '10px' }}>
                  <DeleteOutlined />
                </div>
                <span>
                  {t(i18nKey.deviceModelEntity.button.deleteDeviceModel)}
                </span>
              </List.Item>
            </Tooltip>
          </List>
        }
        trigger="click"
        placement="bottom"
        overlayInnerStyle={{ padding: '0' }}>
        <MoreOutlined />
      </Popover>
    );
  };

  const columns: ColumnsType<IDeviceModelItem> = useMemo(() => {
    const listColum: ColumnsType<IDeviceModelItem> = [
      {
        title: `${t(i18nKey.deviceModelEntity.label.name)}`,
        key: 'name',
        render: (record: IDeviceModelItem) => {
          if (!record.name) return <p>{'-'}</p>;
          return <span>{record.name}</span>;
        }
      },
      {
        title: `${t(i18nKey.deviceModelEntity.label.information)}`,
        key: 'information',
        render: (record: IDeviceModelItem) => {
          if (!record.information) return <p>{'-'}</p>;
          return <span>{record.information}</span>;
        }
      },
      {
        title: `${t(i18nKey.deviceModelEntity.label.type)}`,
        key: 'type',
        render: (record: IDeviceModelItem) => {
          if (!record.type) return <p>{'-'}</p>;
          return <span>{record.type}</span>;
        }
      },
      {
        title: `${t(i18nKey.deviceModelEntity.label.parameterStandards)}`,
        key: 'parameterStandards',
        render: (record: IDeviceModelItem) => {
          if (!record.parameterStandards) return <p>{'-'}</p>;
          return (
            <span>
              {record.parameterStandards.map((param) => param.name).join(', ')}
            </span>
          );
        }
      }
    ];
    listColum.push({
      title: `${t(i18nKey.label.operations)}`,
      key: 'operations',
      render: (record: IDeviceModelItem) => (
        <OperationsComponent record={record} />
      ),
      align: 'center'
    });
    // }
    return listColum;
  }, []);

  const handleChangeFormSearch = useCallback((valueChange: any) => {
    setSearchFields((prev) => ({ ...prev, ...valueChange }));
    if (valueChange.q) {
      setSearchFields((prev) => ({
        ...prev,
        q: valueChange?.q?.trim()
      }));
    }
  }, []);

  const handleResetSearch = useCallback(() => {
    form.resetFields();

    setSearchFields({ q: '' });
  }, []);

  const onClickForm = () => {
    navigator(PAGE_ROUTE.NEW_DEVICE_MODEL);
    form.submit();
  };

  const onTableChange = async (pagination: TablePaginationConfig) => {
    setPageNumber(pagination.current as number);
    setPageSize(pagination.pageSize as number);
  };

  const renderSearch = () => {
    return (
      <div>
        <Form onValuesChange={handleChangeFormSearch} form={form}>
          <Row gutter={{ xs: 5, sm: 10, md: 10, lg: 10, xl: 16 }}>
            <Col
              xs={24}
              sm={24}
              md={24}
              lg={11}
              xl={12}
              xxl={8}
              className={styles.wrapSearchInput}>
              <Form.Item name="q">
                <Input
                  prefix={<SearchOutlined />}
                  placeholder={i18nKey.defaultPlaceholder.searchParameter}
                  allowClear
                />
              </Form.Item>
            </Col>
            <Col xs={5} sm={8} md={7} lg={2} xl={2} xxl={2}>
              <Button onClick={handleResetSearch}>
                {t(i18nKey.button.reset)}
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    );
  };

  return (
    <>
      <HeaderTitle
        justify={'space-between'}
        align={'middle'}
        wrap={false}
        title={`${t(i18nKey.deviceModelEntity.title.deviceModel)}`}
        componentRightSide={
          <Space>
            <Button
              style={{
                height: 'auto',
                padding: screen.xs ? '4px 6px' : '8px 20px'
              }}
              onClick={onClickForm}
              type="primary">
              {t(i18nKey.deviceModelEntity.button.createDeviceModel)}
            </Button>
          </Space>
        }></HeaderTitle>
      <Widget>
        {renderSearch()}
        <div className={styles.wrapperTable}>
          <Table
            className={styles.tableaccountManagement}
            dataSource={deviceModelListStore.listDeviceModel}
            columns={columns}
            loading={loading}
            rowKey={'_id'}
            size="middle"
            pagination={{
              showTotal: (total) =>
                `${t(i18nKey.button.totalEntries, {
                  totalEntries: `${total}`
                })}`,
              pageSize: pageSize,
              current: pageNumber,
              total: deviceModelListStore.totalPages
            }}
            scroll={{ x: 800 }}
            onChange={onTableChange}
          />
        </div>
      </Widget>
    </>
  );
};

export default observer(DeviceModelPage);
