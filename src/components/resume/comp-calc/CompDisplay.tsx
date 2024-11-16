import * as React from "react";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import {
  CompCalcEntry,
  CompEntry,
} from "../../../recoil/comp-calculator-state";
import dateObj from "../../../apis/DateHelper";
import usDollar from "../../../apis/usdFormatter";
import { StockState } from "../../../recoil/stock-atom";

interface CompEntryProps {
  compEntries: CompEntry[];
  compCalcEntries: CompCalcEntry[];
  stockEntries: StockState;
  onClick: (i: number) => () => void;
}

const CompDisplay: React.FC<CompEntryProps> = ({
  compEntries,
  compCalcEntries,
  stockEntries,
  onClick,
}) => (
  <Grid container spacing={1}>
    {compEntries
      .map((compEntry, i) => {
        const {
          entryDate,
          salary,
          bonus,
          stockTick,
          priceThen,
          grantDuration,
          grantQty,
        } = compEntry;
        const {
          stock,
          stockAdj,
          total,
          totalAdj,
          netDiff,
          grantThen,
          grantNow,
        } = compCalcEntries[i];
        return (
          <Grid
            size={{ xs: 12, md: 6, lg: 4, xl: 3 }}
            key={`comp-calc-entry-${i}`}
          >
            <Card>
              <CardActionArea onClick={onClick(i)}>
                <Grid container>
                  <Grid size={grantQty > 0 ? 6 : 12}>
                    <CardHeader title="Salary" />
                    <CardContent>
                      <Typography>
                        Date - {dateObj(entryDate).format("MMMM Y")}
                      </Typography>
                      <Typography>Salary: {usDollar.format(salary)}</Typography>
                      <Typography>Bonus: {usDollar.format(bonus)}</Typography>
                      <Divider aria-hidden />
                      <Typography>
                        *Stock (Adj): {usDollar.format(stockAdj)}
                      </Typography>
                      <Typography>*Stock: {usDollar.format(stock)}</Typography>
                      <Divider aria-hidden />
                      <Typography>*Total: {usDollar.format(total)}</Typography>
                      <Typography>
                        *Total (Adj): {usDollar.format(totalAdj)}
                      </Typography>
                      <Divider aria-hidden />
                      <Typography>*Net: {usDollar.format(netDiff)}</Typography>
                    </CardContent>
                  </Grid>
                  {grantQty > 0 ? (
                    <Grid size={6}>
                      <CardHeader title="Stock" />
                      <CardContent>
                        <Typography>Stock Ticker: {stockTick}</Typography>
                        <Typography>
                          Price Then: {usDollar.format(priceThen)}
                        </Typography>
                        <Typography>
                          *Price Now:{" "}
                          {stockEntries[stockTick]
                            ? usDollar.format(stockEntries[stockTick])
                            : "Enter Stock"}
                        </Typography>
                        <Typography>Grant Qty: {grantQty} stocks</Typography>
                        <Typography>Duration: {grantDuration} years</Typography>
                        <Divider aria-hidden />
                        <Typography>
                          *Grant Then: {usDollar.format(grantThen)}
                        </Typography>
                        <Typography>
                          *Grant Now: {usDollar.format(grantNow)}
                        </Typography>
                      </CardContent>
                    </Grid>
                  ) : null}
                </Grid>
              </CardActionArea>
            </Card>
          </Grid>
        );
      })
      .reverse()}
  </Grid>
);

export default CompDisplay;
