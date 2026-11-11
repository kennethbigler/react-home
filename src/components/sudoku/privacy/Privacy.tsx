import { memo } from "react";
import { Box, Link, Typography } from "@mui/material";
import { SUPPORT_EMAIL } from "../constants";

const Privacy = memo(() => (
  <Box sx={{ maxWidth: 800, margin: "auto" }}>
    <Typography variant="h2" component="h1">
      Privacy Policy
    </Typography>
    <Typography variant="body1" sx={{ my: 2 }}>
      <strong>Effective date:</strong> November 10, 2026
    </Typography>
    <Typography variant="body1" sx={{ mb: 2 }}>
      Sudoku 16x16 (“the App”) is developed by Kenneth Bigler.
    </Typography>
    <Typography variant="h4" component="h2">
      Data we collect
    </Typography>
    <Typography variant="body1" sx={{ mb: 2 }}>
      None. The App does not collect, store, transmit, or share any personal
      information. It does not require an account, does not use analytics or
      advertising, and does not track you across apps or websites.
    </Typography>
    <Typography variant="h4" component="h2">
      Data stored on your device
    </Typography>
    <Typography variant="body1" sx={{ mb: 2 }}>
      Your game progress, settings, and preferences are stored only on your
      device. Deleting the App deletes them.
    </Typography>
    <Typography variant="h4" component="h2">
      In-app purchases
    </Typography>
    <Typography variant="body1" sx={{ mb: 2 }}>
      Purchases are processed by Apple through the App Store. The developer does
      not receive or store your payment information.
    </Typography>
    <Typography variant="h4" component="h2">
      Children’s privacy
    </Typography>
    <Typography variant="body1" sx={{ mb: 2 }}>
      The App does not knowingly collect personal information from children or
      anyone else.
    </Typography>
    <Typography variant="h4" component="h2">
      Changes to this policy
    </Typography>
    <Typography variant="body1" sx={{ mb: 2 }}>
      If this policy changes, the updated version will be posted on this page.
    </Typography>
    <Typography variant="h4" component="h2">
      Contact
    </Typography>
    <Typography variant="body1">
      Questions about this policy can be sent to{" "}
      <Link href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</Link>.
    </Typography>
  </Box>
));

Privacy.displayName = "SudokuPrivacy";
export default Privacy;
