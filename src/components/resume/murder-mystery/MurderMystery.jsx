import React, { Component } from 'react';
import map from 'lodash/map';
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
        <h2>
          {`Murder at ${CASINO}`}
        </h2>
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
