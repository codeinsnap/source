import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import { vinStyle } from './vin_card_tailwind';
import { useSelector } from 'react-redux';
import { CONSTANTS } from '@/constants/constants';

interface IVinDetails {
    vin_id: string;
    vin_name: string;
    pick_up: string;
    drop_off: string;
    status: string;
    status_label: string;
    planned_start_time: string;
    estimated_install_time: string;
    expected_completion_time: string;
    expected_install_time: string;
    car_photo_url: string;
    actual_completion: string;
    actual_install_time: string;
}

export default function VINCard() {
    const [timeElapsed, setTimeElapsed] = useState('');

    const startTime = useSelector((state: any) => state.vinState.startTime);
    const profileData = useSelector((state: any) => state.profileState.profileData);

    const color_map: any = {
        complete_on_time: vinStyle.complete_on_time,
        complete_late: vinStyle.complete_late,
        ongoing: vinStyle.ongoing,
        complete: vinStyle.complete,
        incomplete: vinStyle.incomplete,
    }

    const getStatusClassName = () => {
        if (profileData?.status === 'ongoing' && timeElapsed > profileData?.expected_install_time) {
            return `${color_map[profileData?.status]} bg-red1`
        }

        return color_map[profileData?.status];
    }

    const isPrevCurrent = () => {
        if (profileData?.status === 'complete' || profileData?.status === 'incomplete') {
            return CONSTANTS.PREVIOUS_VEHICLE;
        } else if (profileData?.status === 'complete_on_time') {
            return CONSTANTS.CURRENT_VEHICLE;
        } else if (profileData?.status === 'complete_late') {
            return CONSTANTS.CURRENT_VEHICLE;
        } else if (profileData?.status === 'ongoing') {
            return CONSTANTS.CURRENT_VEHICLE;
        }
    }

    const vinStatus = () => {
        if (profileData?.status === 'complete_on_time') {
            return CONSTANTS.COMPLETE_ON_TIME;
        } else if (profileData?.status === 'complete_late') {
            return CONSTANTS.COMPLETE_LATE;
        } else if (profileData?.status === 'ongoing') {
            return `${CONSTANTS.TIME_ELASPED} ${timeElapsed && Math.floor((Number(timeElapsed) / 60))} H  ${Number(timeElapsed)} MIN `;
        } else if (profileData?.status === 'complete') {
            return CONSTANTS.COMPLETE;
        } else if (profileData?.status === 'incomplete') {
            return CONSTANTS.INCOMPLETE;
        }
    }

    //Timer tick 
    useEffect(() => {
        if (profileData?.status === 'ongoing') {
            const timerID = setInterval(() => setTimeElapsed(((Number(new Date()) - Number(new Date(startTime))) / (1000 * 60)).toFixed()), 1000);
            return () => {
                clearInterval(timerID);
            };
        } else {
            setTimeElapsed('')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [profileData]);

    return (
        <div className={vinStyle.mainwrapper}>
            {/* left car */}
            <div className={`${vinStyle.innerWrapper} ${profileData?.status === 'ongoing' && timeElapsed > profileData?.expected_install_time ? vinStyle.vehicleBorderRed : profileData?.status === 'complete_late' ? vinStyle.vehicleCompleteLate : profileData?.status === 'ongoing' ? vinStyle.vehicleBorderBlue : ''} `}>
                <div>
                    <div className={vinStyle.displayFlex}>
                        <div className={(profileData?.status === 'complete_on_time' ? vinStyle.prevVehicle : vinStyle.currentVehicle)}>
                            {isPrevCurrent()}
                        </div>
                        {
                            <div className={getStatusClassName()}>
                                {vinStatus()}
                            </div>
                        }
                    </div>
                    <div className={vinStyle.marginTop}>
                        <span className={vinStyle.semiBold}>{profileData?.VIN}</span><br />
                        <span className={vinStyle.fontSize}>{profileData?.model}</span><br />
                        <span className={vinStyle.fontSize}>{profileData?.color}</span>
                        <br /><br /><br />
                        {profileData?.status === 'complete_on_time' &&
                            (
                                <>
                                    <div className={vinStyle.plannedTime}>
                                        <div>{CONSTANTS.ACTUAL_COMPLETION}</div> <div>{profileData?.actual_completion_time}</div>
                                    </div>
                                    <div className={vinStyle.plannedTime}>
                                        <div>{CONSTANTS.ACTUAL_INSTALL_TIME}</div> <div>{profileData?.actual_installation_time}</div>
                                    </div>
                                </>
                            )
                        }
                        {profileData?.status === 'complete_late' &&
                            (
                                <>
                                    <div className={vinStyle.plannedTime}>
                                        <div>{CONSTANTS.ACTUAL_COMPLETION}</div> <div>{profileData?.actual_completion_time}</div>
                                    </div>
                                    <div className={vinStyle.plannedTime}>
                                        <div>{CONSTANTS.ACTUAL_INSTALL_TIME}</div> <div>{profileData?.actual_installation_time}</div>
                                    </div>
                                </>
                            )
                        }
                        {
                            profileData?.status === 'complete_prev' &&
                            (
                                <>
                                    <div className={vinStyle.plannedTime}>
                                        <div>{CONSTANTS.EXPECTED_COMPLETION}</div> <div>{profileData?.expected_completion_time}</div>
                                    </div>
                                    <div className={vinStyle.plannedTime}>
                                        <div>{CONSTANTS.EXPECTED_INSTALL_TIME}</div> <div>{profileData?.expected_install_time} min</div>
                                    </div>
                                </>
                            )
                        }
                        {
                            profileData?.status === 'ongoing' &&
                            (
                                <>
                                    <div className={vinStyle.plannedTime}>
                                        <div>{CONSTANTS.EXPECTED_COMPLETION}</div> <div>{profileData?.expected_completion_time}</div>
                                    </div>
                                    <div className={vinStyle.plannedTime}>
                                        <div>{CONSTANTS.EXPECTED_INSTALL_TIME}</div> <div>{profileData?.expected_install_time} min</div>
                                    </div>
                                </>
                            )
                        }
                    </div>

                </div>
                <div>
                    <div className={vinStyle.displayFlex}>
                        <div className={vinStyle.marginFontSize}>
                            {CONSTANTS.DROP_OFF_LOCATION}
                        </div>
                        <div className={vinStyle.labelStaging}>
                            {CONSTANTS.LINESTAG} {profileData?.drop_off} {CONSTANTS.STAGING}
                        </div>
                    </div>
                    <div className={vinStyle.marginTop}>
                        {profileData?.car_image ? (
                            <Image
                                src={profileData?.car_image}
                                width={500}
                                height={500}
                                alt={CONSTANTS.VIN_IMG_ALT}
                            />
                        ) : (
                            <div className={vinStyle.vehicleImageNotFound}>{CONSTANTS.VIN_IMG_NOT_AVAILABLE}</div>
                        )}

                    </div>
                </div>
            </div>
            {/* right car */}

            {
                (
                    <div className={`${vinStyle.innerWrapper} ${profileData?.status === 'ongoing' ? '' : vinStyle.vehicleBorderBlue} `}>
                        <div>
                            <div className={vinStyle.displayFlex}>
                                <div className={vinStyle.nextVehicle}>
                                    {CONSTANTS.NEXT_VEHICLE}
                                </div>
                                <div className={vinStyle.labelPending}>
                                    {CONSTANTS.PENDING_SCAN}
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    )
}
