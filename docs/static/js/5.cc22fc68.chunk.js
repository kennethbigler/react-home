(this["webpackJsonpreact-home"]=this["webpackJsonpreact-home"]||[]).push([[5],{154:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r={50:"#ffebee",100:"#ffcdd2",200:"#ef9a9a",300:"#e57373",400:"#ef5350",500:"#f44336",600:"#e53935",700:"#d32f2f",800:"#c62828",900:"#b71c1c",A100:"#ff8a80",A200:"#ff5252",A400:"#ff1744",A700:"#d50000"};t.default=r},176:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r={50:"#e8f5e9",100:"#c8e6c9",200:"#a5d6a7",300:"#81c784",400:"#66bb6a",500:"#4caf50",600:"#43a047",700:"#388e3c",800:"#2e7d32",900:"#1b5e20",A100:"#b9f6ca",A200:"#69f0ae",A400:"#00e676",A700:"#00c853"};t.default=r},294:function(e,t,a){"use strict";var r=a(2),n=a(8),o=a(0),i=(a(15),a(50)),c=a(669),l=a(30),u=o.forwardRef((function(e,t){var a=e.classes,l=e.className,u=e.raised,s=void 0!==u&&u,d=Object(n.a)(e,["classes","className","raised"]);return o.createElement(c.a,Object(r.a)({className:Object(i.a)(a.root,l),elevation:s?8:1,ref:t},d))}));t.a=Object(l.a)({root:{overflow:"hidden"}},{name:"MuiCard"})(u)},429:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r={50:"#f3e5f5",100:"#e1bee7",200:"#ce93d8",300:"#ba68c8",400:"#ab47bc",500:"#9c27b0",600:"#8e24aa",700:"#7b1fa2",800:"#6a1b9a",900:"#4a148c",A100:"#ea80fc",A200:"#e040fb",A400:"#d500f9",A700:"#aa00ff"};t.default=r},743:function(e,t,a){"use strict";var r=a(36),n=a(62),o=a(8),i=a(2),c=a(0),l=(a(15),a(50)),u=a(30),s=a(169),d=a(31),v=a(255),f=a(170),b=a(174),m=a(156),p=a(59),h=a(209);var g=Object(u.a)((function(e){return{thumb:{"&$open":{"& $offset":{transform:"scale(1) translateY(-10px)"}}},open:{},offset:Object(i.a)({zIndex:1},e.typography.body2,{fontSize:e.typography.pxToRem(12),lineHeight:1.2,transition:e.transitions.create(["transform"],{duration:e.transitions.duration.shortest}),top:-34,transformOrigin:"bottom center",transform:"scale(0)",position:"absolute"}),circle:{display:"flex",alignItems:"center",justifyContent:"center",width:32,height:32,borderRadius:"50% 50% 50% 0",backgroundColor:"currentColor",transform:"rotate(-45deg)"},label:{color:e.palette.primary.contrastText,transform:"rotate(45deg)"}}}),{name:"PrivateValueLabel"})((function(e){var t=e.children,a=e.classes,r=e.className,n=e.open,o=e.value,i=e.valueLabelDisplay;return"off"===i?t:c.cloneElement(t,{className:Object(l.a)(t.props.className,(n||"on"===i)&&a.open,a.thumb)},c.createElement("span",{className:Object(l.a)(a.offset,r)},c.createElement("span",{className:a.circle},c.createElement("span",{className:a.label},o))))}));function x(e,t){return e-t}function y(e,t,a){return Math.min(Math.max(t,e),a)}function O(e,t){return e.reduce((function(e,a,r){var n=Math.abs(t-a);return null===e||n<e.distance||n===e.distance?{distance:n,index:r}:e}),null).index}function j(e,t){if(void 0!==t.current&&e.changedTouches){for(var a=0;a<e.changedTouches.length;a+=1){var r=e.changedTouches[a];if(r.identifier===t.current)return{x:r.clientX,y:r.clientY}}return!1}return{x:e.clientX,y:e.clientY}}function w(e,t,a){return 100*(e-t)/(a-t)}function k(e,t,a){var r=Math.round((e-a)/t)*t+a;return Number(r.toFixed(function(e){if(Math.abs(e)<1){var t=e.toExponential().split("e-"),a=t[0].split(".")[1];return(a?a.length:0)+parseInt(t[1],10)}var r=e.toString().split(".")[1];return r?r.length:0}(t)))}function A(e){var t=e.values,a=e.source,r=e.newValue,n=e.index;if(t[n]===r)return a;var o=t.slice();return o[n]=r,o}function L(e){var t=e.sliderRef,a=e.activeIndex,r=e.setActive;t.current.contains(document.activeElement)&&Number(document.activeElement.getAttribute("data-index"))===a||t.current.querySelector('[role="slider"][data-index="'.concat(a,'"]')).focus(),r&&r(a)}var E={horizontal:{offset:function(e){return{left:"".concat(e,"%")}},leap:function(e){return{width:"".concat(e,"%")}}},"horizontal-reverse":{offset:function(e){return{right:"".concat(e,"%")}},leap:function(e){return{width:"".concat(e,"%")}}},vertical:{offset:function(e){return{bottom:"".concat(e,"%")}},leap:function(e){return{height:"".concat(e,"%")}}}},C=function(e){return e},N=c.forwardRef((function(e,t){var a=e["aria-label"],u=e["aria-labelledby"],d=e["aria-valuetext"],N=e.classes,R=e.className,V=e.color,$=void 0===V?"primary":V,S=e.component,I=void 0===S?"span":S,M=e.defaultValue,T=e.disabled,D=void 0!==T&&T,F=e.getAriaLabel,P=e.getAriaValueText,z=e.marks,B=void 0!==z&&z,_=e.max,Y=void 0===_?100:_,H=e.min,X=void 0===H?0:H,J=e.name,U=e.onChange,q=e.onChangeCommitted,K=e.onMouseDown,W=e.orientation,G=void 0===W?"horizontal":W,Q=e.scale,Z=void 0===Q?C:Q,ee=e.step,te=void 0===ee?1:ee,ae=e.ThumbComponent,re=void 0===ae?"span":ae,ne=e.track,oe=void 0===ne?"normal":ne,ie=e.value,ce=e.ValueLabelComponent,le=void 0===ce?g:ce,ue=e.valueLabelDisplay,se=void 0===ue?"off":ue,de=e.valueLabelFormat,ve=void 0===de?C:de,fe=Object(o.a)(e,["aria-label","aria-labelledby","aria-valuetext","classes","className","color","component","defaultValue","disabled","getAriaLabel","getAriaValueText","marks","max","min","name","onChange","onChangeCommitted","onMouseDown","orientation","scale","step","ThumbComponent","track","value","ValueLabelComponent","valueLabelDisplay","valueLabelFormat"]),be=Object(s.a)(),me=c.useRef(),pe=c.useState(-1),he=pe[0],ge=pe[1],xe=c.useState(-1),ye=xe[0],Oe=xe[1],je=Object(h.a)({controlled:ie,default:M,name:"Slider"}),we=Object(n.a)(je,2),ke=we[0],Ae=we[1],Le=Array.isArray(ke),Ee=Le?ke.slice().sort(x):[ke];Ee=Ee.map((function(e){return y(e,X,Y)}));var Ce=!0===B&&null!==te?Object(r.a)(Array(Math.floor((Y-X)/te)+1)).map((function(e,t){return{value:X+te*t}})):B||[],Ne=Object(v.a)(),Re=Ne.isFocusVisible,Ve=Ne.onBlurVisible,$e=Ne.ref,Se=c.useState(-1),Ie=Se[0],Me=Se[1],Te=c.useRef(),De=Object(m.a)($e,Te),Fe=Object(m.a)(t,De),Pe=Object(b.a)((function(e){var t=Number(e.currentTarget.getAttribute("data-index"));Re(e)&&Me(t),Oe(t)})),ze=Object(b.a)((function(){-1!==Ie&&(Me(-1),Ve()),Oe(-1)})),Be=Object(b.a)((function(e){var t=Number(e.currentTarget.getAttribute("data-index"));Oe(t)})),_e=Object(b.a)((function(){Oe(-1)})),Ye="rtl"===be.direction,He=Object(b.a)((function(e){var t,a=Number(e.currentTarget.getAttribute("data-index")),r=Ee[a],n=(Y-X)/10,o=Ce.map((function(e){return e.value})),i=o.indexOf(r),c=Ye?"ArrowLeft":"ArrowRight",l=Ye?"ArrowRight":"ArrowLeft";switch(e.key){case"Home":t=X;break;case"End":t=Y;break;case"PageUp":te&&(t=r+n);break;case"PageDown":te&&(t=r-n);break;case c:case"ArrowUp":t=te?r+te:o[i+1]||o[o.length-1];break;case l:case"ArrowDown":t=te?r-te:o[i-1]||o[0];break;default:return}if(e.preventDefault(),te&&(t=k(t,te,X)),t=y(t,X,Y),Le){var u=t;t=A({values:Ee,source:ke,newValue:t,index:a}).sort(x),L({sliderRef:Te,activeIndex:t.indexOf(u)})}Ae(t),Me(a),U&&U(e,t),q&&q(e,t)})),Xe=c.useRef(),Je=G;Ye&&"vertical"!==G&&(Je+="-reverse");var Ue=function(e){var t,a,r=e.finger,n=e.move,o=void 0!==n&&n,i=e.values,c=e.source,l=Te.current.getBoundingClientRect(),u=l.width,s=l.height,d=l.bottom,v=l.left;if(t=0===Je.indexOf("vertical")?(d-r.y)/s:(r.x-v)/u,-1!==Je.indexOf("-reverse")&&(t=1-t),a=function(e,t,a){return(a-t)*e+t}(t,X,Y),te)a=k(a,te,X);else{var f=Ce.map((function(e){return e.value}));a=f[O(f,a)]}a=y(a,X,Y);var b=0;if(Le){var m=a;b=(a=A({values:i,source:c,newValue:a,index:b=o?Xe.current:O(i,a)}).sort(x)).indexOf(m),Xe.current=b}return{newValue:a,activeIndex:b}},qe=Object(b.a)((function(e){var t=j(e,me);if(t){var a=Ue({finger:t,move:!0,values:Ee,source:ke}),r=a.newValue,n=a.activeIndex;L({sliderRef:Te,activeIndex:n,setActive:ge}),Ae(r),U&&U(e,r)}})),Ke=Object(b.a)((function(e){var t=j(e,me);if(t){var a=Ue({finger:t,values:Ee,source:ke}).newValue;ge(-1),"touchend"===e.type&&Oe(-1),q&&q(e,a),me.current=void 0;var r=Object(f.a)(Te.current);r.removeEventListener("mousemove",qe),r.removeEventListener("mouseup",Ke),r.removeEventListener("touchmove",qe),r.removeEventListener("touchend",Ke)}})),We=Object(b.a)((function(e){e.preventDefault();var t=e.changedTouches[0];null!=t&&(me.current=t.identifier);var a=j(e,me),r=Ue({finger:a,values:Ee,source:ke}),n=r.newValue,o=r.activeIndex;L({sliderRef:Te,activeIndex:o,setActive:ge}),Ae(n),U&&U(e,n);var i=Object(f.a)(Te.current);i.addEventListener("touchmove",qe),i.addEventListener("touchend",Ke)}));c.useEffect((function(){var e=Te.current;e.addEventListener("touchstart",We);var t=Object(f.a)(e);return function(){e.removeEventListener("touchstart",We),t.removeEventListener("mousemove",qe),t.removeEventListener("mouseup",Ke),t.removeEventListener("touchmove",qe),t.removeEventListener("touchend",Ke)}}),[Ke,qe,We]);var Ge=Object(b.a)((function(e){K&&K(e),e.preventDefault();var t=j(e,me),a=Ue({finger:t,values:Ee,source:ke}),r=a.newValue,n=a.activeIndex;L({sliderRef:Te,activeIndex:n,setActive:ge}),Ae(r),U&&U(e,r);var o=Object(f.a)(Te.current);o.addEventListener("mousemove",qe),o.addEventListener("mouseup",Ke)})),Qe=w(Le?Ee[0]:X,X,Y),Ze=w(Ee[Ee.length-1],X,Y)-Qe,et=Object(i.a)({},E[Je].offset(Qe),E[Je].leap(Ze));return c.createElement(I,Object(i.a)({ref:Fe,className:Object(l.a)(N.root,N["color".concat(Object(p.a)($))],R,D&&N.disabled,Ce.length>0&&Ce.some((function(e){return e.label}))&&N.marked,!1===oe&&N.trackFalse,"vertical"===G&&N.vertical,"inverted"===oe&&N.trackInverted),onMouseDown:Ge},fe),c.createElement("span",{className:N.rail}),c.createElement("span",{className:N.track,style:et}),c.createElement("input",{value:Ee.join(","),name:J,type:"hidden"}),Ce.map((function(e,t){var a,r=w(e.value,X,Y),n=E[Je].offset(r);return a=!1===oe?-1!==Ee.indexOf(e.value):"normal"===oe&&(Le?e.value>=Ee[0]&&e.value<=Ee[Ee.length-1]:e.value<=Ee[0])||"inverted"===oe&&(Le?e.value<=Ee[0]||e.value>=Ee[Ee.length-1]:e.value>=Ee[0]),c.createElement(c.Fragment,{key:e.value},c.createElement("span",{style:n,"data-index":t,className:Object(l.a)(N.mark,a&&N.markActive)}),null!=e.label?c.createElement("span",{"aria-hidden":!0,"data-index":t,style:n,className:Object(l.a)(N.markLabel,a&&N.markLabelActive)},e.label):null)})),Ee.map((function(e,t){var r=w(e,X,Y),n=E[Je].offset(r);return c.createElement(le,{key:t,valueLabelFormat:ve,valueLabelDisplay:se,className:N.valueLabel,value:"function"===typeof ve?ve(Z(e),t):ve,index:t,open:ye===t||he===t||"on"===se,disabled:D},c.createElement(re,{className:Object(l.a)(N.thumb,N["thumbColor".concat(Object(p.a)($))],he===t&&N.active,D&&N.disabled,Ie===t&&N.focusVisible),tabIndex:D?null:0,role:"slider",style:n,"data-index":t,"aria-label":F?F(t):a,"aria-labelledby":u,"aria-orientation":G,"aria-valuemax":Z(Y),"aria-valuemin":Z(X),"aria-valuenow":Z(e),"aria-valuetext":P?P(Z(e),t):d,onKeyDown:He,onFocus:Pe,onBlur:ze,onMouseOver:Be,onMouseLeave:_e}))})))}));t.a=Object(u.a)((function(e){return{root:{height:2,width:"100%",boxSizing:"content-box",padding:"13px 0",display:"inline-block",position:"relative",cursor:"pointer",touchAction:"none",color:e.palette.primary.main,WebkitTapHighlightColor:"transparent","&$disabled":{pointerEvents:"none",cursor:"default",color:e.palette.grey[400]},"&$vertical":{width:2,height:"100%",padding:"0 13px"},"@media (pointer: coarse)":{padding:"20px 0","&$vertical":{padding:"0 20px"}},"@media print":{colorAdjust:"exact"}},colorPrimary:{},colorSecondary:{color:e.palette.secondary.main},marked:{marginBottom:20,"&$vertical":{marginBottom:"auto",marginRight:20}},vertical:{},disabled:{},rail:{display:"block",position:"absolute",width:"100%",height:2,borderRadius:1,backgroundColor:"currentColor",opacity:.38,"$vertical &":{height:"100%",width:2}},track:{display:"block",position:"absolute",height:2,borderRadius:1,backgroundColor:"currentColor","$vertical &":{width:2}},trackFalse:{"& $track":{display:"none"}},trackInverted:{"& $track":{backgroundColor:"light"===e.palette.type?Object(d.e)(e.palette.primary.main,.62):Object(d.b)(e.palette.primary.main,.5)},"& $rail":{opacity:1}},thumb:{position:"absolute",width:12,height:12,marginLeft:-6,marginTop:-5,boxSizing:"border-box",borderRadius:"50%",outline:0,backgroundColor:"currentColor",display:"flex",alignItems:"center",justifyContent:"center",transition:e.transitions.create(["box-shadow"],{duration:e.transitions.duration.shortest}),"&::after":{position:"absolute",content:'""',borderRadius:"50%",left:-15,top:-15,right:-15,bottom:-15},"&$focusVisible,&:hover":{boxShadow:"0px 0px 0px 8px ".concat(Object(d.a)(e.palette.primary.main,.16)),"@media (hover: none)":{boxShadow:"none"}},"&$active":{boxShadow:"0px 0px 0px 14px ".concat(Object(d.a)(e.palette.primary.main,.16))},"&$disabled":{width:8,height:8,marginLeft:-4,marginTop:-3,"&:hover":{boxShadow:"none"}},"$vertical &":{marginLeft:-5,marginBottom:-6},"$vertical &$disabled":{marginLeft:-3,marginBottom:-4}},thumbColorPrimary:{},thumbColorSecondary:{"&$focusVisible,&:hover":{boxShadow:"0px 0px 0px 8px ".concat(Object(d.a)(e.palette.secondary.main,.16))},"&$active":{boxShadow:"0px 0px 0px 14px ".concat(Object(d.a)(e.palette.secondary.main,.16))}},active:{},focusVisible:{},valueLabel:{left:"calc(-50% - 4px)"},mark:{position:"absolute",width:2,height:2,borderRadius:1,backgroundColor:"currentColor"},markActive:{backgroundColor:e.palette.background.paper,opacity:.8},markLabel:Object(i.a)({},e.typography.body2,{color:e.palette.text.secondary,position:"absolute",top:26,transform:"translateX(-50%)",whiteSpace:"nowrap","$vertical &":{top:"auto",left:26,transform:"translateY(50%)"},"@media (pointer: coarse)":{top:40,"$vertical &":{left:31}}}),markLabelActive:{color:e.palette.text.primary}}}),{name:"MuiSlider"})(N)}}]);
//# sourceMappingURL=5.cc22fc68.chunk.js.map