import * as React from "react";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import {
  CompCalcEntry,
  CompEntry,
} from "../../../recoil/comp-calculator-state";
import dateObj from "../../../apis/DateHelper";

interface CompEntryProps {
  compEntries: CompEntry[];
  compCalcEntries: CompCalcEntry[];
  openEntryModal: (i: number) => () => void;
}

const CompDisplay: React.FC<CompEntryProps> = ({
  compEntries,
  compCalcEntries,
  openEntryModal,
}) => (
  <Grid container spacing={1}>
    {compEntries.map((compEntry, i) => {
      const {
        entryDate,
        salary,
        bonus,
        priceNow,
        priceThen,
        grantDuration,
        grantQty,
      } = compEntry;
      const { stock, stockAdj, total, totalAdj, netDiff, grantThen, grantNow } =
        compCalcEntries[i];
      return (
        <Grid size={4} key={`comp-calc-entry-${i}`}>
          <Card>
            <CardActionArea onClick={openEntryModal(i)}>
              <Grid container>
                <Grid size={grantQty > 0 ? 6 : 12}>
                  <CardHeader title="Salary" />
                  <CardContent>
                    <Typography>
                      Date - {dateObj(entryDate).format("MMMM Y")}
                    </Typography>
                    <Typography>Salary - ${salary}</Typography>
                    <Typography>Bonus - ${bonus}</Typography>
                    <Typography>Stock (Adj) - ${stockAdj} *</Typography>
                    <Typography>Stock - ${stock} *</Typography>
                    <Typography>Total - ${total} *</Typography>
                    <Typography>Total (Adj) - ${totalAdj} *</Typography>
                    <Typography>Net - ${netDiff} *</Typography>
                  </CardContent>
                </Grid>
                {grantQty > 0 ? (
                  <Grid size={6}>
                    <CardHeader title="Stock" />
                    <CardContent>
                      <Typography>Price Now - ${priceNow}</Typography>
                      <Typography>Price Then - ${priceThen}</Typography>
                      <Typography>Grant Qty - {grantQty} stocks</Typography>
                      <Typography>
                        Grant Duration - {grantDuration} years
                      </Typography>
                      <Typography>Grant Then - ${grantThen} *</Typography>
                      <Typography>Grant Now - ${grantNow} *</Typography>
                    </CardContent>
                  </Grid>
                ) : null}
              </Grid>
            </CardActionArea>
          </Card>
        </Grid>
      );
    })}
  </Grid>
);

export default CompDisplay;
