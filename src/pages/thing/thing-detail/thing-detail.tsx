import { Breadcrumb, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { PAGE_ROUTE } from 'src/constants/route';

import { i18nKey } from 'src/locales/i18n';
import PlantInfo from './plant-info/plant-info';
import useStore from 'src/hooks/use-store';
import { IPlantListStore } from 'src/store/plant/plant.store';
import styles from './plant-detail.module.less';
import { HeaderTitle } from 'src/components/header-title/header-title';
import { HTTP_STATUS_RESPONSE_KEY } from 'src/constants/api';
import { IPlantDetail } from 'src/constants/plant';

const PlantDetail = () => {
  const [t] = useTranslation();
  const { id: idPlantParam } = useParams();
  const [plantDetail, setPlantDetail] = useState<undefined | IPlantDetail>();
  const listPlantStore: IPlantListStore = useStore('listPlantStore');

  const [loading, setLoading] = useState<boolean>(false);

  const getDetailPlant = async (id: string) => {
    try{
    setLoading(true)
    await listPlantStore.getDetailPlant({ id }).then((res) => {
      if (res.responseCode === HTTP_STATUS_RESPONSE_KEY.SUCCESS) {
        setPlantDetail(res.data);
      }
    });
    }
    finally{
      setLoading(false)
    }
  };

  useEffect(() => {
    if (idPlantParam) {
      getDetailPlant(idPlantParam)
    }
  }, [idPlantParam]);

  return (
    <div className={styles.container}>
      <Spin wrapperClassName={styles.wrapSpin} spinning={loading}>
       
        <HeaderTitle
          // levelTitle={3}
          justify={'space-between'}
          title={t(i18nKey.plantEntity.title.plantDetails)}>
          <Breadcrumb
            separator=">"
            items={[
              {
                title: (
                  <Link to={PAGE_ROUTE.DASHBOARD_PLANT}>
                    {`${t(i18nKey.menu.plantCenter)}`}
                  </Link>
                )
              },
              {
                title: plantDetail?.name || ''
              }
            ]}
          />
        </HeaderTitle>
        <PlantInfo info={plantDetail} />
      </Spin>
      </div>
  );
};
export default PlantDetail;
