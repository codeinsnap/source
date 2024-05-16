import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { vinStyle } from './vin_table_tailwind';
import Modal from '@/components/Shared/Modal';
import Tooltip from '@/components/Shared/Tooltip/Tooltip';
import { clearStartTime, clearVinStatus, scanNextVINIdAction, setElementAction } from '@/store/actions/vinAction';
import { fetchReasonCodesAction } from '@/store/actions/reasonCodesAction';
import toast from 'react-hot-toast';
import { CONSTANTS } from '@/constants/constants';
import { clearAccessoriesList, clearSaveAccessoriesStatus, saveAccessories } from '@/store/actions/vinTableAction';
import { fetchProfileDetailsAction } from '@/store/actions/profileAction';
import moment from 'moment';
import { useMsal } from '@azure/msal-react';
import Link from 'next/link';

export default function VINTable() {
    const dispatch: any = useDispatch();

    const { accounts } = useMsal();

    const shop = useSelector((state: any) => state.profileState.profileData?.shop);
    const profileData = useSelector((state: any) => state.profileState.profileData);
    const selectedUsers = useSelector((state: any) => state.usersState?.selectedUsers);
    const vin_table_data = useSelector((state: any) => state.vinTableState?.vin_table_data);
    const scanNextVINId = useSelector((state: any) => state.vinState?.scanNextVINId);
    const startTime = useSelector((state: any) => state.vinState?.startTime);
    const reasonCodes = useSelector((state: any) => state.reasonCodesState?.reasonCodes);
    const saveAccessoriesStatus = useSelector((state: any) => state.vinTableState?.saveAccessoriesStatus.data);
    const [formData, setFormData] = useState<any>([]);
    const [showModal, setShowModal] = useState(false);
    const [isSubmitBtnDisabled, setSubmitBtnDisabled] = useState(false);
    const userRole = useSelector((state: any) => state.authenticationState.userRole);

    const handleInstalledClick = (e: any, btnKey: string) => {
        if (formData && formData.length && formData.filter((item: any) => item.code === e.target.name)[0]) {
            const index = formData.findIndex((item: any) => item.code === e.target.name);
            let arr = [...formData];

            //check which btn is clicked. If "Installed" is clicked then change the installed status to either pending(P), installed(I) or not installed(NI) 
            if (btnKey === "Installed") {
                //toggle grey to green and vice versa
                if (arr[index].installed === "P") { //change grey to green
                    arr[index] = Object.assign({}, arr[index], { installed: "I", ERR_CD: "" });
                } else if (arr[index].installed === "NI") { //change red to green
                    arr[index] = Object.assign({}, arr[index], { installed: "I", ERR_CD: "" });
                } else { //change back to grey
                    arr[index] = Object.assign({}, arr[index], { installed: "P", ERR_CD: "" });
                }
            } else if (btnKey === "Not Installed") { //check which btn is clicked. If "Not Installed" is clicked then make the button red
                //toggle red to grey and vice versa 
                if (arr[index].installed === 'P') {
                    arr[index] = Object.assign({}, arr[index], { installed: "NI" });
                } else if (arr[index].installed === 'I') {
                    arr[index] = Object.assign({}, arr[index], { installed: "NI" });
                }
                else {
                    arr[index] = Object.assign({}, arr[index], { installed: "P", ERR_CD: "" });
                }
            }
            //set all changes FormData
            setFormData([...arr]);
        }
    }

    const handleModalClose = () => {
        setShowModal(false);
    }

    const endTimeFormat = () => {
        if (profileData?.location === 'LB') {
            // LB - (PST)
            return moment.tz('America/Los_Angeles').format('YYYY-MM-DDTHH:mm:ss');
        } else if (profileData?.location === 'PR') {
            // Princeton - New_York (CST)
            return moment.tz('America/New_York').format('YYYY-MM-DDTHH:mm:ss');
        }
    };

    const handleFormSubmit = () => {
        let selectedAccessoriesList: any = [];
        formData?.filter((item: any) => item.installed !== 'P')?.forEach((element: any) => {
            let filterKeys: any = {
                code: element?.code,
                serialnumber: element?.serialnumber,
                line: element?.line,
                installed: element?.installed,
                reasonCode: element?.ERR_CD,
                expectedInstallTime: element?.expectedInstallTime
            }
            selectedAccessoriesList.push(filterKeys)
        });
        //Prepare the payload for POST
        let payload = {
            vin: scanNextVINId,
            shop: shop,
            stall: profileData?.stall,
            startTime: startTime?.format('YYYY-MM-DDTHH:mm:ss'),
            endTime: endTimeFormat(),
            workdayIds: selectedUsers.map((item: any) => item.code),
            accessoriesList: selectedAccessoriesList
        }
        
        //POST API Call here 
        dispatch(saveAccessories(payload, userRole?.location));
    };

    const handleReasonChange = (selectedValue: string, name: string) => {
        const index = formData.findIndex((item: any) => item.code === name);
        let arr = [...formData];
        if (index > -1) {
            arr[index].ERR_CD = selectedValue;
        }
        setFormData([...arr]);
    }

    useEffect(() => {
        dispatch(fetchReasonCodesAction())
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    //load the redux state into an easily mutable state for processing
    useEffect(() => {
        setFormData(vin_table_data);
    }, [vin_table_data])

    //listen to changes in form data and disable the submit btn if selection from current line is pending
    useEffect(() => {
        // let index = formData.findIndex((item: any) => (item.installed === 'I' || item.installed === 'NI'));
        let filteredFormDataByShopLB = formData?.filter((item: any) => item.line === shop);

        let isPendingIndex = filteredFormDataByShopLB?.findIndex((item: any) => (item.installed === 'P'));

        let filterArrWithNoReason = formData?.filter((item: any) => (item.installed === 'NI' && !item.ERR_CD));

        if ((isPendingIndex > -1) || filterArrWithNoReason?.length || !formData) {
            setSubmitBtnDisabled(true);
        } else {
            setSubmitBtnDisabled(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formData]);

    useEffect(() => {
        if (saveAccessoriesStatus?.data === 'submitted_successfully') {
            dispatch(clearStartTime()); //CLEAR START TIME
            dispatch(scanNextVINIdAction("")); //empty the scanned number 
            dispatch(clearVinStatus()); //CLEAR VIN STATUS
            dispatch(clearAccessoriesList()); // CLEAR ACCESSORIES LIST
            dispatch(setElementAction('scan_input')); //Land on Dashboard Default View
            setShowModal(false); //Close Modal After API Call is done
            dispatch(clearSaveAccessoriesStatus()); //CLEAR SAVE ACCESSORIES STATUS

            if (profileData?.location === 'LB') {
                //load the dashboard api again
                dispatch(fetchProfileDetailsAction(profileData?.persona, profileData?.location, "", moment.tz('America/Los_Angeles').format('YYYY-MM-DDTHH:mm:ss'), []));
            } else if (profileData?.location === 'PR') {
                //load the dashboard api again
                dispatch(fetchProfileDetailsAction(profileData?.persona, profileData?.location, "", moment.tz('America/New_York').format('YYYY-MM-DDTHH:mm:ss'), []));
            }
            //Toast Success Message
            toast.success(CONSTANTS.VEHICLE_SUCCESS_MESSAGE, {
                position: 'top-right',
                duration: 4000,
                icon: saveAccessoriesStatus?.status === 'complete_late' ? '😞' : '😃',
                style: {
                    borderRadius: '4px',
                    backgroundColor: '#22A63E',
                    color: 'white',
                    fontWeight: '600'
                }
            });
        } else if (saveAccessoriesStatus?.error === 'ERR_NETWORK') {
            toast.error(CONSTANTS.NETWORK_ERROR, {
                position: 'top-right',
                duration: 4000,
                icon: '😞',
                style: {
                    borderRadius: '4px',
                    backgroundColor: 'red',
                    color: 'white',
                    fontWeight: '600'
                }
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [saveAccessoriesStatus])

    return (
        <>
            {/* MODAL FOR CONFIRMATION */}
            {showModal && (
                <Modal
                    handleModalClose={handleModalClose}
                    handleConfirm={handleFormSubmit}
                    modal_header={CONSTANTS.TABLE_SUBMIT_MODAL_HEADER}
                    modal_content={CONSTANTS.TABLE_SUBMIT_MODAL_CONTENT}
                    isConfirm
                    confirmBtnName={CONSTANTS.YES}
                    isCancel
                    cancelBtnName={CONSTANTS.NO}
                >
                    <>
                        {(formData.findIndex((item: any) => item.installed === 'NI') > -1) && (
                            <div className={vinStyle.statusPadding}>
                                <div className={`${vinStyle.notInstalled} ${vinStyle.buttonColorNotInstalled}`}>
                                    {CONSTANTS.NOT_INSTALLED}
                                </div>
                                {formData.filter((data: any) => data.installed === 'NI').map((item: any) => {
                                    return (
                                        <div key={item.code} className={vinStyle.statusListWrapper}>
                                            <div><span className={vinStyle.statusFont}>{CONSTANTS.LINE} </span>{item.line}  <span className={vinStyle.statusFont}>{CONSTANTS.CODE} </span>{item.code}</div>
                                            <div><span className={vinStyle.statusFont}>{CONSTANTS.DESCRIPTION}:</span> {item.description}</div>
                                            <div><span className={vinStyle.statusFont}>{CONSTANTS.REASON}:</span> {reasonCodes.filter((data: any) => data.code === item.ERR_CD)[0]["label"]}</div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                        {(formData.findIndex((item: any) => item.installed === 'I') > -1) && (
                            <div className={vinStyle.statusPadding}>
                                <div className={`${vinStyle.accessoryInstalled} ${vinStyle.buttonColorAccessoryInstalled}`}>
                                    {CONSTANTS.INSTALLED}
                                </div>
                                {formData.filter((data: any) => data.installed === 'I').map((item: any) => {
                                    return (
                                        <div key={item.code} className={vinStyle.statusListWrapper}>
                                            <div><span className={vinStyle.statusFont}>{CONSTANTS.LINE} </span>{item.line}  <span className={vinStyle.statusFont}>{CONSTANTS.CODE} </span>{item.code}</div>
                                            <div><span className={vinStyle.statusFont}>{CONSTANTS.DESCRIPTION}:</span> {item.description}</div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </>
                </Modal >
            )
            }
            {/* Render Accessories Table */}
            <div className={vinStyle.accessoryTableMainWrapper}>
                <div className={vinStyle.accessoryTableInnerWrapper}>
                    <div className={vinStyle.accessoryTableWidth}>
                        <div className={vinStyle.accessoryTableOverflow}>
                            <div className={vinStyle.accessoryTableScroll}>
                                <table className={vinStyle.accessoryTableFont}>
                                    <thead
                                        className={vinStyle.accessoryTableBackground}>
                                        <tr>
                                            <th scope="col" className={vinStyle.accessoryLabel}>{CONSTANTS.LINE}</th>
                                            <th scope="col" className={vinStyle.tooltipOuterWrapper}>
                                                <div className={vinStyle.tooltipInnerWrapper}>
                                                    <span className={vinStyle.tooltipLabel}>{CONSTANTS.CODE}</span>
                                                    <button
                                                        className={vinStyle.tooltipButton} type="button"
                                                    >
                                                        i
                                                    </button>
                                                    <span className={vinStyle.tooltipSpan}> {CONSTANTS.TOOLTIP_HOVER_CONTENT1}<br /> {CONSTANTS.TOOLTIP_HOVER_CONTENT2}&apos;s {CONSTANTS.TOOLTIP_HOVER_CONTENT3} </span>
                                                </div>
                                            </th>
                                            <th scope="col" className={vinStyle.accessoryLabel}>{CONSTANTS.ACCESSORY_DESCRIPTION}</th>
                                            <th scope="col" className={vinStyle.accessoryLabel}>{CONSTANTS.ACCESSORY_PART_NUMBER}</th>
                                            <th scope="col" className={vinStyle.accessoryLabel}>{CONSTANTS.EXP_TIME}</th>
                                            <th scope="col" className={vinStyle.accessoryStatusLabel}>{CONSTANTS.STATUS}</th>
                                            <th scope="col" className={vinStyle.accessoryLabel}></th>
                                            <th scope="col" className={vinStyle.tooltipOuterWrapper}>
                                                <Tooltip reasonCodes={reasonCodes} />
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className={vinStyle.accessoryTableBody}>
                                        {formData && formData.map((data: any, index: any) => {
                                            return (
                                                <tr
                                                    key={data.code}
                                                    className={index % 2 === 0 ? vinStyle.accessoryTableListGrey : vinStyle.accessoryTableListWhite}
                                                >
                                                    <td className={vinStyle.accessoryListWrap}>{data.line}</td>
                                                    <td className={vinStyle.accessoryListWrapLink}>
                                                        <Link
                                                            target='_blank'
                                                            href={'https://myteams.toyota.com/:f:/r/sites/TestLOStdWork/Shared%20Documents/General/Long%20Beach%20SW?csf=1&web=1&e=XnSfkE'}
                                                        >
                                                            {data.code}
                                                        </Link>
                                                    </td>
                                                    <td className={vinStyle.accessoryListWrap}>{data.description}</td>
                                                    <td className={vinStyle.accessoryListWrap}>{data.accessoryPartNumber}</td>
                                                    <td className={vinStyle.accessoryListWrap}>{data.expectedInstallTime} min</td>
                                                    <td
                                                        className={vinStyle.accessoryListWrapOpacity}
                                                        onClick={(e) => handleInstalledClick(e, "Installed")}
                                                    >
                                                        <button
                                                            name={data.code}
                                                            className={`${vinStyle.button} 
                                                            ${(formData && formData.length && (formData.filter((item: any) => item.code === data.code)[0]["installed"] === 'I'))
                                                                    ? vinStyle.buttonColorAccessoryInstalled
                                                                    : vinStyle.buttonColorInstalled}`}
                                                        >
                                                            <span>&#10003;&nbsp;&nbsp;</span>{CONSTANTS.INSTALLED}
                                                        </button>
                                                    </td>
                                                    <td
                                                        className={vinStyle.accessoryListWrapOpacity}
                                                        onClick={(e) => handleInstalledClick(e, "Not Installed")}
                                                    >
                                                        <button
                                                            name={data.code}
                                                            className={`${vinStyle.button} 
                                                        ${(formData && formData.length && (formData.filter((item: any) => item.code === data.code)[0]["installed"] === 'NI'))
                                                                    ? vinStyle.buttonColorNotInstalled
                                                                    : vinStyle.buttonColorInstalled}`}

                                                        >
                                                            <span>&#x2716;&nbsp;&nbsp;</span>{CONSTANTS.NOT_INSTALLED}
                                                        </button>
                                                    </td>
                                                    <td className={vinStyle.accessoryReasonLabel}>
                                                        {
                                                            (formData && formData.length &&
                                                                (formData.filter((item: any) => item.code === data.code)[0]["installed"] === 'NI')
                                                            )
                                                                ?
                                                                (
                                                                    <select
                                                                        className={vinStyle.accessoryReasonHeight}
                                                                        value={data.ERR_CD}
                                                                        onChange={(e) => handleReasonChange(e.target.value, data.code)}
                                                                    >
                                                                        <option value="">{CONSTANTS.SELECT_REASON}</option>
                                                                        {reasonCodes?.map((option: any) => (
                                                                            <option key={option.code} value={option.code}>{option.label}</option>
                                                                        ))}
                                                                    </select>
                                                                )
                                                                : null
                                                        }
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                            <div className={vinStyle.buttonWidth}>
                                <button
                                    type="button"
                                    disabled={isSubmitBtnDisabled}
                                    className={`${vinStyle.button} ${vinStyle.btnMargin} ${isSubmitBtnDisabled ? vinStyle.buttonColorDisabled : vinStyle.buttonColorBlue} `}
                                    onClick={() => setShowModal(true)}
                                >
                                    {CONSTANTS.SUBMIT}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
