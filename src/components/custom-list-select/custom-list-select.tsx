import { SearchOutlined } from '@ant-design/icons';
import {
  Avatar,
  Checkbox,
  Col,
  Input,
  List,
  Row,
  Typography
} from 'antd';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import React from 'react';
import { uniqueKey } from 'src/helpers/string.utils';
import styles from './custom-list-select.module.less'
interface Item {
  value: string | number | boolean;
  label: string;
  avatar?: string;
}

interface ISelect {
  onSearch?: (value: string) => void;
  onChangeSelect: (checkedValues: CheckboxValueType[]) => void;
  onSelectAll?: () => void;
  onUnselectAll?: () => void;  
  item: Item[]; // item = dataList use groupSelected
  showAvatar?: boolean;
  width?: number | string;
  height?: number | string;

  // use when group selected and listing
  groupSelected?: boolean;
  listSelected: Array<string | number | boolean>;
  onChangeGroupSelected?: (checkedValues: CheckboxValueType[]) => void; 
  onChangeGroupList?: (checkedValues: CheckboxValueType[]) => void;
  dataGroupSelected?: Item[]; // is Requrie if use group Selected
  heightList?: number |string
}

const CustomListSelect = ({
  onChangeSelect,
  onSearch,
  onSelectAll,
  listSelected,
  showAvatar,
  dataGroupSelected,
  onUnselectAll,
  width,
  height,
  heightList,
  item,
  onChangeGroupList,
  onChangeGroupSelected,
  groupSelected
}: ISelect) => {
  return (
    <div className={styles.container} style={{width}}>
      {onSearch && (
        <Input
          onChange={(e) => {
            onSearch(e.target.value);
          }}
          prefix={<SearchOutlined />}
          placeholder="Search"
        />
      )}
      <Row gutter={10} className={styles.container_controlSelect}>
        {onSelectAll && <Col onClick={onSelectAll}><Typography.Text>Select All</Typography.Text></Col>}
        {onUnselectAll && <Col onClick={onUnselectAll}><Typography.Text>Unselect All</Typography.Text></Col>}
      </Row>

      {groupSelected ? (
        <div style={{height}}>
        <div style={{padding: '10px'}}>Selected</div>
        <Checkbox.Group value={listSelected} onChange={onChangeGroupSelected}>
          <div className={styles.container_listSelected}>
          {dataGroupSelected?.map(item => {
            const avatar = item.avatar
              ? { src: item.avatar }
              : { icon: <SearchOutlined /> };
            return (
              <Row className={styles.container_listSelected} wrap={false} align={'middle'} gutter={15} key={uniqueKey(10)}>
                <Col><Checkbox value={item.value} /></Col>
                {showAvatar && <Col><Avatar style={{backgroundColor: '#BCBCC0'}} size={24} {...avatar} /></Col>}
                <Col><Typography.Text>{item.label}</Typography.Text></Col>
              </Row>
            );
          })}
          </div>
        </Checkbox.Group>
          <div style={{padding: '10px'}}>Listed</div>
          <Checkbox.Group  onChange={onChangeGroupList}>
        <List
          style={{height: heightList,overflow: 'auto'}}
          dataSource={item}
          renderItem={(item) => {
            const avatar = item.avatar
              ? { src: item.avatar }
              : { icon: <SearchOutlined /> };
            return (
              <Row wrap={false} align={'middle'} gutter={15} key={uniqueKey(10)}>
                <Col><Checkbox value={item.value} /></Col>
                {showAvatar && <Col><Avatar style={{backgroundColor: '#BCBCC0'}} size={24} {...avatar} /></Col>}
                <Col><Typography.Text>{item.label}</Typography.Text></Col>
              </Row>
            );
          }}
        />
      </Checkbox.Group>    
        </div>
     ):

      <Checkbox.Group value={listSelected} onChange={onChangeSelect}>
        <List
          style={{height,overflow: 'auto'}}
          dataSource={item}
          renderItem={(item) => {
            const avatar = item.avatar
              ? { src: item.avatar }
              : { icon: <SearchOutlined /> };
            return (
              <Row wrap={false} align={'middle'} gutter={15} key={uniqueKey(10)}>
                <Col><Checkbox value={item.value} /></Col>
                {showAvatar && <Col><Avatar style={{backgroundColor: '#BCBCC0'}} size={24} {...avatar} /></Col>}
                <Col><Typography.Text>{item.label}</Typography.Text></Col>
              </Row>
            );
          }}
        />
      </Checkbox.Group>}
    </div>
  );
};
export default CustomListSelect;
