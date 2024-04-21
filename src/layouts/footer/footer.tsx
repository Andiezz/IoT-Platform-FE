import React from 'react';
import { Button, Col, Layout, Row, RowProps, Grid } from 'antd';
import styles from './footer.module.less';
const { Footer, Content } = Layout;
interface IProps {
  btnOk?: string;
  btnCancel?: string;
  onCancel?: () => void;
  onOk?: () => void;
  className?: string;
  showFooter?: boolean;
  fixedFooter?: boolean;
}
const LayoutFooterButton = ({
  btnOk,
  btnCancel,
  onOk,
  onCancel,
  children,
  className,
  fixedFooter = true,
  ...props
}: IProps & RowProps) => {
  const screen = Grid.useBreakpoint();
  return (
    <Layout className={styles.wrapper}>
      <Content>{children}</Content>
      {(screen.xs || screen.sm ) && (
        <Footer
          className={fixedFooter ? `${className} ${styles.fixed}` : className}>
          <Row justify={'center'} gutter={[16, 16]} {...props}>
            {btnCancel && (
              <Col sm={12} xs={12} className={styles.btnItem}>
                <Button className={styles.btnCancel} onClick={onCancel}>
                  {btnCancel}
                </Button>
              </Col>
            )}
            {btnOk && (
              <Col sm={12} xs={12} className={styles.btnItem}>
                <Button className={styles.btnOk} onClick={onOk} type="primary">
                  {btnOk}
                </Button>
              </Col>
            )}
          </Row>
        </Footer>
      )}
    </Layout>
  );
};

export default LayoutFooterButton;
