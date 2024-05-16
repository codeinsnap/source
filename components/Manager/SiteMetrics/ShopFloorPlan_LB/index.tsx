import React from 'react';
import staging_icon from '../../../../../public/images/icons/staging_icon.svg';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import BuildingCard from '../BuildingCard';
import { shopFloorLBStyle } from './shop_floor_plan_tailwind';

export default function ShopFloorPlan_LB() {
  const shopFloorData = useSelector((state: any) => state.siteMetricState?.siteMetric?.shopFloorPlan);
  const managerToggleEle = useSelector((state: any) => state.siteMetricState.managerToggleEle);
  const unit = managerToggleEle?.filter((item: any) => item.isActive)[0].name;

  return (
    <div className={shopFloorLBStyle.mainWrapper}>
      <div className={shopFloorLBStyle.container}>
        {/* Building */}
        <div className={shopFloorLBStyle.buildingWrapper}>
          {/* Left Building */}
          <div className={shopFloorLBStyle.leftBuilding}>
            <div className={shopFloorLBStyle.leftBuildingHeaderText}>PQA Stalls</div>
            <div className={shopFloorLBStyle.shopFloorBodyWrapper}>
              {
                unit === 'vehicles' &&
                shopFloorData?.opsbuilding?.map((item: any) =>
                  <BuildingCard
                    key={item.shopname}
                    completed={item.completedVins}
                    marker={item.markerinVins}
                    planned={item.plannedVins}
                    type={item.shopType}
                    name={item.shopname}
                    unit={unit}
                    shouldRoute ={true}
                  />
                )
              }

              {
                unit === 'hours' &&
                shopFloorData?.opsbuilding?.map((item: any) =>
                  <BuildingCard
                    key={item.shopname}
                    completed={item.completedHours}
                    marker={item.markerinHours}
                    planned={item.plannedHours}
                    type={item.shopType}
                    name={item.shopname}
                    unit={unit}
                    shouldRoute ={true}
                  />
                )
              }
            </div>
          </div>
          {/* Middle Building */}
          <div className={shopFloorLBStyle.middleBuilding}>
            <div className={shopFloorLBStyle.leftBuildingHeaderTextMiddle}>PQA Conveyors</div>
            <div className={shopFloorLBStyle.shopFloorBodyWrapper}>
              {
                unit === 'vehicles' &&
                shopFloorData?.conveyor?.map((item: any) =>
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
                shopFloorData?.conveyor?.map((item: any) =>
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
          </div>
          {/* Right Building */}
          <div className={shopFloorLBStyle.rightBuilding}>
            <div className={shopFloorLBStyle.leftBuildingHeaderText}>FQA Conveyors & Stalls</div>
            <div className={shopFloorLBStyle.shopFloorBodyWrapper}>
              {
                unit === 'vehicles' &&
                shopFloorData?.fqabuilding?.map((item: any) =>
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
                shopFloorData?.fqabuilding?.map((item: any) =>
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
          </div>
        </div>
        {/* Whitespace */}
        <div className={shopFloorLBStyle.whitespace}>
          <div className={shopFloorLBStyle.innerWhitespace1}></div>
          <div className={shopFloorLBStyle.innerWhitespace2}></div>
          <div className={shopFloorLBStyle.innerWhitespace3}></div>
          <div className={shopFloorLBStyle.innerWhitespace4}></div>
          <div className={shopFloorLBStyle.innerWhitespace5}></div>
          {/* <div className='col-span-1 border-l-2 border-grey2'></div> */}
        </div>
        {/* FPR, FUEL, PPO, CONVEYOR */}
        <div className={shopFloorLBStyle.FPR_FUEL_PPOP_CONTAINER}>
          {/* FPR */}
          <div className={shopFloorLBStyle.FPR}>
            FPR
          </div>
          <div className={shopFloorLBStyle.FPR_LINE}>
            <div></div>
            <div></div>
          </div>
          {/* FUEL AND WASH */}
          <div className={shopFloorLBStyle.FUEL_WASH}>
            <Image
              src={staging_icon}
              alt="staging icon"
            />
            <div>Fuel and Wash</div>
          </div>
          <div className={shopFloorLBStyle.FUEL_WASH_DIVIDER}>
            <div></div>
            <div></div>
          </div>
          {/* PPO Shop Staging */}
          <div className={shopFloorLBStyle.PPO_SHOP_STAGING}>
            <Image
              src={staging_icon}
              alt="staging icon"
            />
            <div>PPO Shop Staging </div>
          </div>
          <div className={shopFloorLBStyle.PPO_STAGING_DIVIDER}>
            <div></div>
            <div></div>
          </div>
          {/* Conveyor Staging */}
          <div className={shopFloorLBStyle.CONVEYOR_STAGING}>
            <Image
              src={staging_icon}
              alt="staging icon"
            />
            Conveyor Staging
          </div>
          <div className={shopFloorLBStyle.CONVEYOR_STAGING_DIVIDER}>
            <div></div>
            <div></div>
          </div>
           {/* FQA Staging */}
          <div className={shopFloorLBStyle.FQA_STAGING}>
            <Image
              src={staging_icon}
              alt="staging icon"
            />
            FQA Staging
          </div>
          <div className={shopFloorLBStyle.FQA_STAGING_DIVIDER}>
            <div></div>
            <div></div>
          </div>
          <div className={shopFloorLBStyle.LPR}>
            LPR
          </div>
        </div>
        <br />
        <hr />
        <br />
        {/* FPR & LPR */}
        <div className={shopFloorLBStyle.FPR_LPR_CONTAINER}>
          <div className={shopFloorLBStyle.FPR_LPR_FIRST_BOX}>FPR</div>
          <div className={shopFloorLBStyle.FPR_LPR_DIVIDER}>
            <div></div>
            <div></div>
          </div>
          <div className={shopFloorLBStyle.FPR_LPR_SECOND_BOX}>LPR</div>
        </div>
      </div>
    </div>
  )
}
