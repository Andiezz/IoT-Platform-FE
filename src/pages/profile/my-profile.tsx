import React, { FC, useEffect, useState } from 'react';
import { i18nKey } from 'src/locales/i18n';
import { useTranslation } from 'react-i18next';
import {
  Avatar,
  Button,
  Col,
  Form,
  Grid,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Spin,
  Typography,
  Upload,
  message
} from 'antd';
import styles from './my-profile.module.less';
import WhiteBox from 'src/components/white-box/white-box';
import ImgCrop from 'antd-img-crop';
import { RcFile } from 'antd/es/upload';
import { UploadRequestOption } from 'rc-upload/lib/interface';
import HeaderTitleContent from 'src/components/header-title-content/header-title-content';
import { observer } from 'mobx-react-lite';
import useService from 'src/hooks/use-service';
import { IUserService } from 'src/services/user.service';
import { IUserInfo } from 'src/interfaces/user';
import useStore from 'src/hooks/use-store';
import { IUserStore } from 'src/store/user.store';
import { HTTP_STATUS_RESPONSE_KEY } from 'src/constants/api';
import { phoneCountryCode } from 'src/constants/list-option';
import { ALPHABETICAL_REGEX } from 'src/constants/validation';
import Widget from 'src/components/widget/widget';
import { PAGE_ROUTE } from 'src/constants/route';
import { useNavigate } from 'react-router-dom';
import { normalizeInputBlockCharacter } from 'src/helpers/common.utils';

