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

// [round-i: { pairs: [woman-i: man-i], score: x }]
// [
//   {pairs: [9, 3, 2, 8, 4, 1, 6, 5, 7], score: 3}
//   {pairs: [9, 3, 2, 8, 4, 1, 6, 5, 7], score: 3}
//   {pairs: [9, 3, 2, 8, 4, 1, 6, 5, 7], score: 3}
//   ...
// ]

// {
//   confirmed: [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1] // [woman-i: man-i]
//   noMatch: [
//     [0/1, 0/1, 0/1, 0/1, 0/1, 0/1, 0/1, 0/1, 0/1, 0/1],
//     ...,
//   ]
// }

// pairs.forEach((gentI, ladyI) => {
//   if (confirmed[ladyI] !== -1) // confirmed
//   if (noMatch[ladyI][gentI]) // noMatch
// })

const AreYouTheOne = () => (
  <>
    <h1>Are You The One?</h1>
    <Controls />
    <Table ladies={ladies} gents={gents} />
    <Equations />
  </>
);

export default AreYouTheOne;
