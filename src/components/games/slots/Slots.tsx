import * as React from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import { useRecoilState, useRecoilValue } from "recoil";
import slotsState, { slotsReadOnlyState } from "../../../recoil/slots-state";
import PayoutTable from "./PayoutTable";
import MoneyTable from "./MoneyTable";
import ReelDisplay from "./ReelDisplay";
import SlotMachine from "../../../apis/SlotMachine";
import PlayerMenu from "../../common/header/PlayerMenu";

/* Slots  ->  ReelDisplay
 *       |->  MoneyTable
 *       |->  PayoutTable */
const Slots = React.memo(() => {
  const [{ reel, money, houseMoney }, setState] = useRecoilState(slotsState);
  const { bet, name } = useRecoilValue(slotsReadOnlyState);
  const [exchange, setExchange] = React.useState(0);

  const updateSlotMachine = () => {
    // get rolled reel
    const newReel = SlotMachine.pullHandle();

    // determine payout
    const newExchange = SlotMachine.getPayout(newReel, bet) - bet;

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
