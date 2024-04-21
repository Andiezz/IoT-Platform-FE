import { useLoadScript } from '@react-google-maps/api';
import { Col, Drawer, Layout, Row, notification, theme } from 'antd';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import AppLogo from 'src/assets/icons/logo-white.png';
import menuIcon from 'src/assets/icons/menu.svg';
import { LIMIT_RECORD } from 'src/constants';
import { HTTP_STATUS_RESPONSE_KEY } from 'src/constants/api';
import useMenuProfile from 'src/constants/menu-profile';
import { PAGE_ROUTE } from 'src/constants/route';
import { INotification } from 'src/dto/notification.dto';
import { ITenantListRequest } from 'src/dto/tenant-list.dto';
import { API_KEY } from 'src/environments/environment';
import useService from 'src/hooks/use-service';
import useStore from 'src/hooks/use-store';
import { IUserInfo } from 'src/interfaces/user';
import { i18nKey } from 'src/locales/i18n';
import { IAuthenticationService } from 'src/services/authentication.service';
import { IHttpService } from 'src/services/http.service';
import { IUserService } from 'src/services/user.service';
import { IClientService } from 'src/services/websocket/client.service';
import eventEmitter from 'src/store/event';
import { INotificationStore } from 'src/store/notification/notification.store';
import { ITenantListStore } from 'src/store/tenant/tenant-list.store';
import { IUserStore } from 'src/store/user.store';
import AppHeader from './components/header/header';
import AppMenu from './components/menu/menu';
import ProfileMenu from './components/profile/menu';
import styles from './main.layout.module.less';

const { Header, Sider, Content } = Layout;
const libraries: (
  | 'drawing'
  | 'geometry'
  | 'localContext'
  | 'places'
  | 'visualization'
)[] = ['places'];

