import { SearchOutlined } from '@ant-design/icons';
import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Select,
  Table,
  TablePaginationConfig,
  Typography
} from 'antd';
import { ColumnsType } from 'antd/es/table';
import { t } from 'i18next';
import moment from 'moment-timezone';
import React, { useCallback, useEffect, useState } from 'react';
import HeaderTitleContent from 'src/components/header-title-content/header-title-content';
import { ISearchValues } from 'src/components/search-option-status-role/search-component';
import TooltipParagraph from 'src/components/tooltip-paragraph/tooltip-paragraph';
import Widget from 'src/components/widget/widget';
import {
  IUserActivityLogsItem,
  IUserActivityLogsListRequest
} from 'src/dto/user-activity-logs.dto';
import useDebounce from 'src/hooks/use-debounce';
import useStore from 'src/hooks/use-store';
import { Role } from 'src/interfaces/user';
import { i18nKey } from 'src/locales/i18n';
import { IUserActivityLogsListStore } from 'src/store/user-activity-logs/user-activity-logs.store';
import styles from './user-activity-logs.module.less';
import { normalizeFormatDate } from 'src/helpers/common.utils';

enum ActivityType {
  loggedIn = 'Logged in',
  loggedOut = 'Logged out',
  activatedAccount = 'Activated Account',
  resentActivationLink = 'Resent Activation Link',
  requestedPasswordReset = 'Requested Password Reset',
  createdAccount = 'Created Account',
  updatedAccount = 'Updated Account',
  createdTenant = 'Created Tenant',
  updatedTenant = 'Updated Tenant',
  autoUpdatedOfTenantStatus = 'Auto-updated of Tenant Status',
  deleteTenant = 'Deleted Tenant',
  createPlant = 'Created Plant',
  updatedPlant = 'Updated Plant',
  autoUpdatedOfPlantStatus = 'Auto-updated of Plant Status',
  deletedPlant = 'Deleted Plant',
  createdEMS = 'Created EMS',
  updatedEMS = 'Updated EMS',
  autoUpdatedOfEMSStatus = 'Auto-updated of EMS Status',
  deletedEMS = 'Deleted EMS',
  updatedAlarm = 'Updated Alarm',
  receivedAlarm = 'Received Alarm',
  commandExecutionResult = 'Command Execution Result',
  updatedRolePermission = 'Updated Role/Permission'
}

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

