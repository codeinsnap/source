import React, { useState } from 'react';
import { CONSTANTS } from '@/constants/constants';
import Image from 'next/image';
import settingsIcon from '../../../../../public/images/icons/settingsIcon.svg';
import Modal from '@/components/Shared/Modal';
import ConfigScreen from '../ConfigScreen';
import { useDispatch, useSelector } from 'react-redux';
import { clearEffectiveDateTimeFormValues, clearSaveSiteConfigStatus, clearSiteConfigTableData, saveSiteConfig, setEffectiveErrors, setIsPast, setShowSettingsModal, setShowSettingsPageConfirmModal, setShowShopInactiveErrorMessage } from '@/store/actions/siteConfigAction';
import { useMsal } from '@azure/msal-react';
import moment from 'moment';
import EffectiveDateTime from '../EffectiveDateTime';
import { shopFloorHeaderStyle } from './shop_floor_header';

export default function ShopFloorPlan_LB() {
    const { effectiveDate, effectiveHours, effectiveMinutes } = useSelector((state: any) => state.siteConfigState?.effectiveDateTimeInputs) || '';
    const dispatch: any = useDispatch();
    const userRole = useSelector((state: any) => state.authenticationState.userRole);
    const siteConfig = useSelector((state: any) => state.siteConfigState?.payload);
    const { accounts } = useMsal();
    const showSettingsModal = useSelector((state: any) => state.siteConfigState?.showSettingsModal);
    const { payload } = useSelector((state: any) => state.siteConfigState);
    const afterRemoveFlagPayload = payload?.map((item: any) => {
        delete item?.flag;
        return item;
    });

    const isPastDate = useSelector((state: any) => state.siteConfigState?.isPast);
    const showSettingsPageConfirmModal = useSelector((state: any) => state.siteConfigState?.showSettingsPageConfirmModal);

    const siteConfigTabs = useSelector((state: any) => state.siteConfigState?.siteConfigTabs);
    let selectedConfigTab = siteConfigTabs?.filter((item: any) => item.isActive)[0].name;

    const shopInactiveError = useSelector((state: any) => state.siteConfigState?.shopInactiveError);
    const saveSiteConfigStatusErrorType = useSelector((state: any) => state.siteConfigState?.saveSiteConfigStatus?.type);
    const saveSiteConfigStatusErrorMessage = useSelector((state: any) => state.siteConfigState?.saveSiteConfigStatus?.message);
    
    // Disable Form Button
    const enabled =
        effectiveDate?.length > 0 &&
        effectiveHours?.length > 0 &&
        effectiveMinutes?.length > 0 &&
        siteConfig?.length > 0

    let getCurrentTime = () => {
        if (userRole?.location === 'LB') {
            return moment.tz('America/Los_Angeles').format('YYYY-MM-DDTHH:mm:ss');
        } else if (userRole?.location === 'PR') {
            return moment.tz('America/New_York').format('YYYY-MM-DDTHH:mm:ss');
        }
    }

    let effectiveCurrentDate = () => {
        if (userRole?.location === 'LB') {
            return moment.tz('America/Los_Angeles').format(`${effectiveDate}T${effectiveHours}:${effectiveMinutes}:ss`);
        } else if (userRole?.location === 'PR') {
            return moment.tz('America/New_York').format(`${effectiveDate}T${effectiveHours}:${effectiveMinutes}:ss`);
        }
    }

    const handleFormSubmit = (e: any) => {
        e.preventDefault();
        if (effectiveDate?.length > 0 && effectiveHours?.length > 0 && effectiveMinutes?.length > 0) {
            dispatch(setEffectiveErrors(true))
            if (moment(effectiveCurrentDate()).isBefore(moment(getCurrentTime()))) {
                dispatch(setIsPast(true))
            }
            else {
                dispatch(setEffectiveErrors(false))
                dispatch(setIsPast(false))
                dispatch(setShowShopInactiveErrorMessage(false))
                let payload = {
                    type: "update_site_metric",
                    effective_to_date: effectiveCurrentDate(),
                    current_time: getCurrentTime(),
                    config: siteConfig,
                }
                //POST API Call here 
                dispatch(saveSiteConfig(userRole?.location, payload));
            }
        }
    };

    return (
        <div className='w-full'>
            {/* Show modal to confirm remove Workday Id */}
            {showSettingsModal && (
                <Modal
                    absolute
                    size='large'
                    handleModalClose={() => {
                        dispatch(setShowSettingsModal(false));
                        dispatch(clearSiteConfigTableData());
                        dispatch(clearEffectiveDateTimeFormValues());
                    }}
                    handleConfirm={() => dispatch(setShowSettingsPageConfirmModal(true))}
                    modal_header={CONSTANTS.SITE_CONFIGURATION}
                    isConfirm
                    confirmBtnName={CONSTANTS.REVIEW_CHANGES}
                    isCancel
                    cancelBtnName={CONSTANTS.CANCEL}
                    confirmBtnDisabled={!enabled}
                    isConfigSite
                >
                    {/* Settings Screen */}
                    <ConfigScreen />
                    {/* Effective Date Time */}
                    {selectedConfigTab === 'configuration_line' && (
                        <form noValidate>
                            <EffectiveDateTime />
                            {shopInactiveError && saveSiteConfigStatusErrorType === 'update_site_metric' && (
                                <div className='text-sm text-red-600 text-left mt-2'> {saveSiteConfigStatusErrorMessage}</div>
                            )
                            }    
                        </form>
                    )}
                </Modal>
            )}

            {/* settingsPageConfirmModal */}
            {showSettingsPageConfirmModal && (
                <Modal
                    absolute
                    size='large'
                    handleModalClose={() => {
                        dispatch(setShowSettingsPageConfirmModal(false))
                        dispatch(setIsPast(false))
                        dispatch(setShowShopInactiveErrorMessage(false))
                        dispatch(clearSaveSiteConfigStatus());
                    }}
                    handleConfirm={handleFormSubmit}
                    modal_header={CONSTANTS.REVIEW_CHANGES}
                    isConfirm
                    confirmBtnName={CONSTANTS.CONFIRM}
                    isCancel
                    cancelBtnName={CONSTANTS.CANCEL}
                    // confirmBtnDisabled={!enabled}
                >
                    <div className={shopFloorHeaderStyle.cancelText}>Please confirm the changes below and click <strong> Submit </strong>. To go back and modify, click <strong> X </strong> or <strong> Cancel </strong>.</div>
                    <table className={shopFloorHeaderStyle.table}>
                        <tr>
                            {afterRemoveFlagPayload && Object.keys(afterRemoveFlagPayload[0]).map((p: any) => (
                                <th scope="col" className={shopFloorHeaderStyle.confirmModalHeader} key={p}>{p.toUpperCase()}</th>
                            ))}
                        </tr>
                        <tbody>
                            {afterRemoveFlagPayload.map((p: any) => (
                                <tr key={p}>
                                    {Object.keys(p).map((i: any) => (
                                        <td className={shopFloorHeaderStyle.confirmModalRow} key={i}>{p[i]}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>

                    </table>
                    <div className={shopFloorHeaderStyle.effectiveFrom}>
                        <div className={shopFloorHeaderStyle.effectiveDate}>
                            <b>{CONSTANTS.EFFECTIVE_DATE} : </b>{effectiveDate}
                        </div>
                        <div>
                            <b>{CONSTANTS.EFFECTIVE_TIME} : </b> {effectiveHours}:{effectiveMinutes} HH:MM
                        </div>
                    </div>
                    {shopInactiveError && saveSiteConfigStatusErrorType === 'update_site_metric' && (
                        <div className={shopFloorHeaderStyle.shopInactiveError}> {saveSiteConfigStatusErrorMessage}</div>
                    )
                    }
                    {isPastDate && (
                        <div className={shopFloorHeaderStyle.isPastDate}>{CONSTANTS.IS_PAST}</div>
                    )
                    }
                </Modal>
            )}

            <div className={shopFloorHeaderStyle.headerWrapper}>
                <div>
                    <div className={shopFloorHeaderStyle.headerWrapperFontBold}>{CONSTANTS.MANAGER_SITE_METRIC_SHOP_FLOOR_HEADER}</div>
                    <div>{CONSTANTS.MANAGER_SITE_METRIC_SHOP_FLOOR_SUB_HEADER}</div>
                </div>
                {/* Settings ICON */}
                <div className={shopFloorHeaderStyle.settingIcon} onClick={() => { dispatch(setShowSettingsModal(true)) }}>
                    <Image width={26} src={settingsIcon} alt={CONSTANTS.SETTING_ICON} />
                </div>
            </div>
        </div>
    )
}
