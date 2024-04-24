import { Form, Input } from 'antd';
import { Rule } from 'antd/lib/form';
import { NamePath } from 'antd/lib/form/interface';
import React, { FC } from 'react';
import styles from './custom-password.module.less';
import IconPassword from '../../assets/icons/Login-password-check.svg';
import {ReactComponent as IconEyeSleep} from '../../assets/icons/Login-eye.svg';
import {ReactComponent as IconEyes} from '../../assets/icons/Login-eyes.svg';
export type CustomPasswordInputType = 'text' | 'password';

export interface ICustomPasswordProps {
	name?: string | NamePath;
	dependencies?: NamePath[];
	disabled?: boolean;
	placeholder?: string;
	initValue?: string | number;
	rules?: Rule[];
  	tabIndex?: number;
}

const CustomPassword: FC<ICustomPasswordProps> = ({ name, rules, dependencies, disabled, placeholder, tabIndex}) => {

	return (
		<div className={styles.inputContainer}>
			<div className={styles.inputContainer}>
				<Form.Item noStyle name={name} rules={rules} dependencies={dependencies} required={false}>
					<Input.Password iconRender={(visible)=>visible ? <IconEyes/>: <IconEyeSleep/>} disabled={disabled} placeholder={placeholder} tabIndex={tabIndex} 
					prefix={<img src={IconPassword}></img>} autoComplete="on"/>
				</Form.Item>
			</div>
		</div>
	);
};

export default CustomPassword;
