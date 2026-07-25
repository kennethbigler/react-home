import{n as e}from"./rolldown-runtime-Bh1tDfsg.js";import{Dt as t,Lt as n,ht as r,rn as i,xt as a}from"./mui-vendor-Qzd5cThJ.js";import{t as o}from"./TabGroup-BpK8XZfF.js";var s=e(i(),1),c=e=>new Promise(t=>setTimeout(t,e)),l=/(?:[.?!]|\.{2,}|\n)\s*$/,u=class{constructor(e){t(this,`options`,void 0),this.options=e}async*process(e){let{debounceMs:t,flushOnSentenceBoundary:n}=this.options,r=e[Symbol.asyncIterator](),i=``,a=null,o=()=>{if(!i)return null;let e=i;return i=``,a=null,e},s=r.next();for(;;){let e=i.length>0&&a!==null?Math.max(0,a-Date.now()):1/0,u=e===1/0?{kind:`token`,result:await s}:await Promise.race([s.then(e=>({kind:`token`,result:e})),c(e).then(()=>({kind:`timer`}))]);if(u.kind===`token`){if(s=r.next(),u.result.done)break;let e=u.result.value;if(yield{type:`token`,value:e},i+=e,a=Date.now()+t,n&&l.test(i)){let e=o();e&&(yield{type:`announcement`,value:e})}continue}let d=o();d&&(yield{type:`announcement`,value:d})}let u=o();u&&(yield{type:`announcement`,value:u})}};async function*d(e){let t=``;for await(let n of e)t+=n,l.test(t)&&(yield t,t=``);t.length>0&&(yield t)}var f=e=>new Promise(t=>setTimeout(t,e)),p=(e,t)=>Math.floor(Math.random()*(t-e+1))+e,m=(e,t)=>(e.match(/\S+\s*/g)??[]).flatMap(e=>{if(e.trim().length<=2||Math.random()>t)return[e];let n=p(1,e.trim().length-1);return[e.slice(0,n),e.slice(n)]});async function*h(e,t={}){let{minDelayMs:n=30,maxDelayMs:r=150,midWordSplitChance:i=.15}=t,a=m(e,i);for(let e of a)await f(p(n,r)),yield e}var g=`Episode I - THE PHANTOM MENACE
Turmoil has engulfed the Galactic Republic. The taxation of trade routes to outlying star systems is in dispute.
Hoping to resolve the matter with a blockade of deadly battleships, the greedy Trade Federation has stopped all shipping to the small planet of Naboo.
While the Congress of the Republic endlessly debates this alarming chain of events, the Supreme Chancellor has secretly dispatched two Jedi Knights, the guardians of peace and justice in the galaxy, to settle the conflict...

Episode II - ATTACK OF THE CLONES
There is unrest in the Galactic Senate. Several thousand solar systems have declared their intentions to leave the Republic.
This separatist movement, under the leadership of the mysterious Count Dooku, has made it difficult for the limited number of Jedi Knights to maintain peace and order in the galaxy.
Senator Amidala, the former Queen of Naboo, is returning to the Galactic Senate to vote on the critical issue of creating an ARMY OF THE REPUBLIC to assist the overwhelmed Jedi...

Episode III - REVENGE OF THE SITH
War! The Republic is crumbling under attacks by the ruthless Sith Lord, Count Dooku. There are heroes on both sides. Evil is everywhere.
In a stunning move, the fiendish droid leader, General Grievous, has swept into the Republic capital and kidnapped Chancellor Palpatine, leader of the Galactic Senate.
As the Separatist Droid Army attempts to flee the besieged capital with their valuable hostage, two Jedi Knights lead a desperate mission to rescue the captive Chancellor...

Episode IV - A NEW HOPE
It is a period of civil war. Rebel spaceships, striking from a hidden base, have won their first victory against the evil Galactic Empire.
During the battle, Rebel spies managed to steal secret plans to the Empire's ultimate weapon, the DEATH STAR, an armored space station with enough power to destroy an entire planet.
Pursued by the Empire's sinister agents, Princess Leia races home aboard her starship, custodian of the stolen plans that can save her people and restore freedom to the galaxy...

Episode V - THE EMPIRE STRIKES BACK
It is a dark time for the Rebellion. Although the Death Star has been destroyed, Imperial troops have driven the Rebel forces from their hidden base and pursued them across the galaxy.
Evading the dreaded Imperial Starfleet, a group of freedom fighters led by Luke Skywalker has established a new secret base on the remote ice world of Hoth.
The evil lord Darth Vader, obsessed with finding young Skywalker, has dispatched thousands of remote probes into the far reaches of space...

Episode VI - RETURN OF THE JEDI
Luke Skywalker has returned to his home planet of Tatooine in an attempt to rescue his friend Han Solo from the clutches of the vile gangster Jabba the Hutt.
Little does Luke know that the GALACTIC EMPIRE has secretly begun construction on a new armored space station even more powerful than the first dreaded Death Star.
When completed, this ultimate weapon will spell certain doom for the small band of rebels struggling to restore freedom to the galaxy...

Episode VII - THE FORCE AWAKENS
Luke Skywalker has vanished. In his absence, the sinister FIRST ORDER has risen from the ashes of the Empire and will not rest until Skywalker, the last Jedi, has been destroyed.
With the support of the REPUBLIC, General Leia Organa leads a brave RESISTANCE. She is desperate to find her brother Luke and gain his help in restoring peace and justice to the galaxy.
Leia has sent her most daring pilot on a secret mission to Jakku, where an old ally has discovered a clue to Luke's whereabouts...

Episode VIII - THE LAST JEDI
The FIRST ORDER reigns. Having decimated the peaceful Republic, Supreme Leader Snoke now deploys his merciless legions to seize military control of the galaxy.
Only General Leia Organa's band of RESISTANCE fighters stand against the rising tyranny, certain that Jedi Master Luke Skywalker will return and restore a spark of hope to the fight.
But the Resistance has been exposed. As the First Order speeds toward the rebel base, the brave heroes mount a desperate escape...

Episode IX - THE RISE OF SKYWALKER
The dead speak! The galaxy has heard a mysterious broadcast, a threat of REVENGE in the sinister voice of the late EMPEROR PALPATINE.
GENERAL LEIA ORGANA dispatches secret agents to gather intelligence, while REY, the last hope of the Jedi, trains for battle against the diabolical FIRST ORDER.
Meanwhile, Supreme Leader KYLO REN rages in search of the phantom Emperor, determined to destroy any threat to his power...

Ahsoka - PART ONE: MASTER AND APPRENTICE
The EVIL GALACTIC EMPIRE has fallen and a NEW REPUBLIC has risen to take its place. However, sinister agents are already at work to undermine the fragile peace.
A plot is underway to find the lost IMPERIAL GRAND ADMIRIAL THRAWN and bring him out of exile. Once presumed dead, rumors are spreading of Thrawn's return which would galvanize the IMPERIAL REMNANTS and start another war.
Former Jedi Knight AHSOKA TANO captured one of Thrawn's allies and learned of a  secret map which is vital to the enemy's plan. Ahsoka now searches for the map as her prisoner, MORGAN ELSBETH, is transported to the New Republic for trial...

The Acolyte - LOST / FOUND
A hundred years before the rise of the Empire, it is a time of peace. The Jedi Order and the Galactic Republic have prospered for centuries without war.
But in the dark corners of the galaxy, a powerful few learn to use the Force in secret.
One of them, a lone assassin, risks discovery to seek revenge...

Star Wars: Skeleton Crew - THIS COULD BE A REAL ADVENTURE
Since the fall of the EMPIRE, the NEW REPUBLIC has maintained order.
And yet, remote hyperspace routes are increasingly plagued by piracy.
These PIRATES boldly brand their armored hulls as a sign to all ships. Surrender or die...`,_=n(),v=()=>{let[e,t]=(0,s.useState)(``),[n,i]=(0,s.useState)(``),[o,c]=(0,s.useState)(!1);return(0,s.useEffect)(()=>{if(!o)return;let e=!1;async function n(){try{for await(let n of d(h(g))){if(e)return;t(e=>e+n),i(``),requestAnimationFrame(()=>i(n))}e||i(`Response complete`)}finally{e||c(!1)}}return n(),()=>{e=!0}},[o]),(0,_.jsxs)(`div`,{children:[(0,_.jsx)(r,{onClick:()=>{t(``),i(``),c(!0)},disabled:o,children:o?`Streaming…`:`Start stream`}),(0,_.jsx)(a,{sx:{whiteSpace:`pre-line`},children:e}),(0,_.jsx)(`p`,{className:`sr-only`,role:`status`,"aria-atomic":`true`,children:n})]})},y=()=>{let[e,t]=(0,s.useState)(``),[n,i]=(0,s.useState)(``),[o,c]=(0,s.useState)(!1);return(0,s.useEffect)(()=>{if(!o)return;let e=!1;async function n(){try{let n=new u({debounceMs:500,flushOnSentenceBoundary:!0});for await(let r of n.process(h(g))){if(e)return;r.type===`token`?t(e=>e+r.value):(i(``),requestAnimationFrame(()=>i(r.value)))}e||i(`Response complete`)}finally{e||c(!1)}}return n(),()=>{e=!0}},[o]),(0,_.jsxs)(`div`,{children:[(0,_.jsx)(r,{onClick:()=>{t(``),i(``),c(!0)},disabled:o,children:o?`Streaming…`:`Start stream`}),(0,_.jsx)(a,{sx:{whiteSpace:`pre-line`},children:e}),(0,_.jsx)(`p`,{className:`sr-only`,role:`status`,"aria-atomic":`true`,children:n})]})},b=()=>(0,_.jsxs)(`div`,{children:[(0,_.jsx)(a,{variant:`h2`,component:`h1`,children:`A11y Practice`}),(0,_.jsx)(o,{label:`a11y practice tab examples`,tabs:[{label:`Chunking`,content:(0,_.jsx)(v,{})},{label:`Chunking + Debounce`,content:(0,_.jsx)(y,{})}]})]});export{b as default};