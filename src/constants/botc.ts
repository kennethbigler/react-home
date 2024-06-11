// TB
import baron from "../images/botc/tb/baron.webp";
import butler from "../images/botc/tb/butler.webp";
import chef from "../images/botc/tb/chef.webp";
import drunk from "../images/botc/tb/drunk.webp";
import empath from "../images/botc/tb/empath.webp";
import fortuneteller from "../images/botc/tb/fortuneteller.webp";
import imp from "../images/botc/tb/imp.webp";
import investigator from "../images/botc/tb/investigator.webp";
import librarian from "../images/botc/tb/librarian.webp";
import mayor from "../images/botc/tb/mayor.webp";
import monk from "../images/botc/tb/monk.webp";
import poisoner from "../images/botc/tb/poisoner.webp";
import ravenkeeper from "../images/botc/tb/ravenkeeper.webp";
import recluse from "../images/botc/tb/recluse.webp";
import saint from "../images/botc/tb/saint.webp";
import scarletwoman from "../images/botc/tb/scarletwoman.webp";
import slayer from "../images/botc/tb/slayer.webp";
import soldier from "../images/botc/tb/soldier.webp";
import spy from "../images/botc/tb/spy.webp";
import undertaker from "../images/botc/tb/undertaker.webp";
import virgin from "../images/botc/tb/virgin.webp";
import washerwoman from "../images/botc/tb/washerwoman.webp";
// Travelers
import apprentice from "../images/botc/travellers/apprentice.png";
import barista from "../images/botc/travellers/barista.png";
import beggar from "../images/botc/travellers/beggar.png";
import bishop from "../images/botc/travellers/bishop.png";
import bonecollector from "../images/botc/travellers/bonecollector.png";
import bureaucrat from "../images/botc/travellers/bureaucrat.png";
import butcher from "../images/botc/travellers/butcher.png";
import deviant from "../images/botc/travellers/deviant.png";
import gangster from "../images/botc/travellers/gangster.png";
import gunslinger from "../images/botc/travellers/gunslinger.png";
import harlot from "../images/botc/travellers/harlot.png";
import judge from "../images/botc/travellers/judge.png";
import matron from "../images/botc/travellers/matron.png";
import scapegoat from "../images/botc/travellers/scapegoat.png";
import thief from "../images/botc/travellers/thief.png";
import voudon from "../images/botc/travellers/voudon.png";
// DTB
import amnesiac from "../images/botc/dtb/amnesiac.webp";
import cannibal from "../images/botc/dtb/cannibal.webp";
import damsel from "../images/botc/dtb/damsel.webp";
import harpy from "../images/botc/dtb/harpy.webp";
import huntsman from "../images/botc/dtb/huntsman.webp";
import pixie from "../images/botc/dtb/pixie.webp";
// S&V
import artist from "../images/botc/snv/artist.webp";
import barber from "../images/botc/snv/barber.webp";
import cerenovus from "../images/botc/snv/cerenovus.webp";
import clockmaker from "../images/botc/snv/clockmaker.webp";
import dreamer from "../images/botc/snv/dreamer.webp";
import eviltwin from "../images/botc/snv/eviltwin.webp";
import fanggu from "../images/botc/snv/fanggu.webp";
import flowergirl from "../images/botc/snv/flowergirl.webp";
import juggler from "../images/botc/snv/juggler.webp";
import klutz from "../images/botc/snv/klutz.webp";
import mathematician from "../images/botc/snv/mathematician.webp";
import mutant from "../images/botc/snv/mutant.webp";
import nodashii from "../images/botc/snv/nodashii.webp";
import oracle from "../images/botc/snv/oracle.webp";
import philosopher from "../images/botc/snv/philosopher.webp";
import pithag from "../images/botc/snv/pithag.webp";
import sage from "../images/botc/snv/sage.webp";
import savant from "../images/botc/snv/savant.webp";
import seamstress from "../images/botc/snv/seamstress.webp";
import snakecharmer from "../images/botc/snv/snakecharmer.webp";
import sweetheart from "../images/botc/snv/sweetheart.webp";
import towncrier from "../images/botc/snv/towncrier.webp";
import vigormortis from "../images/botc/snv/vigormortis.webp";
import vortox from "../images/botc/snv/vortox.webp";
import witch from "../images/botc/snv/witch.webp";
// BMR
import assassin from "../images/botc/bmr/assassin.webp";
import chambermaid from "../images/botc/bmr/chambermaid.webp";
import courtier from "../images/botc/bmr/courtier.webp";
import devilsadvocate from "../images/botc/bmr/devilsadvocate.webp";
import exorcist from "../images/botc/bmr/exorcist.webp";
import fool from "../images/botc/bmr/fool.webp";
import gambler from "../images/botc/bmr/gambler.webp";
import godfather from "../images/botc/bmr/godfather.webp";
import goon from "../images/botc/bmr/goon.webp";
import gossip from "../images/botc/bmr/gossip.webp";
import grandmother from "../images/botc/bmr/grandmother.webp";
import innkeeper from "../images/botc/bmr/innkeeper.webp";
import lunatic from "../images/botc/bmr/lunatic.webp";
import mastermind from "../images/botc/bmr/mastermind.webp";
import minstrel from "../images/botc/bmr/minstrel.webp";
import moonchild from "../images/botc/bmr/moonchild.webp";
import pacifist from "../images/botc/bmr/pacifist.webp";
import po from "../images/botc/bmr/po.webp";
import professor from "../images/botc/bmr/professor.webp";
import pukka from "../images/botc/bmr/pukka.webp";
import sailor from "../images/botc/bmr/sailor.webp";
import shabaloth from "../images/botc/bmr/shabaloth.webp";
import tealady from "../images/botc/bmr/tealady.webp";
import tinker from "../images/botc/bmr/tinker.webp";
import zombuul from "../images/botc/bmr/zombuul.webp";

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
    { name: "Washerwoman", icon: washerwoman, alignment: "info" },
    { name: "Monk", icon: monk, alignment: "info" },
    { name: "Librarian", icon: librarian, alignment: "info" },
    { name: "Ravenkeeper", icon: ravenkeeper, alignment: "info" },
    { name: "Investigator", icon: investigator, alignment: "info" },
    { name: "Virgin", icon: virgin, alignment: "info" },
    { name: "Chef", icon: chef, alignment: "info" },
    { name: "Slayer", icon: slayer, alignment: "info" },
    { name: "Empath", icon: empath, alignment: "info" },
    { name: "Soldier", icon: soldier, alignment: "info" },
    { name: "Fortune Teller", icon: fortuneteller, alignment: "info" },
    { name: "Mayor", icon: mayor, alignment: "info" },
    { name: "Undertaker", icon: undertaker, alignment: "info" },
  ],
  outsiders: [
    { name: "Butler", icon: butler, alignment: "success" },
    { name: "Recluse", icon: recluse, alignment: "success" },
    { name: "Drunk", icon: drunk, alignment: "success" },
    { name: "Saint", icon: saint, alignment: "success" },
  ],
  minions: [
    { name: "Poisoner", icon: poisoner, alignment: "error" },
    { name: "Baron", icon: baron, alignment: "error" },
    { name: "Spy", icon: spy, alignment: "error" },
    { name: "Scarlet Woman", icon: scarletwoman, alignment: "error" },
  ],
  demons: [{ name: "Imp", icon: imp, alignment: "error" }],
  travelers: [
    { name: "Thief", icon: thief, alignment: "warning" },
    { name: "Bureaucrat", icon: bureaucrat, alignment: "warning" },
    { name: "Gunslinger", icon: gunslinger, alignment: "warning" },
    { name: "Scapegoat", icon: scapegoat, alignment: "warning" },
    { name: "Beggar", icon: beggar, alignment: "warning" },
  ],
};

