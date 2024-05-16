import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Modal from '@/components/Shared/Modal';
import { useMsal } from '@azure/msal-react';
import moment from 'moment';
import EffectiveDateTime from '../EffectiveDateTime';
import { FetchSiteConfigTableDataAction, clearDeleteLineFormValues, clearEffectiveDateTimeFormValues, saveSiteConfig, setDeleteLineErrors, setEffectiveErrors, setIsPast, setShowDeleteLineModal, updateDeleteLineFormValues } from '@/store/actions/siteConfigAction';
import { toastError, toastSuccess } from '@/utility/commonFunctions';
import { deleteLineStyle } from './delete_line_tailwind';

export default function DeleteLine() {
    const { effectiveDate, effectiveHours, effectiveMinutes } = useSelector((state: any) => state.siteConfigState?.effectiveDateTimeInputs) || '';
    const dispatch: any = useDispatch();
    const showDeleteLineModal = useSelector((state: any) => state.siteConfigState?.showDeleteLineModal);
    const { productionLine } = useSelector((state: any) => state.siteConfigState?.deleteLineInputs);
    const deleteLineError = useSelector((state: any) => state.siteConfigState?.deleteLineError);
    const userRole = useSelector((state: any) => state.authenticationState.userRole);
    const saveSiteConfigStatus = useSelector((state: any) => state.siteConfigState?.saveSiteConfigStatus?.data);

    const { accounts } = useMsal();
    const { dictionary } = useSelector((state: any) => state.siteConfigState);

    const PQAStallBuildingLineOptions: string[] = dictionary.filter((dic: any) => dic.location === 'PQA Stalls').map((item: any) => item.prod_line);
    const PQAConveyorsLineOptions: string[] = dictionary.filter((dic: any) => dic.location === 'PQA Conveyors').map((item: any) => item.prod_line);
    const FQAConveyorsStallLineOptions: string[] = dictionary.filter((dic: any) => dic.location === 'FQA Conveyors & Stalls').map((item: any) => item.prod_line);
    const activeProdLineOptions = [...PQAStallBuildingLineOptions, ...PQAConveyorsLineOptions, ...FQAConveyorsStallLineOptions];
    const prodLineOptionsSorting: string[] = Array.from(new Set(activeProdLineOptions)).sort();

    const getCalenderTimeZone = () => {
        if (userRole?.location === 'LB') {
            return moment.tz('America/Los_Angeles').format('YYYY-MM-DD');
        } else if (userRole?.location === 'PR') {
            return moment.tz('America/New_York').format('YYYY-MM-DD');
        }
    };

    const mergeDateTimeFields = () => {
        if (userRole?.location === 'LB') {
            return moment.tz('America/Los_Angeles').format(`${effectiveDate}T${effectiveHours}:${effectiveMinutes}:ss`);
        } else if (userRole?.location === 'PR') {
            return moment.tz('America/New_York').format(`${effectiveDate}T${effectiveHours}:${effectiveMinutes}:ss`);
        }
    }

    const handleDeleteLineChange = (e: any) => {
        const name = e.target.name;
        const value = e.target.value;
        dispatch(updateDeleteLineFormValues({ name, value }));
    };

    const handleDeleteLineSubmit = (e: any) => {
        e.preventDefault();
        if (productionLine?.length == 0 || effectiveDate?.length == 0
            || effectiveHours?.length == 0 || effectiveMinutes?.length == 0) {
            dispatch(setDeleteLineErrors(true))
            dispatch(setEffectiveErrors(true))
        } else if (productionLine?.length > 0 && effectiveDate?.length > 0
            && effectiveHours?.length > 0 && effectiveMinutes?.length > 0) {
            dispatch(setEffectiveErrors(false))
            if (moment(mergeDateTimeFields()).isBefore(moment(getCalenderTimeZone()))) {
                dispatch(setIsPast(true))
            }
            else {
                dispatch(setIsPast(false))
                //Prepare the payload for POST
                let payload = {
                    type: "remove_shop",
                    shop: productionLine,
                    // current_time: getCalenderTimeZone(),
                    effective_to_date: mergeDateTimeFields()
                }
                //POST API Call here 
                dispatch(saveSiteConfig(userRole?.location, payload));
            }
        };
    }

    useEffect(() => {
        if (saveSiteConfigStatus?.type === 'remove_shop' && saveSiteConfigStatus?.data === 'submitted_successfully') {
            dispatch(setShowDeleteLineModal(false));
            dispatch(clearDeleteLineFormValues());
            dispatch(setDeleteLineErrors(false));
            dispatch(setEffectiveErrors(false))
            dispatch(clearEffectiveDateTimeFormValues());
            //dispatch(FetchSiteConfigTableDataAction(userRole?.location, getCalenderTimeZone()))
            //Toast Success Message
            toastSuccess()
        } else if (saveSiteConfigStatus?.error === 'ERR_NETWORK') {
            //Toast Error Message
            toastError()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [saveSiteConfigStatus])

    return (
        <>
            {showDeleteLineModal && (
                <Modal
                    handleModalClose={() => {
                        dispatch(setShowDeleteLineModal(false));
                        dispatch(clearDeleteLineFormValues());
                        dispatch(clearEffectiveDateTimeFormValues());
                        dispatch(setDeleteLineErrors(false));
                        dispatch(setEffectiveErrors(false))
                        dispatch(setIsPast(false))
                    }}
                    handleConfirm={handleDeleteLineSubmit}
                    modal_header="Remove Existing Production Line"
                    isConfirm
                    confirmBtnName="Submit"
                >
                    <form noValidate>
                        <div className={deleteLineStyle.formElementWrapperWidth}>
                            <label>Production Line</label><br />
                            <select
                                className={deleteLineStyle.formElement}
                                name='productionLine'
                                onChange={handleDeleteLineChange}
                                required
                            >
                                <option value="">Select Option</option>
                                {prodLineOptionsSorting.map((ele: any) =>
                                    <option key={ele}>{ele}</option>
                                )}
                            </select>
                            {deleteLineError && productionLine?.length == 0 ?
                                <p className={deleteLineStyle.formElementError}>Production Line is required</p>
                                : ''}
                        </div>
                        <EffectiveDateTime type='DeleteLine' />
                    </form>
                </Modal >
            )}
        </>
    )
}
