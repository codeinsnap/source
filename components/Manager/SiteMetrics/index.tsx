import React from 'react';
import ShopFloorHeader from './ShopFloorHeader';
import ShopFloorPlan_LB from './ShopFloorPlan_LB';
import ShopFloorPlan_Princeton from './ShopFloorPlan_Princeton';
import MetricsSection from './MetricsSection';
import GraphSection from './GraphSection';
import { siteMetricStyle } from './site_metrics_tailwind';
import { useSelector } from 'react-redux';

export default function SiteMetrics() {
  const userRole = useSelector((state: any) => state.authenticationState.userRole);

  return (
    <>
      <div className={siteMetricStyle.wrapper}>
        <MetricsSection />
        <GraphSection />
      </div>
      <ShopFloorHeader />
      {userRole?.location === 'LB' && (
        <ShopFloorPlan_LB />
      )}
      {userRole?.location === 'PR' && (
        <ShopFloorPlan_Princeton />
      )}
    </>
  )
}
