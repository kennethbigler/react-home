// react
import React, { Component } from 'react';
import types from 'prop-types';
// helpers
import map from 'lodash/map';
import Button from '@material-ui/core/Button';
import { Typography } from '@material-ui/core';
import styles from './HeroSelection.styles';
// Parents: Main

const heroType = types.shape({
  attribute: types.string,
  name: types.string.isRequired,
  selected: types.oneOfType([types.string, types.bool]).isRequired,
}).isRequired;

/* --------------------------------------------------
* Dota 2 Picker
* -------------------------------------------------- */
class HeroSelection extends Component {
  getButtonCharacteristics = (status) => {
    switch (status) {
      case false: return { variant: 'outlined', color: 'primary' };
      case true: return { variant: 'outlined', color: 'secondary' };
      case 'P': return { variant: 'contained', color: 'primary' };
      case 'B': return { variant: 'contained', color: 'secondary' };
      default: return { color: 'secondary' };
    }
  }

  getHeroListForLetter = (heroes, letter) => {
    const { onClick } = this.props;
    return (
      <div key={letter}>
        <Typography variant="h4" style={styles.heroRow}>{letter}</Typography>
        {
          map(heroes, (char, i) => (
            <Button
              key={char.name}
              style={styles.heroButton}
              onClick={() => onClick(letter, i)}
              {...this.getButtonCharacteristics(char.selected)}
            >
              {char.name}
            </Button>
          ))
        }
      </div>
    );
  }

  render() {
    const { characters } = this.props;
    return (<div>{map(characters, this.getHeroListForLetter)}</div>);
  }
}

HeroSelection.propTypes = {
  characters: types.shape({
    A: types.arrayOf(heroType),
    B: types.arrayOf(heroType),
    C: types.arrayOf(heroType),
    D: types.arrayOf(heroType),
    E: types.arrayOf(heroType),
    F: types.arrayOf(heroType),
    G: types.arrayOf(heroType),
    H: types.arrayOf(heroType),
    I: types.arrayOf(heroType),
    J: types.arrayOf(heroType),
    K: types.arrayOf(heroType),
    L: types.arrayOf(heroType),
    M: types.arrayOf(heroType),
    N: types.arrayOf(heroType),
    O: types.arrayOf(heroType),
    P: types.arrayOf(heroType),
    Q: types.arrayOf(heroType),
    R: types.arrayOf(heroType),
    S: types.arrayOf(heroType),
    T: types.arrayOf(heroType),
    U: types.arrayOf(heroType),
    V: types.arrayOf(heroType),
    W: types.arrayOf(heroType),
    X: types.arrayOf(heroType),
    Y: types.arrayOf(heroType),
    Z: types.arrayOf(heroType),
  }),
  onClick: types.func.isRequired,
};

export default HeroSelection;
