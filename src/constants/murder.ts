// --------------------     Types     -------------------- //
enum Gender {
  MALE = "M",
  FEMALE = "F",
  NEUTRAL = "M/F",
}
export enum Importance {
  I1 = "Required",
  I2 = "Recommended",
  I3 = "Optional",
}
interface MurderRole {
  role: string;
  gender: Gender;
  importance: Importance;
  description?: string[];
  hint?: string[];
  clue?: string[];
}

// --------------------     Globals     -------------------- //
export const CASINO = "The Grand Cinema Magic Hotel and Casino";
const VICTIM = "Elvis";
const EMPLOYEE = `As an employee, you are at ${CASINO} regularly.`;
const MOTIVE = `You have motive to murder ${VICTIM}.`;
const REGULAR = `You are at ${CASINO} regularly.`;
const NEW_VISIT = `You have never been to ${CASINO} before.`;

// --------------------     Intro     -------------------- //
export const intro =
  `${CASINO} in Las Vegas is holding a special night for high rollers. ` +
  "Everyone has sauntered through the casino and into the theatre for a swanky show. " +
  "The music starts, a spotlight comes on, and the curtain rises. " +
  `The hotel's very own ${VICTIM} stands, mic in hand ready to perform when a shot echoes through the dark hall. ` +
  `${VICTIM} falls. It takes a moment for the crowd to realize this isn't part of the act, but when they finally do they know they've all become suspects.`;

// --------------------     Profiles V1     -------------------- //
let owner = {
  role: "The Casino Owner",
  importance: Importance.I1,
  gender: Gender.NEUTRAL,
};
let reporter = {
  role: "The Reporter",
  importance: Importance.I1,
  gender: Gender.NEUTRAL,
};
let gunNut = {
  role: "The Gun Nut",
  importance: Importance.I1,
  gender: Gender.MALE,
};
let escort = {
  role: "The Escort",
  importance: Importance.I1,
  gender: Gender.FEMALE,
};
let gladiator = {
  role: "The Recently Fired Gladiator Actor",
  importance: Importance.I1,
  gender: Gender.MALE,
};
let coach = {
  role: "The Singing Coach",
  importance: Importance.I1,
  gender: Gender.MALE,
};
let bouncer = {
  role: "The Bouncer",
  importance: Importance.I2,
  gender: Gender.NEUTRAL,
};
let follow = {
  role: "The Second Act",
  importance: Importance.I2,
  gender: Gender.FEMALE,
};
let dancer = {
  role: "The Dancer",
  importance: Importance.I2,
  gender: Gender.FEMALE,
};
let director = {
  role: "The Depressed Director",
  importance: Importance.I3,
  gender: Gender.NEUTRAL,
};
let lawyer = {
  role: "The Lawyer",
  importance: Importance.I3,
  gender: Gender.MALE,
};
let diver = {
  role: "The Scuba Diver",
  importance: Importance.I3,
  gender: Gender.NEUTRAL,
};
let cop = {
  role: "The Retired Cop",
  importance: Importance.I3,
  gender: Gender.NEUTRAL,
};
let prof = {
  role: "The Professor",
  importance: Importance.I3,
  gender: Gender.NEUTRAL,
};
let diner = {
  role: "The Owner of the Diner",
  importance: Importance.I3,
  gender: Gender.NEUTRAL,
};
let ufo = {
  role: "The UFO Conspiracy Nut",
  importance: Importance.I3,
  gender: Gender.NEUTRAL,
};
let crusader = {
  role: "The Caped Crusader",
  importance: Importance.I3,
  gender: Gender.NEUTRAL,
};
let librarian = {
  role: "The Librarian",
  importance: Importance.I3,
  gender: Gender.NEUTRAL,
};
let author = {
  role: "The Nearly Famous Author",
  importance: Importance.I3,
  gender: Gender.NEUTRAL,
};
let poker = {
  role: "The Professional Poker Player",
  importance: Importance.I3,
  gender: Gender.NEUTRAL,
};

