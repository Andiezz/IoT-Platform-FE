/* eslint-disable react/prop-types */
import {
  CloseCircleOutlined,
  // EnvironmentOutlined,
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
  Typography
} from 'antd';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import WhiteBox from 'src/components/white-box/white-box';
import useStore from 'src/hooks/use-store';
import { i18nKey } from 'src/locales/i18n';
import { IThingStore } from 'src/store/thing.store';
// import ModalLocation from '../modal-location/modal-location';
import styles from './thing-info.module.less';
import { useParams } from 'react-router-dom';
import {
  normalizeTrimStart
  // normalizeInputBlockCharacter
} from 'src/helpers/common.utils';
import AddOwner from 'src/components/add-owner/add-owner';
import { IOption, IThingForm, MarkerLocation } from '../request-form.page';
import FormItem from 'antd/es/form/FormItem';
import { IUserStore } from 'src/store/user.store';
import RenderAvatar from 'src/components/render-avatar/render-avatar';
import { Role } from 'src/interfaces/user';
import { IManager, IUserOwnerResponseGetByEmail } from 'src/dto/thing.dto';
import { IDeviceModelItem } from 'src/store/device-model/device-model.store';
// import { IParameterFormI } from 'src/pages/parameter/request-form/request-form.page';
import ModelFiled from '../model-field/model-filed';
import { IAccountListStore } from 'src/store/account-management/account-management-list.store';
import { IAccountManagementListRequest } from 'src/dto/account-management-list.dto';
import { ResponseDTO } from 'src/dto/base.dto';

interface IThingInfoFormProps {
  onChangeMarker: (marker: MarkerLocation) => void;
  onAddEmailAdminViewer(email: string): Promise<void>;
  marker?: MarkerLocation;
  formInstanseAddOwner: FormInstance<{ emailAssign: string }>;
  formInstanseAddManager: FormInstance<{ emailAssign: string }>;
  onAddEmailOwner: (email: string) => Promise<void>;
  handleChangeVisibleAddOnwer: (visible: boolean) => void;
  handleChangeVisibleAddViewer: (visible: boolean) => void;
  visibleDropdownAddOwner: boolean;
  visibleDropdownViewer: boolean;
  dataThingDetail: IThingForm | Partial<IThingForm>;
  handleDownload?: () => void;
  status?: string;
  options?: IOption[] | undefined;
  models?: IDeviceModelItem[];
  form: FormInstance;
  listManagerThing: IManager[];
}

export const defaultMarker = {
  lat: 56.130366,
  lng: -106.346771
};

