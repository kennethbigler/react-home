"use strict";(self.webpackChunkreact_home=self.webpackChunkreact_home||[]).push([[71],{47778:function(t,e,n){n.r(e),n.d(e,{default:function(){return M}});var o,r=n(1413),s=n(29439),a=n(72791),c=n(24518),l=n(61889),i=n(20890),u=n(56030),m=n(93433);!function(t){t.EMPTY=" ",t.CHERRY="C",t.BAR="\u2014",t.DOUBLE_BAR="=",t.TRIPLE_BAR="\u039e",t.SEVEN="7",t.JACKPOT="J"}(o||(o={}));var y=[{symbol:o.CHERRY,start:1,stop:2},{symbol:o.EMPTY,start:3,stop:7},{symbol:o.BAR,start:8,stop:12},{symbol:o.EMPTY,start:13,stop:17},{symbol:o.SEVEN,start:18,stop:25},{symbol:o.EMPTY,start:26,stop:30},{symbol:o.BAR,start:31,stop:35},{symbol:o.EMPTY,start:36,stop:41},{symbol:o.CHERRY,start:42,stop:43},{symbol:o.EMPTY,start:44,stop:49},{symbol:o.DOUBLE_BAR,start:50,stop:56},{symbol:o.EMPTY,start:57,stop:62},{symbol:o.CHERRY,start:63,stop:63},{symbol:o.EMPTY,start:64,stop:69},{symbol:o.DOUBLE_BAR,start:70,stop:75},{symbol:o.EMPTY,start:76,stop:81},{symbol:o.BAR,start:82,stop:87},{symbol:o.EMPTY,start:88,stop:93},{symbol:o.TRIPLE_BAR,start:94,stop:104},{symbol:o.EMPTY,start:105,stop:115},{symbol:o.JACKPOT,start:116,stop:117},{symbol:o.EMPTY,start:118,stop:128}];var d=function(){var t=[];return y.forEach((function(e,n){for(var o=n-1>0?n-1:y.length-1,r=(n+1)%y.length,s=e.start;s<=e.stop;s+=1)t.push([y[o].symbol,e.symbol,y[r].symbol])})),t}();var h=function(){for(var t=[],e=0;e<3;e+=1)t[e]=d[Math.floor(Math.random()*d.length)];return t},R=function(t,e){var n=[o.BAR,o.DOUBLE_BAR,o.TRIPLE_BAR],r=t[0][1],s=t[1][1],a=t[2][1],c=[r,s,a];if(r===s&&r===a)switch(r){case o.JACKPOT:return 1666*e;case o.SEVEN:return 300*e;case o.TRIPLE_BAR:return 100*e;case o.DOUBLE_BAR:return 50*e;case o.BAR:return 25*e;case o.CHERRY:return 12*e;default:return 0}else{if(n.includes(r)&&n.includes(s)&&n.includes(a))return 12*e;if(c.includes(o.CHERRY,c.indexOf(o.CHERRY)+1))return 6*e;if(c.includes(o.CHERRY))return 3*e}return 0},p=n(24274),Z=(0,u.cn)({key:"slotsAtom",default:JSON.parse(localStorage.getItem("slots-atom")||"null")||h(),effects:[function(t){(0,t.onSet)((function(t){localStorage.setItem("slots-atom",JSON.stringify(t))}))}]}),E=(0,u.nZ)({key:"slotsState",get:function(t){var e=t.get,n=e(Z),o=e(p.ZP);return{reel:n,player:o[0],dealer:o[o.length-1]}},set:function(t,e){var n=t.get,o=t.set;if(!(e instanceof u.nY)){var r=e.reel,s=e.player,a=e.dealer;o(Z,r);var c=n(p.ZP),l=(0,m.Z)(c);l[0]=s,l[c.length-1]=a,o(p.ZP,l)}}}),f=n(79836),b=n(53382),x=n(53994),j=n(56890),P=n(35855),B=n(80184),v=[{symbol:"".concat(o.JACKPOT," ").concat(o.JACKPOT," ").concat(o.JACKPOT),payout:1666},{symbol:"".concat(o.SEVEN," ").concat(o.SEVEN," ").concat(o.SEVEN),payout:300},{symbol:"".concat(o.TRIPLE_BAR," ").concat(o.TRIPLE_BAR," ").concat(o.TRIPLE_BAR),payout:100},{symbol:"".concat(o.DOUBLE_BAR," ").concat(o.DOUBLE_BAR," ").concat(o.DOUBLE_BAR),payout:50},{symbol:"".concat(o.BAR," ").concat(o.BAR," ").concat(o.BAR),payout:25},{symbol:"3 of any bar",payout:12},{symbol:"".concat(o.CHERRY," ").concat(o.CHERRY," ").concat(o.CHERRY),payout:12},{symbol:"".concat(o.CHERRY," ").concat(o.CHERRY),payout:6},{symbol:o.CHERRY,payout:3}],A=a.memo((function(){return(0,B.jsxs)(f.Z,{children:[(0,B.jsx)(j.Z,{children:(0,B.jsxs)(P.Z,{children:[(0,B.jsx)(x.Z,{children:"Slot Roll"}),(0,B.jsx)(x.Z,{children:"Payout"})]})}),(0,B.jsx)(b.Z,{children:v.map((function(t,e){return(0,B.jsxs)(P.Z,{children:[(0,B.jsx)(x.Z,{children:t.symbol}),(0,B.jsx)(x.Z,{children:"".concat(t.payout," : 1")})]},e)}))})]})})),T=a.memo((function(t){var e=t.playerName,n=t.playerMoney,o=t.dealerMoney;return(0,B.jsxs)(f.Z,{children:[(0,B.jsx)(j.Z,{children:(0,B.jsxs)(P.Z,{children:[(0,B.jsx)(x.Z,{children:"Player"}),(0,B.jsx)(x.Z,{children:"Money"})]})}),(0,B.jsxs)(b.Z,{children:[(0,B.jsxs)(P.Z,{children:[(0,B.jsx)(x.Z,{children:e}),(0,B.jsx)(x.Z,{children:"$".concat(n)})]}),(0,B.jsxs)(P.Z,{children:[(0,B.jsx)(x.Z,{children:"House"}),(0,B.jsx)(x.Z,{children:"$".concat(o)})]})]})]})})),Y={minHeight:39,fontWeight:900},C=function(t){var e=t.reel,n=a.useCallback((function(){for(var t=[],n=function(n){var o=e.map((function(t,e){return(0,B.jsx)(x.Z,{children:(0,B.jsx)(i.Z,{variant:"h4",align:"center",color:"secondary",style:Y,children:t[n]})},"".concat(e,",").concat(n))})),r=(0,B.jsx)(P.Z,{children:o},"row".concat(n));t.push(r)},o=0;o<3;o+=1)n(o);return t}),[e]);return(0,B.jsx)(f.Z,{children:(0,B.jsx)(b.Z,{children:n()})})},M=function(){var t=(0,u.FV)(E),e=(0,s.Z)(t,2),n=e[0],o=n.reel,m=n.player,y=n.dealer,d=e[1],p=a.useState(0),Z=(0,s.Z)(p,2),f=Z[0],b=Z[1];return(0,B.jsxs)(B.Fragment,{children:[(0,B.jsx)(i.Z,{variant:"h2",children:"Casino Slot Machine"}),(0,B.jsxs)(l.ZP,{container:!0,spacing:1,style:{marginTop:"2em"},children:[(0,B.jsxs)(l.ZP,{item:!0,sm:6,xs:12,children:[(0,B.jsxs)(l.ZP,{container:!0,spacing:1,style:{marginBottom:"1em"},children:[(0,B.jsxs)(l.ZP,{item:!0,sm:3,xs:12,children:[(0,B.jsx)(c.Z,{color:"primary",onClick:function(){var t=h(),e=m.bet,n=R(t,e)-e;b(n),d({reel:t,player:(0,r.Z)((0,r.Z)({},m),{},{money:m.money+n}),dealer:(0,r.Z)((0,r.Z)({},y),{},{money:y.money-n})})},style:{marginBottom:15},variant:"contained",role:"button",children:"Spin"}),f?(0,B.jsx)(i.Z,{variant:"h4",children:"You ".concat(f>0?"won":"lost"," $").concat(f)}):null]}),(0,B.jsx)(l.ZP,{item:!0,sm:9,xs:12,children:(0,B.jsx)(C,{reel:o})})]}),(0,B.jsx)(T,{playerMoney:m.money,playerName:m.name,dealerMoney:y.money})]}),(0,B.jsx)(l.ZP,{item:!0,sm:6,xs:12,children:(0,B.jsx)(A,{})})]})]})}},56890:function(t,e,n){n.d(e,{Z:function(){return E}});var o=n(87462),r=n(63366),s=n(72791),a=n(28182),c=n(94419),l=n(829),i=n(61046),u=n(47630),m=n(21217);function y(t){return(0,m.Z)("MuiTableHead",t)}(0,n(75878).Z)("MuiTableHead",["root"]);var d=n(80184),h=["className","component"],R=(0,u.ZP)("thead",{name:"MuiTableHead",slot:"Root",overridesResolver:function(t,e){return e.root}})({display:"table-header-group"}),p={variant:"head"},Z="thead",E=s.forwardRef((function(t,e){var n=(0,i.Z)({props:t,name:"MuiTableHead"}),s=n.className,u=n.component,m=void 0===u?Z:u,E=(0,r.Z)(n,h),f=(0,o.Z)({},n,{component:m}),b=function(t){var e=t.classes;return(0,c.Z)({root:["root"]},y,e)}(f);return(0,d.jsx)(l.Z.Provider,{value:p,children:(0,d.jsx)(R,(0,o.Z)({as:m,className:(0,a.Z)(b.root,s),ref:e,role:m===Z?null:"rowgroup",ownerState:f},E))})}))}}]);
//# sourceMappingURL=g_slots.ee232091.chunk.js.map