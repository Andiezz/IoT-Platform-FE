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
// import Loader from 'src/components/loader';
import { HTTP_STATUS_RESPONSE_KEY } from 'src/constants/api';
import { PAGE_ROUTE } from 'src/constants/route';
import { IBodyGetUserAssignByEmail } from 'src/dto/account-management-list.dto';
import { BodyCreatePlantDTO, BodyUpdatePlantDTO } from 'src/dto/plant.dto';
import useStore from 'src/hooks/use-store';
import { i18nKey } from 'src/locales/i18n';
import { IPlantListStore } from 'src/store/plant/plant.store';
import PlantInfoForm from './thingInfo/thing-info.page';
import styles from './request-form.module.less';
import { Owner } from 'src/constants/user';
import ToastifyConfirm from 'src/components/toastify-confirm/toastify-confirm';
import { IOptions as OptionSelect } from 'src/interfaces';
import { EmsListStore } from 'src/store/ems/ems.store';
import { TypeFile } from 'src/constants/ems';
import CustomModal from 'src/components/custom-modal/CustomModal';
import { CheckCircleTwoTone } from '@ant-design/icons';
import { messageResponse } from 'src/constants/message-response';
// import { Role } from 'src/interfaces/user';

export interface IRequest {
  limit?: number;
  assigned?: boolean;
}

export interface MarkerLocation {
  address: string;
  lat: number;
  lng: number;
}

export interface IPlantFormI {
  associated_assets: Array<{
    capacity: number;
    company: string;
    device_type: string;
  }>;
  location: { name: string; address: string };
  name: string;
  owner?: Owner[];
  viewers?: Owner[];
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
  const [form] = Form.useForm<IPlantFormI>();
  const [isDisable, setIsDisable] = useState(true);
  const [markerLocation, setMarkerLocation] = useState<
    MarkerLocation | undefined
  >();
  const [dataPlantDetail, setDataPlantDetail] = useState<
    IPlantFormI | Partial<IPlantFormI>
  >({});
  const [loading, setLoading] = useState(false);
  const [openToastifyConfirm, setToastifyConfirm] = useState<boolean>(false);
  const [action, setAction] = useState<'create' | 'update' | 'cancel'>(
    'cancel'
  );

  const emsStore: EmsListStore = useStore('listEmsStore');

  //store
  const dataPlant: IPlantListStore = useStore('listPlantStore');
  const [listOptionEmsDevice, setListOptionEmsDevice] = useState<
    Array<OptionSelect>
  >([]);
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
  const [visibleDropDownAddOwner, setVisibleDropdownOwner] = useState(false);
  const [visibleDropDownAdViewer, setVisibleDropdownViewer] = useState(false);
  const [status, setStatus] = useState<string>();
  // const userStore: IUserStore = useStore('userStore');

  const handleChangeVisibleAddOnwer = (visible: boolean) => {
    setVisibleDropdownOwner(visible);
  };
  const handleChangeVisibleAddViewer = (visible: boolean) => {
    setVisibleDropdownViewer(visible);
  };
  const [formInstanseAddOwner] = Form.useForm();
  const [formInstanseAddViewer] = Form.useForm();
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

  const getListEmsDevice = async () => {
    emsStore.getListDevice({ limit: 1000 }).then((rs) => {
      if (rs.responseCode === HTTP_STATUS_RESPONSE_KEY.SUCCESS) {
        setListOptionEmsDevice(
          rs.data.paginatedResults.map(
            (item: any) =>
              ({
                label: item.name,
                value: item._id,
                key: item._id
              } as OptionSelect)
          ) as []
        );
      }
    });
  };

  useEffect(() => {
    getListEmsDevice();
  }, []);

