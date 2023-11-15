import * as React from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useRecoilState } from "recoil";
import slotsState from "../../../recoil/slots-state";
import PayoutTable from "./PayoutTable";
import MoneyTable from "./MoneyTable";
import ReelDisplay from "./ReelDisplay";
import SlotMachine from "../../../apis/SlotMachine";
import PlayerMenu from "../../common/header/PlayerMenu";

/* Slots  ->  ReelDisplay
 *       |->  MoneyTable
 *       |->  PayoutTable */
const Slots: React.FC = () => {
  const [{ reel, money, bet, name, houseMoney }, setState] =
    useRecoilState(slotsState);
  const [exchange, setExchange] = React.useState(0);

  const updateSlotMachine = () => {
    // get rolled reel
    const newReel = SlotMachine.pullHandle();

    // determine payout
    const newExchange = SlotMachine.getPayout(newReel, bet) - bet;

    // exchange money and update state
    setExchange(newExchange);
    setState({
      bet,
      name,
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
        <Grid item sm={6} xs={12}>
          <Grid container spacing={1} style={{ marginBottom: "1em" }}>
            <Grid item sm={3} xs={12}>
              <Button
                onClick={updateSlotMachine}
                style={{ marginBottom: 15 }}
                variant="contained"
              >
                Spin
              </Button>
              {exchange ? (
                <Typography variant="h4" component="h2">{`You ${
                  exchange > 0 ? "won" : "lost"
                } $${exchange}`}</Typography>
              ) : null}
            </Grid>
            <Grid item sm={9} xs={12}>
              <ReelDisplay reel={reel} />
            </Grid>
          </Grid>
          <MoneyTable money={money} name={name} houseMoney={houseMoney} />
        </Grid>
        <Grid item sm={6} xs={12}>
          <PayoutTable />
        </Grid>
      </Grid>
    </>
  );
};

export default Slots;
