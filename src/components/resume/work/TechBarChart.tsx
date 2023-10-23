import * as React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { useTheme } from "@mui/material/styles";
import dateObj from "../../../apis/DateHelper";
import languageExp from "../../../constants/languages";
import { tooltipFormatter } from "./job-helpers";

const data = languageExp
  .map((obj) => ({
    name: window.innerWidth < 1200 ? obj.short : obj.company,
    months: dateObj(obj.end).diff(obj.start, "month"),
  }))
  .sort((a, b) => b.months - a.months);

const TechBarChart: React.FC = React.memo(() => {
  const {
    palette: {
      secondary: { main },
    },
  } = useTheme();

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <Tooltip formatter={tooltipFormatter} />
        <Bar dataKey="months" fill={main} />
      </BarChart>
    </ResponsiveContainer>
  );
});

export default TechBarChart;
