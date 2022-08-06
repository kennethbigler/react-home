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
  effectiveness,
  Effectiveness,
} from "../../../constants/type-checker";
import EffectiveRow from "./EffectiveRow";

// primary type dropdown
// secondary type dropdown (conditionally show if 1st is selected)
// click any button on the left, makes that the only row (auto select first dropdown)
// buttons to match type color
// display in table
// add a clear button? Or click dropdown button to deselect?
// connect to poke-api?
// add poke-dropdown to select types?

const buttonStyles = { padding: "4px 2px" };

const TypeChecker = () => {
  const [atkPrimary, setAtkPrimary] = React.useState(-1);
  const [defPrimary, setDefPrimary] = React.useState(-1);
  const [effChart, setEffChart] = React.useState([...effectiveness]);
  const [effRowTypes, setEffRowTypes] = React.useState([...types]);
  const [effColTypes, setEffColTypes] = React.useState([...types]);

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
    const newEffTypes: string[] = [];
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
    const newEffTypes: string[] = [];
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
                effRowTypes.map((name, i) => (
                  <TableCell key={`header-${name}`} sx={{ padding: 0 }}>
                    <Button
                      variant="contained"
                      sx={buttonStyles}
                      fullWidth
                      onClick={handleColClick(i)}
                    >
                      {name}
                    </Button>
                  </TableCell>
                ))
              ) : (
                <TableCell sx={{ padding: 0 }}>
                  <Button
                    variant="contained"
                    sx={buttonStyles}
                    fullWidth
                    onClick={handleColClick(defPrimary)}
                  >
                    {types[defPrimary]}
                  </Button>
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {atkPrimary === -1 || defPrimary !== -1 ? (
              effColTypes.map((name, i) => (
                <EffectiveRow
                  key={`row-${name}`}
                  data={effChart}
                  name={name}
                  idx={i}
                  onClick={handleRowClick}
                />
              ))
            ) : (
              <EffectiveRow
                data={effChart}
                name={types[atkPrimary]}
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
