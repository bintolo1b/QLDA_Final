import PropTypes from 'prop-types';
// material-ui
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// third-party
import { NumericFormat } from 'react-number-format';

// project imports
import Dot from './Dot';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function createData(id, name, totalClass, status, SeeMore) {
  return { id, name, totalClass, status, SeeMore };
}

const rows = [
  createData(84564564, 'Thay A', 40, 2, 40570),
  createData(98764564, 'Thay B', 300, 0, 180139),
  createData(98756325, 'Thay C', 355, 1, 90989),
  createData(98652366, 'THay D', 50, 1, 10239),
  createData(13286564, 'Thay E', 100, 1, 83348),
  createData(86739658, 'Thay F', 99, 0, 410780),
  createData(13256498, 'Thay G', 125, 2, 70999),
  createData(98753263, 'Thay H', 89, 2, 10570),
  createData(98753275, 'Thay Y', 185, 1, 98063),
  createData(98753291, 'Thay K', 100, 0, 14001)
];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: 'id',
    align: 'left',
    disablePadding: false,
    label: 'ID'
  },
  {
    id: 'name',
    align: 'left',
    disablePadding: true,
    label: 'Teacher Name'
  },
  {
    id: 'totalClass',
    align: 'right',
    disablePadding: false,
    label: 'Total class'
  },
  {
    id: 'status',
    align: 'left',
    disablePadding: false,

    label: 'Status'
  },
  {
    id: 'SeeMore',
    align: 'right',
    disablePadding: false,
    label: 'See more'
  }
];

// ==============================|| ORDER TABLE - HEADER ||============================== //

function OrderTableHead({ order, orderBy }) {
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

function TeacherStatus({ status }) {
  let color;
  let title;

  switch (status) {
    case 0:
      color = 'warning';
      title = 'Warning';
      break;
    case 1:
      color = 'success';
      title = 'Success';
      break;
    case 2:
      color = 'error';
      title = 'Error';
      break;
    default:
      color = 'primary';
      title = 'None';
  }

  return (
    <Stack direction="row" sx={{ gap: 1, alignItems: 'center' }}>
      <Dot color={color} />
      <Typography>{title}</Typography>
    </Stack>
  );
}

// ==============================|| ORDER TABLE ||============================== //

export default function TeacherTable() {
  const order = 'asc';
  const orderBy = 'id';
  const navigate = useNavigate()
  return (
    <Box>
      <TableContainer
        sx={{
          width: '100%',
          overflowX: 'auto',
          position: 'relative',
          display: 'block',
          maxWidth: '100%',
          '& td, & th': { whiteSpace: 'nowrap' }
        }}
      >
        <Table aria-labelledby="tableTitle">
          <OrderTableHead order={order} orderBy={orderBy} />
          <TableBody>
            {stableSort(rows, getComparator(order, orderBy)).map((row, index) => {
              const labelId = `enhanced-table-checkbox-${index}`;

              return (
                <TableRow
                  hover
                  role="checkbox"
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  tabIndex={-1}
                  key={row.id}
                >
                  <TableCell component="th" id={labelId} scope="row">
                    <Link color="secondary">{row.id}</Link>
                  </TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell align="right">{row.totalClass}</TableCell>
                  <TableCell>
                    <TeacherStatus status={row.status} />
                  </TableCell>
                  <TableCell align="right" onClick={() => navigate(`/class/${row.id}`)} style={{ cursor: 'pointer' }}>
                    <Button>Detail</Button>
                  </TableCell>

                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

OrderTableHead.propTypes = { order: PropTypes.any, orderBy: PropTypes.string };

TeacherStatus.propTypes = { status: PropTypes.number };
