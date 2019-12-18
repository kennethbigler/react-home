import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import useOpenState from '../../hooks/useOpenState';

interface InfoPopupProps {
  /** popup content */
  children: React.ReactNodeArray;
  /** title content */
  title: string | React.ReactElement;
  /** button content */
  buttonText?: string | React.ReactElement;
}

const InfoPopup = (props: InfoPopupProps): React.ReactElement => {
  const [isOpen, handleOpen, handleClose] = useOpenState();
  const { buttonText, title, children } = props;

  return (
    <>
      <Button color="primary" onClick={handleOpen as React.MouseEventHandler} variant="contained">
        {buttonText || title}
      </Button>
      <Dialog onClose={handleClose as React.MouseEventHandler} open={isOpen} maxWidth="md" fullWidth>
        <DialogTitle>
          {title}
        </DialogTitle>
        <DialogContent>
          {children}
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={handleClose as React.MouseEventHandler}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default InfoPopup;
