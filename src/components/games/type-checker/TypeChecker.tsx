import * as React from "react";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import {
  types,
  Types,
  effectiveness,
  Effectiveness,
} from "../../../constants/type-checker";
import EffectiveRow from "./EffectiveRow";

const ddOptions = types.reduce(
  (acc: string[], { name }) => acc.concat([name]),
  ["select secondary"],
);

const buttonStyles = { padding: "4px 2px" };

/** type checking tool */
const TypeChecker = () => {
  const [atkPrimary, setAtkPrimary] = React.useState(-1);
  const [defPrimary, setDefPrimary] = React.useState(-1);
  const [defSecondary, setDefSecondary] = React.useState(0);
  const [effChart, setEffChart] = React.useState([...effectiveness]);
  const [effRowTypes, setEffRowTypes] = React.useState<Types[]>([...types]);
  const [effColTypes, setEffColTypes] = React.useState<Types[]>([...types]);

  const resetState = () => {
    setAtkPrimary(-1);
    setDefPrimary(-1);
    setDefSecondary(0);
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

  const handleSelect = (e: SelectChangeEvent<number>) => {
    const secIdx = Number(e.target.value);

    if (secIdx === 0) {
      resetState();
      return;
    }

    // calculate state
    const newEffChart: Effectiveness[][] = [];
    const newEffTypes: Types[] = [];
    for (let i = 0; i < effectiveness.length; i += 1) {
      const primary = effectiveness[i][defPrimary];
      const secondary = effectiveness[i][secIdx - 1];
      if (primary * secondary !== 1) {
        newEffChart.push([(primary * secondary) as Effectiveness]);
        newEffTypes.push(types[i]);
      }
    }

    // update state
    setDefSecondary(secIdx);
    setEffChart(newEffChart);
    setEffColTypes(newEffTypes);
  };

  return (
    <>
      <Typography variant="h2" component="h1">
        Type Checker
      </Typography>
      {defPrimary !== -1 && (
        <FormControl>
          <InputLabel>Secondary Type</InputLabel>
          <Select
            label="Secondary Type"
            value={defSecondary}
            onChange={handleSelect}
          >
            {ddOptions.map((option, i) => (
              <MenuItem key={option} value={i}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
      <TableContainer component={Paper}>
        <Table aria-label="pokemon type checker">
          <TableHead>
            <TableRow>
              <TableCell>-</TableCell>
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
                    {types[defPrimary].name}{" "}
                    {defSecondary ? `/ ${types[defSecondary - 1].name}` : ""}
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
