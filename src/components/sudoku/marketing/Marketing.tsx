import { memo } from "react";
import { Link as RouterLink } from "react-router";
import {
  Box,
  Link,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";

const Marketing = memo(() => (
  <Box sx={{ maxWidth: 800, margin: "auto" }}>
    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
      <Box
        component="img"
        src="/sudoku/app-icon.png"
        alt="Sudoku 16x16 app icon"
        sx={{ width: 96, height: 96, borderRadius: 3 }}
      />
      <Typography variant="h2" component="h1">
        Sudoku 16x16
      </Typography>
    </Box>
    <Typography variant="h5" component="p" sx={{ mb: 3 }}>
      The classic puzzle, but bigger.
    </Typography>
    <Box
      component="img"
      src="/sudoku/header.webp"
      alt="Sudoku 16x16 gameplay on iPad"
      sx={{ width: "100%", height: "auto", borderRadius: 2, mb: 3 }}
    />
    <Typography variant="body1" sx={{ mb: 2 }}>
      Play Sudoku on a classic 9×9 board or a 16×16 hex board with symbols 0–9
      and A–F. Four difficulties, from Easy to Very Hard — every puzzle except
      Very Hard is solvable by logic alone.
    </Typography>
    <List>
      <ListItem>
        <ListItemText
          primary="Hints that teach"
          secondary="Every hint names the technique and shows you which notes to remove."
        />
      </ListItem>
      <ListItem>
        <ListItemText
          primary="Notes and AI Notes"
          secondary="Track candidates by hand, or let AI Notes fill them in for you."
        />
      </ListItem>
      <ListItem>
        <ListItemText
          primary="Made for iPhone Duo"
          secondary="Adapts to folded, docked, and laptop layouts."
        />
      </ListItem>
      <ListItem>
        <ListItemText
          primary="iPhone, iPad, and Mac"
          secondary="One app, everywhere you play."
        />
      </ListItem>
    </List>
    <Box
      component="img"
      src="/sudoku/search-results.webp"
      alt="Sudoku 16x16 gameplay on iPad in landscape"
      sx={{ width: "100%", height: "auto", borderRadius: 2, my: 3 }}
    />
    <Typography variant="body1" sx={{ mb: 2 }}>
      Available soon on the App Store for iPhone, iPad, and Mac. Optional in-app
      purchases add unlimited hints, unlimited mistakes, AI Notes, and custom
      appearances.
    </Typography>
    <Typography variant="body1">
      Need help? Visit the{" "}
      <Link component={RouterLink} to="/sudoku/support">
        Support page
      </Link>{" "}
      or read the{" "}
      <Link component={RouterLink} to="/sudoku/privacy">
        Privacy Policy
      </Link>
      .
    </Typography>
  </Box>
));

Marketing.displayName = "SudokuMarketing";

export default Marketing;
