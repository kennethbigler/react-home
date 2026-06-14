import { memo, CSSProperties } from "react";
import { Grid, Typography, IconButton, useTheme } from "@mui/material";

export interface TrackData {
  circuitLen: number;
  circuitName: string;
  circuitSubName?: string;
  firstGP: number;
  imgSrc: string;
  next?: boolean;
  numLaps: number;
  raceLen: number;
  skipped?: boolean;
}

interface TrackProps extends TrackData {
  expanded: string;
  onClick: (circuitName: string) => () => void;
}

const bold: CSSProperties = { fontWeight: "bold" };

const Track = memo(
  ({
    circuitLen,
    circuitName,
    circuitSubName,
    expanded,
    firstGP,
    imgSrc,
    next,
    numLaps,
    raceLen,
    skipped,
    onClick,
  }: TrackProps) => {
    const muiTheme = useTheme();
    const isExpanded = expanded === circuitName;

    const gridStyles: CSSProperties = {};
    const headingStyles: CSSProperties = {
      display: "block",
      margin: "auto",
      textAlign: "center",
    };
    const txtStyles: CSSProperties = {};
    if (isExpanded) {
      gridStyles.textAlign = "center";
    }
    if (skipped || next) {
      const highlightColor = skipped
        ? muiTheme.palette.error.main
        : muiTheme.palette.info.main;
      gridStyles.border = `2px solid ${highlightColor}`;
      gridStyles.padding = "2px";
      headingStyles.color = highlightColor;
      txtStyles.color = highlightColor;
    }

    return (
      <Grid
        size={
          isExpanded
            ? { xs: 12, xxl: 6, xxxl: 3 }
            : { xs: 12, md: 6, lg: 4, xl: 3, xxl: 2, xxxl: 1 }
        }
        sx={gridStyles}
      >
        <Typography
          component="h2"
          variant={isExpanded ? "h3" : "h5"}
          sx={headingStyles}
        >
          {circuitName}
        </Typography>
        {circuitSubName && (
          <Typography
            component="h3"
            variant={isExpanded ? "h4" : "body2"}
            sx={headingStyles}
          >
            {circuitSubName}
          </Typography>
        )}
        <IconButton
          aria-expanded={isExpanded}
          aria-label={`${isExpanded ? "Collapse" : "Expand"} ${circuitName} circuit details`}
          onClick={onClick(circuitName)}
        >
          <img
            src={imgSrc}
            alt={`${circuitName} track layout`}
            loading="lazy"
            decoding="async"
            style={{ width: "100%", height: "auto" }}
          />
        </IconButton>
        <Grid container>
          <Grid size={6}>
            <Typography variant={isExpanded ? "h5" : "body2"} sx={txtStyles}>
              First Grand Prix
            </Typography>
            <Typography sx={{ ...bold, ...txtStyles }}>{firstGP}</Typography>
            <Typography variant={isExpanded ? "h5" : "body2"} sx={txtStyles}>
              Number of Laps
            </Typography>
            <Typography sx={{ ...bold, ...txtStyles }}>{numLaps}</Typography>
          </Grid>
          <Grid size={6}>
            <Typography variant={isExpanded ? "h5" : "body2"} sx={txtStyles}>
              Circuit Length
            </Typography>
            <Typography sx={{ ...bold, ...txtStyles }}>
              {circuitLen}km
            </Typography>
            <Typography variant={isExpanded ? "h5" : "body2"} sx={txtStyles}>
              Race Distance
            </Typography>
            <Typography sx={{ ...bold, ...txtStyles }}>{raceLen}km</Typography>
          </Grid>
        </Grid>
      </Grid>
    );
  },
);

Track.displayName = "Track";

export default Track;
