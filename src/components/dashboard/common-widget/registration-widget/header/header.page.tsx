import { Col, Row, Typography } from 'antd';
import React from 'react';
import styles from './header.module.less';
export interface IRegistrationHeader {
    title: string;
    children: React.ReactNode;
}


const RegistrationHeader: React.FC<IRegistrationHeader> = ({
    title, children
}) => {
    return (
        <header className={styles.widget_header}>
            <Row gutter={[0, 24]}>
                <Col span={24}>
                    <div className={styles.widget_header_title}>
                        <Typography.Title level={2}>{title}</Typography.Title>
                    </div>
                </Col>
                <Col span={24}>
                    {children}
                </Col>
            </Row>
        </header>
    );
};

export default RegistrationHeader;