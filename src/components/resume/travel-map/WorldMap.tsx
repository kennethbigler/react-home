import React from "react";
import { useRecoilState } from "recoil";
import Map, { DataItem } from "react-svg-worldmap";
import { blueGrey } from "@mui/material/colors";
import countries from "../../../constants/travel";
import themeAtom from "../../../recoil/theme-atom";

const data: DataItem[] = Object.keys(countries).map((k) => ({
  country: countries[k].code,
  value: 1,
}));

const WorldMap = () => {
  const [theme] = useRecoilState(themeAtom);
  const screenWidth = Math.min(document.body.clientWidth - 32, 2000);

  return (
    <Map
      color={blueGrey[500]}
      data={data}
      size={screenWidth}
      backgroundColor="transparent"
      borderColor={theme.mode === "dark" ? "white" : "black"}
    />
  );
};

export default WorldMap;
