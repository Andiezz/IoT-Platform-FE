import React, { useState, useEffect } from 'react';
import styles from './users-permission.module.less';
import {
  Button,
  Checkbox,
  Col,
  Collapse,
  // CollapseProps,
  Form,
  Row,
  Spin,
  Tooltip,
  Typography,
  message
} from 'antd';
import {
  listPermissionAccount,
  listPermissionSettingTab,
  listPermissionControlPanelTab,
  listPermissionServiceTab,
  listPermissionPlant,
  listPermissionAlarm,
  listPermissionTenant
} from 'src/constants/permission';
import { i18nKey } from 'src/locales/i18n';
import { useTranslation } from 'react-i18next';
import { IAccountListStore } from 'src/store/account-management/account-management-list.store';
import useStore from 'src/hooks/use-store';
import { Role } from 'src/interfaces/user';
import { PermissionRole } from 'src/dto/account-management-list.dto';
import { HTTP_STATUS_RESPONSE_KEY } from 'src/constants/api';
import { IUserService } from 'src/services/user.service';
import useService from 'src/hooks/use-service';
import { InfoCircleFilled } from '@ant-design/icons';
import { Permission } from 'src/constants/user';
enum TypePermission {
  PERMISSION_ACCOUNT = 'permissionAccount',
  PERMISSION_TENANT = 'permissionTenant',
  PERMISSION_PLANT = 'permissionPlant',
  PERMISSION_SERVICE_TAB = 'permissionServiceTab',
  PERMISSION_SETTING_TAB = 'permissionSettingTab',
  PERMISSION_CONTROL_PANEL_TAB = 'permissionControlPanelTab',
  PERMISSION_ALARM = 'permissionAlarm'
}
interface IDataPermission {
  _id: string;
  name: string;
  key: Permission;
}
const UserPermission: React.FC = () => {
  const [t] = useTranslation();

  const [disable, setDisable] = useState(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [listPermission, setListPermission] = useState<
    Array<{ _id: string; name: string; key: Permission }>
  >([]);
  const [, setRerender] = useState<number>(0);
  const userService: IUserService = useService('userService');
  const [listPermissionRole, setListPermissionRole] = useState<
    Record<Role, null | PermissionRole>
  >({
    [Role.SUPER_ADMIN]: null,
    [Role.ANALYST]: null,
    [Role.TENANT_ADMIN]: null,
    [Role.Viewer]: null,
    [Role.CUSTOMER_SERVICE]: null
  });
  const [permissionWithType, setPermissionWithType] = useState<
    Record<TypePermission, IDataPermission[]>
  >({
    [TypePermission.PERMISSION_ACCOUNT]: [],
    [TypePermission.PERMISSION_TENANT]: [],
    [TypePermission.PERMISSION_PLANT]: [],
    [TypePermission.PERMISSION_SERVICE_TAB]: [],
    [TypePermission.PERMISSION_CONTROL_PANEL_TAB]: [],
    [TypePermission.PERMISSION_SETTING_TAB]: [],
    [TypePermission.PERMISSION_ALARM]: []
  });

  const [mapKeyPermissionToId, setMapKeyPermissionToId] = useState<
    Record<Permission, string>
  >({} as Record<Permission, string>);

  const accountManagementListStore: IAccountListStore = useStore(
    'listAccountManagementListStore'
  );
  const [formValue,setFormValue] = useState<Record<string,Role[]>>({})

  const onChangeForm = () => {
    setDisable(false);
  };
  const [form] = Form.useForm();
  const onValueChange = () => {
    setDisable(false);
  };

  //fetch Data
  useEffect(() => {
    accountManagementListStore.getPermission().then((rs) => {
      if (rs.responseCode !== HTTP_STATUS_RESPONSE_KEY.SUCCESS) {
        throw new Error();
      }
      if (rs.data?.groups) {
        setListPermission([...rs.data.groups]);
        const mapKeyToId = {} as Record<Permission, string>;
        rs.data.groups.forEach((item) => {
          mapKeyToId[item.key] = item._id;
        });
        setMapKeyPermissionToId(mapKeyToId);
      }
      const mapRoleWithPermission = rs.data?.roles.reduce(
        (
          mapPermissionRole: Record<Role, PermissionRole | null>,
          value: PermissionRole
        ) => {
          mapPermissionRole[value.role] = value;
          return mapPermissionRole;
        },
        {
          [Role.SUPER_ADMIN]: null,
          [Role.ANALYST]: null,
          [Role.TENANT_ADMIN]: null,
          [Role.Viewer]: null,
          [Role.CUSTOMER_SERVICE]: null
        }
      );

      mapRoleWithPermission && setListPermissionRole(mapRoleWithPermission);
    });
  }, []);

  //check and uncheck, permission create update delete require has permission read

  const onChangeFormItem = (
    id: string,
    key: Permission,
    value: Array<Role>
  ) => {
    switch (key) {
      case Permission.viewAccountManagementPage: {
        form.setFieldValue(
          mapKeyPermissionToId[Permission.cudAccount],
          (
            form.getFieldValue(mapKeyPermissionToId[Permission.cudAccount]) ||
            []
          ).filter((item: Role) => value.includes(item))
        );
        break;
      }
      case Permission.cudAccount:
        form.setFieldValue(
          mapKeyPermissionToId[Permission.viewAccountManagementPage],
          Array.from(
            new Set([
              ...form.getFieldValue(
                mapKeyPermissionToId[Permission.viewAccountManagementPage]
              ),
              ...value
            ])
          )
        );
        break;

      case Permission.viewPlantCenterPage:
        {
          form.setFieldValue(
            mapKeyPermissionToId[Permission.createPlant],
            (
              form.getFieldValue(mapKeyPermissionToId[Permission.createPlant]) || []
            ).filter((item: Role) => value.includes(item))
          );
          form.setFieldValue(
            mapKeyPermissionToId[Permission.updatePlant],
            (
              form.getFieldValue(mapKeyPermissionToId[Permission.updatePlant]) || []
            ).filter((item: Role) => value.includes(item))
          );
          break;
        }
        
        
      case Permission.createPlant:
        form.setFieldValue(
          mapKeyPermissionToId[Permission.viewPlantCenterPage],
          Array.from(
            new Set([
              ...form.getFieldValue(
                mapKeyPermissionToId[Permission.viewPlantCenterPage]
              ),
              ...value
            ])
          )
        );
        break;
      
        case Permission.updatePlant:
          form.setFieldValue(
            mapKeyPermissionToId[Permission.viewPlantCenterPage],
            Array.from(
              new Set([
                ...form.getFieldValue(
                  mapKeyPermissionToId[Permission.viewPlantCenterPage]
                ),
                ...value
              ])
            )
          );
          break;

      case Permission.viewAlarmCenterPage:
        form.setFieldValue(
          mapKeyPermissionToId[Permission.updateAlarmStatus],
          (
            form.getFieldValue(
              mapKeyPermissionToId[Permission.updateAlarmStatus]
            ) || []
          ).filter((item: Role) => value.includes(item))
        );
        break;
      case Permission.updateAlarmStatus:
        form.setFieldValue(
          mapKeyPermissionToId[Permission.viewAlarmCenterPage],
          Array.from(
            new Set([
              ...form.getFieldValue(
                mapKeyPermissionToId[Permission.viewAlarmCenterPage]
              ),
              ...value
            ])
          )
        );
        break;
    }
  };

  // --------------------------//
  const generatePayloadUpdateRole = (values: Record<string, Array<Role>>) => {
    const groupPermissionSuperAdmin: Array<string> = [];
    const groupPermissionAnalyst: Array<string> = [];
    const groupPermissionTenantAdmin: Array<string> = [];
    const groupPermissionViewer: Array<string> = [];
    const groupPermissionCustomerService: Array<string> = [];

    listPermission.forEach((itemPermission) => {
      const dataPermission = values[itemPermission._id];
      if (dataPermission?.includes(Role.SUPER_ADMIN)) {
        groupPermissionSuperAdmin.push(itemPermission._id);
      }
      if (dataPermission?.includes(Role.ANALYST)) {
        groupPermissionAnalyst.push(itemPermission._id);
      }
      if (dataPermission?.includes(Role.TENANT_ADMIN)) {
        groupPermissionTenantAdmin.push(itemPermission._id);
      }
      if (dataPermission?.includes(Role.Viewer)) {
        groupPermissionViewer.push(itemPermission._id);
      }
      if (dataPermission?.includes(Role.CUSTOMER_SERVICE)) {
        groupPermissionCustomerService.push(itemPermission._id);
      }
    });

    const getGroupPermission: { [key in Role]: string[] } = {
      [Role.SUPER_ADMIN]: groupPermissionSuperAdmin,
      [Role.ANALYST]: groupPermissionAnalyst,
      [Role.TENANT_ADMIN]: groupPermissionTenantAdmin,
      [Role.Viewer]: groupPermissionViewer,
      [Role.CUSTOMER_SERVICE]: groupPermissionCustomerService
    };

    const listRole = Object.values(Role);

    const rolesPayload = listRole.map((role: Role) => {
      const id: string = listPermissionRole[role]?._id as string;
      const groups: string[] = getGroupPermission[role];
      return { id, groups };
    });

    return rolesPayload;
  };

  //------------------------------//

  const handleUpdatePermission = async (
    values: Record<string, Array<Role>>
  ) => {
    try {
      setLoading(true);
      const rolesPayload = generatePayloadUpdateRole({...formValue,...values});
      const res = await accountManagementListStore.updatePermission({
        roles: rolesPayload
      });

      if (res.responseCode === HTTP_STATUS_RESPONSE_KEY.SUCCESS) {
        message.success(t(i18nKey.validation.common.toastUpdateSuccess));
        await userService.getUserProfile();
      } else {
        message.error(t(i18nKey.validation.common.toastUpdateFail));
      }
    } finally {
      setLoading(false);
    }
  };

  const listPermissionGroupType: Array<Partial<IDataPermission> & {group?: IDataPermission[]}> = React.useMemo(() => {
    if (listPermission.length) {
      return [
        {
          _id: mapKeyPermissionToId[Permission.startStopEms],
          name: t(
            i18nKey.permissionEntity.permissionKeyToText[
              Permission.startStopEms
            ]
          ),
          key: Permission.startStopEms
        },
        {
          _id: mapKeyPermissionToId[Permission.startStopHub],
          name: t(
            i18nKey.permissionEntity.permissionKeyToText[
              Permission.startStopHub
            ]
          ),
          key: Permission.startStopHub
        },
        {
          _id: mapKeyPermissionToId[Permission.viewUserActivityLogsPage],
          name: t(
            i18nKey.permissionEntity.permissionKeyToText[
              Permission.viewUserActivityLogsPage
            ]
          ),
          key: Permission.viewUserActivityLogsPage
        },
        {
          _id: mapKeyPermissionToId[Permission.viewCommandLogPage],
          name: t(
            i18nKey.permissionEntity.permissionKeyToText[
              Permission.viewCommandLogPage
            ]
          ),
          key: Permission.viewCommandLogPage
        },
        {
          name: t(i18nKey.permissionEntity.group.controlPanelTab),
          group: permissionWithType.permissionControlPanelTab
        },
        {
          name: t(i18nKey.permissionEntity.group.serviceTab),
          group: permissionWithType.permissionServiceTab
        },
        {
          name: t(i18nKey.permissionEntity.group.settingTab),
          group: permissionWithType.permissionSettingTab
        },
        {
          name: t(i18nKey.permissionEntity.group.tenantPermission),
          group: permissionWithType.permissionTenant
        },
        {
          name: t(i18nKey.permissionEntity.group.plantPermission),
          group: permissionWithType.permissionPlant
        },
        {
          name: t(i18nKey.permissionEntity.group.alarmPermission),
          group: permissionWithType.permissionAlarm
        },
        {
          name: t(i18nKey.permissionEntity.group.accountPermission),
          group: permissionWithType.permissionAccount
        },
        
      ] as  Array<Partial<IDataPermission> & {group?: IDataPermission[]}>
    } 
    return []
  }, [listPermission, mapKeyPermissionToId,permissionWithType]);

  const listCheckedPermission = (id: string): Role[] => {
    const data: Role[] = [];
    const checkHasPermissionInRole = (
      role: Role,
      idPermission: string
    ): boolean => {
      return !!listPermissionRole[role]?.groups.find(
        (item) => item.permission._id === idPermission
      );
    };
    const hasInRoleSupperAdmin = checkHasPermissionInRole(Role.SUPER_ADMIN, id);
    const hasInRoleTenantAdmin = checkHasPermissionInRole(
      Role.TENANT_ADMIN,
      id
    );
    const hasInRoleViewer = checkHasPermissionInRole(Role.Viewer, id);
    const hasInRoleAnalyst = checkHasPermissionInRole(Role.ANALYST, id);
    const hasInRoleCustomerService = checkHasPermissionInRole(
      Role.CUSTOMER_SERVICE,
      id
    );
    if (hasInRoleSupperAdmin) {
      data.push(Role.SUPER_ADMIN);
    }
    if (hasInRoleAnalyst) {
      data.push(Role.ANALYST);
    }
    if (hasInRoleCustomerService) {
      data.push(Role.CUSTOMER_SERVICE);
    }
    if (hasInRoleTenantAdmin) {
      data.push(Role.TENANT_ADMIN);
    }
    if (hasInRoleViewer) {
      data.push(Role.Viewer);
    }

    return data;
  };
  useEffect(() => {
    const permissionGroupType: Record<TypePermission, IDataPermission[]> =
      listPermission.reduce(
        (acc: Record<TypePermission, IDataPermission[]>, permission) => {
          if (listPermissionTenant.includes(permission.key)) {
            acc.permissionTenant.push(permission);
          }
          if (listPermissionPlant.includes(permission.key)) {
            acc.permissionPlant.push(permission);
          }
          if (listPermissionServiceTab.includes(permission.key)) {
            acc.permissionServiceTab.push(permission);
          }
          if (listPermissionControlPanelTab.includes(permission.key)) {
            acc.permissionControlPanelTab.push(permission);
          }
          if (listPermissionSettingTab.includes(permission.key)) {
            acc.permissionSettingTab.push(permission);
          }
          if (listPermissionAccount.includes(permission.key)) {
            acc.permissionAccount.push(permission);
          }
          if (listPermissionAlarm.includes(permission.key)) {
            acc.permissionAlarm.push(permission);
          }
          return acc;
        },
        {
          [TypePermission.PERMISSION_ACCOUNT]: [],
          [TypePermission.PERMISSION_TENANT]: [],
          [TypePermission.PERMISSION_PLANT]: [],
          [TypePermission.PERMISSION_SERVICE_TAB]: [],
          [TypePermission.PERMISSION_CONTROL_PANEL_TAB]: [],
          [TypePermission.PERMISSION_SETTING_TAB]: [],
          [TypePermission.PERMISSION_ALARM]: []
        }
      );
    setPermissionWithType(permissionGroupType);
  }, [listPermission]);

  const generateInitFormValue = ()=>{
    return listPermission.reduce((acc: Record<string,Role[]>,permission)=>{
      acc[permission._id] = listCheckedPermission(permission._id)
      return acc;
    },{})
  }

  //set form Value
  useEffect(() => {
    form.setFieldsValue(generateInitFormValue())
    setFormValue(generateInitFormValue())
    setRerender((prev) => ++prev);
  }, [listPermission]);

  //------------------------//

  const renderTooltip = () => {
    return (
      <Tooltip title={t(i18nKey.permissionEntity.label.tooltip)}>
        <InfoCircleFilled className={styles.iconTooltip} />
      </Tooltip>
    );
  };
  const renderList = (e: IDataPermission, index: number,isGroup: boolean) => {
    return (
      <Row className={styles.permission_form_item} align={'middle'} key={e._id}>
        <Col span={5} style={{ wordBreak: 'break-word' }}>
          <b style={isGroup? {marginLeft: '13px', marginRight: '3px' }: {marginRight: '5px'}}>{`${++index}.`}</b>
          {`${t(i18nKey.permissionEntity.permissionKeyToText[e.key])}`}
        </Col>
        <Col span={19} style={{ textAlign: 'center' }}>
          <Form.Item name={e._id}>
            <Checkbox.Group
              onChange={(value) =>
                onChangeFormItem(e._id, e.key, value as Role[])
              }
              style={{ width: '100%' }}>
              <Row gutter={16} style={{ width: '100%' }}>
                <Col flex={'0 1 20%'}>
                  <Checkbox disabled value={Role.SUPER_ADMIN} />
                </Col>
                <Col flex={'0 1 20%'}>
                  <Checkbox disabled={[Permission.updatePlant,Permission.createPlant].includes(e.key)} value={Role.ANALYST} />
                </Col>
                <Col flex={'0 1 20%'}>
                  <Row justify={'center'} gutter={13}>
                    <Col style={{ position: 'relative' }}>
                      <Checkbox
                        onChange={() => setRerender((prev) => ++prev)}
                        value={Role.TENANT_ADMIN}
                      />
                      {(() => {
                        const isShowTooltip =
                          (form.getFieldValue(e._id) ?? []).includes(
                            Role.TENANT_ADMIN
                          );
                        return isShowTooltip;
                      })() && renderTooltip()}
                    </Col>
                  </Row>
                </Col>
                <Col flex={'0 1 20%'}>
                  <Row justify={'center'} gutter={13}>
                    <Col style={{ position: 'relative' }}>
                      <Checkbox
                        disabled={[Permission.updatePlant,Permission.createPlant].includes(e.key)} 
                        onChange={() => setRerender((prev) => ++prev)}
                        value={Role.Viewer}
                      />
                      {(() => {
                        const isShowTooltip =
                          (form.getFieldValue(e._id) ?? []).includes(
                            Role.Viewer
                          );
                        return isShowTooltip;
                      })() && renderTooltip()}
                    </Col>
                  </Row>
                </Col>
                <Col flex={'0 1 20%'}>
                  <Row justify={'center'} gutter={13}>
                    <Col style={{ position: 'relative' }}>
                      <Checkbox
                        onChange={() => setRerender((prev) => ++prev)}
                        value={Role.CUSTOMER_SERVICE}
                      />
                      {(() => {
                        const isShowTooltip =
                          (form.getFieldValue(e._id) ?? []).includes(
                            Role.CUSTOMER_SERVICE
                          );
                        return isShowTooltip;
                      })() && renderTooltip()}
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Checkbox.Group>
          </Form.Item>
        </Col>
      </Row>
    );
  };
  //------------------------//
  const renderList2 = (e: Partial<IDataPermission> & {group?: IDataPermission[]}, index: number) => {
    if (e?.group) {
      return (
        <Form.Item key={e.name+'b'}>
        <Collapse
          ghost
          destroyInactivePanel
          className={styles.collapse}
          expandIconPosition="end"
          items={[
            {
              key: `${e.name}a`,
              label: (
                <div>
                  <b style={{ marginRight: '3px' }}>{`${++index}.`}</b>
                  {e.name}
                </div>
              ),
              children: e.group.map((item,index)=>renderList(item,index,true))
            }
          ]}
        />
        </Form.Item>
      );
    }
    return renderList(e as IDataPermission, index,false);
  };

  return (
    <Spin spinning={loading}>
      <div className={styles.permission}>
        <div className={styles.permission_header}>
          <Row justify={'space-between'} align={'middle'}>
            <Col xs={24} sm={12} md={12} lg={12} xl={12}>
              <Typography.Title
                level={2}
                className={styles.permission_header_title}>
                {t(i18nKey.permissionEntity.title)}
              </Typography.Title>
            </Col>
            <Col xs={24} sm={12} md={12} lg={12} xl={12}>
              <Row
                gutter={16}
                justify={'end'}
                className={styles.permission_btn}>
                <Col>
                  <Button
                    type="default"
                    className={styles.permission_btn_cancel}
                    onClick={onChangeForm}>
                    {t(i18nKey.button.cancel)}
                  </Button>
                </Col>
                <Col>
                  <Button
                    type="primary"
                    className={styles.permission_btn_update}
                    disabled={disable}
                    onClick={() => {
                      form.submit();
                    }}>
                    {t(i18nKey.button.update)}
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
        <div className={styles.permission_content}>
          <Form
            form={form}
            onFinish={handleUpdatePermission}
            onValuesChange={onValueChange}
            className={styles.permission_form}>
            <Row className={styles.permission_form_header}>
              <Col style={{ wordBreak: 'break-word' }} span={5}>
                {t(i18nKey.permissionEntity.label.permissionAndRole)}
              </Col>
              <Col span={19} style={{ textAlign: 'center' }}>
                <Row gutter={16} wrap={false}>
                  <Col flex={'0 1 20%'}>
                    {t(i18nKey.permissionEntity.role.superAdmin)}
                  </Col>
                  <Col flex={'0 1 20%'}>
                    {t(i18nKey.permissionEntity.role.analyst)}
                  </Col>
                  <Col flex={'0 1 20%'}>
                    {t(i18nKey.permissionEntity.role.tenantAdmin)}
                  </Col>
                  <Col flex={'0 1 20%'}>
                    {t(i18nKey.permissionEntity.role.viewer)}
                  </Col>
                  <Col flex={'0 1 20%'}>
                    {t(i18nKey.permissionEntity.role.customerService)}
                  </Col>
                </Row>
              </Col>
            </Row>
            {/* {listPermission.map(renderList)} */}
            {listPermissionGroupType.map(renderList2)}
          </Form>
        </div>
      </div>
    </Spin>
  );
};

export default UserPermission;
