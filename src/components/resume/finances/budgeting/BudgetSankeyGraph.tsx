import { memo, useMemo } from "react";
import { useAtomValue } from "jotai";
import { useTheme } from "@mui/material/styles";
import { Chart, Credits, Series, Title, XAxis, YAxis } from "@highcharts/react";
import { Accessibility } from "@highcharts/react/modules/Accessibility";
import Highcharts from "../../../common/highcharts/sankeyHighcharts";
import themeAtom from "../../../../jotai/theme-atom";
import usDollar from "../../../../apis/usDollar";
import type { BudgetFlow } from "./helpers";
import {
  buildBudgetSankeyData,
  BUDGET_WITHHOLDING_NODE_LABELS,
  getSankeyNodeSum,
  GROSS_INCOME_NODE,
  INCOME_NODE_LABELS,
  isCategorySankeyNode,
  isPayrollSankeyNode,
  PAYROLL_CATEGORY_KEY,
  UNALLOCATED_NODE,
} from "./helpers";
import { getBudgetSankeyNodeColors } from "./chartColors";

interface BudgetSankeyGraphProps {
  flow: BudgetFlow;
  selectedCategoryKey?: string | null;
  onCategorySelect: (categoryKey: string | null) => void;
}

const formatCurrency = (value: number) => usDollar.format(value);

const BudgetSankeyGraph = memo(
  ({ flow, selectedCategoryKey, onCategorySelect }: BudgetSankeyGraphProps) => {
    const muiTheme = useTheme();
    const theme = useAtomValue(themeAtom);
    const titleColor = theme.mode === "light" ? "black" : "white";

    const { nodes, data } = useMemo(
      () => buildBudgetSankeyData(flow, getBudgetSankeyNodeColors(muiTheme)),
      [flow, muiTheme],
    );

    const options = useMemo<Highcharts.Options>(
      () => ({
        chart: {
          type: "sankey",
          height: 640,
          backgroundColor: "transparent",
          animation: { duration: 900, easing: "easeInOutSine" },
        },
        plotOptions: {
          sankey: {
            nodeWidth: 72,
            nodePadding: 14,
            borderWidth: 0,
            linkColorMode: "gradient",
            linkOpacity: 0.45,
            curveFactor: 0.65,
            minLinkWidth: 2,
            dataLabels: {
              nodeFormat:
                '{point.name}<br/><span style="font-size:10px;font-weight:normal;opacity:0.8">{point.sumFormatted}</span>',
              style: {
                fontSize: "12px",
                fontWeight: "600",
                color: "contrast",
                textOutline: "none",
              },
              padding: [4],
              borderRadius: 2,
            },
            tooltip: {
              pointFormat:
                "<b>{point.weightFormatted}</b>: {point.fromNode.name} → {point.toNode.name}",
              nodeFormat:
                "<b>{point.name}</b><br/><span style='font-size:11px'>{point.sumFormatted} total</span>",
            },
            point: {
              events: {
                click: function (this: Highcharts.Point) {
                  const node = this as Highcharts.Point & {
                    isNode?: boolean;
                    id?: string;
                  };

                  if (!node.isNode) {
                    return;
                  }

                  const nodeId = node.id ?? "";

                  if (
                    BUDGET_WITHHOLDING_NODE_LABELS.includes(
                      nodeId as (typeof BUDGET_WITHHOLDING_NODE_LABELS)[number],
                    ) ||
                    nodeId === GROSS_INCOME_NODE ||
                    nodeId === UNALLOCATED_NODE ||
                    nodeId === INCOME_NODE_LABELS.salary ||
                    nodeId === INCOME_NODE_LABELS.bonus ||
                    nodeId === INCOME_NODE_LABELS.stockAdj
                  ) {
                    onCategorySelect(null);
                    return;
                  }

                  if (isPayrollSankeyNode(nodeId)) {
                    onCategorySelect(PAYROLL_CATEGORY_KEY);
                    return;
                  }

                  if (isCategorySankeyNode(nodeId, flow.categories)) {
                    const category = flow.categories.find(
                      ({ heading }) => heading === nodeId,
                    );
                    onCategorySelect(category?.categoryKey ?? null);
                  }
                },
              },
            },
          },
        },
        responsive: {
          rules: [
            {
              condition: { maxWidth: 600 },
              chartOptions: {
                plotOptions: {
                  sankey: { nodeWidth: 50 },
                },
              },
            },
          ],
        },
      }),
      [flow.categories, onCategorySelect],
    );

    const seriesData = useMemo(
      () =>
        data.map((link) => ({
          ...link,
          weightFormatted: formatCurrency(link.weight),
        })),
      [data],
    );

    const seriesNodes = useMemo(
      () =>
        nodes.map((node) => {
          const nodeSum = getSankeyNodeSum(node.id, data);

          return {
            ...node,
            sumFormatted: formatCurrency(nodeSum),
            className:
              selectedCategoryKey &&
              (flow.categories.find(({ heading }) => heading === node.id)
                ?.categoryKey === selectedCategoryKey ||
                (selectedCategoryKey === PAYROLL_CATEGORY_KEY &&
                  isPayrollSankeyNode(node.id)))
                ? "budget-sankey-selected"
                : undefined,
          };
        }),
      [data, flow.categories, nodes, selectedCategoryKey],
    );

    return (
      <figure style={{ margin: 0, width: "100%" }}>
        <Chart highcharts={Highcharts} options={options}>
          <Accessibility enabled={true} />
          <Credits enabled={false} />
          <Title style={{ color: titleColor }}>Budget Flow (Annual)</Title>
          <XAxis visible={false} />
          <YAxis visible={false} />
          <Series
            options={{
              name: "Budget Flow (Annual)",
              keys: ["from", "to", "weight"],
              nodes: seriesNodes,
            }}
            data={seriesData}
            type="sankey"
          />
        </Chart>
      </figure>
    );
  },
);

BudgetSankeyGraph.displayName = "BudgetSankeyGraph";

export default BudgetSankeyGraph;
