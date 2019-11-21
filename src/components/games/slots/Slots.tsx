import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { updateDBSlotMachine } from '../../../store/modules/slots';
import { DBPlayer, DBRootState, DBSlotDisplay } from '../../../store/types';
import PayoutTable from './PayoutTable';
import MoneyTable from './MoneyTable';
import ReelDisplay from './ReelDisplay';

interface SlotActions {
  updateDBSlotMachine: typeof updateDBSlotMachine;
}
interface SlotDBState {
  players: DBPlayer[];
  reel: DBSlotDisplay[];
}
interface SlotProps extends SlotDBState {
  slotActions: SlotActions;
}

/* Slots  ->  ReelDisplay
 *       |->  MoneyTable
 *       |->  PayoutTable */
const Slots: React.FC<SlotProps> = (props: SlotProps) => {
  const updateSlotMachine = (): void => {
    const { slotActions, players } = props;
    const { id, bet } = players[0];
    const dealerId = players[players.length - 1].id;
    slotActions.updateDBSlotMachine(id, dealerId, bet);
  };

  // https://vegasclick.com/games/slots/how-they-work
  const { players, reel } = props;
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
                onClick={updateSlotMachine}
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
};

// react-redux export
const mapStateToProps = (state: DBRootState): SlotDBState => ({
  players: state.players,
  reel: state.slots,
});
const mapDispatchToProps = (dispatch: Dispatch): { slotActions: SlotActions } => ({
  slotActions: bindActionCreators({ updateDBSlotMachine }, dispatch),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Slots);
