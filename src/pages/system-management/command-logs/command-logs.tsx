import React, { useState, useCallback, useEffect } from 'react';
import { t } from 'i18next';
import { i18nKey } from 'src/locales/i18n';
import HeaderTitleContent from 'src/components/header-title-content/header-title-content';
import Widget from 'src/components/widget/widget';
import { ISearchValues } from 'src/components/search-option-status-role/search-component';
import {
  ICommandLogsListRequest,
  ICommandLogsManagementItem
} from 'src/dto/command-logs';
import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Select,
  Space,
  Table,
  TablePaginationConfig,
  Tag,
  Typography
} from 'antd';
import commandLogsPage from 'src/locales/commandLogs';
import styles from './command-logs.module.less';
import { ColumnsType } from 'antd/es/table';
import useStore from 'src/hooks/use-store';
import { ICommandLogsListStore } from 'src/store/command-logs/command-logs-managerment-list.store';
import useDebounce from 'src/hooks/use-debounce';
import { SearchOutlined } from '@ant-design/icons';
import { normalizeFormatDate } from 'src/helpers/common.utils';
import LocationPlantIcon from 'src/assets/icons/LocationPlants.svg';
import TooltipParagraph from 'src/components/tooltip-paragraph/tooltip-paragraph';

enum Level {
  Plant = 'plant',
  CellDriver = 'cell-driver',
}

enum Status {
  InProgress = 'in-progress',
  Succeeded = 'succeeded',
  Failed = 'failed',
  Queued = 'queued',
  Open = 'open',
  Closed = 'closed',
  Connected = 'connected',
  Disconected = 'disconnected'
}

export enum Command {
  START = 'start',
  STOP = 'stop',
  REMOTE = 'remote',
  UPDATE_FIRMWARE = 'update-firmware',
  UPDATE_SOFTWARE = 'update-software',
  SET_POINTS = 'set-points',
  SOC_LIMITS = 'soc-limits',
  ENABLE = 'enable',
  DISABLE = 'disable',
  SETTING_DICTIONARY = 'setting-dictionary',
  REFRESH_COMMAND_DATA = 'refresh-command-data',
  REFRESH_PLANT_SERVICES = 'refresh-plant-services',
  REFRESH_PLANT_SERVICE_SETTING = 'refresh-plant-service-setting',
}



const renderColorStatus = (status: Status) => {
  switch (status) {
    case Status.InProgress:
      return 'blue';
    case Status.Succeeded:
      return 'green';
    case Status.Failed:
      return 'volcano';
    case Status.Queued:
      return 'cyan';
    case Status.Open:
    case Status.Closed:
    case Status.Connected:
      return 'purple';
    default:
      return 'red';
  }
};

