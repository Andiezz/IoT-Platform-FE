import {
  DeleteOutlined,
  MoreOutlined,
  SearchOutlined,
  SyncOutlined,
  UnorderedListOutlined
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
import styles from './parameter.module.less';
import { HeaderTitle } from 'src/components/header-title/header-title';
import {
  IParameterListRequest,
  ResponseParameterDTO
} from 'src/dto/parameter.dto';
import {
  IParameterItem,
  IParameterStore
} from 'src/store/parameter/parameter.store';
import CustomModal from 'src/components/custom-modal/CustomModal';
import { ResponseDTO } from 'src/dto/base.dto';

export enum StatusAccount {
  Active = 'Active',
  InActive = 'Inactive'
}

const ParameterPage: React.FC = () => {
  const [t] = useTranslation();
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [paramDetail, setParamDetail] = useState<ResponseParameterDTO>();
  const [searchFields, setSearchFields] =
    useState<IParameterListRequest | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const screen = Grid.useBreakpoint();
  const navigator = useNavigate();
  const [form] = Form.useForm();
  const debouncedValue = useDebounce<string | undefined>(searchFields?.q, 1000);
  const parameterListStore: IParameterStore = useStore('parameterStore');
  const userStore: IUserStore = useStore('userStore');
  const userService: IUserService = useService('userService');

  const getProfile = async () => {
    const res = await userService.getUserProfile();
    if (res.responseCode === HTTP_STATUS_RESPONSE_KEY.SUCCESS) {
      userStore.updateUserInfo(res.data as IUserInfo);
    }
  };

  const fetchData = async (request?: IParameterListRequest) => {
    setLoading(true);
    try {
      await parameterListStore.fetchList(request);
      const listAccountManagement = parameterListStore.listParameter;
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
      await parameterListStore.deleteParameter({ id: id });
      fetchData();
    } catch (error) {
      throw Error;
    }
  };

  const handleSeeDetail = async (id: string) => {
    try {
      const res: ResponseDTO<ResponseParameterDTO> =
        await parameterListStore.getDetailParameter({ id: id });
      setParamDetail(res.data);
      setOpenModal(true);
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

  const DetailModal = ({
    record
  }: {
    record: ResponseParameterDTO | undefined;
  }) => {
    return (
      <CustomModal
        className={styles.modal}
        open={openModal}
        onCancel={() => setOpenModal(false)}>
        <List className={styles.list}>
          {record?.thresholds.map((item) => (
            <List.Item key={item.name} className={styles.listItem}>
              <List className={styles.list}>
                <List.Item className={styles.listItem}>
                  name: {item.name}
                </List.Item>
                <List.Item className={styles.listItem}>
                  color: {item.color.toString()}
                </List.Item>
                <List.Item className={styles.listItem}>
                  min: {item.min}
                </List.Item>
                <List.Item className={styles.listItem}>
                  max: {item.max}
                </List.Item>
              </List>
            </List.Item>
          ))}
        </List>
      </CustomModal>
    );
  };
  const OperationsComponent = ({ record }: { record: IParameterItem }) => {
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
                    navigator(`${PAGE_ROUTE.PARAMETER}/update/${record._id}`);
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
                <span>{t(i18nKey.parameterEntity.button.deleteParameter)}</span>
              </List.Item>
              <List.Item
                className={isDisable ? styles.listItemDisable : styles.listItem}
                onClick={() => {
                  !isDisable && handleSeeDetail(record._id);
                }}>
                <div style={{ marginRight: '10px' }}>
                  <UnorderedListOutlined />
                </div>
                <span>{t(i18nKey.parameterEntity.button.detailParameter)}</span>
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

  const columns: ColumnsType<IParameterItem> = useMemo(() => {
    const listColum: ColumnsType<IParameterItem> = [
      {
        title: `${t(i18nKey.parameterEntity.label.name)}`,
        key: 'name',
        render: (record: IParameterItem) => {
          if (!record.name) return <p>{'-'}</p>;
          return <span>{record.name}</span>;
        }
      },
      {
        title: `${t(i18nKey.parameterEntity.label.unit)}`,
        key: 'unit',
        render: (record: IParameterItem) => {
          if (!record.unit) return <p>{'-'}</p>;
          return <span>{record.unit}</span>;
        }
      },
      {
        title: `${t(i18nKey.parameterEntity.label.weight)}`,
        key: 'weight',
        render: (record: IParameterItem) => {
          if (!record.weight) return <p>{'-'}</p>;
          return <span>{record.weight}</span>;
        }
      }
    ];
    listColum.push({
      title: `${t(i18nKey.label.operations)}`,
      key: 'operations',
      render: (record: IParameterItem) => (
        <OperationsComponent record={record} />
      ),
      align: 'center'
    });
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
    navigator(PAGE_ROUTE.NEW_PARAMETER);
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
        title={`${t(i18nKey.parameterEntity.title.parameter)}`}
        componentRightSide={
          <Space>
            <Button
              style={{
                height: 'auto',
                padding: screen.xs ? '4px 6px' : '8px 20px'
              }}
              onClick={onClickForm}
              type="primary">
              {t(i18nKey.parameterEntity.button.createParameter)}
            </Button>
          </Space>
        }></HeaderTitle>
      <Widget>
        {renderSearch()}
        <div className={styles.wrapperTable}>
          <Table
            className={styles.tableaccountManagement}
            dataSource={parameterListStore.listParameter}
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
              total: parameterListStore.totalPages
            }}
            scroll={{ x: 800 }}
            onChange={onTableChange}
          />
        </div>
        <DetailModal record={paramDetail} />
      </Widget>
    </>
  );
};

export default observer(ParameterPage);
