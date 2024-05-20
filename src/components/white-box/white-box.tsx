import React from 'react';
import styles from './white-box.module.less';

export interface IWhiteBox {
  children: React.ReactNode;
}
const WhiteBox: React.FC<IWhiteBox> = ({ children }) => {
  return <div className={styles.white_box}>{children}</div>;
};
export default WhiteBox;
