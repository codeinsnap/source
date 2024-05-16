import React, { useEffect, useState } from 'react'
import { vinScanStyle } from './vin_scan_tailwind'
import VINTable from '../VINTable'
import { VinScanAction, clearVinStatus, scanNextVINIdAction, setElementAction, setStartTime } from '@/store/actions/vinAction';
import { useDispatch, useSelector } from 'react-redux';
import { VinTableAction } from '@/store/actions/vinTableAction';
import { CONSTANTS } from '@/constants/constants';
import Modal from '@/components/Shared/Modal';
import { fetchProfileDetailsAction } from '@/store/actions/profileAction';
import moment from 'moment';
import { useMsal } from '@azure/msal-react';

export default function VINScan() {
    const dispatch: any = useDispatch();
    const { accounts } = useMsal();

    const scanNextVINId = useSelector((state: any) => state.vinState?.scanNextVINId);
    const vin_table_data = useSelector((state: any) => state.vinTableState?.vin_table_data);
    const startTime = useSelector((state: any) => state.vinState?.startTime);
    const vinStatus = useSelector((state: any) => state.vinState?.vinStatus?.data);
    const vinStatusMessage = useSelector((state: any) => state.vinState?.vinStatus?.message);
    const element = useSelector((state: any) => state.vinState?.element);
    const selectedUsers = useSelector((state: any) => state.usersState?.selectedUsers);
    const profileData = useSelector((state: any) => state.profileState?.profileData);
    const userRole = useSelector((state: any) => state.authenticationState.userRole);

    const [errors, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [userError, setUserError] = useState(false);

    const [showCancelModal, setShowCancelModal] = useState(false);

    const handleVINScanChange = (e: any) => {
        dispatch(scanNextVINIdAction(e.target.value.trim()));
        setErrorMessage('')
        setError(false);
    }
    
    const startTimeZone = () => {
        if (profileData?.location === 'LB') {
            // LB - (PST)
            return moment.tz('America/Los_Angeles');
        } else if (profileData?.location === 'PR') {
            // Princeton - New_York (CST)
            return moment.tz('America/New_York');
        }
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();

        //SET START TIME
        dispatch(setStartTime(startTimeZone()));
        
        if (scanNextVINId) {
            let workdayIds = selectedUsers.map((item: any) => item.code);
            if (userRole?.location === 'LB') {
                // LB - (PST)
                dispatch(VinScanAction(scanNextVINId, workdayIds, profileData?.stall, profileData?.shop, moment.tz('America/Los_Angeles').format('YYYY-MM-DDTHH:mm:ss'), userRole?.location));
            } else if (userRole?.location === 'PR') {
                // Princeton - New_York (CST)
                dispatch(VinScanAction(scanNextVINId, workdayIds, profileData?.stall, profileData?.shop, moment.tz('America/New_York').format('YYYY-MM-DDTHH:mm:ss'), userRole?.location));
            }
        } else {
            setError(true);
            setErrorMessage('');
        }
    }

    useEffect(() => {
        //load the dashboard api again
        if (startTime && element === 'vin_table' && vin_table_data) {
            dispatch(fetchProfileDetailsAction(
                profileData?.persona,
                profileData?.location,
                scanNextVINId,
                startTime?.format('YYYY-MM-DDTHH:mm:ss'),
                selectedUsers.map((item: any) => item.code)
            ));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [vin_table_data])

    useEffect(() => {
        if (scanNextVINId) {
            if (vinStatus === 'vin_not_found' || vinStatus === 'user_already_logged_in') {// if vin is invalid or user is already logged in
                setErrorMessage(vinStatusMessage)
                setError(false);
                dispatch(clearVinStatus());
            } else if ((vinStatus?.isVINdown === true)) { //if vin is down!
                dispatch(setElementAction('error_pop_up'));
                setError(false);
                setErrorMessage('');
            } else if ((vinStatus?.isVINdown === false)) { //if vin is ok!
                // dispatch(setStartTime(moment.tz('America/Los_Angeles'))); //SET START TIME
                dispatch(setElementAction("vin_table"));
                dispatch(VinTableAction(scanNextVINId, profileData?.shop, selectedUsers.map((item: any) => item.code), startTime?.format('YYYY-MM-DDTHH:mm:ss'), userRole?.location))
                setError(false);
                setErrorMessage('');
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [scanNextVINId, vinStatus])

    const handleAcknowledged = () => {
        // dispatch(setStartTime(moment.tz('America/Los_Angeles'))); //SET START TIME
        dispatch(setElementAction('vin_table'))
        dispatch(VinTableAction(scanNextVINId, profileData?.shop, selectedUsers.map((item: any) => item.code), startTime?.format('YYYY-MM-DDTHH:mm:ss'), userRole?.location));
        setShowCancelModal(false);
    }

    const handleModalClose = () => {
        dispatch(setElementAction('scan_input'));
        dispatch(clearVinStatus());
        dispatch(scanNextVINIdAction(""));
        setShowCancelModal(false);
    }

    return (
        <>
            <div className={vinScanStyle.currentVehicle}>
                {CONSTANTS.CURRENT_VEHICLE_INSTALLATION}
            </div>

            {(element === 'scan_input') && (
                <form className={vinScanStyle.form}>
                    <div>
                        <label className={vinScanStyle.label}>{CONSTANTS.SCAN_NEXT_VIN}</label>
                        <input
                            className={vinScanStyle.input}
                            type="text"
                            placeholder={CONSTANTS.ENTER_VIN}
                            name='vinid'
                            onChange={(e) => handleVINScanChange(e)}
                        />
                        {errors ?
                            <p className={vinScanStyle.vinErrorMessage}> {CONSTANTS.VIN_ID_EMPTY_MESSAGE}</p> : ''
                        }
                        {errorMessage ?
                            <p className={vinScanStyle.vinErrorMessage}> {errorMessage} </p> : ''
                        }
                    </div>
                    <div className={errors || errorMessage || userError ? vinScanStyle.vinErrorMinusMarginTop : vinScanStyle.vinErrorMarginTop}>
                        <button
                            className={(selectedUsers.length === 0) ? vinScanStyle.buttonDisabled : vinScanStyle.button}
                            type='submit'
                            onClick={(e) => handleSubmit(e)}
                            disabled={selectedUsers.length === 0}
                        >
                            {CONSTANTS.SUBMIT}
                        </button>
                    </div>

                </form>
            )}
            {/* Error Message to show scanned vin id doesn't exist */}
            {(element === 'error_pop_up') && (
                <Modal
                    handleModalClose={handleModalClose}
                    handleConfirm={handleAcknowledged}
                    modal_header={CONSTANTS.ACKNOWLEDGED_MODAL_HEADER}
                    isConfirm
                    confirmBtnName={CONSTANTS.CONTINUE}
                    isCancel
                    cancelBtnName={CONSTANTS.CANCEL}
                >
                    <p>
                        The vehicle <b>{vinStatus?.model}</b> is in <b>{vinStatus?.status}</b> status. {CONSTANTS.VIN_DOWN_MESSAGE1}.
                        <br /><br />
                        Click &#39;Continue&#39; {CONSTANTS.VIN_DOWN_MESSAGE2}. Click &#39;Cancel&#39; or 	&#39;X&#39; {CONSTANTS.VIN_DOWN_MESSAGE3}.
                    </p>
                </Modal >

            )}
            {/* Render Table with vin details */}
            {(element === 'vin_table') && <VINTable />}
        </>

    )
}
