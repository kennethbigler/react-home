import React from 'react';
import Button from '@material-ui/core/Button';
import { Typography } from '@material-ui/core';
import { DBDota2Hero } from '../../../store/types';

export interface AlphaCharacters {
  A: DBDota2Hero[];
  B: DBDota2Hero[];
  C: DBDota2Hero[];
  D: DBDota2Hero[];
  E: DBDota2Hero[];
  F: DBDota2Hero[];
  G: DBDota2Hero[];
  H: DBDota2Hero[];
  I: DBDota2Hero[];
  J: DBDota2Hero[];
  K: DBDota2Hero[];
  L: DBDota2Hero[];
  M: DBDota2Hero[];
  N: DBDota2Hero[];
  O: DBDota2Hero[];
  P: DBDota2Hero[];
  Q: DBDota2Hero[];
  R: DBDota2Hero[];
  S: DBDota2Hero[];
  T: DBDota2Hero[];
  U: DBDota2Hero[];
  V: DBDota2Hero[];
  W: DBDota2Hero[];
  X: DBDota2Hero[];
  Y: DBDota2Hero[];
  Z: DBDota2Hero[];
}
interface HeroSelectionProps {
  characters: AlphaCharacters;
  onClick: Function;
}

const styles = {
  heroRow: { display: 'inline-block', marginRight: 10 } as React.CSSProperties,
  heroButton: { margin: 5 } as React.CSSProperties,
};

const HeroSelection: React.FC<HeroSelectionProps> = (props: HeroSelectionProps) => {
  const { onClick } = props;

  const getButtonCharacteristics = (status: string | boolean): { variant?: 'outlined' | 'contained'; color: 'primary' | 'secondary' } => {
    switch (status) {
      case false: return { variant: 'outlined', color: 'primary' };
      case true: return { variant: 'outlined', color: 'secondary' };
      case 'P': return { variant: 'contained', color: 'primary' };
      case 'B': return { variant: 'contained', color: 'secondary' };
      default: return { color: 'secondary' };
    }
  };

  const getHeroListForLetter = ([letter, heroes]: [string, DBDota2Hero[]]): React.ReactNode => (
    <div key={letter}>
      <Typography variant="h4" style={styles.heroRow}>{letter}</Typography>
      {heroes.map((char, i) => {
        const { variant, color } = getButtonCharacteristics(char.selected);
        return (
          <Button
            key={char.name}
            style={styles.heroButton}
            onClick={(): void => onClick(letter, i)}
            variant={variant}
            color={color}
          >
            {char.name}
          </Button>
        );
      })}
    </div>
  );

  const { characters } = props;
  return (<>{Object.entries(characters).map(getHeroListForLetter)}</>);
};

export default HeroSelection;
