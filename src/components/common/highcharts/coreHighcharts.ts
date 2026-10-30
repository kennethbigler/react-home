import Highcharts from "highcharts/esm/highcharts.src.js";
import "highcharts/esm/modules/accessibility.src.js";
import { setHighcharts } from "@highcharts/react";

// Only the chart container is a landmark; series are groups. The default
// ("all") makes every series a region, so same-named series across charts
// (e.g. "Ferrari") create duplicate landmarks (axe landmark-unique).
Highcharts.setOptions({ accessibility: { landmarkVerbosity: "one" } });

setHighcharts(Highcharts);

export default Highcharts;
