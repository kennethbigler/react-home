import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import useOpenState from './hooks/useOpenState';

interface InfoPopupProps {
  children: React.ReactNodeArray;
  title: string | React.ReactElement;
  buttonText?: string | React.ReactElement;
}

const InfoPopup: React.FC<InfoPopupProps> = (props: InfoPopupProps) => {
  const [isOpen, handleOpen, handleClose] = useOpenState();

  const { buttonText, title, children } = props;
  return (
    <>
      <Button color="primary" onClick={handleOpen} variant="contained">
        {buttonText || title}
      </Button>
      <Dialog onClose={handleClose} open={isOpen} maxWidth="md" fullWidth>
        <DialogTitle>
          {title}
        </DialogTitle>
        <DialogContent>
          {children}
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default InfoPopup;
