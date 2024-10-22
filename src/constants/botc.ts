import { BotCRole } from "../recoil/botc-atom";

export interface BotCScript {
  townsfolk: BotCRole[];
  outsiders: BotCRole[];
  minions: BotCRole[];
  demons: BotCRole[];
  travelers: BotCRole[];
}

export const tb: BotCScript = {
  townsfolk: [
    { name: "Washerwoman", alignment: "info" },
    { name: "Monk", alignment: "info" },
    { name: "Librarian", alignment: "info" },
    { name: "Ravenkeeper", alignment: "info" },
    { name: "Investigator", alignment: "info" },
    { name: "Virgin", alignment: "info" },
    { name: "Chef", alignment: "info" },
    { name: "Slayer", alignment: "info" },
    { name: "Empath", alignment: "info" },
    { name: "Soldier", alignment: "info" },
    { name: "Fortune Teller", alignment: "info" },
    { name: "Mayor", alignment: "info" },
    { name: "Undertaker", alignment: "info" },
  ],
  outsiders: [
    { name: "Butler", alignment: "success" },
    { name: "Recluse", alignment: "success" },
    { name: "Drunk", alignment: "success" },
    { name: "Saint", alignment: "success" },
  ],
  minions: [
    { name: "Poisoner", alignment: "error" },
    { name: "Baron", alignment: "error" },
    { name: "Spy", alignment: "error" },
    { name: "Scarlet Woman", alignment: "error" },
  ],
  demons: [{ name: "Imp", alignment: "error" }],
  travelers: [
    { name: "Thief", alignment: "warning" },
    { name: "Bureaucrat", alignment: "warning" },
    { name: "Gunslinger", alignment: "warning" },
    { name: "Scapegoat", alignment: "warning" },
    { name: "Beggar", alignment: "warning" },
  ],
};

export const snv: BotCScript = {
  townsfolk: [
    { name: "Clockmaker", alignment: "info" },
    { name: "Savant", alignment: "info" },
    { name: "Dreamer", alignment: "info" },
    { name: "Seamstress", alignment: "info" },
    { name: "Snake Charmer", alignment: "info" },
    { name: "Philosopher", alignment: "info" },
    { name: "Mathematician", alignment: "info" },
    { name: "Artist", alignment: "info" },
    { name: "Flowergirl", alignment: "info" },
    { name: "Juggler", alignment: "info" },
    { name: "Town Crier", alignment: "info" },
    { name: "Sage", alignment: "info" },
    { name: "Oracle", alignment: "info" },
  ],
  outsiders: [
    { name: "Mutant", alignment: "success" },
    { name: "Sweetheart", alignment: "success" },
    { name: "Barber", alignment: "success" },
    { name: "Klutz", alignment: "success" },
  ],
  minions: [
    { name: "Witch", alignment: "error" },
    { name: "Pit-Hag", alignment: "error" },
    { name: "Cerenovus", alignment: "error" },
    { name: "Evil Twin", alignment: "error" },
  ],
  demons: [
    { name: "Fang Gu", alignment: "error" },
    { name: "No Dashii", alignment: "error" },
    { name: "Vigormortis", alignment: "error" },
    { name: "Vortox", alignment: "error" },
  ],
  travelers: [
    { name: "Barista", alignment: "warning" },
    { name: "Harlot", alignment: "warning" },
    { name: "Butcher", alignment: "warning" },
    { name: "Deviant", alignment: "warning" },
    { name: "Bone Collector", alignment: "warning" },
    { name: "Gangster", alignment: "warning" },
  ],
};

