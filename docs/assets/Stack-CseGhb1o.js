import{a2 as V,a3 as v,a4 as u,a5 as b,a6 as T,a7 as D,r as p,$ as B,j as F,c as M,f as E,b as $,a8 as k,s as G,e as N}from"./index-CXH5PJAX.js";import{s as O,u as U}from"./useThemeProps-zp0kfiu8.js";const A=V(),I=O("div",{name:"MuiStack",slot:"Root",overridesResolver:(e,s)=>s.root});function L(e){return U({props:e,name:"MuiStack",defaultTheme:A})}function q(e,s){const n=p.Children.toArray(e).filter(Boolean);return n.reduce((a,c,t)=>(a.push(c),t<n.length-1&&a.push(p.cloneElement(s,{key:`separator-${t}`})),a),[])}const z=e=>({row:"Left","row-reverse":"Right",column:"Top","column-reverse":"Bottom"})[e],H=({ownerState:e,theme:s})=>{let n={display:"flex",flexDirection:"column",...v({theme:s},u({values:e.direction,breakpoints:s.breakpoints.values}),a=>({flexDirection:a}))};if(e.spacing){const a=b(s),c=Object.keys(s.breakpoints.values).reduce((o,r)=>((typeof e.spacing=="object"&&e.spacing[r]!=null||typeof e.direction=="object"&&e.direction[r]!=null)&&(o[r]=!0),o),{}),t=u({values:e.direction,base:c}),d=u({values:e.spacing,base:c});typeof t=="object"&&Object.keys(t).forEach((o,r,i)=>{if(!t[o]){const l=r>0?t[i[r-1]]:"column";t[o]=l}}),n=T(n,v({theme:s},d,(o,r)=>e.useFlexGap?{gap:k(a,o)}:{"& > :not(style):not(style)":{margin:0},"& > :not(style) ~ :not(style)":{[`margin${z(r?t[r]:e.direction)}`]:k(a,o)}}))}return n=D(s.breakpoints,n),n};function J(e={}){const{createStyledComponent:s=I,useThemeProps:n=L,componentName:a="MuiStack"}=e,c=()=>E({root:["root"]},o=>$(a,o),{}),t=s(H);return p.forwardRef(function(o,r){const i=n(o),f=B(i),{component:l="div",direction:h="column",spacing:x=0,divider:y,children:g,className:j,useFlexGap:C=!1,...P}=f,S={direction:h,spacing:x,useFlexGap:C},R=c();return F.jsx(t,{as:l,ownerState:S,ref:r,className:M(R.root,j),...P,children:y?q(g,y):g})})}const W=J({createStyledComponent:G("div",{name:"MuiStack",slot:"Root",overridesResolver:(e,s)=>s.root}),useThemeProps:e=>N({props:e,name:"MuiStack"})});export{W as S};
//# sourceMappingURL=Stack-CseGhb1o.js.map