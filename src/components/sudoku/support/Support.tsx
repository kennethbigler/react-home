import { memo } from "react";
import {
  Box,
  Link,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { SUPPORT_EMAIL } from "../constants";

const Support = memo(() => (
  <Box sx={{ maxWidth: 800, margin: "auto" }}>
    <Typography variant="h2" component="h1">
      Sudoku 16x16 Support
    </Typography>
    <Typography variant="body1" sx={{ my: 2 }}>
      Questions, bug reports, or feedback? Email us at{" "}
      <Link href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</Link>. Please
      include your device and iOS or macOS version.
    </Typography>
    <Typography variant="h4" component="h2" sx={{ mt: 3 }}>
      Common answers
    </Typography>
    <List>
      <ListItem>
        <ListItemText
          primary="Restore a purchase"
          secondary="Open Settings (gear icon), tap Premium Settings, then Restore Purchases."
        />
      </ListItem>
      <ListItem>
        <ListItemText
          primary="Hints and mistakes"
          secondary="Each game includes 3 hints and 3 mistakes. Unlimited hints, unlimited mistakes, AI Notes, and custom appearances are optional in-app purchases."
        />
      </ListItem>
      <ListItem>
        <ListItemText
          primary="A puzzle is taking a while to load"
          secondary="Very Hard 16×16 puzzles can take a few seconds to build. The “Building…” indicator means it is working."
        />
      </ListItem>
    </List>
  </Box>
));

Support.displayName = "SudokuSupport";
export default Support;
