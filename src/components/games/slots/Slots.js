import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { payout, updateBet } from '../../../store/modules/players';
import { SlotMachine } from './SlotMachine';
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
  // Prop Validation
  static propTypes = {
    // PropTypes = [string, object, bool, number, func, array].isRequired
    playerActions: PropTypes.object.isRequired,
    players: PropTypes.array.isRequired
  };

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
    const { players } = this.props;
    const player = players[0];
    const dealer = players[players.length - 1];

    // generate code for slot machine
    let slots = [];
    for (let i = 0; i < 3; i += 1) {
      // create 3 cells in a row
      let row = [];
      for (let j = 0; j < 3; j += 1) {
        row.push(
          <TableRowColumn key={`${j},${i}`}>{reel[j][i]}</TableRowColumn>
        );
      }
      // separate into rows
      slots.push(<TableRow key={`row${i}`}>{row}</TableRow>);
    }

    return (
      <div>
        <h1>Welcome to Ken's Casino Slot Machine</h1>
        <div className="row" style={{ marginTop: '2em' }}>
          <div className="col-sm-6">
            <div className="row" style={{ marginBottom: '1em' }}>
              <div className="col-9">
                <Table selectable={false} fixedHeader>
                  <TableBody displayRowCheckbox={false} stripedRows>
                    {slots}
                  </TableBody>
                </Table>
              </div>
              <div className="col-3">
                <RaisedButton
                  label="Spin"
                  onClick={this.updateSlotMachine}
                  primary
                />
              </div>
            </div>
            <div className="row">
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
          <div className="col-sm-6">
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
