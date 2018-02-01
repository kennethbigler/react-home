import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { payout, updateBet } from '../../store/modules/players';
import { SlotMachine } from '../../apis/SlotMachine';
import RaisedButton from 'material-ui/RaisedButton';
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
    const player = this.props.players[0];
    const dealer = this.props.players[this.props.players.length - 1];
    return (
      <div>
        <h1>Welcome to Ken's Casino Slot Machine</h1>
        <div className="row" style={{ marginTop: '2em' }}>
          <div className="col-sm-6 col-xs-12">
            <div className="row" style={{ marginBottom: '1em' }}>
              <div className="col-xs-9">
                <Table selectable={false} fixedHeader>
                  <TableBody displayRowCheckbox={false} stripedRows>
                    <TableRow>
                      <TableRowColumn>{reel[0][0]}</TableRowColumn>
                      <TableRowColumn>{reel[1][0]}</TableRowColumn>
                      <TableRowColumn>{reel[2][0]}</TableRowColumn>
                    </TableRow>
                    <TableRow>
                      <TableRowColumn>{reel[0][1]}</TableRowColumn>
                      <TableRowColumn>{reel[1][1]}</TableRowColumn>
                      <TableRowColumn>{reel[2][1]}</TableRowColumn>
                    </TableRow>
                    <TableRow>
                      <TableRowColumn>{reel[0][2]}</TableRowColumn>
                      <TableRowColumn>{reel[1][2]}</TableRowColumn>
                      <TableRowColumn>{reel[2][2]}</TableRowColumn>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              <div className="col-xs-3">
                <RaisedButton
                  label="Spin"
                  primary={true}
                  onTouchTap={this.updateSlotMachine}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-xs-12">
                <Table selectable={false} fixedHeader>
                  <TableHeader
                    displaySelectAll={false}
                    adjustForCheckbox={false}
                  >
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
