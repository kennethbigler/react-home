import * as React from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

interface TrackStatsProps {
  circuitName: string;
  imgSrc: string;
  circuitSubName?: string;
  circuitLength: number;
  firstGrandPrix: number;
  numberOfLaps: number;
  fastestLapTime: string;
  fastestLapDriver: string;
  raceDistance: number;
}

const txtStyles: React.CSSProperties = {
  display: "block",
  margin: "auto",
  textAlign: "center",
};
const imgSize = { xs: 12, sm: 6, md: 4, lg: 3, xl: 2, xxl: 1 };

// TODO: maybe add on click to expand the track to 12? Or add way to choose size

const TrackStats = React.memo(
  ({
    circuitName,
    imgSrc,
    circuitSubName,
    circuitLength,
    firstGrandPrix,
    numberOfLaps,
    fastestLapTime,
    fastestLapDriver,
    raceDistance,
  }: TrackStatsProps) => (
    <Grid size={imgSize}>
      <Typography variant="h6" sx={txtStyles}>
        {circuitName}
      </Typography>
      {circuitSubName && (
        <Typography sx={txtStyles}>{circuitSubName}</Typography>
      )}
      <img src={imgSrc} alt="" width="100%" />
      <Typography>
        Circuit Length: <b>{circuitLength}km</b>
        <br />
        First Grand Prix: <b>{firstGrandPrix}</b>
        <br />
        Number of Laps: <b>{numberOfLaps}</b>
        <br />
        Fastest lap time: <b>{fastestLapTime}</b>
        <br />
        &nbsp;&nbsp;- {fastestLapDriver}
        <br />
        Race Distance: <b>{raceDistance}km</b>
      </Typography>
    </Grid>
  ),
);

TrackStats.displayName = "TrackStats";

export default TrackStats;
