import{r as z,j as e,M as W,O as N,W as X,A as K,P as Q}from"./index-DMtdgkeS.js";import{T as Z}from"./TableHead-2ALBzEPz.js";import{b as B,c as i,T as ee,a as te}from"./TableRow-ChLKlD5P.js";import{B as k}from"./Button-sUGzSBx_.js";import{P as oe,p as C}from"./PlayerMenu-BJiGMkb9.js";import{T as R}from"./Header-CUtYRLvS.js";import"./Select-DJp9dDiY.js";import"./isMuiElement-gTNAeGb-.js";import"./useSlotProps-B1o2xeA9.js";import"./useId-CBw7J9nN.js";import"./Grid2-CGMJmGR8.js";import"./useThemeProps-Os47kRxh.js";import"./TextField-BO5o1Fn_.js";const ne=()=>Math.floor(Math.random()*6)+1,se={roll(){return ne()}},O=z.memo(t=>e.jsx(Z,{children:e.jsxs(B,{sx:{borderBottom:2},children:[e.jsx(i,{children:"Minimum Required for Bonus"}),e.jsx(i,{children:"How to Score"}),e.jsx(i,{sx:t.sx,children:"Game Score"})]})}));O.displayName="Header";const Y=z.memo(({topSum:t,finalTopSum:o,sx:n})=>e.jsxs(e.Fragment,{children:[e.jsxs(B,{sx:{borderTop:2},children:[e.jsx(i,{colSpan:2,component:"th",scope:"row",children:"Total == 63"}),e.jsx(i,{sx:n,children:t})]}),e.jsxs(B,{children:[e.jsx(i,{component:"th",scope:"row",children:"Bonus if >= 63"}),e.jsx(i,{children:"Score 35"}),e.jsx(i,{sx:n,children:t%100>=63?35:0})]}),e.jsxs(B,{sx:{borderBottom:2},children:[e.jsx(i,{colSpan:2,component:"th",scope:"row",children:"Upper Half Total"}),e.jsx(i,{sx:n,children:o})]})]}));Y.displayName="TopScores";const H=()=>(t,o)=>(t[o]?t[o]+=1:t[o]=1,t),$=(t,o)=>{const n=t.reduce(H(),{});let s=!1;return Object.values(n).forEach(a=>{a>=o&&(s=!0)}),s},re=t=>{const o=t.reduce(H(),{});let n=!1,s=!1;return Object.values(o).forEach(a=>{a>=3?n=!0:a>=2&&(s=!0)}),n&&s},D=(t,o)=>{const n=t.reduce(H(),{});let s=0;return[1,2,3,4,5,6].forEach(d=>{s<o&&(n[d]?s+=1:s=0)}),s>=o},ce=(t,o)=>Object.entries(t.reduce(H(),{})).reduce((n,[s,a])=>a===5&&o[Number(s)-1].score>=0?!0:n,!1),ae=t=>{const{bottom:o,values:n,showScoreButtons:s,getScoreButton:a,top:d,sx:u,topSum:r,finalTopSum:l}=t,c=x=>n.reduce((h,y)=>(y===x&&(h[0]+=1,h[1]+=x),h),[0,0]),T=o[5].score>0&&$(n,5),b=(x,h,y,f)=>x>=0?x:s?a(h,T?y+100:y,!0,f):null;return e.jsxs(e.Fragment,{children:[d.map(({name:x,score:h},y)=>{const f=y+1,[w,v]=c(f),F=w>=1;return e.jsxs(B,{children:[e.jsx(i,{component:"th",scope:"row",children:`${x}: ${f},${f},${f} = ${f*3}`}),e.jsx(i,{children:`Add Only ${x}`}),e.jsx(i,{sx:u,children:b(h,F,v,y)})]},x)}),e.jsx(Y,{topSum:r,finalTopSum:l,sx:u})]})},g="Sum of Dice",E=z.memo(({finalTopSum:t,bottomSum:o,sx:n})=>e.jsxs(e.Fragment,{children:[e.jsxs(B,{sx:{borderTop:2},children:[e.jsx(i,{colSpan:2,component:"th",scope:"row",children:"Lower Half Total"}),e.jsx(i,{sx:n,children:o})]}),e.jsxs(B,{children:[e.jsx(i,{colSpan:2,component:"th",scope:"row",children:"Upper Half Total"}),e.jsx(i,{sx:n,children:t})]}),e.jsxs(B,{sx:{borderBottom:2},children:[e.jsx(i,{colSpan:2,component:"th",scope:"row",children:"Grand Total"}),e.jsx(i,{sx:n,children:t+o})]})]}));E.displayName="BottomScores";const le=t=>t.reduce((o,n)=>o+n,0),ie=(t,o)=>{switch(t){case 0:return $(o,3);case 1:return $(o,4);case 2:return re(o);case 3:return D(o,4);case 4:return D(o,5);case 5:return $(o,5);case 6:return!0;default:return console.error("Unexpected Value"),!1}},de=t=>{const{values:o,showScoreButtons:n,getScoreButton:s,top:a}=t,d=z.useCallback((T,b,x,h)=>T>=0?T:n?x&&ce(o,a)?s(!0,b+100,!1,h):s(ie(h,o),b,!1,h):null,[s,n,a,o]),{bottom:u,sx:r}=t,l=z.useCallback(()=>{const T=u[5].score>0;return u.map((b,x)=>{const{name:h,hint:y,points:f,score:w}=b,v=f===g?le(o):f;return e.jsxs(B,{children:[e.jsx(i,{component:"th",scope:"row",children:h}),e.jsx(i,{children:y}),e.jsx(i,{sx:r,children:d(w,v,T,x)})]},h)})},[u,d,r,o]),{finalTopSum:c,bottomSum:p}=t;return e.jsxs(e.Fragment,{children:[l(),e.jsx(E,{bottomSum:p,finalTopSum:c,sx:r})]})},_={textAlign:"center"},he=t=>{const{bottom:o,bottomSum:n,finalTopSum:s,showScoreButtons:a,top:d,topSum:u,values:r,onTopScore:l,onBottomScore:c}=t,p=z.useCallback((T,b,x,h)=>T?e.jsx(k,{color:"secondary",variant:"outlined",onClick:x?()=>l(b,h):()=>c(b,h),children:`Add ${b} Points`}):e.jsx(k,{color:"secondary",variant:"outlined",onClick:x?()=>l(0,h):()=>c(0,h),children:"0"}),[c,l]);return e.jsxs(ee,{size:"small","aria-label":"yahtzee game table",children:[e.jsx(O,{sx:_}),e.jsxs(te,{children:[e.jsx(ae,{finalTopSum:s,getScoreButton:p,showScoreButtons:a,sx:_,top:d,values:r,bottom:o,topSum:u}),e.jsx(de,{finalTopSum:s,getScoreButton:p,showScoreButtons:a,sx:_,top:d,values:r,bottom:o,bottomSum:n})]})]})},ue=({bestScore:t,lastScore:o,money:n,name:s})=>e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"flex-container",children:[e.jsx(R,{variant:"h2",component:"h1",children:"Yahtzee"}),e.jsx(oe,{})]}),e.jsxs("div",{className:"flex-container",children:[e.jsxs(R,{variant:"h4",component:"h2",children:[s,": $",n]}),e.jsx(R,{variant:"h4",children:`Best: ${t}`}),e.jsx(R,{variant:"h4",children:`Last: ${o}`})]})]}),me={display:"block",margin:"auto",width:320},pe=t=>{const{values:o,saved:n,roll:s,handleUnsave:a,handleSave:d,handleDiceRoll:u,getButtonText:r}=t;return e.jsxs("div",{className:"flex-container",children:[e.jsx(R,{variant:"h4",component:"h3",children:`Roll #${s}/3`}),e.jsxs("div",{style:me,children:[n.map((l,c)=>e.jsx(k,{variant:"contained",onClick:()=>a(c),children:l},c)),o.map((l,c)=>e.jsx(k,{color:"secondary",variant:"outlined",onClick:()=>d(c),children:l},c))]}),e.jsx(k,{onClick:u,variant:"contained",disabled:s===3,children:r(s)})]})},P=()=>({roll:0,values:[0,0,0,0,0],saved:[],turn:0,showScoreButtons:!1,topScores:[-1,-1,-1,-1,-1,-1],bottomScores:[-1,-1,-1,-1,-1,-1,-1]}),A=W({key:"yahtzeeAtom",default:JSON.parse(localStorage.getItem("yahtzee-atom")||"null")||{...P(),bestScore:0,lastScore:0},effects:[({onSet:t})=>{t(o=>{localStorage.setItem("yahtzee-atom",JSON.stringify(o))})}]}),xe=N({key:"yahtzeeReadOnlyState",get:({get:t})=>{const{topScores:o,bottomScores:n}=t(A),{name:s}=t(C)[0];let a=0;const d=o.reduce((c,p)=>(p>=0&&(a+=1,c+=p),c),0),u=n.reduce((c,p)=>(p>=0&&(a+=1,c+=p),c),0);let r=d;d>=63&&(r+=35);const l=a>=13;return{topSum:d,bottomSum:u,finalTopSum:r,finish:l,name:s}}}),Se=N({key:"yahtzeeState",get:({get:t})=>{const o=t(A),{money:n}=t(C)[0];return{...o,money:n}},set:({get:t,set:o},n)=>{if(!(n instanceof X)){const{money:s,...a}=n;o(A,a);const d=t(C),u=[...d];u[0]={...d[0],money:s},o(C,u)}}}),je=()=>{const[t,o]=K(Se);return{state:t,newGame:r=>o({...P(),lastScore:r,bestScore:r>t.bestScore?r:t.bestScore,money:t.money+Math.ceil(r/10)}),diceClick:(r,l)=>o({...t,values:r,saved:l}),updateTop:r=>o({...t,topScores:r,showScoreButtons:!1,roll:0,values:[0,0,0,0,0],saved:[]}),updateBottom:r=>o({...t,bottomScores:r,showScoreButtons:!1,roll:0,values:[0,0,0,0,0],saved:[]}),updateRoll:(r,l,c,p)=>o({...t,values:r,saved:l,roll:c,showScoreButtons:!0,money:p?t.money-25:t.money})}},fe=[{name:"Aces"},{name:"Twos"},{name:"Threes"},{name:"Fours"},{name:"Fives"},{name:"Sixes"}],be=[{name:"3 of a kind",hint:g,points:g},{name:"4 of a kind",hint:g,points:g},{name:"Full House",hint:"Score 25",points:25},{name:"Sm. Straight (4)",hint:"Score 30",points:30},{name:"Lg. Straight (5)",hint:"Score 40",points:40},{name:"Yahtzee",hint:"Score 50",points:50},{name:"Chance",hint:g,points:g}],_e=()=>{const{state:t,diceClick:o,newGame:n,updateTop:s,updateBottom:a,updateRoll:d}=je(),{topScores:u,bottomScores:r,values:l,saved:c,roll:p,showScoreButtons:T,bestScore:b,lastScore:x,money:h}=t,{topSum:y,bottomSum:f,finalTopSum:w,finish:v,name:F}=Q(xe),G=()=>{if(v){n(w+f);return}if(p>=3)return;const m=[...l],S=[...c];for(let j=0;j<m.length;j+=1)m[j]=se.roll();m.sort(),S.sort(),d(m,S,p+1,f+y===0&&p===0)},M=m=>{if(l[m]===0)return;const S=[...l],j=[...c];j.push(S.splice(m,1)[0]),j.sort(),o(S,j)},I=m=>{const S=[...l],j=[...c];S.push(j.splice(m,1)[0]),S.sort(),o(S,j)},U=z.useCallback(m=>{if(v)return"New Game";switch(m){case 0:return"First Roll";case 1:return"Second Roll";case 2:return"Last Roll";case 3:return"Score";default:return"Error"}},[v]),V=(m,S)=>{const j=[...u];j[S]=m,s(j)},L=(m,S)=>{const j=[...r];j[S]=m,a(j)},J=u.map((m,S)=>({...fe[S],score:m})),q=r.map((m,S)=>({...be[S],score:m}));return e.jsxs(e.Fragment,{children:[e.jsx(ue,{bestScore:b,lastScore:x,money:h,name:F}),e.jsx("hr",{"aria-hidden":!0}),e.jsx(pe,{values:l,saved:c,roll:p,handleUnsave:I,handleSave:M,handleDiceRoll:G,getButtonText:U}),e.jsx("hr",{"aria-hidden":!0}),e.jsx(R,{variant:"h4",children:`Total: ${w+f}`}),e.jsx(he,{values:[...c,...l],bottom:q,top:J,onTopScore:V,onBottomScore:L,showScoreButtons:T,topSum:y,finalTopSum:w,bottomSum:f})]})};export{_e as default};
//# sourceMappingURL=index-yRcBKEH9.js.map