"use strict";(self.webpackChunkreact_home=self.webpackChunkreact_home||[]).push([[775],{44181:function(n,r,t){t.r(r),t.d(r,{default:function(){return G}});var e=t(1413),o=t(72791),i=t(16030),c=t(10703),a=t(20890),l=t(37734),s=t(24518),u=t(34663),d=t(80184),h=o.memo((function(n){var r=n.winner,t=n.turn,e=n.newGame;return(0,d.jsxs)(u.Z,{children:[(0,d.jsx)(a.Z,{style:{flex:1},variant:"h6",children:r?"Winner: ".concat(r):"Turn: ".concat(t)}),(0,d.jsx)(s.Z,{color:"primary",onClick:e,variant:"contained",role:"button",children:"Reset Game"})]})})),f=t(29439),v=t(37964),w=function(n){return n%2?v.O:v.X};function m(n){for(var r=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]],t=0;t<r.length;t+=1){var e=(0,f.Z)(r[t],3),o=e[0],i=e[1],c=e[2];if(n[o]!==v.E_&&n[o]===n[i]&&n[o]===n[c])return{winner:n[o],winRow:r[t]}}return{winner:void 0,winRow:[]}}var p=function(n){var r=o.useState(!0),t=(0,f.Z)(r,2),e=t[0],i=t[1],c=n.history,a=n.step,l=n.jumpToStep,u=o.useCallback((function(n,r){var t=n.location||0,e=r?"Move #".concat(r," (").concat(w(r-1),", ")+"".concat(Math.floor(t/3),", ").concat(t%3,")"):"Game Start (Turn, Col, Row)",o=a===r?"secondary":"primary";return(0,d.jsx)(s.Z,{color:o,onClick:function(){return l(r)},role:"button",style:{display:"block"},children:e},r)}),[l,a]),h=c.map(u);return!e&&h.reverse(),(0,d.jsxs)(d.Fragment,{children:[(0,d.jsx)(s.Z,{onClick:function(){i(!e)},style:{marginTop:20,marginBottom:20},variant:"contained",role:"button",children:e?"Asc":"Desc"}),h]})},x=t(79836),j=t(53382),b=t(53994),k=t(35855),y=t(5519),Z=t(13967),C=o.memo((function(n){var r=n.value,t=n.winner,e=n.onClick,o=(0,Z.Z)().palette.primary.main,i=t?{color:"white",backgroundColor:o}:{};return(0,d.jsx)(s.Z,{onClick:e,style:i,role:"button",children:r||(0,d.jsx)("br",{})})})),g={padding:0,textAlign:"center",border:"1px solid ".concat(y.Z[400])},T=function(n){var r=n.board,t=n.onClick,e=n.winRow,i=o.useMemo((function(){for(var n=[],o=0;o<3;o+=1){for(var i=[],c=function(n){var c=3*o+n,a=e.includes(c);i.push((0,d.jsx)(b.Z,{style:g,children:(0,d.jsx)(C,{onClick:function(){return t(c)},value:r[c],winner:a})},"".concat(o,",").concat(n)))},a=0;a<3;a+=1)c(a);var l=(0,d.jsx)(k.Z,{children:i},"row".concat(o));n.push(l)}return n}),[r,t,e]);return(0,d.jsx)(x.Z,{children:(0,d.jsx)(j.Z,{children:i})})},R={width:343,display:"block",margin:"auto"},G=function(){var n=(0,i.v9)((function(n){return(0,e.Z)({},n.ticTacToe)})),r=n.turn,t=n.step,s=n.history,u=(0,i.I0)(),f=o.useCallback((function(n){var e=s.slice(0,t+1),o=e[t].board.slice();m(o).winner||o[n]!==v.E_||(o[n]=r,u((0,l.iY)({history:e.concat([{board:o,location:n}]),step:e.length,turn:r===v.X?v.O:v.X})))}),[u,s,t,r]),x=o.useCallback((function(){u((0,l.wo)())}),[u]),j=o.useCallback((function(n){var r={step:n,turn:w(n),history:s};t===n&&(r.history=s.slice(0,t+1)),u((0,l.iY)(r))}),[u,s,t]),b=s[t].board.slice(),k=m(b),y=k.winner,Z=k.winRow;return(0,d.jsxs)(d.Fragment,{children:[(0,d.jsx)(a.Z,{variant:"h2",gutterBottom:!0,children:"Tic-Tac-Toe"}),(0,d.jsxs)(c.Z,{elevation:2,style:R,children:[(0,d.jsx)(h,{newGame:x,turn:r,winner:y}),(0,d.jsx)(T,{board:b,onClick:f,winRow:Z})]}),(0,d.jsx)(p,{history:s,jumpToStep:j,step:t})]})}}}]);
//# sourceMappingURL=g_tictactoe.2af19949.chunk.js.map