  useEffect(() => {
    if (params.id) {
      setLoading(true);
      dataPlant.getDetailPlant({ id: params.id }).then((rs) => {
        setLoading(false);
        if (rs.responseCode === HTTP_STATUS_RESPONSE_KEY.SUCCESS) {
          const resPlantDetail = rs.data;

          const owner = resPlantDetail?.owner.length
            ? [resPlantDetail.owner.at(0)?.user]
            : [];
          const viewers = resPlantDetail?.viewers.map(
            (viewer: { user: Owner }) => viewer.user
          );
          const associated_assets = resPlantDetail?.devices.length
            ? resPlantDetail?.devices.map((item) => {
                return {
                  company: item.company,
                  device_type: item.device_type_id,
                  capacity: item.capacity
                };
              })
            : [
                {
                  company: '',
                  device_type: '',
                  capacity: ''
                }
              ];
          setStatus(resPlantDetail?.status);
          const location = {
            address: resPlantDetail?.address,
            name: resPlantDetail?.location_name
          };
          const name = resPlantDetail?.name;
          setMarkerLocation({
            lat: resPlantDetail?.latitude as number,
            lng: resPlantDetail?.longitude as number,
            address: resPlantDetail?.address as string
          });
          setDataPlantDetail({
            name,
            owner,
            viewers,
            associated_assets,
            location
          } as IPlantFormI);
        }
      });
    }
  }, []);

  useEffect(() => {
    form.setFieldsValue({ ...dataPlantDetail });
  }, [dataPlantDetail]);

  const onFormFailed = () => {
    return 2;
  };

