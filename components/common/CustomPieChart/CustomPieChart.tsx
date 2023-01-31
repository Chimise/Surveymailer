import React, { useMemo, useState, useCallback } from "react";
import { Pie, PieChart, PieProps, Cell, Sector } from "recharts";
import type { Survey } from "../../../types";

interface CustomPieChartProps {
  survey: Survey;
}

const colors = [
  "#a7f3d0",
  "#6ee7b7",
  "#34d399",
  "#10b981",
  "#047857",
  "#)64e3b",
  "#99f6e4",
  "#2dd4bf",
  "#14b846",
  "#0f7666",
  "#067490",
];

const renderActiveShape = (props: any) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    percent,
    value,
    name,
    payload,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <text
        x={cx}
        y={cy}
        dy={8}
        textAnchor="middle"
        className="text-xs fill-slate-600"
      >
        {`${value} ${value > 1 ? "selects" : "select"} - (${Math.round(
          percent * 100
        )}%)`}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
        className="text-sm font-medium"
      >
        {name}
      </text>
    </g>
  );
};

const CustomPieChart = ({ survey }: CustomPieChartProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const handleMouseEnter = useCallback(
    (evt: any, index: number) => {
      setActiveIndex(index);
    },
    [setActiveIndex]
  );

  const choices = useMemo(() => {
    const totalResponse = survey.choices.reduce(
      (acc, { responses }) => acc + responses,
      0
    );
    const unresponded = survey.recipients - totalResponse;
    return survey.choices
      .map(({ responses, action, _id, code }) => ({
        responses,
        action,
        _id,
        code,
      }))
      .concat({
        action: "Unresponded",
        responses: unresponded,
        _id: new Date().toISOString(),
        code: survey.choices.length,
      });
  }, [survey]);
  return (
    <PieChart width={400} height={400}>
      <Pie
        activeIndex={activeIndex}
        data={choices}
        nameKey="action"
        activeShape={renderActiveShape}
        onMouseEnter={handleMouseEnter}
        dataKey="responses"
        cx={200}
        cy={200}
        innerRadius={60}
        outerRadius={80}
        fill="green"
      >
        {choices.map((choice) => (
          <Cell
            className="focus:outline-none"
            key={choice._id}
            fill={colors[choice.code]}
          />
        ))}
      </Pie>
    </PieChart>
  );
};

export default CustomPieChart;

// import "./styles.css";
// import React, { useCallback, useState } from "react";
// import { PieChart, Pie, Cell } from "recharts";

// const data = [
//   { name: "Group A", value: 400 },
//   { name: "Group B", value: 300 },
//   { name: "Group C", value: 300 },
//   { name: "Group D", value: 200 }
// ];

// const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

// const RADIAN = Math.PI / 180;
// const renderCustomizedLabel = ({
//   cx,
//   cy,
//   midAngle,
//   innerRadius,
//   outerRadius,
//   percent,
//   index
// }: any) => {
//   const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
//   const x = cx + radius * Math.cos(-midAngle * RADIAN);
//   const y = cy + radius * Math.sin(-midAngle * RADIAN);

//   return (
//     <text
//       x={x}
//       y={y}
//       fill="white"
//       textAnchor={x > cx ? "start" : "end"}
//       dominantBaseline="central"
//     >
//       {`${(percent * 100).toFixed(0)}%`}
//     </text>
//   );
// };
// export default function App() {
//   return (
//     <PieChart width={400} height={400}>
//       <Pie
//         data={data}
//         cx={200}
//         cy={200}
//         labelLine={false}
//         label={renderCustomizedLabel}
//         outerRadius={80}
//         fill="#8884d8"
//         dataKey="value"
//       >
//         {data.map((entry, index) => (
//           <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//         ))}
//       </Pie>
//     </PieChart>
//   );
// }

// import "./styles.css";
// import React from "react";
// import { PieChart, Pie, Sector, Cell } from "recharts";

