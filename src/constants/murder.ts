// --------------------     Types     -------------------- //
enum Gender {
  MALE = 'M',
  FEMALE = 'F',
  NEUTRAL = 'M/F',
}
enum Importance {
  I1 = 'Required',
  I2 = 'Recommended',
  I3 = 'Optional',
}
interface MurderRole {
  role: string;
  gender: Gender;
  importance: Importance;
  description: string;
  hint: string;
  clue: string;
}

// --------------------     Globals     -------------------- //
export const CASINO = 'The Cinema Magic Hotel and Casino';
const VICTIM = 'Elvis';
const EMPLOYEE = `As an employee, you are at ${CASINO} regularly.`;
const MOTIVE = `You have motive to murder ${VICTIM}.`;
const REGULAR = `You are at ${CASINO} regularly.`;
const NEW_VISIT = `You have never been to ${CASINO} before.`;
const SINGLE = 'You are not married.';
const MARRIED = 'You are married.';

// --------------------     Profiles V1     -------------------- //
let owner = {
  role: 'The Casino Owner',
  importance: Importance.I1,
  gender: Gender.NEUTRAL,
};
let reporter = {
  role: 'The Reporter',
  importance: Importance.I1,
  gender: Gender.NEUTRAL,
};
let gunNut = {
  role: 'The Gun Nut',
  importance: Importance.I1,
  gender: Gender.MALE,
};
let escort = {
  role: 'The Escort',
  importance: Importance.I1,
  gender: Gender.FEMALE,
};
let gladiator = {
  role: 'The Recently Fired Gladiator Actor',
  importance: Importance.I1,
  gender: Gender.MALE,
};
let coach = {
  role: 'The Singing Coach',
  importance: Importance.I1,
  gender: Gender.MALE,
};
let bouncer = {
  role: 'The Bouncer',
  importance: Importance.I2,
  gender: Gender.NEUTRAL,
};
let follow = {
  role: 'The Second Act',
  importance: Importance.I2,
  gender: Gender.NEUTRAL,
};
let dancer = {
  role: 'The Dancer',
  importance: Importance.I2,
  gender: Gender.FEMALE,
};
let director = {
  role: 'The Depressed Director',
  importance: Importance.I3,
  gender: Gender.NEUTRAL,
};
let lawyer = {
  role: 'The Lawyer',
  importance: Importance.I3,
  gender: Gender.MALE,
};
let diver = {
  role: 'The Scuba Diver',
  importance: Importance.I3,
  gender: Gender.NEUTRAL,
};
let cop = {
  role: 'The Retired Cop',
  importance: Importance.I3,
  gender: Gender.NEUTRAL,
};
let prof = {
  role: 'The Professor',
  importance: Importance.I3,
  gender: Gender.NEUTRAL,
};
let diner = {
  role: 'The Owner of Diner',
  importance: Importance.I3,
  gender: Gender.NEUTRAL,
};
let ufo = {
  role: 'The UFO Conspiracy Nut',
  importance: Importance.I3,
  gender: Gender.NEUTRAL,
};
let crusader = {
  role: 'The Caped Crusader',
  importance: Importance.I3,
  gender: Gender.NEUTRAL,
};
let librarian = {
  role: 'The Librarian',
  importance: Importance.I3,
  gender: Gender.NEUTRAL,
};
let author = {
  role: 'The Nearly Famous Author',
  importance: Importance.I3,
  gender: Gender.NEUTRAL,
};
let poker = {
  role: 'The Professional Poker Player',
  importance: Importance.I3,
  gender: Gender.NEUTRAL,
};

// --------------------     Profiles V2     -------------------- //
owner = {
  ...owner,
  ...{
    description:
    `You are the owner of ${CASINO}, and you are running the murder mystery to make sure everything runs smoothly.`,
    hint:
    `"${reporter.role} Clue" implies a married guest has motive to murder ${VICTIM}.\n`
    + 'Most people will assume his relationship is with a women.\n\n'
    + `"${gunNut.role} Clue" implies any regular could have the gun.\n\n`
    + `"${escort.role} Clue" is meant to imply ${VICTIM} is gay.`,
    clue:
    '1. Act as the lead detective if no one steps up. Simply ask: "What clues do we have and who can that rule out?"\n'
    + `2. Breaking news, "${gunNut.role}'s" lost gun from the casino bar last week is the murder weapon!\n`
    + `3. Is the character a regular at ${CASINO}?\n`
    + '4. Is the character married?',
  },
};

reporter = {
  ...reporter,
  ...{
    description:
    'You are a resident bad boy/girl and have earned quite a reputation for your ability to try any underhanded trick you can think of to get the latest scoop.\n'
    + 'Of course, your methods aren’t always legal…but that only matters if you get caught, right?',
    hint:
    `${NEW_VISIT}\n${SINGLE}`,
    clue:
    `You have been following ${VICTIM} for a story and found out that ${VICTIM} was in a relationship with someone who was married.`,
  },
};

