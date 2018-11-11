import React from 'react';
import Popup from './Popup';

const Header = () => {
  const containerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  return (
    <div style={containerStyle}>
      <h1>Blackjack (21)</h1>
      <Popup />
    </div>
  );
};

export default Header;
