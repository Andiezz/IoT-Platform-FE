/* eslint-disable react/prop-types */
import { Avatar, Table, Tag, Tooltip, Typography, message } from 'antd';
import { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ReactComponent as DieselGenerator } from 'src/assets/icons/Diesel-generator.svg';
import { ReactComponent as PVInverter } from 'src/assets/icons/PV-invertor.svg';
import { ReactComponent as WindTurbine } from 'src/assets/icons/Wind-turbine.svg';
import ToastifyConfirm from 'src/components/toastify-confirm/toastify-confirm';
import Widget from 'src/components/widget/widget';
import { DeviceType } from 'src/constants/ems';
import { STATUS } from 'src/constants/status';
import { tagColorStatus } from 'src/constants/utils';
import { uniqueKey } from 'src/helpers/string.utils';
import { i18nKey } from 'src/locales/i18n';
import styles from './ems.module.less';
export interface IEmsPlant {
  key: string;
  _id: string;
  name: string;
  location: string;
  status: string;
  emsOwner: {
    _id: string;
    email: string;
    avatar?: string;
    first_name: string;
    last_name: string;
  }[];
  associatedAssets: Array<any>;
}
interface IProps {
  listEms: IEmsPlant[];
  onRemoveEms(id: string): Promise<boolean>;
  totalEms: number;
}

const EmsPlant = ({ listEms, onRemoveEms, totalEms }: IProps) => {
  const { t } = useTranslation();
  const [openToastify, setOpenToastify] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [pageNumber, setPageNumer] = useState<number>(1);

  const handleOkRemoveEms = async (id: string) => {
    setLoading(true);
    setOpenToastify(false);
    const res = await onRemoveEms(id);
    setLoading(false);
    if (res) {
      message.success(t(i18nKey.validation.common.toastRemoveSuccess));
    } else {
      message.error(t(i18nKey.validation.common.toastRemoveFail));
    }
  };

  const columns: ColumnsType<IEmsPlant> = [
    {
      title: 'Ems Name',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: `${t(i18nKey.label.associatedAssets)}`,
      render: (record) => {
        return record?.associatedAssets &&
          record?.associatedAssets.length > 0 ? (
          record.associatedAssets.map((item: any, idx: any) => {
            switch (item.device_type.name as DeviceType) {
              case DeviceType.PV_Inverter:
                return (
                  <Tag
                    icon={<PVInverter style={{ marginRight: '5px' }} />}
                    key={idx}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      color: '#FF8060',
                      background: 'rgba(255, 128, 96, 0.1)'
                    }}>
                    {' '}
                    {item.information + 'kW'}
                  </Tag>
                );
              case DeviceType.Diesel_Generator:
                return (
                  <Tag
                    key={idx}
                    icon={<DieselGenerator style={{ marginRight: '5px' }} />}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      color: '#8B75FF',
                      background: 'rgba(139, 117, 255, 0.1)'
                    }}>
                    {' '}
                    {item.information + 'kW'}
                  </Tag>
                );
              case DeviceType.Wind_Turbine:
                return (
                  <Tag
                    key={idx}
                    icon={<WindTurbine style={{ marginRight: '5px' }} />}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      color: '#50C878',
                      background: 'rgba(80, 200, 120, 0.1)'
                    }}>
                    {item.information + 'kW'}
                  </Tag>
                );
            }
          })
        ) : (
          <Typography.Text>-</Typography.Text>
        );
      }
    },
    {
      title: `${t(i18nKey.label.location)}`,
      key: 'location',
      dataIndex: 'location'
    },

    {
      title: `${t(i18nKey.label.locationOwner)}`,
      key: 'emsOwner',

      render: (record: IEmsPlant) => (
        <>
          {record.emsOwner && record.emsOwner.length > 0 ? (
            <Avatar.Group size={'small'} className={styles.avatar_group}>
              {record.emsOwner.map((item) => {
                return (
                  <Tooltip title={item.email} key={uniqueKey(21)}>
                    {item?.avatar ? (
                      <Avatar key={uniqueKey(10)} src={item.avatar} />
                    ) : (
                      <Avatar
                        style={{ backgroundColor: '#BCBCC0' }}
                        key={uniqueKey(10)}
                        size={'small'}>{`${
                        item?.first_name?.toUpperCase().trim()[0]
                      }${item?.last_name?.toUpperCase().trim()[0]}`}</Avatar>
                    )}
                  </Tooltip>
                );
              })}
            </Avatar.Group>
          ) : (
            <Typography>-</Typography>
          )}
        </>
      )
    },
    {
      title: `${t(i18nKey.label.status)}`,
      dataIndex: 'status',
      key: 'status',
      render: (status: STATUS) => (
        <Tag style={tagColorStatus(status)}>• {t(i18nKey.status[status])}</Tag>
      )
    }
  ];

  const handleCancleConfirm = () => {
    setOpenToastify(false);
  };

  const onTableChange = async (pagination: TablePaginationConfig) => {
    setPageNumer(pagination.current as number);
  };

  return (
    <div className={styles.container}>
      <Widget>
        <Table
          className={styles.container_tablePlant}
          dataSource={listEms}
          loading={loading}
          columns={columns}
          onChange={onTableChange}
          pagination={{
            showTotal: (total) =>
              `${t(i18nKey.button.totalEntries, { totalEntries: `${total}` })}`,
            pageSize: 15,
            current: pageNumber,
            total: totalEms
          }}
          scroll={{ x: 1500 }}
          size="middle"
        />
        <ToastifyConfirm
          openToastify={openToastify}
          onCancel={handleCancleConfirm}
          onSubmit={async (id) => handleOkRemoveEms(id as string)}
          title={`${t(i18nKey.button.remove)}`}
          description={`${t(i18nKey.confirmationPopup.remove)}`}
        />
      </Widget>
    </div>
  );
};

export default React.memo(EmsPlant);