gunNut = {
  ...gunNut,
  ...{
    description:
    'You own several guns.\n'
    + `You and your wife are a die-hard ${VICTIM} fans and you believe this ${VICTIM} impersonator is terrible since you have seen him before.\n`
    + 'You have been to several of his other shows and heckle him on and off stage.',
    hint:
    `You are NOT the murderer.\nYou have a gun with you.\n${REGULAR}\n${MARRIED}`,
    clue:
    'You lost your gun at the casino bar last week.',
  },
};

escort = {
  ...escort,
  ...{
    description:
    `You attend to a good number of ${CASINO}'s most esteemed guests.\n`
    + 'You pride yourself on your class and would never associate with a hussie from the street.',
    hint:
    `${REGULAR}\n${SINGLE}`,
    clue:
    `${VICTIM} once paid you to accompany him to a wedding.\n`
    + 'You tried to seduce him afterwards but he was not interested.',
  },
};

gladiator = {
  ...gladiator,
  ...{
    description:
    `You and ${VICTIM} used to be best friends.\n`
    + `You were previously employed by ${CASINO} to entertain the gamblers.`,
    hint:
    `You have a knife / sword.\n${MOTIVE}\n`
    + 'You might have gotten married once while drunk, you can\'t remember.',
    clue:
    `${VICTIM} ratted you out to the owner for drinking on the job.\n`
    + `One night in a drunken stupor you told "${dancer.role}" that you were going to stab ${VICTIM} in the back, like Brutus stabbed Caesar.`,
  },
};

coach = {
  ...coach,
  ...{
    description:
    'You are the Murderer!\n'
    + 'You do not have to tell people the following secrets, but you CANNOT contradict them:\n'
    + `1. You were in a sexual relationship with ${VICTIM}.\n`
    + `2. You promised ${VICTIM} you would leave your wife for him but never intended to.\n`
    + `3. ${VICTIM} learns you will never leave your wife and threatens to expose your love affair.\n`
    + `4. You took "${gunNut.role}'s" gun (he forgot it at the casino bar one night) and shoot ${VICTIM}.\n`
    + '5. You sneak away into the crowd and join the confusion.',
    hint:
    `You are the murderer.\n${REGULAR}\n`
    + `You have a gun.\n${MOTIVE}\n${MARRIED}\n`
    + 'Other people will have clues that may identify you.',
    clue:
    'You must tell others:\n'
    + `You are a singing coach who has been coaching ${VICTIM} with his voice.\n`
    + `You give him private lessons and are frequently at ${CASINO} to critique and watch him.\n`
    + 'You are married to your wife (she is not at the casino tonight).\n'
    + 'You can pretend you have no clue to share.',
  },
};

bouncer = {
  ...bouncer,
  ...{
    description:
    'You take care of a good majority of the owner`s dirty work.\n'
    + 'Although loyal, you are not very bright but very friendly.\n'
    + `"${prof.role}" is a regular at ${CASINO} and you are friends with him/her.`,
    hint:
    `${EMPLOYEE}\n${SINGLE}`,
    clue:
    `You know "${diver.role}" and "${cop.role}" are carrying guns because you patted them down as they entered.\n`
    + `You were talking to "${prof.role}" when you heard the gunshots. He/She is not the murderer.`,
  },
};

follow = {
  ...follow,
  ...{
    description:
    'Sugar-sweet, full of yourself, and never seen without a purse-full of pills to get through the night.',
    hint:
    `${EMPLOYEE}\n${SINGLE}`,
    clue:
    `You wanted to hang out with ${VICTIM} later tonight for late night drinks but he told you he was busy because he "had to tell someone something."`,
  },
};

dancer = {
  ...dancer,
  ...{
    description:
    'You have been a dancer since you were three years old.\n'
    + `Your a showgirl for ${CASINO}.\n`
    + 'You dream of being an opening act because you long for broadway.\n'
    + 'You carry pictures of yourself from plays and pageants (you do not actually need pictures, this is just for backstory).\n'
    + 'You are full of yourself, and will always lets anyone know when you enter or leave a room, and sometimes throw in a little dance step for good measure.',
    hint:
    `${EMPLOYEE}\n${SINGLE}`,
    clue:
    `"${gladiator.role}" was drunk and told you that he was going to murder ${VICTIM} by stabbing him in the back, like Brutus stabbed Caesar.`,
  },
};

director = {
  ...director,
  ...{
    description:
    'You are so depressed, and say that way to inspire art.\n'
    + `You direct all the shows at ${CASINO} and go so far as to call each one a "picture," as if you were really creating a movie with each one.\n`
    + 'You have a habit of dragging down the party with your depressed whining and tend to overreact when people comment.\n'
    + '"It feeds me," you say to peoples\' comments, and walk away in a huff.',
    hint:
    `${EMPLOYEE}\n${MOTIVE}\n${MARRIED}`,
    clue:
    `${VICTIM} constantly ridiculed you and your art.`,
  },
};

