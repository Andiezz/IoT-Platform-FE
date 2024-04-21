import React from 'react';
import type { MenuProps } from 'antd';
import { useTranslation } from 'react-i18next';
import { i18nKey } from 'src/locales/i18n';
import { PAGE_ROUTE } from 'src/constants/route';
import { ReactComponent as DashboardIcon } from 'src/assets/icons/Dashboard-default.svg';
import { ReactComponent as DashboardIconActive } from 'src/assets/icons/Dashboard-active.svg';
import { ReactComponent as AlarmIcon } from 'src/assets/icons/Alarm-default.svg';
import { ReactComponent as AlarmIconActive } from 'src/assets/icons/Alarm-active.svg';
import { ReactComponent as TenantIcon } from 'src/assets/icons/Tenant-default.svg';
import { ReactComponent as TenantIconActive } from 'src/assets/icons/Tenant-active.svg';
import { ReactComponent as AccountManagement } from 'src/assets/icons/People-icon.svg';
import { ReactComponent as AccountManagementActive } from 'src/assets/icons/People-icon-active.svg';
import { ReactComponent as PlantIcon } from 'src/assets/icons/Plant-default.svg';
import { ReactComponent as PlantIconActive } from 'src/assets/icons/Plant-active.svg';
import { ReactComponent as SystemIcon } from 'src/assets/icons/Setting-default.svg';
import { ReactComponent as SystemIconActive } from 'src/assets/icons/Setting-active.svg';
import { ReactComponent as PermissionIcon } from 'src/assets/icons/User-permission.svg';
import { ReactComponent as PermissionIconActive } from 'src/assets/icons/User-permission-active.svg';
import { ReactComponent as CommandLogsIcon } from 'src/assets/icons/Command-logs.svg';
import { ReactComponent as CommandLogsIconActive } from 'src/assets/icons/Command-logs-active.svg';
import { ReactComponent as UserLogsIcon } from 'src/assets/icons/User-activity.svg';
import { ReactComponent as UserLogsIconActive } from 'src/assets/icons/User-activity-active.svg';
import { useNavigate, useMatch, useLocation } from 'react-router-dom';
import { Permission } from 'src/constants/user';
import { ITenantListStore } from 'src/store/tenant/tenant-list.store';
import useStore from './use-store';

export type MenuItem = Required<MenuProps>['items'][number];

const useMenuItem = () => {
  const location = useLocation();
  const [t] = useTranslation();
  const navigator = useNavigate();
  const tenantListStore: ITenantListStore = useStore('listTenantStore');

  const menu: MenuItem[] = [
    {
      label: t(i18nKey.menu.dashboard),
      key: PAGE_ROUTE.DASHBOARD,
      icon:
        useMatch(PAGE_ROUTE.DASHBOARD) ||
        location.pathname.includes('overview') ? (
          <DashboardIconActive />
        ) : (
          <DashboardIcon />
        ),
      onClick: () => {
        navigator(
          `${PAGE_ROUTE.DASHBOARD}overview/tenant/${tenantListStore.currentTenantId || tenantListStore?.listTenantAccount[0]?._id}`
        );
      }
    } as MenuItem,
    {
      label: t(i18nKey.menu.alarmCenter),
      key: PAGE_ROUTE.DASHBOARD_ALARM,
      icon: useMatch(PAGE_ROUTE.DASHBOARD_ALARM) ? (
        <AlarmIconActive />
      ) : (
        <AlarmIcon />
      ),
      onClick: () => navigator(PAGE_ROUTE.DASHBOARD_ALARM),
      requiredPermission: [Permission.viewAlarmCenterPage]
    } as MenuItem,
    {
      label: t(i18nKey.menu.tenantCenter),
      key: PAGE_ROUTE.DASHBOARD_TENANT,
      icon: useMatch(PAGE_ROUTE.DASHBOARD_TENANT) ? (
        <TenantIconActive />
      ) : (
        <TenantIcon />
      ),
      onClick: () => navigator(PAGE_ROUTE.DASHBOARD_TENANT),
      requiredPermission: [Permission.viewTenantCenterPage]
    } as MenuItem,
    {
      label: t(i18nKey.menu.plantCenter),
      key: PAGE_ROUTE.DASHBOARD_PLANT,
      icon: useMatch(PAGE_ROUTE.DASHBOARD_PLANT) ? (
        <PlantIconActive />
      ) : (
        <PlantIcon />
      ),
      onClick: () => navigator(PAGE_ROUTE.DASHBOARD_PLANT),
      requiredPermission: [Permission.viewPlantCenterPage]
    } as MenuItem,
    {
      label: t(i18nKey.menu.systemManagement),
      key: PAGE_ROUTE.DASHBOARD_SYSTEM,
      icon:
        location.pathname.includes(PAGE_ROUTE.USER_ACTIVITY_LOGS) ||
        location.pathname.includes(PAGE_ROUTE.COMMAND_LOGS) ||
        location.pathname.includes(PAGE_ROUTE.ACCOUNT_MANAGEMENT) ||
        location.pathname.includes(PAGE_ROUTE.USER_PERMISSION) ? (
          <SystemIconActive />
        ) : (
          <SystemIcon />
        ),
      requiredPermission: [
        Permission.viewAndUpdateUsersAndPermissionsPage,
        Permission.viewCommandLogPage,
        Permission.viewAccountManagementPage
      ],
      children: [
        {
          label: t(i18nKey.menu.userActivityLogs),
          key: PAGE_ROUTE.USER_ACTIVITY_LOGS,
          icon: useMatch(PAGE_ROUTE.USER_ACTIVITY_LOGS) ? (
            <UserLogsIconActive />
          ) : (
            <UserLogsIcon />
          ),
          onClick: () => navigator(PAGE_ROUTE.USER_ACTIVITY_LOGS),
          requiredPermission: [Permission.viewUserActivityLogsPage]
        },

        {
          label: t(i18nKey.menu.commandLogs),
          key: PAGE_ROUTE.COMMAND_LOGS,
          icon: useMatch(PAGE_ROUTE.COMMAND_LOGS) ? (
            <CommandLogsIconActive />
          ) : (
            <CommandLogsIcon />
          ),
          onClick: () => navigator(PAGE_ROUTE.COMMAND_LOGS),
          requiredPermission: [Permission.viewCommandLogPage]
        },
        {
          label: t(i18nKey.menu.accountManagement),
          key: PAGE_ROUTE.ACCOUNT_MANAGEMENT,
          icon: useMatch(PAGE_ROUTE.ACCOUNT_MANAGEMENT) ? (
            <AccountManagementActive />
          ) : (
            <AccountManagement />
          ),
          onClick: () => navigator(PAGE_ROUTE.ACCOUNT_MANAGEMENT),
          requiredPermission: [Permission.viewAccountManagementPage]
        },
        {
          label: t(i18nKey.menu.rolesAndPermissions),
          key: PAGE_ROUTE.USER_PERMISSION,
          icon: useMatch(PAGE_ROUTE.USER_PERMISSION) ? (
            <PermissionIconActive />
          ) : (
            <PermissionIcon />
          ),
          onClick: () => navigator(PAGE_ROUTE.USER_PERMISSION),
          requiredPermission: [Permission.viewAndUpdateUsersAndPermissionsPage]
        }
      ]
    } as MenuItem
  ];

  return menu;
};

export default useMenuItem;
