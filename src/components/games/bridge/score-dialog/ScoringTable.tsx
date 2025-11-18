import {
  Table,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Typography,
  Divider,
} from "@mui/material";
import { memo } from "react";

const ScoringTable = memo(() => {
  return (
    <>
      <Divider />
      <Table aria-labelledby="contracts-trick-values">
        <TableHead>
          <TableRow>
            <TableCell colSpan={2} align="center">
              <Typography variant="h5" component="h3">
                Scoring Table
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableHead>
          <TableRow>
            <TableCell colSpan={2} align="center">
              <Typography
                variant="h6"
                component="h4"
                id="contracts-trick-values"
              >
                Contracts - Trick Values
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>Minors ♣️♦️</TableCell>
            <TableCell>20</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Majors ♥️♠️</TableCell>
            <TableCell>30</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>No Trump 🥇</TableCell>
            <TableCell>40</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>No Trump 🥈+</TableCell>
            <TableCell>30</TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <Table aria-labelledby="bridge-rubbers">
        <TableHead>
          <TableRow>
            <TableCell colSpan={2} align="center">
              <Typography variant="h6" component="h4" id="bridge-rubbers">
                Rubbers
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>3 Game Rubber Won</TableCell>
            <TableCell>500</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>2 Game Rubber Won</TableCell>
            <TableCell>700</TableCell>
          </TableRow>
        </TableBody>
        <TableHead>
          <TableRow>
            <TableCell colSpan={2} sx={{ fontWeight: "bold" }}>
              Unfinished Rubbers
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>Only partial score - no finished game</TableCell>
            <TableCell>100</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Won the only game</TableCell>
            <TableCell>300</TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <Table aria-labelledby="bridge-slams">
        <TableHead>
          <TableRow>
            <TableCell colSpan={3} align="center">
              <Typography variant="h6" component="h4" id="bridge-slams">
                Slams
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell />
            <TableCell sx={{ textDecoration: "underline" }}>Not Vul</TableCell>
            <TableCell sx={{ textDecoration: "underline" }}>Vul</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>Small</TableCell>
            <TableCell>500</TableCell>
            <TableCell>750</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Grand</TableCell>
            <TableCell>1000</TableCell>
            <TableCell>1500</TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <Table aria-labelledby="bridge-overtricks">
        <TableHead>
          <TableRow>
            <TableCell colSpan={3} align="center">
              <Typography variant="h6" component="h4" id="bridge-overtricks">
                Overtricks
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Per Overtrick</TableCell>
            <TableCell sx={{ textDecoration: "underline" }}>Not Vul</TableCell>
            <TableCell sx={{ textDecoration: "underline" }}>Vul</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>Not Doubled</TableCell>
            <TableCell colSpan={2} align="center">
              Trick Value
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Doubled</TableCell>
            <TableCell>100</TableCell>
            <TableCell>200</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Redoubled</TableCell>
            <TableCell>200</TableCell>
            <TableCell>400</TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <Table aria-labelledby="bridge-undertricks">
        <TableHead>
          <TableRow>
            <TableCell colSpan={5} align="center">
              <Typography variant="h6" component="h4" id="bridge-undertricks">
                Undertricks
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell />
            <TableCell colSpan={2} align="center">
              Not Doubled
            </TableCell>
            <TableCell colSpan={2} align="center">
              Doubled
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell />
            <TableCell sx={{ textDecoration: "underline" }}>NV</TableCell>
            <TableCell sx={{ textDecoration: "underline" }}>Vul</TableCell>
            <TableCell sx={{ textDecoration: "underline" }}>NV</TableCell>
            <TableCell sx={{ textDecoration: "underline" }}>Vul</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>1</TableCell>
            <TableCell>50</TableCell>
            <TableCell>100</TableCell>
            <TableCell>100</TableCell>
            <TableCell>200</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>2</TableCell>
            <TableCell>100</TableCell>
            <TableCell>200</TableCell>
            <TableCell>300</TableCell>
            <TableCell>500</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>3</TableCell>
            <TableCell>150</TableCell>
            <TableCell>300</TableCell>
            <TableCell>500</TableCell>
            <TableCell>800</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>4</TableCell>
            <TableCell>200</TableCell>
            <TableCell>400</TableCell>
            <TableCell>800</TableCell>
            <TableCell>1100</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>5</TableCell>
            <TableCell>250</TableCell>
            <TableCell>500</TableCell>
            <TableCell>1100</TableCell>
            <TableCell>1400</TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <Table aria-labelledby="extra-bonuses">
        <TableHead>
          <TableRow>
            <TableCell colSpan={2} align="center">
              <Typography variant="h6" component="h4" id="extra-bonuses">
                Extra Bonuses
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>Making a doubled contract</TableCell>
            <TableCell>50</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Making a redoubled contract</TableCell>
            <TableCell>100</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>4 trump honours in 1 hand</TableCell>
            <TableCell>100</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>5 trump honours in 1 hand</TableCell>
            <TableCell>150</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>4 aces in 1 hand in NT</TableCell>
            <TableCell>150</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </>
  );
});

ScoringTable.displayName = "ScoringTable";

export default ScoringTable;
