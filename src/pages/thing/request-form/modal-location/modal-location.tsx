import { AutoComplete, Col, Form, Input, Modal, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import styles from './modal-location.module.less';
import { GoogleMap, MarkerF } from '@react-google-maps/api';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import IconLocation from 'src/assets/icons/Location.svg';
import { i18nKey } from 'src/locales/i18n';
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng
} from 'use-places-autocomplete';
import { defaultMarker } from '../thingInfo/thing-info.page';
import { MarkerLocation } from '../request-form.page';

export interface IModalLocation {
  open: boolean;
  setOpen: (values: boolean) => void;
  marker?: MarkerLocation;
  onChangeMaker: (marker: MarkerLocation) => void;
}

export interface ILocation {
  lat: number;
  lng: number;
}

const ModalLocation: React.FC<IModalLocation> = ({
  open,
  setOpen,
  marker,
  onChangeMaker
}) => {
  const { t } = useTranslation();
  const [form] = Form.useForm<{ location: MarkerLocation }>();
  const [selected, setSelected] = useState<ILocation>(marker || defaultMarker);

  const [addressLocation, setAddressLocation] = useState<string>('');
  useEffect(() => {
    const dataSelect = marker || defaultMarker;
    setSelected({ ...dataSelect });
    setAddressLocation(
      marker
        ? `${i18nKey.plantEntity.label.longitude} ${marker.lng}" ${i18nKey.plantEntity.label.latitude} ${marker.lat} ${marker.address}`
        : ''
    );
  }, [marker, open]);

  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions
  } = usePlacesAutocomplete();

  const validateAddress = async () => {
    await form.validateFields();
    if (status === 'OK') {
      const results = await getGeocode({ address: data[0].description });
      const { lat, lng }: ILocation = getLatLng(results[0]);
      const location: MarkerLocation = {
        lat,
        lng,
        address: data[0].description
      };

      onChangeMaker(location);

      return false;
    } else if (status === 'ZERO_RESULTS') {
      form.setFields([
        {
          name: ['location', 'address'],
          errors: [
            `${t(i18nKey.validation.plantAndLocation.locationAutocompleteErr)}`
          ]
        }
      ]);
      return true;
    } else {
      // const results = await getGeocode({ address });
      // const { lat, lng }: ILocation = getLatLng(results[0]);

      const location: MarkerLocation = {
        lat: selected.lat,
        lng: selected.lng,
        address: value
      };
      onChangeMaker(location);

      return false;
    }
  };
  const handleSelect = async (address: string) => {
    setValue(address, false);
    clearSuggestions();
    const results = await getGeocode({ address });
    const { lat, lng }: ILocation = getLatLng(results[0]);
    setSelected({ lat, lng });
    setAddressLocation(
      `${i18nKey.plantEntity.label.longitude} ${lng}" ${i18nKey.plantEntity.label.latitude} ${lat} ${address}`
    );
  };

  const display = () => {
    return status === 'OK' ? true : false;
  };

  const onSearch = (value: string) => {
    setValue(value);
  };

  const optionList = data.map(({ place_id, description }) => {
    return {
      label: description,
      value: description,
      key: place_id
    };
  });

  const handleCancel = () => {
    setOpen(false);
    setSelected(defaultMarker);
    setValue('');
    form.resetFields();
  };

  useEffect(() => {
    const locationData = marker || defaultMarker;
    form.setFieldsValue({ location: { ...locationData } });
  }, [open, marker]);

  const handleAdd = async () => {
    if (await validateAddress()) {
      return;
    }
    setSelected(defaultMarker);
    setAddressLocation('');
    setOpen(false);
  };

  const handleClear = () => {
    setAddressLocation('');
    form.setFieldsValue({});
  };

  return (
    <Modal
      title={t(i18nKey.plantEntity.label.locationPicker)}
      open={open}
      onOk={handleAdd}
      onCancel={handleCancel}
      className={styles.modal}
      okText={t(i18nKey.button.add)}>
      <div className={styles.modal_wrapper}>
        <Row>
          {open && (
            <GoogleMap
              zoom={5}
              center={selected}
              // maxZoom={14}
              options={{ zoom: 5 }}
              mapContainerClassName={styles.modal_wrapper_map}>
              {selected.lat !== defaultMarker.lat && (
                <MarkerF position={{ lat: selected.lat, lng: selected.lng }} />
              )}
            </GoogleMap>
          )}
        </Row>
        <Row>
          <Form
            form={form}
            initialValues={{ location: { ...marker } }}
            layout="vertical"
            style={{ width: '100%' }}>
            <div className={styles.modal_wrapper_info}>
              <Col span={24}>
                <Form.Item
                  name={['location', 'address']}
                  label={t(i18nKey.plantEntity.label.address)}
                  required
                  rules={[
                    {
                      required: true,
                      message: `${t(i18nKey.validation.common.requiredField)}`
                    }
                  ]}>
                  <AutoComplete
                    options={optionList}
                    style={{ width: 200 }}
                    onSelect={handleSelect}
                    disabled={!ready}
                    filterOption={display}
                    onSearch={onSearch}
                    value={value}
                    onClear={handleClear}
                    allowClear
                    className={
                      styles.modal_wrapper_autocomplate
                    }></AutoComplete>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item style={{ margin: '0' }}>
                  {addressLocation !== '' && (
                    <Input
                      prefix={<img src={IconLocation} />}
                      disabled
                      value={addressLocation}
                      className={styles.modal_wrapper_addressLocation}
                    />
                  )}
                </Form.Item>
              </Col>
            </div>
          </Form>
        </Row>
      </div>
    </Modal>
  );
};

export default observer(ModalLocation);
