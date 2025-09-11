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
const bold: React.CSSProperties = { fontWeight: "bold" };
const imgSize = { xs: 12, md: 6, lg: 4, xl: 3, xxl: 2, xxxl: 1 };

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
      <Typography variant="h5" sx={txtStyles}>
        {circuitName}
      </Typography>
      {circuitSubName && (
        <Typography variant="body2" sx={txtStyles}>
          {circuitSubName}
        </Typography>
      )}
      <img src={imgSrc} alt="" width="100%" />
      <Grid container>
        <Grid size={6}>
          <Typography variant="body2">
            Circuit Length
            <Typography sx={bold}>{circuitLen}km</Typography>
            First Grand Prix
            <Typography sx={bold}>{firstGP}</Typography>
            Number of Laps
            <Typography sx={bold}>{numLaps}</Typography>
          </Typography>
        </Grid>
        <Grid size={6}>
          <Typography variant="body2">
            Fastest lap time
            <Typography sx={bold}>{fastLapTime}</Typography>
            {fastLapDriver}
            <br />
            <br />
            Race Distance
            <Typography sx={bold}>{raceLen}km</Typography>
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  ),
);

Track.displayName = "Track";

export default Track;
