import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { payout, updateBet } from '../../store/modules/players';
import { SlotMachine } from '../../apis/SlotMachine';
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
      reel: SlotMachine.pullHandle()
    };
  }

  updateSlotMachine = () => {
    const { payout } = this.props.playerActions;
    const { id, money, bet } = this.props.players[0];
    const dealer = this.props.players[this.props.players.length - 1];
    let reel = SlotMachine.pullHandle();
    let exchange = SlotMachine.getPayout(reel, bet) - bet;
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
                {SlotMachine.payoutTable.map((row, i) => (
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
