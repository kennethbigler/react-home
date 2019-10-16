import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import SlotMachine, { SlotDisplay } from './SlotMachine';
import { payout, updateBet } from '../../../store/modules/players';
import { DBPlayer, DBRootState } from '../../../store/types';
import PayoutTable from './PayoutTable';
import MoneyTable from './MoneyTable';
import ReelDisplay from './ReelDisplay';

interface PlayerActions {
  payout: Function;
  updateBet: Function;
}
interface SlotProps {
  playerActions: PlayerActions;
  players: DBPlayer[];
}
interface SlotState {
  reel: SlotDisplay[];
}

/* Slots  ->  ReelDisplay
 *       |->  MoneyTable
 *       |->  PayoutTable */
class Slots extends Component<SlotProps, SlotState> {
  constructor(props: SlotProps) {
    super(props);

    this.state = {
      reel: SlotMachine.pullHandle(),
    };
  }

  updateSlotMachine = (): void => {
    const { playerActions, players } = this.props;
    const { id, bet } = players[0];
    const dealer = players[players.length - 1];
    const reel = SlotMachine.pullHandle();
    const exchange = SlotMachine.getPayout(reel, bet) - bet;
    playerActions.payout(id, 'win', exchange);
    playerActions.payout(dealer.id, 'win', -exchange);
    this.setState({ reel });
  };

  // https://vegasclick.com/games/slots/how-they-work
  render(): React.ReactNode {
    const { players } = this.props;
    const { reel } = this.state;
    const player = players[0];
    const dealer = players[players.length - 1];

    return (
      <>
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
                <ReelDisplay reel={reel} />
              </Grid>
            </Grid>
            <MoneyTable
              playerMoney={player.money}
              playerName={player.name}
              dealerMoney={dealer.money}
            />
          </Grid>
          <Grid item sm={6} xs={12}>
            <PayoutTable />
          </Grid>
        </Grid>
      </>
    );
  }
}

// react-redux export
const mapStateToProps = (state: DBRootState): { players: DBPlayer[] } => ({ players: state.players });
const mapDispatchToProps = (dispatch: Dispatch): { playerActions: PlayerActions } => ({
  playerActions: bindActionCreators({ payout, updateBet }, dispatch),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Slots);
