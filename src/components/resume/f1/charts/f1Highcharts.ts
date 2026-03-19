/**
 * Single Highcharts entry for F1 charts. Production (Rollup) can reorder side-effect
 * imports across files in the same chunk; one module keeps core → modules → setHighcharts order.
 */
import Highcharts from "highcharts/highcharts.src";
import "highcharts/highcharts-more";
import "highcharts/modules/sankey";
import "highcharts/modules/accessibility";
import { setHighcharts } from "@highcharts/react";

setHighcharts(Highcharts);

export default Highcharts;
