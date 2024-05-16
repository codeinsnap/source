
import React, { useEffect, useState } from 'react';
import Modal from '@/components/Shared/Modal';
import { useMsal } from '@azure/msal-react';
import { clearEffectiveDateTimeFormValues, clearNewProductionLineFormValues, clearSaveSiteConfigPayload, clearSaveSiteConfigStatus, saveSiteConfig, setEffectiveErrors, setIsPast, setLineErrors, setShowNewLineModal, updateNewProductionLineFormValues } from '@/store/actions/siteConfigAction';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { FetchSiteConfigTableDataAction } from '@/store/actions/siteConfigAction';
import EffectiveDateTime from '../EffectiveDateTime';
import { toastError, toastSuccess } from '@/utility/commonFunctions';
import { addNewProductionLineStyle } from './new_production_line_tailwind';

export default function AddNewProductionLine() {
    const { effectiveDate, effectiveHours, effectiveMinutes } = useSelector((state: any) => state.siteConfigState?.effectiveDateTimeInputs) || '';
    const dispatch: any = useDispatch();
    const showNewLineModal = useSelector((state: any) => state.siteConfigState?.showNewLineModal);
    const userRole = useSelector((state: any) => state.authenticationState.userRole);
    const saveSiteConfigStatus = useSelector((state: any) => state.siteConfigState?.saveSiteConfigStatus?.data);

    const { accounts } = useMsal();
    const { shop, shop_name, location, isFQA, conveyorLine } = useSelector((state: any) => state.siteConfigState?.newProductionLineInputs);
    const lineError = useSelector((state: any) => state.siteConfigState?.lineError);
    const saveSiteConfigStatusErrorType = useSelector((state: any) => state.siteConfigState?.saveSiteConfigStatus?.type);
    const saveSiteConfigStatusErrorMessage = useSelector((state: any) => state.siteConfigState?.saveSiteConfigStatus?.message);
    const [ishopAlreadyExits, setShopAlreadyExits] = useState(false);

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

    const handleLineChange = (e: any) => {
        const name = e.target.name;
        const value = e.target.value;
        dispatch(updateNewProductionLineFormValues({ name, value }, false));
        if (name === 'location' && value === 'PQA Stalls') {
            dispatch(updateNewProductionLineFormValues({ name, value }, true));
        }
        if (name === 'location' && value === 'PQA Conveyors') {
            dispatch(updateNewProductionLineFormValues({ name, value }, true));
        }

    }

    const handleNewLineSubmit = (e: any) => {
        e.preventDefault();
        // conveyorLine?.length == 0 ||
        // && conveyorLine?.length > 0
        if (shop?.length == 0 || shop_name?.length == 0 || location?.length == 0 || 
            effectiveDate?.length == 0 || effectiveHours?.length == 0 || effectiveMinutes?.length == 0 || 
            (location === 'FQA Conveyors & Stalls' && isFQA?.length == 0)) {
            dispatch(setLineErrors(true))
            dispatch(setEffectiveErrors(true))
        }
        else if (shop?.length > 0 && shop_name?.length > 0 && location?.length > 0 
            && effectiveDate?.length > 0 && effectiveHours?.length > 0 && effectiveMinutes?.length > 0 &&
            (
                (location === 'PQA Stalls') ||
                (location === 'PQA Conveyors') ||
                (location === 'FQA Conveyors & Stalls' && isFQA?.length > 0)

            )
        ) {
            dispatch(setEffectiveErrors(false))
            if (moment(effectiveCurrentDate()).isBefore(moment(getCurrentTime()))) {
                dispatch(setIsPast(true))
            }
            else {
                dispatch(setIsPast(false))
                let payload = {
                    type: "add_shop",
                    shop: shop.trim(),
                    shop_name: shop_name.trim(),
                    location: location,//Process Type
                    // conveyorLine: conveyorLine,
                    effective_to_date: effectiveCurrentDate(),
                    current_time: getCurrentTime(),
                    isFQA: isFQA
                }
                //POST API Call here 
            dispatch(saveSiteConfig(userRole?.location, payload));
            }
        }
    };

    useEffect(() => {
        if (saveSiteConfigStatus?.type === 'add_shop' && saveSiteConfigStatus?.data === 'submitted_successfully') {
            dispatch(setShowNewLineModal(false))
            dispatch(clearSaveSiteConfigStatus());
            dispatch(clearSaveSiteConfigPayload());
           // dispatch(FetchSiteConfigTableDataAction(userRole?.location, getCurrentTime()))
            dispatch(clearNewProductionLineFormValues());
            dispatch(clearEffectiveDateTimeFormValues());
            //Toast Success Message
            toastSuccess()
        } else if (saveSiteConfigStatus?.error === 'ERR_NETWORK') {
            //Toast Error Message
            toastError()
        } else if (saveSiteConfigStatusErrorType === 'add_shop' && saveSiteConfigStatus === 'error') {
            setShopAlreadyExits(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [saveSiteConfigStatus])

    return (
        <>
            {showNewLineModal && (
                <Modal
                    handleModalClose={() => {
                        dispatch(setShowNewLineModal(false))
                        dispatch(clearNewProductionLineFormValues());
                        dispatch(clearEffectiveDateTimeFormValues());
                        dispatch(setEffectiveErrors(false))
                        setLineErrors(false);
                        setShopAlreadyExits(false);
                        dispatch(clearSaveSiteConfigStatus());
                        dispatch(setIsPast(false))
                    }}
                    handleConfirm={handleNewLineSubmit}
                    modal_header="Add New Production Line"
                    isConfirm
                    confirmBtnName="Submit"
                >
                    <form noValidate>
                        <div className={addNewProductionLineStyle.mainWrapper}>
                            <div className={addNewProductionLineStyle.innerWrapper}>
                                <div className={addNewProductionLineStyle.formElementWrapperWidthMargin}>
                                    <label>Production Line</label>
                                    <input type="text" placeholder='Input Text' className={addNewProductionLineStyle.formElement} name='shop' onChange={handleLineChange} required />
                                    {lineError && shop?.length == 0 ?
                                        <p className={addNewProductionLineStyle.formElementError}>Production Line is required</p>
                                        : ''}
                                </div>
                                <div className={addNewProductionLineStyle.formElementWrapperWidth}>
                                    <label>Line Name</label><br />
                                    <input type="text" placeholder="Input Text" className={addNewProductionLineStyle.formElement} name='shop_name' onChange={handleLineChange} required />
                                    {lineError && shop_name?.length == 0 ?
                                        <p className={addNewProductionLineStyle.formElementError}>Line Name is required</p>
                                        : ''}
                                </div>
                            </div>
                            <div className={addNewProductionLineStyle.innerWrapper}>
                                <div className={addNewProductionLineStyle.formElementWrapperWidthMargin}>
                                    <label>Process Type</label><br />
                                    <select className={addNewProductionLineStyle.formElement} name='location' defaultValue={""}
                                        onChange={handleLineChange} required>
                                        <option value="">Select option</option>
                                        {["PQA Stalls", "PQA Conveyors", "FQA Conveyors & Stalls"].map((ele: any) =>
                                            <option key={ele}>{ele}</option>
                                        )}
                                    </select>
                                    {lineError && location?.length == 0 ?
                                        <p className={addNewProductionLineStyle.formElementError}>Process Type is required</p>
                                        : ''}
                                </div>
                                <div className={addNewProductionLineStyle.formElementWrapperWidth}>
                                    <label>FQA Line</label><br />
                                    <select
                                       className={addNewProductionLineStyle.formElement}
                                        name='isFQA'
                                        defaultValue={""}
                                        value={isFQA}
                                        onChange={handleLineChange}
                                        disabled={location !== 'FQA Conveyors & Stalls'}
                                    >
                                        <option value=''>Select option</option>
                                        {["Y", "N"].map((ele: any) =>
                                            <option key={ele}>{ele}</option>
                                        )}
                                    </select>
                                    {lineError && isFQA?.length == 0 && location === 'FQA Conveyors & Stalls' ?
                                        <p className={addNewProductionLineStyle.formElementError}>FQA Line is required</p>
                                        : ''}
                                </div>
                            </div>
                            {/* <div className={addNewProductionLineStyle.innerWrapper}>
                                <div className={addNewProductionLineStyle.formElementWrapperWidth}>
                                    <label>Conveyor Line</label><br />
                                    <select
                                        className={addNewProductionLineStyle.formElement}
                                        name='conveyorLine'
                                        defaultValue={""}
                                        value={conveyorLine}
                                        onChange={handleLineChange}
                                    >
                                        <option value=''>Select option</option>
                                        {["Y", "N"].map((ele: any) =>
                                            <option key={ele}>{ele}</option>
                                        )}
                                    </select>
                                    {lineError && conveyorLine?.length == 0  ?
                                        <p className={addNewProductionLineStyle.formElementError}>Conveyor Line is required</p>
                                        : ''}
                                </div>
                            </div> */}
                            <EffectiveDateTime type='addNewLine' />
                            {ishopAlreadyExits && saveSiteConfigStatusErrorType === 'add_shop' && (
                                <div className={addNewProductionLineStyle.lineAlreadyExist}> {saveSiteConfigStatusErrorMessage}</div>
                            )
                            }
                        </div>
                    </form>
                </Modal>
            )}
        </>
    )
}