export const snv: BotCScript = {
  townsfolk: [
    { name: "Clockmaker", icon: clockmaker, alignment: "info" },
    { name: "Savant", icon: savant, alignment: "info" },
    { name: "Dreamer", icon: dreamer, alignment: "info" },
    { name: "Seamstress", icon: seamstress, alignment: "info" },
    { name: "Snake Charmer", icon: snakecharmer, alignment: "info" },
    { name: "Philosopher", icon: philosopher, alignment: "info" },
    { name: "Mathematician", icon: mathematician, alignment: "info" },
    { name: "Artist", icon: artist, alignment: "info" },
    { name: "Flowergirl", icon: flowergirl, alignment: "info" },
    { name: "Juggler", icon: juggler, alignment: "info" },
    { name: "Town Crier", icon: towncrier, alignment: "info" },
    { name: "Sage", icon: sage, alignment: "info" },
    { name: "Oracle", icon: oracle, alignment: "info" },
  ],
  outsiders: [
    { name: "Mutant", icon: mutant, alignment: "success" },
    { name: "Sweetheart", icon: sweetheart, alignment: "success" },
    { name: "Barber", icon: barber, alignment: "success" },
    { name: "Klutz", icon: klutz, alignment: "success" },
  ],
  minions: [
    { name: "Witch", icon: witch, alignment: "error" },
    { name: "Pit-Hag", icon: pithag, alignment: "error" },
    { name: "Cerenovus", icon: cerenovus, alignment: "error" },
    { name: "Evil Twin", icon: eviltwin, alignment: "error" },
  ],
  demons: [
    { name: "Fang Gu", icon: fanggu, alignment: "error" },
    { name: "No Dashii", icon: nodashii, alignment: "error" },
    { name: "Vigormortis", icon: vigormortis, alignment: "error" },
    { name: "Vortox", icon: vortox, alignment: "error" },
  ],
  travelers: [
    { name: "Barista", icon: barista, alignment: "warning" },
    { name: "Harlot", icon: harlot, alignment: "warning" },
    { name: "Butcher", icon: butcher, alignment: "warning" },
    { name: "Deviant", icon: deviant, alignment: "warning" },
    { name: "Bone Collector", icon: bonecollector, alignment: "warning" },
    { name: "Gangster", icon: gangster, alignment: "warning" },
  ],
};

