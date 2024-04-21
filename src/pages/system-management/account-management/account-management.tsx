import {
  MailOutlined,
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
  Select,
  Space,
  Table,
  Tag,
  Tooltip,
  message
} from 'antd';
import { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { t } from 'i18next';
import { observer } from 'mobx-react-lite';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Widget from 'src/components/widget/widget';
import { PAGE_ROUTE } from 'src/constants/route';
import {
  IAccountManagementItem,
  IAccountManagementListRequest,
  ResponseActiveLinkDTO
} from 'src/dto/account-management-list.dto';
import { i18nKey } from 'src/locales/i18n';
import { TABLE_SORT_DIRECTION } from 'src/constants';
import { HTTP_STATUS_RESPONSE_KEY } from 'src/constants/api';
import { Permission } from 'src/constants/user';
import { normalizeFormatDate } from 'src/helpers/common.utils';
import useDebounce from 'src/hooks/use-debounce';
import useService from 'src/hooks/use-service';
import useStore from 'src/hooks/use-store';
import { IUserInfo, Role } from 'src/interfaces/user';
import { IAuthenticationService } from 'src/services/authentication.service';
import { IUserService } from 'src/services/user.service';
import { IAccountListStore } from 'src/store/account-management/account-management-list.store';
import { IUserStore } from 'src/store/user.store';
import styles from './account-management.module.less';
import { ResponseDTO } from 'src/dto/base.dto';
import { HeaderTitle } from 'src/components/header-title/header-title';

export enum StatusAccount {
  Active = 'Active',
  InActive = 'Inactive'
}

const optionStatus = [
  {
    label: t(i18nKey.status.active),
    value: true,
    key: StatusAccount.Active
  },
  {
    label: t(i18nKey.status.inactive),
    value: false,
    key: StatusAccount.InActive
  }
];

const optionRole = [
  {
    label: t(i18nKey.permissionEntity.role.viewer),
    value: Role.Viewer,
    key: Role.Viewer
  },
  {
    label: t(i18nKey.permissionEntity.role.tenantAdmin),
    value: Role.TENANT_ADMIN,
    key: Role.TENANT_ADMIN
  },
  {
    label: t(i18nKey.permissionEntity.role.analyst),
    value: Role.ANALYST,
    key: Role.ANALYST
  },
  {
    label: t(i18nKey.permissionEntity.role.superAdmin),
    value: Role.SUPER_ADMIN,
    key: Role.SUPER_ADMIN
  },
  {
    label: t(i18nKey.permissionEntity.role.customerService),
    value: Role.CUSTOMER_SERVICE,
    key: Role.CUSTOMER_SERVICE
  }
];

const AccountManagementPage: React.FC = () => {
  const [t] = useTranslation();
  const [loading, setLoading] = useState(false);
  const [searchFields, setSearchFields] =
    useState<IAccountManagementListRequest | null>(null);
  const [pageNumber, setPageNumer] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const screen = Grid.useBreakpoint();
  const navigator = useNavigate();
  const [form] = Form.useForm();
  const debouncedValue = useDebounce<string | undefined>(searchFields?.q, 1000);
  const accountManagementListStore: IAccountListStore = useStore(
    'listAccountManagementListStore'
  );
  const authService: IAuthenticationService = useService(
    'authenticationService'
  );
  const listMyPermission =
    authService.permissionRole?.groups.map((group) => group.permission.key) ||
    [];
  const userStore: IUserStore = useStore('userStore');
  const userService: IUserService = useService('userService');

  const getProfile = async () => {
    const res = await userService.getUserProfile();
    if (res.responseCode === HTTP_STATUS_RESPONSE_KEY.SUCCESS) {
      userStore.updateUserInfo(res.data as IUserInfo);
    }
  };

  const fetchData = async (request?: IAccountManagementListRequest) => {
    setLoading(true);
    try {
      await accountManagementListStore.fetchList(request);
      const listAccountManagement =
        accountManagementListStore.listAccountManagement;
      if (listAccountManagement.length === 0) {
        setPageNumer(1);
      }
      setLoading(false);
    } catch (error) {
      throw Error;
    }
  };

  const getNewLinkActive = async (email: string) => {
    setLoading(true);
    const res: ResponseDTO<ResponseActiveLinkDTO> =
      await accountManagementListStore.getNewLinkActiveAccount({ email });
    if (res.responseCode === HTTP_STATUS_RESPONSE_KEY.SUCCESS) {
      fetchData({
        ...searchFields,
        page: pageNumber,
        limit: pageSize,
        sort_order: TABLE_SORT_DIRECTION.DESC
      });
      message.success(t(i18nKey.validation.account.resentActiveLinkSuccess));
    } else {
      message.error(t(i18nKey.validation.account.resentActiveLinkFail));
    }
    setLoading(false);
  };

  useEffect(() => {
    accountManagementListStore.getRole().catch((error) => {
      throw Error(error);
    });
  }, []);

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
  }, [pageNumber, pageSize, searchFields?.is_active, searchFields?.role, debouncedValue]);

  const OperationsComponent = ({
    record
  }: {
    record: IAccountManagementItem;
  }) => {
    const isShowActiveButton =
      record.is_first_login && record.is_expired_activation_code;
    
    const isDisable =
      !listMyPermission.includes(Permission.cudAccount) || !!record.is_first_login ||
      (record.user_role?.role.role === Role.SUPER_ADMIN &&
        record._id !== userStore.userInfo?.id);

    return (
      <Popover
        arrow={false}
        content={
          <List className={styles.list}>
            <Tooltip
              title={(() => {
                if (!listMyPermission.includes(Permission.cudAccount)) {
                  return t(
                    i18nKey.httpResponseMessage._401_Unauthorized_Access_Denided
                  );
                }
                if (record.is_first_login) {
                  return `${t(
                    i18nKey.messageIndicator.updateAccountUnavailable
                  )}`;
                }
                if (
                  record.user_role?.role.role === Role.SUPER_ADMIN &&
                  record._id !== userStore.userInfo?.id
                ) {
                  return `${t(
                    i18nKey.messageIndicator.exroAdminPermissionDenied
                  )}`;
                }
              })()}>
              <List.Item
                className={isDisable ? styles.listItemDisable : styles.listItem}
                onClick={() => {
                  !isDisable &&
                    navigator(
                      `${PAGE_ROUTE.ACCOUNT_MANAGEMENT}/update/${record._id}`
                    );
                }}>
                <div style={{ marginRight: '10px' }}>
                  <SyncOutlined />
                </div>
                <span>{t(i18nKey.accountEntity.button.updateAccount)}</span>
              </List.Item>
            </Tooltip>
            {isShowActiveButton && (
              <List.Item
                className={styles.listItem}
                onClick={() => getNewLinkActive(record.email as string)}>
                <div style={{ marginRight: '10px' }}>
                  <MailOutlined />
                </div>
                <span>
                  {t(i18nKey.accountEntity.button.generateNewActivationLink)}
                </span>
              </List.Item>
            )}
          </List>
        }
        trigger="click"
        placement="bottom"
        overlayInnerStyle={{ padding: '0' }}>
        <MoreOutlined />
      </Popover>
    );
  };

  const columns: ColumnsType<IAccountManagementItem> = useMemo(()=>{
    
    const listColum: ColumnsType<IAccountManagementItem> = [
    {
      title: `${t(i18nKey.label.status)}`,
      dataIndex: 'is_active',
      key: 'is_active',
      render: (is_active: boolean) => (
        <Tag color={is_active ? 'blue' : 'gray'} icon="• ">
          {is_active ? StatusAccount.Active : StatusAccount.InActive}
        </Tag>
      )
    },
    {
      title: `${t(i18nKey.accountEntity.label.fullName)}`,
      key: 'fullName',
      render: (record: IAccountManagementItem) => {
        if (!record.first_name) return <p>{'-'}</p>;
        return <span>{record.first_name + ' ' + record.last_name}</span>;
      }
    },
    {
      title: `${t(i18nKey.label.email)}`,
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: `${t(i18nKey.label.role)}`,
      key: 'role',
      render: (record: IAccountManagementItem) => {
        if (!record.user_role) return <p>{'-'}</p>;
        return <span>{t(i18nKey.permissionEntity.roleKeyToText[record.user_role.role.role])}</span>;
      }
    },
    {
      title: `${t(i18nKey.accountEntity.label.phoneNumber)}`,
      key: 'phoneNumber',
      render: (record: IAccountManagementItem) => {
        if (!record.phone_code && !record.phone_number) return <p>{'-'}</p>;
        return <span>{record.phone_code + ' ' + record.phone_number}</span>;
      }
    },
    {
      title: `${t(i18nKey.label.createdDate)}`,
      dataIndex: 'createdOn',
      key: 'createdOn',
      render: (value: string) => normalizeFormatDate(value)
    },
  ];
  if(listMyPermission.includes(Permission.cudAccount)){
    listColum.push({
      title: `${t(i18nKey.label.operations)}`,
      key: 'operations',
      render: (record: IAccountManagementItem) => <OperationsComponent record={record} />,
      align: 'center'
    })
  }
  return listColum
},[listMyPermission])

  const handleChangeFormSearch = useCallback((valueChange: any) => {
    setSearchFields((prev) => ({ ...prev, ...valueChange }));
    if (valueChange.q) {
      setSearchFields((prev) => ({
        ...prev,
        q: valueChange?.q && valueChange?.q.trim()
      }));
    }
  }, []);

  const handleResetSearch = useCallback(() => {
    form.resetFields();

    setSearchFields({ q: '', role: undefined, is_active: undefined });
  }, []);
  const onClickForm = () => {
    navigator(PAGE_ROUTE.NEW_ACCOUNT);
    form.submit();
  };

  const onTableChange = async (pagination: TablePaginationConfig) => {
    setPageNumer(pagination.current as number);
    setPageSize(pagination.pageSize as number);
  };

  const renderSearch = () => {
    return (
      <div>
        <Form onValuesChange={handleChangeFormSearch} form={form}>
          <Row gutter={{xs: 5, sm: 10, md: 10,lg: 10, xl: 16}}>
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
                  placeholder={i18nKey.defaultPlaceholder.searchAccount}
                  allowClear
                />
              </Form.Item>
            </Col>
            <Col xs={12} sm={8} md={10} lg={7} xl={5} xxl={3}>
              <Form.Item name="role" className={styles.wrapOptionSearch}>
                <Select
                  style={{ width: '100%' }}
                  placeholder="Role"
                  options={optionRole}
                  allowClear
                  popupMatchSelectWidth={150}
                />
              </Form.Item>
            </Col>
            <Col xs={7} sm={8} md={7} lg={4} xl={3} xxl={2}>
              <Form.Item
                style={{ width: '100%' }}
                name={'is_active'}
                className={styles.wrapOptionSearch}>
                <Select
                  placeholder="Status"
                  options={optionStatus}
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
        title={`${t(i18nKey.accountEntity.title.accountManagement)}`}
        componentRightSide={
          <Space>
                {listMyPermission.includes(Permission.cudAccount) &&
              <Button
                style={{
                  height: 'auto',
                  padding: screen.xs ? '4px 6px' : '8px 20px'
                }}
                disabled={!listMyPermission.includes(Permission.cudAccount)}
                onClick={onClickForm}
                type="primary">
                {t(i18nKey.accountEntity.button.createAccount)}
              </Button>}
          </Space>
        }></HeaderTitle>
      <Widget>
        {renderSearch()}
        <div className={styles.wrapperTable}>
          <Table
            className={styles.tableaccountManagement}
            dataSource={accountManagementListStore.listAccountManagement}
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
              total: accountManagementListStore.totalPages
            }}
            scroll={{ x: 1500 }}
            onChange={onTableChange}
          />
        </div>
      </Widget>
    </>
  );
};

export default observer(AccountManagementPage);
