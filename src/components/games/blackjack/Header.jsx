import React from 'react';
import InfoPopup from '../../common/InfoPopup';
import Rules from './Rules';
import Help from './help';

const Header = () => {
  const containerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  return (
    <div style={containerStyle}>
      <h1>Blackjack (21)</h1>
      <InfoPopup title="Blackjack Rules">
        <Rules />
        <Help />
      </InfoPopup>
    </div>
  );
};

export default Header;
