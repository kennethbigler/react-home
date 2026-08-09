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
 *
 * First-pass sourcing: botc.fyi ability text, Pocket Grimoire, and the
 * official wiki. Homebrew/experimental roles included where catalogued.
 */
export const Misinfo = {
  Drunk: "🍺",
  Poison: "🧪",
  Madness: "😡",
  Evil: "😈",
} as const;

export type MisinfoTag = (typeof Misinfo)[keyof typeof Misinfo];

const { Drunk, Poison, Madness, Evil } = Misinfo;

/** Shorthand builders for common combinations */
const E = [Evil] as MisinfoTag[];
const EE = [Evil, Evil] as MisinfoTag[];
const EP = [Evil, Poison] as MisinfoTag[];
const EM = [Evil, Madness] as MisinfoTag[];
const ED = [Evil, Drunk] as MisinfoTag[];
const none = [] as MisinfoTag[];

/**
 * Per-slug misinfo tags (normalized slug keys).
 * Minions/demons default to [😈] when omitted — see defaultMisinfoForRoleType.
 */
export const ROLE_MISINFO: Partial<Record<string, MisinfoTag[]>> = {
  // ── Townsfolk ──────────────────────────────────────────────────────────────
  acrobat: none,
  alchemist: [Poison, Drunk], // Minion ability may poison (Poisoner) or drunk (Organ Grinder)
  alsaahir: none,
  amnesiac: none,
  artist: none,
  atheist: none,
  balloonist: none,
  banshee: none,
  bountyhunter: [Evil], // [1 Townsfolk is evil] in setup
  cannibal: [Poison], // Poisoned while holding an evil executee's ability
  chambermaid: none,
  chef: none,
  choirboy: none,
  clockmaker: none,
  courtier: [Drunk], // Chosen character is drunk for 3 nights & 3 days
  cultleader: [Evil], // Alignment follows neighbors; can become evil
  dreamer: none,
  empath: none,
  engineer: none,
  exorcist: none,
  farmer: none,
  fisherman: none,
  flowergirl: none,
  fool: none,
  fortuneteller: none, // Red herring is a setup assignment, not the role itself
  gambler: none,
  general: none,
  gossip: none,
  grandmother: none,
  highpriestess: none,
  huntsman: none,
  innkeeper: [Drunk], // One protected player is drunk until dusk
  investigator: none,
  juggler: none,
  king: none,
  knight: none,
  librarian: none,
  lycanthrope: [Evil], // One good player registers as evil
  magician: none,
  mathematician: none,
  mayor: none,
  minstrel: [Drunk], // All other players drunk when a Minion is executed
  monk: none,
  nightwatchman: none,
  noble: none,
  oracle: none,
  pacifist: none,
  philosopher: [Drunk], // In-play copy of chosen character becomes drunk
  pixie: [Madness], // Must be mad about being the known Townsfolk to gain ability
  poppygrower: none,
  preacher: none,
  princess: none,
  professor: none,
  ravenkeeper: none,
  sage: none,
  sailor: [Drunk], // Chooses self or another player to be drunk each night
  savant: none,
  seamstress: none,
  shugenja: none,
  slayer: none,
  snakecharmer: [Evil, Poison], // Becomes evil Demon; swapped Demon is poisoned
  soldier: none,
  steward: none,
  tealady: none,
  towncrier: none,
  undertaker: none,
  villageidiot: [Drunk], // Extra copies include one drunk Village Idiot
  virgin: none,
  washerwoman: none,

  // ── Outsiders ──────────────────────────────────────────────────────────────
  barber: none,
  butler: none,
  damsel: none,
  drunk: [Drunk],
  golem: none,
  goon: ED, // Chooser is drunk; Goon becomes their alignment
  hatter: none,
  heretic: none,
  hermit: [Drunk, Evil, Madness], // Has all Outsider abilities
  klutz: none,
  lunatic: [Madness], // Believes they are the Demon
  moonchild: none,
  mutant: [Madness], // Must be mad about being an Outsider
  ogre: [Evil], // Can become evil via first-night choice
  plaguedoctor: none,
  politician: [Evil], // Can change alignment to the winning team
  puzzlemaster: [Drunk], // One player is always drunk
  recluse: [Evil], // May register as evil / Minion / Demon
  saint: none,
  snitch: none,
  sweetheart: [Drunk], // On death, one player becomes drunk permanently
  tinker: none,
  zealot: [Madness], // Must vote on every nomination (5+ players)

  // ── Minions ────────────────────────────────────────────────────────────────
  assassin: E,
  baron: E,
  boffin: E,
  boomdandy: E,
  cerenovus: EM,
  devilsadvocate: E,
  eviltwin: E,
  fearmonger: E,
  goblin: EM, // Cerenovus may mad-target as Goblin
  godfather: E,
  harpy: EM,
  marionette: E,
  mastermind: E,
  mezepheles: EE, // Secret word can turn a good player evil
  organgrinder: ED,
  pithag: EE, // Can transform a player into a not-in-play Demon
  poisoner: EP,
  psychopath: E,
  scarletwoman: EE, // Becomes the Demon when the Demon dies
  spy: EP, // Poisoned Damsel when Spy has been in play
  summoner: EE, // Creates an evil Demon on night 3
  vizier: E,
  widow: EP,
  witch: EM, // Cursed player dies if they nominate
  wizard: E,
  wraith: E,
  xaan: EP, // Poisons all Townsfolk on night X

  // ── Demons ─────────────────────────────────────────────────────────────────
  alhadikhia: E,
  fanggu: EE, // First Outsider killed becomes an evil Fang Gu (+1 Outsider)
  imp: E,
  kazali: E,
  legion: EE, // Most players are Legion (mass evil)
  leviathan: E,
  lilmonsta: EE, // A Minion babysits Lil' Monsta and acts as the Demon
  lleech: EP, // Host is poisoned from the start
  lordoftyphon: EE, // Summoned neighbor becomes an evil Minion
  nodashii: EP, // Two Townsfolk neighbors are poisoned
  ojo: E,
  po: E,
  pukka: EP, // Poisons each night before delayed kill
  riot: EE, // Minions become Riot on day 3
  shabaloth: E,
  vigormortis: EP, // Killed Minions poison a Townsfolk neighbor
  vortox: EP, // All Townsfolk info is false (poison-like global effect)
  yaggababble: E,
  zombuul: E,

  // ── Travelers ──────────────────────────────────────────────────────────────
  // Travelers rarely cause drunk/poison/madness/evil misinfo on the script itself.
  apprentice: none,
  barista: none,
  beggar: none,
  bishop: none,
  bonecollector: none,
  bureaucrat: none,
  butcher: none,
  cacklejack: none,
  deviant: none,
  gangster: none,
  gnome: none,
  gunslinger: none,
  harlot: none,
  judge: none,
  matron: none,
  scapegoat: none,
  thief: none,
  voudon: none,
};

/** Default misinfo when a slug has no explicit entry in ROLE_MISINFO */
export const defaultMisinfoForRoleType = (
  roleType: "townsfolk" | "outsiders" | "minions" | "demons" | "travelers",
): MisinfoTag[] => {
  if (roleType === "minions" || roleType === "demons") {
    return E;
  }
  return none;
};

/** Resolve misinfo tags for a normalized catalog slug */
export const getMisinfoForSlug = (
  slug: string,
  roleType: "townsfolk" | "outsiders" | "minions" | "demons" | "travelers",
): MisinfoTag[] => ROLE_MISINFO[slug] ?? defaultMisinfoForRoleType(roleType);

/** Count misinfo tags across a list (duplicates included) */
export const countMisinfoTags = (
  tags: MisinfoTag[],
): Record<MisinfoTag, number> => ({
  [Misinfo.Drunk]: tags.filter((t) => t === Misinfo.Drunk).length,
  [Misinfo.Poison]: tags.filter((t) => t === Misinfo.Poison).length,
  [Misinfo.Madness]: tags.filter((t) => t === Misinfo.Madness).length,
  [Misinfo.Evil]: tags.filter((t) => t === Misinfo.Evil).length,
});