// --------------------     Profiles V2     -------------------- //
owner = {
  ...owner,
  ...{
    description: [
      `You are the owner of ${CASINO}, and you are running the murder mystery to make sure everything runs smoothly.`,
    ],
    clue: [
      "1. Act as the lead detective if no one steps up. Ask:",
      "- What clues do we have and who can that rule out?",
      `- Did a character have motive to kill ${VICTIM}?`,
      "",
      `2. Breaking news, "${gunNut.role}'s" lost gun from the casino bar last week is the murder weapon!`,
      `- "${gunNut.role} Clue" implies any regular could have the gun.`,
      `- Was the character at ${CASINO} a week ago? Are they a regular?`,
      "",
      `3. "${reporter.role} Clue" implies a married guest has motive to murder ${VICTIM}.`,
      "- Is the character married?",
      `- Most people will assume ${VICTIM}'s relationship is with a women.`,
      `- "${escort.role} Clue" is meant to imply ${VICTIM} is gay.`,
    ],
  },
};

reporter = {
  ...reporter,
  ...{
    description: [
      "You are a resident bad boy/girl and have earned quite a reputation for your ability to try any underhanded trick you can think of to get the latest scoop.",
      "Of course, your methods aren’t always legal…but that only matters if you get caught, right?",
      "You are way too consumed with your job which gets in the way of all personal relationships.",
    ],
    hint: [`${NEW_VISIT}`],
    clue: [
      `You have been following ${VICTIM} for a story and found out that ${VICTIM} was having an affair with someone who was married.`,
    ],
  },
};

gunNut = {
  ...gunNut,
  ...{
    description: [
      "You own several guns.",
      `You and your wife are a die-hard ${VICTIM} fans and you believe this ${VICTIM} impersonator is terrible since you have seen him before.`,
      "You have been to several of his other shows and heckle him on and off stage.",
    ],
    hint: ["You are NOT the murderer.", "You have a gun with you.", REGULAR],
    clue: ["You lost your gun at the casino bar last week."],
  },
};

escort = {
  ...escort,
  ...{
    description: [
      `You attend to a good number of ${CASINO}'s most esteemed guests.`,
      "You pride yourself on your class and would never associate with a hussie from the street.",
    ],
    hint: [REGULAR],
    clue: [
      `${VICTIM} once paid you to accompany him to a wedding.`,
      "You tried to seduce him afterwards but he was not interested.",
    ],
  },
};

gladiator = {
  ...gladiator,
  ...{
    description: [
      `You and ${VICTIM} used to be best friends.`,
      `You were previously employed by ${CASINO} to entertain the gamblers.`,
    ],
    hint: [
      "You have a knife / sword.",
      MOTIVE,
      "You might have gotten married once while drunk, you can't remember.",
    ],
    clue: [
      `${VICTIM} ratted you out to the owner for drinking on the job.`,
      `One night in a drunken stupor you told "${dancer.role}" that you were going to stab ${VICTIM} in the back, like Brutus stabbed Caesar.`,
    ],
  },
};

coach = {
  ...coach,
  ...{
    description: [
      "You are the Murderer!",
      "You do not have to tell people the following secrets, but you CANNOT contradict them:",
      `1. You were in a sexual relationship with ${VICTIM}.`,
      `2. You promised ${VICTIM} you would leave your wife for him but never intended to.`,
      `3. ${VICTIM} learns you will never leave your wife and threatens to expose your love affair.`,
      `4. You took "${gunNut.role}'s" gun (he forgot it at the casino bar one night) and shoot ${VICTIM}.`,
      "5. You sneak away into the crowd and join the confusion.",
    ],
    hint: [
      "You are the murderer.",
      REGULAR,
      "You have a gun.",
      MOTIVE,
      "Other people will have clues that may identify you.",
    ],
    clue: [
      'Your "clue to share" with everyone:',
      `- You are a singing coach who has been coaching ${VICTIM} with his voice.`,
      `- You give him private lessons and are frequently at ${CASINO} to critique and watch him.`,
      "At some point before the game is over, you must let people know:",
      "- You are married to your wife (she is not at the casino tonight).",
    ],
  },
};

