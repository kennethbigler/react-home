import crap from './roulette-table-values';

/*global app*/
app.factory('RouletteService', [
  '$log',
  '$storage',
  function($log, $storage) {
    'use strict';
    let factory = {},
      crap = {},
      stats = [],
      check = [],
      risk = 0;

    //--------------------     RESTful calls to "db"     --------------------//
    factory.calc = {
      red: 0,
      black: 0,
      zeros: 0,
      sum: 0,
      profit: 0
    };
    // this function loads data from the server
    function loadStats() {
      let i = 0,
        red = crap[157].val,
        black = crap[158].val;
      stats = $storage.getRStats();
      factory.calc.profit += stats[stats.length - 1];
      for (i = 0; i < stats.length - 1; i += 1) {
        factory.calc.sum += stats[i];
        if (red.indexOf(i) !== -1) {
          factory.calc.red += stats[i];
        } else if (black.indexOf(i) !== -1) {
          factory.calc.black += stats[i];
        } else {
          factory.calc.zeros += stats[i];
        }
      }
      return;
    }
    loadStats();

    // this function saves the stats to a text document on the server
    function saveStats(roll, profit) {
      //$log.log("post starts");
      let red = crap[157].val,
        black = crap[158].val;
      // update rolls
      stats[roll] += 1;
      factory.calc.sum += 1;
      // update profit
      factory.calc.profit += profit;
      stats[stats.length - 1] += profit;
      // update red/black
      if (red.indexOf(roll) !== -1) {
        factory.calc.red += 1;
      } else if (black.indexOf(roll) !== -1) {
        factory.calc.black += 1;
      } else {
        factory.calc.zeros += 1;
      }
      $storage.postRStats(stats);
      return;
    }

    // this function resets the stats then saves the cleared data to the server
    function clearStats() {
      //post to the server
      stats = [];
      $storage.postRStats(stats);
      $log.log('Statistics cleared and saved');
      return;
    }

    //--------------------     factory to return to controller     --------------------//
    // 37 is 00
    factory.spin = function() {
      let roll = Math.floor(Math.random() * 38);
      if (roll > 37) {
        roll = 37;
      }
      return roll;
    };

    // subtract bet money, add to bet, add to check array
    factory.placeBet = function(i, bet) {
      $storage.sub(bet, 0);
      risk += bet;
      crap[i].bet += bet;
      if (check.indexOf(i) === -1) {
        check.push(i);
      }
      return;
    };

    // evalaute the players hand
    factory.evaluate = function(spin) {
      let payout = 0,
        i = 0;
      // iterate through check array for payout
      for (i = 0; i < check.length; i += 1) {
        if (crap[check[i]].val.indexOf(spin) !== -1) {
          payout += crap[check[i]].payout * crap[check[i]].bet;
        }
      }
      // pay player
      $storage.add(payout, 0);
      saveStats(spin, risk - payout);
      risk = 0;
      return payout;
    };

    // reset the check array and bets
    factory.reset = function() {
      while (check.length > 0) {
        crap[check.pop()].bet = null;
      }
      return;
    };

    return factory;
  }
]);

/*
$http.post('/casino/assets/php/postStats.php', JSON.stringify(stats))
    .error(function (status) {
        $log.log(status);
    });
*/

/*
Inside Bets:
    bets made on various numbers 1 to 36 and zero (pays 35 to 1), called a straight up bet
    Separating the chart into various squares are lines called streets
        putting a chip on the street between 2 numbers, called a split bet
        you will win if either one of them comes up on the spin (pays 17 to 1)
    You can place your chip to cover 3 numbers, known as a street bet (pays 11 to 1)
        The chip is placed at the end of any row of numbers
        includes bets placed at the junctions of '0, 1, 2' and '0, 2, 3'
    You can cover 4 numbers, called a corner bet (pays 8 to 1)
    You can cover 6 numbers, which is called a line bet (pays 5 to 1) by placing a chip on two adjoining streets
        Additionally, for American roulette, there is the Five-number bet which covers '0,00,1,2,3' (pays 6:1)
        the Row 00 bet which covers 0 and 00 (pays 17:1)

Outside Bets:
    These are bets made that do not involve specific numbers
    You can bet a red or a black number will win (color bet) (pays 1 to 1)
    You can bet the number will be odd or even (even/odd bet) (pays 1 to 1)
    You can bet the number will be high (19-36) or low (x <= 18) (high low bet) (pays 1 to 1)
    You can bet on any of the three columns (column bet) (pays 2 to 1)
    The 36 numbers have been broken up into 3 dozens: first dozen, second dozen, and third dozen (dozen bet) (pays 2 to 1)

Minumum bet is $10 with $1 chips

http://www.lasvegasdirect.com/roulette-table-layout.gif
http://www.ildado.com/roulette_table_layout.html
*/
