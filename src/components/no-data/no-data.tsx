import { Empty, Row } from 'antd';
import React from 'react';
export interface INoData {
  content?: string;
  noHeight?: boolean;
}
const NoData: React.FC<INoData> = () => {
  return (
    <Row
      justify="center"
      align="middle"
      style={{
        width: '100%',
        height: 'calc(100% - 37px)',
        flexDirection: 'column'
      }}>
      <Empty image={Empty.PRESENTED_IMAGE_DEFAULT} />
    </Row>
  );
};

export default NoData;
