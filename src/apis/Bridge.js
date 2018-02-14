/*global app*/
app.factory('BridgeService', [
  '$log',
  '$deck',
  function($log, $deck) {
    'use strict';
    let factory = {};

    factory.deal = function() {
      let i,
        hands = [];
      $deck.shuffle();
      for (i = 0; i < 4; i += 1) {
        hands[i] = $deck.deal(13);
        hands[i].sort($deck.suitSort);
      }
      return hands;
    };

    return factory;
  }
]);

/*global $, app */

app.controller('BridgeController', [
  '$scope',
  'BridgeService',
  '$log',
  function($scope, $BS, $log) {
    'use strict';
    let hands = [],
      bids = [
        ['none'],
        ['1 ♣', '1 ♦', '1 ♥', '1 ♠', '1 NT'],
        ['2 ♣', '2 ♦', '2 ♥', '2 ♠', '2 NT'],
        ['3 ♣', '3 ♦', '3 ♥', '3 ♠', '3 NT'],
        ['4 ♣', '4 ♦', '4 ♥', '4 ♠', '4 NT'],
        ['5 ♣', '5 ♦', '5 ♥', '5 ♠', '5 NT'],
        ['6 ♣', '6 ♦', '6 ♥', '6 ♠', '6 NT'],
        ['7 ♣', '7 ♦', '7 ♥', '7 ♠', '7 NT']
      ];
    $scope.bids = bids;
    $log.log($scope.bids);
    $scope.currentBid = $scope.bids[0];
    $scope.turn = 0;
    $scope.betCounter = 0;

    // deal hands
    hands = $BS.deal();
    $scope.hands = hands;
    //$scope.hands = [hands[$scope.turn]];

    // analyze then bid round robin
    $scope.setBid = function(x, y) {
      if ($scope.betCounter >= 3) {
        return;
      }
      $log.log($scope.turn, $scope.betCounter);
      let i, temp;
      $scope.turn = ($scope.turn + 1) % 4;
      if (x === 0) {
        $scope.betCounter += 1;
        if ($scope.betCounter >= 3) {
          $scope.bids = [[$scope.currentBid]];
        }
        return;
      }
      $log.log('test');
      $scope.betCounter = 0;
      temp = $scope.bids;
      $scope.currentBid = $scope.bids[x][y];
      $scope.bids = [['none']];
      $scope.bids[1] = [];
      for (i = y; i < temp[x].length; i += 1) {
        $scope.bids[1].push(temp[x][i]);
      }
      if (x === 7) {
        return;
      }
      for (i = x + 1; i < temp.length; i += 1) {
        $scope.bids.push(temp[i]);
      }
    };

    // winner plays 2 hands [0, 2] or [1, 3]
    // have to play leading suit if you have it
    // if not, trump suit wins (if exists)
  }
]);
