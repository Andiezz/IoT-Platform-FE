import { Form, Modal, Row } from 'antd';
import React, { useEffect } from 'react';
import styles from './modal-parameter.module.less';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { i18nKey } from 'src/locales/i18n';
import { IParameterFormI } from 'src/pages/parameter/request-form/request-form.page';
import FormPropertyPage from 'src/pages/parameter/request-form/form-property/form-property.page';

export interface IModalParameter {
  open: boolean;
  setOpen: (values: boolean) => void;
  setParamList: (param: IParameterFormI[] | undefined) => void;
  paramList: IParameterFormI[] | undefined;
}

export interface ILocation {
  lat: number;
  lng: number;
}

const ModalParameter: React.FC<IModalParameter> = ({
  open,
  setOpen,
  setParamList,
  paramList
}) => {
  const { t } = useTranslation();
  const [formParam] = Form.useForm<IParameterFormI>();

  useEffect(() => {
    formParam.resetFields();
  }, []);

  const onFormFailed = () => {
    return 2;
  };

  const handleAdd = async () => {
    const newParamList = paramList;
    newParamList?.push(formParam.getFieldsValue());
    setParamList(newParamList);
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
    formParam.resetFields();
  };

  const onChangeColor = (color: string, idx: number) => {
    const thresholds = formParam.getFieldValue('thresholds');
    thresholds[idx].color = color;
    formParam.setFieldValue('thresholds', thresholds);
  };

  return (
    <Modal
      title={t(i18nKey.thingEntity.label.locationPicker)}
      open={open}
      onOk={handleAdd}
      onCancel={handleCancel}
      className={styles.modal}
      okText={t(i18nKey.button.add)}
      width={'50%'}>
      <div className={styles.modal_wrapper}>
        <Row>
          <Form
            form={formParam}
            layout="vertical"
            onFinish={handleAdd}
            onFinishFailed={onFormFailed}>
            <FormPropertyPage onChangeColor={onChangeColor} />
          </Form>
        </Row>
      </div>
    </Modal>
  );
};

export default observer(ModalParameter);
