import * as React from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";

interface TrackProps {
  circuitLen: number;
  circuitName: string;
  circuitSubName?: string;
  expanded: string;
  fastLapDriver: string;
  fastLapTime: string;
  firstGP: number;
  imgSrc: string;
  numLaps: number;
  raceLen: number;
  onClick: (circuitName: string) => () => void;
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
    expanded,
    fastLapDriver,
    fastLapTime,
    firstGP,
    imgSrc,
    numLaps,
    raceLen,
    onClick,
  }: TrackProps) => {
    const isExpanded = expanded === circuitName;
    return (
      <Grid
        size={isExpanded ? 12 : imgSize}
        sx={isExpanded ? { textAlign: "center" } : {}}
      >
        <Typography variant={isExpanded ? "h3" : "h5"} sx={txtStyles}>
          {circuitName}
        </Typography>
        {circuitSubName && (
          <Typography variant={isExpanded ? "h4" : "body2"} sx={txtStyles}>
            {circuitSubName}
          </Typography>
        )}
        <IconButton onClick={onClick(circuitName)}>
          <img src={imgSrc} alt="" width="100%" />
        </IconButton>
        <Grid container>
          <Grid size={6}>
            <Typography variant={isExpanded ? "h5" : "body2"}>
              Circuit Length
            </Typography>
            <Typography sx={bold}>{circuitLen}km</Typography>
            <Typography variant={isExpanded ? "h5" : "body2"}>
              First Grand Prix
            </Typography>
            <Typography sx={bold}>{firstGP}</Typography>
            <Typography variant={isExpanded ? "h5" : "body2"}>
              Number of Laps
            </Typography>
            <Typography sx={bold}>{numLaps}</Typography>
          </Grid>
          <Grid size={6}>
            <Typography variant={isExpanded ? "h5" : "body2"}>
              Fastest lap time
            </Typography>
            <Typography sx={bold}>{fastLapTime}</Typography>
            <Typography variant="body2">{fastLapDriver}</Typography>
            <br />
            <Typography variant={isExpanded ? "h5" : "body2"}>
              Race Distance
            </Typography>
            <Typography sx={bold}>{raceLen}km</Typography>
          </Grid>
        </Grid>
      </Grid>
    );
  },
);

Track.displayName = "Track";

export default Track;
