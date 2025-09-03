interface Team {
  name: string;
  color: string;
  standings: (number | null)[];
}

const teams: Team[] = [
  {
    name: "Mercedes",
    color: "#00D2BE",
    standings: [1, 1, 1, 1],
  },
  {
    name: "Ferrari",
    color: "#DC0000",
    standings: [2, 2, 6, 3],
  },
  {
    name: "Red Bull Racing",
    color: "#1E41FF",
    standings: [3, 3, 2, 2],
  },
  {
    name: "Alpine",
    color: "#0090FF",
    standings: [4, 5, 5, 5],
  },
  {
    name: "Haas",
    color: "#FFFFFF",
    standings: [5, 9, 9, 10],
  },
  {
    name: "McLaren",
    color: "#FF8700",
    standings: [6, 4, 3, 4],
  },
  {
    name: "Aston Martin",
    color: "#006F62",
    standings: [7, 7, 4, 7],
  },
  {
    name: "Alfa Romeo",
    color: "#900000",
    standings: [8, 8, 8, 9],
  },
  {
    name: "AlphaTauri",
    color: "#2B4562",
    standings: [9, 6, 7, 6],
  },
  {
    name: "Williams",
    color: "#005AFF",
    standings: [10, 10, 10, 8],
  },
  // ----------     2nd Replacement     ---------- //
  {
    name: "Racing Point",
    color: "#F596C8",
    standings: [7, 7, 4, null],
  },
  // ----------     1st Replacement     ---------- //
  {
    name: "Force India",
    color: "#F596C8",
    standings: [7, null, null, null],
  },
  {
    name: "Sauber",
    color: "#9B0000",
    standings: [8, null, null, null],
  },
  {
    name: "Toro Rosso",
    color: "#4E7C9B",
    standings: [9, 6, null, null],
  },
  {
    name: "Renault",
    color: "#FFF500",
    standings: [4, 5, 5, null],
  },
];

export const standingsXAxisNames = [2018, 2019, 2020, 2021];

export const chartStandings: { data: (number | null)[]; name: string }[] =
  teams.map((team) => ({
    data: team.standings,
    name: team.name,
    color: team.color,
  }));

// interface NameChanges {
//   [key: number]: string[];
// }

// const nameChanges: NameChanges = {
//   2019: ["Force India > Racing Point", "Sauber > Alfa Romeo"],
//   2020: ["Toro Rosso > AlphaTauri"],
//   2021: ["Renault > Alpine", "Racing Point > Aston Martin"],
// };
