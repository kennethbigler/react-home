import React, { Component } from 'react';
import types from 'prop-types';
import map from 'lodash/map';
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
// Parents: Popup

class Lineup extends Component {
  renderTable = () => {
    const { order } = this.props;
    return map(order, (turn) => (
      <TableRow key={turn.name} hover>
        <TableCell>{turn.name}</TableCell>
        <TableCell>{turn.radiant.number}</TableCell>
        <TableCell>{turn.radiant.selection}</TableCell>
        <TableCell>{turn.dire.number}</TableCell>
        <TableCell>{turn.dire.selection}</TableCell>
      </TableRow>
    ));
  }

  render() {
    const { resetLineup, removeLineup, i } = this.props;
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
              {this.renderTable()}
            </TableBody>
          </Table>
        </ExpansionPanelDetails>
        <Button color="primary" fullWidth onClick={() => resetLineup(i)} variant="contained">Reset</Button>
        <Button color="secondary" fullWidth onClick={() => removeLineup(i)} variant="contained">Remove</Button>
      </ExpansionPanel>
    );
  }
}

Lineup.propTypes = {
  order: types.arrayOf(
    types.shape({
      name: types.string.isRequired,
      radiant: types.shape({
        number: types.number.isRequired,
        selection: types.string,
      }).isRequired,
      dire: types.shape({
        number: types.number.isRequired,
        selection: types.string,
      }).isRequired,
    }).isRequired,
  ).isRequired,
  i: types.number.isRequired,
  resetLineup: types.func.isRequired,
  removeLineup: types.func.isRequired,
};

export default Lineup;
