import React from "react";
import Map, { DataItem } from "react-svg-worldmap";
import { blueGrey } from "@mui/material/colors";
import { useAppSelector } from "../../../store/store";
import countries from "../../../constants/countries";

const data: DataItem[] = Object.keys(countries).map((k) => ({
  country: countries[k].code,
  value: 0,
}));

const WorldMap = () => {
  const { theme } = useAppSelector((state) => ({ theme: state.theme.mode }));
  const screenWidth = document.body.clientWidth - 112;

  return (
    <Map
      color={blueGrey[500]}
      data={data}
      size={screenWidth}
      backgroundColor="transparent"
      borderColor={theme === "dark" ? "white" : "black"}
    />
  );
};

export default WorldMap;
