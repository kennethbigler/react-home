type SankeyNode = {
  options: { order?: number };
  linksFrom: SankeyLink[];
  linksTo: SankeyLink[];
};

type SankeyLink = {
  toNode?: SankeyNode;
  fromNode?: SankeyNode;
};

const { originalCreateNodeColumns } = vi.hoisted(() => ({
  originalCreateNodeColumns: vi.fn(),
}));

vi.mock("highcharts/highcharts-more", () => ({}));
vi.mock("highcharts/modules/sankey", () => ({}));

vi.mock("../coreHighcharts", () => ({
  default: {
    seriesTypes: {
      sankey: {
        prototype: {
          createNodeColumns: originalCreateNodeColumns,
        },
      },
    },
  },
}));

import Highcharts from "../sankeyHighcharts";

type SankeyNodeColumn = SankeyNode[];

type SankeySeriesPrototype = {
  createNodeColumns: (
    this: { nodes: SankeyNode[] },
    ...args: unknown[]
  ) => SankeyNodeColumn[];
};

const getSankeyCreateNodeColumns = () =>
  (
    Highcharts as unknown as {
      seriesTypes: { sankey: { prototype: SankeySeriesPrototype } };
    }
  ).seriesTypes.sankey.prototype.createNodeColumns;

describe("common | highcharts | sankeyHighcharts", () => {
  it("sorts node columns and link order by options.order", () => {
    const nodeFirst: SankeyNode = {
      options: { order: 1 },
      linksFrom: [],
      linksTo: [],
    };
    const nodeSecond: SankeyNode = {
      options: { order: 2 },
      linksFrom: [],
      linksTo: [],
    };
    const nodeThird: SankeyNode = {
      options: { order: 3 },
      linksFrom: [],
      linksTo: [],
    };

    const linkToThird: SankeyLink = {
      toNode: nodeThird,
      fromNode: nodeFirst,
    };
    const linkToSecond: SankeyLink = {
      toNode: nodeSecond,
      fromNode: nodeFirst,
    };
    const linkSecondToThird: SankeyLink = {
      toNode: nodeThird,
      fromNode: nodeSecond,
    };

    nodeFirst.linksFrom = [linkToThird, linkToSecond];
    nodeSecond.linksFrom = [linkSecondToThird];
    nodeSecond.linksTo = [linkToSecond];
    nodeThird.linksTo = [linkSecondToThird, linkToThird];

    originalCreateNodeColumns.mockReturnValue([
      [nodeThird, nodeFirst, nodeSecond],
    ]);

    const series = { nodes: [nodeFirst, nodeSecond, nodeThird] };
    const columns = getSankeyCreateNodeColumns().call(series);

    expect(columns[0]).toEqual([nodeFirst, nodeSecond, nodeThird]);
    expect(nodeFirst.linksFrom).toEqual([linkToSecond, linkToThird]);
    expect(nodeFirst.linksTo).toEqual([]);
    expect(nodeThird.linksTo).toEqual([linkToThird, linkSecondToThird]);
  });

  it("treats missing order as zero when sorting", () => {
    const withOrder: SankeyNode = {
      options: { order: 5 },
      linksFrom: [],
      linksTo: [],
    };
    const withoutOrder: SankeyNode = {
      options: {},
      linksFrom: [],
      linksTo: [],
    };

    originalCreateNodeColumns.mockReturnValue([[withOrder, withoutOrder]]);

    const columns = getSankeyCreateNodeColumns().call({
      nodes: [withOrder, withoutOrder],
    });

    expect(columns[0]).toEqual([withoutOrder, withOrder]);
  });
});
