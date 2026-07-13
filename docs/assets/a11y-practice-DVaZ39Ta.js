import{n as e}from"./rolldown-runtime-Bh1tDfsg.js";import{C as t,Et as n,It as r,bt as i,ht as a,j as o,mt as s,nn as c}from"./mui-vendor-B9z4rlKX.js";import{n as l,t as u}from"./a11y-tab-props-6zjCODyC.js";var d=e(c(),1),f=e=>new Promise(t=>setTimeout(t,e)),p=/(?:[.?!]|\.{2,}|\n)\s*$/,m=class{constructor(e){n(this,`options`,void 0),this.options=e}async*process(e){let{debounceMs:t,flushOnSentenceBoundary:n}=this.options,r=e[Symbol.asyncIterator](),i=``,a=null,o=()=>{if(!i)return null;let e=i;return i=``,a=null,e},s=r.next();for(;;){let e=i.length>0&&a!==null?Math.max(0,a-Date.now()):1/0,c=e===1/0?{kind:`token`,result:await s}:await Promise.race([s.then(e=>({kind:`token`,result:e})),f(e).then(()=>({kind:`timer`}))]);if(c.kind===`token`){if(s=r.next(),c.result.done)break;let e=c.result.value;if(yield{type:`token`,value:e},i+=e,a=Date.now()+t,n&&p.test(i)){let e=o();e&&(yield{type:`announcement`,value:e})}continue}let l=o();l&&(yield{type:`announcement`,value:l})}let c=o();c&&(yield{type:`announcement`,value:c})}};async function*h(e){let t=``;for await(let n of e)t+=n,p.test(t)&&(yield t,t=``);t.length>0&&(yield t)}var g=e=>new Promise(t=>setTimeout(t,e)),_=(e,t)=>Math.floor(Math.random()*(t-e+1))+e,v=(e,t)=>(e.match(/\S+\s*/g)??[]).flatMap(e=>{if(e.trim().length<=2||Math.random()>t)return[e];let n=_(1,e.trim().length-1);return[e.slice(0,n),e.slice(n)]});async function*y(e,t={}){let{minDelayMs:n=30,maxDelayMs:r=150,midWordSplitChance:i=.15}=t,a=v(e,i);for(let e of a)await g(_(n,r)),yield e}var b=`Episode I - THE PHANTOM MENACE
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
These PIRATES boldly brand their armored hulls as a sign to all ships. Surrender or die...`,x=r(),S=()=>{let[e,t]=(0,d.useState)(``),[n,r]=(0,d.useState)(``),[a,o]=(0,d.useState)(!1);return(0,d.useEffect)(()=>{if(!a)return;let e=!1;async function n(){try{for await(let n of h(y(b))){if(e)return;t(e=>e+n),r(``),requestAnimationFrame(()=>r(n))}e||r(`Response complete`)}finally{e||o(!1)}}return n(),()=>{e=!0}},[a]),(0,x.jsxs)(`div`,{children:[(0,x.jsx)(s,{onClick:()=>{t(``),r(``),o(!0)},disabled:a,children:a?`Streaming…`:`Start stream`}),(0,x.jsx)(i,{sx:{whiteSpace:`pre-line`},children:e}),(0,x.jsx)(`p`,{className:`sr-only`,role:`status`,"aria-atomic":`true`,children:n})]})},C=()=>{let[e,t]=(0,d.useState)(``),[n,r]=(0,d.useState)(``),[a,o]=(0,d.useState)(!1);return(0,d.useEffect)(()=>{if(!a)return;let e=!1;async function n(){try{let n=new m({debounceMs:500,flushOnSentenceBoundary:!0});for await(let i of n.process(y(b))){if(e)return;i.type===`token`?t(e=>e+i.value):(r(``),requestAnimationFrame(()=>r(i.value)))}e||r(`Response complete`)}finally{e||o(!1)}}return n(),()=>{e=!0}},[a]),(0,x.jsxs)(`div`,{children:[(0,x.jsx)(s,{onClick:()=>{t(``),r(``),o(!0)},disabled:a,children:a?`Streaming…`:`Start stream`}),(0,x.jsx)(i,{sx:{whiteSpace:`pre-line`},children:e}),(0,x.jsx)(`p`,{className:`sr-only`,role:`status`,"aria-atomic":`true`,children:n})]})},w=`ally-practice-tab`,T=()=>{let[e,n]=(0,d.useState)(0);return(0,x.jsxs)(`div`,{children:[(0,x.jsx)(i,{variant:`h2`,component:`h1`,children:`A11y Practice`}),(0,x.jsx)(a,{sx:{borderBottom:1,borderColor:`divider`},children:(0,x.jsxs)(t,{value:e,onChange:(e,t)=>{n(t)},"aria-label":`a11y practice tab examples`,children:[(0,x.jsx)(o,{label:`Chunking`,...u(w,0)}),(0,x.jsx)(o,{label:`Chunking & Debounce`,...u(w,1)})]})}),(0,x.jsx)(l,{value:e,index:0,tabPrefix:w,children:(0,x.jsx)(S,{})}),(0,x.jsx)(l,{value:e,index:1,tabPrefix:w,children:(0,x.jsx)(C,{})})]})};export{T as default};