import React, { useEffect, useState } from 'react';
import {
  Button,
  Col,
  Form,
  Input,
  Layout,
  Modal,
  Radio,
  Row,
  Select,
  Space,
  Spin,
  Typography,
  message
} from 'antd';
import { i18nKey } from 'src/locales/i18n';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Widget from 'src/components/widget/widget';
import { HTTP_STATUS_RESPONSE_KEY } from 'src/constants/api';
import { phoneCountryCode } from 'src/constants/list-option';
import { PAGE_ROUTE } from 'src/constants/route';
import {
  PHONE_NUMBER_REGEX,
  ALPHABETICAL_REGEX
} from 'src/constants/validation';
import {
  BodyCreateAccountDTO,
  BodyUpdateAccountDTO,
  ResponseAccountDTO
} from 'src/dto/account-management-list.dto';
import { ResponseDTO } from 'src/dto/base.dto';
import useStore from 'src/hooks/use-store';
import { Role } from 'src/interfaces/user';
import { IAccountListStore } from 'src/store/account-management/account-management-list.store';
import styles from './create-account-form.module.less';
import WidgetHeader from 'src/components/widget-header/widget-header';
import { messageResponse } from 'src/constants/message-response';

const CreateAccountForm: React.FC = () => {
  const [t] = useTranslation();
  const navigator = useNavigate();
  const params = useParams();
  const [form] = Form.useForm();
  const [openModal, setModal] = useState<boolean>(false);
  const [isCreateOrUpdate, setIsCreateOrUpdate] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const isUpdateAccount = !!params.id;
  const accountManagementListStore: IAccountListStore = useStore(
    'listAccountManagementListStore'
  );
  const location = useLocation();

  useEffect(() => {
    accountManagementListStore.getRole();
  }, []);

  useEffect(() => {
    if (location.state?.emailCreate) {
      form.setFieldValue('email', location.state?.emailCreate);
    }
  }, [location.state?.emailCreate]);

  useEffect(() => {
    if (params.id) {
      accountManagementListStore
        .getDetailAccount({ id: params.id })
        .then((rs) => {
          if (rs.responseCode === HTTP_STATUS_RESPONSE_KEY.SUCCESS) {
            form.setFieldValue('firstName', rs?.data?.firstName);
            form.setFieldValue('lastName', rs?.data?.lastName);
            form.setFieldValue('status', !!rs?.data?.isActive);
            form.setFieldValue('phoneCode', rs?.data?.phoneCode);
            form.setFieldValue('phoneNumber', rs?.data?.phoneNumber);
            form.setFieldValue('email', rs?.data?.email);
            form.setFieldValue('role', rs?.data?.role);
          }
        });
    }
  }, [params.id]);

  const onClickForm = async () => {
    setIsCreateOrUpdate(true);
    await form
      .validateFields()
      .then(() => setModal(true))
      .catch(() => {
        setModal(false);
      });
  };
  const handleCreateAccount = async (values: any) => {
    try {
      const bodyPayload: BodyCreateAccountDTO = {
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        email: values.email,
        phoneNumber: values.phoneNumber,
        phoneCode: values.phoneCode,
        role: values.role
      };
      setLoading(true);
      const res: ResponseDTO<ResponseAccountDTO> =
        await accountManagementListStore.createAccount(bodyPayload);
      if (res.message === messageResponse.createAccount.existingEmail) {
        return message.error(t(i18nKey.validation.account.existingEmail));
      }
      if (res.responseCode === HTTP_STATUS_RESPONSE_KEY.SUCCESS) {
        form.resetFields();
        message.success(t(i18nKey.validation.common.toastCreateSuccess));
        navigator(`${PAGE_ROUTE.ACCOUNT_MANAGEMENT}`);
      } else {
        message.error(t(i18nKey.validation.common.toastCreateFail));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAccount = async (values: any) => {
    const bodyPayload: BodyUpdateAccountDTO = {
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      email: values.email,
      phoneNumber: values.phoneNumber,
      phoneCode: values.phoneCode,
      role: values.role,
      isActive: values.status
    };
    setLoading(true);
    if (params.id) {
      const res = await accountManagementListStore.updateAccount(bodyPayload, {
        id: params.id
      });
      if (res.responseCode === HTTP_STATUS_RESPONSE_KEY.SUCCESS) {
        message.success(t(i18nKey.validation.common.toastUpdateSuccess));
        navigator(`${PAGE_ROUTE.ACCOUNT_MANAGEMENT}`);
      } else {
        message.error(t(i18nKey.validation.common.toastUpdateFail));
      }
    }
    setLoading(false);
  };

  const onCancel = () => {
    setModal(false);
  };
  const onSubmit = () => {
    form.submit();
    setModal(false);
  };
  const openConfirmCancel = () => {
    setIsCreateOrUpdate(false);
    setModal(true);
  };
  const onClickCancel = () => {
    navigator(`${PAGE_ROUTE.ACCOUNT_MANAGEMENT}`);
  };
  return (
    <div className={styles.wrapperForm}>
      <Spin spinning={loading}>
        <Modal
          centered
          wrapClassName={styles.bodyModal}
          open={openModal}
          closable={false}
          onCancel={onCancel}
          width={343}
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
                    onClick={isCreateOrUpdate ? onSubmit : onClickCancel}
                    className={styles.footer_submit}>
                    {t(i18nKey.button.ok)}
                  </Button>
                </Col>
              </Row>
            </div>
          }>
          <div className={styles.header}>
            <Typography className={styles.header_title}>
              {(() => {
                if (!isCreateOrUpdate) {
                  return t(i18nKey.button.cancel);
                }
                if (isUpdateAccount) {
                  return t(i18nKey.accountEntity.title.updateAccount);
                }
                return t(i18nKey.accountEntity.title.createAccount);
              })()}
            </Typography>
            <span className={styles.header_desc}>
              {(() => {
                if (!isCreateOrUpdate) {
                  return t(i18nKey.confirmationPopup.cancel);
                }
                if (isUpdateAccount) {
                  return t(i18nKey.confirmationPopup.update);
                }
                return t(i18nKey.confirmationPopup.create);
              })()}
            </span>
          </div>
        </Modal>
        <WidgetHeader>
          <Row
            justify={'space-between'}
            align={'middle'}
            className={styles.wrapperForm_header}>
            <Col>
              <Typography.Title
                className={styles.wrapperForm_header_title}
                level={2}>
                {isUpdateAccount
                  ? `${t(i18nKey.accountEntity.title.updateAccount)}`
                  : `${t(i18nKey.accountEntity.title.createAccount)}`}
              </Typography.Title>
            </Col>
            <Col
              className={styles.wrapperForm_header_btn}
              sm={0}
              xs={0}
              md={12}
              lg={12}
              xl={12}
              xxl={12}>
              <Space>
                <Button className={styles.cancel} onClick={openConfirmCancel}>
                  {t(i18nKey.button.cancel)}
                </Button>
                {isUpdateAccount ? (
                  <Button
                    className={styles.primary}
                    onClick={onClickForm}
                    type="primary">
                    {t(i18nKey.button.update)}
                  </Button>
                ) : (
                  <Button
                    className={styles.primary}
                    onClick={onClickForm}
                    type="primary">
                    {t(i18nKey.button.create)}
                  </Button>
                )}
              </Space>
            </Col>
          </Row>
        </WidgetHeader>
        <Widget>
          <Row style={{ width: '100%' }}>
            <Col sm={24} xs={24} md={24} lg={16} xl={16} xxl={14}>
              <Form
                form={form}
                initialValues={{
                  role: accountManagementListStore.listRole.find(
                    (item) => item.role === Role.USER
                  )?._id,
                  phoneCode: '+1'
                }}
                onFinish={params.id ? handleUpdateAccount : handleCreateAccount}
                layout="vertical">
                <div className={styles.subForm}>
                  <Row gutter={[24, 12]}>
                    <Col md={12} lg={12} xl={12} xxl={12} sm={24} xs={24}>
                      <Form.Item
                        required={true}
                        name="firstName"
                        label={t(i18nKey.accountEntity.label.firstName)}
                        rules={[
                          {
                            validator: (_, value) => {
                              if (!value) {
                                return Promise.reject(
                                  `${t(
                                    i18nKey.validation.common.requiredField
                                  )}`
                                );
                              }
                              if (
                                !value.trim() ||
                                !new RegExp(ALPHABETICAL_REGEX).test(value)
                              ) {
                                return Promise.reject(
                                  t(
                                    i18nKey.validation.account
                                      .alphabeticalValidation
                                  ) as string
                                );
                              }
                              return Promise.resolve();
                            }
                          }
                        ]}>
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col xxl={12} xs={24}>
                      <Form.Item
                        required={true}
                        name="lastName"
                        label={t(i18nKey.accountEntity.label.lastName)}
                        rules={[
                          {
                            validator: (_, value) => {
                              if (!value) {
                                return Promise.reject(
                                  `${t(
                                    i18nKey.validation.common.requiredField
                                  )}`
                                );
                              }
                              if (
                                !value.trim() ||
                                !new RegExp(ALPHABETICAL_REGEX).test(value)
                              ) {
                                return Promise.reject(
                                  t(
                                    i18nKey.validation.account
                                      .alphabeticalValidation
                                  ) as string
                                );
                              }
                              return Promise.resolve();
                            }
                          }
                        ]}>
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={[24, 12]}>
                    <Col xxl={24} xs={24}>
                      <Form.Item
                        required={true}
                        name="email"
                        label={t(i18nKey.label.email)}
                        rules={[
                          {
                            required: true,
                            message: t(
                              i18nKey.validation.common.requiredField
                            ) as string
                          },
                          {
                            type: 'email',
                            message: t(
                              i18nKey.validation.emailOrPassword.invalidEmail
                            ) as string
                          }
                        ]}>
                        <Input disabled={!!params.id} />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={[24, 12]}>
                    <Col xxl={12} xs={24}>
                      <Row gutter={[16, 16]}>
                        <Col xxl={10} xs={10}>
                          <Form.Item
                            required={true}
                            name="phoneCode"
                            label={t(i18nKey.accountEntity.label.countryCode)}
                            rules={[
                              {
                                required: true,
                                message: t(
                                  i18nKey.validation.common.requiredField
                                ) as string
                              }
                            ]}>
                            <Select
                              options={phoneCountryCode}
                              showSearch
                              filterOption={(input, option) =>
                                (option?.label ?? '')
                                  .toLowerCase()
                                  .includes(input.toLowerCase())
                              }
                            />
                          </Form.Item>
                        </Col>
                        <Col xxl={14} xs={14}>
                          <Form.Item
                            required={true}
                            name="phoneNumber"
                            label={t(i18nKey.accountEntity.label.phoneNumber)}
                            rules={[
                              {
                                required: true,
                                message: t(
                                  i18nKey.validation.common.requiredField
                                ) as string
                              },
                              {
                                pattern: PHONE_NUMBER_REGEX,
                                message: t(
                                  i18nKey.validation.account.phoneValidation
                                ) as string
                              }
                            ]}>
                            <Input />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Col>
                    <Col xxl={12} xs={24}>
                      <Form.Item
                        required={true}
                        name="role"
                        rules={[
                          {
                            required: true,
                            message: t(
                              i18nKey.validation.common.requiredField
                            ) as string
                          }
                        ]}
                        label={t(i18nKey.label.role)}>
                        <Select
                          options={accountManagementListStore.listRole.map(
                            (item) => ({
                              value: item.name,
                              label: `${t(
                                i18nKey.accountEntity.roleKeyToText[item.role]
                              )}`,
                              key: `${t(
                                i18nKey.accountEntity.roleKeyToText[item.role]
                              )}`
                            })
                          )}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  {params.id && (
                    <Row>
                      <Col span={24}>
                        <Form.Item
                          name="status"
                          label={t(i18nKey.label.status)}
                          rules={[
                            {
                              required: true,
                              message: t(
                                i18nKey.validation.common.requiredField
                              ) as string
                            }
                          ]}>
                          <Radio.Group>
                            <Radio value={true}>
                              {t(i18nKey.status.active)}
                            </Radio>
                            <Radio value={false}>
                              {t(i18nKey.status.inactive)}
                            </Radio>
                          </Radio.Group>
                        </Form.Item>
                      </Col>
                    </Row>
                  )}
                </div>
              </Form>
            </Col>
            <Col sm={24} xs={24} md={0} lg={0} xl={0} xxl={0}>
              <Layout className={styles.wrapperForm_layout}>
                <Layout.Footer>
                  <Row gutter={24} justify={'space-between'}>
                    <Col className={styles.wrapperForm_layout_btn} span={12}>
                      <Button
                        className={styles.cancel}
                        onClick={openConfirmCancel}>
                        {t(i18nKey.button.cancel)}
                      </Button>
                    </Col>
                    <Col className={styles.wrapperForm_layout_btn} span={12}>
                      {isUpdateAccount ? (
                        <Button
                          className={styles.primary}
                          onClick={onClickForm}
                          type="primary">
                          {t(i18nKey.button.update)}
                        </Button>
                      ) : (
                        <Button
                          className={styles.primary}
                          onClick={onClickForm}
                          type="primary">
                          {t(i18nKey.button.create)}
                        </Button>
                      )}
                    </Col>
                  </Row>
                </Layout.Footer>
              </Layout>
            </Col>
          </Row>
        </Widget>
      </Spin>
    </div>
  );
};

export default observer(CreateAccountForm);
