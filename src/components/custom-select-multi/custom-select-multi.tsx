import { CheckOutlined, SearchOutlined } from '@ant-design/icons';
import { Input, Select, Row, Col } from 'antd';
import React, { useState } from 'react';
import styles from './custom-select-multi.module.less';
import NoData from '../no-data/no-data';
interface IOption {
  label: string;
  value: string;
  key: string;
}
interface IProps {
  options: IOption[];
  value?: string[];
  onChange?: (value: string[]) => void;
}
const CustomMultiSelect = ({
  options,
  value = [],
  onChange
}: IProps) => {
  const [valueSearchPlant, setValueSearchPlant] = useState<string>('');

  const handleClickItemSelect = (item: IOption) => {
    const newValue = [...value, item.value].filter(
      (item, index, arr) => arr.lastIndexOf(item) == arr.indexOf(item)
    );
    onChange?.(newValue);
  };

  const renderDropDownSelectPlant = (options: Array<IOption>) => {
    const listOptionFilter: Array<IOption> =
      options?.filter((item: IOption) =>
        item?.label?.includes(valueSearchPlant)
      ) || [];

    const generateStyle = (item: IOption) => {
      return value.includes(item.value)
        ? `${styles.listItem} ${styles.listItemSelected}`
        : styles.listItem;
    };
    const renderMenu = () =>
      listOptionFilter?.map((item) => (
        <Row
          wrap={false}
          onClick={() => handleClickItemSelect(item)}
          key={item.key}
          className={generateStyle(item)}>
          <Col flex={1}>{item.label}</Col>
          <Col offset={2}>
            {value.includes(item.value) && <CheckOutlined />}
          </Col>
        </Row>
      ));

    return options?.length ? renderMenu() : <NoData />;
  };
  return (
    <Select
      onChange={(valueSelect) => onChange?.(valueSelect)}
      mode="multiple"
      showSearch={false}
      autoFocus={false}
      value={value}
      dropdownRender={() => {
        return (
          <div>
            <Input
              allowClear
              className={styles.subForm_search}
              placeholder="Search"
              onKeyDown={(e) => {
                e.stopPropagation();
              }}
              prefix={<SearchOutlined style={{ color: '#1890ff' }} />}
              onChange={(e) => {
                setValueSearchPlant(e.target.value);
              }}
            />

            <div className={styles.dropDownSelect}>
              {renderDropDownSelectPlant(options)}
            </div>
          </div>
        );
      }}
      options={options}
    />
  );
};
export default CustomMultiSelect;
