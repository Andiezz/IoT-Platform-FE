/* eslint-disable react/prop-types */
import { CloseCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Col, ColorPicker, Divider, Form, Input, Row } from 'antd';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { i18nKey } from 'src/locales/i18n';
import styles from './form-property.module.less';

import {
  normalizeTrimStart,
  normalizeInputBlockCharacter
} from 'src/helpers/common.utils';

interface IParameterFormProps {
  onChangeColor: (color: string, idx: number) => void;
}
const FormProperty: React.FC<IParameterFormProps> = ({
  onChangeColor
}: IParameterFormProps) => {
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
                            label={t(i18nKey.parameterEntity.label.name)}
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
                            label={t(i18nKey.parameterEntity.label.unit)}
                            className={styles.formWrapper_locations_field}
                            name={'unit'}
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
                            label={t(i18nKey.parameterEntity.label.weight)}
                            className={styles.formWrapper_locations_field}
                            name={'weight'}
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
                    {t(i18nKey.parameterEntity.label.thresholds)}
                  </b>
                </Row>
                <Divider
                  className={styles.formWrapper_box_divider}
                  type="horizontal"></Divider>
                <Row className={styles.formWrapper_box_content}>
                  <Col span={24}>
                    <Form.List
                      name={'thresholds'}
                      initialValue={[
                        { name: '', color: '', min: '', max: '' }
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
                                          <Col span={6} xl={6} xs={12}>
                                            <Form.Item
                                              className={styles.subForm_item}
                                              label={t(
                                                i18nKey.parameterEntity
                                                  .thresholds.name
                                              )}
                                              name={[idx, 'name']}
                                              normalize={normalizeTrimStart}
                                              rules={[
                                                ({ getFieldValue }) => ({
                                                  validator(_, value) {
                                                    const valueColor =
                                                      getFieldValue([
                                                        'thresholds',
                                                        idx,
                                                        'color'
                                                      ]);
                                                    const valueMin =
                                                      getFieldValue([
                                                        'thresholds',
                                                        idx,
                                                        'min'
                                                      ]);
                                                    const valueMax =
                                                      getFieldValue([
                                                        'thresholds',
                                                        idx,
                                                        'max'
                                                      ]);
                                                    if (
                                                      (valueColor ||
                                                        valueMin ||
                                                        valueMax) &&
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
                                            span={6}
                                            xl={6}
                                            xs={12}>
                                            <Form.Item
                                              className={styles.subForm_item}
                                              name={[idx, 'color']}
                                              label={t(
                                                i18nKey.parameterEntity
                                                  .thresholds.color
                                              )}>
                                              <ColorPicker
                                                showText
                                                onChange={(e) =>
                                                  onChangeColor(
                                                    e.toHexString(),
                                                    idx
                                                  )
                                                }
                                              />
                                            </Form.Item>
                                          </Col>
                                          <Col
                                            className="gutter-row"
                                            span={6}
                                            xl={6}
                                            xs={12}>
                                            <Form.Item
                                              label={t(
                                                i18nKey.parameterEntity
                                                  .thresholds.min
                                              )}
                                              name={[idx, 'min']}
                                              className={styles.subForm_item}
                                              rules={[
                                                ({ getFieldValue }) => ({
                                                  validator(_, value) {
                                                    const valueName =
                                                      getFieldValue([
                                                        'thresholds',
                                                        idx,
                                                        'name'
                                                      ]);

                                                    const valueColor =
                                                      getFieldValue([
                                                        'thresholds',
                                                        idx,
                                                        'color'
                                                      ]);
                                                    const valueMax =
                                                      getFieldValue([
                                                        'thresholds',
                                                        idx,
                                                        'max'
                                                      ]);

                                                    if (
                                                      (valueName ||
                                                        valueColor ||
                                                        valueMax) &&
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
                                                      (valueName ||
                                                        valueColor ||
                                                        valueMax) &&
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
                                          <Col
                                            className="gutter-row"
                                            span={6}
                                            xl={6}
                                            xs={12}>
                                            <Form.Item
                                              label={t(
                                                i18nKey.parameterEntity
                                                  .thresholds.max
                                              )}
                                              name={[idx, 'max']}
                                              className={styles.subForm_item}
                                              rules={[
                                                ({ getFieldValue }) => ({
                                                  validator(_, value) {
                                                    const valueName =
                                                      getFieldValue([
                                                        'thresholds',
                                                        idx,
                                                        'name'
                                                      ]);

                                                    const valueColor =
                                                      getFieldValue([
                                                        'thresholds',
                                                        idx,
                                                        'color'
                                                      ]);
                                                    const valueMin =
                                                      getFieldValue([
                                                        'thresholds',
                                                        idx,
                                                        'min'
                                                      ]);

                                                    if (
                                                      (valueName ||
                                                        valueColor ||
                                                        valueMin) &&
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
                                                      (valueName ||
                                                        valueColor ||
                                                        valueMin) &&
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
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default observer(FormProperty);