const optionActivityType = [
  {
    label: `${t(i18nKey.userActivityLogs.activity.loggedIn)}`,
    value: ActivityType.loggedIn,
    key: ActivityType.loggedIn
  },
  {
    label: `${t(i18nKey.userActivityLogs.activity.loggedOut)}`,
    value: ActivityType.loggedOut,
    key: ActivityType.loggedOut
  },
  {
    label: `${t(i18nKey.userActivityLogs.activity.activatedAccount)}`,
    value: ActivityType.activatedAccount,
    key: ActivityType.activatedAccount
  },
  {
    label: `${t(i18nKey.userActivityLogs.activity.requestedPasswordReset)}`,
    value: ActivityType.requestedPasswordReset,
    key: ActivityType.requestedPasswordReset
  },
  {
    label: `${t(i18nKey.userActivityLogs.activity.resentActivationLink)}`,
    value: ActivityType.resentActivationLink,
    key: ActivityType.resentActivationLink
  },
  {
    label: `${t(i18nKey.userActivityLogs.activity.createdAccount)}`,
    value: ActivityType.createdAccount,
    key: ActivityType.createdAccount
  },
  {
    label: `${t(i18nKey.userActivityLogs.activity.updatedAccount)}`,
    value: ActivityType.updatedAccount,
    key: ActivityType.updatedAccount
  },
  {
    label: `${t(i18nKey.userActivityLogs.activity.createPlant)}`,
    value: ActivityType.createPlant,
    key: ActivityType.createPlant
  },
  {
    label: `${t(i18nKey.userActivityLogs.activity.updatedPlant)}`,
    value: ActivityType.updatedPlant,
    key: ActivityType.updatedPlant
  },
  {
    label: `${t(i18nKey.userActivityLogs.activity.autoUpdatedOfPlantStatus)}`,
    value: ActivityType.autoUpdatedOfPlantStatus,
    key: ActivityType.autoUpdatedOfPlantStatus
  },
  {
    label: `${t(i18nKey.userActivityLogs.activity.deletedPlant)}`,
    value: ActivityType.deletedPlant,
    key: ActivityType.deletedPlant
  },
  {
    label: `${t(i18nKey.userActivityLogs.activity.createdEMS)}`,
    value: ActivityType.createdEMS,
    key: ActivityType.createdEMS
  },
  {
    label: `${t(i18nKey.userActivityLogs.activity.updatedEMS)}`,
    value: ActivityType.updatedEMS,
    key: ActivityType.updatedEMS
  },
  {
    label: `${t(i18nKey.userActivityLogs.activity.autoUpdatedOfEMSStatus)}`,
    value: ActivityType.autoUpdatedOfEMSStatus,
    key: ActivityType.autoUpdatedOfEMSStatus
  },
  {
    label: `${t(i18nKey.userActivityLogs.activity.deletedEMS)}`,
    value: ActivityType.deletedEMS,
    key: ActivityType.deletedEMS
  },
  {
    label: `${t(i18nKey.userActivityLogs.activity.updatedAlarm)}`,
    value: ActivityType.updatedAlarm,
    key: ActivityType.updatedAlarm
  },
  {
    label: `${t(i18nKey.userActivityLogs.activity.receivedAlarm)}`,
    value: ActivityType.receivedAlarm,
    key: ActivityType.receivedAlarm
  },
  {
    label: `${t(i18nKey.userActivityLogs.activity.commandExecutionResult)}`,
    value: ActivityType.commandExecutionResult,
    key: ActivityType.commandExecutionResult
  },
  {
    label: `${t(i18nKey.userActivityLogs.activity.updatedRolePermission)}`,
    value: ActivityType.updatedRolePermission,
    key: ActivityType.updatedRolePermission
  }
];

