export const tb = {
  townsfolk: [
    "Washerwoman",
    "Monk",
    "Librarian",
    "Ravenkeeper",
    "Investigator",
    "Virgin",
    "Chef",
    "Slayer",
    "Empath",
    "Soldier",
    "Fortune Teller",
    "Mayor",
    "Undertaker",
  ],
  outsiders: ["Butler", "Recluse", "Drunk", "Saint"],
  minions: ["Poisoner", "Baron", "Spy", "Scarlet Woman"],
  demons: ["Imp"],
};

export const snv = {
  townsfolk: [
    "Clockmaker",
    "Savant",
    "Dreamer",
    "Seamstress",
    "Snake Charmer",
    "Philosopher",
    "Mathematician",
    "Artist",
    "Flowergirl",
    "Juggler",
    "Town Crier",
    "Sage",
    "Oracle",
  ],
  outsiders: ["Mutant", "Sweetheart", "Barber", "Klutz"],
  minions: ["Witch", "Pit-Hag", "Cerenovus", "Evil Twin"],
  demons: ["Fang Gu", "No Dashii", "Vigormortis", "Vortox"],
};

export const bmr = {
  townsfolk: [
    "Grandmother",
    "Gossip",
    "Sailor",
    "Courtier",
    "Chambermaid",
    "Professor",
    "Exorcist",
    "Minstrel",
    "Innkeeper",
    "Tea Lady",
    "Gambler",
    "Pacifist",
    "Fool",
  ],
  outsiders: ["Goon", "Tinker", "Lunatic", "Moonchild"],
  minions: ["Godfather", "Assassin", "Devil's Advocate", "Mastermind"],
  demons: ["Zombuul", "Shabaloth", "Pukka", "Po"],
};

export const travelers = [
  {
    name: "Thief",
    desc: "Each night, choose a player (not yourself): their vote counts negatively tomorrow.",
    game: "TB",
  },
  {
    name: "Bureaucrat",
    desc: "Each night, choose a player (not yourself): their vote counts as 3 votes tomorrow.",
    game: "TB",
  },
  {
    name: "Gunslinger",
    desc: "Each day, after the 1st vote has been tallied, you may choose a player that voted: they die.",
    game: "TB",
  },
  {
    name: "Scapegoat",
    desc: "If a player of your alignment is executed, you might be executed instead.",
    game: "TB",
  },
  {
    name: "Beggar",
    desc: "You must use a vote token to vote. If a dead player gives you theirs, you learn their alignment. You are sober & healthy.",
    game: "TB",
  },
  {
    name: "Apprentice",
    desc: "On your 1st night, you gain a Townsfolk ability (if good), or a Minion ability (if evil).",
    game: "BMR",
  },
  {
    name: "Matron",
    desc: "Each day, you may choose up to 3 sets of 2 players to swap seats. Players may not leave their seats to talk in private.",
    game: "BMR",
  },
  {
    name: "Judge",
    desc: "Once per game, if another player nominated, you may choose to force the current execution to pass or fail.",
    game: "BMR",
  },
  {
    name: "Voudon",
    desc: "Only you & the dead can vote. They don't need a vote token to do so. A 50% majority isn't required.",
    game: "BMR",
  },
  {
    name: "Bishop",
    desc: "Only the Storyteller can nominate. At least 1 opposing player must be nominated each day.",
    game: "BMR",
  },
  {
    name: "Barista",
    desc: "Each night, until dusk, 1) a player becomes sober, healthy & gets true info, or 2) their ability works twice. They learn which.",
    game: "S&V",
  },
  {
    name: "Harlot",
    desc: "Each night*, choose a living player: if they agree, you learn their character, but you both might die.",
    game: "S&V",
  },
  {
    name: "Butcher",
    desc: "Each day, after the 1st execution, you may nominate again.",
    game: "S&V",
  },
  {
    name: "Deviant",
    desc: "If you were funny today, you cannot die by exile.",
    game: "S&V",
  },
  {
    name: "Bone Collector",
    desc: "Once per game, at night, choose a dead player: they regain their ability until dusk.",
    game: "S&V",
  },
];

export const playerDist = [
  "",
  "",
  "",
  "",
  "",
  "3,0,1,1",
  "3,1,1,1",
  "5,0,1,1",
  "5,1,1,1",
  "5,2,1,1",
  "7,0,2,1",
  "7,1,2,1",
  "7,2,2,1",
  "9,0,3,1",
  "9,1,3,1",
  "9,2,3,1",
  "9,2,3,1 + 1",
  "9,2,3,1 + 2",
  "9,2,3,1 + 3",
  "9,2,3,1 + 4",
  "9,2,3,1 + 5",
];
