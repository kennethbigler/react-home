import * as React from "react";
import Typography from "@mui/material/Typography";
import { useRecoilState } from "recoil";
import Player from "../game-table/board/player/Player";
import Deck from "../../../apis/Deck";
import regicideState, {
  RegicideGameFunctions as RGF,
  newRegicideGameState,
} from "../../../recoil/regicide-state";
import { DBPlayer } from "../../../recoil/player-atom";
import GameTable from "../game-table";

const addSPR = (gameFunctions: RGF[], soloPlayRedraws: number) =>
  soloPlayRedraws ? [...gameFunctions, RGF.REDRAW] : gameFunctions;

/** https://www.badgersfrommars.com/assets/RegicideRulesA4.pdf */
const Regicide: React.FC = () => {
  const [{ regicide, turn, players }, setState] = useRecoilState(regicideState);
  const {
    gameFunctions,
    castleDeck,
    tavernDeck,
    discardDeck,
    currentMonster,
    cardsToDiscard,
    hideHands,
    gameOver,
    currentHealth,
    soloPlayRedraws,
    playerCount,
  } = regicide;

  // UI Functions
  const handleCardClick = (
    playerNo: number,
    handNo: number,
    cardNo: number
  ) => {
    console.log(`card clicked: ${playerNo}, ${handNo}=0, ${cardNo}`);
  };

  const handleGFClick = (gameFunction: string) => {
    switch (gameFunction) {
      case RGF.NEW_GAME: {
        // get decks
        const { castleDeck: initialCD, tavernDeck: preTD } =
          Deck.getNewRegicideDeck(playerCount);
        // prep monster deck
        const { deck: newTD, cards: newMonster } = Deck.dealDeck(preTD, 1);
        // prep player decks
        let newCD = [...initialCD];
        const newPlayers = players.map((player: DBPlayer): DBPlayer => {
          const { deck: tempCD, cards: hand } = Deck.dealDeck(
            initialCD,
            9 - playerCount
          );
          newCD = [...tempCD];
          return { ...player, hands: [{ cards: hand }] };
        });
        // update state
        setState({
          regicide: {
            gameFunctions:
              playerCount > 1
                ? [RGF.START]
                : addSPR([RGF.FIGHT, RGF.YIELD], soloPlayRedraws),
            castleDeck: newCD,
            tavernDeck: newTD,
            discardDeck: [],
            currentMonster: newMonster[0],
            cardsToDiscard: [],
            hideHands: playerCount > 1,
            gameOver: false,
            currentHealth: newMonster[0].weight * 2,
            soloPlayRedraws: playerCount === 1 ? 2 : 0,
            playerCount,
          },
          players: newPlayers,
          turn: { player: 0, hand: 0 },
        });
        return;
      }
      case RGF.START:
        setState({
          regicide: {
            ...regicide,
            gameFunctions: addSPR([RGF.FIGHT, RGF.YIELD], soloPlayRedraws),
            hideHands: playerCount > 1,
          },
          players,
          turn,
        });
        return;
      case RGF.REDRAW: {
        // discard current hand
        const discard = [...discardDeck];
        players[0].hands[0].cards.forEach((card) => {
          discard.push(card);
        });
        // redraw new hand
        const { deck: newCD, cards: hand } = Deck.dealDeck(castleDeck, 8);
        const newPlayer: DBPlayer = { ...players[0], hands: [{ cards: hand }] };
        // update state
        setState({
          regicide: {
            ...regicide,
            castleDeck: newCD,
            discardDeck: discard,
            soloPlayRedraws: soloPlayRedraws - 1,
          },
          players: [newPlayer],
          turn,
        });
        return;
      }
      case RGF.YIELD: // 1. Yield is chosen, skip to 4
        setState({
          regicide: {
            ...regicide,
            gameFunctions: addSPR([RGF.DISCARD], soloPlayRedraws),
            hideHands: playerCount > 1,
          },
          players,
          turn,
        });
        return;
      case RGF.FIGHT: // 1. Fight is chosen
        // 2. Activate the suit power(s)
        // remember companions/combos/immunity/jesters
        // Hearts - heal from the discard
        // Diamonds - draw cards
        // Clubs - double damage
        // Spades - shield or reduce damage
        // 3. Deal damage to the enemy and check
        // defeated enemy ? i : 4
        // i. place enemy in exactDamage ? tavernDeck : discardDeck
        // ii. place played cards in discardDeck
        // iii. get new monster from tavernDeck
        // iv. player goes back to step 1, skipping 4.
        setState({
          regicide: {
            ...regicide,
            gameFunctions: addSPR([RGF.DISCARD], soloPlayRedraws),
            hideHands: playerCount > 1,
          },
          players,
          turn,
        });
        return;
      case RGF.DISCARD: // 4. Suffer Damage from the enemy
        // discard cards equal to monster.weight
        // lose or move to next player
        setState({
          regicide: {
            ...regicide,
            gameFunctions:
              playerCount > 1
                ? [RGF.START]
                : addSPR([RGF.FIGHT, RGF.YIELD], soloPlayRedraws),
            hideHands: playerCount > 1,
          },
          players,
          turn,
        });
        return;
      default:
        console.log(gameFunction);
    }
  };

  return (
    <>
      <Typography variant="h2" component="h1" gutterBottom>
        Regicide
      </Typography>
      <GameTable
        cardClickHandler={handleCardClick}
        cardsToDiscard={cardsToDiscard}
        hideHands={hideHands}
        gameOver={gameOver}
        gameFunctions={gameFunctions}
        onClick={handleGFClick}
        players={players}
        turn={turn}
      />
    </>
  );
};

export default Regicide;
