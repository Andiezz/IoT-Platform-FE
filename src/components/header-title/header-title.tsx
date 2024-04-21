import { Col, Row, RowProps, Typography } from 'antd'
import styles from './header-title.module.less'
import React from 'react'

interface IProps {
    className?: string;
    title: string;
    componentRightSide?: React.ReactNode;
}
export const HeaderTitle = ({ title,children, componentRightSide, className, ...props }: IProps & RowProps) => {
    return (
        <div className={styles.wrapperHeader}>
        <Row gutter={6} wrap={false}  className={className} {...props}>
            <Col><Typography.Title className={styles.title}>{title}</Typography.Title></Col>
            <Col>{componentRightSide}</Col>
        </Row>
        <div>{children}</div>
        </div>
    )
}
