import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateName, updateBot } from '../../store/modules/players';
import Toggle from 'material-ui/Toggle';
import TextField from 'material-ui/TextField';
// Parents: Main

/* --------------------------------------------------
* Home
* -------------------------------------------------- */
class Home extends Component {
  constructor(props) {
    super(props);
    // set bot status
    const { players } = props;
    const isBot = [];
    players.forEach(p => isBot.push(p.isBot));
    // set state
    this.state = { isBot };
    this.styles = {
      namepad: {
        maxWidth: '420px',
        width: '100%',
        display: 'block',
        margin: 'auto'
      }
    };
  }

  componentWillReceiveProps(nextProps) {
    // get old player and current player
    const { players: old } = this.props;
    const { players } = nextProps;

    if (old !== players) {
      const isBot = [];
      players.forEach(p => isBot.push(p.isBot));
      this.state = { isBot };
    }
  }

  handleToggle = (id, isChecked) => {
    this.props.playerActions.updateBot(id, isChecked);
  };

  handleKeyPress = (e, id) => {
    if (e.key === 'Enter') {
      this.props.playerActions.updateName(id, e.target.value);
    }
  };

  render() {
    const { players } = this.props;
    const { isBot } = this.state;
    const { namepad } = this.styles;
    return (
      <div>
        <h2>Welcome to my ReactJS Game Projects</h2>
        <h3>
          This site was created to learn, check out the{' '}
          <a href="https://github.com/kennethbigler/react-home">
            {'<'}source code{' />'}
          </a>
        </h3>
        <hr />
        <div style={namepad}>
          <h4 className="col-xs-9">Edit Player Names</h4>
          <h4 className="col-xs-3">Is Bot?</h4>
          {players.map(
            (p, i) =>
              p.id !== 0 ? (
                <span key={`${p.name},${i}`}>
                  <div className="col-xs-9">
                    <TextField
                      defaultValue={p.name}
                      onKeyPress={e => this.handleKeyPress(e, p.id)}
                      hintText="Enter Player Name"
                    />
                  </div>
                  <div className="col-xs-3" style={{ marginTop: '12px' }}>
                    <Toggle
                      toggled={isBot[i]}
                      onToggle={(e, isC) => this.handleToggle(p.id, isC)}
                    />
                  </div>
                </span>
              ) : (
                <div key={`${p.name},${i}`}>
                  <h4 className="col-xs-9">{p.name}</h4>
                  <div className="col-xs-3">
                    <Toggle defaultToggled disabled />
                  </div>
                </div>
              )
          )}
        </div>
      </div>
    );
  }
}

// Prop Validation
Home.propTypes = {
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
    playerActions: bindActionCreators({ updateName, updateBot }, dispatch)
  };
}

export const GameHome = connect(mapStateToProps, mapDispatchToProps)(Home);
