import{J as F,a2 as j,a7 as H,K as M,j as p}from"./index-16562204.js";import{t as x,G as U,a as C,D as k}from"./Deck-9f3ec759.js";import{z as D,T as W,C as _}from"./MenuItem-34ed4bd5.js";import"./blueGrey-a72a8df5.js";import"./CardContent-8935b083.js";import"./visuallyHidden-14c3de6e.js";import"./_commonjs-dynamic-modules-302442b1.js";const T=(t,a)=>{if(a.includes(4))return 7;const e=a.includes(3),n=a.indexOf(2),r=n!==-1;if(e&&r)return 6;if(e)return 3;if(r&&a.includes(2,n+1))return 2;if(r)return 1;const s=a.lastIndexOf(1)-a.indexOf(1)===4||a[12]&&a[0]&&a[1]&&a[2]&&a[3];let o=!0;for(let d=0;d<t.length;d+=1)if(t[d].suit!==t[0].suit){o=!1;break}return s&&o?8:o?5:s?4:0},E=t=>{const a=[0,0,0,0,0,0,0,0,0,0,0,0,0];return t.forEach(e=>{e&&(a[e.weight-2]+=1)}),a},$=t=>{const a=E(t),e=T(t,a),n=["0","0","0","0","0"];let r=0,s=4,o=0,d=-1;for(;r<5;){const m=a.indexOf(s,d+1);m===-1?(s-=1,d=-1):(n[o]=m.toString(14),o+=1,r+=s,d=m)}return`${e}${n.reduce((m,g)=>`${m}${g}`)}`},S=(t,a,e)=>{const n=[],r=[a.indexOf(1)];for(let s=1;s<t;s+=1)r[s]=a.indexOf(1,r[s-1]+1);for(let s=0;s<e.length;s+=1)for(let o=0;o<r.length;o+=1)if(e[s].weight-2===r[o]){n.push(s);break}return n},J=async(t,a)=>{if(t.hands.length<1)return t;try{const e=t.hands[0].cards,n=E(e);switch(T(e,n)){case 0:{const s=n.lastIndexOf(1)>=11?S(4,n,e):[0,1,2,3,4];return await a(s,t)}case 1:{const s=S(3,n,e);return await a(s,t)}case 2:case 3:{const s=S(1,n,e);return await a(s,t)}case 4:case 5:case 6:case 7:case 8:default:break}}catch(e){console.error(e)}return t},B=t=>{let a={val:0,id:0};t.forEach(e=>{var r;if(((r=e.hands[0])==null?void 0:r.cards.length)<1)return;const n=parseInt($(e.hands[0].cards),14);n>a.val&&(a={val:n,id:e.id})}),t.forEach((e,n)=>{if(e.id===a.id){const r={...e,status:"win",money:e.money+20};t[n]=r}else{const r={...e,status:"lose",money:e.money-5};t[n]=r}})};var h=(t=>(t.DISCARD_CARDS="Discard Cards",t.END_TURN="End Turn",t.NEW_GAME="New Game",t.START_GAME="Start Game",t))(h||{});const P=()=>({gameFunctions:["Start Game"],cardsToDiscard:[],hideHands:!0,gameOver:!1}),A=F({key:"pokerAtom",default:JSON.parse(localStorage.getItem("poker-atom")||"null")||P(),effects:[({onSet:t})=>{t(a=>{localStorage.setItem("poker-atom",JSON.stringify(a))})}]}),z=j({key:"pokerState",get:({get:t})=>{const a=t(A),e=t(x),n=t(D).slice(0,5);return{poker:a,turn:e,players:n}},set:({get:t,set:a},e)=>{if(!(e instanceof H)){const{poker:n,turn:r,players:s}=e,o=t(D);a(A,n),a(x,r),a(D,[...s,o[4],o[5]])}}}),K=()=>{const[{poker:t,turn:a,players:e},n]=M(z),{cardsToDiscard:r,gameFunctions:s,gameOver:o,hideHands:d}=t,m=async(i,c)=>{const{hands:u}=c,l={...c},f=[...u[0].cards];try{const w=await k.deal(i.length);i.forEach((v,I)=>{f[v]=w[I]}),f.sort(k.rankSort);const{weight:y,soft:b}=_(f);l.hands=[{cards:f,weight:y,soft:b}]}catch(w){console.error(w)}return l},g=async()=>{var i;try{if(!d&&!o&&((i=e[a.player])!=null&&i.isBot)){const c=[...e];await C(e,async(u,l)=>{if(a.player<=l){const f=await J(u,m);c[l]=f}}),B(c),n({poker:{cardsToDiscard:r,gameFunctions:[h.NEW_GAME],gameOver:!0,hideHands:d},players:c,turn:{player:0,hand:0}})}}catch(c){console.error(c)}},R=async()=>{await k.shuffle().then(async()=>{const i=[...e];await C(e,async c=>{const u=await k.deal(5);u.sort(k.rankSort);const{weight:l,soft:f}=_(),w=e.findIndex(y=>y.id===c.id);if(w!==-1){const y={...i[w],hands:[{cards:u,weight:l,soft:f}]};i[w]=y}}),n({players:i,turn:a,poker:{cardsToDiscard:r,gameFunctions:[h.DISCARD_CARDS],gameOver:o,hideHands:!1}})}).catch(i=>{console.error(i)})},N=async(i,c,u)=>{try{const l=[...e],f=await m(u,i[c]);l[c]=f,n({poker:{cardsToDiscard:[],gameFunctions:[h.END_TURN],gameOver:o,hideHands:d},turn:a,players:l})}catch(l){console.error(l)}},O=async i=>{try{const c=[];switch(i){case h.DISCARD_CARDS:await N(e,a.player,r);break;case h.END_TURN:n({poker:{cardsToDiscard:[],gameFunctions:[h.DISCARD_CARDS],gameOver:o,hideHands:d},turn:{player:a.player+1,hand:0},players:e});break;case h.NEW_GAME:e.forEach(u=>c.push({...u,status:"",hands:[],bet:5})),n({poker:P(),turn:{player:0,hand:0},players:c});break;case h.START_GAME:await R();break;default:console.error("Unknown Game Function: ",i)}}catch(c){console.error(c)}},G=(i,c,u)=>{const l=[...r],f=l.indexOf(u);f===-1?l.push(u):l.splice(f,1),n({poker:{cardsToDiscard:l,gameFunctions:s,gameOver:o,hideHands:d},turn:a,players:e})};return g().catch(()=>{console.error("check update failed")}),p.jsxs(p.Fragment,{children:[p.jsx(W,{variant:"h2",component:"h1",gutterBottom:!0,children:"5 Card Draw Poker"}),p.jsx(U,{cardClickHandler:G,cardsToDiscard:r,gameFunctions:s,onClick:O,gameOver:o,hideHands:d,isBlackJack:!1,players:e,turn:a})]})},ee=K;export{ee as default};
//# sourceMappingURL=index-55bdb87e.js.map