export enum ActivityDESCKey {
  status = 'status',
  firstName = 'first_name',
  lastName = 'last_name',
  name = 'name',
  information = 'information',
  role = 'role',
  tenant = 'Tenant',
  plant = 'Plant',
  user = 'User',
  location = 'Location',
  remove = 'REMOVE',
  add = 'ADD',
  newValue = 'newValue',
  ems = 'EMS',
  certificate = 'Certificate',
  tenant_name = 'tenant_name',
  active = 'active',
  inactive = 'inactive',
  password = 'password'
}
const UserActivityLogs: React.FC = () => {
  const [searchFields, setSearchFields] =
    useState<IUserActivityLogsListRequest | null>(null);
  const [form] = Form.useForm();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [loading, setLoading] = useState(false);
  const debouncedValue = useDebounce<string | undefined>(searchFields?.q, 1000);
  const dataActivity: IUserActivityLogsListStore = useStore(
    'userActivityLogsStore'
  );
  const fetchDataUserActivityList = async (
    request?: IUserActivityLogsListRequest
  ) => {
    setLoading(true);
    try {
      await dataActivity.fetchList(request);
      setLoading(false);
    } catch (error) {
      throw Error;
    }
  };
  useEffect(() => {
    fetchDataUserActivityList({
      ...searchFields,
      page: pageNumber,
      limit: pageSize
    });
  }, [pageNumber, pageSize]);

  useEffect(() => {
    fetchDataUserActivityList({
      ...searchFields,
      page: 1,
      limit: pageSize
    });
    setPageNumber(1);
  }, [searchFields?.role, searchFields?.type, debouncedValue]);

  const handleChangeFormSearch = useCallback(
    (valueChange: Partial<ISearchValues>) => {
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

  const handleResetSearch = () => {
    if (
      debouncedValue !== undefined ||
      searchFields?.role !== undefined ||
      searchFields?.type !== undefined
    ) {
      form.resetFields();
      setSearchFields({
        q: '',
        role: undefined,
        type: undefined
      });
      setPageNumber(1);
    }
  };

  const handleCaseUpdatedAccount = (record: IUserActivityLogsItem) => {
    const { action_by, target_object } = record;
    switch (true) {
      case action_by?._id !== target_object.info.id &&
        ActivityDESCKey.status in target_object.newValue &&
        ActivityDESCKey.status in target_object.oldValue:
        return t(
          i18nKey.userActivityLogs.activity.updatedAccountDESC1(
            target_object.info?.email,
            target_object.newValue.status,
            target_object.oldValue.status
          )
        );
      case action_by?._id !== target_object.info.id &&
        ActivityDESCKey.role in target_object.newValue &&
        ActivityDESCKey.role in target_object.oldValue:
        return t(
          i18nKey.userActivityLogs.activity.updatedAccountDESC2(
            target_object.info?.email,
            target_object.newValue.role,
            target_object.oldValue.role
          )
        );
      case action_by?._id !== target_object.info.id:
        return t(
          i18nKey.userActivityLogs.activity.updatedAccountDESC3(
            target_object.info?.email,
            target_object.newValue?.first_name,
            target_object.newValue?.phone_number
          )
        );
      case action_by?._id === target_object.info.id &&
        ActivityDESCKey.password in target_object.newValue &&
        ActivityDESCKey.password in target_object.oldValue:
        return t(i18nKey.userActivityLogs.activity.updatedAccountDESC4);

      default:
        return t(
          i18nKey.userActivityLogs.activity.updatedAccountDESC5(
            target_object.newValue.first_name,
            target_object.newValue?.phone_number,
            target_object.newValue?.avatar
          )
        );
    }
  };

  const handleCreatedTenant = (record: IUserActivityLogsItem) => {
    const { related_object, target_object } = record;
    switch (true) {
      case related_object === null &&
        target_object.type === ActivityDESCKey.tenant:
        return t(
          i18nKey.userActivityLogs.activity.createdTenantDESC1(
            target_object?.info?.name
          )
        );
      case related_object?.type === ActivityDESCKey.tenant &&
        target_object.type === ActivityDESCKey.plant:
        return t(
          i18nKey.userActivityLogs.activity.createdTenantDESC2(
            target_object?.info?.name,
            related_object?.info?.name
          )
        );
      case related_object?.type === ActivityDESCKey.tenant &&
        target_object.type === ActivityDESCKey.user:
        return t(
          i18nKey.userActivityLogs.activity.createdTenantDESC3(
            target_object?.info?.email,
            related_object?.info?.name
          )
        );
      default:
        return t(
          i18nKey.userActivityLogs.activity.createdTenantDESC4(
            target_object?.info?.email,
            related_object?.info?.name
          )
        );
    }
  };

  const handleUpdatedTenant = (record: IUserActivityLogsItem) => {
    const { related_object, target_object } = record;
    switch (true) {
      case related_object === null &&
        ((ActivityDESCKey.name in target_object.newValue &&
          ActivityDESCKey.name in target_object.oldValue) ||
          (ActivityDESCKey.information in target_object.newValue &&
            ActivityDESCKey.information in target_object.oldValue)):
        return t(
          i18nKey.userActivityLogs.activity.updatedTenantDESC1(
            target_object?.info?.name,
            target_object.oldValue.name,
            target_object.newValue.name,
            target_object.newValue.information
          )
        );
      case related_object?.type === ActivityDESCKey.tenant &&
        target_object.type === ActivityDESCKey.plant &&
        target_object.info.action === ActivityDESCKey.remove:
        return t(
          i18nKey.userActivityLogs.activity.updatedTenantDESC3(
            related_object?.info?.name,
            target_object.info.name
          )
        );
      case related_object?.type === ActivityDESCKey.tenant &&
        target_object.type === ActivityDESCKey.plant &&
        target_object.info.action === ActivityDESCKey.add:
        return t(
          i18nKey.userActivityLogs.activity.updatedTenantDESC4(
            related_object?.info?.name,
            target_object.info.name
          )
        );
      case related_object?.type === ActivityDESCKey.tenant &&
        target_object.type === ActivityDESCKey.user &&
        target_object.info.action === ActivityDESCKey.add:
        return t(
          i18nKey.userActivityLogs.activity.updatedTenantDESC5(
            target_object?.info?.email,
            related_object?.info.name
          )
        );
      case related_object?.type === ActivityDESCKey.plant &&
        target_object.type === ActivityDESCKey.user &&
        target_object.info.action === ActivityDESCKey.add:
        return t(
          i18nKey.userActivityLogs.activity.updatedTenantDESC6(
            target_object?.info?.email,
            related_object?.info.name
          )
        );
      case related_object?.type === ActivityDESCKey.plant &&
        target_object.type === ActivityDESCKey.user &&
        target_object.info.action === ActivityDESCKey.remove:
        return t(
          i18nKey.userActivityLogs.activity.updatedTenantDESC8(
            target_object?.info?.email,
            related_object?.info.name
          )
        );
      default:
        return t(
          i18nKey.userActivityLogs.activity.updatedTenantDESC7(
            target_object?.info?.email,
            related_object?.info.name
          )
        );
    }
  }; 
  
  const handleCreatedPlant = (record: IUserActivityLogsItem) => {
    const {  related_object, target_object } = record;
    switch(target_object.info.action){
      case 'CREATED': return t(i18nKey.notifications.notificationApp.createPlant,{
        insertPlantName: related_object?.info.name
      })
      case 'ADD_VIEWER': return  t(i18nKey.notifications.notificationApp.createPlantAssignedAsTheViewOfPlant,{
        insertPlantName: related_object?.info.name,
        insertEmail: target_object.info.email

      })
      case 'ADD_OWNER': return t(i18nKey.notifications.notificationApp.createTenantOwnerOfPlant,{
        insertPlantName: related_object?.info.name,
        insertEmail: target_object.info.email
      })
      default: return '-'
    }
    // const { related_object, target_object } = record;
    // switch (true) {
    //   case related_object === null &&
    //     target_object.type === ActivityDESCKey.plant:
    //     return t(
    //       i18nKey.userActivityLogs.activity.createPlantDESC1(
    //         target_object?.info?.name
    //       )
    //     );
    //   case related_object?.type === ActivityDESCKey.tenant &&
    //     target_object.type === ActivityDESCKey.plant:
    //     return t(
    //       i18nKey.userActivityLogs.activity.createPlantDESC2(
    //         target_object?.info?.name,
    //         related_object?.info?.name
    //       )
    //     );
    //   case related_object?.type === ActivityDESCKey.plant &&
    //     target_object.type === ActivityDESCKey.user:
    //     return t(
    //       i18nKey.userActivityLogs.activity.createPlantDESC3(
    //         target_object?.info?.email,
    //         related_object?.info?.name
    //       )
    //     );
    //   default:
    //     return t(
    //       i18nKey.userActivityLogs.activity.createPlantDESC4(
    //         target_object?.info?.email,
    //         related_object?.info?.name
    //       )
    //     );
    // }
  };

  const handleUpdatePlant = (record: IUserActivityLogsItem) => {
    const { related_object, target_object } = record;
    if(['inactive','active'].includes(`${target_object?.newValue?.status}`)){
      return (t(i18nKey.notifications.notificationApp.autoUpdatedOfPlantStatus,{
        insertOldStatus: target_object?.oldValue?.status,
        insertNewStatus: target_object.newValue?.status,
        insertPlantName: target_object?.info?.name
      }))
    }
    switch (true) {
      case related_object === null &&
        target_object.type === ActivityDESCKey.plant &&
        ActivityDESCKey.name in target_object.newValue &&
        ActivityDESCKey.name in target_object.oldValue:
        return t(
          i18nKey.userActivityLogs.activity.updatedPlantDESC1(
            target_object?.info?.name,
            target_object.oldValue.name,
            target_object.newValue.name
          )
        );
      case related_object === null &&
        target_object.type === ActivityDESCKey.plant &&
        ActivityDESCKey.tenant_name in target_object.newValue:
        return t(
          i18nKey.userActivityLogs.activity.updatedPlantDESC2(
            target_object?.info?.name,
            target_object.newValue.tenant_name
          )
        );

      case related_object?.type === ActivityDESCKey.plant &&
        target_object.type === ActivityDESCKey.location &&
        ActivityDESCKey.newValue in target_object &&
        ActivityDESCKey.name in target_object.newValue &&
        ActivityDESCKey.name in target_object.oldValue:
        return t(
          i18nKey.userActivityLogs.activity.updatedPlantDESC3(
            related_object?.info?.name,
            target_object.oldValue?.name,
            target_object.newValue?.name
          )
        );
      case related_object?.type === ActivityDESCKey.plant &&
        target_object.type === ActivityDESCKey.location &&
        target_object.info.action === ActivityDESCKey.add:
        return t(
          i18nKey.userActivityLogs.activity.updatedPlantDESC5(
            related_object?.info?.name,
            target_object.info.name
          )
        );
      case related_object?.type === ActivityDESCKey.plant &&
        target_object.type === ActivityDESCKey.location &&
        target_object.info.action === ActivityDESCKey.remove:
        return t(
          i18nKey.userActivityLogs.activity.updatedPlantDESC6(
            related_object?.info?.name,
            target_object.info.name
          )
        );
      case related_object?.type === ActivityDESCKey.location &&
        target_object.type === ActivityDESCKey.ems &&
        target_object.info.action === ActivityDESCKey.remove:
        return t(
          i18nKey.userActivityLogs.activity.updatedPlantDESC7(
            related_object?.info?.plant_name,
            target_object.info.name,
            related_object?.info.name
          )
        );
      case related_object?.type === ActivityDESCKey.location &&
        target_object.type === ActivityDESCKey.ems &&
        target_object.info.action === ActivityDESCKey.add:
        return t(
          i18nKey.userActivityLogs.activity.updatedPlantDESC8(
            related_object?.info?.plant_name,
            target_object.info.name,
            related_object?.info.name
          )
        );
      case related_object?.type === ActivityDESCKey.plant &&
        target_object.type === ActivityDESCKey.user &&
        target_object.info.action === ActivityDESCKey.add:
        return t(
          i18nKey.userActivityLogs.activity.updatedPlantDESC9(
            target_object?.info?.email,
            related_object?.info.name
          )
        );
      case related_object?.type === ActivityDESCKey.location &&
        target_object.type === ActivityDESCKey.user &&
        target_object.info.action === ActivityDESCKey.add:
        return t(
          i18nKey.userActivityLogs.activity.updatedPlantDESC10(
            target_object?.info?.email,
            related_object?.info.name
          )
        );
      case related_object?.type === ActivityDESCKey.plant &&
        target_object.type === ActivityDESCKey.user &&
        target_object.info.action === ActivityDESCKey.remove:
        return t(
          i18nKey.userActivityLogs.activity.updatedPlantDESC11(
            target_object?.info?.email,
            related_object?.info.name
          )
        );
      case related_object?.type === ActivityDESCKey.location &&
        target_object.type === ActivityDESCKey.user &&
        target_object.info.action === ActivityDESCKey.remove:
        return t(
          i18nKey.userActivityLogs.activity.updatedPlantDESC12(
            target_object?.info?.email,
            related_object?.info.name
          )
        );
      default:
        return t(
          i18nKey.userActivityLogs.activity.updatedPlantDESC4(
            related_object?.info.name,
            target_object?.info?.name,
            target_object.oldValue?.address,
            target_object.newValue?.address
          )
        );
    }
  };

  const handleCreatedEMS = (record: IUserActivityLogsItem) => {
    const { related_object, target_object } = record;
    switch (true) {
      case related_object === null &&
        target_object.type === ActivityDESCKey.ems:
        return t(
          i18nKey.userActivityLogs.activity.createdEMSDESC1(
            target_object?.info?.name
          )
        );
      default:
        return t(
          i18nKey.userActivityLogs.activity.createdEMSDESC2(
            target_object?.info?.name,
            related_object?.info?.tenant_name,
            related_object?.info.plant_name,
            related_object?.info.name
          )
        );
    }
  };
  const handleUpdateEMS = (record: IUserActivityLogsItem) => {
    const { related_object, target_object } = record;
    switch (true) {
      case related_object === null &&
        target_object.type === ActivityDESCKey.ems &&
        ActivityDESCKey.name in target_object.newValue &&
        ActivityDESCKey.name in target_object.oldValue:
        return t(
          i18nKey.userActivityLogs.activity.updatedEMSDESC1(
            target_object?.info?.name,
            target_object.oldValue.name,
            target_object.newValue.name
          )
        );
      case related_object?.type === ActivityDESCKey.ems &&
        target_object.type === ActivityDESCKey.certificate:
        return t(
          i18nKey.userActivityLogs.activity.updatedEMSDESC3(
            related_object?.info?.name
          )
        );
      default:
        return t(
          i18nKey.userActivityLogs.activity.updatedEMSDESC2(
            related_object?.info?.name
          )
        );
    }
  };

  const handleAutoUpdatedOfEMSStatus = (record: IUserActivityLogsItem) => {
    const { action_by, target_object } = record;
    switch (true) {
      case action_by !== null &&
        target_object.type === ActivityDESCKey.ems &&
        target_object.newValue.status === ActivityDESCKey.active &&
        target_object.oldValue.status === ActivityDESCKey.inactive:
        return t(
          i18nKey.userActivityLogs.activity.autoUpdatedOfEMSStatusDESC3(
            target_object?.info?.name
          )
        );
      case action_by !== null &&
        target_object.type === ActivityDESCKey.ems &&
        target_object.newValue.status === ActivityDESCKey.inactive &&
        target_object.oldValue.status === ActivityDESCKey.active:
        return t(
          i18nKey.userActivityLogs.activity.autoUpdatedOfEMSStatusDESC2(
            target_object?.info?.name
          )
        );
      default:
        return t(
          i18nKey.userActivityLogs.activity.autoUpdatedOfEMSStatusDESC1(
            target_object?.info?.name,
            target_object.newValue.status,
            target_object.oldValue.status
          )
        );
    }
  };

  const transferActivityDescription = (record: IUserActivityLogsItem) => {
    const { action_type, related_object, target_object } = record;
    switch (action_type?.toLowerCase()) {
      case ActivityType.loggedIn.toLowerCase():
        return t(i18nKey.userActivityLogs.activity.loggedInDESC);
      case ActivityType.loggedOut.toLowerCase():
        return t(i18nKey.userActivityLogs.activity.loggedOutDESC);
      case ActivityType.activatedAccount.toLowerCase():
        return t(i18nKey.userActivityLogs.activity.activatedAccountDESC);
      case ActivityType.resentActivationLink.toLowerCase():
        return t(
          i18nKey.userActivityLogs.activity.resentActivationLinkDESC(
            target_object?.info?.email
          )
        );
      case ActivityType.createdAccount.toLowerCase():
        return t(
          i18nKey.userActivityLogs.activity.createdAccountDESC(
            target_object.info.email
          )
        );
      case ActivityType.updatedAccount.toLowerCase():
        return handleCaseUpdatedAccount(record);
      case ActivityType.createdTenant.toLowerCase():
        return handleCreatedTenant(record);
      case ActivityType.updatedTenant.toLowerCase():
        return handleUpdatedTenant(record);
      case ActivityType.autoUpdatedOfTenantStatus.toLowerCase():
        return t(
          i18nKey.userActivityLogs.activity.autoUpdatedOfTenantStatusDESC(
            target_object?.info?.name,
            target_object?.oldValue.status,
            target_object?.newValue.status
          )
        );
      case ActivityType.deleteTenant.toLowerCase():
        return t(
          i18nKey.userActivityLogs.activity.deleteTenantDESC(
            target_object?.info?.name
          )
        );
      case ActivityType.createPlant.toLowerCase():
        return handleCreatedPlant(record);

      case ActivityType.updatedPlant.toLowerCase():
        return handleUpdatePlant(record);

      case ActivityType.autoUpdatedOfPlantStatus.toLowerCase():
        return t(
          i18nKey.userActivityLogs.activity.autoUpdatedOfPlantStatusDESC(
            target_object?.info?.name,
            target_object?.oldValue.status,
            target_object?.newValue.status
          )
        );
      case ActivityType.deletedPlant.toLowerCase():
        return t(
          i18nKey.userActivityLogs.activity.deletedPlantDESC(
            target_object?.info?.name
          )
        );
      case ActivityType.createdEMS.toLowerCase():
        return handleCreatedEMS(record);

      case ActivityType.updatedEMS.toLowerCase():
        return handleUpdateEMS(record);

      case ActivityType.autoUpdatedOfEMSStatus.toLowerCase():
        return handleAutoUpdatedOfEMSStatus(record);

      case ActivityType.deletedEMS.toLowerCase():
        return t(
          i18nKey.userActivityLogs.activity.deletedEMSDESC(
            target_object?.info?.name
          )
        );
      case ActivityType.updatedAlarm.toLowerCase():
        return t(
          i18nKey.userActivityLogs.activity.updatedAlarmDESC(
            target_object?.info?.id as string,
            target_object?.oldValue?.status,
            target_object?.newValue?.status,
            target_object?.newValue?.notes
          )
        );
      case ActivityType.receivedAlarm.toLowerCase():
        return t(
          i18nKey.userActivityLogs.activity.receivedAlarmDESC(
            target_object?.info.id,
            target_object.info.system_state,
            target_object?.info?.description
          )
        );
      case ActivityType.commandExecutionResult.toLowerCase():
        return t(
          i18nKey.userActivityLogs.activity.commandExecutionResultDESC(
            target_object?.info?.name,
            target_object?.info?.level === 'cell-driver'? 'Cell Driver': 'Plant',
            related_object?.info?.tenant_name,
            related_object?.info?.plant_name,
            related_object?.info?.location_name,
            target_object?.info.status
          )
        );
      case ActivityType.updatedRolePermission.toLowerCase():
        return t(
          i18nKey.userActivityLogs.activity.updatedRolePermissionDESC(
            related_object?.info?.name,
            target_object?.oldValue?.permissions?.map(
              (item) => ' ' + item.name
            ) as string[],
            target_object?.newValue?.permissions?.map(
              (item) => ' ' + item.name
            ) as string[]
          )
        );
      default:
        return;
    }
  };

  const columns: ColumnsType<IUserActivityLogsItem> = [
    {
      title: `${t(i18nKey.label.timestamp)}`,
      key: 'createdOn',
      dataIndex: 'createdOn',
      width: '15%',
      sorter: (a, b) => moment(a.createdOn).unix() - moment(b.createdOn).unix(),
      render: (value: string) => normalizeFormatDate(value)
    },

    {
      title: `${t(i18nKey.label.email)}`,
      width: '15%',
      render: (record: IUserActivityLogsItem) => (
        <div className={styles.column}>
          <Typography className={styles.columnsText}>
            <TooltipParagraph>
              {record?.action_by?.email ? record?.action_by?.email : '-'}
            </TooltipParagraph>
          </Typography>
        </div>
      )
    },
    {
      title: `${t(i18nKey.label.role)}`,
      width: '15%',
      render: (record: IUserActivityLogsItem) => (
        <div className={styles.column}>
          <Typography className={styles.columnsText}>
            <TooltipParagraph>
              {record?.action_by?.role?.name
                ? record?.action_by?.role?.name
                : '-'}
            </TooltipParagraph>
          </Typography>
        </div>
      )
    },

    {
      title: `${t(i18nKey.userActivityLogs.label.activityType)}`,
      width: '15%',
      render: (record: IUserActivityLogsItem) => (
        <div className={styles.column}>
          <Typography className={styles.columnsText}>
            <TooltipParagraph>{record?.action_type}</TooltipParagraph>
          </Typography>
        </div>
      )
    },

    {
      title: `${t(i18nKey.userActivityLogs.label.activityDescription)}`,
      render: (record: IUserActivityLogsItem) => (
        <div
          className={styles.columnsText}
          dangerouslySetInnerHTML={{
            __html: transferActivityDescription(record) || ''
          }}
        />
      )
    }
  ];

  const onTableChange = async (pagination: TablePaginationConfig) => {
    setPageNumber(pagination.current as number);
    setPageSize(pagination.pageSize as number);
  };

  const renderSearch = () => {
    return (
      <div>
        <Form onValuesChange={handleChangeFormSearch} form={form}>
          <Row gutter={{xs:5,sm: 10}}>
            <Col 
              xs={24}
              sm={24}
              md={24}
              lg={18}
              xl={11}
              xxl={8}
              className={styles.wrapSearchInput}>
              <Form.Item name="q">
                <Input
                  prefix={<SearchOutlined />}
                  placeholder={`${t(
                    i18nKey.userActivityLogs.placeholder.search
                  )}`}
                  allowClear
                />
              </Form.Item>
            </Col>
            <Col xs={0} sm={0} lg={3} xl={0}/>

            <Col xs={9} sm={10} md={9} lg={7} xl={5} xxl={4}>
              <Form.Item
                style={{ width: '100%' }}
                name={'role'}
                className={styles.wrapOptionSearch}>
                <Select
                  placeholder={`${t(i18nKey.label.role)}`}
                  options={optionRole}
                  popupMatchSelectWidth={150}
                  allowClear
                />
              </Form.Item>
            </Col>

            <Col xs={10} sm={10} md={11} lg={9} xl={6} xxl={5}>
              <Form.Item
                style={{ width: '100%' }}
                name={'type'}
                className={styles.wrapOptionSearch}>
                <Select
                  placeholder={`${t(
                    i18nKey.userActivityLogs.label.activityType
                  )}`}
                  options={optionActivityType}
                  popupMatchSelectWidth={240}
                  allowClear
                  showSearch
                />
              </Form.Item>
            </Col>

            <Col xs={5} sm={4} md={4} lg={3} xl={2} xxl={2}>
              <Form.Item>
                <Button onClick={handleResetSearch}>
                  {t(i18nKey.button.reset)}
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    );
  };
  return (
    <div className={styles.wrapper}>
      <HeaderTitleContent
        title={`${t(i18nKey.menu.userActivityLogs)}`}></HeaderTitleContent>
      <Widget>
        {renderSearch()}
        <div className={styles.wrapperTable}>
          <Table
            className={styles.tableManagement}
            dataSource={dataActivity.listUser}
            columns={columns}
            rowKey={'_id'}
            loading={loading}
            pagination={{
              showTotal: (total) =>
                `${t(i18nKey.button.totalEntries, {
                  totalEntries: `${total}`
                })}`,
              pageSize: pageSize,
              current: pageNumber,
              total: dataActivity.totalPages
            }}
            size="middle"
            scroll={{ x: 1500 }}
            onChange={onTableChange}
          />
        </div>
      </Widget>
    </div>
  );
};

export default UserActivityLogs;
