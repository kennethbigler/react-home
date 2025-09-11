import * as React from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

interface TrackProps {
  circuitLen: number;
  circuitName: string;
  circuitSubName?: string;
  fastLapDriver: string;
  fastLapTime: string;
  firstGP: number;
  imgSrc: string;
  numLaps: number;
  raceLen: number;
}

const txtStyles: React.CSSProperties = {
  display: "block",
  margin: "auto",
  textAlign: "center",
};
const imgSize = { xs: 12, sm: 6, md: 4, lg: 3, xl: 2, xxl: 1 };

// TODO: maybe add on click to expand the track to 12? Or add way to choose size

const Track = React.memo(
  ({
    circuitLen,
    circuitName,
    circuitSubName,
    fastLapDriver,
    fastLapTime,
    firstGP,
    imgSrc,
    numLaps,
    raceLen,
  }: TrackProps) => (
    <Grid size={imgSize}>
      <Typography variant="h6" sx={txtStyles}>
        {circuitName}
      </Typography>
      {circuitSubName && (
        <Typography sx={txtStyles}>{circuitSubName}</Typography>
      )}
      <img src={imgSrc} alt="" width="100%" />
      <Typography>
        Circuit Length: <b>{circuitLen}km</b>
        <br />
        First Grand Prix: <b>{firstGP}</b>
        <br />
        Number of Laps: <b>{numLaps}</b>
        <br />
        Fastest lap time: <b>{fastLapTime}</b>
        <br />
        &nbsp;&nbsp;- {fastLapDriver}
        <br />
        Race Distance: <b>{raceLen}km</b>
      </Typography>
    </Grid>
  ),
);

Track.displayName = "Track";

export default Track;
