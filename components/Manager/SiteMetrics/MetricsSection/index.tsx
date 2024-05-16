import Metrics from '@/components/Shared/Metrics';
import React, { useState, useEffect } from 'react'
import { metricSectionStyle } from './metrics_section_tailwind';
import { CONSTANTS } from '@/constants/constants';
import { useSelector } from 'react-redux';
import { webAppConfig } from '@/utility/webAppConfig';
import { trimDownOneDecimal, trimUpOneDecimal } from '@/utility/formattingFunctions';

export default function MetricsSection() {
  const metricsData = useSelector((state: any) => state.siteMetricState?.siteMetric?.metrics);
  const managerToggleData = useSelector((state: any) => state.siteMetricState?.managerToggleEle);
  const completionPerformance = useSelector((state: any) => state.siteMetricState?.siteMetric?.completionPerformance);

  const [onTimeWidth, setOnTimeWidth] = useState(0);
  const [lateWidth, setLateWidth] = useState(0);
  const userRole = useSelector((state: any) => state.authenticationState.userRole);

  useEffect(() => {
    if (completionPerformance) {
      if (Number(completionPerformance[1]?.CNT) === 0 && Number(completionPerformance[0]?.CNT) === 0) { //0 //0
        setOnTimeWidth(50);
        setLateWidth(50);
      } else {
        setOnTimeWidth(100 * (Number(completionPerformance[1]?.CNT) / (Number(completionPerformance[1]?.CNT) + Number(completionPerformance[0]?.CNT)))) // 1/3 2/3
        setLateWidth(100 * (Number(completionPerformance[0]?.CNT) / (Number(completionPerformance[1]?.CNT) + Number(completionPerformance[0]?.CNT)))) // 1/3 2/3
      }
    }
  }, [completionPerformance]);

  const progressHours = () => {
    let progressPercentage = (metricsData?.totalCompletedHours/metricsData?.totalPlannedHours) * 100;
    return trimDownOneDecimal(progressPercentage);
  }

  const progressVehicles = () => {
    let progressVehiclesPercentage = (metricsData?.totalCompletedVins/metricsData?.totalPlannedVins) * 100;
    return trimDownOneDecimal(progressVehiclesPercentage);
  }

  const activeTab = () => {
    return managerToggleData.filter((i: any) => i?.isActive)[0].label
  }

  return (
    <div className={metricSectionStyle.outerWrapper}>
      <div className={metricSectionStyle.innerWrapper}>
        <div className={metricSectionStyle.header}>{`${CONSTANTS.METRICS} (${activeTab()})`}</div>
        {
          (managerToggleData && managerToggleData?.length > 0) && managerToggleData.map((item: any) => {
            if (item.value === 'vehicles' && item.isActive) {
              return <Metrics
                key={item.value}
                progress={progressVehicles()}
                totalPlanned={trimUpOneDecimal(metricsData?.totalPlannedVins)}
                totalCompleted={trimUpOneDecimal(metricsData?.totalCompletedVins)}
                marker={metricsData?.markerInVins}
                date={metricsData?.date}
              />
            }
            else if (item.value === 'hours' && item.isActive) {
              return <Metrics
                key={item.value}
                progress={progressHours()}
                totalPlanned={trimUpOneDecimal(metricsData?.totalPlannedHours)}
                totalCompleted={trimUpOneDecimal(metricsData?.totalCompletedHours)}
                marker={metricsData?.markerinHours}
                date={metricsData?.date}
              />
            }
          })
        }
      </div>
      {/* Completion Performancefor LongBeach Manager Screen*/}
      {webAppConfig?.Manager[userRole?.location]?.completionPerformance &&
        <div className={metricSectionStyle.vehicleWrapper}>
          <div className={metricSectionStyle.header}>{CONSTANTS.COMPLETION_PERFORMANCE}</div>
          <div>{completionPerformance && (Number(completionPerformance[0]?.CNT) + Number(completionPerformance[1]?.CNT))} Vehicles</div>
          <br />
          <div className={metricSectionStyle.completeStatusWrapper}>
            <div className={metricSectionStyle.onTime} style={{ width: `${onTimeWidth}%` }}>
              {completionPerformance && Number(completionPerformance[1]?.CNT)}
            </div>
            <div className={metricSectionStyle.late} style={{ width: `${lateWidth}%` }}>
              {completionPerformance && Number(completionPerformance[0]?.CNT)}
            </div>
          </div>
          <div className={metricSectionStyle.legendWrapper}>
            <div className={metricSectionStyle.completeOnTime}>
              <div className={metricSectionStyle.completeOnTimeIcon}></div>
              {CONSTANTS.COMPLETE_METRIC_ON_TIME}
            </div>
            <div className={metricSectionStyle.completeLate}>
              <div className={metricSectionStyle.completeLateIcon}></div>
              {CONSTANTS.COMPLETE_METRIC_LATE}
            </div>
          </div>
          <div>
          </div>
        </div>
      }
    </div>
  )
}
