/*global $, app */
app.controller('DealController', ['$scope', 'DealService', function ($scope, $DS) {
    "use strict";
    
    // local variables
    var i, turn, sum, cases,
        board = $DS.board(),
        vals = [1, 2, 5, 10, 25, 50, 75, 100, 200, 300, 400, 500, 750, 1000, 5000, 10000, 25000, 50000, 75000, 100000, 200000, 300000, 400000, 500000, 750000, 1000000];
    // scope variables
    $scope.board = [];
    $scope.caseClass = [];
    $scope.valClass = [];
    $scope.counter = 0;
    $scope.offer = 0;
    $scope.myCase = {loc: 0, val: 0 };
    $scope.showOffer = false;
    $scope.showWinnings = false;
    
    // reset game variables to start fresh
    $scope.newGame = function () {
        $DS.newGame();
        for (i = 0; i < board.length; i += 1) {
            $scope.board[i] = board[i].sCase;
            $scope.caseClass[i] = '';
            $scope.valClass[i] = 'btn-warning';
        }
        turn = 1;
        sum = 3418418;
        cases = 26;
        $scope.counter = 7;
        $scope.showOffer = false;
        $scope.showWinnings = false;
        return;
    };
    // initiate first game
    $scope.newGame();
    
    // called each time a case is selected
    $scope.caseSelect = function (x) {
        if ($scope.counter === 0) {
            // do not allow people to open cases if not right time
            return;
        } else if ($scope.counter === 7) {
            // first case selected as yours
            $scope.counter -= 1;
            $scope.caseClass[x] = "btn-success";
            $scope.myCase.val = $DS.openCase(x);
            $scope.myCase.loc = x;
            return;
        }
        // open all other cases
        // local variables
        var t, n;
        
        // verify case has not been opened already
        n = $DS.openCase(x);
        if (!n) {
            return;
        }
        
        // change visuals of selected case
        $scope.board[x] = '$' + n;
        $scope.caseClass[x] = 'btn-danger';
        t = vals.indexOf(n);
        $scope.valClass[t] = 'btn-danger';
        
        // update calculations for offer
        sum -= n;
        cases -= 1;
        
        // show deal or no deal if last case
        $scope.counter -= 1;
        if ($scope.counter === 0) {
            $scope.offer = (sum / cases) * (turn / 10);
            $scope.showOffer = true;
        }
        return;
    };
    
    // called on selection of Deal
    $scope.deal = function () {
        // set suitcase value
        $scope.board[$scope.myCase.loc] = '$' + $scope.myCase.val;
        // show final board
        $scope.showWinnings = true;
        return;
    };
    
    // called on selection of No Deal
    $scope.noDeal = function () {
        // saying no deal on last case procs deal
        if (cases === 1) {
            $scope.deal();
            return;
        }
        // go back to play view
        $scope.showOffer = false;
        // advance the turn and reset the counter
        turn += 1;
        $scope.counter = (turn < 6) ? 7 - turn : 1;
        return;
    };
}]);