const MainLayout: React.FC = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: API_KEY,
    libraries
  });
  const {
    token: { colorBgContainer }
  } = theme.useToken();
  const { t } = useTranslation();
  const [collapsed, setCollapsed] = useState(false);
  const [menuBar, setMenuBar] = useState(false);
  const userStore: IUserStore = useStore('userStore');
  const location = useLocation();
  const menu = useMenuProfile();
  const menuProfiles = menu.map((item) => item?.key);
  const userService: IUserService = useService('userService');
  const authService: IAuthenticationService = useService(
    'authenticationService'
  );
  const navigator = useNavigate();
  const notificationService: INotificationStore = useStore('notificationStore');
  const socketService: IClientService = useService('socketService');
  const httpService: IHttpService = useService('httpService');
  const tenantListStore: ITenantListStore = useStore('listTenantStore');
  const getProfile = async () => {
    const res = await userService.getUserProfile();
    if (res.responseCode === HTTP_STATUS_RESPONSE_KEY.SUCCESS) {
      userStore.updateUserInfo(res.data as IUserInfo);
      const user: IUserInfo | undefined = userStore.userInfo;
      if (user) {
        socketService.userId = user.id;
        socketService.authToken = httpService.getToken();
        socketService.messageHandlers = [notificationService];
        socketService.connect();
      }
    }
  };

  const getNotification = async () => {
    try{
      notificationService.updateLoadingNotification(true)
      await notificationService.getListNotification({ page: 1, limit: LIMIT_RECORD });
    }
   finally{
    notificationService.updateLoadingNotification(false)
   }
  };
  const renderDescription = (item: INotification) => {
    if (item.description.type === 'automatedProcess') {
      const fielData = item.description.fielData as {
        insertAlarmID: string;
        insertSeverity: string;
        insertDescription: Array<any>;
      };
      return t(
        i18nKey.notifications.notificationAppFunction.automatedProcess(
          fielData.insertAlarmID,
          fielData.insertSeverity,
          fielData.insertDescription
        )
      );
    }
    return `${t(i18nKey.notifications.notificationApp[item.description.type], {
      ...item.description.fielData
    })}`;
  };

  useEffect(() => {
    if (authService.isAuthenticated) {
      getProfile();
      getNotification();
    }
    return (()=>{
      notificationService.updateLoadingNotification(false)
    })
  }, [authService.isAuthenticated]);

  useEffect(() => {
    eventEmitter.on('forbidden', () => {
      getProfile();
      navigator(PAGE_ROUTE.ACCESS_DENIED,{replace: true});
    });
    eventEmitter.on('notification', (data) => {
      const tempData: INotification = data as INotification;
      notification.info({
        message: t(`${i18nKey.notifications.title}`),
        description: (
          <div
            dangerouslySetInnerHTML={{
              __html: renderDescription(tempData)
            }}
          />
        )
      });
    });
    return () => {
      eventEmitter.listenersMap.delete('notification');
      eventEmitter.listenersMap.delete('forbidden');
    };
  }, []);

  const fetchData = async (request?: ITenantListRequest) => {
    try {
      await tenantListStore.fetchListNoPermission(request);
    } catch (error) {
      throw Error;
    }
  };
  useEffect(() => {
    fetchData({ limit: 20, page: 1 });
  }, []);
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const toggleMenuBar = () => {
    setMenuBar(!menuBar);
  };
  return (
    <Layout className={styles.container}>
      <Layout>
        <Drawer
          className={styles.container_menuDrawer}
          title="Menu"
          placement="left"
          closable
          width="400px"
          onClose={toggleMenuBar}
          open={menuBar}>
          <AppMenu setMenuBar={setMenuBar} />
        </Drawer>

        <Sider
          style={{ background: colorBgContainer, flexBasis: '280px' }}
          collapsible
          collapsed={collapsed}
          trigger={null}
          className={`${styles.container_slider} ${
            collapsed && styles.container_slider_collapsed
          }`}>
          <Header className={styles.container_headerSider}>
            <Row
              style={{
                width: '100%',
                height: '100%'
              }}
              justify={'space-between'}
              align={'middle'}>
              <Col span={12}>
                  <div>
                    <Link
                      to={`${PAGE_ROUTE.DASHBOARD}overview/tenant/${tenantListStore?.listTenant[0]?._id}`}>
                      <div className={styles.container_logoApp}>
                        <img src={AppLogo} style={{ width: '100%' }} />
                      </div>
                    </Link>
                  </div>
              </Col>
              <Col xs={0} sm={0} md={1} lg={1} xl={1}>
                <div
                  className={styles.container_collapse}
                  style={{ marginLeft: collapsed ? 20 : 0 }}>
                  <img src={menuIcon} onClick={toggleCollapsed} />
                </div>
              </Col>
            </Row>
          </Header>
          {menuProfiles.includes(location.pathname) ? (
            <ProfileMenu />
          ) : (
            <AppMenu />
          )}
        </Sider>
        <Layout>
          <Header className={styles.container_headerContent}>
            <Row justify={'space-between'}>
              <Col xs={8} sm={8} md={0} lg={0} xl={0}>
                <Row
                  style={{ width: '100%', height: '100%', marginLeft: 0 }}
                  align={'middle'}
                  gutter={16}>
                  <Col xl={2} sm={8} xs={8}>
                    <div className={styles.container_sidebar}>
                      <img src={menuIcon} onClick={toggleMenuBar} />
                    </div>
                  </Col>
                  <Col xl={22} sm={16} xs={16}>
                      <div>
                        <Link
                          to={`${PAGE_ROUTE.DASHBOARD}overview/tenant/${tenantListStore?.listTenant[0]?._id}`}>
                          <div className={styles.container_logoApp}>
                            <img src={AppLogo} style={{ width: '100%' }} />
                          </div>
                        </Link>
                      </div>
                  </Col>
                </Row>
              </Col>
              <Col xs={16} sm={16} md={24} lg={24} xl={24}>
                <AppHeader />
              </Col>
            </Row>
          </Header>
          <Content className={styles.container_content}>
            {isLoaded && <Outlet />}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default observer(MainLayout);
