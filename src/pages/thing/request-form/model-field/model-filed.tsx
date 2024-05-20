import React from 'react';
import {
  Col,
  Form,
  FormInstance,
  List,
  Row,
  Select,
  Switch,
  Typography
} from 'antd';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { i18nKey } from 'src/locales/i18n';
import { IParameterFormI } from 'src/pages/parameter/request-form/request-form.page';
import { IOption, IThingForm } from '../request-form.page';
import { UploadOutlined } from '@ant-design/icons';
import styles from './model-filed.module.less';
import { IDeviceModelItem } from 'src/store/device-model/device-model.store';
import ModalParameter from '../modal-parameter/modal-parameter';
import { IParameterItem } from 'src/store/parameter/parameter.store';

interface ModelFieldProps {
  options: IOption[] | undefined;
  idx: number;
  models: IDeviceModelItem[] | undefined;
  form: FormInstance;
  dataThingDetail?: IThingForm | Partial<IThingForm>;
}

const ModelField: React.FC<ModelFieldProps> = ({
  options,
  idx,
  models,
  form,
  dataThingDetail
}) => {
  const { t } = useTranslation();
  const [paramList, setParamList] = useState<IParameterFormI[] | undefined>([]);
  const [isHasValue, setIsHasValue] = useState<boolean>(false);
  const [model, setModel] = useState<string>();
  const [isChangeDefault, setIsChangeDefault] = useState<boolean>(false);
  const [openParam, setOpenParam] = useState<boolean>(false);
  const [updateParam, setUpdateParam] = useState<IParameterFormI | undefined>();
  const { Text } = Typography;
  const defaultParam = form.getFieldValue([
    'devices',
    idx,
    'parameterStandards'
  ]);
  const defaultModel = form.getFieldValue(['devices', idx, 'model']);
  const onCheck = (checked: boolean) => {
    setIsChangeDefault(!checked);
  };

  useEffect(() => {
    setIsHasValue(!!dataThingDetail);
    if (defaultModel) {
      setParamList(defaultParam);
      form.setFieldValue(['devices', idx, 'model'], defaultModel.value);
    }
  }, [defaultParam]);

  useEffect(() => {
    if (!isChangeDefault) {
      const value = !isChangeDefault;
      form.setFieldValue(['devices', idx, 'parameterStandardDefault'], value);
    } else {
      form.setFieldValue(
        ['devices', idx, 'parameterStandardDefault'],
        !isChangeDefault
      );
      form.setFieldValue(['devices', idx, 'parameterStandards'], paramList);
    }
  }, [isChangeDefault, paramList]);

  useEffect(() => {
    const selectedModel: IParameterItem[] | undefined = models?.find(
      (item) => item._id === model
    )?.parameterStandards;
    const params = selectedModel?.map((obj) => {
      const newObj = {
        name: obj.name,
        unit: obj.unit,
        weight: obj.weight,
        thresholds: obj.thresholds
      };
      return newObj;
    });
    setParamList(params);
  }, [model]);

  const handleUpdateParam = (paramName: string) => {
    const param: IParameterFormI | undefined = paramList?.find(
      (item) => item.name === paramName
    );
    setUpdateParam(param);
    setOpenParam(true);
  };

  return (
    <div>
      <Row gutter={[0, 16]} wrap={false} align={'middle'}>
        <Col flex={1}>
          <Row style={{ paddingTop: '12px' }} gutter={[12, 16]}>
            <Col className="gutter-row" span={8} xl={12} xs={12}>
              <Form.Item
                className={styles.subForm_item}
                name={[idx, 'model']}
                dependencies={['name', 'parameterStandardDefault']}
                rules={[
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      const valueName = getFieldValue(['devices', idx, 'name']);
                      const valueParameterStandardDefault = getFieldValue([
                        'devices',
                        idx,
                        'parameterStandardDefault'
                      ]);
                      if (
                        (valueName || valueParameterStandardDefault) &&
                        !value?.trim()
                      ) {
                        return Promise.reject(
                          new Error(
                            `${t(i18nKey.validation.common.requiredField)}`
                          )
                        );
                      }
                      return Promise.resolve();
                    }
                  })
                ]}
                label={t(i18nKey.thingEntity.devices.model)}>
                <Select
                  options={options}
                  allowClear
                  showSearch
                  onChange={(e) => {
                    if (e) {
                      setIsHasValue(true);
                      setModel(e);
                    } else {
                      setIsChangeDefault(false);
                      setIsHasValue(false);
                    }
                  }}
                />
              </Form.Item>
            </Col>
            {isHasValue && (
              <Col
                className="gutter-row"
                span={8}
                xl={12}
                xs={12}
                style={{
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                <Form.Item
                  label={t(i18nKey.thingEntity.devices.defaultParameter)}
                  className={styles.subForm_item}>
                  <Switch defaultChecked onChange={onCheck} />
                </Form.Item>
              </Col>
            )}
          </Row>
          <Row gutter={[12, 16]}>
            {isChangeDefault && (
              <Row style={{ padding: '12px' }} gutter={[12, 16]}>
                <Col span={12} xl={24} xs={24}>
                  <List>
                    {paramList?.map((param, index) => (
                      <List.Item key={index}>
                        <Text>{param.name}</Text>
                        <UploadOutlined
                          style={{
                            color: 'blue',
                            fontSize: '15px',
                            marginLeft: '20px'
                          }}
                          onClick={() => handleUpdateParam(param.name)}
                        />
                      </List.Item>
                    ))}
                  </List>
                  {/* <Button
                    type="dashed"
                    onClick={() => setOpenParam(true)}
                    block>
                    + Add Sub Item
                  </Button> */}
                </Col>
              </Row>
            )}
          </Row>
        </Col>
      </Row>
      {openParam && updateParam && (
        <ModalParameter
          open={openParam}
          setOpen={setOpenParam}
          setParamList={setParamList}
          paramList={paramList}
          updateParam={updateParam}
        />
      )}
    </div>
  );
};

export default observer(ModelField);
