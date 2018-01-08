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
import {
  Table,
  TableBody,
  TableRow,
  TableRowColumn,
  TableHeader,
  TableHeaderColumn
} from 'material-ui/Table';
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

const payoutTable = [
  {
    win: '3x',
    symbol: JACKPOT,
    payout: 1666
  },
  {
    win: `${SEVEN} ${SEVEN}`,
    symbol: SEVEN,
    payout: 300
  },
  {
    win: `${TRIPLE_BAR} ${TRIPLE_BAR}`,
    symbol: TRIPLE_BAR,
    payout: 100
  },
  {
    win: `${DOUBLE_BAR} ${DOUBLE_BAR}`,
    symbol: DOUBLE_BAR,
    payout: 50
  },
  {
    win: `${BAR} ${BAR}`,
    symbol: BAR,
    payout: 25
  },
  {
    win: '3 of any',
    symbol: 'bar',
    payout: 12
  },
  {
    win: '3x',
    symbol: CHERRY,
    payout: 12
  },
  {
    win: '2x',
    symbol: CHERRY,
    payout: 6
  },
  {
    win: '1x',
    symbol: CHERRY,
    payout: 3
  }
];

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
        <div className="row" style={{ marginTop: '2em' }}>
          <div className="col-sm-6 col-xs-12">
            <div className="col-xs-12" style={{ marginBottom: '1em' }}>
              <Paper style={paperCircle} className="col-xs-3" zDepth={2}>
                <h2>{reel[0]}</h2>
              </Paper>
              <Paper style={paperCircle} className="col-xs-3" zDepth={2}>
                <h2>{reel[1]}</h2>
              </Paper>
              <Paper style={paperCircle} className="col-xs-3" zDepth={2}>
                <h2>{reel[2]}</h2>
              </Paper>
              <div className="col-xs-3">
                <RaisedButton
                  label="Spin"
                  primary={true}
                  onTouchTap={this.updateSlotMachine}
                />
              </div>
            </div>
            <div className="col-xs-12">
              <Table selectable={false} fixedHeader>
                <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                  <TableRow>
                    <TableHeaderColumn>Player</TableHeaderColumn>
                    <TableHeaderColumn>Money</TableHeaderColumn>
                  </TableRow>
                </TableHeader>
                <TableBody displayRowCheckbox={false} showRowHover>
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
          </div>
          <div className="col-sm-6 col-xs-12">
            <Table selectable={false} fixedHeader>
              <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                <TableRow>
                  <TableHeaderColumn>Slot Roll</TableHeaderColumn>
                  <TableHeaderColumn>Payout</TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody displayRowCheckbox={false} showRowHover>
                {payoutTable.map((row, i) => (
                  <TableRow key={i}>
                    <TableRowColumn>
                      {row.win} {row.symbol}
                    </TableRowColumn>
                    <TableRowColumn>{row.payout} : 1</TableRowColumn>
                  </TableRow>
                ))}
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
