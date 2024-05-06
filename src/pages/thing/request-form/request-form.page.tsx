import {
  Button,
  Col,
  Form,
  Grid,
  Layout,
  Modal,
  Row,
  Spin,
  Typography,
  message
} from 'antd';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import RegistrationContent from 'src/components/dashboard/common-widget/registration-widget/content/content.page';
import { HTTP_STATUS_RESPONSE_KEY } from 'src/constants/api';
import { PAGE_ROUTE } from 'src/constants/route';
import { IBodyGetUserAssignByEmail } from 'src/dto/account-management-list.dto';
import {
  BodyCreateThingDTO,
  IDevice,
  ILocation,
  IManager
} from 'src/dto/thing.dto';
import useStore from 'src/hooks/use-store';
import { i18nKey } from 'src/locales/i18n';
import { IThingListStore } from 'src/store/thing.store';
import ThingInfoForm from './thingInfo/thing-info.page';
import styles from './request-form.module.less';
import ToastifyConfirm from 'src/components/toastify-confirm/toastify-confirm';
import CustomModal from 'src/components/custom-modal/CustomModal';
import { CheckCircleTwoTone } from '@ant-design/icons';
import { messageResponse } from 'src/constants/message-response';
import { TypeFile } from 'src/constants/thing';

export interface IRequest {
  limit?: number;
  assigned?: boolean;
}

export interface MarkerLocation {
  address: string;
  lat: number;
  lng: number;
}

export interface Threshold {
  name: string;
  color: string;
  min: number;
  max: number;
}

export interface IParameterStandard {
  name: string;
  unit: string;
  weight: number;
  thresholds: Threshold[];
}

export interface IThingForm {
  devices: IDevice[];
  location: ILocation;
  name: string;
  information: string;
  managers?: IManager[];
}

export interface IDownloadObj {
  device: boolean;
  public: boolean;
  private: boolean;
  root: boolean;
  supplementary: boolean;
  coreIoT: boolean;
}

export interface IFile {
  type?: string;
  data?: number[];
}
export interface IFileDownload {
  file?: IFile;
  name?: string;
  type?: string;
}

