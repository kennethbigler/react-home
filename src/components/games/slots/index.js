// react
import React, {Component} from 'react';
import types from 'prop-types';
// redux
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {payout, updateBet} from '../../../store/modules/players';
// components
import {SlotMachine} from './SlotMachine';
// material ui
import RaisedButton from 'material-ui/RaisedButton';
import {
  Table,
  TableBody,
  TableRow,
  TableRowColumn,
  TableHeader,
  TableHeaderColumn,
} from 'material-ui/Table';
// functions
import map from 'lodash/map';
// Parents: Main

/* --------------------------------------------------
* Slot Machine
* -------------------------------------------------- */
class SM extends Component {
  // Prop Validation
  static propTypes = {
    // types = [array, bool, func, number, object, string, symbol].isRequired
    playerActions: types.shape({
      payout: types.func.isRequired,
      updateBet: types.func.isRequired,
    }).isRequired,
    players: types.arrayOf(
      types.shape({
        id: types.number.isRequired,
        money: types.number.isRequired,
        bet: types.number.isRequired,
      })
    ).isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      reel: SlotMachine.pullHandle(),
    };
  }

  updateSlotMachine = () => {
    const {payout} = this.props.playerActions;
    const {id, money, bet} = this.props.players[0];
    const dealer = this.props.players[this.props.players.length - 1];
    let reel = SlotMachine.pullHandle();
    let exchange = SlotMachine.getPayout(reel, bet) - bet;
    payout(id, 'win', money, exchange);
    payout(dealer.id, 'win', dealer.money, -exchange);
    this.setState({reel});
  };

  // https://vegasclick.com/games/slots/how-they-work
  render() {
    const {reel} = this.state;
    const {players} = this.props;
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
        <h1>Welcome to Ken&apos;s Casino Slot Machine</h1>
        <div className="row" style={{marginTop: '2em'}}>
          <div className="col-sm-6">
            <div className="row" style={{marginBottom: '1em'}}>
              <div className="col-sm-3">
                <RaisedButton
                  label="Spin"
                  onClick={this.updateSlotMachine}
                  primary
                  style={{marginBottom: 15}}
                />
              </div>
              <div className="col-sm-9">
                <Table fixedHeader selectable={false}>
                  <TableBody displayRowCheckbox={false} stripedRows>
                    {slots}
                  </TableBody>
                </Table>
              </div>
            </div>
            <Table fixedHeader selectable={false}>
              <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
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
          <div className="col-sm-6">
            <Table fixedHeader selectable={false}>
              <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                <TableRow>
                  <TableHeaderColumn>Slot Roll</TableHeaderColumn>
                  <TableHeaderColumn>Payout</TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody displayRowCheckbox={false} showRowHover>
                {map(SlotMachine.payoutTable, (row, i) => (
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
const mapStateToProps = (state /* , ownProps*/) => ({players: state.players});
const mapDispatchToProps = (dispatch) => ({
  playerActions: bindActionCreators({payout, updateBet}, dispatch),
});
export const Slots = connect(mapStateToProps, mapDispatchToProps)(SM);