export const bmr: BotCScript = {
  townsfolk: [
    { name: "Grandmother", alignment: "info" },
    { name: "Gossip", alignment: "info" },
    { name: "Sailor", alignment: "info" },
    { name: "Courtier", alignment: "info" },
    { name: "Chambermaid", alignment: "info" },
    { name: "Professor", alignment: "info" },
    { name: "Exorcist", alignment: "info" },
    { name: "Minstrel", alignment: "info" },
    { name: "Innkeeper", alignment: "info" },
    { name: "Tea Lady", alignment: "info" },
    { name: "Gambler", alignment: "info" },
    { name: "Pacifist", alignment: "info" },
    { name: "Fool", alignment: "info" },
  ],
  outsiders: [
    { name: "Goon", alignment: "success" },
    { name: "Tinker", alignment: "success" },
    { name: "Lunatic", alignment: "success" },
    { name: "Moonchild", alignment: "success" },
  ],
  minions: [
    { name: "Godfather", alignment: "error" },
    { name: "Assassin", alignment: "error" },
    { name: "Devil's Advocate", alignment: "error" },
    { name: "Mastermind", alignment: "error" },
  ],
  demons: [
    { name: "Zombuul", alignment: "error" },
    { name: "Shabaloth", alignment: "error" },
    { name: "Pukka", alignment: "error" },
    { name: "Po", alignment: "error" },
  ],
  travelers: [
    { name: "Apprentice", alignment: "warning" },
    { name: "Matron", alignment: "warning" },
    { name: "Judge", alignment: "warning" },
    { name: "Voudon", alignment: "warning" },
    { name: "Bishop", alignment: "warning" },
  ],
};

export const dtb: BotCScript = {
  townsfolk: [
    { name: "Washerwoman", alignment: "info" },
    { name: "Monk", alignment: "info" },
    { name: "Librarian", alignment: "info" },
    { name: "Ravenkeeper", alignment: "info" },
    { name: "Investigator", alignment: "info" },
    { name: "Virgin", alignment: "info" },
    { name: "Chef", alignment: "info" },
    { name: "Mayor", alignment: "info" },
    { name: "Slayer", alignment: "info" },
    { name: "Amnesiac", alignment: "info" },
    { name: "Empath", alignment: "info" },
    { name: "Pixie", alignment: "info" },
    { name: "Fortune Teller", alignment: "info" },
    { name: "Huntsman", alignment: "info" },
    { name: "Cannibal", alignment: "info" },
  ],
  outsiders: [
    { name: "Damsel", alignment: "success" },
    { name: "Drunk", alignment: "success" },
    { name: "Recluse", alignment: "success" },
    { name: "Saint", alignment: "success" },
  ],
  minions: [
    { name: "Poisoner", alignment: "error" },
    { name: "Spy", alignment: "error" },
    { name: "Scarlet Woman", alignment: "error" },
    { name: "Baron", alignment: "error" },
    { name: "Cerenovus", alignment: "error" },
    { name: "Harpy", alignment: "error" },
  ],
  demons: [{ name: "Imp", alignment: "error" }],
  travelers: [],
};

export const swpm: BotCScript = {
  townsfolk: [
    { name: "Chef", alignment: "info" },
    { name: "Amnesiac", alignment: "info" },
    { name: "Investigator", alignment: "info" },
    { name: "Seamstress", alignment: "info" },
    { name: "Librarian", alignment: "info" },
    { name: "Philosopher", alignment: "info" },
    { name: "Pixie", alignment: "info" },
    { name: "Ravenkeeper", alignment: "info" },
    { name: "Dreamer", alignment: "info" },
    { name: "Cannibal", alignment: "info" },
    { name: "Snake Charmer", alignment: "info" },
    { name: "Mayor", alignment: "info" },
    { name: "Oracle", alignment: "info" },
  ],
  outsiders: [
    { name: "Recluse", alignment: "success" },
    { name: "Drunk", alignment: "success" },
    { name: "Mutant", alignment: "success" },
    { name: "Lunatic", alignment: "success" },
  ],
  minions: [
    { name: "Godfather", alignment: "error" },
    { name: "Pit-Hag", alignment: "error" },
    { name: "Spy", alignment: "error" },
    { name: "Marionette", alignment: "error" },
    { name: "Cerenovus", alignment: "error" },
  ],
  demons: [
    { name: "Imp", alignment: "error" },
    { name: "Fang Gu", alignment: "error" },
    { name: "Vigormortis", alignment: "error" },
  ],
  travelers: [],
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
