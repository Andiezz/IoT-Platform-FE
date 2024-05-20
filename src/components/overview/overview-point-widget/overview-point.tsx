import React from 'react';
import styles from './overview-point.module.less';
import { ReactComponent as LightingIcon } from 'src/assets/icons/Lighting.svg';
import TooltipParagraph from 'src/components/tooltip-paragraph/tooltip-paragraph';
import { Col, Typography } from 'antd';

export interface IOverviewPointWidget {
  param?: string;
  text?: string;
  color?: string;
  backgroud?: string;
  isCol?: boolean;
}

const OverviewPointWidget: React.FC<IOverviewPointWidget> = ({
  param,
  text,
  color,
  backgroud,
  isCol = true
}) => {
  return (
    <>
      {param !== 'undefined' && param !== 'null' && (
        <>
          {isCol ? (
            <Col
              xxl={4}
              xl={6}
              lg={8}
              md={8}
              sm={12}
              xs={12}
              className={styles.wrapper_content_info_item}>
              <div className={styles.wrapper}>
                <div className={styles.wrapper_picture}>
                  <div
                    className={styles.wrapper_img}
                    style={{ background: `${backgroud}` }}>
                    <LightingIcon fill={color} />
                  </div>
                </div>
                <div className={styles.wrapper_infomation}>
                  <div className={styles.wrapper_infomation_param}>
                    <Typography.Title level={3}>
                      {param ?? null}
                    </Typography.Title>
                  </div>
                  <div>
                    <span className={styles.wrapper_infomation_text}>
                      {text}
                    </span>
                  </div>
                </div>
              </div>
            </Col>
          ) : (
            <div className={styles.wrapper}>
              <div className={styles.wrapper_picture}>
                <div
                  className={styles.wrapper_img}
                  style={{ background: `${backgroud}` }}>
                  <LightingIcon fill={color} />
                </div>
              </div>
              <div className={styles.wrapper_infomation}>
                <div className={styles.wrapper_infomation_param}>
                  <TooltipParagraph>{param}</TooltipParagraph>
                </div>
                <div>
                  <span className={styles.wrapper_infomation_text}>{text}</span>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default OverviewPointWidget;