const RequestForm: React.FC = () => {
  const [t] = useTranslation();
  const params = useParams();
  const navigator = useNavigate();
  const { Footer } = Layout;
  const [form] = Form.useForm<IThingForm>();
  const [isDisable, setIsDisable] = useState(true);
  const [markerLocation, setMarkerLocation] = useState<
    MarkerLocation | undefined
  >();
  const [dataThingDetail, setDataThingDetail] = useState<
    IThingForm | Partial<IThingForm>
  >({});
  const [loading, setLoading] = useState(false);
  const [openToastifyConfirm, setOpenToastifyConfirm] =
    useState<boolean>(false);
  const [action, setAction] = useState<'create' | 'update' | 'cancel'>(
    'cancel'
  );

  //store
  const dataThing: IThingListStore = useStore('listThingStore');
  const [downloadObj, setDownloadObj] = useState<IDownloadObj>({
    device: false,
    public: false,
    private: false,
    root: false,
    supplementary: false,
    coreIoT: false
  });
  const [deviceFile, setDeviceFile] = useState<IFileDownload>();
  const [publicFile, setPublicFile] = useState<IFileDownload>();
  const [privateFile, setPrivateFile] = useState<IFileDownload>();
  const [rootFile, setRootFile] = useState<IFileDownload>();
  const [supplementary, setSupplementary] = useState<IFileDownload>();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [openModalCreateAccount, setOpenModalCreateAccount] =
    useState<boolean>(false);
  const [emailNotFound, setEmailNotFound] = useState<string>('');
  const [visibleDropdownAddOwner, setVisibleDropdownAddOwner] = useState(false);
  const [visibleDropdownViewer, setVisibleDropdownViewer] = useState(false);
  const [status, setStatus] = useState<string>();

  const handleChangeVisibleAddOnwer = (visible: boolean) => {
    setVisibleDropdownAddOwner(visible);
  };
  const handleChangeVisibleAddViewer = (visible: boolean) => {
    setVisibleDropdownViewer(visible);
  };
  const [formInstanseAddOwner] = Form.useForm();
  const [formInstanseAddManager] = Form.useForm();
  const screen = Grid.useBreakpoint();

  const onChangeMarker = (marker: MarkerLocation) => {
    setMarkerLocation({ ...marker });
    setIsDisable(false);
  };

  useEffect(() => {
    if (markerLocation) {
      form.setFields([{ name: ['location', 'address'], errors: [] }]);
      form.setFieldValue(['location', 'address'], markerLocation.address);
    }
  }, [markerLocation]);

  useEffect(() => {
    if (params.id) {
      setLoading(true);
      dataThing.getDetailThing({ id: params.id }).then((rs) => {
        setLoading(false);
        if (rs.responseCode === HTTP_STATUS_RESPONSE_KEY.SUCCESS) {
          const resThingDetail = rs.data;

          const managers = resThingDetail?.managers.length
            ? resThingDetail.managers
            : [];
          const devices = resThingDetail?.devices.length
            ? resThingDetail?.devices.map((item) => {
                return {
                  name: item.name,
                  model: item.model,
                  parameterStandards: item.parameterStandards,
                  parameterStandardDefault: item.parameterStandardDefault
                };
              })
            : [
                {
                  name: '',
                  model: '',
                  parameterStandards: [],
                  parameterStandardDefault: ''
                }
              ];
          setStatus(resThingDetail?.status);
          const location = {
            address: resThingDetail?.location.address,
            name: resThingDetail?.location.name,
            latitude: resThingDetail?.location.latitude,
            longitude: resThingDetail?.location.longitude
          };
          const name = resThingDetail?.name;
          const information = resThingDetail?.information;
          setMarkerLocation({
            lat: resThingDetail?.location?.latitude as number,
            lng: resThingDetail?.location?.longitude as number,
            address: resThingDetail?.location?.address as string
          });
          setDataThingDetail({
            name,
            information,
            devices,
            managers,
            location
          } as IThingForm);
        }
      });
    }
  }, []);

  useEffect(() => {
    form.setFieldsValue({ ...dataThingDetail });
  }, [dataThingDetail]);

  const onFormFailed = () => {
    return 2;
  };

  const handleConfirmOk = () => {
    form.submit();
  };
  const handleCancelPopupConfirm = () => {
    setOpenToastifyConfirm(false);
    navigator(PAGE_ROUTE.THING_CENTER);
  };

  const renderType = (value: any) => {
    switch (value.type) {
      case TypeFile.Device:
        return setDeviceFile(value);
      case TypeFile.Private:
        return setPrivateFile(value);
      case TypeFile.Public:
        return setPublicFile(value);
      case TypeFile.Root:
        return setRootFile(value);
      case TypeFile.Supplementary:
        return setSupplementary(value);
    }
  };

  const handleCreateThing = async (values: IThingForm) => {
    try {
      setLoading(true);
      setOpenToastifyConfirm(false);
      const managers =
        (values?.managers?.map((manager) => {
          return {
            email: manager.email,
            isOwner: manager.isOwner,
            userId: manager._id
          };
        }) as IManager[]) || [];
      const devices = values.devices || [];

      const location = {
        ...values.location,
        latitude: Number(markerLocation?.lat ?? 0),
        longitude: Number(markerLocation?.lng ?? 0)
      };

      const bodyCreateThing: BodyCreateThingDTO = {
        location,
        devices,
        managers,
        information: values.information,
        name: values.name
      };

      const rs = await dataThing.createThing(bodyCreateThing);
      if (rs.responseCode === HTTP_STATUS_RESPONSE_KEY.SUCCESS) {
        //----------------Download file----------------//
        if (rs?.data?.files) {
          rs.data.files.forEach((val) => {
            renderType(val);
          });
        }
        message.success(t(i18nKey.validation.common.toastCreateSuccess));
        setModalOpen(true);
      } else if (rs.message === 'name-ineligible') {
        message.error(t(i18nKey.validation.thing.existingName));
      } else {
        message.error(t(i18nKey.validation.common.toastCreateFail));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateThing = async (values: IThingForm) => {
    try {
      setLoading(true);
      setOpenToastifyConfirm(false);
      const managers = values.managers || [];
      const devices = values.devices || [];

      const location = {
        ...values.location,
        latitude: Number(markerLocation?.lat ?? 0),
        longitude: Number(markerLocation?.lng ?? 0)
      };

      const bodyUpdateThing: BodyCreateThingDTO = {
        location,
        devices,
        managers,
        information: values.information,
        name: values.name
      };
      const rs = await dataThing.updateThing(bodyUpdateThing, {
        id: params.id as string
      });
      if (rs.responseCode === HTTP_STATUS_RESPONSE_KEY.SUCCESS) {
        message.success(t(i18nKey.validation.common.toastUpdateSuccess));
        navigator(PAGE_ROUTE.THING_CENTER);
      } else if (rs.message === 'name-ineligible') {
        message.error(t(i18nKey.validation.thing.existingName));
      } else {
        message.error(t(i18nKey.validation.common.toastUpdateFail));
      }
    } finally {
      setLoading(false);
    }
  };

  const onChangeValuesForm = () => {
    setIsDisable(false);
  };

  const onAddEmailManager = async (emailAssign: string) => {
    const listManagerThing: IManager[] = form.getFieldValue('managers') || [];

    const isExistingInOwner = listManagerThing.find(
      (manager) => manager.email.trim() === emailAssign.trim()
    );

    if (isExistingInOwner) {
      message.error(t(i18nKey.validation.thing.existingEmailInOwner));
      return;
    }

    const body: IBodyGetUserAssignByEmail = {
      email: emailAssign
    };

    const res = await dataThing.getUserAssignOwnerByEmail(body);
    if (res.responseCode === HTTP_STATUS_RESPONSE_KEY.SUCCESS) {
      const { _id: id, ...user } = res.data?.user || {};
      form.setFieldValue('managers', [{ ...user, id, isOwner: false }]);
      setIsDisable(false);
      formInstanseAddOwner.resetFields();
      form.validateFields(['name']);
      return;
    }
    if (res.message === 'no-user-found') {
      setEmailNotFound(emailAssign);
      setVisibleDropdownAddOwner(false);
      setOpenModalCreateAccount(true);
      return;
    }
    if (res.message === 'manager-not-active') {
      message.error(t(i18nKey.validation.account.inactiveAssign));
    } else {
      message.error(res.message);
    }
  };

  const onAddEmailOwner = async (emailAssign: string) => {
    const listManagerThing: IManager[] = form.getFieldValue('managers') || [];

    const isExistingInOwner = listManagerThing.find(
      (manager) => manager.email.trim() === emailAssign.trim()
    );

    if (isExistingInOwner) {
      message.error(t(i18nKey.validation.thing.existingEmailInOwner));
      return;
    }

    const body: IBodyGetUserAssignByEmail = {
      email: emailAssign
    };

    const res = await dataThing.getUserAssignOwnerByEmail(body);
    if (res.responseCode === HTTP_STATUS_RESPONSE_KEY.SUCCESS) {
      console.log(res.data);
      const { _id: id, ...user } = res.data?.user || {};
      form.setFieldValue('managers', [{ ...user, id, isOwner: true }]);
      setIsDisable(false);
      formInstanseAddOwner.resetFields();
      form.validateFields(['name']);
      return;
    }
    if (res.message === 'no-user-found') {
      setEmailNotFound(emailAssign);
      setVisibleDropdownAddOwner(false);
      setOpenModalCreateAccount(true);
      return;
    }
    if (res.message === 'manager-not-active') {
      message.error(t(i18nKey.validation.account.inactiveAssign));
    } else {
      message.error(res.message);
    }
  };

  const handleDownload = async () => {
    await dataThing
      .downloadCertificate({ id: params?.id as string })
      .then((rs) => {
        setModalOpen(false);
        if (rs.responseCode === HTTP_STATUS_RESPONSE_KEY.SUCCESS) {
          const datResponse = rs.data as any;
          if (datResponse) {
            datResponse.files.forEach((file: any) => {
              renderType(file);
            });
          }
          setModalOpen(true);
        } else if (
          rs.responseCode === HTTP_STATUS_RESPONSE_KEY.NOT_FOUND &&
          rs.message === messageResponse.thingNotFound
        ) {
          message.error(
            `${t(i18nKey.thingEntity.downloadCertificatesThingNotFound)}`
          );
        }
      });
  };

  const renderFormItem = () => {
    return (
      <div>
        <ThingInfoForm
          dataThingDetail={dataThingDetail}
          onAddEmailAdminViewer={onAddEmailManager}
          onAddEmailOwner={onAddEmailOwner}
          marker={markerLocation}
          onChangeMarker={onChangeMarker}
          formInstanseAddOwner={formInstanseAddOwner}
          formInstanseAddManager={formInstanseAddManager}
          visibleDropdownViewer={visibleDropdownViewer}
          visibleDropdownAddOwner={visibleDropdownAddOwner}
          handleChangeVisibleAddOnwer={handleChangeVisibleAddOnwer}
          handleChangeVisibleAddViewer={handleChangeVisibleAddViewer}
          handleDownload={handleDownload}
          status={status}
        />
      </div>
    );
  };

  const renderButtons = () => {
    const isMobile = screen.xs;
    const isUpdate = params?.id;
    return (
      <>
        <Col style={(isMobile && isUpdate && { flex: '0 0 150px' }) || {}}>
          <Button
            block
            onClick={async () => {
              setAction('cancel');
              setOpenToastifyConfirm(true);
            }}
            className={styles.requestWrapper_btn_default}>
            {t(i18nKey.button.cancel)}
          </Button>
        </Col>

        <Col style={(isMobile && isUpdate && { flex: '0 0 150px' }) || {}}>
          <Button
            block
            disabled={isDisable}
            type="primary"
            onClick={async () => {
              setAction(params.id ? 'update' : 'create');
              await form.validateFields();
              setOpenToastifyConfirm(true);
            }}>
            {params.id
              ? t(i18nKey.button.update)
              : t(i18nKey.thingEntity.button.downloadCertAndKeys)}
          </Button>
        </Col>
      </>
    );
  };

  const renderTextDownload = (name: string, key: keyof IDownloadObj) => {
    return (
      <>
        {downloadObj[key] ? (
          <Typography className={styles.content_item_blurText}>
            {name}
          </Typography>
        ) : null}
      </>
    );
  };

  const handleDoneDownload = () => {
    setModalOpen(false);
    if (params.id) {
      setModalOpen(false);
    } else {
      navigator(PAGE_ROUTE.THING_CENTER);
    }
  };

  const downloadFileEms = (d: any, key: keyof IDownloadObj) => {
    const href = URL.createObjectURL(
      new Blob([new Uint8Array(d.file.data).buffer])
    );
    const link = document.createElement('a');
    link.href = href;
    link.setAttribute('download', d.name);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
    setDownloadObj({ ...downloadObj, [key]: true });
  };

  const renderButtonDownLoad = (content: any, key: keyof IDownloadObj) => {
    return (
      <Button
        className={styles.btn_download_file}
        disabled={downloadObj[key]}
        onClick={() => downloadFileEms(content, key)}>
        {downloadObj[key] ? (
          <>
            <CheckCircleTwoTone twoToneColor="#52c41a" />
            <span style={{ marginLeft: 7 }}>
              {t(i18nKey.thingEntity.button.downloaded)}
            </span>
          </>
        ) : (
          <span>{t(i18nKey.thingEntity.button.download)}</span>
        )}
      </Button>
    );
  };

  const renderFileModal = () => {
    return (
      <CustomModal
        maskClosable={false}
        title={i18nKey.thingEntity.button.downloadNewCertAndKeys}
        open={modalOpen}
        onCancel={handleDoneDownload}>
        <div className={styles.content}>
          <Typography className={styles.content_blurText}>
            {t(i18nKey.thingEntity.downloadCertAndKeysModal.description)}
          </Typography>
          {deviceFile && (
            <div className={styles.content_item}>
              <div>
                <Typography className={styles.content_item_text}>
                  {t(i18nKey.thingEntity.downloadCertAndKeysModal.deviceCert)}
                </Typography>
                {renderTextDownload(
                  deviceFile.name ? deviceFile?.name : '',
                  'device'
                )}
              </div>
              {renderButtonDownLoad(deviceFile, 'device')}
            </div>
          )}
          <Typography className={styles.content_item_boldText}>
            {t(i18nKey.thingEntity.downloadCertAndKeysModal.keyFiles)}
          </Typography>
          <Typography className={styles.content_blurText}>
            {t(i18nKey.thingEntity.downloadCertAndKeysModal.keyFilesDESC)}
          </Typography>
          {publicFile && (
            <div className={styles.content_item}>
              <div>
                <Typography className={styles.content_item_mediumText}>
                  {t(
                    i18nKey.thingEntity.downloadCertAndKeysModal.publicKeyFile
                  )}
                </Typography>
                {renderTextDownload(
                  publicFile.name ? publicFile.name : '',
                  'public'
                )}
              </div>
              {renderButtonDownLoad(publicFile, 'public')}
            </div>
          )}
          {privateFile && (
            <div className={styles.content_item}>
              <div>
                <Typography className={styles.content_item_mediumText}>
                  {t(
                    i18nKey.thingEntity.downloadCertAndKeysModal.privateKeyFile
                  )}
                </Typography>
                {renderTextDownload(
                  privateFile.name ? privateFile.name : '',
                  'private'
                )}
              </div>
              {renderButtonDownLoad(privateFile, 'private')}
            </div>
          )}
          <Typography className={styles.content_item_boldText}>
            {t(i18nKey.thingEntity.downloadCertAndKeysModal.rootCA)}
          </Typography>
          <Typography className={styles.content_blurText}>
            {t(i18nKey.thingEntity.downloadCertAndKeysModal.rootCADesc)}
          </Typography>
          {rootFile && (
            <div className={styles.content_item}>
              <div>
                <Typography className={styles.content_item_mediumText}>
                  {t(
                    i18nKey.thingEntity.downloadCertAndKeysModal.amazonServices
                  )}
                </Typography>
                {renderTextDownload(rootFile.name ? rootFile.name : '', 'root')}
              </div>
              {renderButtonDownLoad(rootFile, 'root')}
            </div>
          )}
          {supplementary && (
            <div className={styles.content_item}>
              <div>
                <Typography className={styles.content_item_mediumText}>
                  {t(
                    i18nKey.thingEntity.downloadCertAndKeysModal
                      .supplementaryFile
                  )}
                </Typography>
                {renderTextDownload(
                  supplementary.name ? supplementary.name : '',
                  'supplementary'
                )}
              </div>
              {renderButtonDownLoad(supplementary, 'supplementary')}
            </div>
          )}
          <div className={styles.content_item}>
            <div>
              <Typography className={styles.content_item_mediumText}>
                {t(
                  i18nKey.thingEntity.downloadCertAndKeysModal
                    .howToConnectToIoTCoreFromEMS
                )}
              </Typography>
            </div>
          </div>
        </div>
      </CustomModal>
    );
  };

  const renderModal = (action: 'cancel' | 'update' | 'create') => {
    switch (action) {
      case 'update': {
        return (
          <ToastifyConfirm
            openToastify={openToastifyConfirm}
            onCancel={() => setOpenToastifyConfirm(false)}
            idDelete="none"
            onSubmit={() => handleConfirmOk()}
            title={`${t(i18nKey.button.update)}`}
            description={`${t(i18nKey.confirmationPopup.update)}`}
          />
        );
      }
      case 'create': {
        return (
          <ToastifyConfirm
            openToastify={openToastifyConfirm}
            onCancel={() => setOpenToastifyConfirm(false)}
            idDelete="none"
            onSubmit={() => handleConfirmOk()}
            title={`${t(i18nKey.button.create)}`}
            description={`${t(i18nKey.confirmationPopup.create)}`}
          />
        );
      }
      case 'cancel': {
        return (
          <ToastifyConfirm
            openToastify={openToastifyConfirm}
            onCancel={() => setOpenToastifyConfirm(false)}
            idDelete="none"
            onSubmit={() => handleCancelPopupConfirm()}
            title={`${t(i18nKey.button.cancel)}`}
            description={`${t(i18nKey.confirmationPopup.cancel)}`}
          />
        );
      }
    }
  };

  return (
    <Spin wrapperClassName={styles.wrapSpin} spinning={loading}>
      <div className={styles.requestWrapper}>
        <div className={styles.widget_header}>
          <Row justify={'space-between'}>
            <Col md={8} lg={12} xl={12}>
              <div className={styles.widget_header_title}>
                <Typography.Title level={2}>
                  {params.id
                    ? `${t(i18nKey.thingEntity.title.updateThing)}`
                    : `${t(i18nKey.thingEntity.title.createThing)}`}
                </Typography.Title>
              </div>
            </Col>
            <Col
              sm={0}
              xs={0}
              md={16}
              lg={12}
              xl={12}
              className={styles.requestWrapper_btn}>
              <Row justify={'end'} wrap={false} gutter={5}>
                {renderButtons()}
              </Row>
            </Col>
          </Row>
        </div>

        <RegistrationContent>
          <Form
            form={form}
            layout="vertical"
            onFinish={params.id ? handleUpdateThing : handleCreateThing}
            onFinishFailed={onFormFailed}
            onValuesChange={onChangeValuesForm}>
            {renderFormItem()}
          </Form>
        </RegistrationContent>
        <Row>
          <Col sm={24} xs={24} md={0} lg={0} xl={0} xxl={0}>
            <Layout>
              <Footer className={styles.requestWrapper_footer}>
                <Row>
                  <Col
                    sm={24}
                    xs={24}
                    md={0}
                    lg={0}
                    xl={0}
                    xxl={0}
                    className={styles.requestWrapper_btn}>
                    <Row gutter={16} justify={'center'}>
                      {renderButtons()}
                    </Row>
                  </Col>
                </Row>
              </Footer>
            </Layout>
          </Col>
        </Row>
      </div>
      {renderModal(action)}
      {renderFileModal()}
      <Modal
        centered
        open={openModalCreateAccount}
        title="This email not found"
        onCancel={() => setOpenModalCreateAccount(false)}
        footer={
          <Row wrap={false} gutter={10} justify={'end'}>
            <Col>
              <Button onClick={() => setOpenModalCreateAccount(false)}>
                {t(i18nKey.button.cancel)}
              </Button>
            </Col>
            <Col>
              <Button
                type="primary"
                onClick={() =>
                  navigator(PAGE_ROUTE.NEW_ACCOUNT, {
                    state: { emailCreate: emailNotFound }
                  })
                }>
                {t(i18nKey.accountEntity.button.createAccount)}
              </Button>
            </Col>
          </Row>
        }>
        {t(i18nKey.thingEntity.textContent.confirmCreateAccount)}
      </Modal>
    </Spin>
  );
};

export default observer(RequestForm);
