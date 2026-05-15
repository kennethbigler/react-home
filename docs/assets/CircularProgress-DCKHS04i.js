import{n as e}from"./rolldown-runtime-jpDsebLB.js";import{C as t,w as n,x as r,z as i}from"./react-vendor-DGyxU0xz.js";import{C as a,S as o,a as s,m as c,n as l,o as u,r as d,t as f,x as p}from"./createSimplePaletteValueFilter-irnv2qUH.js";var m=e(i(),1);function h(e){return o(`MuiCircularProgress`,e)}p(`MuiCircularProgress`,[`root`,`determinate`,`indeterminate`,`colorPrimary`,`colorSecondary`,`svg`,`track`,`circle`,`circleDisableShrink`]);var g=r(),_=44,v=n`
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
`,y=n`
  0% {
    stroke-dasharray: 1px, 200px;
    stroke-dashoffset: 0;
  }

  50% {
    stroke-dasharray: 100px, 200px;
    stroke-dashoffset: -15px;
  }

  100% {
    stroke-dasharray: 1px, 200px;
    stroke-dashoffset: -126px;
  }
`,b=typeof v==`string`?null:t`
        animation: ${v} 1.4s linear infinite;
      `,x=typeof y==`string`?null:t`
        animation: ${y} 1.4s ease-in-out infinite;
      `,S=e=>{let{classes:t,variant:n,color:r,disableShrink:i}=e;return c({root:[`root`,n,`color${s(r)}`],svg:[`svg`],track:[`track`],circle:[`circle`,i&&`circleDisableShrink`]},h,t)},C=u(`span`,{name:`MuiCircularProgress`,slot:`Root`,overridesResolver:(e,t)=>{let{ownerState:n}=e;return[t.root,t[n.variant],t[`color${s(n.color)}`]]}})(d(({theme:e})=>({display:`inline-block`,variants:[{props:{variant:`determinate`},style:{transition:e.transitions.create(`transform`)}},{props:{variant:`indeterminate`},style:b||{animation:`${v} 1.4s linear infinite`}},...Object.entries(e.palette).filter(f()).map(([t])=>({props:{color:t},style:{color:(e.vars||e).palette[t].main}}))]}))),w=u(`svg`,{name:`MuiCircularProgress`,slot:`Svg`})({display:`block`}),T=u(`circle`,{name:`MuiCircularProgress`,slot:`Circle`,overridesResolver:(e,t)=>{let{ownerState:n}=e;return[t.circle,n.disableShrink&&t.circleDisableShrink]}})(d(({theme:e})=>({stroke:`currentColor`,variants:[{props:{variant:`determinate`},style:{transition:e.transitions.create(`stroke-dashoffset`)}},{props:{variant:`indeterminate`},style:{strokeDasharray:`80px, 200px`,strokeDashoffset:0}},{props:({ownerState:e})=>e.variant===`indeterminate`&&!e.disableShrink,style:x||{animation:`${y} 1.4s ease-in-out infinite`}}]}))),E=u(`circle`,{name:`MuiCircularProgress`,slot:`Track`})(d(({theme:e})=>({stroke:`currentColor`,opacity:(e.vars||e).palette.action.activatedOpacity}))),D=m.forwardRef(function(e,t){let n=l({props:e,name:`MuiCircularProgress`}),{className:r,color:i=`primary`,disableShrink:o=!1,enableTrackSlot:s=!1,min:c,max:u,size:d=40,style:f,thickness:p=3.6,value:m=n.min??0,variant:h=`indeterminate`,...v}=n,y=c??0,b=u??100,x={...n,color:i,disableShrink:o,size:d,thickness:p,value:m,variant:h,enableTrackSlot:s},D=S(x),O={},k={},A={};if(h===`determinate`){let e=2*Math.PI*((_-p)/2),t=b-y;O.strokeDasharray=e.toFixed(3),O.strokeDashoffset=t>0?`${((b-m)/t*e).toFixed(3)}px`:`${e.toFixed(3)}px`,k.transform=`rotate(-90deg)`,A[`aria-valuenow`]=m,A[`aria-valuemin`]=y,A[`aria-valuemax`]=b}return(0,g.jsx)(C,{className:a(D.root,r),style:{width:d,height:d,...k,...f},ownerState:x,ref:t,role:`progressbar`,...A,...v,children:(0,g.jsxs)(w,{className:D.svg,ownerState:x,viewBox:`${_/2} ${_/2} ${_} ${_}`,children:[s?(0,g.jsx)(E,{className:D.track,ownerState:x,cx:_,cy:_,r:(_-p)/2,fill:`none`,strokeWidth:p,"aria-hidden":`true`}):null,(0,g.jsx)(T,{className:D.circle,style:O,ownerState:x,cx:_,cy:_,r:(_-p)/2,fill:`none`,strokeWidth:p})]})})});export{D as t};
//# sourceMappingURL=CircularProgress-DCKHS04i.js.map