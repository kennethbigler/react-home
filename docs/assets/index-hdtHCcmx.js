import{g as pt,b as xt,s as gt,t as ft,r as d,e as jt,j as t,c as yt,f as St,O as tt,P as kt,J as Y,I as Ct,M as G,B as et,A as U}from"./index-CXH5PJAX.js";import{d as P,m as bt}from"./DateHelper-b37KTdR-.js";import{G as w}from"./Grid2-BQTch28q.js";import{T as p,D as R,M as L}from"./Header-GvylGjxW.js";import{C as vt}from"./Card-DcQNtjvf.js";import{C as Dt,a as _}from"./CardActionArea-BDIvjLjF.js";import{C as z}from"./CardContent-B2e5ZD5H.js";import{D as st,a as nt,b as ot,c as at}from"./DialogTitle-dFZDOpg5.js";import{F as H,I as J,S as Q}from"./Select-BhZ8L7FE.js";import{T as N}from"./TextField-IHRxVwn6.js";import{B as M}from"./Button-CFdI_Fmb.js";import{C as Tt}from"./Chip-BHeiyvV8.js";import{h as rt,H as W,a as lt}from"./highcharts-react.min-Do95ynpW.js";import{l as At}from"./lightGreen-Czsbt-f6.js";import"./useThemeProps-zp0kfiu8.js";import"./isMuiElement-CKPetrCJ.js";import"./useId-OlN40uZa.js";import"./useSlotProps-CGpai8QW.js";function wt(e){return xt("MuiDialogContentText",e)}pt("MuiDialogContentText",["root"]);const Nt=e=>{const{classes:s}=e,a=St({root:["root"]},wt,s);return{...s,...a}},Mt=gt(p,{shouldForwardProp:e=>ft(e)||e==="classes",name:"MuiDialogContentText",slot:"Root",overridesResolver:(e,s)=>s.root})({}),Bt=d.forwardRef(function(s,n){const a=jt({props:s,name:"MuiDialogContentText"}),{children:h,className:i,...o}=a,c=Nt(o);return t.jsx(Mt,{component:"p",variant:"body1",color:"textSecondary",ref:n,ownerState:o,className:yt(c.root,i),...a,classes:c})}),Ft={},it=tt({key:"stockAtom",default:JSON.parse(localStorage.getItem("stock-atom")||"null")||Ft,effects:[({onSet:e})=>{e(s=>{localStorage.setItem("stock-atom",JSON.stringify(s))})}]}),ct=tt({key:"compCalcAtom",default:JSON.parse(localStorage.getItem("comp-calc-atom")||"null")||[],effects:[({onSet:e})=>{e(s=>{localStorage.setItem("comp-calc-atom",JSON.stringify(s))})}]}),Ot=kt({key:"compCalcReadOnlyState",get:({get:e})=>{const s=e(ct),n=e(it),a={},h=s.map(({bonus:o,entryDate:c,grantDuration:r,grantQty:l,priceThen:x,salary:u,stockTick:g})=>{const j=n[g]||0;let m=0,f=0;const y=P(c);y.year+=r,a[g]||(a[g]=[]),l>0&&a[g].push({grantQty:l,grantDuration:r,exp:y}),a[g].forEach(k=>{P(c).diff(k.exp,"days")<0&&(m+=x*k.grantQty/k.grantDuration,f+=j*k.grantQty/k.grantDuration)});const b=u+o+m,D=u+o+f,A=x*l,B=j*l;return{stock:m,stockAdj:f,total:b,totalAdj:D,grantThen:A,grantNow:B}});return h.map(({totalAdj:o,...c},r)=>{const l=r===0?0:o-h[r-1].totalAdj;return{totalAdj:o,netDiff:l,...c}})}}),v=new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"}),Pt=({compEntries:e,compCalcEntries:s,onClick:n})=>t.jsxs(w,{container:!0,spacing:1,children:[t.jsx(w,{size:12,children:t.jsx(p,{children:"*value computed from latest stock price above"})}),e.map((a,h)=>{const{entryDate:i,salary:o,bonus:c,stockTick:r,priceThen:l,grantDuration:x,grantQty:u}=a,{stock:g,stockAdj:j,total:m,totalAdj:f,netDiff:y,grantThen:b,grantNow:D}=s[h];return t.jsx(w,{size:{xs:12,md:6,lg:4,xl:3,xxl:e.length>4?2:void 0,xxxl:e.length>6?1:void 0},children:t.jsx(vt,{children:t.jsx(Dt,{onClick:n(h),children:t.jsxs(w,{container:!0,children:[t.jsxs(w,{size:r?6:12,children:[t.jsx(_,{title:"Salary"}),t.jsxs(z,{children:[t.jsxs(p,{children:["Date: ",P(i).format("MMMM Y")]}),t.jsxs(p,{children:["Salary: ",v.format(o)]}),t.jsxs(p,{children:["Bonus: ",v.format(c)]}),t.jsx(R,{"aria-hidden":!0}),t.jsxs(p,{children:["Stock: ",v.format(g)]}),t.jsxs(p,{children:["*Stock: ",v.format(j)]}),t.jsx(R,{"aria-hidden":!0}),t.jsxs(p,{children:["Total: ",v.format(m)]}),t.jsx(p,{sx:{display:"inline"},children:"*Total:"}),t.jsx(p,{color:"warning",fontWeight:"fontWeightBold",sx:{display:"inline",marginLeft:1},children:v.format(f)}),y!==0&&t.jsxs(t.Fragment,{children:[t.jsx(R,{"aria-hidden":!0}),t.jsx(p,{sx:{display:"inline"},children:"Net:"}),t.jsx(p,{color:y>0?"success":"error",fontWeight:"fontWeightBold",sx:{display:"inline",marginLeft:1},children:v.format(y)})]})]})]}),r&&t.jsxs(w,{size:6,children:[t.jsx(_,{title:"Stock Grant"}),t.jsxs(z,{children:[t.jsx(p,{sx:{display:"inline"},children:"Ticker:"}),t.jsx(p,{color:"primary",fontWeight:"fontWeightBold",sx:{display:"inline",marginLeft:1},children:r}),u>0&&t.jsxs(t.Fragment,{children:[t.jsxs(p,{children:["Price: ",v.format(l)]}),t.jsxs(p,{children:["Grant Qty: ",u]}),t.jsxs(p,{children:["Duration: ",x," years"]}),t.jsx(R,{"aria-hidden":!0}),t.jsxs(p,{children:["Grant: ",v.format(b)]}),t.jsxs(p,{children:["*Grant: ",v.format(D)]})]})]})]})]})})})},`comp-calc-entry-${h}`)}).reverse()]}),O={variant:"standard",fullWidth:!0,margin:"dense"},$t=new Date().getFullYear()-2e3,$=[];for(let e=0;e<=$t;e+=1)$.push(2e3+e);$.reverse();const It=({open:e,compEntry:s,onClose:n,addCompEntry:a})=>{const[h,i]=d.useState("1"),[o,c]=d.useState($[0].toString()),[r,l]=d.useState(0),[x,u]=d.useState(0),[g,j]=d.useState(""),[m,f]=d.useState(0),[y,b]=d.useState(4),[D,A]=d.useState(0),B=()=>{i("1"),c($[0].toString()),l(0),u(0),j(""),f(0),b(4),A(0)};d.useEffect(()=>{if(s){const{month:S,year:F}=P(s.entryDate);i((S+1).toString()),c(F.toString()),l(s.salary),u(s.bonus),j(s.stockTick),f(s.priceThen),b(s.grantDuration),A(s.grantQty)}else B()},[s,s==null?void 0:s.salary]);const k=S=>F=>S(parseFloat(F.target.value)),C=S=>j(S.target.value),T=S=>i(S.target.value),I=S=>c(S.target.value),mt=()=>{a({entryDate:`${o}-${h.length<2?"0":""}${h}`,salary:r,bonus:x,stockTick:g,priceThen:m,grantDuration:y,grantQty:D}),B()};return t.jsxs(st,{open:e,onClose:n,children:[t.jsxs(nt,{children:[s?"Edit":"New"," Comp Entry"]}),t.jsxs(ot,{children:[t.jsxs("div",{style:{display:"flex",marginTop:5},children:[t.jsxs(H,{fullWidth:!0,children:[t.jsx(J,{id:"month-select",children:"Month"}),t.jsx(Q,{labelId:"month-select",label:"Month",value:h,onChange:T,children:bt.map((S,F)=>t.jsx(L,{value:F+1,children:S},F))})]}),t.jsxs(H,{fullWidth:!0,children:[t.jsx(J,{id:"year-select",children:"Year"}),t.jsx(Q,{labelId:"year-select",label:"Year",value:o,onChange:I,children:$.map(S=>t.jsx(L,{value:S,children:S},S))})]})]}),t.jsx(N,{label:"Salary",value:r,type:"number",onChange:k(l),slotProps:{input:{startAdornment:"$"}},...O}),t.jsx(N,{label:"Bonus",value:x,type:"number",onChange:k(u),slotProps:{input:{startAdornment:"$"}},...O}),t.jsx(Bt,{variant:"h6",component:"h4",sx:{marginTop:7},children:"Stock"}),t.jsx(N,{label:"Stock Ticker",value:g,onChange:C,...O}),t.jsx(N,{label:"Grant Quantity",value:D,type:"number",onChange:k(A),...O}),t.jsx(N,{label:"Grant Duration",value:y,type:"number",onChange:k(b),...O}),t.jsx(N,{label:"Stock Price Then",value:m,type:"number",onChange:k(f),slotProps:{input:{startAdornment:"$"}},...O})]}),t.jsxs(at,{children:[t.jsx(M,{onClick:n,children:"Cancel"}),t.jsx(M,{type:"submit",onClick:mt,children:s?"Update":"Add"})]})]})},q={variant:"standard",fullWidth:!0,margin:"dense"},dt=d.memo(({open:e,price:s,stock:n,onClose:a,addStockEntry:h,removeStockEntry:i})=>{const[o,c]=d.useState(0),[r,l]=d.useState(""),x=()=>{c(0),l("")};d.useEffect(()=>{n&&s!==void 0?(c(s),l(n)):x()},[s,n]);const u=m=>l(m.target.value),g=m=>c(parseFloat(m.target.value)),j=()=>{h(r,o),x()};return t.jsxs(st,{open:e,onClose:a,children:[t.jsxs(nt,{children:[n?"Edit":"New"," Stock Entry"]}),t.jsx(ot,{children:t.jsxs("div",{style:{marginTop:5},children:[t.jsx(N,{label:"Stock",value:r,onChange:u,...q}),t.jsx(N,{label:"Price Now",value:o,type:"number",onChange:g,slotProps:{input:{startAdornment:"$"}},...q})]})}),t.jsxs(at,{children:[t.jsx(M,{onClick:i(r),color:"error",children:"Delete"}),t.jsx(M,{onClick:a,children:"Cancel"}),t.jsx(M,{type:"submit",onClick:j,children:n?"Update":"Add"})]})]})});dt.displayName="StockDialog";const Rt=({stockEntries:e,openStockModal:s})=>t.jsx("div",{children:Object.keys(e).map((n,a)=>t.jsx(Tt,{color:"primary",label:`${n}: ${v.format(e[n])}`,onClick:s(n),sx:{margin:.5,fontWeight:"bold"}},`stock-entry-${a}`))}),ht=[At[500],Y[500],Ct[500],Y[900]];rt(W);const K=0,V=1,X=2,Z=3,E=4,Wt={2e3:1.034,2001:1.028,2002:1.016,2003:1.023,2004:1.027,2005:1.034,2006:1.032,2007:1.028,2008:1.038,2009:.996,2010:1.016,2011:1.032,2012:1.021,2013:1.015,2014:1.016,2015:1.001,2016:1.013,2017:1.021,2018:1.024,2019:1.018,2020:1.012,2021:1.047,2022:1.08,2023:1.041,2024:1.027},Et=({startIdx:e,compCalcEntries:s,compEntries:n,onClick:a})=>{const i=G(et).mode==="light"?"black":"white",o=[[],[],[],[],[]];if(n.length>0){let r=P(n[e].entryDate).year,l=n[e].salary+n[e].bonus+(s[e].stockAdj||s[e].stock);n.forEach(({bonus:x,salary:u,entryDate:g},j)=>{const{stock:m,stockAdj:f}=s[j];o[K].push(f||m),o[V].push(x),o[X].push(u),o[Z].push(m+x+u);const y=P(g).year;if(y>=r){for(;r<y;r+=1)l*=Wt[r];o[E].push(l)}else o[E].push(x+u+(f||m))})}const c={colors:[...ht,i],chart:{type:"area",backgroundColor:null},credits:{enabled:!1},legend:{enabled:!1},title:{text:"Total Comp",style:{color:i}},xAxis:{visible:!1},yAxis:{labels:{style:{color:i}},title:{enabled:!1}},tooltip:{shared:!0,headerFormat:"<h3>Compensation</h3><br />",pointFormat:'<span style="color:{series.color}">●</span> {series.name}: <b>${point.y:,.2f}</b><br />',footerFormat:"● *Total: $<b>{point.total:,.2f}</b>"},plotOptions:{area:{stacking:"normal",lineColor:i,lineWidth:1,marker:{lineWidth:1,lineColor:i}},series:{cursor:"pointer",events:{click:a}}},series:[{type:"area",name:"Stock",data:[...o[K]]},{type:"area",name:"Bonus",data:[...o[V]]},{type:"area",name:"Salary",data:[...o[X]]},{type:"spline",name:"Total",data:[...o[Z]]},{type:"spline",name:"Inflation",data:[...o[E]]}]};return t.jsx("figure",{style:{margin:0,width:"100%"},children:t.jsx(lt,{highcharts:W,options:c})})};rt(W);const ut=d.memo(({bonus:e,salary:s,stock:n})=>{const h=G(et).mode==="light"?"black":"white",i={colors:ht,chart:{type:"pie",backgroundColor:null},credits:{enabled:!1},legend:{enabled:!1},title:{text:"Comp Breakdown",style:{color:h}},tooltip:{pointFormat:"<b>${point.y:,.2f}</b>"},plotOptions:{series:{allowPointSelect:!0,cursor:"pointer",dataLabels:[{enabled:!0,format:"{point.name}"},{enabled:!0,distance:-30,format:"{point.percentage:.0f}%",style:{fontSize:"1em"}}]}},series:[{data:[{name:"Stock",y:n},{name:"Bonus",y:e},{name:"Salary",y:s}]}]};return t.jsx("figure",{style:{margin:0,width:"100%"},children:t.jsx(lt,{highcharts:W,options:i})})});ut.displayName="BreakdownChart";const Gt=({compEntries:e,compCalcEntries:s})=>{const{stock:n,stockAdj:a}=s[s.length-1],{bonus:h,salary:i}=e[e.length-1],[o,c]=d.useState(0),[r,l]=d.useState(a||n),[x,u]=d.useState(h),[g,j]=d.useState(i);d.useEffect(()=>{c(0),l(a||n),u(h),j(i)},[a,n,h,i]);const m=({point:{index:f}})=>{const{stock:y,stockAdj:b}=s[f],{bonus:D,salary:A}=e[f];c(f>=e.length-1?0:f),l(b||y),u(D),j(A)};return t.jsxs(w,{container:!0,children:[t.jsx(w,{size:{xs:12,md:6,lg:8,xl:9},children:t.jsx(Et,{startIdx:o,compCalcEntries:s,compEntries:e,onClick:m})}),t.jsx(w,{size:{xs:12,md:6,lg:4,xl:3},children:t.jsx(ut,{stock:r,bonus:x,salary:g})})]})},ae=()=>{const[e,s]=U(ct),n=G(Ot),[a,h]=U(it),[i,o]=d.useState(!1),[c,r]=d.useState(!1),[l,x]=d.useState(-1),[u,g]=d.useState(""),j=()=>o(!1),m=()=>{x(-1),o(!0)},f=C=>()=>{x(C),o(!0)},y=()=>r(!1),b=()=>{g(""),r(!0)},D=C=>()=>{g(C),r(!0)},A=C=>{const T=[...e];l===-1?T.push(C):T[l]=C,s(T),j()},B=(C,T)=>{const I={...a};I[C]=T,h(I),y()},k=C=>()=>{const T={...a};delete T[C],h(T),y()};return t.jsxs(t.Fragment,{children:[t.jsx(p,{variant:"h2",component:"h1",children:"Comp Calculator"}),t.jsxs("div",{className:"flex-container",style:{marginTop:10,marginBottom:10},children:[t.jsx(Rt,{stockEntries:a,openStockModal:D}),t.jsxs("div",{children:[t.jsx(M,{onClick:b,children:"+ Stock"}),t.jsx(M,{onClick:m,children:"+ Entry"})]})]}),e.length>0&&t.jsxs(t.Fragment,{children:[t.jsx(Gt,{compEntries:e,compCalcEntries:n}),t.jsx(Pt,{compEntries:e,compCalcEntries:n,onClick:f})]}),t.jsx(dt,{open:c,price:u?a[u]:void 0,stock:u,onClose:y,addStockEntry:B,removeStockEntry:k}),t.jsx(It,{open:i,compEntry:l!==-1?e[l]:void 0,onClose:j,addCompEntry:A})]})};export{ae as default};
//# sourceMappingURL=index-hdtHCcmx.js.map