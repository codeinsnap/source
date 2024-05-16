import Metrics from "@/components/Shared/Metrics";
import Table from "@/components/Shared/Table";
import SingleSelect from "@/components/Shared/SingleSelect/SingleSelect";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import momenttz from "moment-timezone";
import { fetchProductionLineMetricAction } from "@/store/actions/productionLineMetricAction";
import { Value } from "sass";
import { useRouter } from "next/router";
import { LineChart } from "recharts";
import LineChartGraph from "../SiteMetrics/LineChart";
import { CONSTANTS } from "@/constants/constants";
import { graphStyle } from "../SiteMetrics/GraphSection/graph_section_tailwind";
import { productionLineMetricStyle } from "./productionLineMetric_tailwind";
import { trimDownOneDecimal, trimUpOneDecimal } from '@/utility/formattingFunctions';
import SharedTable from "@/components/Shared/Table/SharedGrid/shared-table";
import { commonTableMetricStyle } from "@/components/Shared/Table/table_tailwind";
import Image from "next/image";
import { getDataFromIdleStalls, getLastInstalled, getStatusStatusData } from "./helper";

export default function ProductionLineMetricsWrapper() {
  const router = useRouter();


  const dispatch: any = useDispatch();
  const unitEle = useSelector((state: any) => state.siteMetricState.unitEle);
  const managerToggleEle = useSelector(
    (state: any) => state.siteMetricState.managerToggleEle
  );
  const metricDataHours = useSelector((state: any) => state.productionLineMetricState.productionLineMetric?.shopMetrics?.hours);

  const metricDataVehicles = useSelector((state: any) => state.productionLineMetricState.productionLineMetric?.shopMetrics?.vehicles);
  const shopNamesList = useSelector((state: any) => state.productionLineMetricState.productionLineMetric?.shopDictionary);
  const tableDataVehicles = useSelector((state: any) => state.productionLineMetricState.productionLineMetric?.progressSummary?.vehicles);
  const tableDataHours = useSelector((state: any) => state.productionLineMetricState.productionLineMetric?.progressSummary?.hours);
  const exceptionData = useSelector((state: any) => state.productionLineMetricState.productionLineMetric?.exceptionSummary);
  const progressAgainstPlanData = useSelector((state: any) => state.productionLineMetricState.productionLineMetric?.progressAgainstPlan);
  const defaultShopName = useSelector((state: any) => state.productionLineMetricState.productionLineMetric?.shop);
  const unit = managerToggleEle?.filter((item: any) => item.isActive)[0].name;
  const currentStallPerformance = 'Current Stall Performance';
  const stallPerformance = 'Stall Performance';
  const overallStallUtilization = 'Overall Stall Utilization';
  const overallProgress = 'Overall Progress';
  const currentStatus = 'Current Status';
  const status = 'Status';
  const stallList = useSelector((state: any) => state.productionLineMetricState.productionLineMetric?.stalls);
  const shiftDetails = useSelector((state: any) => state.productionLineMetricState.productionLineMetric?.ShiftDetails);
  const currentStallStatus = useSelector((state: any) => state.productionLineMetricState.productionLineMetric?.StallStatus);
  const stallLastInstalledVehicles = useSelector((state: any) => state.productionLineMetricState.productionLineMetric?.lastInstalledVehicle);
  const timeZone = useSelector((state: any) => state.productionLineMetricState.productionLineMetric?.timeZone);
  const apiDate = useSelector((state: any) => state.productionLineMetricState.productionLineMetric?.date);
  const DATE_TIME_FORMAT_HH_MM_SS = 'yyyy-MM-DD HH:mm:ss';

  const [shopName, setShopName] = useState(
    router.query?.keyword ? router.query.keyword : ''
  );
  //setting on-load deafult shop name
  useEffect(() => {
    setShopName(defaultShopName);
  }, [defaultShopName])


  //Time Elapsed
  const [prodLineTimeElapsed, setProdLineTimeElapsed] = useState('');
  const prodLineStartTime = '1697619539796';

  const activeTab = () => {
    return managerToggleEle.filter((i: any) => i.isActive)[0];
  };

  const activeDay = () => {
    return unitEle.filter((i: any) => i.isActive)[0].name.toUpperCase();
  };

  const renderMetrics = () => {
    if (activeTab().name === "vehicles") {
      return (
        <Metrics
          totalPlanned={trimDownOneDecimal(metricDataVehicles?.Planned)}
          totalCompleted={trimDownOneDecimal(metricDataVehicles?.Completed)}
          progress={trimDownOneDecimal(metricDataVehicles?.Progress)}
          estimate={metricDataVehicles?.OvertimeEstimate}
        />
      );
    }
    if (activeTab().name === "hours") {
      return (
        <Metrics
          totalPlanned={trimUpOneDecimal(metricDataHours?.Planned)}
          totalCompleted={trimUpOneDecimal(metricDataHours?.Completed)}
          progress={trimDownOneDecimal(metricDataHours?.Progress)}
          estimate={metricDataHours?.OvertimeEstimate}
        />
      );
    }
  };

  const getTableHeader = (data: any) => {
    if (data && data.length > 0) return Object.keys(data[0]);
  };

  const sortProgressSummary = (data: any) => {
    return data?.sort((p1: any, p2: any) => {
      p1 = Number(p1.Asset.split(" ")[1]);
      p2 = Number(p2.Asset.split(" ")[1]);
      return p1 - p2;
    });
  }

  /**
   * Function to Calculate current progress.
   * @param numerator
   * @param denominator
   * @returns
   */
  const calcCurrentProgress = (numerator: number, denominator: number): number => {
    return isNaN(numerator) || isNaN(denominator) ? 0 : denominator === 0 ? 100 : trimDownOneDecimal((numerator / denominator) * 100);
  }

  /**
   * Function to Generate the body for Progress Summary Table
   * @param tableData
   * @param showProgress
   * @returns
   */
  const tableBody = (tableData: Array<any>, showProgress: boolean) => {
    return <>
      {tableData && tableData.map((data: any, index: any) => {
        return (
          //  <div  className={`${buildingCardStyle.card} ${Number(completed) >= Number(marker) ? buildingCardStyle.cardGreyBorder : buildingCardStyle.cardRedBorder}`}></div>
          <tr
            key={data.Asset}
            className={`${commonTableMetricStyle.tBodyTr} ${commonTableMetricStyle.centerAlign} ${index % 2 === 0 ? "bg-grey3" : "bg-white"}`}

          >
            {activeTab().name === "hours" &&
              <>
                <td className={commonTableMetricStyle.tableDataAsset}>{data.Asset}</td>
                <td className={commonTableMetricStyle.tableDataAsset}>{`${isNaN(data.PlannedHours) ? 0 : data.PlannedHours}`}</td>
                <td className={commonTableMetricStyle.tableDataAsset}>{`${isNaN(data.CompletedToTimeHours) ? 0 : (data.CompletedToTimeHours)}`}</td>
                <td className={commonTableMetricStyle.tableDataAsset}>{`${isNaN(trimUpOneDecimal(data.stallUtilization)) ? 0 : trimUpOneDecimal(data.stallUtilization)}`} %</td>
                <td className={`${commonTableMetricStyle.tableDataAsset} group`}>
                  {`${isNaN(trimUpOneDecimal(data.stallPerformance)) ? 0 : trimDownOneDecimal(data.stallPerformance)}`} %
                  <div className='group/thtooltip absolute'>
                    <div className={productionLineMetricStyle.cardHoverHours}>
                      <div className={productionLineMetricStyle.dividerHours}></div>
                      <span className={productionLineMetricStyle.spanHover}>
                        <div className="flex justify-between" >
                          <pre>
                            <table>
                              <tr><td>Scheduled VINs</td>
                                <td> {`${isNaN(trimUpOneDecimal(data.plannedVinCount)) ? 0 : trimUpOneDecimal(data.plannedVinCount)}`}</td>
                              </tr>
                              <tr>
                                <td>Scheduled Hrs</td>
                                <td> {`${isNaN(trimUpOneDecimal(data.PlannedToTimeHours)) ? 0 : trimUpOneDecimal(data.PlannedToTimeHours)}`} </td>
                              </tr>
                              <tr>
                                <td>Completed VINs</td>
                                <td> {`${isNaN(trimUpOneDecimal(data.completedVinCount)) ? 0 : trimUpOneDecimal(data.completedVinCount)}`} </td>
                              </tr>
                              <tr>
                                <td>Completed Hrs</td>
                                <td> {`${isNaN(trimUpOneDecimal(data.CompletedToTimeHours)) ? 0 : trimUpOneDecimal(data.CompletedToTimeHours)}`} </td>
                              </tr>
                            </table>
                          </pre>
                        </div>
                      </span>
                    </div>
                  </div>
                </td>
              </>
            }
            {activeTab().name === "vehicles" &&
              <>
                <td className={commonTableMetricStyle.tableDataAsset}>{data.Asset}</td>
                <td className={commonTableMetricStyle.tableDataAsset}>{trimUpOneDecimal(data.Planned)}</td>
                <td className={commonTableMetricStyle.tableDataAsset}>{trimUpOneDecimal(data.Completed)}</td>
                <td className={`${commonTableMetricStyle.tableDataAsset} group`}>
                  <span className="min-w-[60px]">{trimDownOneDecimal(data.Progress)} %</span>
                </td>
                <td className={`${commonTableMetricStyle.tableDataAsset} group ${activeDay() === 'TODAY' ? 'pb-4' : 'pb-8'}`}>
                  {(activeDay() === 'TODAY') ?
                    (
                      <span className="mr-4 min-w-[60px]">
                        {`${calcCurrentProgress(data.CompletedToTime, data.PlannedToTime)}%   `}
                      </span>
                    ) : ''
                  }
                  <span className="group absolute">
                    {(activeDay() === 'TODAY' && (trimUpOneDecimal(data.CompletedToTime) >= trimUpOneDecimal(data.PlannedToTime))) || (activeDay() === 'YESTERDAY' && (trimDownOneDecimal(data.Progress) >= 100)) ?
                      (
                        <>
                          <Image
                            src='/images/icons/greenTick.svg'
                            width={18}
                            height={18}
                            alt="stall_status"
                            style={{ marginTop: 2 }}
                          />
                        </>
                      ) :
                      (<>
                        <Image
                          src='/images/icons/redTick.svg'
                          width={18}
                          height={18}
                          alt="stall_status"
                          style={{ marginTop: 2 }}
                        />
                      </>)
                    }
                    {showProgress && <div className={productionLineMetricStyle.cardHover}>
                      <div className={productionLineMetricStyle.divider}></div>
                      <span className={productionLineMetricStyle.spanHover}>
                        <div className="flex justify-between" >
                          <pre>Current </pre>
                          <pre>{`${isNaN(trimUpOneDecimal(data.CompletedToTime)) ? 0 : trimUpOneDecimal(data.CompletedToTime)}/${isNaN(trimUpOneDecimal(data.PlannedToTime)) ? 0 : trimUpOneDecimal(data.PlannedToTime)}`}</pre>
                        </div>
                      </span>
                    </div>}
                  </span>
                </td>
              </>
            }
          </tr>
        )
      })}
    </>
  };

  /**
   * Function to get the CSS class for the header tooltip
   * @param headerText  tableTitle
   * @returns string
   */
  const getCardHoverClassName = (headerText: string) => {
    let cssForHeaderToolTip = '';
    switch (headerText) {
      case currentStallPerformance:
        cssForHeaderToolTip = productionLineMetricStyle.cardHoverCurrentStallPerformance;
        break;
      case stallPerformance:
        cssForHeaderToolTip = productionLineMetricStyle.cardHoverStallPerformance;
        break;
      case overallStallUtilization:
        cssForHeaderToolTip = productionLineMetricStyle.cardHoverStallUtilization;
        break;
      case overallProgress:
        cssForHeaderToolTip = productionLineMetricStyle.cardHoverProgress;
        break;
      case status:
        cssForHeaderToolTip = productionLineMetricStyle.cardHoverStatus;
        break;
      case currentStatus:
        cssForHeaderToolTip = productionLineMetricStyle.cardHoverCurrentStatus;
        break;
    }
    return cssForHeaderToolTip;
  }

  /**
   * Function to get the CSS class for header tooltip
   * @param headerText  tableTitle
   * @returns string
   */
  const getCardDividerClassName = (headerText: string) => {
    let cssForHeaderToolTip = '';
    switch (headerText) {
      case currentStallPerformance:
        cssForHeaderToolTip = productionLineMetricStyle.dividerCurrentStallPerformance;
        break;
      case stallPerformance:
        cssForHeaderToolTip = productionLineMetricStyle.dividerStallPerformance;
        break;
      case overallStallUtilization:
        cssForHeaderToolTip = productionLineMetricStyle.dividerStallUtilization;
        break;
      case overallProgress:
        cssForHeaderToolTip = productionLineMetricStyle.dividerProgress;
        break;
      case status:
        cssForHeaderToolTip = productionLineMetricStyle.dividerStatus;
        break;
      case currentStatus:
        cssForHeaderToolTip = productionLineMetricStyle.dividerCurrentStatus;
        break;
    }
    return cssForHeaderToolTip;
  }

  const customHeaders = [currentStallPerformance, overallStallUtilization, overallProgress, stallPerformance, status, currentStatus]

  const isCustomHeader = useCallback((headerText: string) => {
    return customHeaders.indexOf(headerText) !== -1;
  }, [activeDay()]);

  const defineToolTip = (headerText: string) => {
    const toolTip = <div className={productionLineMetricStyle.spanHover}>
      <div className="flex justify-between" >
        <pre>
          {headerText === currentStallPerformance && activeDay() === 'TODAY' && <>(Scheduled Hrs at Point of Time/Vehicles Scheduled to be PQAd at Point of Time)/<br />(Completed PQAd Hrs at Point of time /compeleted Vehicles at Point of time)</>}
          {headerText === currentStallPerformance && activeDay() === 'YESTERDAY' && <>(Total Scheduled PQA Hrs/ Total Vehicles Scheduled)/<br />(Total Completed PQAd Hrs/Total Vehicles PQAd)</>}
          {headerText === overallStallUtilization && <> Completed Hrs./Total Scheduled Hrs. </>}
          {headerText === overallProgress && activeDay() === 'TODAY' && <>(Vehicles PQAd until this moment of time at Stall ) /<br /> (Total Vehicles planned to be PQAd Today at Stall)</>}
          {headerText === overallProgress && activeDay() === 'YESTERDAY' && <>(Vehicles PQAd Yesterday/Previous day at Stall) /<br /> (Total Vehicles planned to be PQAd Yesterday/Previous day at Stall)</>}
          {headerText === status && activeDay() === 'YESTERDAY' && <>(Vehicles PQAd Yesterday/Previous day at Stall) /<br /> (Total Vehicles planned to be PQAd Yesterday/Previous day at Stall)</>}
          {headerText === currentStatus && activeDay() === 'TODAY' && <>(Vehicles PQAd until this moment of time at Stall) /<br /> (Total Vehicles planned to be PQAd until this moment of time at Stall)</>}
        </pre>
      </div>
    </div>;
    return `${toolTip}`;

  }
  const getCustomHeaderContent = useCallback((headerText: string, _e: Event) => {
    var classNameValue = [overallProgress, currentStatus].includes(headerText) ? 'left-9' : 'left-20';
    return <>
      <th key={headerText} scope="col" className={"py-4 text-center text-grey4 font-normal group/thtooltip"}>
        {headerText} *
        <div className='group/thtooltip absolute'>
          <div className={getCardHoverClassName(headerText)}>
            <div className={getCardDividerClassName(headerText)}></div>
            <span className={productionLineMetricStyle.spanHover}>
              <div className="flex justify-between" >
                <pre>
                  {headerText === currentStallPerformance && activeDay() === 'TODAY' && <>(Scheduled Hrs at Point of Time/Vehicles Scheduled to be PQAd at Point of Time)/<br />(Completed PQAd Hrs at Point of time /compeleted Vehicles at Point of time)</>}
                  {headerText === stallPerformance && activeDay() === 'YESTERDAY' && <>(Total Scheduled PQA Hrs/ Total Vehicles Scheduled)/<br />(Total Completed PQAd Hrs/Total Vehicles PQAd)</>}
                  {headerText === overallStallUtilization && <> Completed Hrs./Total Scheduled Hrs. </>}
                  {headerText === overallProgress && activeDay() === 'TODAY' && <>(Vehicles PQAd until this moment of time at Stall ) / (Total Vehicles <br /> planned to be PQAd Today at Stall)</>}
                  {headerText === overallProgress && activeDay() === 'YESTERDAY' && <>(Vehicles PQAd Yesterday/Previous day at Stall) /<br /> (Total Vehicles planned to be PQAd Yesterday/Previous day at Stall)</>}
                  {headerText === status && activeDay() === 'YESTERDAY' && <>(Vehicles PQAd Yesterday/Previous day at Stall) /<br /> (Total Vehicles planned to be PQAd Yesterday/Previous day at Stall)</>}
                  {headerText === currentStatus && activeDay() === 'TODAY' && <>(Vehicles PQAd until this moment of time at Stall) /<br /> (Total Vehicles planned to be PQAd until this moment of time at Stall)</>}
                </pre>
              </div>
            </span>
          </div>
        </div>
      </th>
    </>
  }, [activeDay()]);

  const renderTable = () => {
    if (activeTab().name === "vehicles") {
      return (
        <div className="vehicles-progress-summary">
          <SharedTable
            tableData={sortProgressSummary(tableDataVehicles)}
            tableHeaders={[
              'Asset',
              'Planned',
              'Completed',
              overallProgress,
              activeDay() === 'YESTERDAY' ? status : currentStatus
            ]}
            isCustomHeader={isCustomHeader}
            getCustomHeaderContent={getCustomHeaderContent}
          // isProgessSummaryData={true}
          >
            {tableBody(sortProgressSummary(tableDataVehicles), activeDay()?.toUpperCase() === 'TODAY')}
          </SharedTable>
        </div>
      );
    }
    if (activeTab().name === "hours") {
      return (
        <div className="hours-progress-summary">
          <SharedTable
            tableData={sortProgressSummary(tableDataHours)}
            tableHeaders={[
              'Asset',
              'Scheduled Hrs',
              'Completed Hrs',
              overallStallUtilization,
              activeDay() === 'YESTERDAY' ? stallPerformance : currentStallPerformance
            ]}
            isCustomHeader={isCustomHeader}
            getCustomHeaderContent={getCustomHeaderContent}
          >{tableBody(sortProgressSummary(tableDataHours), activeDay()?.toUpperCase() === 'TODAY')}</SharedTable>
        </div>
      );
    }
  };

  // const exceptionData = [{reason: 'DAMAGED VEHICLES - S0 STATUS', count: 1}, {reason: 'CHRONIC HOLD VEHICLES - T0 STATUS', count: 2}, {reason: 'PARTS SHORTAGE - C8 STATUS', count: 12},{reason: 'DAMAGED VEHICLES - S0 STATUS', count: 1}, {reason: 'CHRONIC HOLD VEHICLES - T0 STATUS', count: 2}, {reason: 'PARTS SHORTAGE - C8 STATUS', count: 12}]

  const renderExceptionTable = () => {
    if (activeTab().name === "vehicles") {
      return (
        <Table
          tableData={exceptionData.sort((p1: any, p2: any) => p1.reason.localeCompare(p2.reason))}
          tableHeaders={["Reason", "Count"]}
          isExceptionSummaryData={true}
        />
      );
    }
  };


  // const metricsData = [
  //   {id: 1, value: "40%", label: "Today's Progress" },
  //   {id: 2, value: "100", label: "Total Planned" },
  //   {id: 3, value: "40", label: "Total Complete" },
  //   {id: 4, value: "No OT", label: "Expected Overtime" },
  // ];

  // const options = [
  //   {value: "Hoist (D)", label: "Hoist (D)" },
  //   {value: "Wheel (A1)", label: "Wheel (A1)" },
  //   {value: "Align (A2)", label: "Align (A2)" },
  //   {value: "Roof (E)", label: "Roof (E)" },
  //   {value: "Bay (B)", label: "Bay (B)" },
  //   {value: "Bay (C)", label: "Bay (C)" },
  //   {value: "Bay (F1)", label: "Bay (F1)" },
  //   {value: "Bay (F2)", label: "Bay (F2)" },
  // ];

  const tableDataDummy = [
    {
      Asset: "Stall1",
      Planned: "5.2",
      Completed: "2.1",
      Remaining: "3.1",
      Progress: "40%",
    },
    {
      Asset: "Stall2",
      Planned: "5.0",
      Completed: "2.0",
      Remaining: "3.1",
      Progress: "40%",
    },
    {
      Asset: "Stall3",
      Planned: "5.5",
      Completed: "2.2",
      Remaining: "3.1",
      Progress: "40%",
    },
    {
      Asset: "Stall4",
      Planned: "5.5",
      Completed: "2.2",
      Remaining: "3.1",
      Progress: "40%",
    },
    {
      Asset: "Stall1",
      Planned: "5.2",
      Completed: "2.1",
      Remaining: "3.1",
      Progress: "40%",
    },
    {
      Asset: "Stall2",
      Planned: "5.0",
      Completed: "2.0",
      Remaining: "3.1",
      Progress: "40%",
    },
    {
      Asset: "Stall3",
      Planned: "5.5",
      Completed: "2.2",
      Remaining: "3.1",
      Progress: "40%",
    },
    {
      Asset: "Stall4",
      Planned: "5.5",
      Completed: "2.2",
      Remaining: "3.1",
      Progress: "40%",
    },
    {
      Asset: "Stall1",
      Planned: "5.2",
      Completed: "2.1",
      Remaining: "3.1",
      Progress: "40%",
    },
    {
      Asset: "Stall2",
      Planned: "5.0",
      Completed: "2.0",
      Remaining: "3.1",
      Progress: "40%",
    },
    {
      Asset: "Stall3",
      Planned: "5.5",
      Completed: "2.2",
      Remaining: "3.1",
      Progress: "40%",
    },
    {
      Asset: "Stall4",
      Planned: "5.5",
      Completed: "2.2",
      Remaining: "3.1",
      Progress: "40%",
    },
  ];
  const emptyStallData = {
    "asset": "",
    "stall": "",
    "planned_start_time": "",
    "actual_start_time": "",
    "std_install_time": "",
    "timeZone": "America/Los_Angeles"
  }

  // returns the shift end time
  const getShiftEndTime = (shiftInfo: any) => {
    const shiftTime = shiftInfo?.shiftTime;
    if (shiftTime && shiftTime.end) {
      const shiftEndTime = moment.tz(apiDate + ' ' + shiftTime.end, DATE_TIME_FORMAT_HH_MM_SS, timeZone);
      return shiftEndTime;
    }
    return moment.tz(timeZone);
  }

  // returns the shift start time
  const getShiftStartTime = (shiftInfo: any) => {
    const shiftTime = shiftInfo?.shiftTime;
    if (shiftTime && shiftTime.start) {
      const shiftStartTime = moment.tz(apiDate + ' ' + shiftTime.start, DATE_TIME_FORMAT_HH_MM_SS, timeZone);
      return shiftStartTime;
    }
    return moment.tz(timeZone);
  }

  //This will return true if the current time falls between the shift start and end time
  const isShiftInProgress = (shiftInfo: any) => {
    const shiftTime = shiftInfo?.shiftTime;
    const currentTime = moment.tz(timeZone);
    if (shiftTime && shiftTime.start && shiftTime.end) {
      const shiftStartTime = moment.tz(apiDate + ' ' + shiftTime.start, DATE_TIME_FORMAT_HH_MM_SS, timeZone);
      const shiftEndTime = moment.tz(apiDate + ' ' + shiftTime.end, DATE_TIME_FORMAT_HH_MM_SS, timeZone);
      return currentTime > shiftStartTime && currentTime < shiftEndTime;
    }
    return false;
  }

  //This will return true if the current time falls between any of the breaks start time and end time
  const isBreakInProgress = (shiftInfo: any) => {
    const currentTime = moment.tz(timeZone);
    const shiftBreaks = shiftInfo?.breaks;
    let isBreak = false;
    if (shiftBreaks && Array.isArray(shiftBreaks)) {
      shiftBreaks.forEach((breakInfo: any) => {
        const breakStartTime = moment.tz(apiDate + ' ' + breakInfo.breakStart, DATE_TIME_FORMAT_HH_MM_SS, timeZone);
        const breakEndTime = moment.tz(apiDate + ' ' + breakInfo.breakEnd, DATE_TIME_FORMAT_HH_MM_SS, timeZone);
        isBreak = isBreak || (currentTime > breakStartTime && currentTime < breakEndTime);
      });
    }
    return isBreak;
  }
  //This will return the total breaks duration that falls with in the start time and current time
  const getTotalBreakTime = (startTime: string, shiftInfo: any) => {
    const currentTime = moment.tz(timeZone);
    const installStartTime = moment.tz(apiDate + ' ' + startTime, DATE_TIME_FORMAT_HH_MM_SS, timeZone);
    const shiftEndTime = getShiftEndTime(shiftInfo);
    const endTime = currentTime > shiftEndTime ? shiftEndTime : currentTime;
    const shiftBreaks = shiftInfo?.breaks;
    let totalBreakDuration = 0;
    if (shiftBreaks && Array.isArray(shiftBreaks)) {
      shiftBreaks.forEach((breakInfo: any) => {
        const breakStartTime = moment.tz(apiDate + ' ' + breakInfo.breakStart, DATE_TIME_FORMAT_HH_MM_SS, timeZone);
        const breakEndTime = moment.tz(apiDate + ' ' + breakInfo.breakEnd, DATE_TIME_FORMAT_HH_MM_SS, timeZone);
        if (installStartTime < breakStartTime && endTime > breakEndTime) {
          totalBreakDuration = totalBreakDuration + breakInfo.breakDuration
        }
      });
    }
    return totalBreakDuration;
  }

  // returns the break start time if the break is in progress. This is used to calculate elapsed time until the break start time.
  const getCurrentBreakStartTime = (shiftInfo: any) => {
    const currentTime = moment.tz(timeZone);
    const shiftBreaks = shiftInfo?.breaks;
    let inProgressBreakStartTime = currentTime;
    if (shiftBreaks && Array.isArray(shiftBreaks)) {
      shiftBreaks.forEach((breakInfo: any) => {
        const breakStartTime = moment.tz(apiDate + ' ' + breakInfo.breakStart, DATE_TIME_FORMAT_HH_MM_SS, timeZone);
        const breakEndTime = moment.tz(apiDate + ' ' + breakInfo.breakEnd, DATE_TIME_FORMAT_HH_MM_SS, timeZone);
        if (breakStartTime < currentTime && currentTime < breakEndTime) {
          inProgressBreakStartTime = breakStartTime;
        }
      });
    }
    return inProgressBreakStartTime;
  }

  // This will return the list of stalls to be shown in ui
  const getFinalStallStaus = (stallList: any, shiftInfo: any, stallStatusData: any, lastInstalled: any, isCurrentDay: boolean) => {
    if (!isCurrentDay) return [];
    let idleStalls = stallList && Array.isArray(stallList) ? [...stallList] : [];
    const shiftInProgress = isShiftInProgress(shiftInfo);
    const breakInProgress = isBreakInProgress(shiftInfo);
    let updatedStallStatusData: any[] = [];
    const currentTime = moment.tz(timeZone);
    const shiftEndTime = getShiftEndTime(shiftInfo);
    const shiftStartTime = getShiftStartTime(shiftInfo);
    // assume that elapsed time is until current time
    let elapsedToTime = currentTime;
    // if break is in progress, elapsed time should will be untill the break start time
    elapsedToTime = breakInProgress ? getCurrentBreakStartTime(shiftInfo) : elapsedToTime;
    // if shift ended, elapsed time should will be untill the shift end time
    // elapsedToTime = !shiftInProgress && afterShiftEndTime ? shiftEndTime : elapsedToTime;
    
    const stallStatus = getStatusStatusData( updatedStallStatusData, stallStatusData, idleStalls, getTotalBreakTime,
      {apiDate, DATE_TIME_FORMAT_HH_MM_SS, elapsedToTime, timeZone, shiftInfo, breakInProgress, shiftInProgress});
    updatedStallStatusData = stallStatus.updatedStallStatusData;
    idleStalls = stallStatus.idleStalls;

    if (!shiftInProgress) {
      idleStalls.forEach((stallNo) => {
        let stallData = {
          ...emptyStallData,
          stall: stallNo,
          elapsed_duration: '',
          stall_status: 'grey'
        }
        updatedStallStatusData.push(stallData);
      });
      return updatedStallStatusData.sort((p1: any, p2: any) => {
        p1 = Number(p1.stall);
        p2 = Number(p2.stall);
        return p1 - p2;
      });
    }

    const lastInstalledData = getLastInstalled(updatedStallStatusData, lastInstalled, idleStalls, getTotalBreakTime,
      {apiDate, DATE_TIME_FORMAT_HH_MM_SS, elapsedToTime, emptyStallData, shiftInfo, breakInProgress, shiftInProgress, timeZone, shiftStartTime}
    )
    updatedStallStatusData = lastInstalledData.updatedStallStatusData;
    idleStalls = lastInstalledData.idleStalls;

    //add all the remaining idle stalls without elapsed time to the array
    const idleStallData = getDataFromIdleStalls(updatedStallStatusData, idleStalls, getTotalBreakTime, 
      {elapsedToTime, shiftStartTime, shiftInfo, emptyStallData, breakInProgress, shiftInProgress}
    )
    updatedStallStatusData = idleStallData.updatedStallStatusData;
    idleStalls = idleStallData.idleStalls;

    //sort the stalls in ascending order and return
    return updatedStallStatusData.sort((p1: any, p2: any) => {
      p1 = Number(p1.stall);
      p2 = Number(p2.stall);
      return p1 - p2;
    });
  }

  const stallStatusTableBody = (stallList: any, shiftInfo: any, stallStatusData: any, lastInstalled: any, isCurrentDay: boolean) => {
    // bg-gray-400, 
    const stallData = getFinalStallStaus(stallList, shiftInfo, stallStatusData, lastInstalled, isCurrentDay);
    return <>
      {stallData?.map((data: any, index: any) => {
        return (
          <tr
            key={data.Asset}
            className={`${commonTableMetricStyle.tBodyTr} ${index % 2 === 0 ? "bg-grey3 text-center" : "bg-white text-center"}`}
          >
            <td className={commonTableMetricStyle.tableData}>
              <div className={`text-center ${data.stall_status === 'yellow' && 'bg-yellow-200'} ${data.stall_status === 'grey' && 'bg-slate-400'} ${data.stall_status === 'green' && 'bg-green-600'}`}>
                {`Stall ${data['stall']}`}
              </div>
            </td>
            <td className={commonTableMetricStyle.tableData}>
              <div className={`${commonTableMetricStyle.stallStatusFlagMargin} ${"flex justify-center items-center"}`}>
                {data['asset_status'] === 'green' &&
                  (
                    <>
                      <Image
                        src='/images/green.png'
                        width={80}
                        height={50}
                        alt="stall_status"
                      />
                    </>
                  )}
                {data['asset_status'] === 'red' &&
                  <>
                    <Image
                      src='/images/red.png'
                      width={80}
                      height={50}
                      alt="stall_status"
                    />
                  </>

                }
              </div>
              <div className={`${commonTableMetricStyle.stallStatusFlagMargin} `}>
                {data['asset']}
              </div>
            </td>
            <td className={commonTableMetricStyle.tableData}>{data['planned_start_time']}</td>
            <td className={commonTableMetricStyle.tableData}>{data['actual_start_time']}</td>
            <td className={commonTableMetricStyle.tableData}>{data['std_install_time']}</td>
            <td className={commonTableMetricStyle.tableData}>{data['elapsed_duration']}</td>
          </tr>
        )
      })}
    </>
  }

  const userRole = useSelector(
    (state: any) => state.authenticationState.userRole
  );

  // const handleShopChange = (name: string, selectedValue: string) => {
  //   console.log("handleShopChange");
  // };

  const getProductionLineMetricData = (shopNameSelected: any) => {
    dispatch(
      fetchProductionLineMetricAction(
        moment.tz("America/Los_Angeles").format('YYYY-MM-DD'),
        shopNameSelected,
        activeDay(),
        userRole?.location
      )
    );
  };

  useEffect(() => {
    if (shopNamesList && shopNamesList.length > 0) {
      const defaultShopName: any = shopNamesList[0];
      dispatch(
        fetchProductionLineMetricAction(
          moment.tz("America/Los_Angeles").format('YYYY-MM-DD'),
          shopName,
          activeDay(),
          userRole?.location
        )
      );
    }
    // dispatch(fetchProductionLineMetricAction(moment.tz("America/Los_Angeles").format("YYYYMMDD"),"A1",activeDay() , userRole?.location));
  }, [unitEle]);

  const updatedShopName = (event: any) => {
    getProductionLineMetricData(event.target.value);
    setShopName(event.target.value);
    router.push({ query: { keyword: event.target.value } });
  };

  useEffect(() => {
    console.log(router.query);
    dispatch(
      fetchProductionLineMetricAction(
        moment.tz("America/Los_Angeles").format('YYYY-MM-DD'),
        shopName,
        activeDay(),
        userRole?.location
      )
    );
  }, []);


  //Auto Refresh
  // useEffect(() => {
  //   const timerID = setInterval(() => getProductionLineMetricData(shopName), 30000);
  //   return () => {
  //     clearInterval(timerID);
  //   };
  // }, [])

  //Timer Elapsed
  // useEffect(() => {
  //   const timerID = setInterval(() => setProdLineTimeElapsed(((Number(moment.tz('America/Los_Angeles').valueOf()) - Number(prodLineStartTime)) / (1000 * 60)).toFixed()), 1000);
  //   return () => {
  //     clearInterval(timerID);
  //   };
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);


  return (
    <>
      <div className={productionLineMetricStyle.productionLineMainWrapper}>
        <div className={productionLineMetricStyle.productionLineSubWrapper}>
          <div className={productionLineMetricStyle.productionLineMetricsWrapper}>
            <div className={productionLineMetricStyle.productionLineDropdownWrapper}>
              <div className={productionLineMetricStyle.productionLineShopName}>Line</div>
              <div className={productionLineMetricStyle.productionLineDropdownHeader}>
                <select
                  onChange={updatedShopName}
                  defaultValue={shopName}
                  value={shopName}
                  className={productionLineMetricStyle.productionLineDropdown}
                >
                  <option value="" disabled selected>Select Shop Name</option>
                  {shopNamesList &&
                    shopNamesList.map((ele: any) => (
                      <option key={ele} value={ele}>
                        {ele}
                      </option>
                    ))}
                </select>
              </div>
            </div>
            <div className={productionLineMetricStyle.productionLineMetricWrapper}>
              <div className={productionLineMetricStyle.productionLineMetricSubWrapper}>
                <div className={productionLineMetricStyle.productionLineMetricsFont}>
                  Metrics ({activeTab().label})
                </div>
                {renderMetrics()}
              </div>
            </div>
          </div>
          {/* <div className="bg-white mr-8 px-4 py-8">
            <LineChartGraph data={progressAgainstPlanData?.vehicles} unit='Vehicles' />
          </div> */}

          {/*Line Chart for LongBeach Manager Screen*/}
          <div className={productionLineMetricStyle.productionLineChartWrapper}>
            {userRole?.location === "LB" && (
              <div className={graphStyle.background}>
                <div className={graphStyle.progress}>
                  {CONSTANTS.PROGRESS_AGAINST_PLAN}
                </div>
                {unit === "vehicles" && (
                  <LineChartGraph
                    data={progressAgainstPlanData?.vehicles}
                    unit="Vehicles"
                  />
                )}
                {unit === "hours" && (
                  <LineChartGraph
                    data={progressAgainstPlanData?.hours}
                    unit="Hours"
                  />
                )}
              </div>
            )}
          </div>

          <div className={activeTab().name == 'vehicles' ? productionLineMetricStyle.productionLineProgressExceptionSummaryOuterWrapper : productionLineMetricStyle.productionLineProgressSummaryOuterWrapper}>
            <div className={`${productionLineMetricStyle.productionLineProgressSummaryWrapper} ${exceptionData ? 'col-span-3' : 'col-span-5'}`}>
              <div className={productionLineMetricStyle.productionLineProgressSummaryHeader}>
                Progress Summary
              </div>
              {renderTable()}

            </div>
            {activeTab().name == 'vehicles' && exceptionData && <div className={`${productionLineMetricStyle.productionLineProgressSummaryWrapper} lg:col-span-2 md:col-span-5`}>
              <div className={productionLineMetricStyle.productionLineProgressSummaryHeader}>
                Exception Summary
              </div>
              {renderExceptionTable()}
            </div>}
          </div>
        </div>
        <div className={productionLineMetricStyle.productionLineStallStatus}>
          <div className={productionLineMetricStyle.productionLineStallStatusHeader}>
            Current Stall Status
          </div>
          {/* <div className={productionLineMetricStyle.productionLineMetricsFont}>{` ${CONSTANTS.TIME_ELASPED} ${prodLineTimeElapsed && Math.floor((Number(prodLineTimeElapsed) / 60))} H  ${Number(prodLineTimeElapsed)} MIN `}</div> */}
          <div className="">
            <SharedTable
              isCustomHeader={isCustomHeader}
              getCustomHeaderContent={getCustomHeaderContent}
              tableHeaders={[
                "Stall",
                "Asset",
                "Planned Start Time",
                "Actual Start Time",
                "Std install time",
                "Elapsed Time",
              ]}
            >
              {stallStatusTableBody(stallList, shiftDetails, currentStallStatus, stallLastInstalledVehicles, activeDay() === 'TODAY')}
            </SharedTable>
          </div>
        </div>
      </div>
    </>
  );
}