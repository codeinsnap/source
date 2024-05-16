import React from 'react';
import Image from 'next/image';
import redTick from '../../../../public/images/icons/redTick.svg';
import greenTick from '../../../../public/images/icons/greenTick.svg';
import { metricStyle } from './metrics_tailwind';
import { useSelector } from 'react-redux';
import { CONSTANTS } from '@/constants/constants';
import { webAppConfig } from '@/utility/webAppConfig';

export default function Metrics(props: any) {
    const { progress, totalPlanned, totalCompleted, marker, date } = props

    const userRole = useSelector((state: any) => state.authenticationState.userRole);

    return (
        <>
            {/* Metrics Tile for LongBeach Manager Screen*/}
            {webAppConfig?.Manager[userRole?.location]?.metricsAllTiles &&
                <div className={metricStyle.wrapper}>
                    <div className={`${metricStyle.progress}${metricStyle.grey}`}>
                        <div className={metricStyle.progresWrapper}>
                            <div className={metricStyle.label}>{CONSTANTS.PROGRESS}</div>
                            {totalCompleted >= marker ? (
                                <Image src={greenTick} alt="" />
                            ) : (
                                <Image src={redTick} alt="" />
                            )}
                        </div>
                        <div className={metricStyle.value}>{(totalPlanned == 0) ? '0' : progress}%</div>
                    </div>
                    <div className={`${metricStyle.progress}${metricStyle.grey}`}>
                        <div className={metricStyle.label}>{CONSTANTS.TOTAL_PLANNED}</div>
                        <div className={metricStyle.value}>{totalPlanned}</div>
                    </div>
                    <div className={`${metricStyle.progress}${metricStyle.grey}`}>
                        <div className={metricStyle.label}>{CONSTANTS.TOTAL_COMPLETE}</div>
                        <div className={metricStyle.value}>{totalCompleted}</div>
                    </div>
                </div>
            }
            {/* Metrics Tile for Princeton Manager Screen*/}
            {webAppConfig?.Manager[userRole?.location]?.metricsTotalCompletedTile &&
                <div className={metricStyle.wrapper}>
                    <div className={`${metricStyle.progress}${metricStyle.grey}`}>
                        <div className={metricStyle.label}>{CONSTANTS.TOTAL_COMPLETE}</div>
                        <div className={metricStyle.value}>{(totalCompleted == 0) ? '0' : totalCompleted}</div>
                    </div>
                </div>
            }
        </>
    )
}
