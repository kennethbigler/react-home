/**
 * Maps botcscripts.com character slugs to BotCRole objects with type information.
 *
 * Slugs are normalized before lookup: lowercased and stripped of underscores/hyphens.
 * This means "fortune_teller", "fortuneteller", and "Fortune-Teller" all resolve to
 * the same role.
 *
 * Unknown slugs (homebrew, experimental, or unrecognized roles) return a placeholder.
 */
import type { BotCRole } from "../jotai/botc-atom";

type RoleType = "townsfolk" | "outsiders" | "minions" | "demons" | "travelers";

/**
 * Misinformation tags for Blood on the Clocktower roles.
 *
 * Used by LiePie and related tooling to estimate how many players may be
 * lying due to drunk/poison/madness/evil mechanics on a given script.
 *
 * Tags (duplicates count separately, e.g. Fang Gu is 😈😈):
 *   🍺 drunk   — role is drunk or can cause drunkenness
 *   🧪 poison  — role can poison (disable abilities / false info)
 *   😡 madness — role imposes madness (must act as-if or face consequences)
 *   😈 evil    — evil team, registers as evil, can become evil, or adds evil
 */
export const MISINFO = {
  Drunk: "🍺",
  Poison: "🧪",
  Madness: "😡",
  Evil: "😈",
} as const;

export type MisinfoTag = (typeof MISINFO)[keyof typeof MISINFO];

export interface RoleCatalogEntry {
  role: BotCRole;
  roleType: RoleType;
  misinfo?: MisinfoTag[];
}

/** Normalize a slug: lowercase, strip underscores and hyphens */
export const normalizeSlug = (slug: string): string =>
  slug.toLowerCase().replace(/[_-]/g, "");

/** Build a placeholder entry for a slug not found in the catalog */
export const unknownRoleEntry = (slug: string): RoleCatalogEntry => ({
  role: { name: `Unknown: ${slug}`, icon: "❓", alignment: "info" },
  roleType: "townsfolk",
});

/**
 * Role catalog keyed by normalized slug.
 * Keys are lowercase with underscores and hyphens removed so that variants like
 * "fortune_teller" and "fortuneteller" both resolve to "fortuneteller".
 */
