import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TeamMemberDropdown from '@/components/TeamMember/TeamMemberDropdown';
import { CONSTANTS } from '@/constants/constants';
import Modal from '@/components/Shared/Modal';
import { removeUserAction, removeItemId } from '@/store/actions/usersAction';
import ProgressBar from '@/components/Shared/ProgressBar';
import { useMsal } from '@azure/msal-react';
import { webAppConfig } from '@/utility/webAppConfig';
import { teamMemberStallStyle } from './team_member_stall_info_tailwind';

export default function TeamMemberStallInfo() {
  const dispatch: any = useDispatch();

  const { accounts } = useMsal();

  const [showModal, setShowModal] = useState(false);

  const element = useSelector((state: any) => state.vinState.element);
  const removeId = useSelector((state: any) => state.usersState.removeId);
  const selectedValue = useSelector((state: any) => state.usersState.selectedUsers);
  const profileData = useSelector((state: any) => state.profileState.profileData);
  const unitEleData = useSelector((state: any) => state.profileState.unitEle);
  const userRole = useSelector((state: any) => state.authenticationState.userRole);

  const handleRemoveConfirmation = () => {
    dispatch(removeUserAction(removeId, userRole?.location));
    dispatch(removeItemId(""))
    setShowModal(false);
  }

  const getTeamMemberName = (code: any) => {
    return selectedValue?.filter((item: any) => item.code === code)[0].names.replace(/,/g, "");
  }

  const getHoursMinutes = (actual: any) => {
    let numToString = actual?.toString();
    let splittedTextAfterDecimal = numToString?.split('.')[1];
    if (Number.isSafeInteger(actual)) {
      return actual + " " + 'hr';
    }
    else if (splittedTextAfterDecimal?.length == 2) {
      let hours = Math.floor(actual);
      let hoursInMinute = Number(splittedTextAfterDecimal * 60) / 100;
      return hours + " " + 'hr' + " " + Math.round(hoursInMinute) + " " + 'min';
    }
    else {
      let hours = Math.floor(actual);
      let hoursInMinute = Number(splittedTextAfterDecimal * 60) / 10;;
      return hours + " " + 'hr' + " " + Math.round(hoursInMinute) + " " + 'min';
    }
  }
  return (
    <>
      {/* Show modal to confirm remove Workday Id */}
      {showModal && (
        <Modal
          handleModalClose={() => { setShowModal(false); dispatch(removeItemId("")); }}
          handleConfirm={handleRemoveConfirmation}
          modal_header={`${CONSTANTS.REMOVE_TEAM_MEMBER_MODAL_HEADER} ${getTeamMemberName(removeId)} (${removeId})?`}
          modal_content={CONSTANTS.REMOVE_TEAM_MEMBER_MODAL_CONTENT}
          isConfirm
          confirmBtnName={CONSTANTS.REMOVE}
          isCancel
          cancelBtnName={CONSTANTS.CANCEL}
        />
      )}
      <div className={teamMemberStallStyle.wrapper}>
        {/* User dropdown */}
        <div className={teamMemberStallStyle.headingWrapper}>
          <div className={teamMemberStallStyle.heading}>{CONSTANTS.TEAM_MEMBER_AT_STALL}</div>
          <TeamMemberDropdown
            isDisabled={element === 'vin_table'}
            setShowModal={setShowModal}
            isSearchable
            isMulti
            placeHolder={CONSTANTS.SELECT_TEAM_MEMBER}
          />
        </div>
        <div className={teamMemberStallStyle.progressBarOuterWrapper}>
          <div className={teamMemberStallStyle.progressBarInnerWrapper}>
            <div className={teamMemberStallStyle.progressBarHeading}>
              {CONSTANTS.STALL_PROGRESS_CURRENT_SHIFT}
            </div>
            <div className={teamMemberStallStyle.progressWrapper}>
              <div className={teamMemberStallStyle.progressSpan}>
                {webAppConfig?.team_member[userRole?.location]?.progressBar &&
                  (unitEleData && unitEleData?.length > 0) && unitEleData.map((item: any) => {
                    if (item.value === 'vehicles' && item.isActive) {
                      return <ProgressBar
                        key={item.name}
                        actual={profileData?.stall_progress?.actual_vehicles}
                        progress={profileData?.stall_progress?.progressVehicles}
                        markerInUnits={profileData?.stall_progress?.markerInUnits}
                        highlighterPositionInUnits={profileData?.stall_progress?.highlighterPositionInUnits}
                      />
                    }
                    else if (item.value === 'hours' && item.isActive) {
                      return <ProgressBar
                        key={item.name}
                        actual={getHoursMinutes(profileData?.stall_progress?.actual_Hours)}
                        progress={profileData?.stall_progress?.progressHours}
                        markerInUnits={profileData?.stall_progress?.markerInHours}
                        highlighterPositionInUnits={profileData?.stall_progress?.highlighterPositionInHours}
                      />
                    }
                  })
                }
                {webAppConfig?.team_member[userRole?.location]?.progressActual &&
                  (unitEleData && unitEleData?.length > 0) && unitEleData.map((item: any) => {
                    if (item.value === 'vehicles' && item.isActive) {
                      return <ProgressBar
                        key={item.name}
                        actual={profileData?.stall_progress?.actual_vehicles}
                      />
                    }
                    else if (item.value === 'hours' && item.isActive) {
                      return <ProgressBar
                        key={item.name}
                        actual={getHoursMinutes(profileData?.stall_progress?.actual_Hours)}
                      />
                    }
                  })
                }
              </div>
              <div className={teamMemberStallStyle.progressBarFont}>
                {webAppConfig?.team_member[userRole?.location]?.progressPlanned &&
                  (unitEleData && unitEleData?.length > 0) && unitEleData.map((item: any) => {
                    if (item.value === 'vehicles' && item.isActive) {
                      return profileData?.stall_progress?.planned_vehicles
                    }
                    else if (item.value === 'hours' && item.isActive) {
                      return getHoursMinutes(profileData?.stall_progress?.planned_Hours)
                    }
                  })
                }
              </div>
            </div>
          </div>
          <div className={teamMemberStallStyle.progressBarOpacity}></div>
          <div className={teamMemberStallStyle.progressBarInnerWrapper}>
            <div className={teamMemberStallStyle.progressBarHeading}>
              {CONSTANTS.SHOP_PROGRESS_CURRENT_SHIFT}
            </div>
            <div className={teamMemberStallStyle.progressWrapper}>
              <div className={teamMemberStallStyle.progressSpan}>
                {webAppConfig?.team_member[userRole?.location]?.progressBar &&
                  (unitEleData && unitEleData.length > 0) && unitEleData.map((item: any) => {
                    if (item.value === 'vehicles' && item.isActive) {
                      return <ProgressBar
                        key={item.name}
                        actual={profileData?.shop_progress?.actual_vehicles}
                        progress={profileData?.shop_progress?.progressVehicles}
                        markerInUnits={profileData?.shop_progress?.markerInUnits}
                        highlighterPositionInUnits={profileData?.shop_progress?.highlighterPositionInUnits}
                      />
                    }
                    else if (item.value === 'hours' && item.isActive) {
                      return <ProgressBar
                        key={item.name}
                        actual={getHoursMinutes(profileData?.shop_progress?.actual_Hours)}
                        progress={profileData?.shop_progress?.progressHours}
                        markerInUnits={profileData?.shop_progress?.markerInHours}
                        highlighterPositionInUnits={profileData?.shop_progress?.highlighterPositionInHours}
                      />
                    }
                  })
                }
                {webAppConfig?.team_member[userRole?.location]?.progressActual &&
                  (unitEleData && unitEleData.length > 0) && unitEleData.map((item: any) => {
                    if (item.value === 'vehicles' && item.isActive) {
                      return <ProgressBar
                        key={item.name}
                        actual={profileData?.shop_progress?.actual_vehicles}
                      />
                    }
                    else if (item.value === 'hours' && item.isActive) {
                      return <ProgressBar
                        key={item.name}
                        actual={getHoursMinutes(profileData?.shop_progress?.actual_Hours)}
                      />
                    }
                  })
                }
              </div>
              <div className={teamMemberStallStyle.progressBarFont}>
                {webAppConfig?.team_member[userRole?.location]?.progressPlanned &&
                  (unitEleData && unitEleData.length > 0) && unitEleData.map((item: any) => {
                    if (item.value === 'vehicles' && item.isActive) {
                      return profileData?.shop_progress?.planned_vehicles
                    }
                    else if (item.value === 'hours' && item.isActive) {
                      return getHoursMinutes(profileData?.shop_progress?.planned_Hours)
                    }
                  })
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
