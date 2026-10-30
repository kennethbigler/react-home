import { setHighcharts } from "@highcharts/react";
import Highcharts from "highcharts/esm/highmaps.src.js";
import "highcharts/esm/modules/accessibility.src.js";

// See coreHighcharts: avoid duplicate series landmarks (axe landmark-unique).
Highcharts.setOptions({ accessibility: { landmarkVerbosity: "one" } });

setHighcharts(Highcharts);

export default Highcharts;
