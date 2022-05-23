import React from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import { updateDBSlotMachine } from "../../../store/modules/slots";
import { payout } from "../../../store/modules/players";
import PayoutTable from "./PayoutTable";
import MoneyTable from "./MoneyTable";
import ReelDisplay from "./ReelDisplay";
import SlotMachine from "../../../apis/SlotMachine";

/* Slots  ->  ReelDisplay
 *       |->  MoneyTable
 *       |->  PayoutTable */
const Slots: React.FC = () => {
  const { players, reel } = useAppSelector((state) => ({
    players: state.players,
    reel: state.slots,
  }));
  const dispatch = useAppDispatch();

  const updateSlotMachine = () => {
    // get ids
    const { id, bet } = players[0];
    const dealerId = players[players.length - 1].id;

    // get rolled reel
    const newReel = SlotMachine.pullHandle();
    dispatch(updateDBSlotMachine(newReel));

    // exchange money
    const exchange = SlotMachine.getPayout(newReel, bet) - bet;
    dispatch(payout({ id, status: "win", money: exchange }));
    dispatch(payout({ id: dealerId, status: "win", money: -exchange }));
  };

  // https://vegasclick.com/games/slots/how-they-work
  const player = players[0];
  const dealer = players[players.length - 1];

  return (
    <>
      <Typography variant="h2">Casino Slot Machine</Typography>
      <Grid container spacing={1} style={{ marginTop: "2em" }}>
        <Grid item sm={6} xs={12}>
          <Grid container spacing={1} style={{ marginBottom: "1em" }}>
            <Grid item sm={3} xs={12}>
              <Button
                color="primary"
                onClick={updateSlotMachine}
                style={{ marginBottom: 15 }}
                variant="contained"
                role="button"
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
