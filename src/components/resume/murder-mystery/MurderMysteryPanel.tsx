import React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import nl2br from 'react-newline-to-break';
import { Typography } from '@mui/material';
import LabelTableCell from './LabelTableCell';

interface MurderMysteryPanelProps {
  expanded?: string;
  expandedKey: string;
  handleChange: (panel: string) => (_event: React.SyntheticEvent<Element, Event>, exp?: boolean) => void;
  role: string;
  importance: string;
  gender: string;
  description: string;
  hint: string;
  clue: string;
}

const containerStyles: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  width: '95%',
};
const itemStyles: React.CSSProperties = { display: 'flex' };

const MurderMysteryPanel: React.FC<MurderMysteryPanelProps> = React.memo((props: MurderMysteryPanelProps) => {
  const {
    expanded, expandedKey, handleChange, role,
    importance, gender, description, hint, clue,
  } = props;

  return (
    <Accordion expanded={expanded === expandedKey} onChange={handleChange(expandedKey)}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <div style={containerStyles}>
          <Typography style={itemStyles}>{role}</Typography>
          <Typography style={itemStyles}>{importance}</Typography>
        </div>
      </AccordionSummary>
      <AccordionDetails>
        <Table>
          <TableBody>
            <TableRow>
              <LabelTableCell>Gender</LabelTableCell>
              <TableCell>{gender}</TableCell>
            </TableRow>
            <TableRow>
              <LabelTableCell>Description</LabelTableCell>
              <TableCell>{nl2br(description)}</TableCell>
            </TableRow>
            {hint && (
              <TableRow>
                <LabelTableCell>Hint</LabelTableCell>
                <TableCell>{nl2br(hint)}</TableCell>
              </TableRow>
            )}
            <TableRow>
              <LabelTableCell>Clue</LabelTableCell>
              <TableCell>{nl2br(clue)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </AccordionDetails>
    </Accordion>
  );
});

export default MurderMysteryPanel;
