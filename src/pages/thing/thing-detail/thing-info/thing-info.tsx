import React from 'react';
import styles from './plant-info.module.less';
import { Avatar, Button, Col, Divider, Grid, Row, Tag, Typography } from 'antd';
import { i18nKey } from 'src/locales/i18n';
import { useTranslation } from 'react-i18next';
import Widget from 'src/components/widget/widget';
import { uniqueKey } from 'src/helpers/string.utils';
import { useNavigate } from 'react-router-dom';
import { PAGE_ROUTE } from 'src/constants/route';
import { IAuthenticationService } from 'src/services/authentication.service';
import useService from 'src/hooks/use-service';
import { Owner, Permission } from 'src/constants/user';
import { tagColorStatus } from 'src/constants/utils';
import { IPlantDetail } from 'src/constants/plant';
import RenderAvatar from 'src/components/render-avatar/render-avatar';
import { observer } from 'mobx-react-lite';
interface IProps {
  info?: IPlantDetail;
}
const PlantInfo = ({ info }: IProps) => {
  const [t] = useTranslation();
  const navigate = useNavigate();
  const authService: IAuthenticationService = useService(
    'authenticationService'
  );
  const listMyPermission =
    authService.permissionRole?.groups.map((group) => group.permission.key) ||
    [];

  const screen = Grid.useBreakpoint();

  const renderOwner = () => {
    return info?.owner?.length ? (
      <RenderAvatar sizeAvatar={29} owner={info?.owner?.at(0)?.user as Owner} />
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
          {listMyPermission.includes(Permission.updatePlant) && (
            <Col>
              {!screen.xs && (
                <Button
                  className={styles.buttonSubmit}
                  type="primary"
                  size="small"
                  ghost
                  onClick={() =>
                    navigate(
                      PAGE_ROUTE.DASHBOARD_PLANT_UPDATE.replace(
                        ':id',
                        info?._id as string
                      )
                    )
                  }>{`${t(i18nKey.button.update)}`}</Button>
              )}
            </Col>
          )}
        </Row>
        <Divider style={{ margin: '12px 0' }} />

        {info?.viewers?.length ? (
          <Row>
            <Col span={24}>
              <Typography.Text className={styles.labelAdminViewer}>
                {t(i18nKey.tenantEntity.detail.adminViewerAssignment)}
              </Typography.Text>
            </Col>
            <Col>
              <Avatar.Group>
                {info?.viewers?.map(({ user }) => (
                  <RenderAvatar key={user._id} sizeAvatar={29} owner={user} />
                ))}
              </Avatar.Group>
            </Col>
          </Row>
        ) : (
          ''
        )}

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
                <Col>{info?.location_name}</Col>
                {!screen.xs && <Divider type="vertical" />}
                <Row gutter={[10, 8]} align={'middle'}>
                  <Col className={styles.wrapLatLng}>
                    <div className={styles.latLngLocation}>
                      <span>{t(i18nKey.plantEntity.label.longitude)}</span>
                      <span>{info?.longitude || '-'}</span>
                    </div>
                  </Col>
                  <Col className={styles.wrapLatLng}>
                    <div className={styles.latLngLocation}>
                      <span>{t(i18nKey.plantEntity.label.latitude)}</span>
                      <span>{info?.latitude || '-'}</span>
                    </div>
                  </Col>
                </Row>
              </Row>
              <div className={styles.address}>{info?.address}</div>
            </Col>
            <Col>
              <Tag
                style={tagColorStatus(info?.status || '')}
                className={styles.tagStatus}>
                {info?.status && t(i18nKey.status[info?.status])}
              </Tag>
            </Col>
          </Row>
          <div className={styles.ems}>
            {info?.devices.map((associated) => (
              <Row
                key={uniqueKey(19, 'a')}
                align={'middle'}
                justify={'space-between'}
                className={styles.wrapAssociated}>
                <Col className={styles.nameAssociated}>
                  {associated.company}
                </Col>
                <Col sm={{ offset: 2 }}>
                  <Row gutter={10}>
                    <Col className={styles.infoAssociated}>
                      <div className={styles.labelAssociated}>Device Type</div>
                      <div className={styles.valueAssociated}>
                        {
                          (
                            info.device_types.find(
                              (item) => item._id === associated.device_type_id
                            ) || {}
                          ).name
                        }
                      </div>
                    </Col>
                    <Col className={styles.infoAssociated}>
                      <div className={styles.labelAssociated}>Capacity</div>
                      <div className={styles.valueAssociated}>
                        {associated.capacity}
                      </div>
                    </Col>
                  </Row>
                </Col>
              </Row>
            ))}
          </div>
        </div>

        {listMyPermission.includes(Permission.updatePlant) && (
          <Col style={{ marginTop: '16px' }} xs={24} sm={0}>
            <Button
              onClick={() =>
                navigate(
                  PAGE_ROUTE.DASHBOARD_PLANT_UPDATE.replace(
                    ':id',
                    info?._id as string
                  )
                )
              }
              block
              type="primary"
              ghost
              className={styles.btnUpdate}>{`${t(
              i18nKey.button.update
            )}`}</Button>
          </Col>
        )}
      </div>
    </Widget>
  );
};
export default observer(PlantInfo);
