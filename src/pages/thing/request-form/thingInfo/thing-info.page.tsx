/* eslint-disable react/prop-types */
import {
  CloseCircleOutlined,
  EnvironmentOutlined,
  PlusOutlined
} from '@ant-design/icons';
import {
  Avatar,
  Button,
  Col,
  Divider,
  Form,
  FormInstance,
  Input,
  Row,
  Select,
  Typography
} from 'antd';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import GoogleMap from 'src/components/map/map';
import WhiteBox from 'src/components/white-box/white-box';
import useStore from 'src/hooks/use-store';
import { i18nKey } from 'src/locales/i18n';
import { IPlantStore } from 'src/store/plant/plant.store';
import ModalLocation from '../modal-location/modal-location';
import styles from './plant-info.module.less';
import { useParams } from 'react-router-dom';

import {
  normalizeTrimStart,
  normalizeInputBlockCharacter
} from 'src/helpers/common.utils';
import AddOwner from 'src/components/add-owner/add-owner';
import { IPlantFormI, MarkerLocation } from '../request-form.page';
import FormItem from 'antd/es/form/FormItem';
import { IOptions as OptionSelect } from 'src/interfaces';
import { IUserStore } from 'src/store/user.store';
import RenderAvatar from 'src/components/render-avatar/render-avatar';
import { Owner } from 'src/constants/user';
import { Role } from 'src/interfaces/user';

export interface IEmsProps {
  label: string;
  value: string;
}

interface IPlantInfoFormProps {
  onChangeMarker: (marker: MarkerLocation) => void;
  onAddEmailAdminViewer(email: string): Promise<void>;
  marker?: MarkerLocation;
  formInstanseAddOwner: FormInstance<{ emailAssign: string }>;
  formInstanseAddViewer: FormInstance<{ emailAssign: string }>;
  onAddEmailOwner: (email: string) => Promise<void>;
  listOptionEmsDevice: Array<OptionSelect>;
  handleChangeVisibleAddOnwer: (visible: boolean) => void;
  handleChangeVisibleAddViewer: (visible: boolean) => void;
  visibleDropDownAddOwner: boolean;
  visibleDropDownAdViewer: boolean;
  dataPlantDetail: IPlantFormI | Partial<IPlantFormI>;
  handleDownload?: () => void;
  status?: string;
}

export const defaultMarker = {
  lat: 56.130366,
  lng: -106.346771
};

