import{j as o,b as be,g as xe,s as G,k as ae,c as h,F as Ce,r as c,u as Ve,d as ne,e as U,f as Fe}from"./index-16562204.js";import{A as Se,a as Re,d as je,b as Me}from"./ExpandMore-01275ca2.js";import{c as ie,s as le,t as Ae,f as Ee,u as We,b as Ie,T as P}from"./MenuItem-34ed4bd5.js";import{v as Te}from"./visuallyHidden-14c3de6e.js";import{C as Le}from"./Chip-07566a75.js";import"./Collapse-0bdcc7c5.js";const He=[{name:"Mystic Seer",description:"Each night, point to a player and learn their exact role.",value:9},{name:"Seer",description:"Each night choose a player to learn if that player is a Villager or a Werewolf.",value:7},{name:"Mentalist",description:"Each night you may point to two players, and are told if those players are on the same team or not.",value:6},{name:"Revealer",description:"Each night you may point to a player. If that player is a Werewolf, that player is eliminated. If that player is not, you are eliminated.",value:4},{name:"Apprentice Seer",description:"If the Seer is eliminated, you become the Seer, waking each night to look for Werewolves.",value:4},{name:"Witch",description:"You may save or eliminate a player at night once each per game.",value:4},{name:"Drunk",description:"You are a Villager until the 3rd night, when you sober up and learn your real role.",value:4},{name:"Bodyguard",description:"Each night, choose a player who cannot be eliminated that night.",value:3},{name:"Prince",description:"If you are voted to be eliminated, your role is revealed and you stay.",value:3},{name:"Diseased",description:"If you are eliminated by Werewolves, they don't get to eliminate anyone the following night.",value:3},{name:"Hunter",description:"If you are eliminated, you may immediately eliminate another player.",value:3},{name:"Huntress",description:"You may eliminate a player at night once per game.",value:3},{name:"Priest",description:"One night per game, choose a player to be protected. That player may not be eliminated at night.",value:3},{name:"P.I.",description:"One night per game, choose a player. You'll be told if that player or one of his neighbors is a Werewolf.",value:3},{name:"Tough Guy",description:"If the Werewolves attempt to eliminate you, you are not eliminated until the following night.",value:3},{name:"Aura Seer",description:"Choose a player each night to see if that player is not a Werewolf or Villager.",value:3},{name:"Ghost",description:"The first night, you are eliminated. Communicate to the players with single letters each day.",value:2},{name:"Mayor",description:"Your vote counts twice.",value:2},{name:"Mason",description:"The first night, wake up to see who the other Mason is.",value:2,count:3},{name:"Village Idiot",description:"You always vote for players to be eliminated.",value:2},{name:"Old Hag",description:"Each night, choose a player to leave the village during the next day.",value:1},{name:"Spellcaster",description:"Each night, choose a player who may not speak the following day.",value:1},{name:"Villager",description:"Find the Werewolves and eliminate them.",value:1,count:14},{name:"Lycan",description:"You are a Villager, but appear to the seer as a Werewolf.",value:-1},{name:"Pacifist",description:"You must always vote for players to not be eliminated.",value:-1},{name:"Doppelgänger",description:"The first night, choose a player. When that player is eliminated you become that role.",value:-2},{name:"Mad Bomber",description:"If you are eliminated, the players immediately to your left and right are eliminated as well.",value:-2},{name:"Cupid",description:"The first night, choose two players to be linked together. If one of them is eliminated, the other is eliminated as well.",value:-3},{name:"Troublemaker",description:"One night per game, stir up trouble by calling for players to be eliminated the following day.",value:-3}],ke=[{name:"Cult Leader",description:"Each night, choose a player to join your cult. If all alive players are in your cult, you win.",value:1},{name:"Hoodlum",description:"Choose 2 players on the first night. To win, they must be eliminated and you must still be in the game at the end of the game.",value:0},{name:"Tanner",description:"You hate your job and your life. You win if you are eliminated.",value:-2},{name:"Cursed",description:"You are on the Village team unless you are targeted for elimination by the Werewolves, at which time you become a Werewolf.",value:-3},{name:"Vampire",description:"Each night, choose a player. That player is eliminated when a player gets accused and 2nd-ed the next day.",value:-7,count:8}],ze=[{name:"Alpha Wolf",description:"Once per game, following the elimination of a werewolf during the day, you may turn the Werewolves' target into a Werewolf instead of eliminating them.",value:-9},{name:"Wolf Cub",description:"Each night, wake with the Werewolves. If you are eliminated, the Werewolves eliminate two players the following night.",value:-8},{name:"Werewolf",description:"Each night, wake with the other Werewolves and choose a player to eliminate.",value:-6,count:12},{name:"Minion",description:"You know who the Werewolves are, but you do not wake up with them at night.",value:-6},{name:"Lone Wolf",description:"Each night, wake with the other Werewolves. You only win if you are the last player in the game.",value:-5},{name:"Sorceress",description:"Each night, look for the Seer. You are on the werewolf team.",value:-3}],Pe=ie(o.jsx("path",{d:"M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"}),"Star"),Oe=ie(o.jsx("path",{d:"M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z"}),"StarBorder");function Be(t){return xe("MuiRating",t)}const $e=be("MuiRating",["root","sizeSmall","sizeMedium","sizeLarge","readOnly","disabled","focusVisible","visuallyHidden","pristine","label","labelEmptyValueActive","icon","iconEmpty","iconFilled","iconHover","iconFocus","iconActive","decimal"]),N=$e,Ye=["value"],Ne=["className","defaultValue","disabled","emptyIcon","emptyLabelText","getLabelText","highlightSelectedOnly","icon","IconContainerComponent","max","name","onChange","onChangeActive","onMouseLeave","onMouseMove","precision","readOnly","size","value"];function _e(t,e,a){return t<e?e:t>a?a:t}function De(t){const e=t.toString().split(".")[1];return e?e.length:0}function J(t,e){if(t==null)return t;const a=Math.round(t/e)*e;return Number(a.toFixed(De(e)))}const Ue=t=>{const{classes:e,size:a,readOnly:s,disabled:f,emptyValueFocused:y,focusVisible:m}=t,p={root:["root",`size${ae(a)}`,f&&"disabled",m&&"focusVisible",s&&"readOnly"],label:["label","pristine"],labelEmptyValue:[y&&"labelEmptyValueActive"],icon:["icon"],iconEmpty:["iconEmpty"],iconFilled:["iconFilled"],iconHover:["iconHover"],iconFocus:["iconFocus"],iconActive:["iconActive"],decimal:["decimal"],visuallyHidden:["visuallyHidden"]};return Fe(p,Be,e)},Ge=G("span",{name:"MuiRating",slot:"Root",overridesResolver:(t,e)=>{const{ownerState:a}=t;return[{[`& .${N.visuallyHidden}`]:e.visuallyHidden},e.root,e[`size${ae(a.size)}`],a.readOnly&&e.readOnly]}})(({theme:t,ownerState:e})=>h({display:"inline-flex",position:"relative",fontSize:t.typography.pxToRem(24),color:"#faaf00",cursor:"pointer",textAlign:"left",WebkitTapHighlightColor:"transparent",[`&.${N.disabled}`]:{opacity:(t.vars||t).palette.action.disabledOpacity,pointerEvents:"none"},[`&.${N.focusVisible} .${N.iconActive}`]:{outline:"1px solid #999"},[`& .${N.visuallyHidden}`]:Te},e.size==="small"&&{fontSize:t.typography.pxToRem(18)},e.size==="large"&&{fontSize:t.typography.pxToRem(30)},e.readOnly&&{pointerEvents:"none"})),se=G("label",{name:"MuiRating",slot:"Label",overridesResolver:({ownerState:t},e)=>[e.label,t.emptyValueFocused&&e.labelEmptyValueActive]})(({ownerState:t})=>h({cursor:"inherit"},t.emptyValueFocused&&{top:0,bottom:0,position:"absolute",outline:"1px solid #999",width:"100%"})),Xe=G("span",{name:"MuiRating",slot:"Icon",overridesResolver:(t,e)=>{const{ownerState:a}=t;return[e.icon,a.iconEmpty&&e.iconEmpty,a.iconFilled&&e.iconFilled,a.iconHover&&e.iconHover,a.iconFocus&&e.iconFocus,a.iconActive&&e.iconActive]}})(({theme:t,ownerState:e})=>h({display:"flex",transition:t.transitions.create("transform",{duration:t.transitions.duration.shortest}),pointerEvents:"none"},e.iconActive&&{transform:"scale(1.2)"},e.iconEmpty&&{color:(t.vars||t).palette.action.disabled})),Ke=G("span",{name:"MuiRating",slot:"Decimal",shouldForwardProp:t=>Ce(t)&&t!=="iconActive",overridesResolver:(t,e)=>{const{iconActive:a}=t;return[e.decimal,a&&e.iconActive]}})(({iconActive:t})=>h({position:"relative"},t&&{transform:"scale(1.2)"}));function qe(t){const e=ne(t,Ye);return o.jsx("span",h({},e))}function oe(t){const{classes:e,disabled:a,emptyIcon:s,focus:f,getLabelText:y,highlightSelectedOnly:m,hover:p,icon:v,IconContainerComponent:V,isActive:w,itemValue:d,labelProps:M,name:b,onBlur:A,onChange:F,onClick:S,onFocus:I,readOnly:u,ownerState:n,ratingValue:r,ratingValueRounded:O}=t,R=m?d===r:d<=r,T=d<=p,L=d<=f,X=d===O,B=le(),E=o.jsx(Xe,{as:V,value:d,className:U(e.icon,R?e.iconFilled:e.iconEmpty,T&&e.iconHover,L&&e.iconFocus,w&&e.iconActive),ownerState:h({},n,{iconEmpty:!R,iconFilled:R,iconHover:T,iconFocus:L,iconActive:w}),children:s&&!R?s:v});return u?o.jsx("span",h({},M,{children:E})):o.jsxs(c.Fragment,{children:[o.jsxs(se,h({ownerState:h({},n,{emptyValueFocused:void 0}),htmlFor:B},M,{children:[E,o.jsx("span",{className:e.visuallyHidden,children:y(d)})]})),o.jsx("input",{className:e.visuallyHidden,onFocus:I,onBlur:A,onChange:F,onClick:S,disabled:a,value:d,id:B,type:"radio",name:b,checked:X})]})}const Je=o.jsx(Pe,{fontSize:"inherit"}),Qe=o.jsx(Oe,{fontSize:"inherit"});function Ze(t){return`${t} Star${t!==1?"s":""}`}const et=c.forwardRef(function(e,a){const s=Ve({name:"MuiRating",props:e}),{className:f,defaultValue:y=null,disabled:m=!1,emptyIcon:p=Qe,emptyLabelText:v="Empty",getLabelText:V=Ze,highlightSelectedOnly:w=!1,icon:d=Je,IconContainerComponent:M=qe,max:b=5,name:A,onChange:F,onChangeActive:S,onMouseLeave:I,onMouseMove:u,precision:n=1,readOnly:r=!1,size:O="medium",value:R}=s,T=ne(s,Ne),L=le(A),[X,B]=Ae({controlled:R,default:y,name:"Rating"}),E=J(X,n),re=Ee(),[{hover:x,focus:_},$]=c.useState({hover:-1,focus:-1});let H=E;x!==-1&&(H=x),_!==-1&&(H=_);const{isFocusVisibleRef:Q,onBlur:ce,onFocus:ue,ref:de}=We(),[he,K]=c.useState(!1),Z=c.useRef(),me=Ie(de,Z,a),pe=i=>{u&&u(i);const l=Z.current,{right:g,left:D}=l.getBoundingClientRect(),{width:k}=l.firstChild.getBoundingClientRect();let z;re.direction==="rtl"?z=(g-i.clientX)/(k*b):z=(i.clientX-D)/(k*b);let C=J(b*z+n/2,n);C=_e(C,n,b),$(W=>W.hover===C&&W.focus===C?W:{hover:C,focus:C}),K(!1),S&&x!==C&&S(i,C)},ye=i=>{I&&I(i);const l=-1;$({hover:l,focus:l}),S&&x!==l&&S(i,l)},ee=i=>{let l=i.target.value===""?null:parseFloat(i.target.value);x!==-1&&(l=x),B(l),F&&F(i,l)},ge=i=>{i.clientX===0&&i.clientY===0||($({hover:-1,focus:-1}),B(null),F&&parseFloat(i.target.value)===E&&F(i,null))},fe=i=>{ue(i),Q.current===!0&&K(!0);const l=parseFloat(i.target.value);$(g=>({hover:g.hover,focus:l}))},ve=i=>{if(x!==-1)return;ce(i),Q.current===!1&&K(!1);const l=-1;$(g=>({hover:g.hover,focus:l}))},[we,te]=c.useState(!1),Y=h({},s,{defaultValue:y,disabled:m,emptyIcon:p,emptyLabelText:v,emptyValueFocused:we,focusVisible:he,getLabelText:V,icon:d,IconContainerComponent:M,max:b,precision:n,readOnly:r,size:O}),j=Ue(Y);return o.jsxs(Ge,h({ref:me,onMouseMove:pe,onMouseLeave:ye,className:U(j.root,f,r&&"MuiRating-readOnly"),ownerState:Y,role:r?"img":null,"aria-label":r?V(H):null},T,{children:[Array.from(new Array(b)).map((i,l)=>{const g=l+1,D={classes:j,disabled:m,emptyIcon:p,focus:_,getLabelText:V,highlightSelectedOnly:w,hover:x,icon:d,IconContainerComponent:M,name:L,onBlur:ve,onChange:ee,onClick:ge,onFocus:fe,ratingValue:H,ratingValueRounded:E,readOnly:r,ownerState:Y},k=g===Math.ceil(H)&&(x!==-1||_!==-1);if(n<1){const z=Array.from(new Array(1/n));return o.jsx(Ke,{className:U(j.decimal,k&&j.iconActive),ownerState:Y,iconActive:k,children:z.map((C,W)=>{const q=J(g-1+(W+1)*n,n);return o.jsx(oe,h({},D,{isActive:!1,itemValue:q,labelProps:{style:z.length-1===W?{}:{width:q===H?`${(W+1)*n*100}%`:"0%",overflow:"hidden",position:"absolute"}}}),q)})},g)}return o.jsx(oe,h({},D,{isActive:k,itemValue:g}),g)}),!r&&!m&&o.jsxs(se,{className:U(j.label,j.labelEmptyValue),ownerState:Y,children:[o.jsx("input",{className:j.visuallyHidden,value:"",id:`${L}-empty`,type:"radio",name:L,checked:E==null,onFocus:()=>te(!0),onBlur:()=>te(!1),onChange:ee}),o.jsx("span",{className:j.visuallyHidden,children:v})]})]}))}),tt=et,ot={display:"flex",justifyContent:"space-between",alignItems:"center",width:"100%",marginLeft:10,marginRight:10},at=c.memo(t=>{const{expanded:e,expandedKey:a,handleChange:s,handleStar:f,name:y,description:m,value:p,count:v}=t;return o.jsxs(Se,{expanded:e===a,onChange:s(a),children:[o.jsxs(Re,{expandIcon:o.jsx(je,{}),children:[o.jsx(tt,{max:v||1,sx:{flexWrap:"wrap",minWidth:Math.min(24*(v||1),24*8)},onChange:(V,w)=>f(w?p:-p,w||0,y)}),o.jsxs("div",{style:ot,children:[o.jsx(P,{children:y}),o.jsxs(P,{children:["Cost: ",p]})]})]}),o.jsx(Me,{children:m})]})}),nt=c.memo(()=>{const[t,e]=c.useState(""),[a,s]=c.useState(void 0),[f,y]=c.useState(0),[m,p]=c.useState(0),[v,V]=c.useState(0),[w,d]=c.useState(0),M=c.useCallback(u=>(n,r)=>{e(r?u:"")},[e]),b=(u,n,r)=>{switch(r){case"Mason":s((a||0)+u*(n?n-f:f)),y(n);return;case"Villager":s((a||0)+u*(n?n-m:m)),p(n);return;case"Vampire":s((a||0)+u*(n?n-v:v)),V(n);return;case"Werewolf":s((a||0)+u*(n?n-w:w)),d(n);return;default:s((a||0)+u)}},A=(u,n)=>{const{name:r,description:O,value:R,count:T}=u;return o.jsx(at,{expanded:t,name:r,description:O,value:R,count:T,expandedKey:`${n}`,handleChange:M,handleStar:b},n)},F=He.map(A),S=ke.map(A),I=ze.map(A);return o.jsxs(o.Fragment,{children:[o.jsx(P,{variant:"h2",component:"h1",gutterBottom:!0,children:"Werewolf"}),a!==void 0&&o.jsx(Le,{label:`Total: ${a}`,color:"primary",sx:{position:"fixed",bottom:15,right:15,zIndex:1}}),o.jsx("hr",{}),o.jsx(P,{variant:"h3",component:"h2",gutterBottom:!0,children:"Villagers"}),F,o.jsx("hr",{}),o.jsx(P,{variant:"h3",component:"h2",gutterBottom:!0,children:"Outsiders"}),S,o.jsx("hr",{}),o.jsx(P,{variant:"h3",component:"h2",gutterBottom:!0,children:"Wolves"}),I]})}),dt=nt;export{dt as default};
//# sourceMappingURL=index-16259f7e.js.map