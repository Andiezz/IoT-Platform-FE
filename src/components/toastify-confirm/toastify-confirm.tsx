import { Button, Col, Modal, Row } from 'antd';
import * as React from 'react';
import styles from './toastify-confirm.module.less';
import { useTranslation } from 'react-i18next';
import { i18nKey } from 'src/locales/i18n';
export interface IToastifyConfirmProps {
  openToastify: boolean;
  onCancel?: () => void;
  idDelete?: string;
  onSubmit?: (idDelete: string | undefined) => void;
  title?: string;
  description?: string;
}

const ToastifyConfirm: React.FC<IToastifyConfirmProps> = ({
  openToastify,
  onCancel,
  idDelete,
  onSubmit,
  title,
  description
}: IToastifyConfirmProps) => {
  const [t] = useTranslation();
  return (
    <div>
      <Modal
        centered
        wrapClassName={styles.bodyModal}
        open={openToastify}
        onCancel={onCancel}
        width={343}
        title={title}
        footer={
          <div className={styles.footer}>
            <Row gutter={12}>
              <Col span={12}>
                <Button
                  onClick={onCancel}
                  className={styles.footer_cancel}
                  type="default">
                  {t(i18nKey.button.cancel)}
                </Button>
              </Col>
              <Col span={12}>
                <Button
                  onClick={() =>
                    idDelete ? onSubmit && onSubmit(idDelete) : onSubmit
                  }
                  className={styles.footer_submit}>
                  {t(i18nKey.button.ok)}
                </Button>
              </Col>
            </Row>
          </div>
        }>
        <div className={styles.header}>
          <span className={styles.header_desc}>{description}</span>
        </div>
      </Modal>
    </div>
  );
};
export default ToastifyConfirm;
