import{r as d,j as e,c as j,J as N,a2 as xe,g as ee,b as te,s as w,a3 as Ce,u as ne,d as A,e as be,f as oe,k as P,K as _,a4 as se,U as ye}from"./index-16562204.js";import{b as ve,d as F,o as I,e as je,r as Se,i as ke,P as Te,f as Pe,g as Ee,h as Me,I as E,j as Re,G as y,F as z,k as H,S as G,m as W,M as re,p as M,q as K,T as we}from"./MenuItem-34ed4bd5.js";import{u as Le}from"./useOpenState-968dc130.js";import{C as Oe}from"./Chip-07566a75.js";import{n as De}from"./nl2br.min-fec41cf9.js";import{F as X}from"./FormControlLabel-893f7dc8.js";import{E as B}from"./ExpandableCard-7aefc29a.js";import"./CardContent-8935b083.js";import"./Collapse-0bdcc7c5.js";function V(t){return t.substring(2).toLowerCase()}function Ie(t,n){return n.documentElement.clientWidth<t.clientX||n.documentElement.clientHeight<t.clientY}function Be(t){const{children:n,disableReactTree:o=!1,mouseEvent:s="onClick",onClickAway:a,touchEvent:i="onTouchEnd"}=t,m=d.useRef(!1),h=d.useRef(null),p=d.useRef(!1),f=d.useRef(!1);d.useEffect(()=>(setTimeout(()=>{p.current=!0},0),()=>{p.current=!1}),[]);const x=ve(n.ref,h),g=F(c=>{const C=f.current;f.current=!1;const b=I(h.current);if(!p.current||!h.current||"clientX"in c&&Ie(c,b))return;if(m.current){m.current=!1;return}let r;c.composedPath?r=c.composedPath().indexOf(h.current)>-1:r=!b.documentElement.contains(c.target)||h.current.contains(c.target),!r&&(o||!C)&&a(c)}),S=c=>C=>{f.current=!0;const b=n.props[c];b&&b(C)},v={ref:x};return i!==!1&&(v[i]=S(i)),d.useEffect(()=>{if(i!==!1){const c=V(i),C=I(h.current),b=()=>{m.current=!0};return C.addEventListener(c,g),C.addEventListener("touchmove",b),()=>{C.removeEventListener(c,g),C.removeEventListener("touchmove",b)}}},[g,i]),s!==!1&&(v[s]=S(s)),d.useEffect(()=>{if(s!==!1){const c=V(s),C=I(h.current);return C.addEventListener(c,g),()=>{C.removeEventListener(c,g)}}},[g,s]),e.jsx(d.Fragment,{children:d.cloneElement(n,v)})}function $e(t){const{autoHideDuration:n=null,disableWindowBlurListener:o=!1,onClose:s,open:a,resumeHideDuration:i}=t,m=d.useRef();d.useEffect(()=>{if(!a)return;function r(l){l.defaultPrevented||(l.key==="Escape"||l.key==="Esc")&&(s==null||s(l,"escapeKeyDown"))}return document.addEventListener("keydown",r),()=>{document.removeEventListener("keydown",r)}},[a,s]);const h=F((r,l)=>{s==null||s(r,l)}),p=F(r=>{!s||r==null||(clearTimeout(m.current),m.current=setTimeout(()=>{h(null,"timeout")},r))});d.useEffect(()=>(a&&p(n),()=>{clearTimeout(m.current)}),[a,n,p]);const f=r=>{s==null||s(r,"clickaway")},x=()=>{clearTimeout(m.current)},g=d.useCallback(()=>{n!=null&&p(i??n*.5)},[n,i,p]),S=r=>l=>{const u=r.onBlur;u==null||u(l),g()},v=r=>l=>{const u=r.onFocus;u==null||u(l),x()},c=r=>l=>{const u=r.onMouseEnter;u==null||u(l),x()},C=r=>l=>{const u=r.onMouseLeave;u==null||u(l),g()};return d.useEffect(()=>{if(!o&&a)return window.addEventListener("focus",g),window.addEventListener("blur",x),()=>{window.removeEventListener("focus",g),window.removeEventListener("blur",x)}},[o,g,a]),{getRootProps:(r={})=>{const l=je(t),u=j({},l,r);return j({role:"presentation"},u,{onBlur:S(u),onFocus:v(u),onMouseEnter:c(u),onMouseLeave:C(u)})},onClickAway:f}}const Ae=["chores","epics","features","fixes"],Fe={branchMessage:"",branchPrefix:"features"},ae=N({key:"gitAtom",default:JSON.parse(localStorage.getItem("git-atom")||"null")||Fe,effects:[({onSet:t})=>{t(n=>{localStorage.setItem("git-atom",JSON.stringify(n))})}]}),ie=N({key:"storyIdGitAtom",default:JSON.parse(localStorage.getItem("story-id-git-atom")||'""'),effects:[({onSet:t})=>{t(n=>{localStorage.setItem("story-id-git-atom",JSON.stringify(n))})}]}),Ne=N({key:"commitPrefixGitAtom",default:JSON.parse(localStorage.getItem("commit-prefix-git-atom")||"true"),effects:[({onSet:t})=>{t(n=>{localStorage.setItem("commit-prefix-git-atom",JSON.stringify(n))})}]});var U={},_e=ke;Object.defineProperty(U,"__esModule",{value:!0});var R=U.default=void 0,ze=_e(Se()),He=e,Ge=(0,ze.default)((0,He.jsx)("path",{d:"M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"}),"Clear");R=U.default=Ge;const ce=xe({key:"branchNameGitSelector",get:({get:t})=>{const{branchMessage:n,branchPrefix:o}=t(ae),s=t(ie);return`${o?`${o}/`:""}${s}${n}`}});function We(t){return ee("MuiSnackbarContent",t)}te("MuiSnackbarContent",["root","message","action"]);const Ue=["action","className","message","role"],Je=t=>{const{classes:n}=t;return oe({root:["root"],action:["action"],message:["message"]},We,n)},qe=w(Te,{name:"MuiSnackbarContent",slot:"Root",overridesResolver:(t,n)=>n.root})(({theme:t})=>{const n=t.palette.mode==="light"?.8:.98,o=Ce(t.palette.background.default,n);return j({},t.typography.body2,{color:t.vars?t.vars.palette.SnackbarContent.color:t.palette.getContrastText(o),backgroundColor:t.vars?t.vars.palette.SnackbarContent.bg:o,display:"flex",alignItems:"center",flexWrap:"wrap",padding:"6px 16px",borderRadius:(t.vars||t).shape.borderRadius,flexGrow:1,[t.breakpoints.up("sm")]:{flexGrow:"initial",minWidth:288}})}),Ze=w("div",{name:"MuiSnackbarContent",slot:"Message",overridesResolver:(t,n)=>n.message})({padding:"8px 0"}),Ke=w("div",{name:"MuiSnackbarContent",slot:"Action",overridesResolver:(t,n)=>n.action})({display:"flex",alignItems:"center",marginLeft:"auto",paddingLeft:16,marginRight:-8}),Xe=d.forwardRef(function(n,o){const s=ne({props:n,name:"MuiSnackbarContent"}),{action:a,className:i,message:m,role:h="alert"}=s,p=A(s,Ue),f=s,x=Je(f);return e.jsxs(qe,j({role:h,square:!0,elevation:6,className:be(x.root,i),ownerState:f,ref:o},p,{children:[e.jsx(Ze,{className:x.message,ownerState:f,children:m}),a?e.jsx(Ke,{className:x.action,ownerState:f,children:a}):null]}))}),Ve=Xe;function Ye(t){return ee("MuiSnackbar",t)}te("MuiSnackbar",["root","anchorOriginTopCenter","anchorOriginBottomCenter","anchorOriginTopRight","anchorOriginBottomRight","anchorOriginTopLeft","anchorOriginBottomLeft"]);const Qe=["onEnter","onExited"],et=["action","anchorOrigin","autoHideDuration","children","className","ClickAwayListenerProps","ContentProps","disableWindowBlurListener","message","onBlur","onClose","onFocus","onMouseEnter","onMouseLeave","open","resumeHideDuration","TransitionComponent","transitionDuration","TransitionProps"],tt=t=>{const{classes:n,anchorOrigin:o}=t,s={root:["root",`anchorOrigin${P(o.vertical)}${P(o.horizontal)}`]};return oe(s,Ye,n)},Y=w("div",{name:"MuiSnackbar",slot:"Root",overridesResolver:(t,n)=>{const{ownerState:o}=t;return[n.root,n[`anchorOrigin${P(o.anchorOrigin.vertical)}${P(o.anchorOrigin.horizontal)}`]]}})(({theme:t,ownerState:n})=>{const o={left:"50%",right:"auto",transform:"translateX(-50%)"};return j({zIndex:(t.vars||t).zIndex.snackbar,position:"fixed",display:"flex",left:8,right:8,justifyContent:"center",alignItems:"center"},n.anchorOrigin.vertical==="top"?{top:8}:{bottom:8},n.anchorOrigin.horizontal==="left"&&{justifyContent:"flex-start"},n.anchorOrigin.horizontal==="right"&&{justifyContent:"flex-end"},{[t.breakpoints.up("sm")]:j({},n.anchorOrigin.vertical==="top"?{top:24}:{bottom:24},n.anchorOrigin.horizontal==="center"&&o,n.anchorOrigin.horizontal==="left"&&{left:24,right:"auto"},n.anchorOrigin.horizontal==="right"&&{right:24,left:"auto"})})}),nt=d.forwardRef(function(n,o){const s=ne({props:n,name:"MuiSnackbar"}),a=Pe(),i={enter:a.transitions.duration.enteringScreen,exit:a.transitions.duration.leavingScreen},{action:m,anchorOrigin:{vertical:h,horizontal:p}={vertical:"bottom",horizontal:"left"},autoHideDuration:f=null,children:x,className:g,ClickAwayListenerProps:S,ContentProps:v,disableWindowBlurListener:c=!1,message:C,open:b,TransitionComponent:r=Me,transitionDuration:l=i,TransitionProps:{onEnter:u,onExited:k}={}}=s,q=A(s.TransitionProps,Qe),L=A(s,et),O=j({},s,{anchorOrigin:{vertical:h,horizontal:p},autoHideDuration:f,disableWindowBlurListener:c,TransitionComponent:r,transitionDuration:l}),le=tt(O),{getRootProps:ue,onClickAway:de}=$e(j({},O)),[me,Z]=d.useState(!0),he=Ee({elementType:Y,getSlotProps:ue,externalForwardedProps:L,ownerState:O,additionalProps:{ref:o},className:[le.root,g]}),pe=D=>{Z(!0),k&&k(D)},ge=(D,fe)=>{Z(!1),u&&u(D,fe)};return!b&&me?null:e.jsx(Be,j({onClickAway:de},S,{children:e.jsx(Y,j({},he,{children:e.jsx(r,j({appear:!0,in:b,timeout:l,direction:h==="top"?"down":"up",onEnter:ge,onExited:pe},q,{children:x||e.jsx(Ve,j({message:C,action:m},v))}))}))}))}),ot=nt,st={height:"auto",paddingTop:7,paddingBottom:7},J=t=>{const[n,o,s]=Le(!1),{copyText:a,text:i}=t,m=d.useCallback(()=>{var h,p;o(),(p=(h=navigator==null?void 0:navigator.clipboard)==null?void 0:h.writeText(a||i))==null||p.catch(()=>console.warn("Failed to copy"))},[a,o,i]);return e.jsxs(e.Fragment,{children:[e.jsx(Oe,{onClick:m,style:st,label:e.jsx("div",{children:i}),"aria-label":`copy to clipboard ${i}`}),e.jsx(ot,{action:[e.jsx(E,{onClick:s,size:"large","aria-label":"close copy to clipboard confirmation",children:e.jsx(Re,{})},"close")],autoHideDuration:4e3,message:"Copied Commit Text to clipboard!",onClose:s,open:n})]})},rt={paddingLeft:20,paddingRight:20,width:"100%"},at={marginTop:12},it=t=>{const[n,o]=_(ae),s=se(ce),{getSelectOptions:a,gitTheme:i}=t,{branchMessage:m,branchPrefix:h}=n,p=c=>o({...n,branchMessage:c.target.value}),f=()=>o({...n,branchMessage:""}),x=c=>o({...n,branchPrefix:c}),g=()=>a([...Ae]),S=c=>x(c.target.value),v=d.useMemo(()=>({color:i}),[i]);return e.jsxs("div",{style:rt,children:[e.jsxs(y,{container:!0,spacing:2,style:{marginBottom:16},children:[e.jsx(y,{item:!0,md:3,sm:5,xs:12,style:{marginTop:16},children:e.jsxs(z,{fullWidth:!0,children:[e.jsx(H,{htmlFor:"branch-prefix",style:v,children:"Branch Prefix"}),e.jsx(G,{input:e.jsx(W,{id:"branch-prefix"}),onChange:S,value:h,children:g()||e.jsx(re,{value:"features",children:"features"})})]})}),e.jsx(y,{item:!0,md:8,sm:6,xs:10,style:{marginTop:16},children:e.jsx(M,{fullWidth:!0,InputLabelProps:{style:v},label:"Branch Name",multiline:!0,onChange:p,placeholder:"Summary of User Story",value:m})}),e.jsx(y,{item:!0,sm:1,xs:2,style:{marginTop:16},children:e.jsx(E,{onClick:f,style:at,size:"large","aria-label":"Clear Branch Name",children:e.jsx(R,{})})})]}),e.jsx(J,{text:s})]})};function ct(t,n){const[o,s]=d.useState("feat"),[a,i]=d.useState(""),[m,h]=d.useState(""),[p,f]=d.useState(!1);return{commitPrefix:o,commitMessage:a,commitDescription:m,finishes:p,getCommitText:()=>{const r=`${o}: `;let l=" ";m&&t?l=`

${m}

`:m&&(l=`

${m}`);let u="";p&&t?u=`[${t} #finish]`:t&&(u=`[${t}]`);const k=`${r}${a}${l}${u}`;return n?`git commit -m "${k}"`:k},handleCommitPrefixSelect:r=>{s(r.target.value)},handleCommitMessageChange:r=>{i(r.target.value)},handleCommitDescriptionChange:r=>{h(r.target.value)},clearCommitMessage:()=>{i("")},clearCommitDescription:()=>{h("")},handleFinishesToggle:(r,l)=>{f(l)}}}const lt={paddingLeft:20,paddingRight:20,width:"100%"},Q={marginTop:12},ut=t=>{const[n,o]=_(Ne),{getSelectOptions:s,storyID:a,gitTheme:i}=t,{commitPrefix:m,commitMessage:h,commitDescription:p,finishes:f,getCommitText:x,handleCommitPrefixSelect:g,handleCommitMessageChange:S,handleCommitDescriptionChange:v,clearCommitMessage:c,clearCommitDescription:C,handleFinishesToggle:b}=ct(a,n),r=d.useCallback(()=>s(["build","chore","ci","docs","feat","fix","perf","refactor","revert","style","test"]),[s]),l=(q,L)=>{o(L)},u=x(),k=u&&De(x());return e.jsxs("div",{style:lt,children:[e.jsxs(y,{container:!0,spacing:2,style:{marginBottom:16},children:[e.jsx(y,{item:!0,sm:4,xs:12,style:{marginTop:16},children:e.jsxs(z,{fullWidth:!0,children:[e.jsx(H,{htmlFor:"commit-prefix",style:{color:i},children:"Commit Prefix"}),e.jsx(G,{input:e.jsx(W,{id:"commit-prefix"}),onChange:g,value:m,children:r()})]})}),e.jsx(y,{item:!0,sm:4,xs:12,style:{marginTop:16},children:e.jsx(X,{control:e.jsx(K,{checked:f,onChange:b,value:"Finishes User Story"}),label:"Finishes User Story"})}),e.jsx(y,{item:!0,sm:4,xs:12,style:{marginTop:16},children:e.jsx(X,{control:e.jsx(K,{checked:n,onChange:l,value:"Add git commit -m"}),label:"Add git commit -m"})}),e.jsx(y,{item:!0,sm:5,xs:10,children:e.jsx(M,{fullWidth:!0,InputLabelProps:{style:{color:i}},label:"Commit Message",onChange:S,placeholder:"Summary of Work Done (Message)",value:h})}),e.jsx(y,{item:!0,sm:1,xs:2,children:e.jsx(E,{onClick:c,style:Q,size:"large","aria-label":"Clear Commit Message",children:e.jsx(R,{})})}),e.jsx(y,{item:!0,sm:5,xs:10,children:e.jsx(M,{fullWidth:!0,InputLabelProps:{style:{color:i}},label:"Commit Description",multiline:!0,onChange:v,placeholder:"Summary of Work Done (Description)",value:p})}),e.jsx(y,{item:!0,sm:1,xs:2,children:e.jsx(E,{onClick:C,style:Q,size:"large","aria-label":"Clear Commit Description",children:e.jsx(R,{})})})]}),e.jsx(J,{copyText:u,text:k})]})},dt=d.memo(t=>{const n=se(ce),[o,s]=d.useState("test-pipeline"),{gitTheme:a,getSelectOptions:i}=t,m=h=>s(h.target.value);return e.jsx("div",{style:{paddingLeft:20,paddingRight:20,width:"100%"},children:e.jsxs(y,{container:!0,spacing:1,style:{display:"flex",alignItems:"center"},children:[e.jsx(y,{item:!0,sm:3,xs:12,style:{marginTop:16},children:e.jsxs(z,{fullWidth:!0,children:[e.jsx(H,{htmlFor:"target-branch",style:{color:a},children:"Target Branch"}),e.jsx(G,{input:e.jsx(W,{id:"target-branch"}),onChange:m,value:o,children:i(["test-pipeline","sandbox-pipeline"])})]})}),e.jsx(y,{item:!0,sm:9,xs:12,style:{marginTop:16},children:e.jsx(J,{text:`git push -f origin ${n}:${o}`})})]})})}),mt=/[A-Z]{4}-[a-zA-Z0-9]+/,ht=d.memo(t=>{const{onIdChange:n,storyID:o,gitTheme:s}=t,a=o&&mt.test(o);return e.jsxs(e.Fragment,{children:[e.jsx(we,{variant:"h2",component:"h1",children:"Git Tools"}),e.jsx(M,{InputLabelProps:{style:{color:s}},label:"User Story ID",onChange:n,placeholder:"GNAP-12345",style:{marginLeft:20},value:o,error:!a}),e.jsx("br",{})]})}),pt=/[A-Z]{1,4}-?[a-zA-Z0-9]*/,$=t=>t.map((n,o)=>e.jsx(re,{value:n,children:n},o)),T=ye[900],gt=()=>{const[t,n]=_(ie),o=s=>{const[a]=pt.exec(s.target.value)||[""];n(a)};return e.jsxs(e.Fragment,{children:[e.jsx(ht,{gitTheme:T,onIdChange:o,storyID:t}),e.jsx(B,{backgroundColor:T,title:"Create Branch Name",children:e.jsx(it,{getSelectOptions:$,gitTheme:T})}),e.jsx(B,{backgroundColor:T,title:"Create Commit Message",children:e.jsx(ut,{getSelectOptions:$,gitTheme:T,storyID:t})}),e.jsx(B,{backgroundColor:T,title:"Deploy to Test Pipelines",children:e.jsx(dt,{getSelectOptions:$,gitTheme:T})})]})},Tt=gt;export{Tt as default};
//# sourceMappingURL=index-ea8c3aa0.js.map