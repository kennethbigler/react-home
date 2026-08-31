import { useCallback, useMemo, useState } from "react";
import { Box, Button } from "@mui/material";
import BreakdownPie from "@/components/resume/finances/shared/BreakdownPie";
import { categoryChartColors } from "@/components/resume/finances/shared/chartPalette";
import { BreakdownCategoriesDialog } from "./BreakdownCategoriesDialog";
import { buildNetWorthBreakdownPieData } from "./buildNetWorthBreakdownPieData";

interface BreakdownChartProps {
  categories: string[];
  amounts: Record<string, number>;
}

const BreakdownChart = ({ categories, amounts }: BreakdownChartProps) => {
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
      <BreakdownPie
        title="Net Worth Breakdown"
        data={data}
        colors={categoryChartColors}
        chartKey={JSON.stringify([data, visibleHiddenCategories])}
      />
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
