import React from "react";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import {
  types,
  Types,
  effectiveness,
  Effectiveness,
} from "../../../constants/type-checker";
import EffectiveRow from "./EffectiveRow";

// secondary type dropdown (conditionally show if 1st is selected)
// add a clear button? Or click dropdown button to deselect?
// connect to poke-api?

const buttonStyles = { padding: "4px 2px" };

const TypeChecker = () => {
  const [atkPrimary, setAtkPrimary] = React.useState(-1);
  const [defPrimary, setDefPrimary] = React.useState(-1);
  const [effChart, setEffChart] = React.useState([...effectiveness]);
  const [effRowTypes, setEffRowTypes] = React.useState<Types[]>([...types]);
  const [effColTypes, setEffColTypes] = React.useState<Types[]>([...types]);

  const resetState = () => {
    setAtkPrimary(-1);
    setDefPrimary(-1);
    setEffChart([...effectiveness]);
    setEffRowTypes([...types]);
    setEffColTypes([...types]);
  };

  const handleRowClick = (idx: number) => () => {
    // reset state
    if (defPrimary !== -1 || atkPrimary !== -1) {
      resetState();
      return;
    }

    // calculate state
    const newEffChart: Effectiveness[] = [];
    const newEffTypes: Types[] = [];
    effectiveness[idx].forEach((val, i) => {
      if (val !== 1) {
        newEffChart.push(val);
        newEffTypes.push(types[i]);
      }
    });

    // update state
    setDefPrimary(-1);
    setAtkPrimary(idx);
    setEffChart([newEffChart]);
    setEffRowTypes(newEffTypes);
  };

  const handleColClick = (idx: number) => () => {
    // reset state
    if (defPrimary !== -1 || atkPrimary !== -1) {
      resetState();
      return;
    }

    // calculate state
    const newEffChart: Effectiveness[][] = [];
    const newEffTypes: Types[] = [];
    for (let i = 0; i < effectiveness.length; i += 1) {
      const val = effectiveness[i][idx];
      if (val !== 1) {
        newEffChart.push([val]);
        newEffTypes.push(types[i]);
      }
    }

    // update state
    setAtkPrimary(-1);
    setDefPrimary(idx);
    setEffChart(newEffChart);
    setEffColTypes(newEffTypes);
  };

  return (
    <>
      <Typography variant="h2">Type Checker</Typography>
      <TableContainer component={Paper}>
        <Table aria-label="are you the one data entry table">
          <TableHead>
            <TableRow>
              <TableCell />
              {defPrimary === -1 ? (
                effRowTypes.map((t, i) => (
                  <TableCell key={`header-${t.name}`} sx={{ padding: 0 }}>
                    <Button
                      variant="contained"
                      sx={{
                        ...buttonStyles,
                        backgroundColor: t.color,
                        color: t.inverted ? "black" : "white",
                      }}
                      fullWidth
                      onClick={handleColClick(i)}
                    >
                      {t.name}
                    </Button>
                  </TableCell>
                ))
              ) : (
                <TableCell sx={{ padding: 0 }}>
                  <Button
                    variant="contained"
                    sx={{
                      ...buttonStyles,
                      backgroundColor: types[defPrimary].color,
                      color: types[defPrimary].inverted ? "black" : "white",
                    }}
                    fullWidth
                    onClick={handleColClick(defPrimary)}
                  >
                    {types[defPrimary].name}
                  </Button>
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {atkPrimary === -1 || defPrimary !== -1 ? (
              effColTypes.map((t, i) => (
                <EffectiveRow
                  key={`row-${t.name}`}
                  data={effChart}
                  type={t}
                  idx={i}
                  onClick={handleRowClick}
                />
              ))
            ) : (
              <EffectiveRow
                data={effChart}
                type={types[atkPrimary]}
                idx={0}
                onClick={handleRowClick}
              />
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default TypeChecker;
