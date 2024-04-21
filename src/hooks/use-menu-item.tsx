import React from 'react';
import type { MenuProps } from 'antd';
import { useTranslation } from 'react-i18next';
import { i18nKey } from 'src/locales/i18n';
import { PAGE_ROUTE } from 'src/constants/route';
import { ReactComponent as AccountManagement } from 'src/assets/icons/People-icon.svg';
import { ReactComponent as AccountManagementActive } from 'src/assets/icons/People-icon-active.svg';
import { useNavigate, useMatch, useLocation } from 'react-router-dom';

export type MenuItem = Required<MenuProps>['items'][number];

const useMenuItem = () => {
  const location = useLocation();
  const [t] = useTranslation();
  const navigator = useNavigate();

  const menu: MenuItem[] = [
    {
      label: t(i18nKey.menu.systemManagement),
      key: PAGE_ROUTE.DASHBOARD_SYSTEM,
      icon: location.pathname.includes(PAGE_ROUTE.ACCOUNT_MANAGEMENT),
      children: [
        {
          label: t(i18nKey.menu.accountManagement),
          key: PAGE_ROUTE.ACCOUNT_MANAGEMENT,
          icon: useMatch(PAGE_ROUTE.ACCOUNT_MANAGEMENT) ? (
            <AccountManagementActive />
          ) : (
            <AccountManagement />
          ),
          onClick: () => navigator(PAGE_ROUTE.ACCOUNT_MANAGEMENT)
        }
      ]
    } as MenuItem
  ];

  return menu;
};

export default useMenuItem;
