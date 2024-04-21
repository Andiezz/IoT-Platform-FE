import { Row, Spin } from 'antd';
import React from 'react';

const Loader: React.FC = () => {
  return (
    <Row
      justify="center"
      align="middle"
      style={{ width: '100%', height: '100vh' }}>
      <Spin />
    </Row>
  );
};

export default Loader;
