import { memo, useState } from "react";
import { useAtom, useAtomValue } from "jotai";
import slotsState, { slotsRead } from "../../../jotai/slots-state";
import PayoutTable from "./PayoutTable";
import MoneyTable from "./MoneyTable";
import ReelDisplay from "./ReelDisplay";
import slotMachine from "./slotMachine";
import PlayerMenu from "../../common/header/PlayerMenu";
import { Button, Grid, Typography } from "@mui/material";

/* Slots  ->  ReelDisplay
 *       |->  MoneyTable
 *       |->  PayoutTable */
const Slots = memo(() => {
  const [{ reel, money, houseMoney }, setState] = useAtom(slotsState);
  const { bet, name } = useAtomValue(slotsRead);
  const [exchange, setExchange] = useState(0);

  const updateSlotMachine = () => {
    // get rolled reel
    const newReel = slotMachine.pullHandle();

    // determine payout
    const newExchange = slotMachine.getPayout(newReel, bet) - bet;

    // exchange money and update state
    setExchange(newExchange);
    setState({
      reel: newReel,
      money: money + newExchange,
      houseMoney: houseMoney - newExchange,
    });
  };

  return (
    <>
      <div className="flex-container">
        <Typography variant="h2" component="h1">
          Casino Slot Machine
        </Typography>
        <PlayerMenu />
      </div>
      <Grid container spacing={1} style={{ marginTop: "2em" }}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <div>
            <Button
              onClick={updateSlotMachine}
              style={{ marginBottom: 15 }}
              variant="contained"
            >
              Spin
            </Button>
            {exchange !== 0 && (
              <Typography variant="h4" component="h2">{`You ${
                exchange > 0 ? "won" : "lost"
              } $${exchange}`}</Typography>
            )}
          </div>
          <ReelDisplay reel={reel} />
          <MoneyTable money={money} name={name} houseMoney={houseMoney} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <PayoutTable />
        </Grid>
      </Grid>
    </>
  );
});

Slots.displayName = "Slots";

export default Slots;
