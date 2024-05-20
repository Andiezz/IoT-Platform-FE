import React from 'react';
import styles from './overview-associated.module.less';
import { ReactComponent as LightingIcon } from 'src/assets/icons/Lighting.svg';
import { Space } from 'antd';

export interface IOverviewAssociated {
    param?: string;
    text?: string;
    color?: string;
    backgroud?: string;
    isCol?: boolean;
}

const OverviewAssociated: React.FC<IOverviewAssociated> = ({
    param,
    text,
    color,
    backgroud,
}) => {
    return (
        <>
            {param !== 'undefined' && param !== 'null' &&
                <div className={styles.wrapper_content_info_item}>
                    <div className={styles.wrapper}>
                        <div className={styles.wrapper_picture}>
                            <div
                                className={styles.wrapper_img}
                                style={{ background: `${backgroud}` }}>
                                <LightingIcon fill={color} />
                            </div>
                        </div>
                        <div className={styles.wrapper_infomation}>
                            <div className={styles.wrapper_infomation_param}>
                                <Space size={[4, 4]} wrap>
                                    <span>{param}</span>
                                    <span>(kW/kWh)</span>
                                </Space>
                            </div>
                            <div>
                                <span className={styles.wrapper_infomation_text}>
                                    {text}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    );
};

export default OverviewAssociated;
