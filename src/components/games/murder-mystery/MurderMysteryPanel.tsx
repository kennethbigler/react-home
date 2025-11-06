import { SyntheticEvent } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Grid from "@mui/material/Grid";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import arr2br from "../../../apis/arr2br";

interface MurderMysteryPanelProps {
  expanded?: string;
  expandedKey: string;
  handleChange: (
    panel: string,
  ) => (_event: SyntheticEvent<Element, Event>, exp?: boolean) => void;
  role: string;
  gender: string;
  description?: string[];
  hint?: string[];
  clue?: string[];
}

const MurderMysteryPanel = ({
  expanded,
  expandedKey,
  handleChange,
  role,
  gender,
  description,
  hint,
  clue,
}: MurderMysteryPanelProps) => (
  <Grid size={12}>
    <Accordion
      expanded={expanded === expandedKey}
      onChange={handleChange(expandedKey)}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>{role}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Table aria-label={`role information for ${role}`}>
          <TableBody>
            <TableRow>
              <TableCell component="th" scope="row">
                Gender
              </TableCell>
              <TableCell>{gender}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                Description
              </TableCell>
              <TableCell>{arr2br(description)}</TableCell>
            </TableRow>
            {hint && (
              <TableRow>
                <TableCell component="th" scope="row">
                  Hint
                </TableCell>
                <TableCell>{arr2br(hint)}</TableCell>
              </TableRow>
            )}
            <TableRow>
              <TableCell component="th" scope="row">
                Clue
              </TableCell>
              <TableCell>{arr2br(clue)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </AccordionDetails>
    </Accordion>
  </Grid>
);

export default MurderMysteryPanel;
