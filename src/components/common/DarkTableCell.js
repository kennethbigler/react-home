import withStyles from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';

const DarkTableCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
}))(TableCell);

export default DarkTableCell;