const PlantInfoForm: React.FC<IPlantInfoFormProps> = ({
  marker,
  // onChangeName,
  listOptionEmsDevice,
  onChangeMarker,
  onAddEmailOwner,
  onAddEmailAdminViewer,
  formInstanseAddOwner,
  formInstanseAddViewer,
  visibleDropDownAdViewer,
  visibleDropDownAddOwner,
  handleChangeVisibleAddOnwer,
  handleChangeVisibleAddViewer,
  handleDownload,
  dataPlantDetail,
  status
}: IPlantInfoFormProps) => {
  const [t] = useTranslation();
  const params = useParams();
  const onboardingPlantStore: IPlantStore = useStore('plantStore');
  const userStore: IUserStore = useStore('userStore');
  const [open, setOpen] = useState(false);
  const [loadingBtnDownload,setLoadingBtnDownload] = useState<boolean>(false)

  const handleModal = () => {
    setOpen(true);
  };

  const handleDownloadCerfiticate = async()=>{
    try{
      setLoadingBtnDownload(true);
      await handleDownload?.()
    }
    finally{
      setLoadingBtnDownload(false);
    }
  }

  useEffect(() => {
    if (!params.id) {
      onboardingPlantStore.setPlantLocation(undefined as any, NaN);
    }
  }, []);

  const RenderOnlyAvatar = ({ value }: { value?: Owner[] }) => {
    return value?.length ? (
      <Avatar.Group>
        {value?.map((owner) => (
          <RenderAvatar key={owner._id} owner={owner} sizeAvatar={25} />
        ))}
      </Avatar.Group>
    ) : (
      <></>
    );
  };

  const isShowButtonDownLoad = (): boolean =>{
    if([
      `${Role.SUPER_ADMIN}`,`${Role.CUSTOMER_SERVICE}`].includes(`${userStore.userInfo?.role.role}`)){
        return true;
    }
    if(userStore.userInfo?.role.role === Role.TENANT_ADMIN){
      if(userStore.userInfo.id === dataPlantDetail.owner?.at(0)?._id)
      return true;
    }
    return false;
   
  }

  const renderAddOwner = () => {
    const isUpdatePlant = params?.id;
    if (isUpdatePlant) {
      return (
        <Form.Item name="owner" noStyle>
          {[`${Role.CUSTOMER_SERVICE}`, `${Role.SUPER_ADMIN}`].includes(
            `${userStore.userInfo?.role.role}`
          ) ? (
            <AddOwner
              visibleDropdown={visibleDropDownAddOwner}
              onChangeVisibleDropdown={handleChangeVisibleAddOnwer}
              formInstane={formInstanseAddOwner}
              textBtnAdd={t(i18nKey.tenantEntity.button.addOwner)}
              titleDrawer="Add Plant Owner"
              onAddEmail={onAddEmailOwner}
              sizeAvatar={25}
            />
          ) : (
            <RenderOnlyAvatar />
          )}
        </Form.Item>
      );
    }
    return (
      <Form.Item name="owner" noStyle>
        <AddOwner
          visibleDropdown={visibleDropDownAddOwner}
          onChangeVisibleDropdown={handleChangeVisibleAddOnwer}
          formInstane={formInstanseAddOwner}
          textBtnAdd={t(i18nKey.tenantEntity.button.addOwner)}
          titleDrawer="Add Plant Owner"
          onAddEmail={onAddEmailOwner}
          sizeAvatar={25}
        />
      </Form.Item>
    );
  };
  const renderGoogleMap = React.useMemo(
    () => (
      <GoogleMap
        style={{ height: '75vh' }}
        marker={marker ? [marker] : []}></GoogleMap>
    ),
    [marker]
  );

  return (
    <div className={styles.formWrapper}>
      <Row gutter={[24, 24]}>
        <Col
          xs={24}
          sm={24}
          md={24}
          lg={12}
          xl={12}
          xxl={12}
          className={styles.formWrapper_plantInfo}>
          <Row gutter={[0, 24]}>
            <Col span={24}>
              <Form.Item>
                <WhiteBox>
                  <Row gutter={[0, 16]}>
                    <Col span={24}>
                      <Form.Item
                        label={t(i18nKey.label.name)}
                        name="name"
                        normalize={normalizeTrimStart}
                        dependencies={['owner']}
                        rules={[
                          () => ({
                            validator(_, value?: string) {
                              if (!value?.trim()) {
                                return Promise.reject(
                                  `${t(
                                    i18nKey.validation.common.requiredField
                                  )}`
                                );
                              }
                              return Promise.resolve();
                            }
                          })
                        ]}
                        required>
                        <Input suffix={renderAddOwner()} />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Typography.Text className={styles.labelAssignmentViewer}>
                        {t(i18nKey.tenantEntity.detail.adminViewerAssignment)}
                      </Typography.Text>
                      <FormItem name={'viewers'}>
                        {[
                          `${Role.TENANT_ADMIN}`,
                          `${Role.SUPER_ADMIN}`,
                          `${Role.CUSTOMER_SERVICE}`
                        ].includes(`${userStore.userInfo?.role.role}`) ? (
                          <AddOwner
                            titleDrawer={`${t(
                              i18nKey.tenantEntity.detail.adminViewerAssignment
                            )}`}
                            formInstane={formInstanseAddViewer}
                            visibleDropdown={visibleDropDownAdViewer}
                            onChangeVisibleDropdown={
                              handleChangeVisibleAddViewer
                            }
                            textBtnAdd="Add"
                            sizeAvatar={25}
                            onAddEmail={onAddEmailAdminViewer}
                          />
                        ) : (
                          <RenderOnlyAvatar />
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                </WhiteBox>
              </Form.Item>
            </Col>
            <Col span={24}>
              <div className={styles.formWrapper_box}>
                <Row className={styles.formWrapper_box_header}>
                  <b className={styles.formWrapper_title}>
                    {t(i18nKey.label.location)}
                  </b>
                </Row>
                <Divider
                  className={styles.formWrapper_box_divider}
                  type="horizontal"></Divider>
                <Row className={styles.formWrapper_locations}>
                  <Col span={24}>
                    <Form.Item
                      // key={f.key}
                      className={styles.formWrapper_locations_item}>
                      <Row gutter={[0, 16]}>
                        <Col span={24}>
                          <Form.Item
                            label={t(i18nKey.plantEntity.label.locationName)}
                            className={styles.formWrapper_locations_field}
                            name={['location', 'name']}
                            normalize={normalizeTrimStart}
                            required
                            rules={[
                              {
                                required: true,
                                message: `${t(
                                  i18nKey.validation.common.requiredField
                                )}`
                              },
                              {
                                whitespace: true,
                                message: `${t(
                                  i18nKey.validation.common.requiredField
                                )}`
                              }
                            ]}>
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col span={24}>
                          <Form.Item
                            label={t(i18nKey.plantEntity.label.address)}
                            className={styles.formWrapper_locations_field}
                            name={['location', 'address']}
                            required
                            rules={[
                              {
                                required: true,
                                message: `${t(
                                  i18nKey.validation.common.requiredField
                                )}`
                              }
                            ]}>
                            <Input
                              onClick={() => handleModal()}
                              readOnly={true}
                              suffix={
                                <EnvironmentOutlined
                                  onClick={() => handleModal()}
                                />
                              }
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            </Col>
            <Col span={24}>
              <div className={styles.formWrapper_box}>
                <Row className={styles.formWrapper_box_header}>
                  <b className={styles.formWrapper_title}>
                    {t(i18nKey.plantEntity.label.associatedAssets)}
                  </b>
                </Row>
                <Divider
                  className={styles.formWrapper_box_divider}
                  type="horizontal"></Divider>
                <Row className={styles.formWrapper_box_content}>
                  {/* <Col span={24}>
                    <Row>
                      <Col flex={1}>

                      </Col>
                      <Col>
                        <CloseCircleOutlined />
                      </Col>
                    </Row>
                  </Col> */}
                  <Col span={24}>
                    <Form.List
                      name={'associated_assets'}
                      initialValue={[
                        { company: '', device_type: '', capacity: '' }
                      ]}>
                      {(fields, { add, remove }) => (
                        <div>
                          {fields.map((f, idx, fieldList) => {
                            return (
                              <Form.Item
                                key={f.key}
                                className={styles.associated_item}>
                                <Row align={'middle'}>
                                  <Col span={24}>
                                    <Row
                                      gutter={5}
                                      wrap={false}
                                      align={'middle'}>
                                      <Col flex={1}>
                                        <Row gutter={[12, 16]}>
                                          <Col span={8} xl={8} xs={24}>
                                            <Form.Item
                                              className={styles.subForm_item}
                                              label={t(
                                                i18nKey.emsEntity
                                                  .associatedAssets.company
                                              )}
                                              name={[idx, 'company']}
                                              normalize={normalizeTrimStart}
                                              rules={[
                                                ({ getFieldValue }) => ({
                                                  validator(_, value) {
                                                    const valueDeviceType =
                                                      getFieldValue([
                                                        'associated_assets',
                                                        idx,
                                                        'device_type'
                                                      ]);
                                                    const valueCapacity =
                                                      getFieldValue([
                                                        'associated_assets',
                                                        idx,
                                                        'capacity'
                                                      ]);
                                                    if (
                                                      (valueDeviceType ||
                                                        valueCapacity) &&
                                                      !value?.trim()
                                                    ) {
                                                      return Promise.reject(
                                                        new Error(
                                                          `${t(
                                                            i18nKey.validation
                                                              .common
                                                              .requiredField
                                                          )}`
                                                        )
                                                      );
                                                    }
                                                    return Promise.resolve();
                                                  }
                                                })
                                              ]}>
                                              <Input />
                                            </Form.Item>
                                          </Col>
                                          <Col
                                            className="gutter-row"
                                            span={8}
                                            xl={8}
                                            xs={12}>
                                            <Form.Item
                                              className={styles.subForm_item}
                                              name={[idx, 'device_type']}
                                              dependencies={[
                                                'company',
                                                'capacity'
                                              ]}
                                              rules={[
                                                ({ getFieldValue }) => ({
                                                  validator(_, value) {
                                                    const valueCompany =
                                                      getFieldValue([
                                                        'associated_assets',
                                                        idx,
                                                        'company'
                                                      ]);
                                                    const valueCapacity =
                                                      getFieldValue([
                                                        'associated_assets',
                                                        idx,
                                                        'capacity'
                                                      ]);
                                                    if (
                                                      (valueCompany ||
                                                        valueCapacity) &&
                                                      !value?.trim()
                                                    ) {
                                                      return Promise.reject(
                                                        new Error(
                                                          `${t(
                                                            i18nKey.validation
                                                              .common
                                                              .requiredField
                                                          )}`
                                                        )
                                                      );
                                                    }
                                                    return Promise.resolve();
                                                  }
                                                })
                                              ]}
                                              label={t(
                                                i18nKey.emsEntity
                                                  .associatedAssets.deviceType
                                              )}>
                                              <Select
                                                options={listOptionEmsDevice}
                                                allowClear
                                                showSearch
                                              />
                                            </Form.Item>
                                          </Col>
                                          <Col
                                            className="gutter-row"
                                            span={8}
                                            xl={8}
                                            xs={12}>
                                            <Form.Item
                                              label={t(
                                                i18nKey.emsEntity
                                                  .associatedAssets.capacity
                                              )}
                                              name={[idx, 'capacity']}
                                              className={styles.subForm_item}
                                              rules={[
                                                ({ getFieldValue }) => ({
                                                  validator(_, value) {
                                                    const valueCompany =
                                                      getFieldValue([
                                                        'associated_assets',
                                                        idx,
                                                        'company'
                                                      ]);

                                                    const valueDeviceType =
                                                      getFieldValue([
                                                        'associated_assets',
                                                        idx,
                                                        'device_type'
                                                      ]);

                                                    if (
                                                      (valueCompany ||
                                                        valueDeviceType) &&
                                                      !value
                                                    ) {
                                                      return Promise.reject(
                                                        new Error(
                                                          `${t(
                                                            i18nKey.validation
                                                              .common
                                                              .requiredField
                                                          )}`
                                                        )
                                                      );
                                                    }
                                                    if (
                                                      (valueCompany ||
                                                        valueDeviceType) &&
                                                      Number.isNaN(
                                                        Number(value)
                                                      )
                                                    ) {
                                                      return Promise.reject(
                                                        new Error(
                                                          `${t(
                                                            i18nKey.validation
                                                              .common
                                                              .requiredNumber
                                                          )}`
                                                        )
                                                      );
                                                    }
                                                    return Promise.resolve();
                                                  }
                                                })
                                              ]}
                                              normalize={
                                                normalizeInputBlockCharacter
                                              }>
                                              <Input />
                                            </Form.Item>
                                          </Col>
                                        </Row>
                                      </Col>
                                      {fieldList.length > 1 && (
                                        <Col>
                                          <CloseCircleOutlined
                                            style={{ color: 'red' }}
                                            onClick={() => remove(idx)}
                                          />
                                        </Col>
                                      )}
                                    </Row>
                                  </Col>
                                </Row>
                              </Form.Item>
                            );
                          })}
                          <Row gutter={[32, 16]}>
                            <Col className="gutter-row" span={8}>
                              <div
                                className={styles.buttonAddRow}
                                onClick={() => add()}>
                                <PlusOutlined style={{ color: '#848484' }} />
                                <u>{t(i18nKey.button.add)}</u>
                              </div>
                            </Col>
                          </Row>
                        </div>
                      )}
                    </Form.List>
                  </Col>
                </Row>
              </div>
            </Col>
            <Col span={24}>
              {params.id && isShowButtonDownLoad() && (
                  <Row>
                    <Button
                      disabled={status === 'active' ? true : false}
                      loading={loadingBtnDownload}
                      className={styles.formWrapper_btn_download}
                      onClick={handleDownloadCerfiticate}>
                      {t(i18nKey.emsEntity.button.downloadNewCertAndKeys)}
                    </Button>
                  </Row>
                )}
            </Col>
          </Row>
        </Col>
        <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
          <WhiteBox>
            <Row>{renderGoogleMap}</Row>
          </WhiteBox>
        </Col>
      </Row>
      <ModalLocation
        onChangeMaker={onChangeMarker}
        marker={marker}
        open={open}
        setOpen={setOpen}
      />
    </div>
  );
};

export default observer(PlantInfoForm);
