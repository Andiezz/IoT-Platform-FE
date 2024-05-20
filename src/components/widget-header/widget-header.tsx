import React from 'react';
import styles from './widget-header.module.less';

interface IProps {
    children?: React.ReactNode;
}

const WidgetHeader: React.FC<IProps> = ({
    children
}) => {
    return <div className={styles.wrapper}>
        {children}
    </div>;
};

export default WidgetHeader;