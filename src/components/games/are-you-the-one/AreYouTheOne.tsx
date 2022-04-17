import React from "react";
import Controls from "./Controls";
import Table from "./Table";
import Equations from "./Equations";

const ladies = [
  "Alicia",
  "Carolina",
  "Cas",
  "Gianna",
  "Hannah",
  "Kam",
  "Kari",
  "Kathryn",
  "Shannon",
  "Taylor",
  "Tyranny",
];

const gents = [
  "Andre",
  "Derrick",
  "Edward",
  "Hayden",
  "Jaylan",
  "Joey",
  "Michael",
  "Mike",
  "Osvaldo",
  "Ozzy",
  "Tyler",
];

// [
//   [9, 3, 2, 8, 4, 1, ...]
//   [9, 3, 2, 8, 4, 1, ...]
//   [9, 3, 2, 8, 4, 1, ...]
//   ...
// ]

const AreYouTheOne = () => (
  <>
    <h1>Are You The One?</h1>
    <Controls />
    <Table ladies={ladies} gents={gents} />
    <Equations />
  </>
);

export default AreYouTheOne;
