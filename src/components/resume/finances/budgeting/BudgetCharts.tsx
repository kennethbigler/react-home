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
import {
  budgetCategoryColorsAtom,
  budgetFlowRead,
} from "../../../../jotai/finances-atom";
import BudgetSankeyGraph from "./graphs/BudgetSankeyGraph";
import CategoryBreakdownPie from "./graphs/CategoryBreakdownPie";
import { getBudgetPieContent } from "./graphs/getBudgetPieContent";

const BudgetCharts = () => {
  const muiTheme = useTheme();
  const categoryColors = useAtomValue(budgetCategoryColorsAtom);
  const { hasCompData, flow, expenseEntries } = useAtomValue(budgetFlowRead);
  const [selectedCategoryKey, setSelectedCategoryKey] = useState<string | null>(
    null,
  );
  const [hideTaxes, setHideTaxes] = useState(false);
  const categories = flow?.categories ?? [];
  const pieContent = flow
    ? getBudgetPieContent(
        flow,
        categories,
        selectedCategoryKey,
        expenseEntries,
        categoryColors,
        muiTheme,
        hideTaxes,
      )
    : { title: "Income Overview", data: [] };

  return (
    <Grid container spacing={2} sx={{ mb: 2 }}>
      <Grid size={{ xs: 12, lg: 8 }}>
        {hasCompData && flow ? (
          <BudgetSankeyGraph
            flow={flow}
            selectedCategoryKey={selectedCategoryKey}
            onCategorySelect={setSelectedCategoryKey}
          />
        ) : (
          <Alert severity="info">
            Add a comp entry in Comp Calculator to see budget flow.
          </Alert>
        )}
      </Grid>
      <Grid size={{ xs: 12, lg: 4 }}>
        <Box sx={{ position: "relative", minHeight: "100%" }}>
          {hasCompData && flow ? (
            pieContent.data.length > 0 ? (
              <CategoryBreakdownPie
                title={pieContent.title}
                data={pieContent.data}
              />
            ) : (
              <Typography sx={{ p: 2 }}>
                Add expenses to see category breakdown.
              </Typography>
            )
          ) : (
            <Typography sx={{ p: 2 }}>
              Category breakdown requires comp calculator data.
            </Typography>
          )}
          {hasCompData && flow ? (
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
          ) : null}
        </Box>
      </Grid>
    </Grid>
  );
};

export default BudgetCharts;
