interface Role {
  name: string;
  description: string;
  value: number;
  count?: number;
}

export const villagers: Role[] = [
  {
    name: "Villager",
    description: "Find the Werewolves and eliminate them.",
    value: 1,
    count: 14,
  },
  {
    name: "Mason",
    description: "The first night, wake up to see who the other Mason is.",
    value: 2,
    count: 3,
  },
  {
    name: "Seer",
    description:
      "Each night choose a player to learn if that player is a Villager or a Werewolf.",
    value: 7,
  },
  {
    name: "Huntress",
    description: "You may eliminate a player at night once per game.",
    value: 3,
  },
  {
    name: "Priest",
    description:
      "One night per game, choose a player to be protected. That player may not be eliminated at night.",
    value: 3,
  },
  {
    name: "P.I.",
    description:
      "One night per game, choose a player. You'll be told if that player or one of his neighbors is a Werewolf.",
    value: 3,
  },
  {
    name: "Mentalist",
    description:
      "Each night you may point to two players, and are told if those players are on the same team or not.",
    value: 6,
  },
  {
    name: "Witch",
    description:
      "You may save or eliminate a player at night once each per game.",
    value: 4,
  },
  {
    name: "Revealer",
    description:
      "Each night you may point to a player. If that player is a Werewolf, that player is eliminated. If that player is not, you are eliminated.",
    value: 4,
  },
  {
    name: "Ghost",
    description:
      "The first night, you are eliminated. Communicate to the players with single letters each day.",
    value: 2,
  },
  {
    name: "Hunter",
    description:
      "If you are eliminated, you may immediately eliminate another player.",
    value: 3,
  },
  {
    name: "Drunk",
    description:
      "You are a Villager until the 3rd night, when you sober up and learn your real role.",
    value: 4,
  },
  {
    name: "Mad Bomber",
    description:
      "If you are eliminated, the players immediately to your left and right are eliminated as well.",
    value: -2,
  },
  {
    name: "Doppelgänger",
    description:
      "The first night, choose a player. When that player is eliminated you become that role.",
    value: -2,
  },
  {
    name: "Prince",
    description:
      "If you are voted to be eliminated, your role is revealed and you stay.",
    value: 3,
  },
  {
    name: "Tough Guy",
    description:
      "If the Werewolves attempt to eliminate you, you are not eliminated until the following night.",
    value: 3,
  },
  {
    name: "Troublemaker",
    description:
      "One night per game, stir up trouble by calling for players to be eliminated the following day.",
    value: -3,
  },
  {
    name: "Bodyguard",
    description:
      "Each night, choose a player who cannot be eliminated that night.",
    value: 3,
  },
  {
    name: "Village Idiot",
    description: "You always vote for players to be eliminated.",
    value: 2,
  },
  {
    name: "Old Hag",
    description:
      "Each night, choose a player to leave the village during the next day.",
    value: 1,
  },
  {
    name: "Cupid",
    description:
      "The first night, choose two players to be linked together. If one of them is eliminated, the other is eliminated as well.",
    value: -3,
  },
  {
    name: "Diseased",
    description:
      "If you are eliminated by Werewolves, they don't get to eliminate anyone the following night.",
    value: 3,
  },
  {
    name: "Aura Seer",
    description:
      "Choose a player each night to see if that player is not a Werewolf or Villager.",
    value: 3,
  },
  {
    name: "Mayor",
    description: "Your vote counts twice.",
    value: 2,
  },
  {
    name: "Mystic Seer",
    description: "Each night, point to a player and learn their exact role.",
    value: 9,
  },
  {
    name: "Lycan",
    description: "You are a Villager, but appear to the seer as a Werewolf.",
    value: -1,
  },
  {
    name: "Spellcaster",
    description:
      "Each night, choose a player who may not speak the following day.",
    value: 1,
  },
  {
    name: "Apprentice Seer",
    description:
      "If the Seer is eliminated, you become the Seer, waking each night to look for Werewolves.",
    value: 4,
  },
  {
    name: "Pacifist",
    description: "You must always vote for players to not be eliminated.",
    value: -1,
  },
];

export const outsiders: Role[] = [
  {
    name: "Cursed",
    description:
      "You are on the Village team unless you are targeted for elimination by the Werewolves, at which time you become a Werewolf.",
    value: -3,
  },
  {
    name: "Hoodlum",
    description:
      "Choose 2 players on the first night. To win, they must be eliminated and you must still be in the game at the end of the game.",
    value: 0,
  },
  {
    name: "Vampire",
    description:
      "Each night, choose a player. That player is eliminated when a player gets their 2nd accusation the next day.",
    value: -7,
    count: 8,
  },
  {
    name: "Cult Leader",
    description:
      "Each night, choose a player to join your cult. If all alive players are in your cult, you win.",
    value: 1,
  },
  {
    name: "Tanner",
    description:
      "You hate your job and your life. You win if you are eliminated.",
    value: -2,
  },
];

export const wolves: Role[] = [
  {
    name: "Werewolf",
    description:
      "Each night, wake with the other Werewolves and choose a player to eliminate.",
    value: -6,
    count: 12,
  },
  {
    name: "Wolf Cub",
    description:
      "Each night, wake with the Werewolves. If you are eliminated, the Werewolves eliminate two players the following night.",
    value: -8,
  },
  {
    name: "Sorceress",
    description: "Each night, look for the Seer. You are on the werewolf team.",
    value: -3,
  },
  {
    name: "Lone Wolf",
    description:
      "Each night, wake with the other Werewolves. You only win if you are the last player in the game.",
    value: -5,
  },
  {
    name: "Minion",
    description:
      "You know who the Werewolves are, but you do not wake up with them at night.",
    value: -6,
  },
  {
    name: "Alpha Wolf",
    description:
      "Once per game, following the elimination of a werewolf during the day, you may turn the Werewolves' target into a Werewolf instead of eliminating them.",
    value: -1,
  },
];
