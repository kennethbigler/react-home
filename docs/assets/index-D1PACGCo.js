import{O as S,P as A,W as M,r as d,j as s,A as C,M as H}from"./index-CXH5PJAX.js";import{p as u,P as L}from"./PlayerMenu-v7KbM9ow.js";import{T as E,b as p,c as i,a as $}from"./TableRow-oDAIaduV.js";import{T as B}from"./TableHead-BVEgWyqL.js";import{T as b}from"./Header-GvylGjxW.js";import{G as R}from"./Grid2-BQTch28q.js";import{B as w}from"./Button-CFdI_Fmb.js";import"./Select-BhZ8L7FE.js";import"./isMuiElement-CKPetrCJ.js";import"./useSlotProps-CGpai8QW.js";import"./useId-OlN40uZa.js";import"./TextField-IHRxVwn6.js";import"./useThemeProps-zp0kfiu8.js";var e=(t=>(t.EMPTY="-",t.CHERRY="🍒",t.BAR="🍺",t.DOUBLE_BAR="🍻",t.TRIPLE_BAR="🥃",t.SEVEN="❌",t.JACKPOT="💰",t))(e||{});const N=3,h=[{symbol:"🍒",start:1,stop:2},{symbol:"-",start:3,stop:7},{symbol:"🍺",start:8,stop:12},{symbol:"-",start:13,stop:17},{symbol:"❌",start:18,stop:25},{symbol:"-",start:26,stop:30},{symbol:"🍺",start:31,stop:35},{symbol:"-",start:36,stop:41},{symbol:"🍒",start:42,stop:43},{symbol:"-",start:44,stop:49},{symbol:"🍻",start:50,stop:56},{symbol:"-",start:57,stop:62},{symbol:"🍒",start:63,stop:63},{symbol:"-",start:64,stop:69},{symbol:"🍻",start:70,stop:75},{symbol:"-",start:76,stop:81},{symbol:"🍺",start:82,stop:87},{symbol:"-",start:88,stop:93},{symbol:"🥃",start:94,stop:104},{symbol:"-",start:105,stop:115},{symbol:"💰",start:116,stop:117},{symbol:"-",start:118,stop:128}];function O(){const t=[];return h.forEach((o,n)=>{const l=n-1>0?n-1:h.length-1,r=(n+1)%h.length;for(let c=o.start;c<=o.stop;c+=1)t.push([h[l].symbol,o.symbol,h[r].symbol])}),t}const g=O();function Y(){return g[Math.floor(Math.random()*g.length)]}const v=()=>{const t=[];for(let o=0;o<N;o+=1)t[o]=Y();return t},D=(t,o)=>{const n=["🍺","🍻","🥃"],l=t[0][1],r=t[1][1],c=t[2][1],a=[l,r,c];if(l===r&&l===c)switch(l){case"💰":return 1666*o;case"❌":return 300*o;case"🥃":return 100*o;case"🍻":return 50*o;case"🍺":return 25*o;case"🍒":return 12*o;default:return 0}else{if(n.includes(l)&&n.includes(r)&&n.includes(c))return 12*o;if(a.includes("🍒",a.indexOf("🍒")+1))return 6*o;if(a.includes("🍒"))return 3*o}return 0},j={pullHandle:v,getPayout:D},T=S({key:"slotsAtom",default:JSON.parse(localStorage.getItem("slots-atom")||"null")||j.pullHandle(),effects:[({onSet:t})=>{t(o=>{localStorage.setItem("slots-atom",JSON.stringify(o))})}]}),I=A({key:"slotsReadOnlyState",get:({get:t})=>{const o=t(u),{bet:n,name:l}=o[0];return{bet:n,name:l}}}),J=A({key:"slotsState",get:({get:t})=>{const o=t(T),n=t(u),{money:l}=n[0],{money:r}=n[n.length-1];return{reel:o,money:l,houseMoney:r}},set:({get:t,set:o},n)=>{if(!(n instanceof M)){const{reel:l,money:r,houseMoney:c}=n;o(T,l);const a=t(u),m=a.length-1,y=[...a];y[0]={...a[0],money:r},y[m]={...a[m],money:c},o(u,y)}}}),U=[{symbol:`${e.JACKPOT} ${e.JACKPOT} ${e.JACKPOT}`,payout:1666},{symbol:`${e.SEVEN} ${e.SEVEN} ${e.SEVEN}`,payout:300},{symbol:`${e.TRIPLE_BAR} ${e.TRIPLE_BAR} ${e.TRIPLE_BAR}`,payout:100},{symbol:`${e.DOUBLE_BAR} ${e.DOUBLE_BAR} ${e.DOUBLE_BAR}`,payout:50},{symbol:`${e.BAR} ${e.BAR} ${e.BAR}`,payout:25},{symbol:`3 of any ${e.BAR} ${e.DOUBLE_BAR} ${e.TRIPLE_BAR}`,payout:12},{symbol:`${e.CHERRY} ${e.CHERRY} ${e.CHERRY}`,payout:12},{symbol:`${e.CHERRY} ${e.CHERRY}`,payout:6},{symbol:e.CHERRY,payout:3}],_=d.memo(()=>s.jsxs(E,{"aria-label":"payout reference table for slot game",children:[s.jsx(B,{children:s.jsxs(p,{children:[s.jsx(i,{children:"Slot Roll"}),s.jsx(i,{children:"Payout"})]})}),s.jsx($,{children:U.map((t,o)=>s.jsxs(p,{children:[s.jsx(i,{component:"th",scope:"row",children:t.symbol}),s.jsx(i,{children:`${t.payout} : 1`})]},o))})]}));_.displayName="PayoutTable";const P=d.memo(({name:t,money:o,houseMoney:n})=>s.jsxs(E,{"aria-label":"current slot game monetary status",children:[s.jsx(B,{children:s.jsxs(p,{children:[s.jsx(i,{children:"Player"}),s.jsx(i,{children:"Money"})]})}),s.jsxs($,{children:[s.jsxs(p,{children:[s.jsx(i,{component:"th",scope:"row",children:t}),s.jsx(i,{children:`$${o}`})]}),s.jsxs(p,{children:[s.jsx(i,{component:"th",scope:"row",children:"House"}),s.jsx(i,{children:`$${n}`})]})]})]}));P.displayName="MoneyTable";const k={minHeight:39,fontWeight:900},K=({reel:t})=>{const o=d.useCallback(()=>{const n=[];for(let l=0;l<3;l+=1){const r=t.map((a,m)=>s.jsx(i,{children:s.jsx(b,{variant:"h4",component:"h2",align:"center",style:k,children:a[l]})},`${m},${l}`)),c=s.jsx(p,{children:r},`row${l}`);n.push(c)}return n},[t]);return s.jsx(E,{"aria-label":"slots displayed in a 3 by 3 grid",children:s.jsx($,{children:o()})})},V=d.memo(()=>{const[{reel:t,money:o,houseMoney:n},l]=C(J),{bet:r,name:c}=H(I),[a,m]=d.useState(0),y=()=>{const f=j.pullHandle(),x=j.getPayout(f,r)-r;m(x),l({reel:f,money:o+x,houseMoney:n-x})};return s.jsxs(s.Fragment,{children:[s.jsxs("div",{className:"flex-container",children:[s.jsx(b,{variant:"h2",component:"h1",children:"Casino Slot Machine"}),s.jsx(L,{})]}),s.jsxs(R,{container:!0,spacing:1,style:{marginTop:"2em"},children:[s.jsxs(R,{size:{xs:12,sm:6},children:[s.jsxs("div",{children:[s.jsx(w,{onClick:y,style:{marginBottom:15},variant:"contained",children:"Spin"}),a!==0&&s.jsx(b,{variant:"h4",component:"h2",children:`You ${a>0?"won":"lost"} $${a}`})]}),s.jsx(K,{reel:t}),s.jsx(P,{money:o,name:c,houseMoney:n})]}),s.jsx(R,{size:{xs:12,sm:6},children:s.jsx(_,{})})]})]})});V.displayName="Slots";export{V as default};
//# sourceMappingURL=index-D1PACGCo.js.map