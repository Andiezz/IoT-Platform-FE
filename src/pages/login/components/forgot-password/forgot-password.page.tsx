import React, { useState } from 'react';
import { i18nKey } from 'src/locales/i18n';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';
import { Button, Col, Form, Input, Row, Typography, message } from 'antd';
import styles from './forgot-password.module.less';
import IconEmail from 'src/assets/icons/Login-mail.svg';
import IconSendEmail from 'src/assets/icons/Forgot-mail.svg';
import { Link } from 'react-router-dom';
import { PAGE_ROUTE } from 'src/constants/route';
import { IAuthenticationService } from 'src/services/authentication.service';
import useService from 'src/hooks/use-service';
import { ForgotPasswordDTO, IForgotPasswordBody } from 'src/dto/forgot-password.dto';
import { messageResponse } from 'src/constants/message-response';
const ForgotPassword: React.FC = () => {

    const [t] = useTranslation();
    const authService: IAuthenticationService = useService('authenticationService');
    const [submitting, setSubmitting] = useState(false);
    const [loginForm] = Form.useForm();
    const [sendMail, setSendMail] = useState(false);

    const onFormFinish = async (values: IForgotPasswordBody) => {
        setSubmitting(true);
        const forgotDTO = new ForgotPasswordDTO(values);
        await authService.forgotPassword(forgotDTO).then((rs: boolean | string) => {
            setSubmitting(false);
            if (rs === true) {
                message.success(`${t(i18nKey.validation.emailOrPassword.sendMailResultSuccess)}`);
                setSendMail(true);
            }
            if(`${rs}` === messageResponse.inactiveAccountNotification){
                message.error(`${t(i18nKey.messageIndicator.resetPasswordUnavailable)}`)
            }
        });
    };

    const onFinishFailed = () => {
        message.error(`${t(i18nKey.validation.emailOrPassword.sendMailResultFail)}`);
    };


    return (
        <>
            {
                !sendMail ? (
                    <Form
                        layout="vertical"
                        form={loginForm}
                        onFinish={onFormFinish}
                        onFinishFailed={onFinishFailed}
                        style={{
                            width: '100%'
                        }}
                        className={styles.resetPassword}>
                        <Row>
                            <Col span={24}>
                                <div className={styles.resetPassword_title}>
                                    <Typography.Title level={1}>{t(i18nKey.loginPage.resetPasswordTitle)}</Typography.Title>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <div className={styles.resetPassword_desc}>
                                    {t(i18nKey.loginPage.label.resetPasswordDESCR)}
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <Form.Item
                                    name={'email'}
                                    label={t(i18nKey.loginPage.label.email)}
                                    required={true}
                                    rules={[
                                        {
                                            required: true,
                                            message: `${t(i18nKey.validation.common.requiredField)}`
                                        },
                                        {
                                            type: 'email',
                                            message: `${t(i18nKey.validation.emailOrPassword.invalidEmail)}`
                                        }
                                    ]}>
                                    <Input prefix={
                                        <img src={IconEmail} />} placeholder={`${t(i18nKey.loginPage.placeholder.email)}`}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <Button block htmlType='submit' type='primary' tabIndex={5} loading={submitting}>
                                    <b>{t(i18nKey.loginPage.button.requestPasswordReset)}</b>
                                </Button>
                                <Link to={PAGE_ROUTE.LOGIN} className={styles.resetPassword_btn_back}>
                                    <Button >
                                        <b>{t(i18nKey.loginPage.button.backToLogin)}</b>
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
                                    <img src={IconSendEmail} />
                                </Col>
                                <Col span={24}>
                                    <div className={styles.resetPassword_title}>
                                        <Typography.Title level={1}>{t(i18nKey.loginPage.label.checkYourEmail)}</Typography.Title>
                                    </div>
                                </Col>
                                <Col span={24}>
                                    <div className={styles.resetPassword_desc}>
                                        {t(i18nKey.loginPage.label.checkYourEmailDESCR)}
                                    </div>
                                </Col>
                                <Col span={24}>
                                    <Link to={PAGE_ROUTE.LOGIN}>
                                        <Button className={styles.resetPassword_btn_backBoder} block><b>{t(i18nKey.loginPage.button.back)}</b></Button>
                                    </Link>
                                </Col>
                            </Row>
                        </div>
                    )
            }
        </>

    );
};

export default observer(ForgotPassword);