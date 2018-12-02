import React, { Component } from 'react';
import types from 'prop-types';
import map from 'lodash/map';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
// Parents: Popup

class Lineup extends Component {
  static propTypes = {
    // types = [array, bool, func, number, object, string, symbol].isRequired
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
  };

  renderTable = () => {
    const { order } = this.props;
    return map(order, turn => (
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
    const { i } = this.props;
    return (
      <ExpansionPanel defaultExpanded={i === 0}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>{`Game ${i + 1}`}</ExpansionPanelSummary>
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
      </ExpansionPanel>
    );
  }
}

export default Lineup;
