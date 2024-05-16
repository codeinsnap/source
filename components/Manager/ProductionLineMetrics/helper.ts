import moment from "moment";

export const getStatusStatusData = (updatedStallStatusData:any, stallStatusData:any, idleStalls:any, getTotalBreakTime:any, data:any) => {
    const {
        apiDate, DATE_TIME_FORMAT_HH_MM_SS, elapsedToTime, timeZone, shiftInfo,
        breakInProgress, shiftInProgress
    } = data;
    stallStatusData?.forEach((stallStatus: any, index: number) => {
        // remove the stalls that has status from the idle stalls
        idleStalls.splice(idleStalls.indexOf(stallStatus.stall), 1);
        // calculate the elapsed time
        const actualStartTime = moment.tz(apiDate + ' ' + stallStatus.actual_start_time, DATE_TIME_FORMAT_HH_MM_SS, timeZone);      
        const stdInstallTime = moment.tz(apiDate + ' ' + stallStatus.std_install_time, DATE_TIME_FORMAT_HH_MM_SS, timeZone);
        const zeroTime = moment.tz(apiDate + ' ' + "00:00:00", DATE_TIME_FORMAT_HH_MM_SS, timeZone);
        const stdInstallDuration = moment.duration(stdInstallTime.diff(zeroTime));
        const elapsedTime = elapsedToTime.diff(actualStartTime);
        const totalBreakDuration = getTotalBreakTime(stallStatus.actual_start_time, shiftInfo);
        const elapsedDuration = elapsedTime > 0 ? moment.duration(moment.duration(elapsedTime).subtract(totalBreakDuration, 'm').asMilliseconds()) : moment.duration(0);
        const roundedMinutes = elapsedDuration.seconds() > 30 ? elapsedDuration.minutes() + 1 : elapsedDuration.minutes();
        stallStatus.asset_status = elapsedDuration > stdInstallDuration ? 'red' : 'green'
        stallStatus.elapsed_duration = `${elapsedDuration.hours()}H ${roundedMinutes}M`;
        stallStatus.std_install_duration = stdInstallDuration.hours() + 'H ' + stdInstallDuration.minutes() + 'M ' + stdInstallDuration.seconds() + 'S';
        stallStatus.stall_status = breakInProgress || !shiftInProgress ? 'grey' : 'green';
        stallStatus.stall_status = !shiftInProgress && stallStatus.asset ? 'green' : stallStatus.stall_status;
        updatedStallStatusData.push(stallStatus);
      });
    return {updatedStallStatusData, idleStalls}
}

export const getLastInstalled = (updatedStallStatusData:any, lastInstalled:any, idleStalls:any, getTotalBreakTime:any, data:any) =>{
    const {apiDate, DATE_TIME_FORMAT_HH_MM_SS, elapsedToTime, emptyStallData, shiftInfo, breakInProgress, shiftInProgress, timeZone, shiftStartTime} = data;
    lastInstalled?.forEach((stallLastInstallData: any) => {
        if (idleStalls.indexOf(stallLastInstallData.stall) > -1) {
          // this stall does not have any VIN at present
          const lastInstallTime = moment.tz(apiDate + ' ' + stallLastInstallData.actual_end_time, DATE_TIME_FORMAT_HH_MM_SS, timeZone);
          const totalBreakDuration = getTotalBreakTime(stallLastInstallData.actual_end_time, shiftInfo);
          const elapsedTime = lastInstallTime < shiftStartTime ? elapsedToTime.diff(shiftStartTime) : elapsedToTime.diff(lastInstallTime);
          const elapsedDuration = elapsedTime > 0 ? moment.duration(elapsedTime).subtract(totalBreakDuration, 'm') : moment.duration(0);
          const roundedMinutes = elapsedDuration.seconds() > 30 ? elapsedDuration.minutes() + 1 : elapsedDuration.minutes();
          let stallData = {
            ...emptyStallData,
            stall: stallLastInstallData.stall,
            elapsed_duration: `${elapsedDuration.hours()}H ${roundedMinutes}M`,
            stall_status: breakInProgress || !shiftInProgress ? 'grey' : 'yellow'
          }
          updatedStallStatusData.push(stallData);
          idleStalls.splice(idleStalls.indexOf(stallLastInstallData.stall), 1);
        }
      });
      return {updatedStallStatusData, idleStalls }
}

export const getDataFromIdleStalls = (updatedStallStatusData:any, idleStalls:any, getTotalBreakTime:any, data:any) => {
    const {elapsedToTime, shiftStartTime, shiftInfo, emptyStallData, breakInProgress, shiftInProgress} = data;
    idleStalls.forEach((stallNo: any) => {
        const elapsedTime = elapsedToTime.diff(shiftStartTime);
        const totalBreakDuration = getTotalBreakTime(shiftStartTime.format("HH:mm:ss"), shiftInfo);
        const elapsedDuration = elapsedTime > 0 ? moment.duration(elapsedTime).subtract(totalBreakDuration, 'm') : moment.duration(0);
        const roundedMinutes = elapsedDuration.seconds() > 30 ? elapsedDuration.minutes() + 1 : elapsedDuration.minutes();
        let stallData = {
          ...emptyStallData,
          stall: stallNo,
          elapsed_duration: `${elapsedDuration.hours()}H ${roundedMinutes}M`,
          stall_status: breakInProgress || !shiftInProgress ? 'grey' : 'yellow'
        }
        updatedStallStatusData.push(stallData);
      });
      return {updatedStallStatusData, idleStalls};
}