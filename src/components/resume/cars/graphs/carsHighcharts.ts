/**
 * Single Highcharts entry for Cars charts. Gauge/sankey/polar-style charts need more + sankey.
 */
import Highcharts from "highcharts/highcharts.src";
import "highcharts/highcharts-more";
import "highcharts/modules/sankey";
import "highcharts/modules/accessibility";
import { setHighcharts } from "@highcharts/react";

setHighcharts(Highcharts);

export default Highcharts;
