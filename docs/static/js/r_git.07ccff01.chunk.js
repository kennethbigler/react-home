"use strict";(self.webpackChunkreact_home=self.webpackChunkreact_home||[]).push([[561],{83834:function(e,n,t){t.d(n,{Z:function(){return Z}});var a=t(1413),i=t(29439),r=t(72791),s=t(57621),c=t(9585),o=t(39504),l=t(56125),h=t(20890),u=t(61889),m=t(13967),d=t(5519),x=t(14143),g=t(80184),f={marginTop:40,overflow:"visible"},p={borderRadius:3,marginLeft:15,marginRight:15,position:"relative",top:-20},Z=function(e){var n=(0,x.Z)(!0),t=(0,i.Z)(n,2),Z=t[0],C=t[1],j=(0,m.Z)().palette,b=e.title,y=e.subtitle,v=e.children,k=e.backgroundColor,P=e.inverted,T=void 0!==P&&P,S=(0,a.Z)((0,a.Z)({},p),{},{backgroundColor:k||j.primary.main});"dark"!==j.mode?S.boxShadow="0px 15px 15px -10px ".concat(d.Z[400]):delete S.boxShadow;var D=(0,a.Z)((0,a.Z)({},S),{},{marginBottom:-20}),M=r.useMemo((function(){return{color:T?"black":"white"}}),[T]),I=r.useMemo((function(){return{color:d.Z[T?800:300]}}),[T]),B=(0,g.jsx)(h.Z,{style:M,variant:"h6",children:b}),w=Z?(0,g.jsx)(h.Z,{style:I,children:y}):null;return(0,g.jsxs)(s.Z,{style:f,children:[(0,g.jsx)(c.Z,{onClick:C,style:Z?D:S,subheader:w,title:B}),(0,g.jsx)(l.Z,{in:Z,timeout:"auto",unmountOnExit:!0,children:(0,g.jsx)(o.Z,{children:(0,g.jsx)(u.ZP,{container:!0,spacing:1,style:{overflowY:"hidden"},children:v})})})]})}},20926:function(e,n,t){t.r(n),t.d(n,{default:function(){return $}});var a=t(29439),i=t(72791),r=t(16030),s=t(64387),c=t(95643),o=t(76998),l=t.n(o),h=t(37499),u=t.n(h),m=t(1786),d=t.n(m),x=t(80567),g=t.n(x),f=t(67420),p=t(27391),Z=t(68096),C=t(94925),j=t(51981),b=t(37078),y=t(13400),v=t(5130),k=t(61889),P=t(54440),T=t(29823),S=t(81918),D=t(11337),M=t(80184),I={height:"auto",paddingTop:7,paddingBottom:7},B=function(e){var n=(0,D.Z)(!1),t=(0,a.Z)(n,3),r=t[0],s=t[1],c=t[2],o=e.handleCopy,l=e.copyText,h=e.text,u=i.useCallback((function(){s(),o(l||h)}),[l,o,s,h]);return(0,M.jsxs)(M.Fragment,{children:[(0,M.jsx)(S.Z,{onClick:u,style:I,label:(0,M.jsx)("div",{children:h})}),(0,M.jsx)(P.Z,{action:[(0,M.jsx)(y.Z,{onClick:c,size:"large",children:(0,M.jsx)(T.Z,{})},"close")],autoHideDuration:4e3,message:"Copied Commit Text to clipboard!",onClose:c,open:r})]})},w={paddingLeft:20,paddingRight:20,width:"100%"},F={marginTop:12},L=function(e){var n=e.getSelectOptions,t=e.setBranchPrefix,a=e.setCasePreference,r=i.useCallback((function(){return n(["chores","epics","features","fixes"])}),[n]),c=i.useCallback((function(){return n(["snake_case","kebab-case","camelCase","No Changes"])}),[n]),o=i.useCallback((function(e){t(e.target.value)}),[t]),l=i.useCallback((function(e){a(e.target.value)}),[a]),h=e.branchMessage,u=e.branchName,m=e.branchPrefix,d=e.casePreference,x=e.gitTheme,g=e.handleCopy,f=e.onBranchMessageChange,P=e.onBranchMessageClear,T=i.useMemo((function(){return{color:x}}),[x]);return(0,M.jsxs)("div",{style:w,children:[(0,M.jsxs)(k.ZP,{container:!0,spacing:2,style:{marginBottom:16},children:[(0,M.jsx)(k.ZP,{item:!0,sm:3,xs:12,style:{marginTop:16},children:(0,M.jsxs)(Z.Z,{fullWidth:!0,children:[(0,M.jsx)(C.Z,{htmlFor:"branch-prefix",style:T,children:"Branch Prefix"}),(0,M.jsx)(j.Z,{input:(0,M.jsx)(b.Z,{id:"branch-prefix"}),onChange:o,value:m,children:r()||(0,M.jsx)(s.Z,{value:"features",children:"features"})})]})}),(0,M.jsx)(k.ZP,{item:!0,sm:3,xs:12,style:{marginTop:16},children:(0,M.jsxs)(Z.Z,{fullWidth:!0,children:[(0,M.jsx)(C.Z,{htmlFor:"branch-prefix",style:T,children:"Case Preference"}),(0,M.jsx)(j.Z,{input:(0,M.jsx)(b.Z,{id:"branch-prefix"}),onChange:l,value:d,children:c()||(0,M.jsx)(s.Z,{value:"snake_case",children:"snake_case"})})]})}),(0,M.jsx)(k.ZP,{item:!0,sm:5,xs:10,style:{marginTop:16},children:(0,M.jsx)(p.Z,{fullWidth:!0,InputLabelProps:{style:T},label:"Branch Name",multiline:!0,onChange:f,placeholder:"Summary of User Story",value:h})}),(0,M.jsx)(k.ZP,{item:!0,sm:1,xs:2,style:{marginTop:16},children:(0,M.jsx)(y.Z,{onClick:P,style:F,size:"large",children:(0,M.jsx)(v.Z,{})})})]}),(0,M.jsx)(B,{handleCopy:g,text:u})]})},W=t(85523),N=t(91440),A=t(27056),O=t.n(A);var _=function(e,n){var t=i.useState("feat"),r=(0,a.Z)(t,2),s=r[0],c=r[1],o=i.useState(""),l=(0,a.Z)(o,2),h=l[0],u=l[1],m=i.useState(""),d=(0,a.Z)(m,2),x=d[0],g=d[1],f=i.useState(!1),p=(0,a.Z)(f,2),Z=p[0],C=p[1];return{commitPrefix:s,commitMessage:h,commitDescription:x,finishes:Z,getCommitText:function(){var t="".concat(s,": "),a=" ";x&&e?a="\n\n".concat(x,"\n\n"):x&&(a="\n\n".concat(x));var i="";Z&&e?i="[".concat(e," #finish]"):e&&(i="[".concat(e,"]"));var r="".concat(t).concat(h).concat(a).concat(i);return n?'git commit -m "'.concat(r,'"'):r},handleCommitPrefixSelect:function(e){c(e.target.value)},handleCommitMessageChange:function(e){u(e.target.value)},handleCommitDescriptionChange:function(e){g(e.target.value)},clearCommitMessage:function(){u("")},clearCommitDescription:function(){g("")},handleFinishesToggle:function(e,n){C(n)}}},z={paddingLeft:20,paddingRight:20,width:"100%"},R={marginTop:12},U=function(e){var n=(0,r.v9)((function(e){return e.git.commitPrefix})),t=(0,r.I0)(),a=e.getSelectOptions,s=e.storyID,c=e.handleCopy,o=e.gitTheme,l=_(s,n),h=l.commitPrefix,u=l.commitMessage,m=l.commitDescription,d=l.finishes,x=l.getCommitText,g=l.handleCommitPrefixSelect,P=l.handleCommitMessageChange,T=l.handleCommitDescriptionChange,S=l.clearCommitMessage,D=l.clearCommitDescription,I=l.handleFinishesToggle,w=i.useCallback((function(){return a(["build","chore","ci","docs","feat","fix","perf","refactor","revert","style","test"])}),[a]),F=i.useCallback((function(e,n){t((0,f.lf)(n))}),[t]),L=x(),A=L&&O()(x());return(0,M.jsxs)("div",{style:z,children:[(0,M.jsxs)(k.ZP,{container:!0,spacing:2,style:{marginBottom:16},children:[(0,M.jsx)(k.ZP,{item:!0,sm:4,xs:12,style:{marginTop:16},children:(0,M.jsxs)(Z.Z,{fullWidth:!0,children:[(0,M.jsx)(C.Z,{htmlFor:"commit-prefix",style:{color:o},children:"Commit Prefix"}),(0,M.jsx)(j.Z,{input:(0,M.jsx)(b.Z,{id:"branch-prefix"}),onChange:g,value:h,children:w()})]})}),(0,M.jsx)(k.ZP,{item:!0,sm:4,xs:12,style:{marginTop:16},children:(0,M.jsx)(W.Z,{control:(0,M.jsx)(N.Z,{checked:d,onChange:I,value:"Finishes User Story"}),label:"Finishes User Story"})}),(0,M.jsx)(k.ZP,{item:!0,sm:4,xs:12,style:{marginTop:16},children:(0,M.jsx)(W.Z,{control:(0,M.jsx)(N.Z,{checked:n,onChange:F,value:"Add git commit -m"}),label:"Add git commit -m"})}),(0,M.jsx)(k.ZP,{item:!0,sm:5,xs:10,children:(0,M.jsx)(p.Z,{fullWidth:!0,InputLabelProps:{style:{color:o}},label:"Commit Message",onChange:P,placeholder:"Summary of Work Done (Message)",value:u})}),(0,M.jsx)(k.ZP,{item:!0,sm:1,xs:2,children:(0,M.jsx)(y.Z,{onClick:S,style:R,size:"large",children:(0,M.jsx)(v.Z,{})})}),(0,M.jsx)(k.ZP,{item:!0,sm:5,xs:10,children:(0,M.jsx)(p.Z,{fullWidth:!0,InputLabelProps:{style:{color:o}},label:"Commit Description",multiline:!0,onChange:T,placeholder:"Summary of Work Done (Description)",value:m})}),(0,M.jsx)(k.ZP,{item:!0,sm:1,xs:2,children:(0,M.jsx)(y.Z,{onClick:D,style:R,size:"large",children:(0,M.jsx)(v.Z,{})})})]}),(0,M.jsx)(B,{copyText:L,handleCopy:c,text:A})]})},G=i.memo((function(e){var n=i.useState("test-pipeline"),t=(0,a.Z)(n,2),r=t[0],s=t[1],c=i.useCallback((function(e){s(e.target.value)}),[s]),o=e.gitTheme,l=e.handleCopy,h=e.getSelectOptions,u=e.branchName;return(0,M.jsx)("div",{style:{paddingLeft:20,paddingRight:20,width:"100%"},children:(0,M.jsxs)(k.ZP,{container:!0,spacing:1,style:{display:"flex",alignItems:"center"},children:[(0,M.jsx)(k.ZP,{item:!0,sm:3,xs:12,style:{marginTop:16},children:(0,M.jsxs)(Z.Z,{fullWidth:!0,children:[(0,M.jsx)(C.Z,{htmlFor:"target-branch",style:{color:o},children:"Target Branch"}),(0,M.jsx)(j.Z,{input:(0,M.jsx)(b.Z,{id:"target-branch"}),onChange:c,value:r,children:h(["test-pipeline","sandbox-pipeline"])})]})}),(0,M.jsx)(k.ZP,{item:!0,sm:9,xs:12,style:{marginTop:16},children:(0,M.jsx)(B,{handleCopy:l,text:"git push -f origin ".concat(u,":").concat(r)})})]})})})),E=G,H=t(20890),Y=/[A-Z]{4}-[a-zA-Z0-9]+/,q=i.memo((function(e){var n=e.onIdChange,t=e.storyID,a=e.gitTheme,i=t&&Y.test(t);return(0,M.jsxs)(M.Fragment,{children:[(0,M.jsx)(H.Z,{variant:"h2",children:"Git Tools"}),(0,M.jsx)(p.Z,{InputLabelProps:{style:{color:a}},label:"User Story ID",onChange:n,placeholder:"GNAP-12345",style:{marginLeft:20},value:t,error:!i}),(0,M.jsx)("br",{})]})})),J=q,K=t(83834),Q=c.Z[600],V=/[A-Z]{1,4}-?[a-zA-Z0-9]*/,X=function(e){return e.map((function(e,n){return(0,M.jsx)(s.Z,{value:e,children:e},n)}))},$=function(){var e=(0,r.v9)((function(e){return e.git})),n=e.branchMessage,t=e.branchPrefix,s=e.casePreference,c=e.storyID,o=(0,r.I0)(),h=i.useCallback((function(e){var n=V.exec(e.target.value)||[""],t=(0,a.Z)(n,1)[0];o((0,f.Dt)(t))}),[o]),m=i.useCallback((function(e){o((0,f.jv)(e.target.value))}),[o]),x=i.useCallback((function(){o((0,f.jv)(""))}),[o]),p=i.useCallback((function(e){o((0,f.wF)(e))}),[o]),Z=i.useCallback((function(e){o((0,f.x1)(e))}),[o]),C=function(e,n,t,a){var i=n?"".concat(n,"/"):"",r="";switch(t){case"snake_case":r="".concat(a&&"".concat(a,"_")).concat(u()(e));break;case"kebab-case":r="".concat(a&&"".concat(a,"-")).concat(d()(e));break;case"camelCase":r="".concat(a).concat(g()(e));break;default:r="".concat(a).concat(e)}return"".concat(i).concat(r)}(n,t,s,c);return(0,M.jsxs)(M.Fragment,{children:[(0,M.jsx)(J,{gitTheme:Q,onIdChange:h,storyID:c}),(0,M.jsx)(K.Z,{backgroundColor:Q,title:"Create Branch Name",children:(0,M.jsx)(L,{branchMessage:n,branchName:C,branchPrefix:t,casePreference:s,getSelectOptions:X,gitTheme:Q,handleCopy:l(),onBranchMessageChange:m,onBranchMessageClear:x,setBranchPrefix:p,setCasePreference:Z})}),(0,M.jsx)(K.Z,{backgroundColor:Q,title:"Create Commit Message",children:(0,M.jsx)(U,{getSelectOptions:X,gitTheme:Q,handleCopy:l(),storyID:c})}),(0,M.jsx)(K.Z,{backgroundColor:Q,title:"Deploy to Test Pipelines",children:(0,M.jsx)(E,{branchName:C,getSelectOptions:X,gitTheme:Q,handleCopy:l()})})]})}},11337:function(e,n,t){var a=t(29439),i=t(72791);n.Z=function(){var e=arguments.length>0&&void 0!==arguments[0]&&arguments[0],n=i.useState(e),t=(0,a.Z)(n,2),r=t[0],s=t[1],c=function(){s(!0)},o=function(){s(!1)};return[r,c,o]}}}]);
//# sourceMappingURL=r_git.07ccff01.chunk.js.map