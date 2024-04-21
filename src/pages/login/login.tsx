import React, { useEffect, useState } from 'react';
import { i18nKey } from 'src/locales/i18n';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  Row,
  Typography,
  message
} from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import CustomPassword from 'src/components/custom-password/custom-password';
import { PAGE_ROUTE } from 'src/constants/route';
import styles from './login.module.less';
import { observer } from 'mobx-react-lite';
import { ILoginForm } from 'src/interfaces/form/user';
import { IAuthenticationService } from 'src/services/authentication.service';
import useService from 'src/hooks/use-service';
import IconEmail from 'src/assets/icons/Login-mail.svg';
import IconProfile from 'src/assets/icons/Login-profile.svg';
import { ILoginResponse, LogInDTO } from 'src/dto/authentication.dto';
import { messageResponse } from 'src/constants/message-response';
import useStore from 'src/hooks/use-store';
import { ITenantListStore } from 'src/store/tenant/tenant-list.store';
import { ITenantListRequest } from 'src/dto/tenant-list.dto';
import { ResponseDTO } from 'src/dto/base.dto';
import { HTTP_STATUS_RESPONSE_KEY } from 'src/constants/api';

const LoginPage: React.FC = () => {
  const authService: IAuthenticationService = useService(
    'authenticationService'
  );
  const tenantListStore: ITenantListStore = useStore('listTenantStore');
  const [loginForm] = Form.useForm();

  const [iconEmail, setIconEmail] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [t] = useTranslation();
  const navigator = useNavigate();
  const fetchData = async (request?: ITenantListRequest) => {
    try {
      await tenantListStore.fetchListNoPermission(request);
    } catch (error) {
      throw Error;
    }
  };

  const onFormFinish = async (values: ILoginForm) => {
    setSubmitting(true);
    const loginDTO = new LogInDTO({
      ...values
    });
    await authService
      .login(loginDTO)
      .then(async (rs: ResponseDTO<ILoginResponse>) => {
        setSubmitting(false);
        if (rs.responseCode === HTTP_STATUS_RESPONSE_KEY.SUCCESS) {
          await fetchData({ limit: 15 });
          message.success(`${t(i18nKey.validation.common.loginSuccess)}`);
        }
        if (rs.message === messageResponse.inactiveAccountNotification) {
          message.error(
            `${t(i18nKey.validation.account.inactiveAccountNotification)}`
          );
        }
        if (
          rs.message === messageResponse.invalidPassword ||
          rs.message === messageResponse.userNotFound
        ) {
          message.error(
            `${t(i18nKey.validation.emailOrPassword.invalidEmailOrPassword)}`
          );
        }
        if (rs.message === messageResponse.Unauthorized) {
          message.error(
            `${t(i18nKey.validation.emailOrPassword.invalidEmailOrPassword)}`
          );
        }
        if(rs.message === 'account-is-not-active'){
          message.error(`${i18nKey.validation.account.inactiveAccountNotification}`)
        }
      });
  };

  const forcus = () => {
    setIconEmail(true);
  };

  useEffect(() => {
    if (authService.isAuthenticated) {
      navigator(
        `${PAGE_ROUTE.DASHBOARD}overview/tenant/${tenantListStore?.listTenantAccount[0]?._id}`
      );
    }
  }, [tenantListStore.listTenantAccount]);

  return (
    <Form
      layout="vertical"
      form={loginForm}
      onFinish={onFormFinish}
      autoComplete="off"
      style={{
        width: '100%'
      }}>
      <Row>
        <Col span={24}>
          <div className={styles.title}>
            <Typography.Title level={1}>
              {t(i18nKey.loginPage.loginTitle)}
            </Typography.Title>
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
            <Input
              prefix={<img src={iconEmail ? IconProfile : IconEmail} />}
              tabIndex={1}
              placeholder={`${t(i18nKey.loginPage.placeholder.email)}`}
              onFocus={forcus}
              disabled={submitting}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Form.Item required label={t(i18nKey.loginPage.label.password)}>
            <CustomPassword
              name="password"
              rules={[
                {
                  required: true,
                  message: `${t(i18nKey.validation.common.requiredField)}`
                }
              ]}
              tabIndex={2}
              placeholder={`${t(i18nKey.loginPage.placeholder.password)}`}
              disabled={submitting}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <Form.Item
            name={'rememberMe'}
            valuePropName="checked"
            style={{ height: '100%' }}
            className={styles.centerV}>
            <Checkbox tabIndex={3}>
              {t(i18nKey.loginPage.button.rememberMe)}
            </Checkbox>
          </Form.Item>
        </Col>
        <Col span={12} className={`${styles.centerV} ${styles.forgotLink}`}>
          <Link to={PAGE_ROUTE.FORGOT_PASSWORD} tabIndex={4}>
            {t(i18nKey.loginPage.button.forgotPassword)}
          </Link>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Button
            block
            htmlType="submit"
            type="primary"
            tabIndex={5}
            loading={submitting}>
            <b>{t(i18nKey.loginPage.button.login)}</b>
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default observer(LoginPage);