lawyer = {
  ...lawyer,
  ...{
    description:
    'You are an up-and-coming lawyer and you are on a trip to Las Vegas.\n'
    + 'You are slick, suave, and never go anywhere without a fresh shave, an expensive haircut and a shiny new pair of shoes.\n'
    + 'You have the reputation for being one of the finest lawyers in all of the Bay Area.',
    hint:
    `You do not frequent ${CASINO}.\n${MOTIVE}\n${MARRIED}`,
    clue:
    `You hired ${VICTIM} for a corporate gig, and ${VICTIM} showed up drunk.\n`
    + 'You looked like a fool in front of the senior partners.\n'
    + `You did not know ${VICTIM} was a performer at this casino until you saw his face on posters!`,
  },
};

diver = {
  ...diver,
  ...{
    description:
    'You are a hitman.\n'
    + 'Your cover is a scuba diver.\n'
    + `You were NOT hired to murder ${VICTIM} or anyone else at ${CASINO}.\n`
    + 'You are simply here to gamble and have a relaxing weekend.',
    hint:
    `You have a gun with you.\nYou have an alibi.\n${SINGLE}`,
    clue:
    `You were talking with "${owner.role}" during the shooting, this is your alibi for not shooting ${VICTIM}.\n`
    + 'You can reveal you are an assassin in any way you would like, but you should reveal this at some point.',
  },
};

cop = {
  ...cop,
  ...{
    description:
    'You worked as a cop in New York for 30 years.',
    hint:
    `${REGULAR}\nYou always carry your glock (police issued pistol).\n${MARRIED}`,
    clue:
    'You are retired and have lots of money because of your pension and an injury insurance payout from when you were shot in the arm on duty.\n'
    + `You cannot think of any motive you would have to murder ${VICTIM}.`,
  },
};

prof = {
  ...prof,
  ...{
    description:
    'You are a professor at a local college.\n'
    + 'You are trying your luck at card counting.',
    hint:
    `You are at ${CASINO} quite regularly and have made friends with "${bouncer.role}."\n${MARRIED}`,
    clue:
    `You were talking with "${bouncer.role}" when the gun went off.\n`
    + `"${bouncer.role}" is not the murderer and you have an alibi.`,
  },
};

diner = {
  ...diner,
  ...{
    description:
    `You have tried to hire ${VICTIM} to play at your 70s diner for over a year now.\n`
    + 'You came down to the casino to persuade him to play at your diner.',
    hint:
    `${NEW_VISIT}\n${MARRIED}`,
    clue:
    `You came on the same Las Vegas flight as "${lawyer.role}" meaning neither of you were at the casino bar a week ago.`,
  },
};

ufo = {
  ...ufo,
  ...{
    description:
    'You are convinced Aliens exist.\n'
    + `You think aliens are responsible for the murder of ${VICTIM}.`,
    hint:
    `You frequent ${CASINO} to warn fellow humans of the impending invasion\n`
    + 'You would never get married, with your luck they would turn out to be an alien.',
    clue:
    'It was probably aliens. We cannot rule them out.',
  },
};

crusader = {
  ...crusader,
  ...{
    description:
    'By day, you are a very socially awkward individual, however you have an alter ego as a caped crusader crime fighter.\n'
    + 'You can play this any way you wish (:',
    hint:
    `${NEW_VISIT}\n${MARRIED}`,
    clue:
    `You found "${reporter.role}'s" methods to be somewhat shady, so you were following him/her during the time of the murder.\n`
    + `You know it was not "${reporter.role}."`,
  },
};

librarian = {
  ...librarian,
  ...{
    description:
    'You local librarian and historian who has a flare for the eccentric.\n'
    + 'You live with your 15 cats, love true crime, and decided to go to Vegas to learn about the history of the Mafia',
    hint:
    SINGLE,
    clue:
    `You saw ${follow.role} a week ago acting at the Mafia Museum at the time ${gunNut.role}'s gun went missing`,
  },
};

author = {
  ...author,
  ...{
    description:
    'You are a nearly famous author. You were 3 away from hitting the top 500 best selling books.\n'
    + 'You let everyone know HOW GREAT of an author you are.',
    hint:
    `${REGULAR}\n${MOTIVE}\n${MARRIED}`,
    clue:
    'Elvis, being well read, gave your book a very terrible review.',
  },
};

poker = {
  ...poker,
  ...{
    description:
    'You play poker for a living.\n'
    + 'In fact, you have no greater love then to gamble, and you make bets on EVERYTHING you do.',
    hint:
    `${REGULAR}\n${SINGLE}`,
    clue:
    `${cop.role} was questioning you about your illegal gambling when the gunshot went off so you know it was neither of you.`,
  },
};

// --------------------     Exports     -------------------- //
export default [
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
] as MurderRole[];
