/*global app */
app.controller('RouletteController', ['$scope', 'RouletteService', '$log', function ($scope, $RS, $log) {
    "use strict";
    $scope.step = "Finish Betting";
    $scope.bets = [];
    $scope.crap = $RS.crap;
    $scope.betVal = 1;
    $scope.showResult = false;
    $scope.payout = 0;
    $scope.stats = $RS.calc;
    
    /***** UI Functions *****/
    function clearWinners() {
        var reset = [];
        reset = document.getElementsByClassName("winner");
        while (reset.length > 0) {
            reset[0].classList.remove("winner");
        }
        $RS.reset();
        return;
    }
    
    function setWinners(spin) {
        var winners = [],
            i = 0;
        winners = document.getElementsByClassName("s" + spin);
        for (i = 0; i < winners.length; i += 1) {
            winners[i].classList.add("winner");
        }
        $scope.payout = $RS.evaluate(spin);
        return;
    }
    
    $scope.setBet = function (n) {
        $scope.betVal += n;
        return;
    };
    
    $scope.placeBet = function (pos) {
        if ($scope.step !== "Finish Betting") {
            return;
        }
        $RS.placeBet(pos, $scope.betVal);
        return;
    };
    
    /***** Controller *****/
    $scope.play = function () {
        switch ($scope.step) {
        case "Finish Betting":
            $scope.step = "Spin";
            break;
        case "Spin":
            setWinners($RS.spin());
            $scope.showResult = true;
            $scope.step = "New Game";
            break;
        case "New Game":
            clearWinners();
            $scope.showResult = false;
            $scope.step = "Finish Betting";
            break;
        default:
            $log.error("Error: stepped out of bounds");
            $scope.step = "Finish Betting";
            break;
        }
        return;
    };
}]);


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