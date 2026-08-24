import { useMemo, useState } from "react";
import { useAtomValue } from "jotai";
import { useTheme } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import { Button, ButtonGroup } from "@mui/material";
import { Chart, Credits, Series, Title, Tooltip } from "@highcharts/react";
import { Accessibility } from "@highcharts/react/modules/Accessibility";
import Highcharts from "../../common/highcharts/coreHighcharts";
import themeAtom from "../../../jotai/theme-atom";
import {
  formatRoleList,
  getLieSeries,
  type LieSeriesPoint,
} from "./botcHelpers";
import type { ActiveScript } from "../../../jotai/botc-atom";
import { MISINFO, getRoleBySlug } from "../../../constants/botc-slug-map";
import { getScriptDemonSlugs } from "../../../utils/botc-script-utils";

interface LiePieProps {
  numPlayers: number;
  numTravelers: number;
  script: ActiveScript;
}

const staticOptions: Highcharts.Options = {
  chart: {
    type: "pie",
    inverted: true,
    backgroundColor: "transparent",
    style: { marginLeft: "auto", marginRight: "auto" },
  },
  plotOptions: {
    pie: {
      dataLabels: [
        { enabled: true, distance: 20, style: { fontSize: "1.2em" } },
        {
          enabled: true,
          distance: -40,
          format: "{point.percentage:.1f}%",
          style: { fontSize: "1.2em" },
        },
      ],
    },
  },
};

const LiePie = ({ numPlayers, numTravelers, script }: LiePieProps) => {
  const muiTheme = useTheme();
  const theme = useAtomValue(themeAtom);
  const color = theme.mode === "light" ? "black" : "white";

  const demonSlugs = useMemo(() => getScriptDemonSlugs(script), [script]);
  const [selectedDemon, setSelectedDemon] = useState("");
  const activeDemon =
    selectedDemon && demonSlugs.includes(selectedDemon)
      ? selectedDemon
      : (demonSlugs[0] ?? "");

  const lieSeries = useMemo(
    () => getLieSeries(numPlayers, numTravelers, script, activeDemon),
    [numPlayers, numTravelers, script, activeDemon],
  );

  const pieData = useMemo(() => {
    const sliceColors: Record<string, string> = {
      "😈": muiTheme.palette.error.main,
      [MISINFO.Poison]: muiTheme.palette.warning.main,
      [MISINFO.Madness]: muiTheme.palette.warning.main,
      [MISINFO.Drunk]: muiTheme.palette.warning.main,
      "🤥": muiTheme.palette.info.main,
      "✅": muiTheme.palette.success.main,
    };

    return lieSeries.map((point) => ({
      ...point,
      color: sliceColors[point.name],
    }));
  }, [
    lieSeries,
    muiTheme.palette.error.main,
    muiTheme.palette.warning.main,
    muiTheme.palette.info.main,
    muiTheme.palette.success.main,
  ]);

  const options = useMemo<Highcharts.Options>(() => staticOptions, []);

  const lieTooltipFormatter: Highcharts.TooltipFormatterCallbackFunction =
    function () {
      const { point } = this as unknown as {
        point: Highcharts.Point & { roles?: string[] };
      };
      const rolesLabel = formatRoleList(point.roles ?? []);
      const suffix = rolesLabel ? ` (${rolesLabel})` : "";
      return `${point.name}: <b>${point.y}</b>${suffix}`;
    };

  const showDemonSelection = demonSlugs.length > 1;

  return (
    <Grid
      container
      spacing={2}
      component="section"
      aria-label="Lie distribution"
    >
      {showDemonSelection && (
        <Grid
          size={{ xs: 12, sm: 12, md: 6 }}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ButtonGroup
            aria-label="Demon in play"
            color="error"
            sx={{
              flexWrap: "wrap",
              justifyContent: "center",
              width: "fit-content",
            }}
          >
            {demonSlugs.map((slug) => {
              const { role } = getRoleBySlug(slug);
              return (
                <Button
                  key={slug}
                  sx={
                    activeDemon === slug
                      ? undefined
                      : {
                          borderColor: "error.dark",
                          color: "error.dark",
                        }
                  }
                  variant={activeDemon === slug ? "contained" : "outlined"}
                  onClick={() => setSelectedDemon(slug)}
                  aria-label={role.name}
                  aria-pressed={activeDemon === slug}
                >
                  {role.icon} {role.name}
                </Button>
              );
            })}
          </ButtonGroup>
        </Grid>
      )}
      <Grid size={{ xs: 12, sm: 12, md: showDemonSelection ? 6 : 12 }}>
        <figure style={{ margin: 0, width: "100%" }}>
          <Chart highcharts={Highcharts} options={options}>
            <Accessibility enabled={true} />
            <Credits enabled={false} />
            <Tooltip useHTML={true} formatter={lieTooltipFormatter} />
            <Title style={{ color }}>Who is lying?</Title>
            <Series
              type="pie"
              options={{ name: "⛽️🔥❓" }}
              data={pieData as LieSeriesPoint[]}
            />
          </Chart>
        </figure>
      </Grid>
    </Grid>
  );
};

export default LiePie;
