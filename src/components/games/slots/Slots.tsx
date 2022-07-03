import React from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useRecoilState } from "recoil";
import slotsState from "../../../recoil/slots-atom";
import PayoutTable from "./PayoutTable";
import MoneyTable from "./MoneyTable";
import ReelDisplay from "./ReelDisplay";
import SlotMachine from "../../../apis/SlotMachine";

/* Slots  ->  ReelDisplay
 *       |->  MoneyTable
 *       |->  PayoutTable */
const Slots: React.FC = () => {
  const [{ reel, player, dealer }, setState] = useRecoilState(slotsState);

  const updateSlotMachine = () => {
    // get rolled reel
    const newReel = SlotMachine.pullHandle();

    // determine payout
    const { bet } = player;
    const exchange = SlotMachine.getPayout(newReel, bet) - bet;

    // exchange money and update state
    setState({
      reel: newReel,
      player: { ...player, money: player.money + exchange },
      dealer: { ...dealer, money: dealer.money - exchange },
    });
  };

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
