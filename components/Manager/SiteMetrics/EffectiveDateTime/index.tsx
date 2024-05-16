import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { clearEffectiveDateTimeFormValues, clearSaveSiteConfigPayload, clearSaveSiteConfigStatus, setShowSettingsModal, setShowSettingsPageConfirmModal, setShowShopInactiveErrorMessage, updateEffectiveDateTimeFormValues } from '@/store/actions/siteConfigAction';
import { effectiveDateHours } from '@/utility/constantObjects';
import { toastError, toastSuccess } from '@/utility/commonFunctions';
import { effectiveDateTimeStyle } from './effective_date_time_tailwind';

export default function EffectiveDateTime(props: any) {
    const { effectiveDate, effectiveHours, effectiveMinutes } = useSelector((state: any) => state.siteConfigState?.effectiveDateTimeInputs) || '';
    const { type } = props;

    const dispatch: any = useDispatch();
    const userRole = useSelector((state: any) => state.authenticationState.userRole);
    const saveSiteConfigStatus = useSelector((state: any) => state.siteConfigState?.saveSiteConfigStatus?.data);
    const saveSiteConfigStatusErrorType = useSelector((state: any) => state.siteConfigState?.saveSiteConfigStatus?.type);

    const isPastDate = useSelector((state: any) => state.siteConfigState?.isPast);

    const effectiveDateTimeError = useSelector((state: any) => state.siteConfigState?.effectiveDateTimeError);

    const handleChange = (e: any) => {
        const name = e.target.name;
        const value = e.target.value;
        //Update form values in redux
        dispatch(updateEffectiveDateTimeFormValues({ name, value }));
    }

    useEffect(() => {
        if (saveSiteConfigStatus?.type === 'update_site_metric' && saveSiteConfigStatus?.data === 'submitted_successfully') {
            dispatch(setShowSettingsModal(false));
            //CLEAR SAVE SITE CONFIG STATUS
            dispatch(clearSaveSiteConfigStatus());
            dispatch(clearSaveSiteConfigPayload());
            // clearEffectiveDateTimeFormValues
            dispatch(clearEffectiveDateTimeFormValues());
            dispatch(setShowSettingsPageConfirmModal(false));
            //Toast Success Message
            toastSuccess();
        } else if (saveSiteConfigStatus?.error === 'ERR_NETWORK') {
            //Toast Error Message
            toastError();
        }
        else if (saveSiteConfigStatusErrorType === 'update_site_metric' && saveSiteConfigStatus === 'error') {
            dispatch(setShowShopInactiveErrorMessage(true));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [saveSiteConfigStatus])

    return (
        <div className={effectiveDateTimeStyle.mainWrapper}>
            <div className={effectiveDateTimeStyle.buttonWrapper}>
                <span className={effectiveDateTimeStyle.buttonSpanFont}>Effective From</span>
                <button
                    className={effectiveDateTimeStyle.button} type="button"
                >
                    i
                </button>
                <span className={effectiveDateTimeStyle.buttonHover}><b>Effective From</b><br /><br />Set a date and time (in local/site time zone) for changes to come into effect. If you want to submit multiple changes that would be effective at different dates/times, please submit a separate request for each effective date/time.</span>
            </div>
            <div className={effectiveDateTimeStyle.outerWrapper}>
                <div className={effectiveDateTimeStyle.innerWrapper}>
                    <div>
                        <input type='date' className={effectiveDateTimeStyle.inputFormElement} name='effectiveDate'
                            onChange={handleChange}
                            min={userRole?.location === 'LB' ? moment.tz('America/Los_Angeles').format('YYYY-MM-DD') : moment.tz('America/New_York').format('YYYY-MM-DD')}
                            required />

                        <b>(Date)</b><br />
                        {(type === 'addNewLine' || type === 'addNewStall' || type === 'DeleteLine') && (effectiveDateTimeError && effectiveDate?.length == 0) &&
                            <p className={effectiveDateTimeStyle.formElementError}>Date is required</p>
                        }
                    </div>
                </div>
                <div className={effectiveDateTimeStyle.innerWrapper}>
                    <div>
                        <select className={effectiveDateTimeStyle.selectFormElement}
                            name="effectiveHours" onChange={handleChange} required
                        >
                            <option value="">Select hours</option>
                            {effectiveDateHours?.map((option: any) => (
                                <option key={option.id} value={option.value}>{option.value}</option>
                            ))}
                        </select>
                        <b>(HH)</b>
                        {(type === 'addNewLine' || type === 'addNewStall' || type === 'DeleteLine') && (effectiveDateTimeError && effectiveHours?.length == 0) &&
                            <p className={effectiveDateTimeStyle.formElementError}>Hours is required</p>
                        }
                    </div>
                </div>
                <div className={effectiveDateTimeStyle.innerWrapper}>
                    <div>
                        <select className={effectiveDateTimeStyle.selectFormElement}
                            name="effectiveMinutes" onChange={handleChange} required
                        >
                            <option value="">Select minutes</option>
                            {["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "50", "51", "52", "53", "54", "55", "56", "57", "58", "59"].map((min: any) => (
                                <option key={min}>{min}</option>
                            ))}
                        </select>
                        <b>(MM)</b>
                        {(type === 'addNewLine' || type === 'addNewStall' || type === 'DeleteLine') && (effectiveDateTimeError && effectiveMinutes?.length == 0) &&
                            <p className={effectiveDateTimeStyle.formElementError}>Minutes is required</p>
                        }
                    </div>
                </div>
            </div>
            {isPastDate && (type === 'addNewLine' || type === 'addNewStall' || type === 'DeleteLine') && (
                <div className={effectiveDateTimeStyle.validationMessage}> Selected Effective Date Time is in the past</div>
            )
            }

        </div>
    )
}


