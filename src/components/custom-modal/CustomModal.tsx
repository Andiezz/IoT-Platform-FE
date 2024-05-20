import React from 'react';
import styles from './custom-modal.module.less';
import { Button, Divider, Modal, ModalProps, Typography } from 'antd';
import CloseModalIcon from 'src/assets/icons/close-modal.svg';
import { i18nKey } from 'src/locales/i18n';
import { useTranslation } from 'react-i18next';

interface IModalProps extends ModalProps {
  children?: React.ReactNode;
  open: boolean;
  onCancel?: () => void;
  onClick?: () => void;
  title?: string;
  onDownload?: () => void;
}
const CustomModal: React.FC<IModalProps> = ({
  children,
  open,
  onCancel,
  title,
  ...propOther
}: IModalProps) => {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <Modal
        centered
        wrapClassName={styles.bodyModal}
        open={open}
        closable={false}
        onCancel={onCancel}
        footer={
          <div className={styles.footer}>
            <Divider className={styles.footer_divider} />
            <div className={styles.footer_container}>
              <div className={styles.footer_wrapper}>

                <Button onClick={onCancel} className={styles.footer_button}>
                  {t(i18nKey.button.done)}
                </Button>
              </div>
            </div>
          </div>
        }
        {...propOther}
        >
        <div className={styles.header}>
          <Typography className={styles.header_title}>{title}</Typography>
          <img
            className={styles.header_icon}
            src={CloseModalIcon}
            alt="modal-close"
            onClick={onCancel}
          />
        </div>
        <Divider style={{ margin: 0 }} />
        {children}
      </Modal>
    </div>
  );
};

export default CustomModal;
