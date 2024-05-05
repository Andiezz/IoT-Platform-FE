import { Breadcrumb, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { PAGE_ROUTE } from 'src/constants/route';
import { i18nKey } from 'src/locales/i18n';
import ThingInfo from './thing-info/thing-info';
import useStore from 'src/hooks/use-store';
import { IThingListStore } from 'src/store/thing.store';
import styles from './thing-detail.module.less';
import { HeaderTitle } from 'src/components/header-title/header-title';
import { HTTP_STATUS_RESPONSE_KEY } from 'src/constants/api';
import { IThingItem } from 'src/dto/thing.dto';

const ThingDetail = () => {
  const [t] = useTranslation();
  const { id: idThingParam } = useParams();
  const [thingDetail, setThingDetail] = useState<undefined | IThingItem>();
  const listThingStore: IThingListStore = useStore('listThingStore');

  const [loading, setLoading] = useState<boolean>(false);

  const getDetailThing = async (id: string) => {
    try {
      setLoading(true);
      await listThingStore.getDetailThing({ id }).then((res) => {
        if (res.responseCode === HTTP_STATUS_RESPONSE_KEY.SUCCESS) {
          console.log(res.data);
          setThingDetail(res.data);
        }
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (idThingParam) {
      getDetailThing(idThingParam);
    }
  }, [idThingParam]);

  return (
    <div className={styles.container}>
      <Spin wrapperClassName={styles.wrapSpin} spinning={loading}>
        <HeaderTitle
          justify={'space-between'}
          title={t(i18nKey.thingEntity.title.thingDetails)}>
          <Breadcrumb
            separator=">"
            items={[
              {
                title: (
                  <Link to={PAGE_ROUTE.THING_CENTER}>
                    {`${t(i18nKey.menu.thingCenter)}`}
                  </Link>
                )
              },
              {
                title: thingDetail?.name ?? ''
              }
            ]}
          />
        </HeaderTitle>
        <ThingInfo info={thingDetail} />
      </Spin>
    </div>
  );
};
export default ThingDetail;
