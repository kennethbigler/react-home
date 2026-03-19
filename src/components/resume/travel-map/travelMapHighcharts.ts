/**
 * Single Highcharts entry for Travel Map (core charts). WorldMap uses highmaps separately.
 * Polar (LoyaltyCharts), sankey (CruiseCharts), and areaspline need core + more + sankey in order.
 */
import Highcharts from "highcharts/highcharts.src";
import "highcharts/highcharts-more";
import "highcharts/modules/sankey";
import "highcharts/modules/accessibility";
import { setHighcharts } from "@highcharts/react";

setHighcharts(Highcharts);

export default Highcharts;