const ThingInfoForm: React.FC<IThingInfoFormProps> = ({
  onAddEmailOwner,
  onAddEmailAdminViewer,
  formInstanseAddOwner,
  formInstanseAddManager,
  visibleDropdownViewer,
  visibleDropdownAddOwner,
  handleChangeVisibleAddOnwer,
  handleChangeVisibleAddViewer,
  handleDownload,
  dataThingDetail,
  status,
  options,
  models,
  form,
  listManagerThing,
}: IThingInfoFormProps) => {
  const [t] = useTranslation();
  const params = useParams();
  const onboardingThingStore: IThingStore = useStore('thingStore');
  const userStore: IUserStore = useStore('userStore');
  const accountManagementListStore: IAccountListStore = useStore(
    'listAccountManagementListStore'
  );
  // const [openParam, setOpenParam] = useState<boolean>(false);
  // const [isChangeDefault, setIsChangeDefault] = useState<boolean>(false);
  // const [isHasValue, setIsHasValue] = useState<boolean>(false);
  // const [model, setModel] = useState<string>();
  const [loadingBtnDownload, setLoadingBtnDownload] = useState<boolean>(false);
  // const [paramList, setParamList] = useState<IParameterFormI[] | undefined>([]);
  // const { Text } = Typography;
  // const handleModal = () => {
  //   setOpen(true);
  // };

  const handleDownloadCerfiticate = async () => {
    try {
      setLoadingBtnDownload(true);
      await handleDownload?.();
    } finally {
      setLoadingBtnDownload(false);
    }
  };

  // useEffect(() => {
  //   const selectedModel = models?.find((item) => item._id === model);
  //   setParamList(selectedModel?.parameterStandards);
  // }, [model]);

  const fetchData = async (request?: IAccountManagementListRequest) => {
    try {
      await accountManagementListStore.fetchList(request);
      const listAccountManagement =
      accountManagementListStore.listAccountManagement;
      console.log('🚀 ~ fetchData ~ listAccountManagement:', listAccountManagement)
    } catch (error) {
      throw Error;
    }
  };

  useEffect(() => {
    if (!params.id) {
      onboardingThingStore.setThing(undefined as any, NaN);
    }
    fetchData();
  }, []);

  const RenderOnlyAvatar = ({ value }: { value?: IManager[] }) => {
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

  const isShowButtonDownLoad = (): boolean => {
    // extract user id from dataThingDetail to a new array
    const listManagers = dataThingDetail?.managers?.map((item) => item.userId);
    if (
      userStore?.userInfo?.id &&
      (userStore.userInfo?.role === Role.ADMIN ||
        listManagers?.includes(userStore.userInfo.id))
    ) {
      return true;
    }
    return false;
  };

  // const onCheck = (checked: boolean) => {
  //   setIsChangeDefault(!checked);
  // };

  const renderAddOwner = () => {
    const isUpdateThing = params?.id;
    if (isUpdateThing) {
      return (
        <Form.Item name="owner" noStyle>
          {userStore.userInfo?.role === Role.ADMIN ? (
            <AddOwner
            value={listManagerThing}
            visibleDropdown={visibleDropdownAddOwner}
            onChangeVisibleDropdown={handleChangeVisibleAddOnwer}
            formInstane={formInstanseAddOwner}
            textBtnAdd={t(i18nKey.thingEntity.button.addOwner)}
            titleDrawer="Add Thing Owner"
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
          value={listManagerThing}
          visibleDropdown={visibleDropdownAddOwner}
          onChangeVisibleDropdown={handleChangeVisibleAddOnwer}
          formInstane={formInstanseAddOwner}
          textBtnAdd={t(i18nKey.thingEntity.button.addOwner)}
          titleDrawer="Add Thing Owner"
          onAddEmail={onAddEmailOwner}
          sizeAvatar={25}
        />
      </Form.Item>
    );
  };

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
          className={styles.formWrapper_thingInfo}>
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
                        {t(i18nKey.thingEntity.button.ownerAssignment)}
                      </Typography.Text>
                      <FormItem name={'viewers'}>
                        {userStore.userInfo?.role === Role.ADMIN ? (
                          <AddOwner
                            value={
                              listManagerThing
                            }
                            titleDrawer={`${t(
                              i18nKey.thingEntity.button.ownerAssignment
                            )}`}
                            formInstane={formInstanseAddManager}
                            visibleDropdown={visibleDropdownViewer}
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
                    <Col span={24}>
                      <Form.Item
                        label={t(i18nKey.thingEntity.label.ThingInfo)}
                        className={styles.formWrapper_locations_field}
                        name={['information']}
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
                            label={t(i18nKey.thingEntity.label.locationName)}
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
                            label={t(i18nKey.thingEntity.label.address)}
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
                            // onClick={() => handleModal()}
                            // readOnly={true}
                            // suffix={
                            //   <EnvironmentOutlined
                            //     onClick={() => handleModal()}
                            //   />
                            // }
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
                    {t(i18nKey.thingEntity.label.devices)}
                  </b>
                </Row>
                <Divider
                  className={styles.formWrapper_box_divider}
                  type="horizontal"></Divider>
                <Row className={styles.formWrapper_box_content}>
                  <Col span={24}>
                    <Form.List
                      name={'devices'}
                      initialValue={[
                        {
                          name: '',
                          model: '',
                          parameterStandardDefault: '',
                          parameterStandards: []
                        }
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
                                          <Col span={8} xl={24} xs={24}>
                                            <Form.Item
                                              className={styles.subForm_item}
                                              label={t(
                                                i18nKey.thingEntity.devices.name
                                              )}
                                              name={[idx, 'name']}
                                              normalize={normalizeTrimStart}
                                              rules={[
                                                ({ getFieldValue }) => ({
                                                  validator(_, value) {
                                                    const valueModel =
                                                      getFieldValue([
                                                        'devices',
                                                        idx,
                                                        'model'
                                                      ]);
                                                    const valueParameterStandardDefault =
                                                      getFieldValue([
                                                        'devices',
                                                        idx,
                                                        'parameterStandardDefault'
                                                      ]);
                                                    if (
                                                      (valueModel ||
                                                        valueParameterStandardDefault) &&
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

                                          {/* <Col
                                            className="gutter-row"
                                            span={8}
                                            xl={8}
                                            xs={12}>
                                            <Form.Item
                                              className={styles.subForm_item}
                                              name={[idx, 'model']}
                                              dependencies={[
                                                'name',
                                                'parameterStandardDefault'
                                              ]}
                                              rules={[
                                                ({ getFieldValue }) => ({
                                                  validator(_, value) {
                                                    const valueName =
                                                      getFieldValue([
                                                        'devices',
                                                        idx,
                                                        'name'
                                                      ]);
                                                    const valueParameterStandardDefault =
                                                      getFieldValue([
                                                        'devices',
                                                        idx,
                                                        'parameterStandardDefault'
                                                      ]);
                                                    if (
                                                      (valueName ||
                                                        valueParameterStandardDefault) &&
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
                                                i18nKey.thingEntity.devices
                                                  .model
                                              )}>
                                              <Select
                                                // list device model
                                                options={options}
                                                allowClear
                                                showSearch
                                                onChange={(e) => {
                                                  if (e) {
                                                    setIsHasValue(true);
                                                    setModel(e);
                                                  } else setIsHasValue(false);
                                                }}
                                              />
                                            </Form.Item>
                                          </Col>
                                          {isHasValue && (
                                            <Col
                                              className="gutter-row"
                                              span={8}
                                              xl={8}
                                              xs={12}
                                              style={{
                                                display: 'flex',
                                                flexDirection: 'column'
                                              }}>
                                              <Form.Item
                                                label={t(
                                                  i18nKey.thingEntity.devices
                                                    .defaultParameter
                                                )}
                                                className={styles.subForm_item}
                                                name={
                                                  'parameterStandardDefault'
                                                }>
                                                <Switch
                                                  defaultChecked
                                                  onChange={onCheck}
                                                />
                                              </Form.Item>
                                            </Col>
                                          )} */}
                                        </Row>
                                        <ModelFiled
                                          dataThingDetail={dataThingDetail}
                                          form={form}
                                          options={options}
                                          idx={idx}
                                          models={models}
                                        />
                                        {/* {isChangeDefault && (
                                          <Row gutter={[12, 16]}>
                                            <Col span={12} xl={12} xs={24}>
                                              <List>
                                                {paramList?.map(
                                                  (param, index) => (
                                                    <List.Item key={index}>
                                                      <Text>{param.name}</Text>
                                                      <CloseCircleOutlined
                                                        style={{ color: 'red' }}
                                                        onClick={() => {
                                                          const newParamLists =
                                                            paramList.filter(
                                                              (item) =>
                                                                item.name !==
                                                                param.name
                                                            );
                                                          setParamList(
                                                            newParamLists
                                                          );
                                                        }}
                                                      />
                                                    </List.Item>
                                                  )
                                                )}
                                              </List>
                                              <Button
                                                type="dashed"
                                                onClick={() =>
                                                  setOpenParam(true)
                                                }
                                                block>
                                                + Add Sub Item
                                              </Button>
                                            </Col>
                                          </Row>
                                        )} */}
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
                                    {/* <Row
                                      gutter={5}
                                      wrap={false}
                                      align={'middle'}>
                                      <Col flex={1}>
                                        <Row gutter={[12, 16]}>
                                          <Col span={8} xl={8} xs={24}>
                                            
                                            <Button
                                              type="dashed"
                                              // onClick={() => subOpt.add()}
                                              block>
                                              + Add Sub Item
                                            </Button>
                                          </Col>
                                        </Row>
                                      </Col>
                                    </Row> */}
                                  </Col>
                                </Row>
                              </Form.Item>
                            );
                          })}
                          <Row gutter={[32, 16]}>
                            <Col className="gutter-row" span={8}>
                              <Button
                                className={styles.buttonAddRow}
                                type="dashed"
                                onClick={() => add()}>
                                <PlusOutlined style={{ color: '#848484' }} />
                                {t(i18nKey.button.addDevice)}
                              </Button>
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
                    disabled={status === 'active'}
                    loading={loadingBtnDownload}
                    className={styles.formWrapper_btn_download}
                    onClick={handleDownloadCerfiticate}>
                    {t(i18nKey.thingEntity.button.downloadNewCertAndKeys)}
                  </Button>
                </Row>
              )}
            </Col>
          </Row>
        </Col>
      </Row>
      {/* <ModalLocation
        onChangeMaker={onChangeMarker}
        marker={marker}
        open={open}
        setOpen={setOpen}
      /> */}
    </div>
  );
};

export default observer(ThingInfoForm);
