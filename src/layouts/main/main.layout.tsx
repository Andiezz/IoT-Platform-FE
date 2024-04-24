import { Col, Drawer, Layout, Row, theme } from 'antd';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import AppLogo from '../../assets/icons/logo-white.png';
import menuIcon from '../../assets/icons/menu.svg';
import { HTTP_STATUS_RESPONSE_KEY } from 'src/constants/api';
import useMenuProfile from 'src/constants/menu-profile';
import { PAGE_ROUTE } from 'src/constants/route';
import useService from 'src/hooks/use-service';
import useStore from 'src/hooks/use-store';
import { IUserInfo } from 'src/interfaces/user';
import { IAuthenticationService } from 'src/services/authentication.service';
import { IUserService } from 'src/services/user.service';
import eventEmitter from 'src/store/event';
import { IUserStore } from 'src/store/user.store';
import AppHeader from './components/header/header';
import AppMenu from './components/menu/menu';
import ProfileMenu from './components/profile/menu';
import styles from './main.layout.module.less';

const { Header, Sider, Content } = Layout;

const MainLayout: React.FC = () => {
  const {
    token: { colorBgContainer }
  } = theme.useToken();
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

  const getProfile = async () => {
    const res = await userService.getUserProfile();
    if (res.responseCode === HTTP_STATUS_RESPONSE_KEY.SUCCESS) {
      userStore.updateUserInfo(res.data as IUserInfo);
    }
  };

  useEffect(() => {
    if (authService.isAuthenticated) {
      getProfile();
    }
  }, [authService.isAuthenticated]);

  useEffect(() => {
    eventEmitter.on('forbidden', () => {
      getProfile();
      navigator(PAGE_ROUTE.ACCESS_DENIED, { replace: true });
    });
    return () => {
      eventEmitter.listenersMap.delete('forbidden');
    };
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
                  <Link to={''}>
                    <div className={styles.container_logoApp}>
                      <img
                        src={AppLogo}
                        alt="app-logo"
                        style={{ width: '100%' }}
                      />
                    </div>
                  </Link>
                </div>
              </Col>
              <Col xs={0} sm={0} md={1} lg={1} xl={1}>
                <div
                  className={styles.container_collapse}
                  style={{ marginLeft: collapsed ? 20 : 0 }}>
                  <button onClick={toggleCollapsed}>
                    <img src={menuIcon} alt="menu-icon" />
                  </button>
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
                      <button onClick={toggleMenuBar}>
                        <img src={menuIcon} alt="menu-icon" />
                      </button>
                    </div>
                  </Col>
                  <Col xl={22} sm={16} xs={16}>
                    <div>
                      <Link to={''}>
                        <div className={styles.container_logoApp}>
                          <img
                            src={AppLogo}
                            alt="app-logo"
                            style={{ width: '100%' }}
                          />
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
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default observer(MainLayout);