const ROLE_CATALOG: Record<string, RoleCatalogEntry> = {
  // ── Townsfolk ──────────────────────────────────────────────────────────────
  acrobat: {
    role: { name: "Acrobat", icon: "🤸", alignment: "info" },
    roleType: "townsfolk",
  },
  alchemist: {
    role: { name: "Alchemist", icon: "⚗️", alignment: "info" },
    roleType: "townsfolk",
  },
  alsaahir: {
    role: { name: "Alsaahir", icon: "🚬", alignment: "info" },
    roleType: "townsfolk",
  },
  amnesiac: {
    role: { name: "Amnesiac", icon: "❔", alignment: "info" },
    roleType: "townsfolk",
  },
  artist: {
    role: { name: "Artist", icon: "🎨", alignment: "info" },
    roleType: "townsfolk",
  },
  atheist: {
    role: { name: "Atheist", icon: "🪐", alignment: "info" },
    roleType: "townsfolk",
  },
  balloonist: {
    role: { name: "Balloonist", icon: "🎈", alignment: "info" },
    roleType: "townsfolk",
  },
  banshee: {
    role: { name: "Banshee", icon: "👻", alignment: "info" },
    roleType: "townsfolk",
  },
  bountyhunter: {
    role: { name: "Bounty Hunter", icon: "🕶", alignment: "info" },
    roleType: "townsfolk",
    misinfo: [MISINFO.Evil],
  },
  cannibal: {
    role: { name: "Cannibal", icon: "🍰", alignment: "info" },
    roleType: "townsfolk",
  },
  chambermaid: {
    role: { name: "Chambermaid", icon: "🧹", alignment: "info" },
    roleType: "townsfolk",
  },
  chef: {
    role: { name: "Chef", icon: "👨‍🍳", alignment: "info" },
    roleType: "townsfolk",
  },
  choirboy: {
    role: { name: "Choirboy", icon: "🎼", alignment: "info" },
    roleType: "townsfolk",
  },
  clockmaker: {
    role: { name: "Clockmaker", icon: "🕓", alignment: "info" },
    roleType: "townsfolk",
  },
  courtier: {
    role: { name: "Courtier", icon: "🍸", alignment: "info" },
    roleType: "townsfolk",
  },
  cultleader: {
    role: { name: "Cult Leader", icon: "🪬", alignment: "info" },
    roleType: "townsfolk",
    misinfo: [MISINFO.Evil],
  },
  dreamer: {
    role: { name: "Dreamer", icon: "💭", alignment: "info" },
    roleType: "townsfolk",
  },
  empath: {
    role: { name: "Empath", icon: "🫶", alignment: "info" },
    roleType: "townsfolk",
  },
  engineer: {
    role: { name: "Engineer", icon: "⚙️", alignment: "info" },
    roleType: "townsfolk",
  },
  exorcist: {
    role: { name: "Exorcist", icon: "💼", alignment: "info" },
    roleType: "townsfolk",
  },
  farmer: {
    role: { name: "Farmer", icon: "👨‍🌾", alignment: "info" },
    roleType: "townsfolk",
  },
  fisherman: {
    role: { name: "Fisherman", icon: "🎣", alignment: "info" },
    roleType: "townsfolk",
  },
  flowergirl: {
    role: { name: "Flowergirl", icon: "🌷", alignment: "info" },
    roleType: "townsfolk",
  },
  fool: {
    role: { name: "Fool", icon: "🤡", alignment: "info" },
    roleType: "townsfolk",
  },
  fortuneteller: {
    role: { name: "Fortune Teller", icon: "🔮", alignment: "info" },
    roleType: "townsfolk",
  },
  gambler: {
    role: { name: "Gambler", icon: "🎲", alignment: "info" },
    roleType: "townsfolk",
  },
  general: {
    role: { name: "General", icon: "🎖️", alignment: "info" },
    roleType: "townsfolk",
  },
  gossip: {
    role: { name: "Gossip", icon: "💬", alignment: "info" },
    roleType: "townsfolk",
  },
  grandmother: {
    role: { name: "Grandmother", icon: "👵", alignment: "info" },
    roleType: "townsfolk",
  },
  highpriestess: {
    role: { name: "High Priestess", icon: "🧝‍♀️", alignment: "info" },
    roleType: "townsfolk",
  },
  huntsman: {
    role: { name: "Huntsman", icon: "🏔️", alignment: "info" },
    roleType: "townsfolk",
  },
  innkeeper: {
    role: { name: "Innkeeper", icon: "🛌", alignment: "info" },
    roleType: "townsfolk",
    misinfo: [MISINFO.Drunk],
  },
  investigator: {
    role: { name: "Investigator", icon: "🔍", alignment: "info" },
    roleType: "townsfolk",
  },
  juggler: {
    role: { name: "Juggler", icon: "🤹", alignment: "info" },
    roleType: "townsfolk",
  },
  king: {
    role: { name: "King", icon: "🤴", alignment: "info" },
    roleType: "townsfolk",
  },
  knight: {
    role: { name: "Knight", icon: "⚔️", alignment: "info" },
    roleType: "townsfolk",
  },
  librarian: {
    role: { name: "Librarian", icon: "📚", alignment: "info" },
    roleType: "townsfolk",
  },
  lycanthrope: {
    role: { name: "Lycanthrope", icon: "🐺", alignment: "info" },
    roleType: "townsfolk",
  },
  magician: {
    role: { name: "Magician", icon: "🪄", alignment: "info" },
    roleType: "townsfolk",
  },
  mathematician: {
    role: { name: "Mathematician", icon: "🧮", alignment: "info" },
    roleType: "townsfolk",
  },
  mayor: {
    role: { name: "Mayor", icon: "🏛️", alignment: "info" },
    roleType: "townsfolk",
  },
  minstrel: {
    role: { name: "Minstrel", icon: "🪕", alignment: "info" },
    roleType: "townsfolk",
  },
  monk: {
    role: { name: "Monk", icon: "✝️", alignment: "info" },
    roleType: "townsfolk",
  },
  nightwatchman: {
    role: { name: "Nightwatchman", icon: "🌃", alignment: "info" },
    roleType: "townsfolk",
  },
  noble: {
    role: { name: "Noble", icon: "⚜️", alignment: "info" },
    roleType: "townsfolk",
  },
  oracle: {
    role: { name: "Oracle", icon: "𓂀", alignment: "info" },
    roleType: "townsfolk",
  },
  pacifist: {
    role: { name: "Pacifist", icon: "🕊️", alignment: "info" },
    roleType: "townsfolk",
  },
  philosopher: {
    role: { name: "Philosopher", icon: "🤔", alignment: "info" },
    roleType: "townsfolk",
    misinfo: [MISINFO.Drunk],
  },
  pixie: {
    role: { name: "Pixie", icon: "🧸", alignment: "info" },
    roleType: "townsfolk",
    misinfo: [MISINFO.Madness],
  },
  poppygrower: {
    role: { name: "Poppy Grower", icon: "🌺", alignment: "info" },
    roleType: "townsfolk",
  },
  preacher: {
    role: { name: "Preacher", icon: "📖", alignment: "info" },
    roleType: "townsfolk",
  },
  princess: {
    role: { name: "Princess", icon: "👸", alignment: "info" },
    roleType: "townsfolk",
  },
  professor: {
    role: { name: "Professor", icon: "⚛️", alignment: "info" },
    roleType: "townsfolk",
  },
  ravenkeeper: {
    role: { name: "Ravenkeeper", icon: "🐦‍⬛", alignment: "info" },
    roleType: "townsfolk",
  },
  sage: {
    role: { name: "Sage", icon: "🕯️", alignment: "info" },
    roleType: "townsfolk",
  },
  sailor: {
    role: { name: "Sailor", icon: "⚓", alignment: "info" },
    roleType: "townsfolk",
    misinfo: [MISINFO.Drunk],
  },
  savant: {
    role: { name: "Savant", icon: "🦽", alignment: "info" },
    roleType: "townsfolk",
  },
  seamstress: {
    role: { name: "Seamstress", icon: "🪡", alignment: "info" },
    roleType: "townsfolk",
  },
  shugenja: {
    role: { name: "Shugenja", icon: "⛩️", alignment: "info" },
    roleType: "townsfolk",
  },
  slayer: {
    role: { name: "Slayer", icon: "🏹", alignment: "info" },
    roleType: "townsfolk",
  },
  snakecharmer: {
    role: { name: "Snake Charmer", icon: "🐍", alignment: "info" },
    roleType: "townsfolk",
    misinfo: [MISINFO.Poison],
  },
  soldier: {
    role: { name: "Soldier", icon: "🪖", alignment: "info" },
    roleType: "townsfolk",
  },
  steward: {
    role: { name: "Steward", icon: "📜", alignment: "info" },
    roleType: "townsfolk",
  },
  tealady: {
    role: { name: "Tea Lady", icon: "🫖", alignment: "info" },
    roleType: "townsfolk",
  },
  towncrier: {
    role: { name: "Town Crier", icon: "🔔", alignment: "info" },
    roleType: "townsfolk",
  },
  undertaker: {
    role: { name: "Undertaker", icon: "🥄", alignment: "info" },
    roleType: "townsfolk",
  },
  villageidiot: {
    role: { name: "Village Idiot", icon: "🍭", alignment: "info" },
    roleType: "townsfolk",
    misinfo: [MISINFO.Drunk],
  },
  virgin: {
    role: { name: "Virgin", icon: "🔗", alignment: "info" },
    roleType: "townsfolk",
  },
  washerwoman: {
    role: { name: "Washerwoman", icon: "🧺", alignment: "info" },
    roleType: "townsfolk",
  },

  // ── Outsiders ──────────────────────────────────────────────────────────────
  barber: {
    role: { name: "Barber", icon: "💈", alignment: "success" },
    roleType: "outsiders",
  },
  butler: {
    role: { name: "Butler", icon: "👨‍✈️", alignment: "success" },
    roleType: "outsiders",
  },
  damsel: {
    role: { name: "Damsel", icon: "👠", alignment: "success" },
    roleType: "outsiders",
  },
  drunk: {
    role: { name: "Drunk", icon: "🍺", alignment: "success" },
    roleType: "outsiders",
    misinfo: [MISINFO.Drunk],
  },
  golem: {
    role: { name: "Golem", icon: "🗿", alignment: "success" },
    roleType: "outsiders",
  },
  goon: {
    role: { name: "Goon", icon: "🎭", alignment: "success" },
    roleType: "outsiders",
    misinfo: [MISINFO.Evil, MISINFO.Drunk],
  },
  hatter: {
    role: { name: "Hatter", icon: "🎩", alignment: "success" },
    roleType: "outsiders",
  },
  heretic: {
    role: { name: "Heretic", icon: "☦️", alignment: "success" },
    roleType: "outsiders",
  },
  hermit: {
    role: { name: "Hermit", icon: "🗼", alignment: "success" },
    roleType: "outsiders",
    misinfo: [MISINFO.Drunk, MISINFO.Evil, MISINFO.Madness],
  },
  klutz: {
    role: { name: "Klutz", icon: "🍌", alignment: "success" },
    roleType: "outsiders",
  },
  lunatic: {
    role: { name: "Lunatic", icon: "🌀", alignment: "success" },
    roleType: "outsiders",
    misinfo: [MISINFO.Madness],
  },
  moonchild: {
    role: { name: "Moonchild", icon: "🌙", alignment: "success" },
    roleType: "outsiders",
  },
  mutant: {
    role: { name: "Mutant", icon: "🎪", alignment: "success" },
    roleType: "outsiders",
    misinfo: [MISINFO.Madness],
  },
  ogre: {
    role: { name: "Ogre", icon: "🏑", alignment: "success" },
    roleType: "outsiders",
    misinfo: [MISINFO.Evil],
  },
  plaguedoctor: {
    role: { name: "Plague Doctor", icon: "🩺", alignment: "success" },
    roleType: "outsiders",
  },
  politician: {
    role: { name: "Politician", icon: "🇺🇸", alignment: "success" },
    roleType: "outsiders",
    misinfo: [MISINFO.Evil],
  },
  puzzlemaster: {
    role: { name: "Puzzlemaster", icon: "🧩", alignment: "success" },
    roleType: "outsiders",
    misinfo: [MISINFO.Drunk],
  },
  recluse: {
    role: { name: "Recluse", icon: "🕯️", alignment: "success" },
    roleType: "outsiders",
  },
  saint: {
    role: { name: "Saint", icon: "😇", alignment: "success" },
    roleType: "outsiders",
  },
  snitch: {
    role: { name: "Snitch", icon: "👄", alignment: "success" },
    roleType: "outsiders",
  },
  sweetheart: {
    role: { name: "Sweetheart", icon: "🎀", alignment: "success" },
    roleType: "outsiders",
    misinfo: [MISINFO.Drunk],
  },
  tinker: {
    role: { name: "Tinker", icon: "🔧", alignment: "success" },
    roleType: "outsiders",
  },
  zealot: {
    role: { name: "Zealot", icon: "🍾", alignment: "success" },
    roleType: "outsiders",
  },

  // ── Minions ────────────────────────────────────────────────────────────────
  assassin: {
    role: { name: "Assassin", icon: "🗡️", alignment: "error" },
    roleType: "minions",
  },
  baron: {
    role: { name: "Baron", icon: "🎩", alignment: "error" },
    roleType: "minions",
  },
  boffin: {
    role: { name: "Boffin", icon: "⚗️", alignment: "error" },
    roleType: "minions",
  },
  boomdandy: {
    role: { name: "Boomdandy", icon: "💣", alignment: "error" },
    roleType: "minions",
  },
  cerenovus: {
    role: { name: "Cerenovus", icon: "🧠", alignment: "error" },
    roleType: "minions",
    misinfo: [MISINFO.Madness],
  },
  devilsadvocate: {
    role: { name: "Devil's Advocate", icon: "⚖️", alignment: "error" },
    roleType: "minions",
  },
  eviltwin: {
    role: { name: "Evil Twin", icon: "👯‍♀️", alignment: "error" },
    roleType: "minions",
  },
  fearmonger: {
    role: { name: "Fearmonger", icon: "😱", alignment: "error" },
    roleType: "minions",
  },
  goblin: {
    role: { name: "Goblin", icon: "🫦", alignment: "error" },
    roleType: "minions",
  },
  godfather: {
    role: { name: "Godfather", icon: "🥀", alignment: "error" },
    roleType: "minions",
  },
  harpy: {
    role: { name: "Harpy", icon: "🦅", alignment: "error" },
    roleType: "minions",
    misinfo: [MISINFO.Madness],
  },
  marionette: {
    role: { name: "Marionette", icon: "🎭", alignment: "error" },
    roleType: "minions",
  },
  mastermind: {
    role: { name: "Mastermind", icon: "💺", alignment: "error" },
    roleType: "minions",
  },
  mezepheles: {
    role: { name: "Mezepheles", icon: "🪶", alignment: "error" },
    roleType: "minions",
    misinfo: [MISINFO.Evil],
  },
  organgrinder: {
    role: { name: "Organ Grinder", icon: "🐒", alignment: "error" },
    roleType: "minions",
  },
  pithag: {
    role: { name: "Pit-Hag", icon: "🥘", alignment: "error" },
    roleType: "minions",
  },
  poisoner: {
    role: { name: "Poisoner", icon: "🧪", alignment: "error" },
    roleType: "minions",
    misinfo: [MISINFO.Poison],
  },
  psychopath: {
    role: { name: "Psychopath", icon: "🪓", alignment: "error" },
    roleType: "minions",
  },
  scarletwoman: {
    role: { name: "Scarlet Woman", icon: "💋", alignment: "error" },
    roleType: "minions",
  },
  spy: {
    role: { name: "Spy", icon: "🤿", alignment: "error" },
    roleType: "minions",
  },
  summoner: {
    role: { name: "Summoner", icon: "⭕️", alignment: "error" },
    roleType: "minions",
    misinfo: [MISINFO.Evil],
  },
  vizier: {
    role: { name: "Vizier", icon: "👑", alignment: "error" },
    roleType: "minions",
  },
  widow: {
    role: { name: "Widow", icon: "🕷️", alignment: "error" },
    roleType: "minions",
    misinfo: [MISINFO.Poison],
  },
  witch: {
    role: { name: "Witch", icon: "🧙‍♀️", alignment: "error" },
    roleType: "minions",
  },
  wizard: {
    role: { name: "Wizard", icon: "🧙‍♂️", alignment: "error" },
    roleType: "minions",
  },
  wraith: {
    role: { name: "Wraith", icon: "👻", alignment: "error" },
    roleType: "minions",
  },
  xaan: {
    role: { name: "Xaan", icon: "♾️", alignment: "error" },
    roleType: "minions",
    misinfo: [MISINFO.Poison],
  },

  // ── Demons ─────────────────────────────────────────────────────────────────
  alhadikhia: {
    role: { name: "Al-Hadikhia", icon: "🎓", alignment: "error" },
    roleType: "demons",
  },
  fanggu: {
    role: { name: "Fang Gu", icon: "🔮", alignment: "error" },
    roleType: "demons",
    misinfo: [MISINFO.Evil],
  },
  imp: {
    role: { name: "Imp", icon: "🔱", alignment: "error" },
    roleType: "demons",
  },
  kazali: {
    role: { name: "Kazali", icon: "😵‍💫", alignment: "error" },
    roleType: "demons",
  },
  legion: {
    role: { name: "Legion", icon: "✋", alignment: "error" },
    roleType: "demons",
    // LiePie: evil count = TF + OUT - MIN - DEM at player count (see botcHelpers)
  },
  leviathan: {
    role: { name: "Leviathan", icon: "🦕", alignment: "error" },
    roleType: "demons",
  },
  lilmonsta: {
    role: { name: "Lil' Monsta", icon: "🐙", alignment: "error" },
    roleType: "demons",
  },
  lleech: {
    role: { name: "Lleech", icon: "🐛", alignment: "error" },
    roleType: "demons",
    misinfo: [MISINFO.Poison],
  },
  lordoftyphon: {
    role: { name: "Lord of Typhon", icon: "🐂", alignment: "error" },
    roleType: "demons",
    misinfo: [MISINFO.Evil],
  },
  nodashii: {
    role: { name: "No Dashii", icon: "🦑", alignment: "error" },
    roleType: "demons",
    misinfo: [MISINFO.Poison, MISINFO.Poison],
  },
  ojo: {
    role: { name: "Ojo", icon: "👁️", alignment: "error" },
    roleType: "demons",
  },
  po: {
    role: { name: "Po", icon: "🩸", alignment: "error" },
    roleType: "demons",
  },
  pukka: {
    role: { name: "Pukka", icon: "🦂", alignment: "error" },
    roleType: "demons",
    misinfo: [MISINFO.Poison],
  },
  riot: {
    role: { name: "Riot", icon: "🛡️", alignment: "error" },
    roleType: "demons",
  },
  shabaloth: {
    role: { name: "Shabaloth", icon: "👄", alignment: "error" },
    roleType: "demons",
  },
  vigormortis: {
    role: { name: "Vigormortis", icon: "🗝️", alignment: "error" },
    roleType: "demons",
    // LiePie: poison count = ceil(minions / 2) at current player count (see botcHelpers)
  },
  vortox: {
    role: { name: "Vortox", icon: "🌪️", alignment: "error" },
    roleType: "demons",
    // LiePie: poison count = townsfolk slots at current player count (see botcHelpers)
  },
  yaggababble: {
    role: { name: "Yaggababble", icon: "💭", alignment: "error" },
    roleType: "demons",
  },
  zombuul: {
    role: { name: "Zombuul", icon: "🧟‍♂️", alignment: "error" },
    roleType: "demons",
  },

  // ── Travelers ──────────────────────────────────────────────────────────────
  apprentice: {
    role: { name: "Apprentice", icon: "🛠️", alignment: "warning" },
    roleType: "travelers",
  },
  barista: {
    role: { name: "Barista", icon: "☕", alignment: "warning" },
    roleType: "travelers",
  },
  beggar: {
    role: { name: "Beggar", icon: "🙏", alignment: "warning" },
    roleType: "travelers",
  },
  bishop: {
    role: { name: "Bishop", icon: "✝️", alignment: "warning" },
    roleType: "travelers",
  },
  bonecollector: {
    role: { name: "Bone Collector", icon: "🦴", alignment: "warning" },
    roleType: "travelers",
  },
  bureaucrat: {
    role: { name: "Bureaucrat", icon: "📜", alignment: "warning" },
    roleType: "travelers",
  },
  butcher: {
    role: { name: "Butcher", icon: "🔪", alignment: "warning" },
    roleType: "travelers",
  },
  cacklejack: {
    role: { name: "Cacklejack", icon: "💡", alignment: "warning" },
    roleType: "travelers",
  },
  deviant: {
    role: { name: "Deviant", icon: "📿", alignment: "warning" },
    roleType: "travelers",
  },
  gangster: {
    role: { name: "Gangster", icon: "🕵", alignment: "warning" },
    roleType: "travelers",
  },
  gnome: {
    role: { name: "Gnome", icon: "🧙", alignment: "warning" },
    roleType: "travelers",
  },
  gunslinger: {
    role: { name: "Gunslinger", icon: "🔫", alignment: "warning" },
    roleType: "travelers",
  },
  harlot: {
    role: { name: "Harlot", icon: "💃🏼", alignment: "warning" },
    roleType: "travelers",
  },
  judge: {
    role: { name: "Judge", icon: "👨‍⚖️", alignment: "warning" },
    roleType: "travelers",
  },
  matron: {
    role: { name: "Matron", icon: "🤱", alignment: "warning" },
    roleType: "travelers",
  },
  scapegoat: {
    role: { name: "Scapegoat", icon: "🐐", alignment: "warning" },
    roleType: "travelers",
  },
  thief: {
    role: { name: "Thief", icon: "🥷🏻", alignment: "warning" },
    roleType: "travelers",
  },
  voudon: {
    role: { name: "Voudon", icon: "💀", alignment: "warning" },
    roleType: "travelers",
  },
};

/** Misinfo tags for a catalog slug, if the role has any */
export const getMisinfoForSlug = (slug: string): MisinfoTag[] | undefined =>
  getRoleBySlug(slug).misinfo;

/**
 * Look up a role by its botcscripts.com slug.
 * Normalizes the slug before lookup (lowercase, strip underscores/hyphens).
 * Returns a placeholder entry for unknown roles.
 */
export const getRoleBySlug = (slug: string): RoleCatalogEntry => {
  const normalized = normalizeSlug(slug);
  return ROLE_CATALOG[normalized] ?? unknownRoleEntry(slug);
};

/** Returns true if the slug resolves to a known official BotC role */
export const isKnownSlug = (slug: string): boolean => {
  return normalizeSlug(slug) in ROLE_CATALOG;
};

export default ROLE_CATALOG;
