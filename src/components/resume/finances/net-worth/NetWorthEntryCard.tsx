import {
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import {
  NetWorthCalcEntry,
  NetWorthEntry,
} from "../../../../jotai/finances-atom";
import dateObj from "../../../../apis/DateHelper";
import usDollar from "../../../../apis/usDollar";

interface NetWorthEntryCardProps {
  entry: NetWorthEntry;
  calcEntry: NetWorthCalcEntry;
  categories: string[];
  onClick: () => void;
}

const boldStyle = {
  fontWeight: "fontWeightBold",
  display: "inline",
  marginLeft: 1,
} as const;

const NetWorthEntryCard = ({
  entry: { entryDate, amounts },
  calcEntry: { total, netDiff },
  categories,
  onClick,
}: NetWorthEntryCardProps) => (
  <Grid
    size={{
      xs: 12,
      sm: 6,
      md: 4,
      lg: 3,
      xl: 2,
      xxl: 1,
    }}
  >
    <Card>
      <CardActionArea
        onClick={onClick}
        aria-label={`Edit net worth entry for ${dateObj(entryDate).format("MMMM Y")}`}
      >
        <CardHeader title={dateObj(entryDate).format("MMMM Y")} />
        <CardContent>
          {categories.map((category) => (
            <Typography key={category}>
              {category}: {usDollar.format(amounts[category] ?? 0)}
            </Typography>
          ))}
          <Divider aria-hidden />
          <Typography sx={{ display: "inline" }}>Total:</Typography>
          <Typography color="warning" sx={boldStyle}>
            {usDollar.format(total)}
          </Typography>
          {netDiff !== 0 && (
            <>
              <Divider aria-hidden />
              <Typography sx={{ display: "inline" }}>Net:</Typography>
              <Typography
                color={netDiff > 0 ? "success" : "error"}
                sx={boldStyle}
              >
                {usDollar.format(netDiff)}
              </Typography>
            </>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  </Grid>
);

export default NetWorthEntryCard;
