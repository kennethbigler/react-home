import{j as e,E as j,U as H,G as $,I as M,K as C,F as N,J as O,r as p}from"./index-eG4mc5yy.js";import{c as D,T as w,M as J,P as K}from"./Header-coIKKBJv.js";import{d as I}from"./deepPurple-CjYrkWXi.js";import{a as U}from"./amber-D7aVlNg3.js";import{l as V}from"./lightGreen-Czsbt-f6.js";import{y as L,c as q}from"./yellow-CGSsQO_7.js";import{p as P}from"./pink-DCgZgo_R.js";import{b as B,c as u,T as Q,a as X}from"./TableRow-CAdaDep8.js";import{B as k}from"./Button-CZHw6MZX.js";import{F as Y,I as Z,S as _}from"./Select-BVaMFeaV.js";import{T as e1}from"./TableContainer-q_mshjsl.js";import{T as r1}from"./TableHead-asAwP27W.js";import"./isMuiElement-C0zqtK3c.js";import"./useSlotProps-BF82it9S.js";import"./useId-C0qAzL6S.js";const o1={50:"#fbe9e7",100:"#ffccbc",200:"#ffab91",300:"#ff8a65",400:"#ff7043",500:"#ff5722",600:"#f4511e",700:"#e64a19",800:"#d84315",900:"#bf360c",A100:"#ff9e80",A200:"#ff6e40",A400:"#ff3d00",A700:"#dd2c00"},n1={50:"#efebe9",100:"#d7ccc8",200:"#bcaaa4",300:"#a1887f",400:"#8d6e63",500:"#795548",600:"#6d4c41",700:"#5d4037",800:"#4e342e",900:"#3e2723",A100:"#d7ccc8",A200:"#bcaaa4",A400:"#8d6e63",A700:"#5d4037"},a1=D(e.jsx("path",{d:"m20 12-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8z"}),"ArrowDownward"),t1=D(e.jsx("path",{d:"m12 4-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"}),"ArrowForward"),a=[{name:"normal",color:j[100],inverted:!0},{name:"fight",color:o1[900]},{name:"flying",color:H[200],inverted:!0},{name:"poison",color:I[500]},{name:"ground",color:U[100],inverted:!0},{name:"rock",color:n1[500]},{name:"bug",color:V[400],inverted:!0},{name:"ghost",color:I[800]},{name:"steel",color:j[500],inverted:!0},{name:"fire",color:$[500]},{name:"water",color:M[500]},{name:"grass",color:C[500]},{name:"electric",color:L[600],inverted:!0},{name:"psychic",color:P[300]},{name:"ice",color:q[500],inverted:!0},{name:"dragon",color:N.A700},{name:"dark",color:j[800]},{name:"fairy",color:P[100],inverted:!0}],d=[[1,1,1,1,1,.5,1,0,.5,1,1,1,1,1,1,1,1,1],[2,1,.5,.5,1,2,.5,0,2,1,1,1,1,.5,2,1,2,.5],[1,2,1,1,1,.5,2,1,.5,1,1,2,.5,1,1,1,1,1],[1,1,1,.5,.5,.5,1,.5,0,1,1,2,1,1,1,1,1,2],[1,1,0,2,1,2,.5,1,2,2,1,.5,2,1,1,1,1,1],[1,.5,2,1,.5,1,2,1,.5,2,1,1,1,1,2,1,1,1],[1,.5,.5,.5,1,1,1,.5,.5,.5,1,2,1,2,1,1,.5,1],[0,1,1,1,1,1,1,2,1,1,1,1,1,2,1,1,.5,1],[1,1,1,1,1,2,1,1,.5,.5,.5,1,.5,1,2,1,1,2],[1,1,1,1,1,.5,2,1,2,.5,.5,2,1,1,2,.5,1,1],[1,1,1,1,2,2,1,1,1,2,.5,.5,1,1,1,.5,1,1],[1,1,.5,.5,2,2,.5,1,.5,.5,2,.5,1,1,1,.5,1,1],[1,1,2,1,0,1,1,1,1,1,2,.5,.5,1,1,.5,1,1],[1,2,1,2,1,1,1,1,.5,1,1,1,1,.5,.5,1,0,1],[1,1,2,1,2,1,1,1,.5,.5,.5,2,1,1,.5,2,1,1],[1,1,1,1,1,1,1,1,.5,1,1,1,1,1,1,2,1,0],[1,.5,1,1,1,1,1,2,1,1,1,1,1,2,1,1,.5,.5],[1,2,1,.5,1,1,1,1,.5,.5,1,1,1,1,1,2,2,1]],c1={padding:"4px 2px"},s1={0:$[200],.25:O[200],.5:L[200],2:C[200],4:C[500]},F=({data:l,type:s,idx:n,onClick:h})=>e.jsxs(B,{children:[e.jsx(u,{padding:"none",component:"th",scope:"row",children:e.jsx(k,{variant:"contained",fullWidth:!0,sx:{...c1,backgroundColor:s.color,color:s.inverted?"black":"white"},onClick:h(n),children:s.name})}),l[n].map((f,x)=>{const m={padding:0};return f!==1&&(m.backgroundColor=s1[f],m.color="black"),e.jsx(u,{sx:m,align:"center",children:f},`eff-${n}-${x}`)})]}),l1=a.reduce((l,{name:s})=>l.concat([s]),["select secondary"]),R={padding:"4px 2px"},v1=()=>{const[l,s]=p.useState(-1),[n,h]=p.useState(-1),[f,x]=p.useState(0),[m,y]=p.useState([...d]),[W,v]=p.useState([...a]),[z,b]=p.useState([...a]),g=()=>{s(-1),h(-1),x(0),y([...d]),v([...a]),b([...a])},T=r=>()=>{if(n!==-1||l!==-1){g();return}const o=[],i=[];d[r].forEach((t,c)=>{t!==1&&(o.push(t),i.push(a[c]))}),h(-1),s(r),y([o]),v(i)},S=r=>()=>{if(n!==-1||l!==-1){g();return}const o=[],i=[];for(let t=0;t<d.length;t+=1){const c=d[t][r];c!==1&&(o.push([c]),i.push(a[t]))}s(-1),h(r),y(o),b(i)},G=r=>{const o=Number(r.target.value);if(o===0){g();return}const i=[],t=[];for(let c=0;c<d.length;c+=1){const A=d[c][n],E=d[c][o-1];A*E!==1&&(i.push([A*E]),t.push(a[c]))}x(o),y(i),b(t)};return e.jsxs(e.Fragment,{children:[e.jsx(w,{variant:"h2",component:"h1",children:"Type Checker"}),n!==-1&&e.jsxs(Y,{children:[e.jsx(Z,{children:"Secondary Type"}),e.jsx(_,{label:"Secondary Type",value:f,onChange:G,children:l1.map((r,o)=>e.jsx(J,{value:o,children:r},r))})]}),e.jsx(e1,{component:K,children:e.jsxs(Q,{"aria-label":"pokemon type checker",children:[e.jsx(r1,{children:e.jsxs(B,{children:[e.jsx(u,{children:e.jsxs("div",{className:"flex-container",children:[e.jsx(w,{children:"A"}),e.jsx(a1,{}),e.jsx(w,{children:"D"}),e.jsx(t1,{})]})}),n===-1?W.map((r,o)=>e.jsx(u,{sx:{padding:0},children:e.jsx(k,{variant:"contained",sx:{...R,backgroundColor:r.color,color:r.inverted?"black":"white"},fullWidth:!0,onClick:S(o),children:r.name})},`header-${r.name}`)):e.jsx(u,{sx:{padding:0},children:e.jsxs(k,{variant:"contained",sx:{...R,backgroundColor:a[n].color,color:a[n].inverted?"black":"white"},fullWidth:!0,onClick:S(n),children:[a[n].name," ",f?`/ ${a[f-1].name}`:""]})})]})}),e.jsx(X,{children:l===-1||n!==-1?z.map((r,o)=>e.jsx(F,{data:m,type:r,idx:o,onClick:T},`row-${r.name}`)):e.jsx(F,{data:m,type:a[l],idx:0,onClick:T})})]})})]})};export{v1 as default};
//# sourceMappingURL=index-DFc0JsL6.js.map