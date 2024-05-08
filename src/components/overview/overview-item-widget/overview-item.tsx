/*eslint-disable*/
import React, { forwardRef } from 'react';
import styles from './overview-item.module.less';
import { Col, Divider, Row, Typography } from 'antd';

export interface IOverviewItemWidget {
  title?: string;
  date?: string;
  info?: number | string;
  children?: React.ReactNode;
}

export interface ILocation {
  pathname: string;
}

const OverviewItemWidget = (
  { title, date, children, info }: IOverviewItemWidget,
  ref: React.LegacyRef<HTMLDivElement>
) => {
  return (
    <div className={styles.wrapper} ref={ref}>
      <Row gutter={[0, 16]}>
        <Col span={24}>
          <header className={styles.wrapper_header}>
            <Row justify={'space-between'} align={'middle'} gutter={[16, 8]}>
              <Col>
                <Row align={'middle'} gutter={[16, 8]}>
                  <Col>
                    <Row
                      align={'middle'}
                      className={styles.wrapper_header_info}>
                      <Col>
                        <Typography className={styles.wrapper_header_info_name}>
                          {title}
                        </Typography>
                      </Col>
                      <Divider type="vertical"></Divider>
                      <Col className={styles.wrapper_header_info_id}>
                        ID: {info}
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Col>
              {date && <Col className={styles.wrapper_header_date}>{date}</Col>}
            </Row>
          </header>
        </Col>
        <Col span={24}>
          <div className={styles.wrapper_content}>{children}</div>
        </Col>
      </Row>
    </div>
  );
};

export default forwardRef(OverviewItemWidget);
