import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { updateDBSlotMachine } from '../../../store/modules/slots';
import { DBRootState } from '../../../store/types';
import PayoutTable from './PayoutTable';
import MoneyTable from './MoneyTable';
import ReelDisplay from './ReelDisplay';

/* Slots  ->  ReelDisplay
 *       |->  MoneyTable
 *       |->  PayoutTable */
const Slots: React.FC = () => {
  const { players, reel } = useSelector((state: DBRootState) => ({
    players: state.players,
    reel: state.slots,
  }));
  const dispatch = useDispatch();

  const updateSlotMachine = useCallback((): void => {
    const { id, bet } = players[0];
    const dealerId = players[players.length - 1].id;
    dispatch(updateDBSlotMachine(id, dealerId, bet));
  }, [players, dispatch]);

  // https://vegasclick.com/games/slots/how-they-work
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

export default Slots;
