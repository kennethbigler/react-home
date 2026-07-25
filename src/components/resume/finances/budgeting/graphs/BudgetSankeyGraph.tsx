import { useAtomValue } from "jotai";
import { useTheme } from "@mui/material/styles";
import { Chart, Credits, Series, Title, XAxis, YAxis } from "@highcharts/react";
import { Accessibility } from "@highcharts/react/modules/Accessibility";
import Highcharts from "../../../../common/highcharts/sankeyHighcharts";
import themeAtom from "../../../../../jotai/theme-atom";
import usDollar from "../../../../../apis/usDollar";
import type { BudgetFlow, CategoryTotal } from "../../../../../apis/budget";
import {
  buildBudgetSankeyData,
  BUDGET_WITHHOLDING_NODE_LABELS,
  getSankeyNodeClassName,
  getSankeyNodeSum,
  GROSS_INCOME_NODE,
  INCOME_NODE_LABELS,
  isCategorySankeyNode,
  isPayrollSankeyNode,
  PAYROLL_CATEGORY_KEY,
  UNALLOCATED_NODE,
} from "./chartData";
import { getBudgetSankeyNodeColors } from "./chartColors";

interface BudgetSankeyGraphProps {
  flow: BudgetFlow;
  selectedCategoryKey?: string | null;
  onCategorySelect: (categoryKey: string | null) => void;
}

type SankeyClickPoint = Highcharts.Point & {
  isNode?: boolean;
  id?: string;
};

const formatCurrency = (value: number) => usDollar.format(value);

/** Nodes that clear category selection when clicked (income, tax, unallocated). */
const CLEAR_SELECTION_NODE_IDS = new Set<string>([
  ...BUDGET_WITHHOLDING_NODE_LABELS,
  GROSS_INCOME_NODE,
  UNALLOCATED_NODE,
  ...Object.values(INCOME_NODE_LABELS),
]);

/**
 * Static Sankey options — same visual pattern as Car/Cruise sankeys.
 * Values that differ from Highcharts defaults are intentional styling;
 * `borderWidth` is omitted (default is already 0).
 */
const chartOptions: Highcharts.Options = {
  chart: {
    type: "sankey",
    height: 640,
    backgroundColor: "transparent",
    animation: { duration: 900, easing: "easeInOutSine" },
  },
  plotOptions: {
    sankey: {
      nodeWidth: 80,
      nodePadding: 14,
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
};

const handleSankeyNodeClick = (
  point: SankeyClickPoint,
  categories: CategoryTotal[],
  onCategorySelect: (categoryKey: string | null) => void,
) => {
  if (!point.isNode) {
    return;
  }

  const nodeId = point.id ?? "";

  if (!nodeId) {
    return;
  }

  if (CLEAR_SELECTION_NODE_IDS.has(nodeId)) {
    onCategorySelect(null);
    return;
  }

  if (isPayrollSankeyNode(nodeId)) {
    onCategorySelect(PAYROLL_CATEGORY_KEY);
    return;
  }

  if (isCategorySankeyNode(nodeId, categories)) {
    const category = categories.find(({ heading }) => heading === nodeId);
    onCategorySelect(category?.categoryKey ?? null);
  }
};

const BudgetSankeyGraph = ({
  flow,
  selectedCategoryKey,
  onCategorySelect,
}: BudgetSankeyGraphProps) => {
  const muiTheme = useTheme();
  const theme = useAtomValue(themeAtom);
  const titleColor = theme.mode === "light" ? "black" : "white";

  const { nodes, data } = buildBudgetSankeyData(
    flow,
    getBudgetSankeyNodeColors(muiTheme),
  );

  const options: Highcharts.Options = {
    ...chartOptions,
    plotOptions: {
      ...chartOptions.plotOptions,
      sankey: {
        ...chartOptions.plotOptions?.sankey,
        point: {
          events: {
            click() {
              handleSankeyNodeClick(
                this as SankeyClickPoint,
                flow.categories,
                onCategorySelect,
              );
            },
          },
        },
      },
    },
  };

  const seriesData = data.map((link) => ({
    ...link,
    weightFormatted: formatCurrency(link.weight),
  }));

  const seriesNodes = nodes.map((node) => {
    const nodeSum = getSankeyNodeSum(node.id, data);
    const className = getSankeyNodeClassName(
      node.id,
      flow.categories,
      selectedCategoryKey,
    );

    return {
      ...node,
      sumFormatted: formatCurrency(nodeSum),
      className,
      borderColor: className ? muiTheme.palette.text.primary : undefined,
      borderWidth: className ? 3 : undefined,
    };
  });

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
};

BudgetSankeyGraph.displayName = "BudgetSankeyGraph";

export default BudgetSankeyGraph;
