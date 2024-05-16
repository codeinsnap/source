import React from 'react';
import Image from 'next/image';
import greenTick from '../../../../../public/images/icons/greenTick.svg';
import redTick from '../../../../../public/images/icons/redTick.svg';
import { webAppConfig } from '@/utility/webAppConfig';
import { useSelector } from 'react-redux';
import { trimDownOneDecimal, trimUpOneDecimal } from '@/utility/formattingFunctions';
import { useRouter } from 'next/router';
import { buildingCardStyle } from './building_tailwind';

function BuildingCard(props: any) {
  const { completed, marker, planned, type, name, unit, shouldRoute } = props;
  const router = useRouter();
  const userRole = useSelector((state: any) => state.authenticationState.userRole);

  const progress = () => {
    let progressPercentage = (Number(completed) / Number(planned)) * 100;
    if (!progressPercentage) {
      return 0 + '%';
    }
    return trimDownOneDecimal(progressPercentage) + '%';
  }

  const showRedGreenTick = () => {
    if (Number(completed) >= Number(marker)) {
      return <Image src={greenTick} alt="" />
    } else {
      return <Image src={redTick} alt="" />
    }
  }

  const FQAshopName = ["1", "2", "3"];

  const buildingHeaderText = () => {
    if (FQAshopName.includes(name) && (planned === 0 && unit == 'hours')) {
      return <div>-/-</div>
    } else if (FQAshopName.includes(name) && (completed >= 0 && unit == 'vehicles')) {
      return <>
        {trimUpOneDecimal(Number(completed))}/-
      </>
    } else {
      return <>
        {trimUpOneDecimal(Number(completed))}/{trimUpOneDecimal(Number(planned))}
      </>
    }
  }

  const buildingCompleteHoverText = () => {
    if (FQAshopName.includes(name) && (planned === 0 && unit == 'hours')) {
      return <div>-</div>
    } else if (FQAshopName.includes(name) && (completed >= 0 && unit == 'vehicles')) {
      return <>
        {trimUpOneDecimal(completed)}
      </>
    } else {
      return <>
        {trimUpOneDecimal(completed)}
      </>
    }
  }

  const calcOverallCurrentPercent:any= (numerator:any, denominator:any)=>{
    
   return denominator === 0 ? 100 : trimUpOneDecimal((numerator/denominator)*100);
  }

  const getShopName = (shopType: any, shopName: any) => {
    if(shouldRoute){
      router.push({ pathname: '/Manager/ProductionLineMetrics', query: { keyword: `${shopName} - ${shopType}` } });
    }
  }

  return (
    <>
      <div key={name} onClick={() => getShopName(type, name)} className={`${shouldRoute ? buildingCardStyle.card :  buildingCardStyle.cardNoRoute} ${Number(completed) >= Number(marker) ? buildingCardStyle.cardGreyBorder : buildingCardStyle.cardRedBorder}`}>
        <div className={buildingCardStyle.headerText}>
          {/* Header text */}
          <div className={buildingCardStyle.headerPadding}>
            {buildingHeaderText()}
          </div>
          {/* Show red or green tick */}
          {(planned !== 0) &&
            showRedGreenTick()
          }
        </div>

        <div className={buildingCardStyle.shopName}>{name}</div>
        <div className={buildingCardStyle.shopType}>{type}</div>
        {/* Hover Functionality */}
        <div className={buildingCardStyle.cardHover}>
          <span className={buildingCardStyle.spanHover}>
            {name} {type} <br /><br />
            {/* Progress */}
            {/* {webAppConfig?.Manager[userRole?.location]?.shopFloorHoverProgress && (
              <div className={buildingCardStyle.tooltipHover}>
                <div className={buildingCardStyle.tooltipMargin}>Progress</div>
                {FQAshopName.includes(name) && (planned === 0 && completed === 0) ?
                  <div>-</div>
                  : progress()
                }
              </div>
            )} */}
            {/* Planned */}
            {/* {webAppConfig?.Manager[userRole?.location]?.shopFloorHoverPlanned && (
              <div className={buildingCardStyle.tooltipHover}>
                <div className={buildingCardStyle.tooltipMargin}>Planned</div>
                <div>
                  {FQAshopName.includes(name) && (planned === 0 && completed === 0) ?
                    <div>-</div>
                    : trimUpOneDecimal(Number(planned))}
                </div>
              </div>
            )} */}
            {/* Complete */}
            {/* {webAppConfig?.Manager[userRole?.location]?.shopFloorHoverComplete && (
              <div className={buildingCardStyle.tooltipHover}>
                <div className={buildingCardStyle.tooltipMargin}>Complete</div>
                <div>
                  {buildingCompleteHoverText()}
                </div>
              </div>
            )} */}
            {/* Overall */}
            {webAppConfig?.Manager[userRole?.location]?.shopFloorHoverComplete && (
              <div className={buildingCardStyle.tooltipHover}>
                <div className={buildingCardStyle.tooltipMargin}>Overall</div>
                <div>
                  {`${trimUpOneDecimal(completed)}/${trimUpOneDecimal(planned)} (${calcOverallCurrentPercent(trimUpOneDecimal(completed), trimUpOneDecimal(planned))}%)`}
                </div>
              </div>
            )}
            {/* current */}
            {webAppConfig?.Manager[userRole?.location]?.shopFloorHoverComplete && (
              <div className={buildingCardStyle.tooltipHover}>
                <div className={buildingCardStyle.tooltipMargin}>Current</div>
                <div>
                  {`${trimUpOneDecimal(completed)}/${trimDownOneDecimal(marker)} (${calcOverallCurrentPercent(trimUpOneDecimal(completed), trimDownOneDecimal(marker))}%)`}
                </div>
              </div>
            )}
          </span>
          <div className={buildingCardStyle.divider}></div>
        </div>
      </div>
    </>
  )
}

export default BuildingCard