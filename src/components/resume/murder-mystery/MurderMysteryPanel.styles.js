import TableCell from '@material-ui/core/TableCell';
import { withStyles } from '@material-ui/core/styles';

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '95%',
  },
  item: {
    display: 'flex',
  },
};

export const LabelTableCell = withStyles({
  root: {
    maxWidth: 100,
  },
})(TableCell);

export default styles;
