(this["webpackJsonpreact-home"]=this["webpackJsonpreact-home"]||[]).push([[6],{241:function(a,e,t){"use strict";var n=t(48),c=t(0),r=t.n(c);e.a=function(){var a=arguments.length>0&&void 0!==arguments[0]&&arguments[0],e=r.a.useState(a),t=Object(n.a)(e,2),c=t[0],i=t[1],s=function(){i(!0)},d=function(){i(!1)};return[c,s,d]}},347:function(a,e,t){"use strict";var n=t(48),c=(t(0),t(624)),r=t(625),i=t(626),s=t(627),d=t(732),o=t(241),l=t(4);e.a=function(a){var e=Object(o.a)(),t=Object(n.a)(e,3),j=t[0],u=t[1],b=t[2],h=a.buttonText,O=a.title,x=a.children;return Object(l.jsxs)(l.Fragment,{children:[Object(l.jsx)(d.a,{color:"primary",onClick:u,variant:"contained",children:h||O}),Object(l.jsxs)(c.a,{title:"info-popup",onClose:b,open:j,maxWidth:"md",fullWidth:!0,children:[Object(l.jsx)(r.a,{children:O}),Object(l.jsx)(i.a,{children:x}),Object(l.jsx)(s.a,{children:Object(l.jsx)(d.a,{color:"primary",onClick:b,children:"Close"})})]})]})}},349:function(a,e,t){"use strict";t.d(e,"a",(function(){return T}));var n=t(0),c=t.n(n),r=t(1),i=t(708),s=t(727),d=t(357),o=t(258),l=t(33),j=t(134),u=t(31),b=t(30),h={cardFace:{backgroundColor:"white",borderRadius:5,cursor:"pointer",display:"inline-block",fontWeight:"bold",height:78,margin:5,padding:3,width:50},cardTitle:{textAlign:"left"},suit:{margin:"auto",marginTop:5,textAlign:"center",width:"100%"}},O=t(4),x=c.a.memo((function(a){var e=a.dropped,t=a.suit,n=a.name,i=a.cardHandler,d=a.playerNo,o=a.handNo,l=a.cardNo,j=c.a.useCallback((function(){i&&i(d,o,l)}),[i,l,o,d]),b={color:"\u2663"===t||"\u2660"===t?"black":u.a[500],backgroundColor:e?u.a[100]:"white"};return Object(O.jsxs)("div",{style:Object(r.a)(Object(r.a)({},h.cardFace),b),onClick:j,role:"main",children:[Object(O.jsx)("div",{style:h.cardTitle,children:n+t}),Object(O.jsx)(s.a,{variant:"h4",style:Object(r.a)(Object(r.a)({},h.suit),b),children:t})]})})),f={fontWeight:"bold",marginTop:"0.5em"},m={fontWeight:"normal",marginTop:"0.5em"},p=function(a){var e=a.cardHandler,t=a.cardsToDiscard,n=a.hand,i=a.handNo,d=a.isBlackJack,o=a.isHandTurn,l=a.isMultiHand,j=a.isPlayerTurn,u=a.playerNo,h=c.a.useMemo((function(){return j&&(!l||l&&o)?Object(r.a)(Object(r.a)({},f),{},{color:b.a[700]}):m}),[j,l,o]),p=n.weight||0;return Object(O.jsxs)(O.Fragment,{children:[Object(O.jsx)(s.a,{variant:"h4",style:h,children:d&&"".concat(p>21?"Bust":"Hand",": ").concat(p)}),n.cards.map((function(a,n){var c=t.includes(n);return Object(O.jsx)(x,{cardHandler:e,cardNo:n,dropped:c,handNo:i,name:a.name,playerNo:u,suit:a.suit},a.name+a.suit)}))]})},y={player:{borderRadius:5,display:"inline-block",margin:10,padding:20},width:{minWidth:"100px"}},g=function(a){var e=a.betHandler,t=a.cardHandler,n=a.cardsToDiscard,b=a.hideHands,h=a.isBlackJack,x=a.player,f=a.playerNo,m=a.turn,g=!!m&&f===m.player,v=x.hands.length>1,k=!!b&&h&&0!==x.id&&!x.isBot,H=Math.max(Math.min(x.money,5),0),w=Math.max(Math.min(x.money,100),10),A=c.a.useCallback((function(a,t){e&&e(x.id,a,t)}),[e,x.id]),T=g?{background:o.a[200]}:{},C=g?{fontWeight:"bold"}:{fontWeight:"normal"};return"win"===x.status&&(T={background:l.a[300]}),"draw"===x.status&&(T={background:j.a[300]}),"lose"===x.status&&(T={background:u.a[300]}),Object(O.jsxs)(d.a,{style:Object(r.a)(Object(r.a)({},y.player),T),children:[Object(O.jsx)(s.a,{variant:"h4",style:Object(r.a)({},C),children:"".concat(x.name,": $").concat(x.money)}),k&&Object(O.jsx)(i.a,{max:w,min:H,onChange:A,step:5,style:y.width,value:x.bet}),h&&0!==x.id&&Object(O.jsx)(s.a,{variant:"h5",children:"Bet: $".concat(x.bet)}),x.hands.map((function(a,e){var c=!!m&&m.hand===e;return Object(O.jsx)("div",{children:!b&&Object(O.jsx)(p,{cardHandler:t,cardsToDiscard:n,hand:a,handNo:e,isBlackJack:h,isHandTurn:c,isMultiHand:v,isPlayerTurn:g,playerNo:f})},"hand".concat(e))}))]})},v=function(a){var e=a.betHandler,t=a.cardHandler,n=a.cardsToDiscard,c=a.hideHands,r=a.isBlackJack,i=a.players,s=a.turn;return Object(O.jsx)(O.Fragment,{children:i.map((function(a,i){return Object(O.jsx)(g,{betHandler:e,cardHandler:t,cardsToDiscard:n,hideHands:c,isBlackJack:r,player:a,playerNo:i,turn:s},"player".concat(i))}))})},k=t(732),H={margin:12},w=c.a.memo((function(a){var e=a.onClick,t=a.name;return Object(O.jsx)(k.a,{color:"primary",onClick:function(){return e(t)},style:H,variant:"contained",children:t})})),A=function(a){var e=a.gameFunctions,t=a.onClick;return Object(O.jsx)("div",{children:e.map((function(a){return Object(O.jsx)(w,{onClick:t,name:a},a)}))})},T=function(a){var e=a.betHandler,t=a.cardClickHandler,n=a.cardsToDiscard,r=void 0===n?[]:n,i=a.gameFunctions,s=void 0===i?[]:i,d=a.gameOver,o=void 0!==d&&d,l=a.hideHands,j=void 0!==l&&l,u=a.isBlackJack,b=void 0===u||u,h=a.players,x=a.turn,f=a.onClick,m=c.a.useMemo((function(){return h.slice(0,x.player+1)}),[h,x.player]),p=c.a.useMemo((function(){return h.slice(x.player+1)}),[h,x.player]),y=c.a.useMemo((function(){return j||!1!==o?h:h.slice(x.player,x.player+1)}),[j,o,h,x.player]);return Object(O.jsx)(O.Fragment,{children:b&&!j?Object(O.jsxs)(O.Fragment,{children:[Object(O.jsx)(v,{players:m,betHandler:e,cardHandler:t,cardsToDiscard:r,hideHands:j,isBlackJack:b,turn:x}),Object(O.jsx)(A,{gameFunctions:s,onClick:f}),Object(O.jsx)(v,{players:p,betHandler:e,cardHandler:t,cardsToDiscard:r,hideHands:j,isBlackJack:b,turn:{player:-1,hand:-1}})]}):Object(O.jsxs)(O.Fragment,{children:[Object(O.jsx)(v,{players:y,betHandler:e,cardHandler:t,cardsToDiscard:r,hideHands:j,isBlackJack:b,turn:x}),Object(O.jsx)(A,{gameFunctions:s,onClick:f})]})})}},360:function(a,e,t){"use strict";function n(a,e){if(null==a)return{};var t,n,c=function(a,e){if(null==a)return{};var t,n,c={},r=Object.keys(a);for(n=0;n<r.length;n++)t=r[n],e.indexOf(t)>=0||(c[t]=a[t]);return c}(a,e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(a);for(n=0;n<r.length;n++)t=r[n],e.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(a,t)&&(c[t]=a[t])}return c}t.d(e,"a",(function(){return n}))},456:function(a,e,t){"use strict";e.a={50:"#ede7f6",100:"#d1c4e9",200:"#b39ddb",300:"#9575cd",400:"#7e57c2",500:"#673ab7",600:"#5e35b1",700:"#512da8",800:"#4527a0",900:"#311b92",A100:"#b388ff",A200:"#7c4dff",A400:"#651fff",A700:"#6200ea"}},694:function(a,e,t){"use strict";t.r(e),t.d(e,"default",(function(){return G}));var n=t(10),c=t.n(n),r=t(19),i=t(1),s=t(0),d=t.n(s),o=t(49),l=t(77);function j(){var a=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],e=0,t=!1;return a.forEach((function(a){var n=a.weight||0;14===n?e<=10?(e+=11,t=!0):e+=1:e+=n>10?10:n,e>21&&t&&(e-=10,t=!1)})),{weight:e,soft:t}}var u=t(727),b=t(347),h=t(4),O=d.a.memo((function(){return Object(h.jsxs)(h.Fragment,{children:[Object(h.jsx)(u.a,{variant:"h5",children:"Objective:"}),Object(h.jsx)(u.a,{children:"Get as close to 21 as you can, without going over. Each card is worth it's number, J/Q/K are worth 10, and an Ace is worth 11 unless you go over 21, then it is worth 1."}),Object(h.jsx)("br",{}),Object(h.jsx)(u.a,{variant:"h5",children:"Blackjack:"}),Object(h.jsx)(u.a,{children:"Delt an Ace and a 10/J/Q/K, this casino pays 3:2, but Vegas casinos do 6:5."}),Object(h.jsx)("br",{}),Object(h.jsx)(u.a,{variant:"h5",children:"Hit:"}),Object(h.jsx)(u.a,{children:"Get an extra card which adds to your total."}),Object(h.jsx)("br",{}),Object(h.jsx)(u.a,{variant:"h5",children:"Stay:"}),Object(h.jsx)(u.a,{children:"Move to the next player."}),Object(h.jsx)("br",{}),Object(h.jsx)(u.a,{variant:"h5",children:"Double Down:"}),Object(h.jsx)(u.a,{children:"This option is available with a two card hand; before another card has been drawn double your bet and receive one (and only one) additional card to your hand. Play then moves to the next player."}),Object(h.jsx)("br",{}),Object(h.jsx)(u.a,{variant:"h5",children:"Splitting Pairs:"}),Object(h.jsx)(u.a,{children:"When you are dealt a pair of cards of the same rank, you are allowed to split into two separate hands and play them independently. You will match your bet for the second hand. A double after a split is ok"}),Object(h.jsx)("br",{}),Object(h.jsx)(u.a,{variant:"h5",children:"Resplitting:"}),Object(h.jsx)(u.a,{children:"When you get additional pairs in the first two cards of a hand you can resplit. Typically a player is allowed to split up to 3 times (delt 4 of a kind)."}),Object(h.jsx)("br",{}),Object(h.jsx)(u.a,{variant:"h5",children:"Splitting Aces:"}),Object(h.jsx)(u.a,{children:"Player is limited to drawing only one additional card on each Ace. If you draw a ten-valued card on one of your split Aces, the hand is not considered a Blackjack (it is treated as a normal 21). You can re-split Aces."}),Object(h.jsx)("br",{}),Object(h.jsx)(u.a,{variant:"h5",children:"Other Rules:"}),Object(h.jsxs)("ul",{children:[Object(h.jsx)(u.a,{children:Object(h.jsx)("li",{children:"Dealer hits on 16 or less and soft 17"})}),Object(h.jsx)(u.a,{children:Object(h.jsx)("li",{children:"Minimum bet is $5"})})]}),Object(h.jsx)(u.a,{variant:"h5",children:"AI Algorithm:"}),Object(h.jsxs)("ul",{children:[Object(h.jsx)(u.a,{children:Object(h.jsx)("li",{children:"House Rules: 6 decks, H17, DAS, No Surrender, Peek"})}),Object(h.jsx)(u.a,{children:Object(h.jsx)("li",{children:"Estimated casino edge for these rules: 0.66%"})})]})]})})),x=t(223),f=t(224),m=t(226),p=t(359),y=t(225),g=t(33),v=t(104),k=t(31),H=t(37),w=t(456),A=t(360),T=d.a.memo((function(a){var e=a.color,t=a.text,n=a.style,c=Object(A.a)(a,["color","text","style"]),r=Object(i.a)(Object(i.a)({},n),{},{textAlign:"center",paddingLeft:0,paddingRight:0,backgroundColor:e});return Object(h.jsx)(m.a,Object(i.a)(Object(i.a)({size:"small",style:r},c),{},{children:t}))})),C={textAlign:"center",padding:0},S=function(a){var e=a.name,t=a.data;return Object(h.jsxs)(y.a,{children:[Object(h.jsx)(m.a,{style:C,children:e}),t.map((function(a,e){return Object(h.jsx)(T,Object(i.a)({},a),e)}))]})},B=["2","3","4","5","6","7","8","9","T","A"],D={width:60},F=function(a){var e=a.title,t=a.data;return Object(h.jsxs)(x.a,{children:[Object(h.jsx)(p.a,{children:Object(h.jsx)(y.a,{children:Object(h.jsx)(m.a,{colSpan:11,children:e})})}),Object(h.jsxs)(f.a,{children:[Object(h.jsxs)(y.a,{children:[Object(h.jsx)(T,{rowSpan:2,style:D,text:"Hand"}),Object(h.jsx)(T,{colSpan:10,text:"Dealer"})]}),Object(h.jsx)(y.a,{children:B.map((function(a){return Object(h.jsx)(T,{text:a},a)}))}),t.map((function(a){return Object(h.jsx)(S,{name:a.name,data:a.data},a.name)}))]})]})},N=d.a.memo((function(){var a={color:g.a[200],text:"H"},e={color:v.a[200],text:"D"},t={color:k.a[200],text:"S"},n={color:H.a[200],text:"P"},c={color:w.a[200],text:"DS"},r=[{name:"Hard 5",data:[a,a,a,a,a,a,a,a,a,a]},{name:"Hard 6",data:[a,a,a,a,a,a,a,a,a,a]},{name:"Hard 7",data:[a,a,a,a,a,a,a,a,a,a]},{name:"Hard 8",data:[a,a,a,a,a,a,a,a,a,a]},{name:"Hard 9",data:[a,e,e,e,e,a,a,a,a,a]},{name:"Hard 10",data:[e,e,e,e,e,e,e,e,a,a]},{name:"Hard 11",data:[e,e,e,e,e,e,e,e,e,e]},{name:"Hard 12",data:[a,a,t,t,t,a,a,a,a,a]},{name:"Hard 13",data:[t,t,t,t,t,a,a,a,a,a]},{name:"Hard 14",data:[t,t,t,t,t,a,a,a,a,a]},{name:"Hard 15",data:[t,t,t,t,t,a,a,a,a,a]},{name:"Hard 16",data:[t,t,t,t,t,a,a,a,a,a]},{name:"Hard 17",data:[t,t,t,t,t,t,t,t,t,t]},{name:"Hard 18+",data:[t,t,t,t,t,t,t,t,t,t]}],s=[{name:"Ace + 2",data:[a,a,a,e,e,a,a,a,a,a]},{name:"Ace + 3",data:[a,a,a,e,e,a,a,a,a,a]},{name:"Ace + 4",data:[a,a,e,e,e,a,a,a,a,a]},{name:"Ace + 5",data:[a,a,e,e,e,a,a,a,a,a]},{name:"Ace + 6",data:[a,e,e,e,e,a,a,a,a,a]},{name:"Ace + 7",data:[c,c,c,c,c,t,t,a,a,a]},{name:"Ace + 8",data:[t,t,t,t,c,t,t,t,t,t]},{name:"Ace + 9",data:[t,t,t,t,t,t,t,t,t,t]}],d=[{name:"(2,2)",data:[n,n,n,n,n,n,a,a,a,a]},{name:"(3,3)",data:[n,n,n,n,n,n,a,a,a,a]},{name:"(4,4)",data:[a,a,a,n,n,a,a,a,a,a]},{name:"(5,5)",data:[e,e,e,e,e,e,e,e,a,a]},{name:"(6,6)",data:[n,n,n,n,n,a,a,a,a,a]},{name:"(7,7)",data:[n,n,n,n,n,n,a,a,a,a]},{name:"(8,8)",data:[n,n,n,n,n,n,n,n,n,n]},{name:"(9,9)",data:[n,n,n,n,n,t,n,n,t,t]},{name:"(T,T)",data:[t,t,t,t,t,t,t,t,t,t]},{name:"(A,A)",data:[n,n,n,n,n,n,n,n,n,n]}];return Object(h.jsxs)(h.Fragment,{children:[Object(h.jsx)(F,{data:r,title:"Hard Totals"}),Object(h.jsx)(F,{data:s,title:"Soft Totals"}),Object(h.jsx)(F,{data:d,title:"Pairs"}),Object(h.jsxs)(x.a,{children:[Object(h.jsx)(p.a,{children:Object(h.jsx)(y.a,{children:Object(h.jsx)(m.a,{colSpan:11,children:"Key"})})}),Object(h.jsxs)(f.a,{children:[Object(h.jsxs)(y.a,{children:[Object(h.jsx)(T,Object(i.a)({},a)),Object(h.jsx)(T,{colSpan:2,text:"= Hit"}),Object(h.jsx)(T,Object(i.a)({},t)),Object(h.jsx)(T,{colSpan:3,text:"= Stand"}),Object(h.jsx)(T,Object(i.a)({},n)),Object(h.jsx)(T,{colSpan:3,text:"= Split"})]}),Object(h.jsxs)(y.a,{children:[Object(h.jsx)(T,Object(i.a)({},e)),Object(h.jsx)(T,{colSpan:10,text:"= Double (Hit if not allowed)"})]}),Object(h.jsxs)(y.a,{children:[Object(h.jsx)(T,Object(i.a)({},c)),Object(h.jsx)(T,{colSpan:10,text:"= Double (Stand if not allowed)"})]})]})]})]})})),M=d.a.memo((function(){return Object(h.jsxs)("div",{className:"flex-container",children:[Object(h.jsx)(u.a,{variant:"h2",gutterBottom:!0,children:"Blackjack (21)"}),Object(h.jsxs)(b.a,{title:"Rules",children:[Object(h.jsx)(O,{}),Object(h.jsx)(N,{})]})]})})),E=t(349),J=t(28),W=t(5),P=t(86),I=t(13),G=function(){var a=Object(o.c)((function(a){return Object(i.a)(Object(i.a)({},a.blackjack),{},{players:a.players,turn:a.turn})})),e=a.turn,t=a.players,n=a.gameFunctions,s=a.hideHands,u=a.hasFunctions,b=Object(o.b)(),O=d.a.useCallback((function(a){if(a){var e=[W.c.STAY];if((a.weight||0)<21)if(e.push(W.c.HIT),2===a.cards.length)e.push(W.c.DOUBLE),j([a.cards[0]]).weight===j([a.cards[1]]).weight&&e.push(W.c.SPLIT);b(Object(P.g)(e)),b(Object(P.h)(!0))}}),[b]),x=function(){var a=t[e.player],n=a.id,c=a.hands;b(Object(P.e)(c,n,e.hand,j))},f=function(){var a=t[e.player].hands.length-1;b(Object(P.f)(e.hand<a))},m=function(){b(Object(P.b)(t[e.player],e,j))},p=function(){var a=t[e.player],n=a.id,c=a.hands;b(Object(P.c)(c,n,e.hand,j))},y=d.a.useCallback((function(a){J.a.shuffle().then((function(){Object(l.a)(a,function(){var a=Object(r.a)(c.a.mark((function a(e){var t;return c.a.wrap((function(a){for(;;)switch(a.prev=a.next){case 0:return t=0!==e.id?2:1,a.next=3,b(Object(I.c)(e.id,t,j));case 3:case"end":return a.stop()}}),a)})));return function(e){return a.apply(this,arguments)}}())})),b(Object(P.h)(!1))}),[b]),g=d.a.useCallback((function(a){b(Object(P.d)(a))}),[b]),v=d.a.useCallback((function(a){b(Object(P.i)(!1)),y(a)}),[b,y]),k=d.a.useCallback((function(a,e,t){b(Object(I.d)(a,e,t))}),[b]),H=d.a.useCallback((function(a){var e=a.filter((function(a){return 0===a.id}))[0].hands;b(Object(P.c)(e,0,0,j))}),[b]),w=d.a.useCallback((function(a){var e=j(a.filter((function(a){return 0===a.id}))[0].hands[0].cards),t=e.weight,n=e.soft;t<=16||17===t&&n?(b(Object(P.h)(!0)),H(a)):(!function(a,e){var t=a.filter((function(a){return 0===a.id}))[0],n=t.hands[0].weight||0,c=t.hands[0].cards.length,r={house:0,payout:0,status:""},i=function(a,e){var t=arguments.length>2&&void 0!==arguments[2]?arguments[2]:1;a.house-=Math.floor(t*e),a.payout=Math.floor(t*e),a.status="win"},s=function(a,e){a.house+=e,a.payout=-e,a.status="lose"};a.forEach((function(a){var t=a.id,d=a.bet;0===t?(r.house>0?r.status="win":r.house<0?r.status="lose":r.status="push",e(t,r.status,r.house)):(a.hands.forEach((function(a){var e=a.weight,t=void 0===e?0:e,o=a.cards;21===n&&2===c?s(r,d):21===t&&2===o.length?i(r,d,1.2):t<=21&&(t>n||n>21)?i(r,d):t<=21&&t===n?(r.payout=0,r.status="push"):s(r,d)})),e(t,r.status,r.payout))}))}(a,k),b(Object(P.g)([W.c.NEW_GAME])))}),[b,H,k]),A=d.a.useCallback((function(a,e,n){console.log(t[a].hands[e].cards[n])}),[t]),T=d.a.useCallback((function(a,e,t){b(Object(I.h)(a,t))}),[b]);return function(){var a=t[e.player];if(!u&&!s){if(a){if(!a.isBot&&0!==a.id)return void O(a.hands[e.hand]);if(a.isBot&&0!==a.id)return void function(a,e,t,n,c,r){if(a){var i=a.weight||0,s=a.soft,d=j([e.cards[0]]).weight,o=j([a.cards[0]]).weight,l=j([a.cards[1]]).weight;i<22?o===l?2===o||3===o||7===o?d<=7?c():n():4===o?5===d||6===d?c():n():5===o?d<=9?t():n():6===o?d<=6?c():n():9===o?7===d||d>=10?r():c():8===o||11===o?c():r():i<20&&s?13===i||14===i?5===d||6===d?t():n():15===i||16===i?d>=4&&d<=6?t():n():17===i?d>=3&&d<=6?t():n():18===i?d>=2&&d<=6?t():7===d||8===d?r():n():19===i&&(6===d?t():r()):i<17&&!s?i>=5&&i<=8?n():9===i?d>=3&&d<=6?t():n():10===i?d>=2&&d<=9?t():n():11===i?t():12===i?d>=4&&d<=6?r():n():i>=13&&i<=16&&(d>=2&&d<=6?r():n()):r():r()}}(t[e.player].hands[e.hand],t[t.length-1].hands[0],m,p,x,f)}!n.includes(W.c.NEW_GAME)&&w(t)}}(),Object(h.jsxs)(h.Fragment,{children:[Object(h.jsx)(M,{}),Object(h.jsx)(E.a,{betHandler:T,cardClickHandler:A,gameFunctions:n,onClick:function(a){switch(a){case W.c.NEW_GAME:g(t);break;case W.c.FINISH_BETTING:v(t);break;case W.c.STAY:f();break;case W.c.HIT:p();break;case W.c.DOUBLE:m();break;case W.c.SPLIT:x();break;default:console.error("Unknown Game Function: ",a)}},hideHands:s,players:t,turn:e})]})}}}]);
//# sourceMappingURL=g_bj.169a677f.chunk.js.map