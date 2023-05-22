import{r as c,j as o}from"./index-a6626b15.js";import{A as W,a as _,d as K,b as U}from"./ExpandMore-c422068f.js";import{n as R}from"./nl2br.min-ce9ecf22.js";import{T as y}from"./MenuItem-7f5d6ea8.js";import{T as z,a as J,b,c as a}from"./TableRow-fb24c726.js";import"./Collapse-549d17f9.js";const t="The Grand Cinema Magic Hotel and Casino",e="Elvis",O=`As an employee, you are at ${t} regularly.`,w=`You have motive to murder ${e}.`,s=`You are at ${t} regularly.`,G=`You have never been to ${t} before.`,Q=`${t} in Las Vegas is holding a special night for high rollers. Everyone has sauntered through the casino and into the theatre for a swanky show. The music starts, a spotlight comes on, and the curtain rises. The hotel's very own ${e} stands, mic in hand ready to perform when a shot echoes through the dark hall. ${e} falls. It takes a moment for the crowd to realize this isn't part of the act, but when they finally do they know they've all become suspects.`;let Y={role:"The Casino Owner",importance:"Required",gender:"M/F"},n={role:"The Reporter",importance:"Required",gender:"M/F"},i={role:"The Gun Nut",importance:"Required",gender:"M"},$={role:"The Escort",importance:"Required",gender:"F"},k={role:"The Recently Fired Gladiator Actor",importance:"Required",gender:"M"},E={role:"The Singing Coach",importance:"Required",gender:"M"},r={role:"The Bouncer",importance:"Recommended",gender:"M/F"},x={role:"The Second Act",importance:"Recommended",gender:"F"},j={role:"The Dancer",importance:"Recommended",gender:"F"},q={role:"The Depressed Director",importance:"Optional",gender:"M/F"},T={role:"The Lawyer",importance:"Optional",gender:"M"},M={role:"The Scuba Diver",importance:"Optional",gender:"M/F"},p={role:"The Retired Cop",importance:"Optional",gender:"M/F"},m={role:"The Professor",importance:"Optional",gender:"M/F"},I={role:"The Owner of the Diner",importance:"Optional",gender:"M/F"},N={role:"The UFO Conspiracy Nut",importance:"Optional",gender:"M/F"},S={role:"The Caped Crusader",importance:"Optional",gender:"M/F"},B={role:"The Librarian",importance:"Optional",gender:"M/F"},V={role:"The Nearly Famous Author",importance:"Optional",gender:"M/F"},D={role:"The Professional Poker Player",importance:"Optional",gender:"M/F"};Y={...Y,description:`You are the owner of ${t}, and you are running the murder mystery to make sure everything runs smoothly.`,clue:`1. Act as the lead detective if no one steps up. Ask:
- What clues do we have and who can that rule out?
- Did a character have motive to kill ${e}?

2. Breaking news, "${i.role}'s" lost gun from the casino bar last week is the murder weapon!
- "${i.role} Clue" implies any regular could have the gun.
- Was the character at ${t} a week ago? Are they a regular?

3. "${n.role} Clue" implies a married guest has motive to murder ${e}.
- Is the character married?
- Most people will assume ${e}'s relationship is with a women.
- "${$.role} Clue" is meant to imply ${e} is gay.`};n={...n,description:`You are a resident bad boy/girl and have earned quite a reputation for your ability to try any underhanded trick you can think of to get the latest scoop.
Of course, your methods aren’t always legal…but that only matters if you get caught, right?
You are way too consumed with your job which gets in the way of all personal relationships.`,hint:`${G}`,clue:`You have been following ${e} for a story and found out that ${e} was having an affair with someone who was married.`};i={...i,description:`You own several guns.
You and your wife are a die-hard ${e} fans and you believe this ${e} impersonator is terrible since you have seen him before.
You have been to several of his other shows and heckle him on and off stage.`,hint:`You are NOT the murderer.
You have a gun with you.
${s}`,clue:"You lost your gun at the casino bar last week."};$={...$,description:`You attend to a good number of ${t}'s most esteemed guests.
You pride yourself on your class and would never associate with a hussie from the street.`,hint:`${s}`,clue:`${e} once paid you to accompany him to a wedding.
You tried to seduce him afterwards but he was not interested.`};k={...k,description:`You and ${e} used to be best friends.
You were previously employed by ${t} to entertain the gamblers.`,hint:`You have a knife / sword.
${w}
You might have gotten married once while drunk, you can't remember.`,clue:`${e} ratted you out to the owner for drinking on the job.
One night in a drunken stupor you told "${j.role}" that you were going to stab ${e} in the back, like Brutus stabbed Caesar.`};E={...E,description:`You are the Murderer!
You do not have to tell people the following secrets, but you CANNOT contradict them:
1. You were in a sexual relationship with ${e}.
2. You promised ${e} you would leave your wife for him but never intended to.
3. ${e} learns you will never leave your wife and threatens to expose your love affair.
4. You took "${i.role}'s" gun (he forgot it at the casino bar one night) and shoot ${e}.
5. You sneak away into the crowd and join the confusion.`,hint:`You are the murderer.
${s}
You have a gun.
${w}
Other people will have clues that may identify you.`,clue:`Your "clue to share" with everyone:
- You are a singing coach who has been coaching ${e} with his voice.
- You give him private lessons and are frequently at ${t} to critique and watch him.
At some point before the game is over, you must let people know:
- You are married to your wife (she is not at the casino tonight).`};r={...r,description:`You take care of a good majority of the owner\`s dirty work.
Your significant other just broke up with you because they found out what type of work you do.
Although loyal, you are not very bright but very friendly.
"${m.role}" is a regular at ${t} and you are friends with him/her.`,hint:`${O}`,clue:`You know "${M.role}" and "${p.role}" are carrying guns because you patted them down as they entered.
You were talking to "${m.role}" when you heard the gunshots. He/She is not the murderer.`};x={...x,description:`Sugar-sweet, full of yourself, and never seen without a purse-full of pills to get through the night.
You have no steady relationships in your life.
You can pick what type of performance you can do; make it a talent you have!`,hint:`${O}`,clue:`You wanted to hang out with ${e} later tonight for late night drinks but he told you he was busy because he "had to tell someone something important."`};j={...j,description:`You have been a dancer since you were three years old.
Your a showgirl for ${t}.
You dream of being an opening act because you long for broadway (and you have nothing keeping you here in Vegas).
You carry pictures of yourself from plays and pageants (you do not actually need pictures, this is just for backstory).
You are full of yourself, and will always lets anyone know when you enter or leave a room, and sometimes throw in a little dance step for good measure.`,hint:`${O}`,clue:`"${k.role}" was drunk and told you that he was going to murder ${e} by stabbing him in the back, like Brutus stabbed Caesar.`};q={...q,description:`You are so depressed, and say that way to inspire art.
You direct all the shows at ${t} and go so far as to call each one a "picture," as if you were really creating a movie with each one.
Your spouse tells you "you have a habit of dragging down the party with your depressed whining and tend to overreact when people comment."
"It feeds me," you say to peoples' comments, and walk away in a huff.`,hint:`${O}
${w}`,clue:`${e} constantly ridiculed you and your art.`};T={...T,description:`You are an up-and-coming lawyer and you are on a trip with your wife to Las Vegas.
You are slick, suave, and never go anywhere without a fresh shave, an expensive haircut and a shiny new pair of shoes.
You have the reputation for being one of the finest lawyers in all of the Bay Area.`,hint:`You do not frequent ${t}.
${w}`,clue:`You hired ${e} for a corporate gig, and ${e} showed up drunk.
You looked like a fool in front of the senior partners.
You did not know ${e} was a performer at this casino until you saw his face on posters!`};M={...M,description:`You are a hitman (don't share this right away).
Your cover is a scuba diver.
You were NOT hired to murder ${e} or anyone else at ${t}.
You are simply here to gamble and have a relaxing weekend.`,hint:`You have a gun with you.
You have an alibi.`,clue:`You were talking with "${Y.role}" during the shooting, this is your alibi for not shooting ${e}.
You can reveal you are an assassin in any way you would like, but you should reveal this at some point.`};p={...p,description:`You worked as a cop in New York for 30 years.
You have lots of money because of an injury insurance payout from when you were shot in the arm on duty (and your pension).
You retired and moved to Vegas with your spouse for the warm climate and to play at the casinos.`,hint:`${s}
You always carry your glock (police issued pistol) and it is the only weapon you have on you.`,clue:`You cannot think of any motive you would have to murder ${e}.`};m={...m,description:`You are a professor at a local community college.
You are trying your luck at card counting and your spouse likes that you usually win.`,hint:`You are at ${t} quite regularly and have made friends with "${r.role}."`,clue:`You were talking with "${r.role}" when the gun went off.
"${r.role}" is not the murderer and you have an alibi.`};I={...I,description:`You have tried to hire ${e} to play at your 70s diner for over a year now.
You came down to the casino to persuade him to play at the diner you and your spouse own.`,hint:`${G}`,clue:`You came on the same Las Vegas flight as "${T.role}" meaning neither of you were at the casino bar a week ago.`};N={...N,description:`You are convinced Aliens exist.
You think aliens are responsible for the murder of ${e}.
You have no personal connections, with your luck they would turn out to be an alien.`,hint:`You frequent ${t} to warn fellow humans of the impending invasion.`,clue:"It was probably aliens. We cannot rule them out."};S={...S,description:`By day, you are a very socially awkward individual, however you have an alter ego as a caped crusader crime fighter.
You can play this any way you wish (:`,hint:`${G}`,clue:`You found "${n.role}'s" methods to be somewhat shady, so you were following him/her during the time of the murder.
You know it was not "${n.role}, and you know you did not do it, as you were watching them.`};B={...B,description:`You local librarian and historian who has a flare for the eccentric.
You live alone with your 15 cats, love true crime, and decided to go to Vegas to learn about the history of the Mafia.`,hint:"try to inquire about the murder weapon, this is important.",clue:`You saw ${x.role} a week ago acting at the Mafia Museum, so the 2 of you have an alibi for that time.`};V={...V,description:`You are a nearly famous author. You were 3 away from hitting the top 500 best selling books.
You let everyone know HOW GREAT of an author you are, unless your spouse is around, then they will let everyone know for you.`,hint:`${s}
${w}`,clue:"Elvis, being well read, gave your book a very terrible review."};D={...D,description:`You play poker for a living.
In fact, you have no greater love then to gamble, and you make bets on EVERYTHING you do.
This gambling addiction has driven all of your friends away.`,hint:`${s}`,clue:`${p.role} was questioning you about your illegal gambling when the gunshot went off so you know it was neither of you.`};const X=[Y,n,i,$,k,E,r,x,j,q,T,M,p,m,I,N,S,B,V,D],Z={display:"flex",justifyContent:"space-between",width:"95%"},L={display:"flex"},ee=c.memo(g=>{const{expanded:f,expandedKey:u,handleChange:C,role:l,importance:h,gender:d,description:F,hint:v,clue:A}=g;return o.jsxs(W,{expanded:f===u,onChange:C(u),children:[o.jsx(_,{expandIcon:o.jsx(K,{}),children:o.jsxs("div",{style:Z,children:[o.jsx(y,{style:L,children:l}),o.jsx(y,{style:L,children:h})]})}),o.jsx(U,{children:o.jsx(z,{children:o.jsxs(J,{children:[o.jsxs(b,{children:[o.jsx(a,{children:"Gender"}),o.jsx(a,{children:d})]}),o.jsxs(b,{children:[o.jsx(a,{children:"Description"}),o.jsx(a,{children:R(F)})]}),v&&o.jsxs(b,{children:[o.jsx(a,{children:"Hint"}),o.jsx(a,{children:R(v)})]}),o.jsxs(b,{children:[o.jsx(a,{children:"Clue"}),o.jsx(a,{children:R(A)})]})]})})})]})}),oe=c.memo(()=>{const[g,f]=c.useState(""),u=c.useCallback(l=>(h,d)=>{f(d?l:"")},[f]),C=c.useMemo(()=>X.map((l,h)=>{const{role:d,importance:F,gender:v,description:A,hint:P,clue:H}=l;return o.jsx(ee,{expanded:g,role:d,importance:F,gender:v,description:A,hint:P,clue:H,expandedKey:`${h}`,handleChange:u},h)}),[g,u]);return o.jsxs(o.Fragment,{children:[o.jsx(y,{variant:"h2",component:"h1",gutterBottom:!0,children:"Murder Mystery"}),o.jsx("hr",{}),o.jsx(y,{variant:"h3",component:"h2",gutterBottom:!0,children:`Murder at ${t}`}),o.jsx("hr",{}),o.jsx(y,{gutterBottom:!0,children:Q}),o.jsx("hr",{}),C]})}),ue=oe;export{ue as default};
//# sourceMappingURL=index-22481467.js.map
