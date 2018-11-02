import React, { PureComponent } from 'react';
import types from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import nl2br from 'react-newline-to-break';
// Parents: Main

const LabelTableCell = withStyles({
  root: {
    maxWidth: 100,
  },
})(TableCell);

class MurderMysteryPanel extends PureComponent {
  static propTypes = {
    // types = [array, bool, func, number, object, string, symbol].isRequired
    expanded: types.string,
    expandedKey: types.string.isRequired,
    handleChange: types.func.isRequired,
    role: types.string.isRequired,
    importance: types.string.isRequired,
    person: types.string.isRequired,
    gender: types.string.isRequired,
    description: types.string.isRequired,
    hint: types.string.isRequired,
    clue: types.string.isRequired,
  };

  render() {
    const {
      expanded,
      expandedKey,
      handleChange,
      role,
      importance,
      person,
      gender,
      description,
      hint,
      clue,
    } = this.props;

    const styles = {
      container: {
        display: 'flex',
        justifyContent: 'space-between',
        width: '95%',
      },
      item: {
        display: 'flex',
      },
    };

    return (
      <ExpansionPanel expanded={expanded === expandedKey} onChange={handleChange(expandedKey)}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <div style={styles.container}>
            <div style={styles.item}>{role}</div>
            <div style={styles.item}>{importance}</div>
          </div>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Table>
            <TableBody>
              <TableRow>
                <LabelTableCell>Player</LabelTableCell>
                <TableCell>{person}</TableCell>
              </TableRow>
              <TableRow>
                <LabelTableCell>Gender</LabelTableCell>
                <TableCell>{gender}</TableCell>
              </TableRow>
              <TableRow>
                <LabelTableCell>Description</LabelTableCell>
                <TableCell>{nl2br(description)}</TableCell>
              </TableRow>
              <TableRow>
                <LabelTableCell>Hint</LabelTableCell>
                <TableCell>{nl2br(hint)}</TableCell>
              </TableRow>
              <TableRow>
                <LabelTableCell>Clue</LabelTableCell>
                <TableCell>{nl2br(clue)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  }
}

export default MurderMysteryPanel;