  const handleConfirmOk = () => {
    form.submit();
  };
  const handleCancelPopupConfirm = () => {
    setToastifyConfirm(false);
    navigator(PAGE_ROUTE.DASHBOARD_PLANT);
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

  const handleCreatePlant = async (values: IPlantFormI) => {
    try {
      setLoading(true);
      setToastifyConfirm(false);
      const viewers = values.viewers?.map((user) => user._id) || [];
      const owner_id = values.owner?.at(0)?._id;
      console.log();
      const associated_assets = values.associated_assets.reduce(
        (
          acc: Array<{
            capacity: number;
            company: string;
            device_id: string;
          }>,
          item
        ) => {
          if (item.device_type) {
            acc.push({
              company: item.company,
              device_id: item.device_type,
              capacity: Number(item.capacity)
            });
          }
          return acc;
        },
        []
      );
      //--------------------------------------------//
      const location = {
        ...values.location,
        latitude: Number(markerLocation?.lat || 0),
        longitude: Number(markerLocation?.lng || 0)
      };

      const bodyCreatePlant: BodyCreatePlantDTO = {
        location,
        associated_assets,
        owner_id,
        viewers,
        name: values.name
      };

      const rs = await dataPlant.createPlant(bodyCreatePlant);
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
        message.error(t(i18nKey.validation.plant.existingName));
      } else {
        message.error(t(i18nKey.validation.common.toastCreateFail));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePlant = async (values: IPlantFormI) => {
    try {
      setLoading(true);
      setToastifyConfirm(false);
      const viewers = values.viewers?.map((user) => user._id) || [];
      const owner_id = values.owner?.at(0)?._id;

      const associated_assets = values.associated_assets.reduce(
        (
          acc: Array<{
            capacity: number;
            company: string;
            device_id: string;
          }>,
          item
        ) => {
          if (item.device_type) {
            acc.push({
              company: item.company,
              device_id: item.device_type,
              capacity: Number(item.capacity)
            });
          }
          return acc;
        },
        []
      );
      //--------------------------------------------//
      const location = {
        ...values.location,
        latitude: Number(markerLocation?.lat || 0),
        longitude: Number(markerLocation?.lng || 0)
      };

      const bodyUpdatePlant: BodyUpdatePlantDTO = {
        location,
        associated_assets,
        owner_id,
        viewers,
        name: values.name
      };
      const rs = await dataPlant.updatePlant(bodyUpdatePlant, {
        id: params.id as string
      });
      if (rs.responseCode === HTTP_STATUS_RESPONSE_KEY.SUCCESS) {
        message.success(t(i18nKey.validation.common.toastUpdateSuccess));
        navigator(PAGE_ROUTE.DASHBOARD_PLANT);
      } else if (rs.message === 'name-ineligible') {
        message.error(t(i18nKey.validation.plant.existingName));
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

  const onAddEmailAdminViewer = async (emailAssign: string): Promise<void> => {
    const ownerPlant: Owner = (form.getFieldValue('owner') || []).at(0);

    //-----------Check email existing in Owner-------------//
    if (emailAssign.trim() === ownerPlant?.email.trim()) {
      message.error(t(i18nKey.validation.plant.existingEmailInOwner));
      return;
    }
    //-----------Check email existing in Owner-------------//
    const listViewerPlant: Owner[] = form.getFieldValue('viewers') || [];
    const isDuplicateEmailInList = listViewerPlant.find(
      (viewer) => viewer.email.trim() === emailAssign.trim()
    );

    if (isDuplicateEmailInList) {
      message.error(t(i18nKey.validation.plant.existingEmailInList));
      return;
    }

    const body: IBodyGetUserAssignByEmail = {
      email: emailAssign.trim()
    };

    const res = await dataPlant.getUserAssignViewerByEmail(body);
    if (res.responseCode === HTTP_STATUS_RESPONSE_KEY.SUCCESS) {
      const currentData: Array<Owner> = form.getFieldValue('viewers') || [];
      const { id: _id, ...user } = res.data?.user || {};
      form.setFieldValue('viewers', [...currentData, { ...user, _id }]);
      formInstanseAddViewer.resetFields();
      setIsDisable(false);
      return;
    }
    if (res.message === 'owner-not-found') {
      setEmailNotFound(emailAssign);
      setVisibleDropdownViewer(false);
      setOpenModalCreateAccount(true);
      return;
    }
    if (res.message === 'owner-is-not-active') {
      message.error(t(i18nKey.validation.account.inactiveAssign));
      return;
    }
    if (res.message === 'owner-ineligible') {
      message.error(t(i18nKey.validation.plant.requiredRoleViewer));
      return;
    } else {
      message.error(res.message);
    }
  };

  const onAddEmailOwner = async (emailAssign: string) => {
    const listViewerPlant: Owner[] = form.getFieldValue('viewers') || [];
    const ownerPlant: Owner[] = form.getFieldValue('owner') || [];
    //-----------Check email existing in Viewer-------------//
    const isExistingInOwner = listViewerPlant.find(
      (viewer) => viewer.email.trim() === emailAssign.trim()
    );
    if (ownerPlant?.length) {
      message.error(t(i18nKey.validation.plant.limitAssignOwner));
      return;
    }

    if (isExistingInOwner) {
      message.error(t(i18nKey.validation.plant.existingEmailInViewer));
      return;
    }

    const body: IBodyGetUserAssignByEmail = {
      email: emailAssign
    };

    const res = await dataPlant.getUserAssignOwnerByEmail(body);
    if (res.responseCode === HTTP_STATUS_RESPONSE_KEY.SUCCESS) {
      const { id: _id, ...user } = res.data?.user || {};
      form.setFieldValue('owner', [{ ...user, _id }]);
      setIsDisable(false);
      formInstanseAddOwner.resetFields();
      form.validateFields(['name']);
      return;
    }
    if (res.message === 'owner-not-found') {
      setEmailNotFound(emailAssign);
      setVisibleDropdownOwner(false);
      setOpenModalCreateAccount(true);
      return;
    }
    if (res.message === 'owner-is-not-active') {
      message.error(t(i18nKey.validation.account.inactiveAssign));
      return;
    }
    if (res.message === 'owner-ineligible') {
      message.error(t(i18nKey.validation.plant.requiredRoleOwner));
      return;
    } else {
      message.error(res.message);
    }
  };

  const handleDownload = async () => {
    await dataPlant
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
          rs.message === messageResponse.plantNotFound
        ) {
          message.error(
            `${t(i18nKey.plantEntity.downloadCertificatesPlantNotFound)}`
          );
        }
      });
  };

  const renderFormItem = () => {
    return (
      <div>
        <PlantInfoForm
          dataPlantDetail={dataPlantDetail}
          onAddEmailAdminViewer={onAddEmailAdminViewer}
          onAddEmailOwner={onAddEmailOwner}
          listOptionEmsDevice={listOptionEmsDevice}
          marker={markerLocation}
          onChangeMarker={onChangeMarker}
          formInstanseAddOwner={formInstanseAddOwner}
          formInstanseAddViewer={formInstanseAddViewer}
          visibleDropDownAdViewer={visibleDropDownAdViewer}
          visibleDropDownAddOwner={visibleDropDownAddOwner}
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
              setToastifyConfirm(true);
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
              setToastifyConfirm(true);
            }}>
            {params.id
              ? t(i18nKey.button.update)
              : t(i18nKey.emsEntity.button.downloadCertAndKeys)}
          </Button>
        </Col>
      </>
    );
  };

  const renderBtnDownload = (key: keyof IDownloadObj) => {
    return (
      <Button
        className={styles.btn_download_file}
        disabled={downloadObj[key] ? true : false}
        onClick={() => setDownloadObj({ ...downloadObj, [key]: true })}>
        {downloadObj[key] ? (
          <>
            <CheckCircleTwoTone twoToneColor="#52c41a" />
            <span style={{ marginLeft: 7 }}>
              {t(i18nKey.emsEntity.button.downloaded)}
            </span>
          </>
        ) : (
          <span>{t(i18nKey.emsEntity.button.download)}</span>
        )}
      </Button>
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
      navigator(PAGE_ROUTE.DASHBOARD_PLANT);
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
        disabled={downloadObj[key] ? true : false}
        onClick={() => downloadFileEms(content, key)}>
        {downloadObj[key] ? (
          <>
            <CheckCircleTwoTone twoToneColor="#52c41a" />
            <span style={{ marginLeft: 7 }}>
              {t(i18nKey.emsEntity.button.downloaded)}
            </span>
          </>
        ) : (
          <span>{t(i18nKey.emsEntity.button.download)}</span>
        )}
      </Button>
    );
  };

  const renderFileModal = () => {
    return (
      <CustomModal
        maskClosable={false}
        title={i18nKey.emsEntity.button.downloadNewCertAndKeys}
        open={modalOpen}
        onCancel={handleDoneDownload}>
        <div className={styles.content}>
          <Typography className={styles.content_blurText}>
            {t(i18nKey.emsEntity.downloadCertAndKeysModal.description)}
          </Typography>
          {deviceFile && (
            <div className={styles.content_item}>
              <div>
                <Typography className={styles.content_item_text}>
                  {t(i18nKey.emsEntity.downloadCertAndKeysModal.deviceCert)}
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
            {t(i18nKey.emsEntity.downloadCertAndKeysModal.keyFiles)}
          </Typography>
          <Typography className={styles.content_blurText}>
            {t(i18nKey.emsEntity.downloadCertAndKeysModal.keyFilesDESC)}
          </Typography>
          {publicFile && (
            <div className={styles.content_item}>
              <div>
                <Typography className={styles.content_item_mediumText}>
                  {t(i18nKey.emsEntity.downloadCertAndKeysModal.publicKeyFile)}
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
                  {t(i18nKey.emsEntity.downloadCertAndKeysModal.privateKeyFile)}
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
            {t(i18nKey.emsEntity.downloadCertAndKeysModal.rootCA)}
          </Typography>
          <Typography className={styles.content_blurText}>
            {t(i18nKey.emsEntity.downloadCertAndKeysModal.rootCADesc)}
          </Typography>
          {rootFile && (
            <div className={styles.content_item}>
              <div>
                <Typography className={styles.content_item_mediumText}>
                  {t(i18nKey.emsEntity.downloadCertAndKeysModal.amazonServices)}
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
                    i18nKey.emsEntity.downloadCertAndKeysModal.supplementaryFile
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
                  i18nKey.emsEntity.downloadCertAndKeysModal
                    .howToConnectToIoTCoreFromEMS
                )}
              </Typography>
            </div>
            <a
              href="https://d3urpg3wfssphk.cloudfront.net/files/document/1688091460933/document-connect-IoTCore.pdf"
              download>
              {renderBtnDownload('coreIoT')}
            </a>
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
            onCancel={() => setToastifyConfirm(false)}
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
            onCancel={() => setToastifyConfirm(false)}
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
            onCancel={() => setToastifyConfirm(false)}
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
    <>
      <Spin wrapperClassName={styles.wrapSpin} spinning={loading}>
        <div className={styles.requestWrapper}>
          <div className={styles.widget_header}>
            <Row justify={'space-between'}>
              <Col md={8} lg={12} xl={12}>
                <div className={styles.widget_header_title}>
                  <Typography.Title level={2}>
                    {params.id
                      ? `${t(i18nKey.plantEntity.title.updatePlant)}`
                      : `${t(i18nKey.plantEntity.title.createPlant)}`}
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
              onFinish={params.id ? handleUpdatePlant : handleCreatePlant}
              onFinishFailed={onFormFailed}
              onValuesChange={onChangeValuesForm}
              // initialValues={{
              //   ...onboardingPlantStore.plantDetail,
              //   locations: onboardingPlantStore.plantDetail?.locations
              // }}
            >
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
          {t(i18nKey.plantEntity.textContent.confirmCreateAccount)}
        </Modal>
      </Spin>
    </>
  );
};

export default observer(RequestForm);
