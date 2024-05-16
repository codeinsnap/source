
export const webAppConfig: any = {
  team_member: {
    LB: {
      progressPlanned: true,
      progressBar: true,
      progressActual: false,
    },
    PR: {
      progressPlanned: false,
      progressBar: false,
      progressActual: true,

    },
  },
  Manager: {
    LB: {
      completionPerformance:true,
      metricsAllTiles:true,
      metricsTotalCompletedTile:false,
      LinechartPlannedCompleted:true,
      LineChartCompleted:false,
      shopFloorHoverProgress: true,
      shopFloorHoverPlanned: true,
      shopFloorHoverComplete: true,
      siteConfigAddNewStallPR:false,
      siteConfigAddNewStallLB:true,
    },
    PR: {
      completionPerformance:false,
      metricsAllTiles:false,
      metricsTotalCompletedTile:true,
      LinechartPlannedCompleted:false,
      LineChartCompleted:true,
      shopFloorHoverProgress: false,
      shopFloorHoverPlanned: false,
      shopFloorHoverComplete: true,
      siteConfigAddNewStallPR:true,
      siteConfigAddNewStallLB:false,
    },
  }
}