bouncer = {
  ...bouncer,
  ...{
    description: [
      "You take care of a good majority of the owner`s dirty work.",
      "Your significant other just broke up with you because they found out what type of work you do.",
      "Although loyal, you are not very bright but very friendly.",
      `"${prof.role}" is a regular at ${CASINO} and you are friends with him/her.`,
    ],
    hint: [EMPLOYEE],
    clue: [
      `You know "${diver.role}" and "${cop.role}" are carrying guns because you patted them down as they entered.`,
      `You were talking to "${prof.role}" when you heard the gunshots. He/She is not the murderer.`,
    ],
  },
};

follow = {
  ...follow,
  ...{
    description: [
      "Sugar-sweet, full of yourself, and never seen without a purse-full of pills to get through the night.",
      "You have no steady relationships in your life.",
      "You can pick what type of performance you can do; make it a talent you have!",
    ],
    hint: [EMPLOYEE],
    clue: [
      `You wanted to hang out with ${VICTIM} later tonight for late night drinks but he told you he was busy because he "had to tell someone something important."`,
    ],
  },
};

dancer = {
  ...dancer,
  ...{
    description: [
      "You have been a dancer since you were three years old.",
      `Your a showgirl for ${CASINO}.`,
      "You dream of being an opening act because you long for broadway (and you have nothing keeping you here in Vegas).",
      "You carry pictures of yourself from plays and pageants (you do not actually need pictures, this is just for backstory).",
      "You are full of yourself, and will always lets anyone know when you enter or leave a room, and sometimes throw in a little dance step for good measure.",
    ],
    hint: [EMPLOYEE],
    clue: [
      `"${gladiator.role}" was drunk and told you that he was going to murder ${VICTIM} by stabbing him in the back, like Brutus stabbed Caesar.`,
    ],
  },
};

director = {
  ...director,
  ...{
    description: [
      "You are so depressed, and say that way to inspire art.",
      `You direct all the shows at ${CASINO} and go so far as to call each one a "picture," as if you were really creating a movie with each one.`,
      'Your spouse tells you "you have a habit of dragging down the party with your depressed whining and tend to overreact when people comment."',
      '"It feeds me," you say to peoples\' comments, and walk away in a huff.',
    ],
    hint: [EMPLOYEE, MOTIVE],
    clue: [`${VICTIM} constantly ridiculed you and your art.`],
  },
};

lawyer = {
  ...lawyer,
  ...{
    description: [
      "You are an up-and-coming lawyer and you are on a trip with your wife to Las Vegas.",
      "You are slick, suave, and never go anywhere without a fresh shave, an expensive haircut and a shiny new pair of shoes.",
      "You have the reputation for being one of the finest lawyers in all of the Bay Area.",
    ],
    hint: [`You do not frequent ${CASINO}.`, MOTIVE],
    clue: [
      `You hired ${VICTIM} for a corporate gig, and ${VICTIM} showed up drunk.`,
      "You looked like a fool in front of the senior partners.",
      `You did not know ${VICTIM} was a performer at this casino until you saw his face on posters!`,
    ],
  },
};

diver = {
  ...diver,
  ...{
    description: [
      "You are a hitman (don't share this right away).",
      "Your cover is a scuba diver.",
      `You were NOT hired to murder ${VICTIM} or anyone else at ${CASINO}.`,
      "You are simply here to gamble and have a relaxing weekend.",
    ],
    hint: ["You have a gun with you.", "You have an alibi."],
    clue: [
      `You were talking with "${owner.role}" during the shooting, this is your alibi for not shooting ${VICTIM}.`,
      "You can reveal you are an assassin in any way you would like, but you should reveal this at some point.",
    ],
  },
};

