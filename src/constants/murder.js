export const CASINO = 'The Cinema Magic Hotel and Casino';
const MALE = 'M';
const FEMALE = 'F';
const NEUTRAL = 'M/F';
const I1 = '1. Required';
const I2 = '2. Recommended';
const I3 = '3. Optional';

export default [
  {
    role: 'The Casino Owner',
    importance: I1,
    person: 'Ken',
    gender: NEUTRAL,
    description:
      'You are running the murder mystery to make sure everything runs smoothly.',
    hint:
      '"The Reporter Clue" implies a married guest has motive to murder Elvis.\n' +
      'Most people will assume his relationship is with a women.\n\n' +
      '"The Gun Nut Clue" implies any regular could have the gun.\n\n' +
      '"The Escort Clue" is meant to imply Elvis is gay.',
    clue:
      '1. Act as the lead detective if no one steps up. Simply ask: "What clues do we have and who can that rule out?"\n' +
      '2. Breaking news, "The Gun Nut\'s" lost gun from the casino bar last week is the murder weapon!\n' +
      `3. Is the character a regular at ${CASINO}?\n` +
      '4. Is the character married?'
  },
  {
    role: 'The Investigator / Reporter',
    importance: I1,
    person: 'Jon',
    gender: NEUTRAL,
    description:
      'You are a resident bad boy/girl and have earned quite a reputation for your ability to try any underhanded trick you can think of to get the latest scoop.\n' +
      'Of course, your methods aren’t always legal…but that only matters if you get caught, right?',
    hint: `You have never been to ${CASINO} before.`,
    clue:
      'You have been following Elvis for a story and found out that Elvis was in a relationship with someone who was married.'
  },
  {
    role: 'The Gun Nut',
    importance: I1,
    person: 'Andy',
    gender: MALE,
    description:
      'You own several guns.\n' +
      'You and your wife are a die-hard Elvis fans and you believe this Elvis impersonator is terrible since you have seen him before.\n' +
      'You have been to several of his other shows and heckle him on and off stage.',
    hint:
      'You are NOT the murderer.\n' +
      'You have a gun with you.\n' +
      `You are at ${CASINO} regularly.`,
    clue: 'You lost your gun at the casino bar last week.'
  },
  {
    role: 'The Escort',
    importance: I1,
    person: 'Julia',
    gender: FEMALE,
    description:
      `You attend to a good number of ${CASINO}'s most esteemed guests.\n` +
      'You pride yourself on your class and would never associate with a hussie from the street.',
    hint: `You frequent ${CASINO}.`,
    clue:
      'Elvis once paid you to accompany him to a wedding.\n' +
      'You tried to seduce him afterwards but he was not interested.'
  },
  {
    role: 'The Recently Fired Gladiator Actor',
    importance: I1,
    person: 'Jordan',
    gender: MALE,
    description:
      'You and Elvis used to be best friends.\n' +
      `You were previously employed by ${CASINO} to entertain the gamblers.`,
    hint: 'You have a knife / sword.\n' + 'You have motive to kill Elvis.',
    clue:
      'Elvis ratted you out to the owner for drinking on the job.\n' +
      'One night in a drunken stupor you told "The Dancer" that you were going to stab Elvis in the back, like Brutus stabbed Caesar.'
  },
  {
    role: 'The Singing Coach',
    importance: I1,
    person: 'Gus',
    gender: MALE,
    description:
      'You are the Murderer!\n' +
      'You do not have to tell people the following secrets, but you CANNOT contradict them:\n' +
      '1. You were in a sexual relationship with Elvis.\n' +
      '2. You promised Elvis you would leave your wife for him but never intended to.\n' +
      '3. Elvis learns you will never leave your wife and threatens to expose your love affair.\n' +
      '4. You took "The Gun Nut\'s" gun (he forgot it at the casino bar one night) and shoot Elvis.\n' +
      '5. You sneak away into the crowd and join the confusion.',
    hint:
      'You are the murderer.\n' +
      `You are at ${CASINO} regularly.\n` +
      'You have a gun.\n' +
      'You have motive to kill Elvis.\n' +
      'Other people will have clues that may identify you.',
    clue:
      'You must tell others:\n' +
      'You are a singing coach who has been coaching Elvis with his voice.\n' +
      `You give him private lessons and are frequently at ${CASINO} to critique and watch him.\n` +
      'You are married to your wife (she is not at the casino tonight).\n' +
      'You can pretend you have no clue to share.'
  },
  {
    role: 'The Bouncer',
    importance: I2,
    person: 'Tom',
    gender: NEUTRAL,
    description:
      'You take care of a good majority of the owner`s dirty work.\n' +
      'Although loyal, you are not very bright but very friendly.\n' +
      'You are a bachelor(ette).\n' +
      `"The Professor" is a regular at ${CASINO} and you are friends with him/her.`,
    hint: `As an employee, you are at ${CASINO} regularly.`,
    clue:
      'You know "The Scuba Diver" and "The Retired Cop" are carrying guns because you patted them down as they entered.\n' +
      'You were talking to "The Professor" when you heard the gunshots. He/She is not the murderer.'
  },
  {
    role: 'The Second Act',
    importance: I2,
    person: 'Libby',
    gender: NEUTRAL,
    description:
      'Sugar-sweet, full of yourself, and never seen without a purse-full of pills to get through the night.',
    hint: `As an employee, you are at ${CASINO} regularly.`,
    clue:
      'You wanted to hang out with Elvis later tonight for late night drinks but he told you he was busy because he "had to tell someone something."'
  },
  {
    role: 'The Dancer',
    importance: I2,
    person: 'Emily',
    gender: FEMALE,
    description:
      'You have been a dancer since you were three years old.\n' +
      'Your a showgirl for the hotel.\n' +
      'You dream of being an opening act because you long for broadway.\n' +
      'You carry pictures of yourself from plays and pageants (you do not actually need pictures, this is just for backstory).\n' +
      'You are full of yourself, and will always lets anyone know when you enter or leave a room, and sometimes throw in a little dance step for good measure.',
    hint: `As an employee, you are at ${CASINO} regularly.`,
    clue:
      '"The Recently Fired Gladiator Actor" was drunk and told you that he was going to kill Elvis by stabbing him in the back, like Brutus stabbed Caesar.'
  },
  {
    role: 'The Depressed Director',
    importance: I3,
    person: 'Aaron',
    gender: NEUTRAL,
    description:
      'You are so depressed, and say that way to inspire art.\n' +
      `You direct all the shows at ${CASINO} and go so far as to call each one a "picture," as if you were really creating a movie with each one.\n` +
      'You have a habit of dragging down the party with your depressed whining and tend to overreact when people comment.\n' +
      '"It feeds me," you say to peoples\' comments, and walk away in a huff.',
    hint:
      `As an employee, you are at ${CASINO} regularly.\n` +
      'You have motive to kill Elvis.',
    clue: 'Elvis constantly ridiculed you and your art.'
  },
  {
    role: 'The Lawyer',
    importance: I3,
    person: '',
    gender: MALE,
    description:
      'You are an up-and-coming lawyer and you are on a trip to Las Vegas.\n' +
      'You are slick, suave, and never go anywhere without a fresh shave, an expensive haircut and a shiny new pair of shoes.\n' +
      'You have the reputation for being one of the finest lawyers in all of Ashton.',
    hint: `You do not frequent ${CASINO}.\n` + 'You have motive to kill Elvis.',
    clue:
      'You hired Elvis for a corporate gig, and Elvis showed up drunk.\n' +
      'You looked like a fool in front of the senior partners.\n' +
      'You did not know Elvis was a performer at this casino until you saw his face on posters!'
  },
  {
    role: 'The Scuba Diver / Assassin',
    importance: I3,
    person: 'Lauren',
    gender: NEUTRAL,
    description:
      'You are a hitman.\n' +
      'Your cover is a scuba diver.\n' +
      `You were NOT hired to kill Elvis or anyone else at ${CASINO}.\n` +
      'You are simply here to gamble and have a relaxing weekend.',
    hint: 'You have a gun with you.\n' + 'You have an alibi.',
    clue:
      'You were talking with the bartender during the shooting, this is your alibi for not shooting Elvis.\n' +
      'You can reveal you are an assassin in any way you would like, but you should reveal this at some point.'
  },
  {
    role: 'The Retired Cop',
    importance: I3,
    person: 'Samantha',
    gender: NEUTRAL,
    description: 'You worked as a cop in New York for 30 years.',
    hint:
      `You frequent ${CASINO}.\n` +
      'You always carry your glock (police issued pistol).',
    clue:
      'You are retired and have lots of money because of your pension and an injury insurance payout from when you were shot in the arm on duty.\n' +
      'You cannot think of any motive you would have to kill Elvis.'
  },
  {
    role: 'The Teacher / Professor',
    importance: I3,
    person: 'Emerald',
    gender: NEUTRAL,
    description:
      'You are a professor at a local college.\n' +
      'You are trying your luck at card counting.',
    hint: `You are at ${CASINO} quite regularly and have made friends with "The Bouncer."`,
    clue:
      'You were talking with "The Bouncer" when the gun went off, he is not the murderer.'
  },
  {
    role: 'The Owner of Diner',
    importance: I3,
    person: '',
    gender: NEUTRAL,
    description:
      'You have tried to hire Elvis to play at your 70s diner for over a year now.\n' +
      'You came down to the casino to persuade him to play at your diner.',
    hint: `You do not frequent ${CASINO}.`,
    clue:
      'You came on the same Las Vegas flight as "The Lawyer" meaning neither of you were at the casino bar a week ago.'
  },
  {
    role: 'The UFO Conspiracy Nut',
    importance: I3,
    person: 'Scott',
    gender: NEUTRAL,
    description:
      'You are convinced Aliens exist.\n' +
      'You think aliens are responsible for the murder of Elvis.',
    hint: `You frequent ${CASINO} to warn fellow humans of the impending invasion`,
    clue: 'It was probably aliens. We cannot rule them out.'
  },
  {
    role: 'The Caped Crusader',
    importance: I3,
    person: '',
    gender: NEUTRAL,
    description:
      'By day, you are a very socially awkward individual, however you have an alter ego as a caped crusader crime fighter.\n' +
      'You can play this any way you wish (:',
    hint: `You do not frequent ${CASINO}.`,
    clue:
      'You found "The Investigator\'s" methods to be somewhat shady, so you were following him/her during the time of the murder.\n' +
      'You know it was not "The Investigator."'
  } //,
  // {
  //   role: '',
  //   importance: I3,
  //   person: '',
  //   gender: NEUTRAL,
  //   description: '',
  //   hint: '',
  //   clue: ''
  // }
];
