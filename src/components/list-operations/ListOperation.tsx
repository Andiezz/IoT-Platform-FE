import { Tooltip, List } from 'antd';
import React from 'react';
import { STATUS } from 'src/constants/status';
import styles from './ListOperation.module.less';

interface IProps {
  record: any;
  item: any;
  messageDelete?: string;
  messageAssign?: string;
}

const ListOperation: React.FC<IProps> = ({
  record,
  item,
  messageDelete,
  messageAssign
}: IProps) => {
  const getReadableStatusTitle = () => {
    if (
      record.status !== STATUS.PENDING_SETUP.toLowerCase() &&
      item.title.toLowerCase().includes('delete')
    ) {
      return messageDelete;
    }
    return record.tenant_id === null &&
      item.title.toLowerCase().includes('association')
      ? messageAssign
      : '';
  };

  const getReadableStatusCursor = () => {
    if (
      record.status !== STATUS.PENDING_SETUP.toLowerCase() &&
      item.title.toLowerCase().includes('delete')
    ) {
      return 'no-drop';
    }
    return record.tenant_id === null &&
      item.title.toLowerCase().includes('association')
      ? 'no-drop'
      : 'pointer';
  };
  return (
    <Tooltip title={getReadableStatusTitle()}>
      <List.Item
        className={styles.listItem}
        style={{
          cursor: getReadableStatusCursor(),
          opacity:
            (record.status !== STATUS.PENDING_SETUP.toLowerCase() &&
              item.title.toLowerCase().includes('delete')) ||
            (record.tenant_id === null &&
              item.title.toLowerCase().includes('association'))
              ? 0.5
              : 1
        }}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          item.onClick && item.onClick(record);
        }}>
        <div>{item.icon}</div>
        <div>{item.title}</div>
      </List.Item>
    </Tooltip>
  );
};

export default ListOperation;
