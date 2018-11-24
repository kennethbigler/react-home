// react
import React, { Component } from 'react';
import types from 'prop-types';
// helpers
import map from 'lodash/map';
import Button from '@material-ui/core/Button';
// components
// Parents: Main

/* --------------------------------------------------
* Dota 2 Picker
* -------------------------------------------------- */
class HeroSelection extends Component {
  // Prop Validation
  static propTypes = {
    // types = [array, bool, func, number, object, string, symbol].isRequired
    characters: types.arrayOf(
      types.shape({
        name: types.string.isRequired,
        selected: types.bool.isRequired,
        attribute: types.string,
      }).isRequired,
    ).isRequired,
    onClick: types.func.isRequired,
  };

  onClick = () => `cats${1}`;

  render() {
    const { characters, onClick } = this.props;
    return (
      <div>
        {map(characters, (char, i) => (
          <Button
            key={char.name}
            variant="outlined"
            color={char.selected ? 'secondary' : 'primary'}
            onClick={() => onClick(i)}
            style={{ margin: 5 }}
          >
            {char.name}
          </Button>
        ))}
      </div>
    );
  }
}

export default HeroSelection;
