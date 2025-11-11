import { memo, CSSProperties } from "react";
import { Grid, Typography, IconButton } from "@mui/material";

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

const txtStyles: CSSProperties = {
  display: "block",
  margin: "auto",
  textAlign: "center",
};
const bold: CSSProperties = { fontWeight: "bold" };

const Track = memo(
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
        size={
          isExpanded
            ? { xs: 12, xxl: 6, xxxl: 3 }
            : { xs: 12, md: 6, lg: 4, xl: 3, xxl: 2, xxxl: 1 }
        }
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
          <img src={imgSrc} alt={`${circuitName} track layout`} width="100%" />
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
