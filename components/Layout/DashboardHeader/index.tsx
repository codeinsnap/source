import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment, { Moment } from 'moment-timezone';
import { useMsal } from '@azure/msal-react';
import { useRouter } from 'next/router';
import Modal from '@/components/Shared/Modal';
import { dashboardHeaderStyle } from './dashboard_header_tailwind';
import { CONSTANTS } from '@/constants/constants';
import { fetchProfileDetailsAction, setunitEleBtn } from '@/store/actions/profileAction';
import { clearAccessoriesList } from '@/store/actions/vinTableAction';
import { fetchSiteMeticAction,  setDateFilterEleBtnPTManager, setDateFilterElebtn, setManagerUnitToggleBtn } from '@/store/actions/siteMetricAction';
import { clearVinStatus, scanNextVINIdAction, setElementAction, clearStartTime } from '@/store/actions/vinAction';
import { refreshAction, setLastRefreshed } from '@/store/actions/commonAction';

export default function DashboardHeader(props: any) {
  const { sectionHeader, renderEle, showToggle, stall } = props;
  const userRole = useSelector((state: any) => state.authenticationState.userRole);

  const dispatch: any = useDispatch();
  const router = useRouter();
  const { accounts } = useMsal();
  

  const [clock, setClock] = useState<string>('');
  const element = useSelector((state: any) => state.vinState.element);
  const profileData = useSelector((state: any) => state.profileState?.profileData);
  const unitEleData = useSelector((state: any) => state.profileState.unitEle);
  const filterEle = useSelector((state: any) => state.siteMetricState.unitEle);
  const filterElePTManager = useSelector((state: any) => state.siteMetricState.unitElePrincetonManager);
  const managerToggleEle = useSelector((state: any) => state.siteMetricState.managerToggleEle);
  const lastRefreshed = useSelector((state: any) => state.commonState.lastRefreshed);
  const isLoading = useSelector((state: any) => state.commonState.displayLoader);
  const lastVptbRefreshed = useSelector((state: any) => state.commonState.lastVptbRefreshed);
  const selectedShopName = useSelector((state: any) => state.productionLineMetricState.productionLineMetric.shop);

  const [isCancelDisabled, setIsCancelDisabled] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const handleConfirmCancellation = () => {
    dispatch(clearStartTime()); //CLEAR START TIME
    dispatch(scanNextVINIdAction(""));
    dispatch(clearVinStatus());
    dispatch(clearAccessoriesList());
    dispatch(setElementAction('scan_input'));
    setShowCancelModal(false);
    //Call Dashboard API upon cancel
    if (userRole?.location === 'LB') {
      dispatch(fetchProfileDetailsAction(profileData?.persona, profileData?.location, "", moment.tz('America/Los_Angeles').format('YYYY-MM-DDTHH:mm:ss'), []));
    } else if (userRole?.location === 'PR') {
      dispatch(fetchProfileDetailsAction(profileData?.persona, profileData?.location, "", moment.tz('America/New_York').format('YYYY-MM-DDTHH:mm:ss'), []));
    }
  }

  const unitEleBtn = (selectedValue: any) => {
    dispatch(setunitEleBtn(selectedValue))
  }

  const managerToggleBtn = (selectedValue: any) => {
    dispatch(setManagerUnitToggleBtn(selectedValue))
  }

  useEffect(() => {
    if (element === 'vin_table') {
      setIsCancelDisabled(false);
    } else {
      setIsCancelDisabled(true)
    }

  }, [element])

  // -----------------Clock ticking logic starts here--------------------- 
  const tick = () => {
    if (userRole?.location === 'LB') {
      // LB - (PST)
      const timeLB = moment.tz('America/Los_Angeles').format('ddd MM/DD/YYYY LT');
      setClock(timeLB);
    } else if (userRole?.location === 'PR') {
      // Princeton - New_York (CST)
      const timePrinceton = moment.tz('America/New_York').format('ddd MM/DD/YYYY LT');
      setClock(timePrinceton);
    }
  };

  //Timer tick 
  useEffect(() => {
    const timerID = setInterval(() => tick(), 1000);
    return () => {
      clearInterval(timerID);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userRole]);
  // -----------------Clock ticking logic ends here--------------------- 

  // Long Beach Manager Date Filter
  const handleDateFilter = (selectedFilterValue: any) => {
    dispatch(setDateFilterElebtn(selectedFilterValue))
    commonDateFilter(selectedFilterValue);
  }

  // Princeton Manager Date Filter
  const handleDateFilterPrincetonManager = (selectedFilterValue: any) => {
    dispatch(setDateFilterEleBtnPTManager(selectedFilterValue))
    commonDateFilter(selectedFilterValue);
  }

  const startTimeZone = () => {
    if (userRole?.location === 'LB') {
      // LB - (PST)
      return moment.tz('America/Los_Angeles').format('ddd MM/DD/YYYY LT');
    } else if (userRole?.location === 'PR') {
      // Princeton - New_York (CST)
      return moment.tz('America/New_York').format('ddd MM/DD/YYYY LT');
    }
  };

  const refresh = () => {
    if (!isLoading) {
      if (userRole?.location === 'LB') {
        let selectedFilterValue = filterEle && filterEle?.filter((item: any) => item.isActive)[0].name;
        commonDateFilter(selectedFilterValue);
        // Setting the last refreshed time
        // dispatch(setLastRefreshed(startTimeZone()));
      } else if (userRole?.location === 'PR') {
        let selectedFilterValue = filterElePTManager && filterElePTManager?.filter((item: any) => item.isActive)[0].value;
        commonDateFilter(selectedFilterValue);
        // Setting the last refreshed time
        dispatch(setLastRefreshed(startTimeZone()));
      }
    }
  }

  const commonDateFilter = (selectedFilterValue: any) => {
    const isVptb = router.pathname === '/Manager/VPTB' ? true : false;
    if (userRole?.location === 'LB') {
      // LB - (PST)
      if (selectedFilterValue === 'today') {
        // dispatch(fetchSiteMeticAction(userRole?.location, moment.tz('America/Los_Angeles').format('YYYY-MM-DD'), moment.tz('America/Los_Angeles').format('YYYY-MM-DDTHH:mm:ss'), ''))
        refreshAction(userRole?.location,
          moment.tz('America/Los_Angeles').format('YYYY-MM-DD'),
          moment.tz('America/Los_Angeles').format('YYYY-MM-DDTHH:mm:ss'),
          '',
          selectedShopName ?? '',
          selectedFilterValue.toUpperCase(),
          isVptb,
          dispatch
        );
      }
      else if (selectedFilterValue === 'yesterday') {
        //If Day is Monday, yesterday filter should pull in Saturday's data, hence subtract by 2  
        // if (moment(moment.tz('America/Los_Angeles')).day() === 1) {
        // dispatch(fetchSiteMeticAction(userRole?.location, moment.tz('America/Los_Angeles').subtract(3, "day").format('YYYY-MM-DD'), moment.tz('America/Los_Angeles').subtract(2, "day").startOf('day').subtract('minute', 1).format('YYYY-MM-DDTHH:mm:ss'), ''))
        // } else { //for rest of the week yesterday filter should work noramlly
        dispatch(fetchSiteMeticAction(userRole?.location, moment.tz('America/Los_Angeles').subtract(1, "day").format('YYYY-MM-DD'), moment.tz('America/Los_Angeles').startOf('day').subtract('minute', 1).format('YYYY-MM-DDTHH:mm:ss'), ''))
        // }
      }
    }
    else if (userRole?.location === 'PR') {
      // Princeton - New_York (CST)
      if (selectedFilterValue === '1') {
        dispatch(fetchSiteMeticAction(userRole?.location, moment.tz('America/New_York').format('YYYY-MM-DD'), moment.tz('America/New_York').format('YYYY-MM-DDTHH:mm:ss'), selectedFilterValue))
      }
      else if (selectedFilterValue === '2') {
        dispatch(fetchSiteMeticAction(userRole?.location, moment.tz('America/New_York').format('YYYY-MM-DD'), moment.tz('America/New_York').format('YYYY-MM-DDTHH:mm:ss'), selectedFilterValue))
      }
      else if (selectedFilterValue === 'today') {
        dispatch(fetchSiteMeticAction(userRole?.location, moment.tz('America/New_York').format('YYYY-MM-DD'), moment.tz('America/New_York').format('YYYY-MM-DDTHH:mm:ss'), ''))
      }
      else if (selectedFilterValue === 'yesterday') {
        // if (moment(moment.tz('America/New_York')).day() === 1) {
        //   dispatch(fetchSiteMeticAction(userRole?.location, moment.tz('America/New_York').subtract(3, "day").format('YYYY-MM-DD'), moment.tz('America/New_York').format('YYYY-MM-DDTHH:mm:ss'), ''))
        // } else {
        dispatch(fetchSiteMeticAction(userRole?.location, moment.tz('America/New_York').subtract(1, "day").format('YYYY-MM-DD'), moment.tz('America/New_York').subtract(1, "day").format('YYYY-MM-DDTHH:mm:ss'), ''))
        // }
      }
    }
  }

  const renderLastRefreshed = () => {
    const refreshTime =  router.pathname === '/Manager/VPTB' ?  (lastVptbRefreshed || ""): lastRefreshed;
    return (
      <>
        {lastRefreshed && (
          <div className={dashboardHeaderStyle.refreshBtnTime}>Last Refreshed <br/>{refreshTime.split(" ")[0]} {refreshTime.split(" ")[1]} <br/> {refreshTime.split(" ")[2]} {refreshTime.split(" ")[3]}</div>
        )}
        
        <div className={isLoading ? dashboardHeaderStyle.refreshBtnDisabled : dashboardHeaderStyle.refreshBtn} onClick={refresh}>
          Refresh
        </div>
      </>
    )
  }

  return (
    <>
      {/* MODAL FOR CONFIRMATION */}
      {showCancelModal &&
        <Modal
          handleModalClose={() => setShowCancelModal(false)}
          handleConfirm={handleConfirmCancellation}
          modal_header={CONSTANTS.CANCEL_MODAL_HEADER}
          modal_content={CONSTANTS.CONFIRM_MODAL_CONTENT}
          isConfirm
          confirmBtnName={CONSTANTS.YES}
          isCancel
          cancelBtnName={CONSTANTS.NO}
        />
      }
      <div className={dashboardHeaderStyle.dashboardControlsWrapper}>
        {/* Production Line & Stall Number */}
        <div className={dashboardHeaderStyle.headerText}>
          {sectionHeader} {(userRole?.persona === 'team_member' && router.pathname !== '/Dashboard') ? <span className='font-semibold text-2xl text-blue1'> Stall {stall}</span> : ''}
        </div>
        {/* Date Filters */}
        <div className={dashboardHeaderStyle.rightSectionWrapper}>
          {/* Digital clock based on login location - LB(PST), Princeton(CST) */}
          {/* <div className={dashboardHeaderStyle.dateTimeText}>{clock.split(" ")[0]} {clock.split(" ")[1]} <br/>{clock.split(" ")[2]} {clock.split(" ")[3]}</div> */}
          {/* Refresh Last Refreshed Time */}
          {showToggle && userRole?.persona === 'manager'  && renderLastRefreshed()}
          {/* dateFilter LongBeach Manager*/}
          {renderEle === 'showFilter' && userRole?.location === 'LB' && router.pathname !== '/Manager/VPTB' && (
            <div className={dashboardHeaderStyle.toggleBtn}>
              {filterEle.map((item: any) => {
                return (
                  <button
                    key={item.name}
                    name={item.name}
                    value={item.value}
                    className={item.isActive ? dashboardHeaderStyle.btnActive : dashboardHeaderStyle.btnInActive}
                    onClick={() => handleDateFilter(item.value)}
                  >
                    {item.label}
                  </button>
                )
              })}
            </div>
          )}

          {/* dateFilter Princeton Manager*/}
          {renderEle === 'showFilter' && userRole?.location === 'PR' && (
            <div className={dashboardHeaderStyle.toggleBtn}>
              {filterElePTManager && filterElePTManager.map((item: any) => {
                return (
                  <button
                    key={item.name}
                    name={item.name}
                    value={item.value}
                    className={item.isActive ? dashboardHeaderStyle.btnActive : dashboardHeaderStyle.btnInActive}
                    onClick={() => handleDateFilterPrincetonManager(item.value)}
                  >
                    {item.label}
                  </button>
                )
              })}
            </div>
          )}

          {/* Team Member Toggle Hours/Vehicles */}
          {showToggle && userRole?.persona === 'team_member' && (
            <div className={dashboardHeaderStyle.toggleBtn}>
              {unitEleData && unitEleData.map((item: any) => {
                return (
                  <button
                    key={item.name}
                    name={item.name}
                    value={item.value}
                    className={item.isActive ? dashboardHeaderStyle.btnActive : dashboardHeaderStyle.btnInActive}
                    onClick={() => unitEleBtn(item.value)}
                  >
                    {item.label}
                  </button>
                )
              })}
            </div>
          )}

          {/* Manager Toggle Hours/Vehicles */}
          {showToggle && userRole?.persona === 'manager' && router.pathname !== '/Manager/VPTB'  &&
            (
              <div className={dashboardHeaderStyle.toggleBtn}>
                {managerToggleEle && managerToggleEle.map((item: any) => {
                  return (
                    <button
                      key={item.name}
                      name={item.name}
                      value={item.value}
                      className={item.isActive ? dashboardHeaderStyle.btnActive : dashboardHeaderStyle.btnInActive}
                      onClick={() => managerToggleBtn(item.value)}
                    >
                      {item.label}
                    </button>
                  )
                })}
              </div>
            )
          }
          {/* Cancel Button  */}
          {renderEle === 'showCancel' && (
            <button
              className={isCancelDisabled ? dashboardHeaderStyle.cancelBtnDisabled : dashboardHeaderStyle.cancelBtn}
              onClick={() => setShowCancelModal(true)}
              disabled={isCancelDisabled}
            >
              {CONSTANTS.CANCEL}
            </button>
          )}
        </div>
      </div>
    </>
  )
}
