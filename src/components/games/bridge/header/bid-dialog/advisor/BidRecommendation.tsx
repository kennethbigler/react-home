import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import type { BidRecommendation as BidRecommendationType } from "./bidding-logic";

interface BidRecommendationProps {
  recommendation: BidRecommendationType;
}

const CONFIDENCE_COLOR: Record<string, "success" | "warning" | "error"> = {
  high: "success",
  medium: "warning",
  low: "error",
};

export default function BidRecommendation({
  recommendation: rec,
}: BidRecommendationProps) {
  const {
    bid,
    category,
    reasoning,
    handAnalysis,
    whatYourBidTellsPartner,
    expectedResponses,
    confidence,
    note,
    alternativeBid,
  } = rec;

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Recommended Bid
      </Typography>

      {/* Main bid display */}
      <Paper
        elevation={2}
        sx={{
          p: 2,
          mb: 2,
          display: "flex",
          alignItems: "center",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Typography
          variant="h4"
          component="span"
          fontWeight="bold"
          aria-label="Recommended bid"
        >
          {bid}
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
          <Typography variant="subtitle1" color="text.secondary">
            {category}
          </Typography>
          <Chip
            label={`Confidence: ${confidence.charAt(0).toUpperCase() + confidence.slice(1)}`}
            color={CONFIDENCE_COLOR[confidence]}
            size="small"
            aria-label={`Confidence level: ${confidence}`}
          />
        </Box>
      </Paper>

      {/* Hand analysis */}
      <Box mb={2}>
        <Typography variant="subtitle2" gutterBottom>
          Your Hand Analysis
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {handAnalysis.description}
        </Typography>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Why this bid */}
      <Box mb={2}>
        <Typography variant="subtitle2" gutterBottom>
          Why This Bid
        </Typography>
        <Typography variant="body2">{reasoning}</Typography>
      </Box>

      {/* What it tells partner */}
      <Box mb={2}>
        <Typography variant="subtitle2" gutterBottom>
          What It Tells Partner
        </Typography>
        <Typography variant="body2" color="primary.main">
          {whatYourBidTellsPartner}
        </Typography>
      </Box>

      {/* Alternative bid */}
      {alternativeBid && (
        <Box mb={2}>
          <Typography variant="subtitle2" gutterBottom>
            Alternative Bid
          </Typography>
          <Chip label={alternativeBid} variant="outlined" size="small" />
        </Box>
      )}

      {/* Note / caveat */}
      {note && (
        <Paper
          variant="outlined"
          sx={{
            p: 1.5,
            mb: 2,
            bgcolor: "warning.light",
            borderColor: "warning.main",
            color: "black",
          }}
        >
          <Typography variant="body2" role="note" sx={{ color: "black" }}>
            ⚠️ {note}
          </Typography>
        </Paper>
      )}

      {/* Expected partner responses accordion */}
      {expectedResponses.length > 0 && (
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="partner-responses-content"
            id="partner-responses-header"
          >
            <Typography variant="subtitle2">
              Expected Partner Responses ({expectedResponses.length})
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List dense disablePadding>
              {expectedResponses.map((resp, i) => (
                <ListItem key={i} sx={{ px: 0 }}>
                  <ListItemText
                    primary={
                      <Typography
                        variant="body2"
                        component="span"
                        fontWeight="bold"
                      >
                        {resp.partnerBid}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography variant="body2" component="span">
                          {" "}
                          {resp.meaning}
                        </Typography>
                        {resp.yourRebid && (
                          <Typography
                            variant="caption"
                            display="block"
                            color="primary.main"
                          >
                            Your rebid: {resp.yourRebid}
                          </Typography>
                        )}
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      )}
    </Box>
  );
}
