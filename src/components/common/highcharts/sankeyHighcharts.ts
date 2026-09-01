import Highcharts from "./coreHighcharts";
import "highcharts/highcharts-more";
import "highcharts/modules/sankey";

type SankeyNode = {
  options: { order?: number };
  linksFrom: SankeyLink[];
  linksTo: SankeyLink[];
};
type SankeyLink = {
  toNode?: SankeyNode;
  fromNode?: SankeyNode;
};
type SankeyNodeColumn = SankeyNode[];
type SankeySeriesPrototype = {
  createNodeColumns: (
    this: { nodes: SankeyNode[] },
    ...args: unknown[]
  ) => SankeyNodeColumn[];
};

const sankeyPrototype = (
  Highcharts as unknown as {
    seriesTypes: { sankey: { prototype: SankeySeriesPrototype } };
  }
).seriesTypes.sankey.prototype;

const getNodeOrder = (node?: SankeyNode) => node?.options.order ?? 0;

const sortSankeyLinksByNodeOrder = (nodes: SankeyNode[]) => {
  for (const node of nodes) {
    node.linksFrom.sort(
      (a, b) => getNodeOrder(a.toNode) - getNodeOrder(b.toNode),
    );
    node.linksTo.sort(
      (a, b) => getNodeOrder(a.fromNode) - getNodeOrder(b.fromNode),
    );
  }
};

// Sort sankey nodes within each column when an `order` option is set, then
// reorder each node's links to match so ports align with node positions.
// https://github.com/highcharts/highcharts/issues/11527#issuecomment-517244432
const { createNodeColumns } = sankeyPrototype;

sankeyPrototype.createNodeColumns = function (...args: unknown[]) {
  const columns = createNodeColumns.apply(this, args);

  columns.forEach((column: SankeyNodeColumn) => {
    column.sort((a: SankeyNode, b: SankeyNode) => {
      return getNodeOrder(a) - getNodeOrder(b);
    });
  });

  sortSankeyLinksByNodeOrder(this.nodes);

  return columns;
};

export default Highcharts;
