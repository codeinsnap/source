import React, { useState, useEffect } from "react";
import { webAppConfig } from "@/utility/webAppConfig";
import { useSelector } from 'react-redux';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label
} from "recharts";
import moment from "moment";
import { trimDownOneDecimal, trimUpOneDecimal } from "@/utility/formattingFunctions";
import { lineChartStyle } from "./line_chart_tailwind";

export default function LineChartGraph(props: any) {
  const { data, unit } = props;

  const [modifiedData, setModifiedData]: any = useState([]);
  const [res, setRes]: any = useState([]);

  const userRole = useSelector((state: any) => state.authenticationState.userRole);
  const daySelector = useSelector((state: any) => state.siteMetricState.unitEle);
  let day = daySelector?.filter((item: any) => item.isActive)[0].name;

  const dayHours = ["12:00 AM", "1:00 AM", "2:00 AM", "3:00 AM", "4:00 AM", "5:00 AM", "6:00 AM", "7:00 AM", "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM", "10:00 PM", "11:00 PM"]

  const customizeData = () => {
    let tempArr: any = [];
    modifiedData?.map((item: any) => {
      if (dayHours.includes(item?.name)) {
        tempArr.push(item.name)
      }
    })
    setRes(tempArr);
  }
  useEffect(() => {
    customizeData();
  }, [modifiedData]);

  useEffect(() => {
    if (day === 'today') {
      modifyTodayData();
    } else if (day === 'yesterday') {
      modifyYesterdayData();
    }
  }, [data]);

  const modifyYesterdayData = () => {
    //  Check last completed property value  
    let normalizeArr = data?.filter((i: any) => i.hasOwnProperty("Completed"));
    if (normalizeArr) {
      let normalizeValue: any = normalizeArr[normalizeArr.length - 1]?.Completed;
      let progressAgainstPlanVehiclesCopy = data?.map((item: any) => {
        if (item.hasOwnProperty("Completed")) {
          return item;
        }
        else {
          return {
            ...item,
            Completed: normalizeValue //Append Completed Key to stretch the graph
          }
        }
      })
      setModifiedData([...progressAgainstPlanVehiclesCopy]);
    }
  }

  const modifyTodayData = () => {
    let normalizeArr = data?.filter((i: any) => i.hasOwnProperty("Completed"));
    if (normalizeArr) {
      let normalizeValue: any = normalizeArr[normalizeArr.length - 1]?.Completed;
      let progressAgainstPlanVehiclesCopy = data?.map((item: any) => {
        if (item.hasOwnProperty("Completed")) {
          return item;
        }
        else {
          let currentTime = moment(getCurrentTime(), 'h:mma');
          let payLoadTime = moment(item?.name, 'h:mma');

          if (payLoadTime.isBefore(currentTime)) {
            return {
              ...item,
              Completed: normalizeValue //Append Completed Key to stretch the graph
            }
          } else {
            return item;
          }
        }
      })
      setModifiedData([...progressAgainstPlanVehiclesCopy]);
    }
  }

  let getCurrentTime = () => {
    if (userRole?.location === 'LB') {
      return moment.tz('America/Los_Angeles').format("h:mma");
    } else if (userRole?.location === 'PR') {
      return moment.tz('America/New_York').format("h:mma");
    }
  }

  // calculate percentage for launchDate - index = 4, total = 7
  // const percentage = 80;

  return (
    <>
      {/*Line Chart for LongBeach Manager Screen*/}
      {webAppConfig?.Manager[userRole?.location]?.LinechartPlannedCompleted &&
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={modifiedData}
            margin={{
              top: 10,
              right: 30,
              left: 20,
              bottom: 5
            }}
          >
            {/* <defs>
              <linearGradient id="gradient" x1="0" y1="0" x2="100%" y2="0">
                <stop offset="0%" stopColor="#f97316" />
                <stop offset={`${percentage}%`} stopColor="#f97316" />
                <stop offset={`${percentage}%`} stopColor="blue" />
                <stop offset="100%" stopColor="blue" />
              </linearGradient>
            </defs> */}
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ stroke: '#000000', strokeWidth: 0.7 }}
              // padding={{ right: 4 }}
              ticks={res}
              domain={res}
              style={{ fontSize: "70%" }}
              angle={-30}
              interval={0}
            />
            <YAxis tick={{ stroke: '#000000', strokeWidth: 0.7 }} style={{ fontSize: "70%" }} >
              <Label
                style={{
                  textAnchor: "middle",
                  fontSize: "90%",
                  fill: "#000000",
                  color: "black"

                }}
                position="left"
                fontWeight={700}
                className="alignCenter"
                angle={270}
                value={unit} />
            </YAxis>
            <Tooltip content={<CustomTooltipLB />} cursor={{ stroke: '#000000', strokeWidth: 1 }} />
            <Legend iconType='square' align='left' />
            <Line
              type="monotone"
              dataKey="Planned"
              stroke="#f97316"
              //stroke="url(#gradient)"
              activeDot={{ r: 8 }}
              dot={<CustomizedDot/>}
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="Completed"
              stroke="#2469FF"
              dot={false}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      }

      {/*Line Chart for Princeton Manager Screen*/}
      {webAppConfig?.Manager[userRole?.location]?.LineChartCompleted &&
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={modifiedData}
            margin={{
              top: 10,
              right: 30,
              left: 20,
              bottom: 5
            }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ stroke: '#000000', strokeWidth: 0.7 }}
              // padding={{ right: 4 }}
              ticks={res}
              domain={res}
              style={{ fontSize: "70%" }}
              angle={-30}
            />
            <YAxis tick={{ stroke: '#000000', strokeWidth: 0.7 }} style={{ fontSize: "70%" }} >
              <Label
                style={{
                  textAnchor: "middle",
                  fontSize: "90%",
                  fill: "#000000",
                  color: "black"

                }}
                position="left"
                fontWeight={700}
                className="alignCenter"
                angle={270}
                value={unit} />
            </YAxis>
            <Tooltip content={<CustomTooltipPR />} cursor={{ stroke: '#000000', strokeWidth: 1 }} />
            <Legend iconType='square' align='left' />
            <Line type="monotone" dataKey="Completed" stroke="#2469FF" dot={false} strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      }
    </>
  );
}

