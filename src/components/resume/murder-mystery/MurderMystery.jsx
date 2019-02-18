import React, { Component } from 'react';
import map from 'lodash/map';
import { Typography } from '@material-ui/core';
import profiles, { CASINO } from '../../../constants/murder';
import MurderMysteryPanel from './MurderMysteryPanel';
// Parents: Main

class MurderMystery extends Component {
  state = {
    expanded: null,
  };

  handleChange = panel => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : null,
    });
  };

  render() {
    const { expanded } = this.state;

    return (
      <div>
        <Typography variant="h2" gutterBottom>{`Murder at ${CASINO}`}</Typography>
        {map(profiles, (profile, i) => {
          const {
            role, importance, person, gender, description, hint, clue,
          } = profile;

          return (
            <MurderMysteryPanel {...{
              key: i,
              expanded,
              role,
              importance,
              person,
              gender,
              description,
              hint,
              clue,
              expandedKey: `${i}`,
              handleChange: this.handleChange,
            }}
            />
          );
        })}
      </div>
    );
  }
}

export default MurderMystery;
