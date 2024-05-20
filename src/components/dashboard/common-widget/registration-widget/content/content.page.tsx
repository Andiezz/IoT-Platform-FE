import React from 'react';
import styles from './content.module.less';
import { Col, Row } from 'antd';

export interface IRegistrationContent {
    children: React.ReactNode;
}

const RegistrationContent: React.FC<IRegistrationContent> = ({ children }) => {
    return (
        <div className={styles.widget_content}>
            <Row style={{ width: '100%' }}>
                <Col span={24}>
                    {children}
                </Col>
            </Row>
        </div>
    );
};

export default RegistrationContent;