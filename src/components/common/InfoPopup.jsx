import React, { useState, Fragment } from 'react';
import types from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
// Parents: Board

/* ========================================
 * Popup
 * ======================================== */
const InfoPopup = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  const { buttonText, title, children } = props;
  return (
    <>
      <Button color="primary" onClick={() => { setIsOpen(true); }} variant="contained">
        {buttonText || title}
      </Button>
      <Dialog onClose={() => { setIsOpen(false); }} open={isOpen} maxWidth="md" fullWidth>
        <DialogTitle>
          {title}
        </DialogTitle>
        <DialogContent>
          {children}
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={() => { setIsOpen(false); }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

InfoPopup.propTypes = {
  children: types.oneOfType([types.arrayOf(types.node), types.node]).isRequired,
  title: types.oneOfType([types.string, types.element]).isRequired,
  buttonText: types.oneOfType([types.string, types.element]),
};

export default InfoPopup;
