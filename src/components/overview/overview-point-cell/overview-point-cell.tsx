import React from 'react';
import styles from './overview-point-cell.module.less';
import { ReactComponent as LightingIcon } from 'src/assets/icons/Lighting.svg';
import { Typography } from 'antd';

export interface IOverviewPointCell {
    param?: string;
    text?: string;
    color?: string;
    backgroud?: string;
    isCol?: boolean;
}

const OverviewPointCell: React.FC<IOverviewPointCell> = ({
    param,
    text,
    color,
    backgroud,
    isCol = true
}) => {
    return (
        <>
            {param !== 'undefined' && param !== 'null' && (
                <>
                    {isCol && (
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
                                    <Typography.Title level={3}>
                                        {param}
                                    </Typography.Title>
                                </div>
                                <div>
                                    <span className={styles.wrapper_infomation_text}>
                                        {text}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </>
    );
};

export default OverviewPointCell;
