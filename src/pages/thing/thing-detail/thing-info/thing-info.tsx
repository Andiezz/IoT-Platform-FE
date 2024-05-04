import React from 'react';
import styles from './plant-info.module.less';
import { Button, Col, Divider, Grid, Row, Tag, Typography } from 'antd';
import { i18nKey } from 'src/locales/i18n';
import { useTranslation } from 'react-i18next';
import Widget from 'src/components/widget/widget';
import { uniqueKey } from 'src/helpers/string.utils';
import { useNavigate } from 'react-router-dom';
import { PAGE_ROUTE } from 'src/constants/route';
import { Owner } from 'src/constants/user';
import { tagColorStatus } from 'src/constants/utils';
import { IThingItem } from 'src/dto/thing.dto';
import RenderAvatar from 'src/components/render-avatar/render-avatar';
import { observer } from 'mobx-react-lite';
interface IProps {
  info?: IThingItem;
}
const ThingInfo = ({ info }: IProps) => {
  const [t] = useTranslation();
  const navigate = useNavigate();
  const screen = Grid.useBreakpoint();

  const renderOwner = () => {
    return info?.managers?.length ? (
      <RenderAvatar
        sizeAvatar={29}
        owner={info?.managers?.at(0)?.user as Owner}
      />
    ) : (
      '-'
    );
  };
  return (
    <Widget>
      <div className={styles.container}>
        <Row justify={'space-between'} align={'top'} wrap={false}>
          <Col>
            <Row gutter={[32, 8]}>
              <Col span={24}>
                <Row align={'middle'} gutter={8}>
                  <Col>
                    <Typography.Title
                      className={styles.container_typography}
                      level={2}>
                      {info?.name}
                    </Typography.Title>
                  </Col>
                  <Divider type="vertical" />
                  <Col>{renderOwner()}</Col>
                  <Col span={24} className={styles.labelID}>
                    ID: {info?._id}
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
          <Col>
            {!screen.xs && (
              <Button
                className={styles.buttonSubmit}
                type="primary"
                size="small"
                ghost
                onClick={() =>
                  navigate(
                    PAGE_ROUTE.THING_UPDATE.replace(':id', info?._id as string)
                  )
                }>{`${t(i18nKey.button.update)}`}</Button>
            )}
          </Col>
        </Row>
        <Divider style={{ margin: '12px 0' }} />
        <div className={styles.labelLocationList}>
          {t(i18nKey.label.location)}
        </div>
        <div className={styles.wrapLocation}>
          <Row
            key={uniqueKey(20, 'd')}
            justify={'space-between'}
            wrap={false}
            className={styles.wrapInfoLocation}
            align={'top'}>
            <Col>
              <Row gutter={[10, 8]} align={'middle'}>
                <Col>{info?.location.name}</Col>
                {!screen.xs && <Divider type="vertical" />}
                <Row gutter={[10, 8]} align={'middle'}>
                  <Col className={styles.wrapLatLng}>
                    <div className={styles.latLngLocation}>
                      <span>{t(i18nKey.thingEntity.label.longitude)}</span>
                      <span>{info?.location.longitude ?? '-'}</span>
                    </div>
                  </Col>
                  <Col className={styles.wrapLatLng}>
                    <div className={styles.latLngLocation}>
                      <span>{t(i18nKey.thingEntity.label.latitude)}</span>
                      <span>{info?.location.latitude ?? '-'}</span>
                    </div>
                  </Col>
                </Row>
              </Row>
              <div className={styles.address}>{info?.location.address}</div>
            </Col>
            <Col>
              <Tag
                style={tagColorStatus(info?.status ?? '')}
                className={styles.tagStatus}>
                {info?.status && t(i18nKey.status[info?.status])}
              </Tag>
            </Col>
          </Row>
          <div className={styles.ems}>
            {info?.devices.map((device) => (
              <Row
                key={uniqueKey(19, 'a')}
                align={'middle'}
                justify={'space-between'}
                className={styles.wrapAssociated}>
                <Col className={styles.nameAssociated}>{device.name}</Col>
                <Col sm={{ offset: 2 }}>
                  <Row gutter={10}>
                    <Col className={styles.infoAssociated}>
                      <div className={styles.labelAssociated}>Device Model</div>
                      <div className={styles.valueAssociated}>
                        {
                          info?.devices.find(
                            (item) => item.name === device.name
                          )?.name
                        }
                      </div>
                    </Col>
                    <Col className={styles.infoAssociated}>
                      <div className={styles.labelAssociated}>Status</div>
                      <div className={styles.valueAssociated}>
                        {device.status}
                      </div>
                    </Col>
                  </Row>
                </Col>
              </Row>
            ))}
          </div>
        </div>
        <Col style={{ marginTop: '16px' }} xs={24} sm={0}>
          <Button
            onClick={() =>
              navigate(
                PAGE_ROUTE.THING_UPDATE.replace(':id', info?._id as string)
              )
            }
            block
            type="primary"
            ghost
            className={styles.btnUpdate}>{`${t(
            i18nKey.button.update
          )}`}</Button>
        </Col>
      </div>
    </Widget>
  );
};
export default observer(ThingInfo);