// const data = [
//   { name: "Group A", value: 400 },
//   { name: "Group B", value: 300 },
//   { name: "Group C", value: 300 },
//   { name: "Group D", value: 200 }
// ];
// const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

// export default function App() {
//   return (
//     <PieChart width={800} height={400}>
//       <Pie
//         data={data}
//         cx={120}
//         cy={200}
//         innerRadius={60}
//         outerRadius={80}
//         fill="#8884d8"
//         paddingAngle={5}
//         dataKey="value"
//       >
//         {data.map((entry, index) => (
//           <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//         ))}
//       </Pie>
//       <Pie
//         data={data}
//         cx={420}
//         cy={200}
//         startAngle={180}
//         endAngle={0}
//         innerRadius={60}
//         outerRadius={80}
//         fill="#8884d8"
//         paddingAngle={5}
//         dataKey="value"
//       >
//         {data.map((entry, index) => (
//           <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//         ))}
//       </Pie>
//     </PieChart>
//   );
// }

// import "./styles.css";
// import React, { useCallback, useState } from "react";
// import { PieChart, Pie, Sector } from "recharts";

// const data = [
//   { name: "Group A", value: 400 },
//   { name: "Group B", value: 300 },
//   { name: "Group C", value: 300 },
//   { name: "Group D", value: 200 }
// ];

// const renderActiveShape = (props: any) => {
//   const RADIAN = Math.PI / 180;
//   const {
//     cx,
//     cy,
//     midAngle,
//     innerRadius,
//     outerRadius,
//     startAngle,
//     endAngle,
//     fill,
//     payload,
//     percent,
//     value
//   } = props;
//   const sin = Math.sin(-RADIAN * midAngle);
//   const cos = Math.cos(-RADIAN * midAngle);
//   const sx = cx + (outerRadius + 10) * cos;
//   const sy = cy + (outerRadius + 10) * sin;
//   const mx = cx + (outerRadius + 30) * cos;
//   const my = cy + (outerRadius + 30) * sin;
//   const ex = mx + (cos >= 0 ? 1 : -1) * 22;
//   const ey = my;
//   const textAnchor = cos >= 0 ? "start" : "end";

//   return (
//     <g>
//       <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
//         {payload.name}
//       </text>
//       <Sector
//         cx={cx}
//         cy={cy}
//         innerRadius={innerRadius}
//         outerRadius={outerRadius}
//         startAngle={startAngle}
//         endAngle={endAngle}
//         fill={fill}
//       />
//       <Sector
//         cx={cx}
//         cy={cy}
//         startAngle={startAngle}
//         endAngle={endAngle}
//         innerRadius={outerRadius + 6}
//         outerRadius={outerRadius + 10}
//         fill={fill}
//       />
//       <path
//         d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
//         stroke={fill}
//         fill="none"
//       />
//       <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
//       <text
//         x={ex + (cos >= 0 ? 1 : -1) * 12}
//         y={ey}
//         textAnchor={textAnchor}
//         fill="#333"
//       >{`PV ${value}`}</text>
//       <text
//         x={ex + (cos >= 0 ? 1 : -1) * 12}
//         y={ey}
//         dy={18}
//         textAnchor={textAnchor}
//         fill="#999"
//       >
//         {`(Rate ${(percent * 100).toFixed(2)}%)`}
//       </text>
//     </g>
//   );
// };

// export default function App() {
//   const [activeIndex, setActiveIndex] = useState(0);
//   const onPieEnter = useCallback(
//     (_, index) => {
//       setActiveIndex(index);
//     },
//     [setActiveIndex]
//   );

//   return (
//     <PieChart width={400} height={400}>
//       <Pie
//         activeIndex={activeIndex}
//         activeShape={renderActiveShape}
//         data={data}
//         cx={200}
//         cy={200}
//         innerRadius={60}
//         outerRadius={80}
//         fill="#8884d8"
//         dataKey="value"
//         onMouseEnter={onPieEnter}
//       />
//     </PieChart>
//   );
// }
