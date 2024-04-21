import React, { FC, useState } from 'react';
import { i18nKey } from 'src/locales/i18n';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Col,
  Form,
  Grid,
  Input,
  Modal,
  Row,
  Space,
  Spin,
  Typography,
  message
} from 'antd';
import styles from './change-password.module.less';
import WhiteBox from 'src/components/white-box/white-box';
import IconPassword from 'src/assets/icons/Login-password-check.svg';
import { useForm } from 'antd/es/form/Form';
import HeaderTitleContent from 'src/components/header-title-content/header-title-content';
import Widget from 'src/components/widget/widget';
import { IUserService } from 'src/services/user.service';
import useService from 'src/hooks/use-service';
import { IUpdatePasswordBody } from 'src/dto/account.dto';
import { PASSWORD_VALIDATION_RULES } from 'src/constants/validation';
import { PAGE_ROUTE } from 'src/constants/route';
import { useNavigate } from 'react-router-dom';
import { HTTP_STATUS_RESPONSE_KEY } from 'src/constants/api';
import { messageResponse } from 'src/constants/message-response';

const { Title } = Typography;

const ChangePasswordPage: FC = () => {
  const [form] = useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const navigator = useNavigate();
  const userService: IUserService = useService('userService');
  const [t] = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [isFormChange, setIsFormChange] = useState(false);
  const [inputPassCheck1, setInputPassCheck1] = useState(true);
  const [inputPassCheck2, setInputPassCheck2] = useState(false);
  const screen = Grid.useBreakpoint();

  const onClickForm = () => {
    form.submit();
    setIsOpen(false);
  };

  const handleOpenConfirm = (isUpdate: boolean) => {
    setIsOpen(true);
    setIsUpdate(isUpdate);
  };

  const onCancelConfirm = () => {
    setIsOpen(false);
  };

  const onClickCancel = () => {
    navigator(``);
  };

  const onFinish = async (values: IUpdatePasswordBody) => {
    setLoading(true);
    const rs = await userService.changePassword(values);
    setLoading(false);

    if (rs.responseCode === HTTP_STATUS_RESPONSE_KEY.SUCCESS) {
      message.success(
        `${t(i18nKey.validation.emailOrPassword.changePasswordSuccess)}`
      );
      form.resetFields();
    }
    if (
      rs.responseCode === HTTP_STATUS_RESPONSE_KEY.BAD_REQUEST &&
      rs.message === messageResponse.passwordDifferentFromCurrentErr
    ) {
      message.error(
        `${t(i18nKey.validation.emailOrPassword.passwordDifferentFromCurrent)}`
      );
      form.resetFields();
    }
  };
  return (
    <div className={styles.wrapper_form}>
      <Spin spinning={loading}>
        <Form
          onChange={() => setIsFormChange(true)}
          layout="vertical"
          form={form}
          onFinish={onFinish}>
          <HeaderTitleContent
            title={`${t(i18nKey.accountEntity.title.settings)}`}>
            <Space>
              <Button onClick={() => handleOpenConfirm(false)}>{`${t(
                i18nKey.button.cancel
              )}`}</Button>
              <Button
                type="primary"
                disabled={!(isFormChange && inputPassCheck1 && inputPassCheck2)}
                onClick={() => handleOpenConfirm(true)}>
                {`${t(i18nKey.button.update)}`}
              </Button>
            </Space>
          </HeaderTitleContent>
          <Widget>
            <Row>
              <Col xl={14}>
                <WhiteBox>
                  <div className={styles.title}>
                    <Title level={4}>{`${t(
                      i18nKey.menu.changePassword
                    )}`}</Title>
                  </div>

                  <Row gutter={[32, 16]}>
                    <Col xl={12} xs={24}>
                      <Form.Item
                        required={true}
                        name="newPassword"
                        label={`${t(i18nKey.accountEntity.label.newPassword)}`}
                        rules={[
                          {
                            validator: (_, value) => {
                              if (!value) {
                                setInputPassCheck1(false);
                                return Promise.reject(
                                  new Error(
                                    `${t(
                                      i18nKey.validation.common.requiredField
                                    )}`
                                  )
                                );
                              }
                              if (
                                !value.trim() ||
                                !new RegExp(
                                  PASSWORD_VALIDATION_RULES.REGEX
                                ).test(value)
                              ) {
                                setInputPassCheck1(false);
                                return Promise.reject(
                                  new Error(
                                    t(
                                      i18nKey.validation.emailOrPassword
                                        .passwordPattern
                                    ) as string
                                  )
                                );
                              }
                              setInputPassCheck1(true);
                              return Promise.resolve();
                            }
                          }
                        ]}>
                        <Input.Password
                          type="password"
                          prefix={<img src={IconPassword} alt="icon-password" />}
                        />
                      </Form.Item>
                    </Col>
                    <Col xl={12} xs={24}>
                      <Form.Item
                        required={true}
                        dependencies={['newPassword']}
                        name="confirmPassword"
                        label={`${t(
                          i18nKey.accountEntity.label.confirmNewPassword
                        )}`}
                        rules={[
                          ({ getFieldValue }) => ({
                            validator(_, value) {
                              if (
                                !value ||
                                getFieldValue('newPassword') === value
                              ) {
                                setInputPassCheck2(true);
                                return Promise.resolve();
                              }
                              setInputPassCheck2(false);
                              return Promise.reject(
                                new Error(
                                  `${t(
                                    i18nKey.validation.emailOrPassword
                                      .passwordMismatch
                                  )}`
                                )
                              );
                            }
                          }),
                          {
                            validator: (_, value) => {
                              if (!value) {
                                setInputPassCheck1(false);
                                return Promise.reject(
                                  new Error(`${t(i18nKey.validation.common.requiredField)}`)
                                );
                              }
                              setInputPassCheck1(true);
                              return Promise.resolve();
                            }
                          }
                        ]}>
                        <Input.Password
                          type="password"
                          prefix={<img src={IconPassword} />}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </WhiteBox>
              </Col>
            </Row>
          </Widget>
          {screen.xs && (
            <Row
              justify={'center'}
              gutter={10}
              align={'middle'}
              className={styles.footerBtn}>
              <Col span={12}>
                {' '}
                <Button block onClick={() => handleOpenConfirm(false)}>{`${t(
                  i18nKey.button.cancel
                )}`}</Button>
              </Col>
              <Col span={12}>
                {' '}
                <Button
                  block
                  type="primary"
                  disabled={
                    !(isFormChange && inputPassCheck1 && inputPassCheck2)
                  }
                  onClick={() => handleOpenConfirm(true)}>
                  {`${t(i18nKey.button.update)}`}
                </Button>
              </Col>
            </Row>
          )}
        </Form>
      </Spin>
      <Modal
        centered
        wrapClassName={styles.bodyModal}
        open={isOpen}
        closable={false}
        onCancel={onCancelConfirm}
        width={343}
        footer={
          <div className={styles.footer}>
            <Row gutter={12}>
              <Col span={12}>
                <Button
                  onClick={onCancelConfirm}
                  className={styles.footer_cancel}
                  type="default">
                  {t(i18nKey.button.cancel)}
                </Button>
              </Col>
              <Col span={12}>
                <Button
                  onClick={isUpdate ? onClickForm : onClickCancel}
                  className={styles.footer_submit}>
                  {t(i18nKey.button.ok)}
                </Button>
              </Col>
            </Row>
          </div>
        }>
        <div className={styles.header}>
          {isUpdate ? (
            <Typography className={styles.header_title}>
              {t(i18nKey.button.update)}
            </Typography>
          ) : (
            <Typography className={styles.header_title}>
              {t(i18nKey.button.cancel)}
            </Typography>
          )}

          {isUpdate ? (
            <span className={styles.header_desc}>
              {t(i18nKey.confirmationPopup.update)}
            </span>
          ) : (
            <span className={styles.header_desc}>
              {t(i18nKey.confirmationPopup.cancel)}
            </span>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default ChangePasswordPage;
