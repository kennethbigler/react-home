import { useCallback, useMemo, useState } from "react";
import { Box, Button } from "@mui/material";
import {
  Chart,
  Credits,
  Legend,
  PlotOptions,
  Series,
  Title,
  Tooltip,
} from "@highcharts/react";
import { Accessibility } from "@highcharts/react/modules/Accessibility";
import Highcharts from "../../../../common/highcharts/coreHighcharts";
import ChartFigure from "../../shared/ChartFigure";
import useChartTextColor from "../../shared/useChartTextColor";
import colors from "./colors";
import { BreakdownCategoriesDialog } from "./BreakdownCategoriesDialog";
import { buildNetWorthBreakdownPieData } from "./buildNetWorthBreakdownPieData";

interface BreakdownChartProps {
  categories: string[];
  amounts: Record<string, number>;
}

const options: Highcharts.Options = {
  colors,
  chart: { type: "pie", backgroundColor: "transparent" },
};

const BreakdownChart = ({ categories, amounts }: BreakdownChartProps) => {
  const color = useChartTextColor();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [hiddenCategories, setHiddenCategories] = useState<Set<string>>(
    () => new Set(),
  );

  const visibleHiddenCategories = useMemo(
    () =>
      new Set(
        [...hiddenCategories].filter((category) =>
          categories.includes(category),
        ),
      ),
    [categories, hiddenCategories],
  );

  const toggleCategoryVisibility = useCallback(
    (category: string, visible: boolean) => {
      setHiddenCategories((prev) => {
        const next = new Set(prev);
        if (visible) {
          next.delete(category);
        } else {
          next.add(category);
        }
        return next;
      });
    },
    [],
  );

  const data = useMemo(
    () =>
      buildNetWorthBreakdownPieData(
        categories,
        amounts,
        visibleHiddenCategories,
      ),
    [categories, amounts, visibleHiddenCategories],
  );

  return (
    <Box>
      <ChartFigure>
        <Chart
          key={JSON.stringify([data, visibleHiddenCategories])}
          highcharts={Highcharts}
          options={options}
        >
          <Accessibility enabled={true} />
          <Credits enabled={false} />
          <Legend enabled={false} />
          <Title style={{ color }}>Net Worth Breakdown</Title>
          <Tooltip pointFormat="<b>${point.y:,.2f}</b>" />
          <PlotOptions
            series={{
              allowPointSelect: true,
              cursor: "pointer",
              dataLabels: [
                { enabled: true, format: "{point.name}", color },
                {
                  enabled: true,
                  distance: -30,
                  format: "{point.percentage:.0f}%",
                  style: { fontSize: "1em", color },
                },
              ],
            }}
          />
          <Series type="pie" data={data} />
        </Chart>
      </ChartFigure>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
        <Button size="small" onClick={() => setDialogOpen(true)}>
          Categories
        </Button>
      </Box>
      <BreakdownCategoriesDialog
        open={dialogOpen}
        categories={categories}
        amounts={amounts}
        hiddenCategories={visibleHiddenCategories}
        onClose={() => setDialogOpen(false)}
        onToggle={toggleCategoryVisibility}
      />
    </Box>
  );
};

export default BreakdownChart;