cop = {
  ...cop,
  ...{
    description: [
      "You worked as a cop in New York for 30 years.",
      "You have lots of money because of an injury insurance payout from when you were shot in the arm on duty (and your pension).",
      "You retired and moved to Vegas with your spouse for the warm climate and to play at the casinos.",
    ],
    hint: [
      REGULAR,
      "You always carry your glock (police issued pistol) and it is the only weapon you have on you.",
    ],
    clue: [
      `You cannot think of any motive you would have to murder ${VICTIM}.`,
    ],
  },
};

prof = {
  ...prof,
  ...{
    description: [
      "You are a professor at a local community college.",
      "You are trying your luck at card counting and your spouse likes that you usually win.",
    ],
    hint: [
      `You are at ${CASINO} quite regularly and have made friends with "${bouncer.role}."`,
    ],
    clue: [
      `You were talking with "${bouncer.role}" when the gun went off.`,
      `"${bouncer.role}" is not the murderer and you have an alibi.`,
    ],
  },
};

diner = {
  ...diner,
  ...{
    description: [
      `You have tried to hire ${VICTIM} to play at your 70s diner for over a year now.`,
      "You came down to the casino to persuade him to play at the diner you and your spouse own.",
    ],
    hint: [NEW_VISIT],
    clue: [
      `You came on the same Las Vegas flight as "${lawyer.role}" meaning neither of you were at the casino bar a week ago.`,
    ],
  },
};

ufo = {
  ...ufo,
  ...{
    description: [
      "You are convinced Aliens exist.",
      `You think aliens are responsible for the murder of ${VICTIM}.`,
      "You have no personal connections, with your luck they would turn out to be an alien.",
    ],
    hint: [
      `You frequent ${CASINO} to warn fellow humans of the impending invasion.`,
    ],
    clue: ["It was probably aliens. We cannot rule them out."],
  },
};

crusader = {
  ...crusader,
  ...{
    description: [
      "By day, you are a very socially awkward individual, however you have an alter ego as a caped crusader crime fighter.",
      "You can play this any way you wish (:",
    ],
    hint: [NEW_VISIT],
    clue: [
      `You found "${reporter.role}'s" methods to be somewhat shady, so you were following him/her during the time of the murder.`,
      `You know it was not "${reporter.role}, and you know you did not do it, as you were watching them.`,
    ],
  },
};

librarian = {
  ...librarian,
  ...{
    description: [
      "You local librarian and historian who has a flare for the eccentric.",
      "You live alone with your 15 cats, love true crime, and decided to go to Vegas to learn about the history of the Mafia.",
    ],
    hint: ["try to inquire about the murder weapon, this is important."],
    clue: [
      `You saw ${follow.role} a week ago acting at the Mafia Museum, so the 2 of you have an alibi for that time.`,
    ],
  },
};

author = {
  ...author,
  ...{
    description: [
      "You are a nearly famous author. You were 3 away from hitting the top 500 best selling books.",
      "You let everyone know HOW GREAT of an author you are, unless your spouse is around, then they will let everyone know for you.",
    ],
    hint: [REGULAR, MOTIVE],
    clue: ["Elvis, being well read, gave your book a very terrible review."],
  },
};

poker = {
  ...poker,
  ...{
    description: [
      "You play poker for a living.",
      "In fact, you have no greater love then to gamble, and you make bets on EVERYTHING you do.",
      "This gambling addiction has driven all of your friends away.",
    ],
    hint: [REGULAR],
    clue: [
      `${cop.role} was questioning you about your illegal gambling when the gunshot went off so you know it was neither of you.`,
    ],
  },
};

const roles: MurderRole[] = [
  owner,
  reporter,
  gunNut,
  escort,
  gladiator,
  coach,
  bouncer,
  follow,
  dancer,
  director,
  lawyer,
  diver,
  cop,
  prof,
  diner,
  ufo,
  crusader,
  librarian,
  author,
  poker,
];

// --------------------     Exports     -------------------- //
export default roles;
