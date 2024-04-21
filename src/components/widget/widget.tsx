import React from 'react';
import styles from './widget.module.less';
interface IProps {
	children?: React.ReactNode;
	style?: any;
	title?: string;
}
const Widget = ({ children, style, title }: IProps) => {
	return (
		<div className={styles.widget} style={style}>
			<div className={styles.widgetTitle}>{title}</div>
			{children}
		</div>
	);
};

export default Widget;
