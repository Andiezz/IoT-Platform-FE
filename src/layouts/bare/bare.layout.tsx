import React from 'react';
import { Col, Row } from 'antd';
import { Outlet } from 'react-router-dom';
import styles from './bare.layout.module.less';
import {ReactComponent as AppLogo} from 'src/assets/icons/logo.svg';

const BareLayout: React.FC = () => {
  return <Row className={styles.container}>
    <Col xs={24} sm={24} md={14} xl={18} className={styles.bgSection}>
      <div className={styles.logoContainer}>
          <div className={styles.logo}>
            <AppLogo/>
          </div>
      </div>
    </Col>
    <Col xs={24} sm={24} md={10}  xl={6} className={styles.outletSection}>
      <Outlet />
    </Col>
  </Row>
}

export default BareLayout;