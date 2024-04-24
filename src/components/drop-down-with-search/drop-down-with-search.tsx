import { SearchOutlined } from '@ant-design/icons';
import { Dropdown, DropdownProps, Input } from 'antd';
import React, { useState } from 'react';
export interface IDropDownPlant{
  label: string;
  key: string;
}

interface IProps extends DropdownProps {
  isShowSearch?: boolean;
  items?: IDropDownPlant[];
  onClickItem?: (values: string) => void
}
const DropDownWithSearch = ({
  children,
  isShowSearch = true,
  items,
  onClickItem
}: IProps) => {
  const [itemData, setItemData] = useState(items);
  const addEventItem = () =>
  itemData && itemData.map((item) => {
      const label = (
        <div
          onClick={() => {
            onClickItem && onClickItem(item.key);
          }}>
          {item.label}
        </div>
      );
      return { ...item, label };
    });
  return (
    <Dropdown
      menu={{ items: addEventItem() }}
      dropdownRender={(menu) => (
        <div style={{maxHeight: '300px'}}>
          {isShowSearch && (
            <Input
              placeholder="Search"
              autoFocus
              prefix={<SearchOutlined />}
              onChange={(e) =>
                setItemData(() => {
                  return items && items.filter((item) =>
                    item.label.includes(e.target.value)
                  );
                })
              }
              allowClear
            />
          )}
          {menu}
        </div>
      )}>
      {children}
    </Dropdown>
  );
};
export default DropDownWithSearch;
