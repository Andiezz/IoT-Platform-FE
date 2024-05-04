import {
  Avatar,
  Button,
  Checkbox,
  Col,
  Drawer,
  Dropdown,
  Form,
  Grid,
  Input,
  Popconfirm,
  Row,
  Tooltip
} from 'antd';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ReactComponent as IconOwner } from 'src/assets/icons/add-owner.svg';
import { i18nKey } from 'src/locales/i18n';
import styles from './add-owner.module.less';
import { Owner } from 'src/constants/user';
import { FormInstance } from 'antd/lib/form';

interface IProps {
  value?: Owner[];
  onChange?: (listOwner: Owner[]) => void;
  sizeAvatar: number;
  onAddEmail: (email: string) => Promise<void>;
  titleDrawer?: string;
  textBtnAdd: string;
  formInstane: FormInstance<{ emailAssign: string }>;
  visibleDropdown: boolean;
  onChangeVisibleDropdown: (visible: boolean) => void;
}
const AddOwner = ({
  value = [],
  sizeAvatar,
  onAddEmail,
  onChange,
  titleDrawer,
  textBtnAdd,
  formInstane,
  visibleDropdown,
  onChangeVisibleDropdown
}: IProps) => {
  const [loadingBtn, setLoadingBtn] = useState<boolean>(false);
  const screen = Grid.useBreakpoint();
  const [t] = useTranslation();

  const handleAddEmail = async (values: { emailAssign: string }) => {
    try {
      setLoadingBtn(true);
      await onAddEmail(values.emailAssign);
    } finally {
      setLoadingBtn(false);
    }
  };

  const renderAvatar = (owner: Owner, sizeAvatar: number): React.ReactNode => {
    const firstLetterFirstName = owner.firstName.trim().charAt(0).toUpperCase();
    const firstLetterLastName = owner.lastName.trim().charAt(0).toUpperCase();
    if (owner.avatar) {
      return <Avatar key={owner._id} size={sizeAvatar} src={owner.avatar} />;
    }
    return (
      <Avatar
        key={owner._id}
        size={
          sizeAvatar
        }>{`${firstLetterFirstName}${firstLetterLastName} `}</Avatar>
    );
  };

  const onConfirmRemoveOwner = (_idOwner: string) => {
    const newValue = value.filter((owner) => owner._id !== _idOwner);
    onChange?.(newValue);
  };

  const renderDropDown = () => {
    return (
      <div>
        <Form
          form={formInstane}
          onFinish={handleAddEmail}
          initialValues={{ emailAssign: '' }}>
          <Form.Item
            name="emailAssign"
            rules={[
              {
                required: true,
                message: t(i18nKey.validation.common.requiredField) as string
              },
              {
                type: 'email',
                message: t(
                  i18nKey.validation.emailOrPassword.invalidEmail
                ) as string
              }
            ]}>
            <Row wrap={false} gutter={5}>
              <Input
                allowClear
                placeholder={`${t(
                  i18nKey.accountEntity.placeholder.inputEmail
                )}`}
              />
              <Col>
                <Button type="primary" loading={loadingBtn} htmlType="submit">
                  {textBtnAdd}
                </Button>
              </Col>
            </Row>
          </Form.Item>
        </Form>

        <div className={styles.dropdown_wrapper}>
          {value.map((item) => {
            return item.isDisable ? (
              <Tooltip title={item.textDisable}>
                <div
                  key={item._id + 'abcd'}
                  className={styles.dropdown_wrapper_item}>
                  <Checkbox
                    onClick={(e) => e.stopPropagation()}
                    disabled
                    checked
                  />
                  <div>
                    {renderAvatar(item, 20)}

                    <p>{item.email}</p>
                  </div>
                </div>
              </Tooltip>
            ) : (
              <Popconfirm
                key={item._id + 'abc'}
                onPopupClick={(e) => e.stopPropagation()}
                title={t(i18nKey.confirmationPopup.remove)}
                description={
                  <div>
                    {t(i18nKey.confirmationPopup.removeCustom)}
                    <b>{item.email}</b>
                  </div>
                }
                onConfirm={
                  () => onConfirmRemoveOwner(item._id)
                  // handleRemoveOwnerThing(item.key)
                }
                okText={t(i18nKey.button.ok)}
                cancelText={t(i18nKey.button.cancel)}>
                <div
                  key={item._id + 'abcd'}
                  className={styles.dropdown_wrapper_item}>
                  <Checkbox
                    onClick={(e) => e.stopPropagation()}
                    disabled
                    checked
                  />
                  <div>
                    {renderAvatar(item, 20)}

                    <p>{item.email}</p>
                  </div>
                </div>
              </Popconfirm>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <Avatar.Group style={{ cursor: 'pointer' }}>
      {value.map((owner) => (
        <Tooltip title={owner.email} key={owner._id + 'abcdf'}>
          {renderAvatar(owner, sizeAvatar)}
        </Tooltip>
      ))}
      <Dropdown
        open={!screen.xs && visibleDropdown}
        trigger={['click']}
        onOpenChange={(visible) => {
          onChangeVisibleDropdown(visible);
        }}
        overlayStyle={{ background: '#fff' }}
        dropdownRender={() => (
          <div className={styles.dropdown}>{renderDropDown()}</div>
        )}>
        <IconOwner width={sizeAvatar} height={sizeAvatar} />
      </Dropdown>
      {screen.xs && (
        <Drawer
          title={titleDrawer}
          open={visibleDropdown}
          onClose={() => onChangeVisibleDropdown(false)}>
          {renderDropDown()}
        </Drawer>
      )}
    </Avatar.Group>
  );
};
export default React.memo(AddOwner);
