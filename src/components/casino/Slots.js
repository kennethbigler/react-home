import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { payout, updateBet } from '../../store/modules/players';
import {
  SlotMachine,
  CHERRY,
  BAR,
  DOUBLE_BAR,
  TRIPLE_BAR,
  SEVEN,
  JACKPOT
} from '../../apis/SlotMachine';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import { Table, TableBody, TableRow, TableRowColumn } from 'material-ui/Table';
// Parents: Main

const NUMREELS = 3;

function pullHandle() {
  let reel = [];
  for (let i = 0; i < NUMREELS; i += 1) {
    reel[i] = SlotMachine.spin();
  }
  return reel;
}

function getPayout(reel, bet) {
  const m01 = reel[0] === reel[1];
  const m02 = reel[0] === reel[2];
  const bars = [BAR, DOUBLE_BAR, TRIPLE_BAR];
  // if we have 3 of a kind
  if (m01 && m02) {
    switch (reel[0]) {
      case JACKPOT:
        return 1666 * bet;
      case SEVEN:
        return 300 * bet;
      case TRIPLE_BAR:
        return 100 * bet;
      case DOUBLE_BAR:
        return 50 * bet;
      case BAR:
        return 25 * bet;
      case CHERRY:
        return 12 * bet;
      default:
        return 0;
    }
  } else if (
    bars.indexOf(reel[0]) !== -1 &&
    bars.indexOf(reel[1]) !== -1 &&
    bars.indexOf(reel[2]) !== -1
  ) {
    // if we have 3 of any bar
    return 12 * bet;
  } else if (reel.indexOf(CHERRY, reel.indexOf(CHERRY) + 1) !== -1) {
    // if we have 2 cherries
    return 6 * bet;
  } else if (reel.indexOf(CHERRY) !== -1) {
    // if we have 1 cherry
    return 3 * bet;
  }
  return 0;
}

/* --------------------------------------------------
* Slot Machine
* -------------------------------------------------- */
class SM extends Component {
  constructor(props) {
    super(props);

    this.styles = {
      paperCircle: {
        minHeight: '73px',
        textAlign: 'center'
      }
    };

    this.state = {
      reel: pullHandle()
    };
  }

  updateSlotMachine = () => {
    const { payout } = this.props.playerActions;
    const { id, money, bet } = this.props.players[0];
    const dealer = this.props.players[this.props.players.length - 1];
    let reel = pullHandle();
    let exchange = getPayout(reel, bet) - bet;
    payout(id, 'win', money, exchange);
    payout(dealer.id, 'win', dealer.money, -exchange);
    this.setState({ reel });
  };

  // https://vegasclick.com/games/slots/how-they-work
  render() {
    const { reel } = this.state;
    const { paperCircle } = this.styles;
    const player = this.props.players[0];
    const dealer = this.props.players[this.props.players.length - 1];
    return (
      <div>
        <h1>Welcome to Ken's Casino Slot Machine</h1>
        <div className="row">
          <div className="col-sm-6">
            <div className="col-xs-12" style={{ marginBottom: '1em' }}>
              <Table selectable={false}>
                <TableBody displayRowCheckbox={false}>
                  <TableRow>
                    <TableRowColumn>{player.name}</TableRowColumn>
                    <TableRowColumn>${player.money}</TableRowColumn>
                  </TableRow>
                  <TableRow>
                    <TableRowColumn>House</TableRowColumn>
                    <TableRowColumn>${dealer.money}</TableRowColumn>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            <Paper style={paperCircle} className="col-sm-3" zDepth={2}>
              <h2>{reel[0]}</h2>
            </Paper>
            <Paper style={paperCircle} className="col-sm-3" zDepth={2}>
              <h2>{reel[1]}</h2>
            </Paper>
            <Paper style={paperCircle} className="col-sm-3" zDepth={2}>
              <h2>{reel[2]}</h2>
            </Paper>
            <div className="col-sm-3">
              <RaisedButton
                label="Spin"
                primary={true}
                onTouchTap={this.updateSlotMachine}
              />
            </div>
          </div>
          <div className="col-sm-6">
            <Table selectable={false}>
              <TableBody displayRowCheckbox={false}>
                <TableRow>
                  <TableRowColumn>3x Jackpot</TableRowColumn>
                  <TableRowColumn>1666 : 1</TableRowColumn>
                </TableRow>
                <TableRow>
                  <TableRowColumn>7 7 7</TableRowColumn>
                  <TableRowColumn>300 : 1</TableRowColumn>
                </TableRow>
                <TableRow>
                  <TableRowColumn>Ξ Ξ Ξ</TableRowColumn>
                  <TableRowColumn>100 : 1</TableRowColumn>
                </TableRow>
                <TableRow>
                  <TableRowColumn>= = =</TableRowColumn>
                  <TableRowColumn>50 : 1</TableRowColumn>
                </TableRow>
                <TableRow>
                  <TableRowColumn>— — —</TableRowColumn>
                  <TableRowColumn>25 : 1</TableRowColumn>
                </TableRow>
                <TableRow>
                  <TableRowColumn>3 of any bar</TableRowColumn>
                  <TableRowColumn>12 : 1</TableRowColumn>
                </TableRow>
                <TableRow>
                  <TableRowColumn>3x cherries</TableRowColumn>
                  <TableRowColumn>12 : 1</TableRowColumn>
                </TableRow>
                <TableRow>
                  <TableRowColumn>2x cherries</TableRowColumn>
                  <TableRowColumn>6 : 1</TableRowColumn>
                </TableRow>
                <TableRow>
                  <TableRowColumn>1x cherry</TableRowColumn>
                  <TableRowColumn>3 : 1</TableRowColumn>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    );
  }
}

// Prop Validation
SM.propTypes = {
  //  PropTypes = [string, object, bool, number, func, array].isRequired
  playerActions: PropTypes.object.isRequired,
  players: PropTypes.array.isRequired
};

// react-redux export
function mapStateToProps(state /*, ownProps*/) {
  return { players: state.players };
}

function mapDispatchToProps(dispatch) {
  return {
    playerActions: bindActionCreators({ payout, updateBet }, dispatch)
  };
}

export const Slots = connect(mapStateToProps, mapDispatchToProps)(SM);
