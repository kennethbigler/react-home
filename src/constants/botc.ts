export interface BotcScript {
  townsfolk: string[];
  outsiders: string[];
  minions: string[];
  demons: string[];
  travelers: string[];
}

export const tb: BotcScript = {
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
  travelers: ["Thief", "Bureaucrat", "Gunslinger", "Scapegoat", "Beggar"],
};

export const snv: BotcScript = {
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
  travelers: ["Barista", "Harlot", "Butcher", "Deviant", "Bone Collector"],
};

export const bmr: BotcScript = {
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
  travelers: ["Apprentice", "Matron", "Judge", "Voudon", "Bishop"],
};

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
];
