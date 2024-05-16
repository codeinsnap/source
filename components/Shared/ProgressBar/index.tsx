import React from 'react';
import { webAppConfig } from '@/utility/webAppConfig';
import { useSelector } from 'react-redux';
import { progressBarStyle } from './progress_bar_tailwind';

function ProgressBar(props: any) {
  const { actual, markerInUnits, highlighterPositionInUnits, progress } = props
  const userRole = useSelector((state: any) => state.authenticationState.userRole);

  return (
    <>
      {webAppConfig?.team_member[userRole?.location]?.progressBar &&
        <div
        className={progressBarStyle.progressWrapper}
        >
          {progress > 100 ?
            (
              <div
              className={progressBarStyle.progressActual}
                style={{
                  width: `${100}%`, //Actual 
                }}
              ></div>
            ) :
            <>
              <div
                className={progressBarStyle.progressActual} 
                style={{
                  width: `${progress}%`, //Actual 
                }}
              ></div>
            </>
          }
          <div
            className={progressBarStyle.progressPlanned} 
            style={{
              width: `${markerInUnits}%`, //Planned
            }}
          ></div>
          <div className={progressBarStyle.progressPercent}>
            {Math.round(progress) ? Math.round(progress) : '0'} % | {actual}
          </div>
        </div>
      }

      {webAppConfig?.team_member[userRole?.location]?.progressActual &&
        <div className={progressBarStyle.progressPercent}>
          {actual}
        </div>
      }
    </>
  );
}

export default ProgressBar