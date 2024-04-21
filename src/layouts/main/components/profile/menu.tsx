import { Button, Col, Menu, Modal, Row, Typography } from 'antd';
import React, { FC, useState } from 'react';
import styles from './menu.module.less';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { i18nKey } from 'src/locales/i18n';
import { PAGE_ROUTE } from 'src/constants/route';
import { IAuthenticationService } from 'src/services/authentication.service';
import useService from 'src/hooks/use-service';
import { MenuItem } from 'src/hooks/use-menu-item';

const ProfileMenu: FC = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const navigator = useNavigate();
  const authService: IAuthenticationService = useService('authenticationService');
  const [open, setOpen] = useState(false);
  const onCancel = () => {
    setOpen(false);
  };

  const onSubmit = () => {
    authService.logout().then(() => {
      navigator(PAGE_ROUTE.LOGIN);
    }).catch();
  };

  const handleOpen = () => {
    setOpen(!open)
  }

  const menu: MenuItem[] = [
    {
      label: t(i18nKey.menu.myProfile),
      key: PAGE_ROUTE.PROFILE,
      onClick: () =>
      navigator(PAGE_ROUTE.PROFILE)
    } as MenuItem,
    {
      label: t(i18nKey.menu.changePassword),
      key: PAGE_ROUTE.PROFILE_CHANGE_PASSWORD,
      onClick: () =>
      navigator(PAGE_ROUTE.PROFILE_CHANGE_PASSWORD)
    } as MenuItem,
    {
      label: t(i18nKey.menu.logout),
      key: PAGE_ROUTE.LOGOUT,
      onClick: () =>
      handleOpen()
    } as MenuItem,
  ]
  const getSelectedKeys = (pathname: string) => {
    const selectedKeys: [] = [];
    selectedKeys.push(pathname as never);
    return selectedKeys;
  };
  
  return (
    <div className={styles.wrapper}>
      <Menu 
        className={styles.wrapper_menu}
        items={menu as any}
        selectedKeys={getSelectedKeys(location.pathname)}
      />

      <Modal
        centered
        wrapClassName={styles.wrapper_bodyModal}
        open={open}
        closable={false}
        onCancel={onCancel}
        width={343}
        footer={
          <div className={styles.wrapper_footer}>
            <Row gutter={12}>
              <Col span={12}>
                <Button
                  onClick={onCancel}
                  className={styles.wrapper_footer_cancel}
                  type="default">
                  {t(i18nKey.button.cancel)}
                </Button>
              </Col>
              <Col span={12}>
                <Button onClick={onSubmit} className={styles.wrapper_footer_submit}>
                  {t(i18nKey.button.ok)}
                </Button>
              </Col>
            </Row>
          </div>
        }>
        <div className={styles.header}>
          <Typography className={styles.wrapper_header_title}>{t(i18nKey.menu.logout)}</Typography>
          <span className={styles.wrapper_header_desc}>
            {t(i18nKey.confirmationPopup.logout)}
          </span>
        </div>
      </Modal>
    </div>

  );
};
export default ProfileMenu;