const ProfilePage: FC = () => {
  const [form] = Form.useForm();
  const [t] = useTranslation();
  const navigator = useNavigate();
  const [avatar, setAvatar] = useState<Blob | null>();
  const userService: IUserService = useService('userService');
  const userStore: IUserStore = useStore('userStore');
  const [loading, setLoading] = useState<boolean>(false);
  const screen = Grid.useBreakpoint();
  const [open, setOpen] = useState(false);
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [isFormChange, setIsFormChange] = useState(false);

  const getProfile = async () => {
    const res = await userService.getUserProfile();
    if (res.responseCode === HTTP_STATUS_RESPONSE_KEY.SUCCESS) {
      userStore.updateUserInfo(res.data as IUserInfo);
    }
  };

  const handleUpdateProfile = async (values: IUserInfo) => {
    const formData = new FormData();
    avatar && formData.append('file', avatar);
    formData.append('first_name', values.first_name.trim());
    formData.append('last_name', values.last_name.trim());
    formData.append('phone_number', values.phone_number);
    formData.append('phone_code', values.phone_code);

    setLoading(true);
    await userService
      .updateUserProfile(formData)
      .then((res) => {
        setLoading(false);
        if (res.responseCode === HTTP_STATUS_RESPONSE_KEY.SUCCESS) {
          message.success(t(i18nKey.validation.common.toastUpdateSuccess));
          setOpen(false);
          setIsFormChange(false);
          getProfile();
        } else {
          setIsFormChange(false);
          message.error(t(i18nKey.validation.common.toastUpdateFail));
        }
      })
      .catch((e) => console.log(e));
  };

  const beforeCrop = (file: RcFile) => {
    const isAllowedFileTypes =
      file.type === 'image/jpeg' ||
      file.type === 'image/png' ||
      file.type === 'image/jpg';
    if (!isAllowedFileTypes) {
      message.error(t(i18nKey.validation.account.invalidImageFileTypes));

      return false;
    }

    const isExceededMaxFileSize = file.size / 1024 / 1024 < 2;
    if (!isExceededMaxFileSize) {
      message.error(
        t(i18nKey.validation.account.avatarUploadSizeError, { maxsize: 2 })
      );
      return false;
    }
    return true;
  };

  useEffect(() => {
    getProfile();
  }, []);

  useEffect(() => {
    if (userStore.userInfo) {
      form.setFieldsValue({
        role: t(i18nKey.permissionEntity.roleKeyToText[userStore.userInfo?.role.role]),
        first_name: userStore.userInfo?.first_name,
        last_name: userStore.userInfo?.last_name,
        phone_number: userStore.userInfo?.phone_number,
        phone_code: userStore.userInfo?.phone_code,
        email: userStore.userInfo?.email,
      })
    }
  }, [userStore.userInfo]);

  const handChangeRequest = (options: UploadRequestOption) => {
    setAvatar(options.file as Blob);
    return true;
  };

  const handleCancel = () => {
    navigator(`${PAGE_ROUTE.DASHBOARD}`);
  };

  const onCancelConfirm = () => {
    setOpen(false);
  };

  const handleOpenConfirm = (isUpdate: boolean) => {
    setOpen(true);
    setIsUpdate(isUpdate);
  };

  const handleClickForm = () => {
    form.submit();
  };

  return (
    <div className={styles.wrapper_form}>
      <Spin spinning={loading}>
        <HeaderTitleContent
          title={`${t(i18nKey.accountEntity.title.settings)}`}>
          <Space>
            <Button
              onClick={() => {
                handleOpenConfirm(false);
              }}>
              {t(i18nKey.button.cancel)}
            </Button>
            <Button
              type="primary"
              disabled={!isFormChange}
              onClick={() => {
                handleOpenConfirm(true);
              }}>
              {t(i18nKey.button.update)}
            </Button>
          </Space>
        </HeaderTitleContent>
        <Widget>
          <Form
            className={styles.formProfile}
            onChange={() => setIsFormChange(true)}
            form={form}
            onFinish={handleUpdateProfile}
            layout="vertical"
            initialValues={{
              ...userStore.userInfo,
              role: userStore.userInfo?.role?.name
            }}>
            <Row>
              <Col xxl={14}>
                <Row className={styles.changeAvatar}>
                  <Col xs={24}>
                    <WhiteBox>
                      <div className={styles.uploadImg}>
                        <ImgCrop cropShape="round" beforeCrop={beforeCrop}>
                          <Upload
                            accept="image/jpeg, image/png, image/jpg"
                            maxCount={1}
                            showUploadList={false}
                            customRequest={handChangeRequest}>
                            {avatar || userStore.userInfo?.avatar ? (
                              <Avatar
                                size={100}
                                src={
                                  (avatar && URL.createObjectURL(avatar)) ||
                                  userStore.userInfo?.avatar
                                }
                              />
                            ) : (
                              <Avatar
                                style={{ backgroundColor: '#BCBCC0' }}
                                size={100}>{`${
                                userStore?.userInfo?.first_name &&
                                userStore?.userInfo?.first_name
                                  .toUpperCase()
                                  .trim()[0]
                              }${
                                userStore.userInfo?.last_name &&
                                userStore.userInfo?.last_name
                                  .toUpperCase()
                                  .trim()[0]
                              }`}</Avatar>
                            )}

                            <p style={{ cursor: 'pointer', color: '#848484' }}>
                              {t(i18nKey.accountEntity.button.changeAvatar)}
                            </p>
                          </Upload>
                        </ImgCrop>
                      </div>
                    </WhiteBox>
                  </Col>
                </Row>
                <WhiteBox>
                  <Row gutter={[24, 12]}>
                    <Col xxl={12} xs={24}>
                      <Form.Item
                        required={true}
                        name="first_name"
                        rules={[
                          {
                            required: true,
                            message: `${t(
                              i18nKey.validation.common.requiredField
                            )}`
                          },
                          {
                            validator: (_, value) => {
                              if (
                                value &&
                                !new RegExp(ALPHABETICAL_REGEX).test(value.trim())
                              ) {
                                return Promise.reject(
                                  `${t(
                                    i18nKey.validation.account
                                      .alphabeticalValidation
                                  )}`
                                );
                              }
                              return Promise.resolve();
                            }
                          }
                        ]}
                        label={t(i18nKey.accountEntity.label.firstName)}>
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col xxl={12} xs={24}>
                      <Form.Item
                        required={true}
                        name="last_name"
                        rules={[
                          {
                            required: true,
                            message: `${t(
                              i18nKey.validation.common.requiredField
                            )}`
                          },
                          {
                            validator: (_, value) => {
                              if (
                                value &&
                                !new RegExp(ALPHABETICAL_REGEX).test(value.trim())
                              ) {
                                return Promise.reject(
                                  `${t(
                                    i18nKey.validation.account
                                      .alphabeticalValidation
                                  )}`
                                );
                              }
                              return Promise.resolve();
                            }
                          }
                        ]}
                        label={t(i18nKey.accountEntity.label.lastName)}>
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={[24, 12]}>
                    <Col xxl={12} xs={24}>
                      <Form.Item
                        required={true}
                        name="email"
                        rules={[
                          {
                            required: true,
                            message: t(
                              i18nKey.validation.common.requiredField
                            ) as string
                          }
                        ]}
                        label={t(i18nKey.label.email)}>
                        <Input disabled />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={[24, 12]}>
                    <Col xxl={12} xs={24}>
                      <Row wrap={false} gutter={[12, 12]}>
                        <Col style={{ flexBasis: '130px' }}>
                          <Form.Item
                            required={true}
                            name="phone_code"
                            rules={[
                              {
                                required: true,
                                message: `${t(
                                  i18nKey.validation.common.requiredField
                                )}`
                              }
                            ]}
                            label={t(i18nKey.accountEntity.label.countryCode)}>
                            <Select options={phoneCountryCode} />
                          </Form.Item>
                        </Col>
                        <Col flex={1} className={styles.phonNumber}>
                          <Form.Item
                            required={true}
                            name="phone_number"
                            normalize={normalizeInputBlockCharacter}
                            rules={[
                              {
                                required: true,
                                message: `${t(
                                  i18nKey.validation.common.requiredField
                                )}`
                              }
                            ]}
                            label={t(i18nKey.accountEntity.label.phoneNumber)}>
                            <Input />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Col>
                    <Col xxl={12} xs={24}>
                      <Form.Item
                        required={true}
                        name="role"
                        label={t(i18nKey.label.role)}>
                        <Select disabled />
                      </Form.Item>
                    </Col>
                  </Row>
                </WhiteBox>
              </Col>
            </Row>
          </Form>
        </Widget>
        {screen.xs && (
          <Row
            justify={'center'}
            gutter={10}
            align={'middle'}
            className={styles.footerBtn}>
            <Col span={12}>
              {' '}
              <Button
                block
                // style={{
                //   width: '100%'
                // }}
                onClick={() => {
                  handleOpenConfirm(false);
                }}>
                {t(i18nKey.button.cancel)}
              </Button>
            </Col>
            <Col span={12}>
              <Button
                block
                // style={{
                //   width: '100%'
                // }}
                type="primary"
                disabled={!isFormChange}
                onClick={() => {
                  handleOpenConfirm(true);
                }}>
                {t(i18nKey.button.update)}
              </Button>
            </Col>
          </Row>
        )}
      </Spin>
      <Modal
        centered
        wrapClassName={styles.bodyModal}
        open={open}
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
                  onClick={isUpdate ? handleClickForm : handleCancel}
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

export default observer(ProfilePage);