function CommandLogs() {
  const [searchFields, setSearchFields] =
    useState<ICommandLogsListRequest | null>(null);
  const [form] = Form.useForm();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [loading, setLoading] = useState(false);
  const debouncedValue = useDebounce<string | undefined>(searchFields?.q, 1000);
  const optionStatus = [
    {
      label: `${t(i18nKey.status.queued)}`,
      value: Status.Queued,
      key: Status.Queued
    },
    {
      label: `${t(i18nKey.status['in-progress'])}`,
      value: Status.InProgress,
      key: Status.InProgress
    },
    {
      label: `${t(i18nKey.status.succeeded)}`,
      value: Status.Succeeded,
      key: Status.Succeeded
    },
    {
      label: `${t(i18nKey.status.failed)}`,
      value: Status.Failed,
      key: Status.Failed
    },
    {
      label: `${t(i18nKey.status['closed'])}`,
      value: Status.Closed,
      key: Status.Closed
    },
    {
      label: `${t(i18nKey.status['open'])}`,
      value: Status.Open,
      key: Status.Open
    },
    {
      label: `${t(i18nKey.status['connected'])}`,
      value: Status.Connected,
      key: Status.Connected
    },
    {
      label: `${t(i18nKey.status['disconnected'])}`,
      value: Status.Disconected,
      key: Status.Disconected
    },
  ];
  
  const optionLevel = [
    {
      label: `${t(i18nKey.label.plant)}`,
      value: Level.Plant,
      key: Level.Plant
    },
    {
      label: `${t(i18nKey.label.cellDriver)}`,
      value: Level.CellDriver,
      key: Level.CellDriver
    }
  ];
  
  const optionCommand = [
    {
      label: `${t(i18nKey.commandLogs.command.start)}`,
      value: Command.START,
      key: Command.START
    },
    {
      label: `${t(i18nKey.commandLogs.command.stop)}`,
      value: Command.STOP,
      key: Command.STOP
    },
    {
      label: `${t(i18nKey.commandLogs.command.settingDictionary)}`,
      value: Command.SETTING_DICTIONARY,
      key: Command.SETTING_DICTIONARY
    },
    {
      label: `${t(i18nKey.commandLogs.command.remote)}`,
      value: Command.REMOTE,
      key: Command.REMOTE
    },
    {
      label: `${t(i18nKey.commandLogs.command.updateFirmware)}`,
      value: Command.UPDATE_FIRMWARE,
      key: Command.UPDATE_FIRMWARE
    },
    {
      label: `${t(i18nKey.commandLogs.command.updateSoftware)}`,
      value: Command.UPDATE_SOFTWARE,
      key: Command.UPDATE_SOFTWARE
    },
    {
      label: `${t(i18nKey.commandLogs.command.enable)}`,
      value: Command.ENABLE,
      key: Command.ENABLE
    },
    {
      label: `${t(i18nKey.commandLogs.command.disable)}`,
      value: Command.DISABLE,
      key: Command.DISABLE
    },
    {
      label: `${t(i18nKey.commandLogs.command.setPoint)}`,
      value: Command.SET_POINTS,
      key: Command.SET_POINTS
    },
    {
      label: `${t(i18nKey.commandLogs.command.socLimit)}`,
      value: Command.SOC_LIMITS,
      key: Command.SOC_LIMITS
    },
    {
      label: `${t(i18nKey.commandLogs.command.refreshPlantServiceSetting)}`,
      value: Command.REFRESH_PLANT_SERVICE_SETTING,
      key: Command.REFRESH_PLANT_SERVICE_SETTING
    },
    {
      label: `${t(i18nKey.commandLogs.command.refreshPlantService)}`,
      value: Command.REFRESH_PLANT_SERVICES,
      key: Command.REFRESH_PLANT_SERVICES
    },
    {
      label: `${t(i18nKey.commandLogs.command.refreshCommandData)}`,
      value: Command.REFRESH_COMMAND_DATA,
      key: Command.REFRESH_COMMAND_DATA
    },
  ]

  const commandLogsStore: ICommandLogsListStore = useStore('commandLogsStore');

  const handleChangeFormSearch = useCallback(
    (valueChange: Partial<ISearchValues>) => {
      setPageNumber(1)
      setSearchFields((prev) => ({ ...prev, ...valueChange }));
      if (valueChange.q) {
        setSearchFields((prev) => ({
          ...prev,
          q: valueChange?.q && valueChange?.q.trim()
        }));
      }
    },
    []
  );

  const handleResetSearch = useCallback(() => {
    form.resetFields();
    setSearchFields({
      q: '',
      status: undefined,
      level: undefined,
      command: undefined
    });
  }, []);

  const columns: ColumnsType<ICommandLogsManagementItem> = [
    {
      title: `${t(i18nKey.commandLogs.label.lastUpdatedDate)}`,
      key: 'last_update_date',
      width: 160,
      render: (record: ICommandLogsManagementItem) => {
        return normalizeFormatDate(record.updatedOn);
      }
    },
    {
      title: `${t(i18nKey.commandLogs.label.queuedAt)}`,
      key: 'queued_at',
      width: 160,
      render: (record: ICommandLogsManagementItem) => {
        return normalizeFormatDate(record.createdOn);
      }
    },
    {
      title: `${t(i18nKey.label.level)}`,
      key: 'level',
      dataIndex: 'level',
      width: 90,
      render: (level: string) => (
        <span>
          {(() => {
            switch (level) {
              case Level.Plant:
                return `${t(i18nKey.label.plant)}`;
              case Level.CellDriver:
                return `${t(i18nKey.label.cellDriver)}`;
              default:
                return level;
            }
          })()}
        </span>
      )
    },
    {
      title: `${t(i18nKey.label.plantLocation)}`,
      key: 'tenant_plant_location',
      render: (record: ICommandLogsManagementItem) => {
        return (<>
          <Typography>{record.plant?.name}</Typography>
          {record?.plant?.address && (
            <div className={styles.plantLocations}>
              <Space align="center" style={{ width: '100%' }}>
                <img src={LocationPlantIcon} />
                <Typography className={styles.tableLocationPlant}>
                  <TooltipParagraph>{record?.plant?.address}</TooltipParagraph>
                </Typography>
              </Space>
            </div>
          )}
        </>)
      }
    },
    {
      title: `${t(i18nKey.label.cellDriver)}`,
      key: 'cell_driver',
      render: (record: ICommandLogsManagementItem) => {
        return record?.cell_driver?._id || '-'
      }
    },
    {
      title: `${t(i18nKey.label.hubId)}`,
      key: 'hubId',
      render: (record: ICommandLogsManagementItem) => {
        return record?.cell_driver?.id_map || '-'
      }
    },
    {
      title: `${t(i18nKey.commandLogs.label.command)}`,
      key: 'command_name',
      dataIndex: 'command_name',
      render: (command: Command) => {
       return  t(i18nKey.commandLogs.commandKeyToText[command])
      
      }
    },
    {
      title: `${t(i18nKey.label.status)}`,
      key: 'status',
      dataIndex: 'status',
      render: (status: Status) => {
        if (status) {
          return (
            <Tag
              className={styles.tag}
              color={renderColorStatus(status)}
              icon="• ">
              {`${t(i18nKey.status[status])}`}
            </Tag>
          );
        } else {
          return <span>-</span>;
        }
      }
    },
    {
      title: `${t(i18nKey.label.email)}`,
      key: 'email',
      render: (record: ICommandLogsManagementItem) => {
        return record.user?.email;
      }
    }
  ];

  const onTableChange = async (pagination: TablePaginationConfig) => {
    setPageNumber(pagination.current as number);
    setPageSize(pagination.pageSize as number);
  };

  const fetchData = async (request?: ICommandLogsListRequest) => {
    setLoading(true);
    try {
      await commandLogsStore.fetchList(request);
      setLoading(false);
    } catch (error) {
      throw Error;
    }
  };

  useEffect(() => {
    fetchData({
      ...searchFields,
      page: pageNumber,
      limit: pageSize
    });
  }, [
    pageNumber,
    pageSize,
    searchFields,
    searchFields?.level,
    searchFields?.status,
    searchFields?.command,
    debouncedValue
  ]);

  const renderSearch = () => {
    return (
      <div>
        <Form onValuesChange={handleChangeFormSearch} form={form}>
          <Row gutter={16}>
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
                  placeholder={commandLogsPage.placeholder.search}
                  allowClear
                />
              </Form.Item>
            </Col>

            <Col xs={8} sm={8} md={6} lg={6} xl={3} xxl={2}>
              <Form.Item
                style={{ width: '100%' }}
                name={'level'}
                className={styles.wrapOptionSearch}>
                <Select
                  placeholder="Level"
                  options={optionLevel}
                  popupMatchSelectWidth={130}
                  allowClear
                />
              </Form.Item>
            </Col>

            <Col xs={8} sm={8} md={6} lg={6} xl={3} xxl={2}>
              <Form.Item
                style={{ width: '100%' }}
                name={'status'}
                className={styles.wrapOptionSearch}>
                <Select
                  placeholder="Status"
                  options={optionStatus}
                  popupMatchSelectWidth={200}
                  allowClear
                />
              </Form.Item>
            </Col>

            <Col xs={8} sm={8} md={6} lg={6} xl={4} xxl={3}>
              <Form.Item
                style={{ width: '100%' }}
                name={'command'}
                className={styles.wrapOptionSearch}>
                <Select
                  dropdownMatchSelectWidth={220}
                  placeholder="Command"
                  options={optionCommand}
                  // popupMatchSelectWidth={210}
                  allowClear
                />
              </Form.Item>
            </Col>

            <Col xs={8} sm={8} md={6} lg={3} xl={2} xxl={2}>
              <Form.Item>
                <Button onClick={handleResetSearch}>
                  {t(i18nKey.button.reset)}
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    );
  };

  return (
    <div className={styles.wrapper}>
      <HeaderTitleContent
        title={`${t(i18nKey.menu.commandLogs)}`}></HeaderTitleContent>
      <Widget>
        {renderSearch()}
        <div className={styles.wrapperTable}>
          <Table
            className={styles.tableCommandLogsManagement}
            dataSource={commandLogsStore.listCommandLog}
            columns={columns}
            rowKey={'_id'}
            loading={loading}
            pagination={{
              showTotal: (total) =>
                `${t(i18nKey.button.totalEntries, {
                  totalEntries: `${total}`
                })}`,
              pageSize: pageSize,
              current: pageNumber,
              total: commandLogsStore.totalPages
            }}
            size="middle"
            scroll={{ x: 1500 }}
            onChange={onTableChange}
          />
        </div>
      </Widget>
    </div>
  );
}

export default CommandLogs;