export const bmr: BotCScript = {
  townsfolk: [
    { name: "Grandmother", icon: grandmother, alignment: "info" },
    { name: "Gossip", icon: gossip, alignment: "info" },
    { name: "Sailor", icon: sailor, alignment: "info" },
    { name: "Courtier", icon: courtier, alignment: "info" },
    { name: "Chambermaid", icon: chambermaid, alignment: "info" },
    { name: "Professor", icon: professor, alignment: "info" },
    { name: "Exorcist", icon: exorcist, alignment: "info" },
    { name: "Minstrel", icon: minstrel, alignment: "info" },
    { name: "Innkeeper", icon: innkeeper, alignment: "info" },
    { name: "Tea Lady", icon: tealady, alignment: "info" },
    { name: "Gambler", icon: gambler, alignment: "info" },
    { name: "Pacifist", icon: pacifist, alignment: "info" },
    { name: "Fool", icon: fool, alignment: "info" },
  ],
  outsiders: [
    { name: "Goon", icon: goon, alignment: "success" },
    { name: "Tinker", icon: tinker, alignment: "success" },
    { name: "Lunatic", icon: lunatic, alignment: "success" },
    { name: "Moonchild", icon: moonchild, alignment: "success" },
  ],
  minions: [
    { name: "Godfather", icon: godfather, alignment: "error" },
    { name: "Assassin", icon: assassin, alignment: "error" },
    { name: "Devil's Advocate", icon: devilsadvocate, alignment: "error" },
    { name: "Mastermind", icon: mastermind, alignment: "error" },
  ],
  demons: [
    { name: "Zombuul", icon: zombuul, alignment: "error" },
    { name: "Shabaloth", icon: shabaloth, alignment: "error" },
    { name: "Pukka", icon: pukka, alignment: "error" },
    { name: "Po", icon: po, alignment: "error" },
  ],
  travelers: [
    { name: "Apprentice", icon: apprentice, alignment: "warning" },
    { name: "Matron", icon: matron, alignment: "warning" },
    { name: "Judge", icon: judge, alignment: "warning" },
    { name: "Voudon", icon: voudon, alignment: "warning" },
    { name: "Bishop", icon: bishop, alignment: "warning" },
  ],
};

export const dtb: BotCScript = {
  townsfolk: [
    { name: "Washerwoman", icon: washerwoman, alignment: "info" },
    { name: "Librarian", icon: librarian, alignment: "info" },
    { name: "Investigator", icon: investigator, alignment: "info" },
    { name: "Chef", icon: chef, alignment: "info" },
    { name: "Slayer", icon: slayer, alignment: "info" },
    { name: "Empath", icon: empath, alignment: "info" },
    { name: "Fortune Teller", icon: fortuneteller, alignment: "info" },
    { name: "Cannibal", icon: cannibal, alignment: "info" },
    { name: "Monk", icon: monk, alignment: "info" },
    { name: "Ravenkeeper", icon: ravenkeeper, alignment: "info" },
    { name: "Virgin", icon: virgin, alignment: "info" },
    { name: "Mayor", icon: mayor, alignment: "info" },
    { name: "Amnesiac", icon: amnesiac, alignment: "info" },
    { name: "Pixie", icon: pixie, alignment: "info" },
    { name: "Huntsman", icon: huntsman, alignment: "info" },
  ],
  outsiders: [
    { name: "Damsel", icon: damsel, alignment: "success" },
    { name: "Drunk", icon: drunk, alignment: "success" },
    { name: "Recluse", icon: recluse, alignment: "success" },
    { name: "Saint", icon: saint, alignment: "success" },
  ],
  minions: [
    { name: "Poisoner", icon: poisoner, alignment: "error" },
    { name: "Spy", icon: spy, alignment: "error" },
    { name: "Scarlet Woman", icon: scarletwoman, alignment: "error" },
    { name: "Baron", icon: baron, alignment: "error" },
    { name: "Cerenovus", icon: cerenovus, alignment: "error" },
    { name: "Harpy", icon: harpy, alignment: "error" },
  ],
  demons: [{ name: "Imp", icon: imp, alignment: "error" }],
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
