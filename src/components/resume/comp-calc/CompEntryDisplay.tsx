import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import { CompCalcEntry, CompEntry } from "../../../jotai/comp-calculator-state";
import dateObj from "../../../apis/DateHelper";
import usDollar from "../../../apis/usDollar";

interface CompEntryDisplayProps {
  compEntries: CompEntry[];
  compCalcEntries: CompCalcEntry[];
  onClick: (i: number) => () => void;
}

const CompEntryDisplay = ({
  compEntries,
  compCalcEntries,
  onClick,
}: CompEntryDisplayProps) => (
  <Grid container spacing={1}>
    <Grid size={12}>
      <Typography>*value computed from latest stock price above</Typography>
    </Grid>
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
            size={{
              xs: 12,
              md: 6,
              lg: 4,
              xl: 3,
              // @ts-expect-error - custom breakpoints
              xxl: compEntries.length > 4 ? 2 : undefined,
              xxxl: compEntries.length > 6 ? 1 : undefined,
            }}
            key={`comp-calc-entry-${i}`}
          >
            <Card>
              <CardActionArea onClick={onClick(i)}>
                <Grid container>
                  <Grid size={stockTick ? 6 : 12}>
                    <CardHeader title="Salary" />
                    <CardContent>
                      <Typography>
                        Date: {dateObj(entryDate).format("MMMM Y")}
                      </Typography>
                      <Typography>Salary: {usDollar.format(salary)}</Typography>
                      <Typography>Bonus: {usDollar.format(bonus)}</Typography>
                      <Divider aria-hidden />
                      <Typography>Stock: {usDollar.format(stock)}</Typography>
                      <Typography>
                        *Stock: {usDollar.format(stockAdj)}
                      </Typography>
                      <Divider aria-hidden />
                      <Typography>Total: {usDollar.format(total)}</Typography>
                      <Typography sx={{ display: "inline" }}>
                        *Total:
                      </Typography>
                      <Typography
                        color="warning"
                        fontWeight="fontWeightBold"
                        sx={{ display: "inline", marginLeft: 1 }}
                      >
                        {usDollar.format(totalAdj)}
                      </Typography>
                      {netDiff !== 0 && (
                        <>
                          <Divider aria-hidden />
                          <Typography sx={{ display: "inline" }}>
                            Net:
                          </Typography>
                          <Typography
                            color={netDiff > 0 ? "success" : "error"}
                            fontWeight="fontWeightBold"
                            sx={{ display: "inline", marginLeft: 1 }}
                          >
                            {usDollar.format(netDiff)}
                          </Typography>
                        </>
                      )}
                    </CardContent>
                  </Grid>
                  {stockTick && (
                    <Grid size={6}>
                      <CardHeader title="Stock Grant" />
                      <CardContent>
                        <Typography sx={{ display: "inline" }}>
                          Ticker:
                        </Typography>
                        <Typography
                          color="primary"
                          fontWeight="fontWeightBold"
                          sx={{ display: "inline", marginLeft: 1 }}
                        >
                          {stockTick}
                        </Typography>
                        {grantQty > 0 && (
                          <>
                            <Typography>
                              Price: {usDollar.format(priceThen)}
                            </Typography>
                            <Typography>Grant Qty: {grantQty}</Typography>
                            <Typography>
                              Duration: {grantDuration} years
                            </Typography>
                            <Divider aria-hidden />
                            <Typography>
                              Grant: {usDollar.format(grantThen)}
                            </Typography>
                            <Typography>
                              *Grant: {usDollar.format(grantNow)}
                            </Typography>
                          </>
                        )}
                      </CardContent>
                    </Grid>
                  )}
                </Grid>
              </CardActionArea>
            </Card>
          </Grid>
        );
      })
      .reverse()}
  </Grid>
);

export default CompEntryDisplay;
