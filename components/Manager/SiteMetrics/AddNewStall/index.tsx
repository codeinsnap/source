import React, { useEffect, useState } from 'react';
import { useMsal } from '@azure/msal-react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { FetchSiteConfigTableDataAction, clearEffectiveDateTimeFormValues, clearNewStallFormValues, clearSaveSiteConfigPayload, clearSaveSiteConfigStatus, saveSiteConfig, setEffectiveErrors, setIsPast, setShowNewStallModal, setStallErrors, updateNewStallFormValues } from '@/store/actions/siteConfigAction';
import Modal from '@/components/Shared/Modal';
import EffectiveDateTime from '../EffectiveDateTime';
import { toastError, toastSuccess } from '@/utility/commonFunctions';
import { webAppConfig } from '@/utility/webAppConfig';
import { addNewStallStyle } from './add_new_stall_tailwind';

export default function AddNewStall() {
  const { effectiveDate, effectiveHours, effectiveMinutes } = useSelector((state: any) => state.siteConfigState?.effectiveDateTimeInputs) || '';
  const dispatch: any = useDispatch();
  const showNewStallModal = useSelector((state: any) => state.siteConfigState?.showNewStallModal);
  const userRole = useSelector((state: any) => state.authenticationState.userRole);
  const saveSiteConfigStatus = useSelector((state: any) => state.siteConfigState?.saveSiteConfigStatus?.data);
  const saveSiteConfigStatusErrorType = useSelector((state: any) => state.siteConfigState?.saveSiteConfigStatus?.type);
  const saveSiteConfigStatusErrorMessage = useSelector((state: any) => state.siteConfigState?.saveSiteConfigStatus?.message);
  const [isAddStallError, isSetAddStallError] = useState(false);

  const maxStallId = useSelector((state: any) => state.siteConfigState?.maxStallId);
  let stallNumber = maxStallId?.substring(maxStallId?.lastIndexOf('_') + 1);
  let incrementValue = (+stallNumber) + 1;
  // insert leading zeroes with a negative slice
  let incrementStallId = ("00" + incrementValue).slice(-4);
  let maxStallIdValue = `LB_${incrementStallId}`

  const { dictionary } = useSelector((state: any) => state.siteConfigState);
  const { accounts } = useMsal();

  const PQAStallBuildingLineOptions: string[] = dictionary.filter((dic: any) => dic.location === 'PQA Stalls').map((item: any) => item.prod_line);
  const PQAConveyorsLineOptions: string[] = dictionary.filter((dic: any) => dic.location === 'PQA Conveyors').map((item: any) => item.prod_line);
  const FQAConveyorsStallLineOptions: string[] = dictionary.filter((dic: any) => dic.location === 'FQA Conveyors & Stalls').map((item: any) => item.prod_line);
  const prodLineOptionsLBPR = [...PQAStallBuildingLineOptions, ...PQAConveyorsLineOptions, ...FQAConveyorsStallLineOptions];
  // const OpsBuildingLineOptions: string[] = dictionary?.filter((dic: any) => dic.location === 'Ops Building').map((item: any) => item.prod_line);
  // const FQABuildingLineOptions: string[] = dictionary?.filter((dic: any) => dic.location === 'FQA Building').map((item: any) => item.prod_line);
  // const prodLineOptionsLBPR = [...OpsBuildingLineOptions, ...FQABuildingLineOptions];
  const prodLineOptionsSorting: string[] = Array.from(new Set(prodLineOptionsLBPR)).sort();

  const { shop, stall_id, location_stall } = useSelector((state: any) => state.siteConfigState?.newStallInputs);
  const stallError = useSelector((state: any) => state.siteConfigState?.stallError);

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

  const handleNewStallSubmit = (e: any) => {
    e.preventDefault();
    if (shop?.length == 0 || effectiveDate?.length == 0
      || effectiveHours?.length == 0 || effectiveMinutes?.length == 0 ||
      (userRole?.location === 'PR' && stall_id?.length == 0) ||
      (userRole?.location === 'PR' && location_stall?.length == 0)

    ) {
      dispatch(setStallErrors(true))
      dispatch(setEffectiveErrors(true))
    } else if (shop?.length > 0 && effectiveDate?.length > 0
      && effectiveHours?.length > 0 && effectiveMinutes?.length > 0 &&
      (
        (userRole?.location === 'LB') ||
        (userRole?.location === 'PR' && stall_id?.length > 0)
      ) &&
      (
        (userRole?.location === 'LB') ||
        (userRole?.location === 'PR' && location_stall?.length > 0)
      )
    ) {
      dispatch(setEffectiveErrors(false))
      if (moment(effectiveCurrentDate()).isBefore(moment(getCurrentTime()))) {
        dispatch(setIsPast(true))
      }
      else {
        dispatch(setIsPast(false))
        //Prepare the payload for POST
        let payload = {
          type: "add_stall",
          stall: (userRole?.location === 'LB') ? maxStallIdValue : stall_id,
          location: (userRole?.location === 'PR') ? location_stall : '',
          shop: shop,
          current_time: getCurrentTime(),
          effective_to_date: effectiveCurrentDate(),
        }
        //POST API Call here 
        dispatch(saveSiteConfig(userRole?.location, payload));
      }
    };
  }

  const handleStallChange = (e: any) => {
    const name = e.target.name;
    const value = e.target.value;
    dispatch(updateNewStallFormValues({ name, value }));
  }

  useEffect(() => {
    if (saveSiteConfigStatus?.type === 'add_stall' && saveSiteConfigStatus?.data === 'submitted_successfully') {
      dispatch(setShowNewStallModal(false));
      dispatch(clearSaveSiteConfigStatus());
      dispatch(clearSaveSiteConfigPayload());
      dispatch(clearNewStallFormValues());
      dispatch(clearEffectiveDateTimeFormValues());
      dispatch(FetchSiteConfigTableDataAction(userRole?.location, getCurrentTime()))
      //Toast Success Message
      toastSuccess()
    } else if (saveSiteConfigStatus?.error === 'ERR_NETWORK') {
      //Toast Error Message
      toastError()
    }else if (saveSiteConfigStatusErrorType === 'add_stall' && saveSiteConfigStatus === 'error') {
      isSetAddStallError(true)
  }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saveSiteConfigStatus])

  return (
    <>
      {/* New Stall Modal  */}
      {showNewStallModal && (
        <Modal
          handleModalClose={() => {
            dispatch(setShowNewStallModal(false));
            dispatch(clearNewStallFormValues())
            dispatch(clearEffectiveDateTimeFormValues());
            dispatch(setEffectiveErrors(false))
            setStallErrors(false);
            isSetAddStallError(false)
            dispatch(clearSaveSiteConfigStatus())
            dispatch(setIsPast(false))
          }}
          handleConfirm={handleNewStallSubmit}
          modal_header="Add New Stall"
          isConfirm
          confirmBtnName="Submit"
        >
          <form noValidate>
            <div className={addNewStallStyle.mainWrapper}>

              {/* Long Beach Manager Add Stall */}
              {webAppConfig?.Manager[userRole?.location]?.siteConfigAddNewStallLB &&
                <>
                  <div className={addNewStallStyle.formElementWrapperWidth}>
                    <label>Stall ID</label><br />
                    <input type="text" value={maxStallIdValue} className={addNewStallStyle.formElement} name='stall_id' readOnly />
                    <span>Default is next available Stall Id</span>
                  </div><br />
                  <div className={addNewStallStyle.formElementWrapperWidth}>
                    <label>Production Line</label><br />
                    <select className={addNewStallStyle.formElement}  name='shop' onChange={handleStallChange} required>
                      <option value="">Select an option</option>
                      {prodLineOptionsSorting.map((ele: any) =>
                        <option key={ele}>{ele}</option>
                      )}
                    </select>
                    {stallError && shop?.length == 0 ?
                      <p className={addNewStallStyle.formElementError} >Production Line is required</p>
                      : ''}
                  </div>
                </>
              }
              {/* Princeton Manager Add Stall */}
              {webAppConfig?.Manager[userRole?.location]?.siteConfigAddNewStallPR &&
                <>
                  <div className={addNewStallStyle.formElementWrapperWidth}>
                    <label>Stall ID</label><br />
                    <input type="text" className={addNewStallStyle.formElement} name='stall_id' onChange={handleStallChange} required />
                  </div>
                  {stallError && stall_id?.length == 0 ?
                    <p className={addNewStallStyle.formElementError} >Stall Id is required</p>
                    : ''}
                  <div className={addNewStallStyle.innerWrapper}>
                    <div className={addNewStallStyle.formElementWrapperWidthMargin}>
                      <label>Production Line</label><br />
                      <select className={addNewStallStyle.formElement} name='shop' onChange={handleStallChange} required>
                        <option value="">Select an option</option>
                        {prodLineOptionsSorting.map((ele: any) =>
                          <option key={ele}>{ele}</option>
                        )}
                      </select>
                      {stallError && shop?.length == 0 ?
                        <p className={addNewStallStyle.formElementError} >Production Line is required</p>
                        : ''}
                    </div>
                    <div className={addNewStallStyle.formElementWrapperWidth}>
                      <label>Location</label><br />
                      <select className={addNewStallStyle.formElement} name='location_stall' onChange={handleStallChange} required>
                        <option value="">Select an option</option>
                        {["East Shop", "West Shop"].map((ele: any) =>
                          <option key={ele}>{ele}</option>
                        )}
                      </select>
                      {stallError && location_stall?.length == 0 ?
                        <p className={addNewStallStyle.formElementError} >Location is required</p>
                        : ''}
                    </div>
                  </div>
                </>
              }

              <EffectiveDateTime type="addNewStall" />
              {isAddStallError && saveSiteConfigStatusErrorType === 'add_stall' && (
                <div className={addNewStallStyle.lineAlreadyExist}> {saveSiteConfigStatusErrorMessage}</div>
            )
            }
            </div>
          </form>
        </Modal>
      )}
    </>
  )
}

