/* eslint-disable react/prop-types */
import { Col, Divider, Form, Input, Row, Select } from 'antd';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { i18nKey } from 'src/locales/i18n';
import styles from './form-property.module.less';
import { IOption } from '../request-form.page';

interface IDeviceModelFormProps {
  options: IOption[] | undefined;
}
const FormProperty: React.FC<IDeviceModelFormProps> = ({
  options
}: IDeviceModelFormProps) => {
  const [t] = useTranslation();

  return (
    <div className={styles.formWrapper}>
      <Row gutter={[24, 24]}>
        <Col
          xs={24}
          sm={24}
          md={24}
          lg={18}
          xl={18}
          xxl={12}
          className={styles.formWrapper_plantInfo}>
          <Row gutter={[0, 24]}>
            <Col span={24}>
              <div className={styles.formWrapper_box}>
                <Row className={styles.formWrapper_box_header}>
                  <b className={styles.formWrapper_title}>
                    {t(i18nKey.label.information)}
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
                            label={t(i18nKey.deviceModelEntity.label.name)}
                            className={styles.formWrapper_locations_field}
                            name={'name'}
                            required
                            rules={[
                              {
                                required: true,
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
                            label={t(
                              i18nKey.deviceModelEntity.label.information
                            )}
                            className={styles.formWrapper_locations_field}
                            name={'information'}
                            required
                            rules={[
                              {
                                required: true,
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
                            label={t(i18nKey.deviceModelEntity.label.type)}
                            className={styles.formWrapper_locations_field}
                            name={'type'}
                            required
                            rules={[
                              {
                                required: true,
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
                            label={t(i18nKey.deviceModelEntity.label.parameterStandards)}
                            className={styles.formWrapper_locations_field}
                            name={'parameterStandards'}
                            required
                            rules={[
                              {
                                required: true,
                                message: `${t(
                                  i18nKey.validation.common.requiredField
                                )}`
                              }
                            ]}>
                            <Select
                              mode="multiple"
                              showArrow
                              showSearch
                              style={{ width: '100%' }}
                              options={options}
                              optionFilterProp="label"
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default observer(FormProperty);
