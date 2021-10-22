import withStyles from '@mui/styles/withStyles';
import TableCell from '@mui/material/TableCell';

const DarkTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
}))(TableCell);

export default DarkTableCell;