const CustomizedDot = (props: any) => {
  const { cx, cy, payload } = props;
  if (payload?.Exception) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" x={cx - 10} y={cy - 10} width={20} height={20} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="red" className="w-6 h-6">
        <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
      </svg>
    );
  } else {
    return (<></>)
  }
};

function CustomTooltipLB(props: any) {
  const { active, payload, label } = props;
  if (active && payload && payload.length) {
    const { name, Planned, Completed, Exception } = payload[0]?.payload;

    const Progress = () => {
      if (Completed !== undefined) {
        return (Planned === 0) ? '0' : (100 * Number(Completed) / Number(Planned)).toFixed(2)
      }
      return undefined
    };

    return (
      <div className={lineChartStyle.toolTipWrapper}>
        <p className={lineChartStyle.toolTipName}>{name}</p>
        {Progress() && (
          <p className={lineChartStyle.progress}>{`Progress : ${trimDownOneDecimal(Progress())}%`}</p>
        )}
        {(Planned || (Planned === 0)) && (
          <p className={lineChartStyle.planned}>{`Planned : ${trimUpOneDecimal(Planned)}`}</p>
        )}
        {(Completed !== undefined) && (
          <p className={lineChartStyle.completed}>{`Completed : ${trimUpOneDecimal(Completed)}`}</p>
        )}
        {(Exception !== undefined) && (
          <p className={lineChartStyle.exception}>{`Exception : ${trimUpOneDecimal(Exception)}`}</p>
        )}
      </div>
    );
  }
  return null;
}

function CustomTooltipPR(props: any) {
  const { active, payload } = props;
  if (active && payload && payload.length) {
    const { name, Completed } = payload[0]?.payload;
    return (
      <div className={lineChartStyle.toolTipWrapper}>
        <p className={lineChartStyle.toolTipName}>{name}</p>
        {(Completed !== undefined) && (
          <p className={lineChartStyle.completed}>{`Completed : ${trimUpOneDecimal(Completed)}`}</p>
        )}
      </div>
    );
  }
  return null;
}