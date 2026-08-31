import { useState } from "react";
import {
  Alert,
  Box,
  FormControlLabel,
  Grid,
  Switch,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useAtomValue } from "jotai";
import usDollar from "@/apis/usDollar";
import { budgetFlowRead } from "@/jotai/budget-atom";
import BudgetSankeyGraph from "./graphs/BudgetSankeyGraph";
import CategoryBreakdownPie from "./graphs/CategoryBreakdownPie";
import { PAYROLL_CATEGORY_KEY } from "./graphs/chartData";
import { getBudgetPieContent } from "./graphs/getBudgetPieContent";

const getMissingDataMessage = (
  hasCompData: boolean,
  hasBudgetData: boolean,
): string => {
  if (!hasCompData && !hasBudgetData) {
    return "Add a comp entry in Comp Calculator and budget expenses to see budget flow.";
  }
  if (!hasCompData) {
    return "Add a comp entry in Comp Calculator to see budget flow.";
  }
  return "Add budget expenses to see budget flow.";
};

const BudgetCharts = () => {
  const muiTheme = useTheme();
  const { hasCompData, flow, expenseEntries, categoryColors } =
    useAtomValue(budgetFlowRead);
  const [selectedCategoryKey, setSelectedCategoryKey] = useState<string | null>(
    null,
  );
  const [hideTaxes, setHideTaxes] = useState(false);
  const hasBudgetData = expenseEntries.length > 0;
  const hasCharts = hasCompData && hasBudgetData && flow;
  const categories = flow?.categories ?? [];
  const effectiveSelectedCategoryKey =
    selectedCategoryKey === PAYROLL_CATEGORY_KEY ||
    categories.some(({ categoryKey }) => categoryKey === selectedCategoryKey)
      ? selectedCategoryKey
      : null;

  if (!hasCharts) {
    return (
      <Alert severity="warning" sx={{ mb: 2 }}>
        {getMissingDataMessage(hasCompData, hasBudgetData)}
      </Alert>
    );
  }

  const pieContent = getBudgetPieContent(
    flow,
    categories,
    effectiveSelectedCategoryKey,
    expenseEntries,
    categoryColors,
    muiTheme,
    hideTaxes,
  );

  return (
    <>
      {flow.isOverAllocated ? (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Budget is over-allocated by {usDollar.format(-flow.unallocated)} per
          year.
        </Alert>
      ) : null}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <BudgetSankeyGraph
            flow={flow}
            selectedCategoryKey={effectiveSelectedCategoryKey}
            onCategorySelect={setSelectedCategoryKey}
          />
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
          <Box sx={{ position: "relative", minHeight: "100%" }}>
            {pieContent.data.length > 0 ? (
              <CategoryBreakdownPie
                title={pieContent.title}
                data={pieContent.data}
              />
            ) : (
              <Typography sx={{ p: 2 }}>
                Add expenses to see category breakdown.
              </Typography>
            )}
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                mt: 1,
              }}
            >
              <FormControlLabel
                control={
                  <Switch
                    checked={hideTaxes}
                    onChange={(event) => setHideTaxes(event.target.checked)}
                    slotProps={{ input: { "aria-label": "Hide taxes" } }}
                  />
                }
                label="Hide taxes"
              />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default BudgetCharts;
