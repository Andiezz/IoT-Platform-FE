import {
  Avatar,
  Button,
  Col,
  Divider,
  Drawer,
  Grid,
  List,
  Modal,
  Popover,
  Row,
  Skeleton,
  message
} from 'antd';
import moment from 'moment-timezone';
import React, { useState, useEffect } from 'react';
import styles from './notification.module.less';
import { EllipsisOutlined } from '@ant-design/icons';
import { uniqueKey } from 'src/helpers/string.utils';
import InfiniteScroll from 'react-infinite-scroller';
import { INotificationStore } from 'src/store/notification/notification.store';
import useStore from 'src/hooks/use-store';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { i18nKey } from 'src/locales/i18n';
import { LIMIT_RECORD } from 'src/constants';
import LogoIcon from 'src/assets/icons/logo.svg';
import { INotification } from 'src/dto/notification.dto';
interface IProps {
  open: boolean;
  handleSetNotify(value: boolean): void;
  children?: React.ReactNode;
  isSeeAll: boolean;
  handleSetSeeAll(value: boolean): void;
}

const CustomNotification = ({
  open,
  handleSetNotify,
  isSeeAll,
  handleSetSeeAll,
  children
}: IProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingNoti,setLoadingNoti] = useState<boolean>(false)
  const { t } = useTranslation();
  const [openMarkAsRead, setOpenMarkAsRead] = useState<Map<string, boolean>>(
    new Map()
  );
  const notificationStore: INotificationStore = useStore('notificationStore');
  const screen = Grid.useBreakpoint();
  const loadMoreData = async () => {
    if (loading) {
      return;
    }
    setLoading(true);
    await notificationStore
      .loadMoreListNotification({
        page: notificationStore.page + 1,
        limit: notificationStore.limit
      })
      .catch(() => setLoading(false));
    setLoading(false);
  };

  const handleMarkReadAll = async () => {
    try {
      setLoadingNoti(true);

      const res = await notificationStore.updateNotification({
        all: true
      });
      if (res) {
        // message.success(t(i18nKey.validation.common.toastUpdateSuccess));
      } else {
        message.error(t(i18nKey.validation.common.toastUpdateFail));
      }
    } finally {
      setLoadingNoti(false);
    }
  };

  const handleMarkReadId = async (id: string) => {
    try {
      setLoadingNoti(true);
      const res = await notificationStore.updateNotification({
        all: false,
        notification_ids: [id]
      });
      if (res) {
        // message.success(t(i18nKey.validation.common.toastUpdateSuccess));
      } else {
        message.error(t(i18nKey.validation.common.toastUpdateFail));
      }
    } finally {
      setLoadingNoti(false);
    }
  };
  const getNotification = async () => {
    notificationStore.getListNotification({ page: 1, limit: LIMIT_RECORD });
  };

  const renderDescription = (item: INotification) => {
    if (item.description.type === 'automatedProcess') {
      const fielData = item.description.fielData as {
        insertAlarmID: string;
        insertSeverity: string;
        insertDescription: Array<any>;
      };
      return t(
        i18nKey.notifications.notificationAppFunction.automatedProcess(
          fielData.insertAlarmID,
          fielData.insertSeverity,
          fielData.insertDescription
        )
      );
    }
    return `${t(i18nKey.notifications.notificationApp[item.description.type], {
      ...item.description.fielData
    })}`;
  };

  const renderAvatar = (item: INotification) => {
  
    const hasAvatarUser = !!item?.actionBy?.at(0)?.avatar;
    const isAvatarSystem = !item?.actionBy?.length;
    if (isAvatarSystem) {
      return <Avatar size={32} src={LogoIcon} />;
    }
    if (hasAvatarUser) {
      return <Avatar size={32} src={item?.actionBy?.at(0)?.avatar} />;
    }
    return (
      <Avatar size={32} style={{ backgroundColor: '#BCBCC0' }}>{`${
        item?.actionBy?.at(0)?.first_name?.toUpperCase().trim()[0]
      }${item?.actionBy?.at(0)?.last_name?.toUpperCase().trim()[0]}`}</Avatar>
    );
  };

  const renderName = (item: INotification)=>{
    const isSystem = !item?.actionBy?.length;
    return isSystem
      ? t(i18nKey.notifications.label.system)
      : `${ item?.actionBy?.at(0)?.first_name} ${item?.actionBy?.at(0)?.last_name}`;
  };

  useEffect(() => {
    open && getNotification();

  }, [open]);

  const renderContent = (maxHeight: string) => (
    <div
      className={styles.container}
      style={{
        maxHeight
      }}>
      <InfiniteScroll
        // style={{height: window.innerHeight}}
        pageStart={0}
        loadMore={loadMoreData}
        hasMore={
          notificationStore.listNotification.length < notificationStore.total
        }
        loader={<Skeleton key={uniqueKey(20)} />}
        useWindow={false}>
        <List
          style={{ width: '100%', minWidth: '375px' }}
          itemLayout="horizontal"
          loading={{ spinning: notificationStore.isLoadingNotify || loadingNoti  }}
          dataSource={notificationStore.listNotification}
          renderItem={(item) => (
            <List.Item
              key={item._id}
              style={item.read_at ? undefined : { background: '#F0F3FA' }}
              // actions={[]}
            >
              <List.Item.Meta
                avatar={renderAvatar(item)}
                title={
                  <Row wrap={false} justify={'space-between'}>
                    <Col>{renderName(item)}</Col>
                    {!item.read_at && (
                      <Col style={{ cursor: 'pointer' }}>
                        <Popover
                          placement="bottomRight"
                          open={openMarkAsRead.get(item._id) || false}
                          onOpenChange={(openMark) =>
                            setOpenMarkAsRead((prev) => {
                              const tempMap = new Map(prev);
                              tempMap.set(item._id, openMark);
                              return tempMap;
                            })
                          }
                          overlayInnerStyle={{ padding: 0 }}
                          arrow={false}
                          content={
                            <Button
                              onClick={() => {
                                setOpenMarkAsRead((prev) => {
                                  const tempMap = new Map(prev);
                                  tempMap.set(item._id, false);
                                  return tempMap;
                                });
                                handleMarkReadId(item._id);
                              }}>
                              {t(i18nKey.notifications.button.markAsRead)}
                            </Button>
                          }>
                          <EllipsisOutlined key={uniqueKey(10)} />
                        </Popover>
                      </Col>
                    )}
                  </Row>
                }
                description={
                  <div>
                    <div
                      className={styles.columnsText}
                      dangerouslySetInnerHTML={{
                        __html: renderDescription(item)
                      }}
                    />
                    <Row justify={'space-between'} align={'middle'}>
                      <Col className={styles.time}>
                        {moment(item.createdOn).format(
                          ' hh:mm:ss MMMM DD, YYYY'
                        )}
                      </Col>
                      {!item.read_at && (
                        <Col>
                          <span className={styles.dot}></span>
                        </Col>
                      )}
                    </Row>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </InfiniteScroll>
    </div>
  );
  return (
    <>
      {screen.xs ? (
        <Drawer
          title={
            <Row justify={'space-between'}>
              <Col className={styles.textTitle}>
                {`${t(i18nKey.notifications.title)} (${
                  notificationStore.total || 0
                })`}
              </Col>
              <Col style={{ marginRight: '25px' }}>
                <span
                  className={styles.textMarkAll}
                  onClick={handleMarkReadAll}>
                  {t(i18nKey.notifications.button.markAllAsRead)}
                </span>
              </Col>
            </Row>
          }
          className={styles.drawer}
          open={open}
          onClose={() => handleSetNotify(false)}>
          {renderContent('100%')}
        </Drawer>
      ) : (
        <>
          {isSeeAll ? (
            <Modal
              className={styles.modalNotify}
              onCancel={() => {
                handleSetNotify(false);
                handleSetSeeAll(false);
              }}
              width={680}
              title={
                <Row justify={'space-between'}>
                  <Col className={styles.modalNotify_textTitle}>
                    {t(i18nKey.notifications.title)}
                  </Col>
                  <Col style={{ marginRight: '35px' }}>
                    <span
                      className={styles.textMarkAll}
                      onClick={handleMarkReadAll}>
                      {t(i18nKey.notifications.button.markAllAsRead)}
                    </span>
                  </Col>
                </Row>
              }
              footer={null}
              open={isSeeAll}>
              {renderContent('90vh')}
            </Modal>
          ) : (
            <Popover
              trigger={'click'}
              overlayClassName={styles.popoverContainer}
              onOpenChange={handleSetNotify}
              open={open}
              title={
                <Row justify={'space-between'}>
                  <Col className={styles.textTitle}>
                    {t(i18nKey.notifications.title)}
                  </Col>
                  <Col>
                    <span
                      className={styles.textMarkAll}
                      onClick={handleMarkReadAll}>
                      {t(i18nKey.notifications.button.markAllAsRead)}
                    </span>
                  </Col>
                </Row>
              }
              placement="bottomRight"
              content={
                <div>
                  {renderContent('400px')}
                  <Divider style={{ margin: '0' }} />
                  <div>
                    <Button
                      className={styles.btnSeeAll}
                      onClick={() => handleSetSeeAll(true)}
                      block>
                      {t(i18nKey.notifications.button.seeAll)}
                    </Button>
                  </div>
                </div>
              }>
              {children}
            </Popover>
          )}
        </>
      )}
    </>
  );
};
export default observer(CustomNotification);
