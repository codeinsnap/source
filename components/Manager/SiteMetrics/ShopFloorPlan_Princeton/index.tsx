import React from 'react';
import { CONSTANTS } from '@/constants/constants';
import staging_icon from '../../../../../public/images/icons/staging_icon.svg';
import Image from 'next/image';
import settingsIcon from '../../../../../public/images/icons/settingsIcon.svg';
import Modal from '@/components/Shared/Modal';
import ConfigScreen from '../ConfigScreen';
import { useDispatch, useSelector } from 'react-redux';
import BuildingCard from '../BuildingCard';
import { clearSaveSiteConfigStatus, clearSiteConfigTableData, saveSiteConfig } from '@/store/actions/siteConfigAction';
import { useMsal } from '@azure/msal-react';
import toast from 'react-hot-toast';
import moment from 'moment';
import { displayLoader } from '@/store/actions/commonAction';
import { shopFloorPlanPRStyle } from './shop_floor_plan_PR_tailwind';

export default function ShopFloorPlan_Princeton() {
  const shopFloorData = useSelector((state: any) => state.siteMetricState?.siteMetric?.shopFloorPlan);
  const managerToggleEle = useSelector((state: any) => state.siteMetricState.managerToggleEle);
  const unit = managerToggleEle?.filter((item: any) => item.isActive)[0].name;

  return (
    <div className={shopFloorPlanPRStyle.mainWrapper}>
      <div className={shopFloorPlanPRStyle.outerWrapper}>
        {/* FPR Fuel & Staging */}
        <div className={shopFloorPlanPRStyle.innerWrapper}>
          <div className={shopFloorPlanPRStyle.colSpan2}></div>
          <div className={shopFloorPlanPRStyle.fqa}>
            <b>FQA</b>
          </div>
          <div className={shopFloorPlanPRStyle.divide}>
            <div></div>
            <div></div>
          </div>
          <div className={shopFloorPlanPRStyle.lpr} >
            LPR
          </div>
        </div>
        {/* White Space */}
        <div className={shopFloorPlanPRStyle.whiteSpaceWrapper}>
          <div className={shopFloorPlanPRStyle.colSpan3borderRight}></div>
          <div className={shopFloorPlanPRStyle.colSpan4}></div>
          <div className={shopFloorPlanPRStyle.colSpan3borderLeft}></div>
          <div className={shopFloorPlanPRStyle.colSpan2}></div>
        </div>
        {/* Building */}
        <div className={shopFloorPlanPRStyle.colSpan8}>
          {
            unit === 'vehicles' &&
            shopFloorData?.building.map((item: any) =>
              <BuildingCard
                key={item.shopname}
                completed={item.completedVins}
                marker={item.markerinVins}
                planned={item.plannedVins}
                type={item.shopType}
                name={item.shopname}
                unit={unit}
              />
            )
          }

          {
            unit === 'hours' &&
            shopFloorData?.building.map((item: any) =>
              <BuildingCard
                key={item.shopname}
                completed={item.completedHours}
                marker={item.markerinHours}
                planned={item.plannedHours}
                type={item.shopType}
                name={item.shopname}
                unit={unit}
              />
            )
          }

        </div>
        {/* White Space */}
        <div className={shopFloorPlanPRStyle.whiteSpaceWrapper}>
          <div className={shopFloorPlanPRStyle.colSpan6borderRight}></div>
          <div className={shopFloorPlanPRStyle.colSpan4}></div>
          <div className={shopFloorPlanPRStyle.colSpan1borderLeft}></div>
        </div>
        {/* FPR Fuel & Staging */}
        <div className={shopFloorPlanPRStyle.innerWrapper}>
          <div className={shopFloorPlanPRStyle.lpr}>
            <b>FPR</b>
          </div>
          <div className={shopFloorPlanPRStyle.divide}>
            <div></div>
            <div></div>
          </div>
          <div className={shopFloorPlanPRStyle.colSpan1StageIcon}>
            <Image
              src={staging_icon}
              alt="staging icon"
            />
            <div>Fuel</div>
          </div>
          <div className={shopFloorPlanPRStyle.divide}>
            <div></div>
            <div></div>
          </div>
          <div className={shopFloorPlanPRStyle.colSpan8StageIcon}>
            <Image
              src={staging_icon}
              alt="staging icon"
            />
            <div>Staging(P)</div>
          </div>
        </div>
      </div>
    </div>
  )
}


