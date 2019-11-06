import React from 'react';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Typography } from '@material-ui/core';
import { DBDota2Phase } from '../../../store/types';

interface LineupProps {
  order: DBDota2Phase[];
  resetLineup: Function;
  removeLineup: Function;
  i: number;
}

const Lineup: React.FC<LineupProps> = (props: LineupProps) => {
  const renderTable = (): React.ReactNode[] => {
    const { order } = props;
    return order.map((turn) => (
      <TableRow key={turn.name} hover>
        <TableCell>{turn.name}</TableCell>
        <TableCell>{turn.radiant.number}</TableCell>
        <TableCell>{turn.radiant.selection}</TableCell>
        <TableCell>{turn.dire.number}</TableCell>
        <TableCell>{turn.dire.selection}</TableCell>
      </TableRow>
    ));
  };

  const { resetLineup, removeLineup, i } = props;
  return (
    <ExpansionPanel defaultExpanded>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}><Typography variant="h5">{`Game ${i + 1}`}</Typography></ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <Table padding="none">
          <TableHead>
            <TableRow>
              <TableCell>Turn</TableCell>
              <TableCell colSpan={2}>Radiant</TableCell>
              <TableCell colSpan={2}>Dire</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {renderTable()}
          </TableBody>
        </Table>
      </ExpansionPanelDetails>
      <Button color="primary" fullWidth onClick={(): void => resetLineup(i)} variant="contained">Reset</Button>
      <Button color="secondary" fullWidth onClick={(): void => removeLineup(i)} variant="contained">Remove</Button>
    </ExpansionPanel>
  );
};

export default Lineup;
