import{j as a,e as xe,f as be,s as _,k as ne,m as le,aa as Ce,r as c,h as Se,x as Ve,c as U,i as je,ab as Fe}from"./index-CbE2-d-x.js";import{A as Re,a as Ee,E as We,b as Me}from"./ExpandMore-gjuBphda.js";import{G as X}from"./Grid2-q9ab8bs7.js";import{c as se,s as Ae,g as Ie,i as oe,T as Z}from"./Header-a-rdouAc.js";import{u as re}from"./useId-BlQl985c.js";import{E as K}from"./ExpandableCard-DwXTk9vQ.js";import{C as He}from"./Chip-BoADjStu.js";import"./useThemeProps-BgOmXrQ8.js";import"./isMuiElement-CwrL8J8R.js";import"./Card-BLhBuV7Y.js";import"./CardActionArea-DX2bdbPw.js";import"./CardContent-CpFK0DOq.js";const Te={border:0,clip:"rect(0 0 0 0)",height:"1px",margin:"-1px",overflow:"hidden",padding:0,position:"absolute",whiteSpace:"nowrap",width:"1px"},ze=se(a.jsx("path",{d:"M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"}),"Star"),Le=se(a.jsx("path",{d:"M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z"}),"StarBorder");function ke(t){return be("MuiRating",t)}const $=xe("MuiRating",["root","sizeSmall","sizeMedium","sizeLarge","readOnly","disabled","focusVisible","visuallyHidden","pristine","label","labelEmptyValueActive","icon","iconEmpty","iconFilled","iconHover","iconFocus","iconActive","decimal"]);function Pe(t){const e=t.toString().split(".")[1];return e?e.length:0}function Q(t,e){if(t==null)return t;const o=Math.round(t/e)*e;return Number(o.toFixed(Pe(e)))}const Oe=t=>{const{classes:e,size:o,readOnly:r,disabled:p,emptyValueFocused:v,focusVisible:d}=t,h={root:["root",`size${ne(o)}`,p&&"disabled",d&&"focusVisible",r&&"readOnly"],label:["label","pristine"],labelEmptyValue:[v&&"labelEmptyValueActive"],icon:["icon"],iconEmpty:["iconEmpty"],iconFilled:["iconFilled"],iconHover:["iconHover"],iconFocus:["iconFocus"],iconActive:["iconActive"],decimal:["decimal"],visuallyHidden:["visuallyHidden"]};return je(h,ke,e)},$e=_("span",{name:"MuiRating",slot:"Root",overridesResolver:(t,e)=>{const{ownerState:o}=t;return[{[`& .${$.visuallyHidden}`]:e.visuallyHidden},e.root,e[`size${ne(o.size)}`],o.readOnly&&e.readOnly]}})(le(({theme:t})=>({display:"inline-flex",position:"relative",fontSize:t.typography.pxToRem(24),color:"#faaf00",cursor:"pointer",textAlign:"left",width:"min-content",WebkitTapHighlightColor:"transparent",[`&.${$.disabled}`]:{opacity:(t.vars||t).palette.action.disabledOpacity,pointerEvents:"none"},[`&.${$.focusVisible} .${$.iconActive}`]:{outline:"1px solid #999"},[`& .${$.visuallyHidden}`]:Te,variants:[{props:{size:"small"},style:{fontSize:t.typography.pxToRem(18)}},{props:{size:"large"},style:{fontSize:t.typography.pxToRem(30)}},{props:({ownerState:e})=>e.readOnly,style:{pointerEvents:"none"}}]}))),ce=_("label",{name:"MuiRating",slot:"Label",overridesResolver:({ownerState:t},e)=>[e.label,t.emptyValueFocused&&e.labelEmptyValueActive]})({cursor:"inherit",variants:[{props:({ownerState:t})=>t.emptyValueFocused,style:{top:0,bottom:0,position:"absolute",outline:"1px solid #999",width:"100%"}}]}),Ye=_("span",{name:"MuiRating",slot:"Icon",overridesResolver:(t,e)=>{const{ownerState:o}=t;return[e.icon,o.iconEmpty&&e.iconEmpty,o.iconFilled&&e.iconFilled,o.iconHover&&e.iconHover,o.iconFocus&&e.iconFocus,o.iconActive&&e.iconActive]}})(le(({theme:t})=>({display:"flex",transition:t.transitions.create("transform",{duration:t.transitions.duration.shortest}),pointerEvents:"none",variants:[{props:({ownerState:e})=>e.iconActive,style:{transform:"scale(1.2)"}},{props:({ownerState:e})=>e.iconEmpty,style:{color:(t.vars||t).palette.action.disabled}}]}))),Ne=_("span",{name:"MuiRating",slot:"Decimal",shouldForwardProp:t=>Ce(t)&&t!=="iconActive",overridesResolver:(t,e)=>{const{iconActive:o}=t;return[e.decimal,o&&e.iconActive]}})({position:"relative",variants:[{props:({iconActive:t})=>t,style:{transform:"scale(1.2)"}}]});function Be(t){const{value:e,...o}=t;return a.jsx("span",{...o})}function ie(t){const{classes:e,disabled:o,emptyIcon:r,focus:p,getLabelText:v,highlightSelectedOnly:d,hover:h,icon:S,IconContainerComponent:w,isActive:x,itemValue:m,labelProps:E,name:W,onBlur:g,onChange:z,onClick:V,onFocus:j,readOnly:u,ownerState:i,ratingValue:l,ratingValueRounded:f}=t,F=d?m===l:m<=l,A=m<=h,Y=m<=p,L=m===f,N=`${W}-${re()}`,k=a.jsx(Ye,{as:w,value:m,className:U(e.icon,F?e.iconFilled:e.iconEmpty,A&&e.iconHover,Y&&e.iconFocus,x&&e.iconActive),ownerState:{...i,iconEmpty:!F,iconFilled:F,iconHover:A,iconFocus:Y,iconActive:x},children:r&&!F?r:S});return u?a.jsx("span",{...E,children:k}):a.jsxs(c.Fragment,{children:[a.jsxs(ce,{ownerState:{...i,emptyValueFocused:void 0},htmlFor:N,...E,children:[k,a.jsx("span",{className:e.visuallyHidden,children:v(m)})]}),a.jsx("input",{className:e.visuallyHidden,onFocus:j,onBlur:g,onChange:z,onClick:V,disabled:o,value:m,id:N,type:"radio",name:W,checked:L})]})}const De=a.jsx(ze,{fontSize:"inherit"}),Ge=a.jsx(Le,{fontSize:"inherit"});function Ue(t){return`${t||"0"} Star${t!==1?"s":""}`}const Xe=c.forwardRef(function(e,o){const r=Se({name:"MuiRating",props:e}),{component:p="span",className:v,defaultValue:d=null,disabled:h=!1,emptyIcon:S=Ge,emptyLabelText:w="Empty",getLabelText:x=Ue,highlightSelectedOnly:m=!1,icon:E=De,IconContainerComponent:W=Be,max:g=5,name:z,onChange:V,onChangeActive:j,onMouseLeave:u,onMouseMove:i,precision:l=1,readOnly:f=!1,size:F="medium",value:A,...Y}=r,L=re(z),[N,k]=Ae({controlled:A,default:d,name:"Rating"}),B=Q(N,l),de=Ve(),[{hover:b,focus:D},P]=c.useState({hover:-1,focus:-1});let I=B;b!==-1&&(I=b),D!==-1&&(I=D);const[pe,q]=c.useState(!1),ee=c.useRef(),he=Ie(ee,o),me=n=>{i&&i(n);const s=ee.current,{right:y,left:G,width:H}=s.getBoundingClientRect();let T;de?T=(y-n.clientX)/H:T=(n.clientX-G)/H;let C=Q(g*T+l/2,l);C=Fe(C,l,g),P(M=>M.hover===C&&M.focus===C?M:{hover:C,focus:C}),q(!1),j&&b!==C&&j(n,C)},ye=n=>{u&&u(n);const s=-1;P({hover:s,focus:s}),j&&b!==s&&j(n,s)},te=n=>{let s=n.target.value===""?null:parseFloat(n.target.value);b!==-1&&(s=b),k(s),V&&V(n,s)},ge=n=>{n.clientX===0&&n.clientY===0||(P({hover:-1,focus:-1}),k(null),V&&parseFloat(n.target.value)===B&&V(n,null))},fe=n=>{oe(n.target)&&q(!0);const s=parseFloat(n.target.value);P(y=>({hover:y.hover,focus:s}))},ve=n=>{if(b!==-1)return;oe(n.target)||q(!1);const s=-1;P(y=>({hover:y.hover,focus:s}))},[we,ae]=c.useState(!1),O={...r,component:p,defaultValue:d,disabled:h,emptyIcon:S,emptyLabelText:w,emptyValueFocused:we,focusVisible:pe,getLabelText:x,icon:E,IconContainerComponent:W,max:g,precision:l,readOnly:f,size:F},R=Oe(O);return a.jsxs($e,{as:p,ref:he,onMouseMove:me,onMouseLeave:ye,className:U(R.root,v,f&&"MuiRating-readOnly"),ownerState:O,role:f?"img":null,"aria-label":f?x(I):null,...Y,children:[Array.from(new Array(g)).map((n,s)=>{const y=s+1,G={classes:R,disabled:h,emptyIcon:S,focus:D,getLabelText:x,highlightSelectedOnly:m,hover:b,icon:E,IconContainerComponent:W,name:L,onBlur:ve,onChange:te,onClick:ge,onFocus:fe,ratingValue:I,ratingValueRounded:B,readOnly:f,ownerState:O},H=y===Math.ceil(I)&&(b!==-1||D!==-1);if(l<1){const T=Array.from(new Array(1/l));return a.jsx(Ne,{className:U(R.decimal,H&&R.iconActive),ownerState:O,iconActive:H,children:T.map((C,M)=>{const J=Q(y-1+(M+1)*l,l);return a.jsx(ie,{...G,isActive:!1,itemValue:J,labelProps:{style:T.length-1===M?{}:{width:J===I?`${(M+1)*l*100}%`:"0%",overflow:"hidden",position:"absolute"}}},J)})},y)}return a.jsx(ie,{...G,isActive:H,itemValue:y},y)}),!f&&!h&&a.jsxs(ce,{className:U(R.label,R.labelEmptyValue),ownerState:O,children:[a.jsx("input",{className:R.visuallyHidden,value:"",id:`${L}-empty`,type:"radio",name:L,checked:B==null,onFocus:()=>ae(!0),onBlur:()=>ae(!1),onChange:te}),a.jsx("span",{className:R.visuallyHidden,children:w})]})]})}),_e=[{name:"Mystic Seer",description:"Each night, point to a player and learn their exact role.",value:9},{name:"Seer",description:"Each night choose a player to learn if that player is a Villager or a Werewolf.",value:7},{name:"Mentalist",description:"Each night you may point to two players, and are told if those players are on the same team or not.",value:6},{name:"Revealer",description:"Each night you may point to a player. If that player is a Werewolf, that player is eliminated. If that player is not, you are eliminated.",value:4},{name:"Apprentice Seer",description:"If the Seer is eliminated, you become the Seer, waking each night to look for Werewolves.",value:4},{name:"Witch",description:"You may save or eliminate a player at night once each per game.",value:4},{name:"Drunk",description:"You are a Villager until the 3rd night, when you sober up and learn your real role.",value:4},{name:"Bodyguard",description:"Each night, choose a player who cannot be eliminated that night.",value:3},{name:"Prince",description:"If you are voted to be eliminated, your role is revealed and you stay.",value:3},{name:"Diseased",description:"If you are eliminated by Werewolves, they don't get to eliminate anyone the following night.",value:3},{name:"Hunter",description:"If you are eliminated, you may immediately eliminate another player.",value:3},{name:"Huntress",description:"You may eliminate a player at night once per game.",value:3},{name:"Priest",description:"One night per game, choose a player to be protected. That player may not be eliminated at night.",value:3},{name:"P.I.",description:"One night per game, choose a player. You'll be told if that player or one of his neighbors is a Werewolf.",value:3},{name:"Tough Guy",description:"If the Werewolves attempt to eliminate you, you are not eliminated until the following night.",value:3},{name:"Aura Seer",description:"Choose a player each night to see if that player is not a Werewolf or Villager.",value:3},{name:"Ghost",description:"The first night, you are eliminated. Communicate to the players with single letters each day.",value:2},{name:"Mayor",description:"Your vote counts twice.",value:2},{name:"Mason",description:"The first night, wake up to see who the other Mason is.",value:2,count:3},{name:"Village Idiot",description:"You always vote for players to be eliminated.",value:2},{name:"Old Hag",description:"Each night, choose a player to leave the village during the next day.",value:1},{name:"Spellcaster",description:"Each night, choose a player who may not speak the following day.",value:1},{name:"Villager",description:"Find the Werewolves and eliminate them.",value:1,count:14},{name:"Lycan",description:"You are a Villager, but appear to the seer as a Werewolf.",value:-1},{name:"Pacifist",description:"You must always vote for players to not be eliminated.",value:-1},{name:"Doppelgänger",description:"The first night, choose a player. When that player is eliminated you become that role.",value:-2},{name:"Mad Bomber",description:"If you are eliminated, the players immediately to your left and right are eliminated as well.",value:-2},{name:"Cupid",description:"The first night, choose two players to be linked together. If one of them is eliminated, the other is eliminated as well.",value:-3},{name:"Troublemaker",description:"One night per game, stir up trouble by calling for players to be eliminated the following day.",value:-3}],qe=[{name:"Cult Leader",description:"Each night, choose a player to join your cult. If all alive players are in your cult, you win.",value:1},{name:"Hoodlum",description:"Choose 2 players on the first night. To win, they must be eliminated and you must still be in the game at the end of the game.",value:0},{name:"Tanner",description:"You hate your job and your life. You win if you are eliminated.",value:-2},{name:"Cursed",description:"You are on the Village team unless you are targeted for elimination by the Werewolves, at which time you become a Werewolf.",value:-3},{name:"Vampire",description:"Each night, choose a player. That player is eliminated when a player gets accused and 2nd-ed the next day.",value:-7,count:8}],Je=[{name:"Alpha Wolf",description:"Once per game, following the elimination of a werewolf during the day, you may turn the Werewolves' target into a Werewolf instead of eliminating them.",value:-9},{name:"Wolf Cub",description:"Each night, wake with the Werewolves. If you are eliminated, the Werewolves eliminate two players the following night.",value:-8},{name:"Werewolf",description:"Each night, wake with the other Werewolves and choose a player to eliminate.",value:-6,count:12},{name:"Minion",description:"You know who the Werewolves are, but you do not wake up with them at night.",value:-6},{name:"Lone Wolf",description:"Each night, wake with the other Werewolves. You only win if you are the last player in the game.",value:-5},{name:"Sorceress",description:"Each night, look for the Seer. You are on the werewolf team.",value:-3}],Ke={display:"flex",justifyContent:"space-between",alignItems:"center",width:"100%",marginLeft:10,marginRight:10},ue=c.memo(({expanded:t,expandedKey:e,handleChange:o,handleStar:r,name:p,description:v,value:d,count:h})=>a.jsx(X,{size:12,children:a.jsxs(Re,{expanded:t===e,onChange:o(e),children:[a.jsxs(Ee,{expandIcon:a.jsx(We,{}),children:[a.jsx(Xe,{max:h||1,sx:{flexWrap:"wrap",minWidth:Math.min(24*(h||1),24*7)},onChange:(S,w)=>r(w?d:-d,w||0,p)}),a.jsxs("div",{style:Ke,children:[a.jsx(Z,{children:p}),a.jsxs(Z,{children:["Cost: ",d]})]})]}),a.jsx(Me,{children:v})]})}));ue.displayName="WerewolfPanel";const Qe=c.memo(()=>{const[t,e]=c.useState(""),[o,r]=c.useState(void 0),[p,v]=c.useState(0),[d,h]=c.useState(0),[S,w]=c.useState(0),[x,m]=c.useState(0),E=c.useCallback(u=>(i,l)=>{e(l?u:"")},[e]),W=(u,i,l)=>{switch(l){case"Mason":r((o||0)+u*(i?i-p:p)),v(i);return;case"Villager":r((o||0)+u*(i?i-d:d)),h(i);return;case"Vampire":r((o||0)+u*(i?i-S:S)),w(i);return;case"Werewolf":r((o||0)+u*(i?i-x:x)),m(i);return;default:r((o||0)+u)}},g=(u,i)=>{const{name:l,description:f,value:F,count:A}=u;return a.jsx(ue,{expanded:t,name:l,description:f,value:F,count:A,expandedKey:`${l}-${i}`,handleChange:E,handleStar:W},i)},z=_e.map(g),V=qe.map(g),j=Je.map(g);return a.jsxs(a.Fragment,{children:[a.jsx(Z,{variant:"h2",component:"h1",gutterBottom:!0,children:"Werewolf"}),o!==void 0&&a.jsx(He,{label:`Total: ${o}`,color:"primary",sx:{position:"fixed",bottom:15,right:15,zIndex:1}}),a.jsxs(X,{container:!0,spacing:2,children:[a.jsx(X,{size:{xs:12,xl:6},children:a.jsx(K,{title:"Villagers",children:z})}),a.jsxs(X,{size:{xs:12,xl:6},children:[a.jsx(K,{title:"Outsiders",children:V}),a.jsx(K,{title:"Wolves",children:j})]})]})]})});Qe.displayName="Werewolf";export{Qe as default};
//# sourceMappingURL=index-BTgx-Onl.js.map