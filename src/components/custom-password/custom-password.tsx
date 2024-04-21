import { Form, Input } from 'antd';
import { Rule } from 'antd/lib/form';
import { NamePath } from 'antd/lib/form/interface';
import React, { ChangeEvent } from 'react';
import styles from './custom-password.module.less';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';

export type CustomPasswordInputType = 'text' | 'password';

export interface ICustomPasswordProps {
  name: string | NamePath | undefined;
  rules?: Rule[];
  dependencies?: NamePath[];
  disabled?: boolean;
  placeholder?: string;
  tabIndex: number;
  onChange?: (value: string) => void;
  value?: string;
}

export interface ICustomPasswordInputProps {
  disabled?: boolean;
  placeholder?: string;
  tabIndex: number;
  onChange?: (value: string) => void;
  value?: string;
}

const CustomPasswordInput: React.FC<ICustomPasswordInputProps> = ({
  disabled,
  placeholder,
  tabIndex,
  onChange,
  value
}) => {
  const renderIcon = (visible: boolean) => {
    return visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />;
  };
  return (
    <Input.Password
      onChange={(e: ChangeEvent<HTMLInputElement>) => {
        if (onChange) onChange(e.target.value);
      }}
      autoComplete="new-password"
      type="password"
      disabled={disabled}
      placeholder={placeholder}
      tabIndex={tabIndex}
      value={value}
      iconRender={(visible) => renderIcon(visible)}
      id="password"
    />
  );
};

const CustomPassword: React.FC<ICustomPasswordProps> = ({
  disabled,
  placeholder,
  tabIndex,
  onChange,
  value,
  name,
  rules,
  dependencies
}) => {
  return (
    <div className={styles.inputContainer}>
      <div className={styles.inputContainer}>
        <Form.Item noStyle name={name} rules={rules} dependencies={dependencies} required={false}>
          <CustomPasswordInput
            disabled={disabled}
            placeholder={placeholder}
            tabIndex={tabIndex}
            onChange={onChange}
            value={value}
          />
        </Form.Item>
      </div>
    </div>
  );
};
export default CustomPassword;
