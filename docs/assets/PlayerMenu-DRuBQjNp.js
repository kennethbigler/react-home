import{M as y,j as e,r as p,A as f}from"./index-eG4mc5yy.js";import{B as j}from"./Button-CZHw6MZX.js";import{P as g}from"./Select-BVaMFeaV.js";import{G as i}from"./Grid2-CYzsE65K.js";import{T as m,S as x}from"./Header-coIKKBJv.js";import{T as P}from"./TextField-C5acFA7O.js";const _=()=>({weight:0,soft:!1}),c=(t,s=`Bot-${t}`,d=!0)=>({id:t,name:s,isBot:d,status:"",money:100,bet:5,hands:[]}),B=[c(1,"Ken",!1),c(2),c(3),c(4),c(5),c(6),c(0,"Dealer",!0)],v=y({key:"playerAtom",default:JSON.parse(localStorage.getItem("player-atom")||"null")||B,effects:[({onSet:t})=>{t(s=>{localStorage.setItem("player-atom",JSON.stringify(s))})}]}),A=()=>{const[t,s]=p.useState(null);return{anchorEl:t,setAnchor:o=>{s(o.currentTarget)},clearAnchor:()=>{s(null)}}},w={padding:15},S=t=>{const{anchorEl:s,setAnchor:d,clearAnchor:h}=A(),{children:o,buttonText:n}=t,a=!!s;return e.jsxs(e.Fragment,{children:[e.jsx(j,{"aria-haspopup":"true",variant:"contained",component:"button",onClick:d,children:n}),e.jsx(g,{id:"player-popover",open:a,anchorEl:s,onClose:h,anchorOrigin:{vertical:"bottom",horizontal:"center"},transformOrigin:{vertical:"top",horizontal:"center"},title:"player-popover",children:e.jsx("div",{style:w,children:o})})]})},F=()=>{const[t,s]=f(v),d=(o,n)=>{const a=t.findIndex(r=>r.id===o);if(a!==-1)if(n){const r=[...t];for(let l=a;l<t.length-1;l+=1){const u={...r[l],isBot:n};r[l]=u}s(r)}else{const r=[...t],l={...r[a],isBot:n};r[a]=l,s(r)}},h=o=>n=>{const a=t.findIndex(r=>r.id===o);if(a!==-1){const r=[...t],l={...r[a],name:n.target.value||""};r[a]=l,s(r)}};return e.jsx(S,{buttonText:"Players",children:e.jsxs(i,{container:!0,spacing:1,sx:{maxWidth:310},children:[e.jsx(i,{size:8,children:e.jsx(m,{variant:"h5",children:"Edit Player Names"})}),e.jsx(i,{size:4,children:e.jsx(m,{variant:"h5",children:"Is Bot?"})}),t.map((o,n)=>o.id!==0?e.jsxs(p.Fragment,{children:[e.jsx(i,{size:9,children:e.jsx(P,{defaultValue:o.name,onBlur:h(o.id),placeholder:"Enter Player Name",title:`player ${n} name`})}),e.jsx(i,{size:3,children:(n===0||!t[n].isBot||!t[n-1].isBot)&&e.jsx(x,{checked:t[n].isBot,value:t[n].isBot,onChange:(a,r)=>d(o.id,r),title:`isBot-switch-${n}`})})]},`${o.name},${n}`):e.jsxs(p.Fragment,{children:[e.jsx(i,{size:9,children:e.jsx(m,{variant:"h5",children:o.name})}),e.jsx(i,{size:3,children:e.jsx(x,{checked:!0,disabled:!0})})]},`${o.name},${n}`))]})})};export{F as P,_ as d,v as p};
//# sourceMappingURL=PlayerMenu-DRuBQjNp.js.map