import { Space, Typography } from 'antd';
import styles from 'src/components/header-title-content/header-title-content.module.less';
import React, { FC } from 'react';
const { Title } = Typography;
interface IProps {
  title?: string;
  children?: React.ReactNode;
}
const HeaderTitleContent: FC<IProps> = ({ title, children }) => {
  return (
    <div className={styles.headerContainer}>
      <Space align="center" className={styles.headerTitle}>
        <Title className={styles.title} level={4}>
          {title}
        </Title>
      </Space>
      <div className={styles.children}>{children}</div>
    </div>
  );
};
export default HeaderTitleContent;
