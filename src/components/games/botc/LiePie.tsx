import { useMemo, useState } from "react";
import { useAtomValue } from "jotai";
import { useTheme } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import { Button, ButtonGroup } from "@mui/material";
import { Chart, Credits, Series, Title } from "@highcharts/react";
import { Accessibility } from "@highcharts/react/modules/Accessibility";
import Highcharts from "../../common/highcharts/coreHighcharts";
import themeAtom from "../../../jotai/theme-atom";
import { getLieSeries } from "./botcHelpers";
import type { ActiveScript } from "../../../jotai/botc-atom";
import { getRoleBySlug } from "../../../constants/botc-slug-map";
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

  const options = useMemo<Highcharts.Options>(
    () => ({
      ...staticOptions,
      colors: [
        muiTheme.palette.error.main,
        muiTheme.palette.warning.main,
        muiTheme.palette.info.main,
        muiTheme.palette.success.main,
      ],
    }),
    [
      muiTheme.palette.error.main,
      muiTheme.palette.warning.main,
      muiTheme.palette.info.main,
      muiTheme.palette.success.main,
    ],
  );

  return (
    <Grid
      container
      spacing={2}
      component="section"
      aria-label="Lie distribution"
    >
      {demonSlugs.length > 0 && (
        <Grid size={{ xs: 12, sm: 12, md: 6 }}>
          <ButtonGroup
            aria-label="Demon in play"
            sx={{ flexWrap: "wrap", display: "flex" }}
          >
            {demonSlugs.map((slug) => {
              const { role } = getRoleBySlug(slug);
              return (
                <Button
                  key={slug}
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
      <Grid size={{ xs: 12, sm: 12, md: 6 }}>
        <figure style={{ margin: 0, width: "100%" }}>
          <Chart highcharts={Highcharts} options={options}>
            <Accessibility enabled={true} />
            <Credits enabled={false} />
            <Title style={{ color }}>Who is lying?</Title>
            <Series type="pie" options={{ name: "⛽️🔥❓" }} data={lieSeries} />
          </Chart>
        </figure>
      </Grid>
    </Grid>
  );
};

export default LiePie;
