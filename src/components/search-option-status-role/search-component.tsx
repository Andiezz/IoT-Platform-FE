import React, { useEffect, useMemo, useState } from 'react';
import { DownOutlined, SearchOutlined, UpOutlined } from '@ant-design/icons';
import { Button, Col, Form, FormInstance, Input, Row, Select } from 'antd';
import { IOptions } from 'src/interfaces';
import styles from './search-component.module.less';
import { useTranslation } from 'react-i18next';
import { i18nKey } from 'src/locales/i18n';
import { useLocation } from 'react-router-dom';
import { PAGE_ROUTE } from 'src/constants/route';
import useDebounce from 'src/hooks/use-debounce';

export interface ISearchValues {
  q?: string;
  role_id?: string;
  level?: string;
  status?: string;
  command?: string;
  isActive?: boolean;
}

interface IProps<T> {
  optionRole?: IOptions[];
  optionStatus?: IOptions[];
  optionLevel?: IOptions[];
  optionCommand?: IOptions[];
  handleChangeFormSearch: (changeValue: Partial<T>, value: T) => void;
  handleResetSearch: () => void;
  formInstanceSearch?: FormInstance<T>;
  initialValues?: T;
  nameSelectStatus?: string;
  nameSelectLevel?: string;
  nameSelectCommand?: string;
  placeholder?: string;
  handleMap?: () => void;
  map?: boolean;
}

const SearchComponent = ({
  handleChangeFormSearch,
  handleResetSearch,
  formInstanceSearch,
  optionRole,
  optionLevel,
  optionStatus,
  optionCommand,
  initialValues = { q: '' },
  nameSelectStatus,
  handleMap,
  map,
  nameSelectLevel,
  nameSelectCommand,
  placeholder
}: IProps<ISearchValues>) => {
  const [t] = useTranslation();
  const [tempForm] = Form.useForm();
  const [search,setSearch] = useState<string| undefined>(initialValues.q);
  const [isOnChange,setIsOnChange] = useState<boolean>(false)
  const [valuesSearch,setValuesSearch] = useState<ISearchValues>(initialValues)
  const querySearch = useDebounce(search,1000);
  const form = useMemo(() => {
    if (formInstanceSearch) {
      return formInstanceSearch;
    } else {
      return tempForm;
    }
  }, [formInstanceSearch]);

  const location = useLocation();

  const handReset = () => {
    form.resetFields();
    handleResetSearch();
  };
  const handleChange = (valueChange: Partial<ISearchValues>,values: ISearchValues)=>{
    setIsOnChange(true)
    if(Object.keys(valueChange).includes('q')){
      setSearch(valueChange.q)
    }
    else{
      handleChangeFormSearch(valueChange,values);
      setValuesSearch(values)
    }
  }

  useEffect(()=>{
    if(isOnChange){
      handleChangeFormSearch({q: querySearch},{...valuesSearch,q: querySearch})
    }
  },[querySearch])

  return (
    <div>
      <Form
        initialValues={initialValues}
        onValuesChange={handleChange}
        form={form}
        className={styles.wrapForm}>
        <Row gutter={[16, 16]}>
          <Col
            xs={24}
            sm={24}
            md={24}
            lg={12}
            xl={12}
            xxl={8}
            className={styles.wrapSearchInput}>
            <Form.Item name="q">
              <Input
                prefix={<SearchOutlined />}
                placeholder={
                  placeholder ?? `${t(i18nKey.defaultPlaceholder.search)}`
                }
                allowClear
              />
            </Form.Item>
          </Col>
          <Col xs={11} sm={8} md={8} lg={4} xl={3} xxl={3}>
            {optionRole && (
              <Form.Item name="role_id" className={styles.wrapOptionSearch}>
                <Select
                  style={{ width: 130 }}
                  placeholder="Role"
                  options={optionRole}
                  allowClear
                  dropdownMatchSelectWidth={130}
                />
              </Form.Item>
            )}
            {optionLevel && (
              <Form.Item
                style={{ width: 81 }}
                name={nameSelectLevel}
                className={styles.wrapOptionSearch}>
                <Select
                  placeholder="Level"
                  options={optionLevel}
                  dropdownMatchSelectWidth={130}
                  allowClear
                />
              </Form.Item>
            )}
            {optionStatus && (
              <Form.Item
                style={{ width: '100%' }}
                name={nameSelectStatus}
                className={styles.wrapOptionSearch}>
                <Select
                  placeholder="Status"
                  options={optionStatus}
                  allowClear
                  dropdownMatchSelectWidth={130}
                />
              </Form.Item>
            )}
            {optionCommand && (
              <Form.Item
                style={{ width: 116 }}
                name={nameSelectCommand}
                className={styles.wrapOptionSearch}>
                <Select
                  placeholder="Command"
                  options={optionCommand}
                  dropdownMatchSelectWidth={175}
                  allowClear
                />
              </Form.Item>
            )}
          </Col>
          <Col xs={5} sm={8} md={8} lg={3} xl={2} xxl={5}>
            <Button onClick={handReset}>{t(i18nKey.button.reset)}</Button>
          </Col>
          <Col
            xs={8}
            sm={8}
            md={8}
            lg={5}
            xl={7}
            xxl={8}
            style={{ textAlign: 'end' }}>
            {location.pathname === PAGE_ROUTE.DASHBOARD_THING && (
              <Button onClick={handleMap} className={styles.btnMap}>
                {t(i18nKey.thingEntity.button.map)}
                {map ? (
                  <UpOutlined style={{ fontSize: '12px' }} />
                ) : (
                  <DownOutlined style={{ fontSize: '12px' }} />
                )}
              </Button>
            )}
          </Col>
        </Row>
      </Form>
    </div>
  );
};
export default React.memo(SearchComponent);
