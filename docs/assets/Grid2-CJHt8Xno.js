import{u as F}from"./Header-FKXbBZOK.js";import{a1 as H,u as I,r as $,Z as J,j as Q,c as V,i as X,f as Y,s as v,h as ee}from"./index-v6T3YN2J.js";import{s as ne,u as te}from"./useThemeProps-BE3b7UDM.js";import{i as re}from"./isMuiElement-DTFLZQvR.js";const se=(e,n)=>e.filter(t=>n.includes(t)),S=(e,n,t)=>{const o=e.keys[0];Array.isArray(n)?n.forEach((s,r)=>{t((i,m)=>{r<=e.keys.length-1&&(r===0?Object.assign(i,m):i[e.up(e.keys[r])]=m)},s)}):n&&typeof n=="object"?(Object.keys(n).length>e.keys.length?e.keys:se(e.keys,Object.keys(n))).forEach(r=>{if(e.keys.includes(r)){const i=n[r];i!==void 0&&t((m,G)=>{o===r?Object.assign(m,G):m[e.up(r)]=G},i)}}):(typeof n=="number"||typeof n=="string")&&t((s,r)=>{Object.assign(s,r)},n)};function b(e){return`--Grid-${e}Spacing`}function x(e){return`--Grid-parent-${e}Spacing`}const T="--Grid-columns",y="--Grid-parent-columns",oe=({theme:e,ownerState:n})=>{const t={};return S(e.breakpoints,n.size,(o,s)=>{let r={};s==="grow"&&(r={flexBasis:0,flexGrow:1,maxWidth:"100%"}),s==="auto"&&(r={flexBasis:"auto",flexGrow:0,flexShrink:0,maxWidth:"none",width:"auto"}),typeof s=="number"&&(r={flexGrow:0,flexBasis:"auto",width:`calc(100% * ${s} / var(${y}) - (var(${y}) - ${s}) * (var(${x("column")}) / var(${y})))`}),o(t,r)}),t},ie=({theme:e,ownerState:n})=>{const t={};return S(e.breakpoints,n.offset,(o,s)=>{let r={};s==="auto"&&(r={marginLeft:"auto"}),typeof s=="number"&&(r={marginLeft:s===0?"0px":`calc(100% * ${s} / var(${y}) + var(${x("column")}) * ${s} / var(${y}))`}),o(t,r)}),t},ce=({theme:e,ownerState:n})=>{if(!n.container)return{};const t={[T]:12};return S(e.breakpoints,n.columns,(o,s)=>{const r=s??12;o(t,{[T]:r,"> *":{[y]:r}})}),t},ae=({theme:e,ownerState:n})=>{if(!n.container)return{};const t={};return S(e.breakpoints,n.rowSpacing,(o,s)=>{var i;const r=typeof s=="string"?s:(i=e.spacing)==null?void 0:i.call(e,s);o(t,{[b("row")]:r,"> *":{[x("row")]:r}})}),t},fe=({theme:e,ownerState:n})=>{if(!n.container)return{};const t={};return S(e.breakpoints,n.columnSpacing,(o,s)=>{var i;const r=typeof s=="string"?s:(i=e.spacing)==null?void 0:i.call(e,s);o(t,{[b("column")]:r,"> *":{[x("column")]:r}})}),t},ue=({theme:e,ownerState:n})=>{if(!n.container)return{};const t={};return S(e.breakpoints,n.direction,(o,s)=>{o(t,{flexDirection:s})}),t},le=({ownerState:e})=>({minWidth:0,boxSizing:"border-box",...e.container&&{display:"flex",flexWrap:"wrap",...e.wrap&&e.wrap!=="wrap"&&{flexWrap:e.wrap},gap:`var(${b("row")}) var(${b("column")})`}}),pe=e=>{const n=[];return Object.entries(e).forEach(([t,o])=>{o!==!1&&o!==void 0&&n.push(`grid-${t}-${String(o)}`)}),n},me=(e,n="xs")=>{function t(o){return o===void 0?!1:typeof o=="string"&&!Number.isNaN(Number(o))||typeof o=="number"&&o>0}if(t(e))return[`spacing-${n}-${String(e)}`];if(typeof e=="object"&&!Array.isArray(e)){const o=[];return Object.entries(e).forEach(([s,r])=>{t(r)&&o.push(`spacing-${s}-${String(r)}`)}),o}return[]},ge=e=>e===void 0?[]:typeof e=="object"?Object.entries(e).map(([n,t])=>`direction-${n}-${t}`):[`direction-xs-${String(e)}`],de=H(),ye=ne("div",{name:"MuiGrid",slot:"Root",overridesResolver:(e,n)=>n.root});function Se(e){return te({props:e,name:"MuiGrid",defaultTheme:de})}function Ge(e={}){const{createStyledComponent:n=ye,useThemeProps:t=Se,useTheme:o=I,componentName:s="MuiGrid"}=e,r=(u,c)=>{const{container:g,direction:f,spacing:l,wrap:a,size:w}=u,h={root:["root",g&&"container",a!=="wrap"&&`wrap-xs-${String(a)}`,...ge(f),...pe(w),...g?me(l,c.breakpoints.keys[0]):[]]};return X(h,j=>Y(s,j),{})};function i(u,c,g=()=>!0){const f={};return u===null||(Array.isArray(u)?u.forEach((l,a)=>{l!==null&&g(l)&&c.keys[a]&&(f[c.keys[a]]=l)}):typeof u=="object"?Object.keys(u).forEach(l=>{const a=u[l];a!=null&&g(a)&&(f[l]=a)}):f[c.keys[0]]=u),f}const m=n(ce,fe,ae,oe,ue,le,ie),G=$.forwardRef(function(c,g){const f=o(),l=t(c),a=J(l),{className:w,children:h,columns:j=12,container:C=!1,component:O="div",direction:P="row",wrap:R="wrap",size:z={},offset:M={},spacing:k=0,rowSpacing:A=k,columnSpacing:B=k,unstable_level:d=0,...D}=a,W=i(z,f.breakpoints,p=>p!==!1),_=i(M,f.breakpoints),L=c.columns??(d?void 0:j),K=c.spacing??(d?void 0:k),U=c.rowSpacing??c.spacing??(d?void 0:A),Z=c.columnSpacing??c.spacing??(d?void 0:B),N={...a,level:d,columns:L,container:C,direction:P,wrap:R,spacing:K,rowSpacing:U,columnSpacing:Z,size:W,offset:_},q=r(N,f);return Q.jsx(m,{ref:g,as:O,ownerState:N,className:V(q.root,w),...D,children:$.Children.map(h,p=>{var E;return $.isValidElement(p)&&re(p,["Grid"])&&C&&p.props.container?$.cloneElement(p,{unstable_level:((E=p.props)==null?void 0:E.unstable_level)??d+1}):p})})});return G.muiName="Grid",G}const he=Ge({createStyledComponent:v("div",{name:"MuiGrid2",slot:"Root",overridesResolver:(e,n)=>{const{ownerState:t}=e;return[n.root,t.container&&n.container]}}),componentName:"MuiGrid2",useThemeProps:e=>ee({props:e,name:"MuiGrid2"}),useTheme:F});export{he as G};
//# sourceMappingURL=Grid2-CJHt8Xno.js.map