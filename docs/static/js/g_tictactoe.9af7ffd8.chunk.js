"use strict";(self.webpackChunkreact_home=self.webpackChunkreact_home||[]).push([[775],{10526:function(n,t,r){r.r(t),r.d(t,{default:function(){return A}});var e=r(29439),o=r(72791),c=r(10703),a=r(20890),i=r(56030),l="X",s=null,u=function(){return{history:[{board:Array(9).fill(s)}],turn:l,step:0}},d=(0,i.cn)({key:"tikTacToeAtom",default:JSON.parse(localStorage.getItem("tik-tac-toe-atom")||"null")||u(),effects:[function(n){(0,n.onSet)((function(n){localStorage.setItem("tik-tac-toe-atom",JSON.stringify(n))}))}]}),h=r(24518),f=r(34663),m=r(80184),p=o.memo((function(n){var t=n.winner,r=n.turn,e=n.newGame;return(0,m.jsxs)(f.Z,{children:[(0,m.jsx)(a.Z,{style:{flex:1},variant:"h6",children:t?"Winner: ".concat(t):"Turn: ".concat(r)}),(0,m.jsx)(h.Z,{color:"primary",onClick:e,variant:"contained",style:{color:"black"},children:"Reset Game"})]})})),w=function(n){return n%2?"O":l};function v(n){for(var t=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]],r=0;r<t.length;r+=1){var o=(0,e.Z)(t[r],3),c=o[0],a=o[1],i=o[2];if(n[c]!==s&&n[c]===n[a]&&n[c]===n[i])return{winner:n[c],winRow:t[r]}}return{winner:null,winRow:[]}}var y=function(n){var t=o.useState(!0),r=(0,e.Z)(t,2),c=r[0],a=r[1],i=n.history,l=n.step,s=n.jumpToStep,u=o.useCallback((function(n,t){var r=n.location||0,e=t?"Move #".concat(t," (").concat(w(t-1),", ")+"".concat(Math.floor(r/3),", ").concat(r%3,")"):"Game Start (Turn, Col, Row)",o=l===t?"secondary":"primary";return(0,m.jsx)(h.Z,{color:o,onClick:function(){return s(t)},style:{display:"block"},children:e},t)}),[s,l]),d=i.map(u);return!c&&d.reverse(),(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(h.Z,{onClick:function(){a(!c)},style:{marginTop:20,marginBottom:20,color:"black"},variant:"contained",children:c?"Asc":"Desc"}),d]})},k=r(79836),x=r(53382),j=r(53994),b=r(35855),Z=r(5519),g=r(13967),C=o.memo((function(n){var t=n.value,r=n.winner,e=n.onClick,o=(0,g.Z)().palette.primary.main,c=r?{color:"white",backgroundColor:o}:{};return(0,m.jsx)(h.Z,{onClick:e,style:c,"aria-label":"Tic Tac Toe Play Button ".concat(t?"".concat(t," selected"):"available"),children:t||(0,m.jsx)("br",{})})})),T={padding:0,textAlign:"center",border:"1px solid ".concat(Z.Z[400])},S=function(n){for(var t=n.board,r=n.onClick,e=n.winRow,o=[],c=0;c<3;c+=1){for(var a=[],i=function(n){var o=3*c+n,i=e.includes(o);a.push((0,m.jsx)(j.Z,{style:T,children:(0,m.jsx)(C,{onClick:function(){return r(o)},value:t[o],winner:i})},"".concat(c,",").concat(n)))},l=0;l<3;l+=1)i(l);var s=(0,m.jsx)(b.Z,{children:a},"row".concat(c));o.push(s)}return(0,m.jsx)(k.Z,{children:(0,m.jsx)(x.Z,{children:o})})},R={width:343,display:"block",margin:"auto"},A=function(){var n=(0,i.FV)(d),t=(0,e.Z)(n,2),r=t[0],o=t[1],h=r.turn,f=r.step,k=r.history,x=k[f].board.slice(),j=v(x),b=j.winner,Z=j.winRow;return(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(a.Z,{variant:"h2",gutterBottom:!0,children:"Tic-Tac-Toe"}),(0,m.jsxs)(c.Z,{elevation:2,style:R,children:[(0,m.jsx)(p,{newGame:function(){return o(u())},turn:h,winner:b}),(0,m.jsx)(S,{board:x,onClick:function(n){var t=k.slice(0,f+1),r=t[f].board.slice();v(r).winner||r[n]!==s||(r[n]=h,o({history:t.concat([{board:r,location:n}]),step:t.length,turn:h===l?"O":l}))},winRow:Z})]}),(0,m.jsx)(y,{history:k,jumpToStep:function(n){var t={step:n,turn:w(n),history:k};f===n&&(t.history=k.slice(0,f+1)),o(t)},step:f})]})}}}]);
//# sourceMappingURL=g_tictactoe.9af7ffd8.chunk.js.map