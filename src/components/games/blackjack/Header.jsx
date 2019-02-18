import React from 'react';
import Typography from '@material-ui/core/Typography';
import InfoPopup from '../../common/InfoPopup';
import Rules from './Rules';
import Help from './help';

const Header = () => (
  <div className="flex-container">
    <Typography variant="h2" gutterBottom>Blackjack (21)</Typography>
    <InfoPopup title="Blackjack Rules">
      <Rules />
      <Help />
    </InfoPopup>
  </div>
);

export default Header;
