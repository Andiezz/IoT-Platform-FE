import {
  Button,
  Col,
  Form,
  Grid,
  Layout,
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
import useStore from 'src/hooks/use-store';
import { i18nKey } from 'src/locales/i18n';
import FormProperty from './form-property/form-property.page';
import styles from './request-form.module.less';
import ToastifyConfirm from 'src/components/toastify-confirm/toastify-confirm';
import {
  BodyCreateParameterDTO,
  BodyUpdateParameterDTO
} from 'src/dto/parameter.dto';
import { IParameterStore } from 'src/store/parameter/parameter.store';

export interface IParameterFormI {
  thresholds: Array<{
    name: string;
    color: string;
    min: number;
    max: number;
  }>;
  name: string;
  unit: string;
  weight: number;
}

const RequestForm: React.FC = () => {
  const [t] = useTranslation();
  const params = useParams();
  const navigator = useNavigate();
  const { Footer } = Layout;
  const [form] = Form.useForm<IParameterFormI>();
  const [isDisable, setIsDisable] = useState(true);
  const [dataParameterDetail, setDataParameterDetail] = useState<
    IParameterFormI | Partial<IParameterFormI>
  >({});
  const [loading, setLoading] = useState(false);
  const [openToastifyConfirm, setOpenToastifyConfirm] =
    useState<boolean>(false);
  const [action, setAction] = useState<'create' | 'update' | 'cancel'>(
    'cancel'
  );

  //store
  const dataParameter: IParameterStore = useStore('parameterStore');

  const screen = Grid.useBreakpoint();

  useEffect(() => {
    if (params.id) {
      setLoading(true);
      dataParameter.getDetailParameter({ id: params.id }).then((rs) => {
        setLoading(false);
        if (rs.responseCode === HTTP_STATUS_RESPONSE_KEY.SUCCESS) {
          const resParameterDetail = rs.data;

          const thresholds = resParameterDetail?.thresholds.length
            ? resParameterDetail?.thresholds.map((item) => {
                return {
                  name: item.name,
                  color: item.color,
                  min: item.min,
                  max: item.max
                };
              })
            : [
                {
                  name: '',
                  color: '',
                  min: '',
                  max: ''
                }
              ];
          const name = resParameterDetail?.name;
          const unit = resParameterDetail?.unit;
          const weight = resParameterDetail?.weight;

          setDataParameterDetail({
            name,
            unit,
            weight,
            thresholds
          } as IParameterFormI);
        }
      });
    }
  }, []);

  useEffect(() => {
    form.setFieldsValue({ ...dataParameterDetail });
  }, [dataParameterDetail]);

  const onFormFailed = () => {
    return 2;
  };

  const handleConfirmOk = () => {
    form.submit();
    navigator(PAGE_ROUTE.PARAMETER);
  };

  const handleCancelPopupConfirm = () => {
    setOpenToastifyConfirm(false);
    navigator(PAGE_ROUTE.PARAMETER);
  };

  const handleCreateParameter = async (values: IParameterFormI) => {
    try {
      setLoading(true);
      setOpenToastifyConfirm(false);
      const thresholds = values.thresholds.reduce(
        (
          acc: Array<{
            name: string;
            color: string;
            min: number;
            max: number;
          }>,
          item
        ) => {
          if (item.name) {
            acc.push({
              name: item.name,
              color: item.color,
              min: item.min,
              max: item.max
            });
          }
          return acc;
        },
        []
      );
      //--------------------------------------------//

      const bodyCreateParameter: BodyCreateParameterDTO = {
        name: values.name,
        unit: values.unit,
        weight: Number(values.weight),
        thresholds
      };

      const rs = await dataParameter.createParameter(bodyCreateParameter);
      if (rs.responseCode === HTTP_STATUS_RESPONSE_KEY.SUCCESS) {
        message.success(t(i18nKey.validation.common.toastCreateSuccess));
        navigator(PAGE_ROUTE.PARAMETER);
      } else {
        message.error(t(i18nKey.validation.common.toastCreateFail));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateParameter = async (values: IParameterFormI) => {
    try {
      setLoading(true);
      setOpenToastifyConfirm(false);
      const thresholds = values.thresholds.reduce(
        (
          acc: Array<{
            name: string;
            color: string;
            min: number;
            max: number;
          }>,
          item
        ) => {
          if (item.name) {
            acc.push({
              name: item.name,
              color: item.color,
              min: item.min,
              max: item.max
            });
          }
          return acc;
        },
        []
      );

      const bodyUpdateParameter: BodyUpdateParameterDTO = {
        name: values.name,
        unit: values.unit,
        weight: Number(values.weight),
        thresholds
      };
      const rs = await dataParameter.updateParameter(bodyUpdateParameter, {
        id: params.id as string
      });
      if (rs.responseCode === HTTP_STATUS_RESPONSE_KEY.SUCCESS) {
        message.success(t(i18nKey.validation.common.toastUpdateSuccess));
        navigator(PAGE_ROUTE.PARAMETER);
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

  const onChangeColor = (color: string, idx: number) => {
    const thresholds = form.getFieldValue('thresholds');
    thresholds[idx].color = color;
    form.setFieldValue('thresholds', thresholds);
  };

  const renderFormItem = () => {
    return (
      <div>
        <FormProperty onChangeColor={onChangeColor} />
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
            {params.id ? t(i18nKey.button.update) : t(i18nKey.button.create)}
          </Button>
        </Col>
      </>
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
                    ? `${t(i18nKey.parameterEntity.title.updateParameter)}`
                    : `${t(i18nKey.parameterEntity.title.createParameter)}`}
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
            onFinish={params.id ? handleUpdateParameter : handleCreateParameter}
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
    </Spin>
  );
};

export default observer(RequestForm);
