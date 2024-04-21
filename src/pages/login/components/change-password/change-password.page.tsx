import React, { useState } from 'react';
import { i18nKey } from 'src/locales/i18n';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';
import { Button, Col, Form, Input, Row, Typography, message } from 'antd';
import styles from './change-password.module.less';
import IconSuccess from 'src/assets/icons/Change-success.svg';
import { Link, useSearchParams } from 'react-router-dom';
import { PAGE_ROUTE } from 'src/constants/route';
import IconPassword from 'src/assets/icons/Login-password-check.svg';
import { IAuthenticationService } from 'src/services/authentication.service';
import useService from 'src/hooks/use-service';
import { PASSWORD_VALIDATION_RULES } from 'src/constants/validation';
import { HTTP_STATUS_RESPONSE_KEY } from 'src/constants/api';
import { IChangePasswordBody } from 'src/dto/change-password.dto';

const ChangePassword: React.FC = () => {
    const [t] = useTranslation();
    const authService: IAuthenticationService = useService('authenticationService');
    const [searchPram] = useSearchParams();
    const [loginForm] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [changePassword, setChangePassword] = useState(false);
    const token = searchPram.get('token');
    const isNewUser = searchPram.get('isNew');

    const changePasswordNew = async (values: IChangePasswordBody) => {
        await authService.activeAccount({
            new_password: values.newPassword,
            confirm_new_password: values.confirmPassword,
            activation_code: token
        }).then((res) => {
            if (res.responseCode === HTTP_STATUS_RESPONSE_KEY.SUCCESS) {
                message.success(
                    `${t(i18nKey.validation.emailOrPassword.changePasswordSuccess)}`
                );
                setChangePassword(true);
            }
            if (res.responseCode === HTTP_STATUS_RESPONSE_KEY.BAD_REQUEST) {
                setLoading(false);
                message.error(
                    `${t(i18nKey.validation.account.activationLinkExpired)}`
                );
            }
        }).catch(e => console.log(e));
    };


    const handleChangePassword = async (values: IChangePasswordBody) => {
        await authService.changeForgotPassword({ ...values, token }).then((rs) => {
            setLoading(false);
            if (rs.responseCode === HTTP_STATUS_RESPONSE_KEY.SUCCESS) {
                message.success(`${t(i18nKey.validation.emailOrPassword.changePasswordSuccess)}`);
                setChangePassword(true);
            }
            if (rs.responseCode === HTTP_STATUS_RESPONSE_KEY.BAD_REQUEST) {
                setLoading(false);
                message.error(
                    `${t(i18nKey.validation.account.activationLinkExpired)}`
                );
            }
        }).catch(e => console.log(e));
    };

    const onFormFinish = async (values: IChangePasswordBody) => {
        if (token) {
            setLoading(true);
            return (isNewUser === 'true') ? changePasswordNew(values) : handleChangePassword(values);
        }
    };

    const onFinishFailed = () => {
        message.error(`${t(i18nKey.validation.emailOrPassword.changePasswordFail)}`);
    };

    return (
        <div className={styles.changePassword}>
            {
                !changePassword ? (
                    <Form
                        layout="vertical"
                        form={loginForm}
                        onFinish={onFormFinish}
                        onFinishFailed={onFinishFailed}
                        style={{
                            width: '100%'
                        }}>
                        <Row>
                            <Col span={24}>
                                <div className={styles.changePassword_title}>
                                    <Typography.Title level={1}>{t(i18nKey.loginPage.createNewPasswordTitle)}</Typography.Title>
                                </div>
                            </Col>
                        </Row>

                        <Row>
                            <Col span={24}>
                                <Form.Item
                                    name="newPassword"
                                    label={t(i18nKey.loginPage.label.newPassword)}
                                    rules={[
                                        {
                                            required: true,
                                            message: `${t(i18nKey.validation.common.requiredField)}`,
                                        },
                                        {
                                            pattern: new RegExp(PASSWORD_VALIDATION_RULES.REGEX),
                                            message: `${t(i18nKey.validation.emailOrPassword.passwordPattern)}`
                                        }
                                    ]}
                                >
                                    <Input type='password' prefix={<img src={IconPassword} />} tabIndex={1} />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <Form.Item
                                    name="confirmPassword"
                                    label={t(i18nKey.loginPage.label.confirmNewPassword)}
                                    dependencies={['newPassword']}
                                    rules={[
                                        {
                                            required: true,
                                            message: `${t(i18nKey.validation.common.requiredField)}`,
                                        },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (!value || getFieldValue('newPassword') === value) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(new Error(`${t(i18nKey.validation.emailOrPassword.passwordDoNotMatch)}`));
                                            },
                                        }),
                                    ]}
                                >
                                    <Input type='password' prefix={<img src={IconPassword} />} tabIndex={2} />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <Button block htmlType='submit' type='primary' tabIndex={5} loading={loading}>
                                    <b>{t(i18nKey.loginPage.button.createPassword)}</b>
                                </Button>
                                <Link to={PAGE_ROUTE.LOGIN} className={styles.changePassword_back}>
                                    <Button>
                                        <b>{t(i18nKey.loginPage.button.back)}</b>
                                    </Button>
                                </Link>
                            </Col>
                        </Row>
                    </Form>
                )
                    : (
                        <div style={{ width: '100%' }}>
                            <Row style={{ textAlign: 'center' }}>
                                <Col span={24}>
                                    <img src={IconSuccess} />
                                </Col>
                                <Col span={24}>
                                    <div className={styles.changePassword_title}>
                                        <Typography.Title level={1}>{t(i18nKey.accountEntity.title.changePassword)}</Typography.Title>
                                    </div>
                                </Col>
                                <Col span={24}>
                                    <div className={styles.changePassword_desc}>
                                        {t(i18nKey.validation.emailOrPassword.changePasswordSuccess)}
                                    </div>
                                </Col>
                                <Col span={24}>
                                    <Link to={PAGE_ROUTE.LOGIN}>
                                        <Button className={styles.btnBack} type='primary' block><b>{t(i18nKey.loginPage.loginTitle)}</b></Button>
                                    </Link>
                                </Col>
                            </Row>
                        </div>
                    )
            }
        </div>
    );
};

export default observer(ChangePassword);