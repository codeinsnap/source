import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Legend } from "recharts";

const data = [
  { name: "36 No Part/Contents", value: 36, fill: "#0F2C6B" },
  { name: "13 Part Damage/Quality Issue", value: 13, fill: "#1A4BB5" },
  { name: "4 Vehicle Damage/Quality Issue", value: 4, fill: "#2469FF" },
  { name: "2 Team Member Not Trained", value: 2, fill: "#6C9BFF" },
  { name: "2 Re-routed", value: 2, fill: "#BBD1FF" },
  { name: "1 Missing Tool", value: 1, fill: "#909295" },
  { name: "1 End of shift/End of day", value: 1, fill: "#909295" }
];

function DonutChart(props: any) {
  const { data } = props
  const [domLoaded, setDomLoaded] = useState(false);

  const renderColorfulLegendText = (value: string, entry: any, index: any) => {
    return (
      <span style={{ color: "#000000", fontWeight: 400, fontSize: '14px', padding: '5px' }}>
        {data[index].value} {value}
      </span>
    );
  };

  useEffect(() => {
    setDomLoaded(true)
  }, [])

  return (
    <>
      {domLoaded && (
        <PieChart width={800} height={200}>
          <Legend
            height={36}
            iconType="circle"
            layout='radial'
            verticalAlign="top"
            iconSize={15}
            formatter={renderColorfulLegendText}>
          </Legend>
          <Pie
            data={data}
            cx={365}
            cy={90}
            innerRadius={60}
            outerRadius={95}
            fill="#8884d8"
            paddingAngle={0}
            dataKey="value"
          ></Pie>
        </PieChart>
      )
      }
    </>
  );
}

export default DonutChart;
