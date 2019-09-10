import React, { Component, Fragment } from 'react';
import types from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import map from 'lodash/map';
import DarkTableCell from '../../common/DarkTableCell';
import SlotMachine from './SlotMachine';
import { payout, updateBet } from '../../../store/modules/players';
import styles from './Slots.styles';
// Parents: Main

/* --------------------------------------------------
* Slot Machine
* -------------------------------------------------- */
class Slots extends Component {
  constructor(props) {
    super(props);

    this.state = {
      reel: SlotMachine.pullHandle(),
    };
  }

  updateSlotMachine = () => {
    const { playerActions, players } = this.props;
    const { id, bet } = players[0];
    const dealer = players[players.length - 1];
    const reel = SlotMachine.pullHandle();
    const exchange = SlotMachine.getPayout(reel, bet) - bet;
    playerActions.payout(id, 'win', exchange);
    playerActions.payout(dealer.id, 'win', -exchange);
    this.setState({ reel });
  };

  /** generate code for slot machine */
  getSlots = () => {
    const { reel } = this.state;

    // display for slots
    const slots = [];
    for (let i = 0; i < 3; i += 1) {
      // create 3 cells in a row
      const row = [];
      for (let j = 0; j < 3; j += 1) {
        const slotCell = (
          <TableCell key={`${j},${i}`}>
            <Typography variant="h4" align="center" color="secondary" style={styles.cell}>
              {reel[j][i]}
            </Typography>
          </TableCell>
        );

        row.push(slotCell);
      }
      // separate into rows
      const slotRow = (
        <TableRow key={`row${i}`}>
          {row}
        </TableRow>
      );
      slots.push(slotRow);
    }
    return slots;
  }

  // https://vegasclick.com/games/slots/how-they-work
  render() {
    const { players } = this.props;
    const player = players[0];
    const dealer = players[players.length - 1];

    const slots = this.getSlots();

    return (
      <Fragment>
        <Typography variant="h2">Casino Slot Machine</Typography>
        <Grid container spacing={1} style={{ marginTop: '2em' }}>
          <Grid item sm={6} xs={12}>
            <Grid container spacing={1} style={{ marginBottom: '1em' }}>
              <Grid item sm={3} xs={12}>
                <Button
                  color="primary"
                  onClick={this.updateSlotMachine}
                  style={{ marginBottom: 15 }}
                  variant="contained"
                >
                  Spin
                </Button>
              </Grid>
              <Grid item sm={9} xs={12}>
                <Table>
                  <TableBody>
                    {slots}
                  </TableBody>
                </Table>
              </Grid>
            </Grid>
            <Table>
              <TableHead>
                <TableRow>
                  <DarkTableCell>
                    Player
                  </DarkTableCell>
                  <DarkTableCell>
                    Money
                  </DarkTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>
                    {player.name}
                  </TableCell>
                  <TableCell>
                    {`$${player.money}`}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    House
                  </TableCell>
                  <TableCell>
                    {`$${dealer.money}`}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Grid>
          <Grid item sm={6} xs={12}>
            <Table>
              <TableHead>
                <TableRow>
                  <DarkTableCell>
                    Slot Roll
                  </DarkTableCell>
                  <DarkTableCell>
                    Payout
                  </DarkTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {map(SlotMachine.payoutTable, (row, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      {row.symbol}
                    </TableCell>
                    <TableCell>
                      {`${row.payout} : 1`}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Grid>
        </Grid>
      </Fragment>
    );
  }
}

Slots.propTypes = {
  playerActions: types.shape({
    payout: types.func.isRequired,
    updateBet: types.func.isRequired,
  }).isRequired,
  players: types.arrayOf(
    types.shape({
      id: types.number.isRequired,
      money: types.number.isRequired,
      bet: types.number.isRequired,
      name: types.string,
    }),
  ).isRequired,
};

// react-redux export
const mapStateToProps = (state) => ({ players: state.players });
const mapDispatchToProps = (dispatch) => ({
  playerActions: bindActionCreators({ payout, updateBet }, dispatch),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Slots);
