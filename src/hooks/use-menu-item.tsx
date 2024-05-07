import React from 'react';
import type { MenuProps } from 'antd';
import { useTranslation } from 'react-i18next';
import { i18nKey } from 'src/locales/i18n';
import { PAGE_ROUTE } from 'src/constants/route';
import { ReactComponent as DashboardIcon } from 'src/assets/icons/Dashboard-default.svg';
import { ReactComponent as DashboardIconActive } from 'src/assets/icons/Dashboard-active.svg';
import { ReactComponent as AccountManagement } from 'src/assets/icons/People-icon.svg';
import { ReactComponent as AccountManagementActive } from 'src/assets/icons/People-icon-active.svg';
import { ReactComponent as ThingIcon } from 'src/assets/icons/thing-default.svg';
import { ReactComponent as ThingIconActive } from 'src/assets/icons/thing-active.svg';
import { ReactComponent as SystemIcon } from 'src/assets/icons/Setting-default.svg';
import { ReactComponent as SystemIconActive } from 'src/assets/icons/Setting-active.svg';
import { ReactComponent as UserLogsIcon } from 'src/assets/icons/User-activity.svg';
import { ReactComponent as UserLogsIconActive } from 'src/assets/icons/User-activity-active.svg';
import { useMatch, useLocation, useNavigate } from 'react-router-dom';

export type MenuItem = Required<MenuProps>['items'][number];

const useMenuItem = () => {
  const location = useLocation();
  const [t] = useTranslation();
  const navigator = useNavigate();

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
      onClick: () => navigator(PAGE_ROUTE.DASHBOARD)
    } as MenuItem,
    {
      label: t(i18nKey.menu.thingCenter),
      key: PAGE_ROUTE.THING_CENTER,
      icon: useMatch(PAGE_ROUTE.THING_CENTER) ? (
        <ThingIconActive />
      ) : (
        <ThingIcon />
      ),
      onClick: () => navigator(PAGE_ROUTE.THING_CENTER)
    } as MenuItem,
    {
      label: t(i18nKey.menu.accountManagement),
      key: PAGE_ROUTE.ACCOUNT_MANAGEMENT,
      icon: useMatch(PAGE_ROUTE.ACCOUNT_MANAGEMENT) ? (
        <AccountManagementActive />
      ) : (
        <AccountManagement />
      ),
      onClick: () => navigator(PAGE_ROUTE.ACCOUNT_MANAGEMENT)
    } as MenuItem,
    {
      label: t(i18nKey.menu.masterData),
      key: PAGE_ROUTE.MASTER_DATA,
      icon: location.pathname.includes(PAGE_ROUTE.PARAMETER) ? (
        <SystemIconActive />
      ) : (
        <SystemIcon />
      ),
      children: [
        {
          label: t(i18nKey.menu.parameter),
          key: PAGE_ROUTE.PARAMETER,
          icon: useMatch(PAGE_ROUTE.PARAMETER) ? (
            <UserLogsIconActive />
          ) : (
            <UserLogsIcon />
          ),
          onClick: () => navigator(PAGE_ROUTE.PARAMETER)
        },
        {
          label: t(i18nKey.menu.deviceModel),
          key: PAGE_ROUTE.DEVICE_MODEL,
          icon: useMatch(PAGE_ROUTE.DEVICE_MODEL) ? (
            <UserLogsIconActive />
          ) : (
            <UserLogsIcon />
          ),
          onClick: () => navigator(PAGE_ROUTE.DEVICE_MODEL)
        }
      ]
    } as MenuItem
  ];

  return menu;
};

export default useMenuItem;
