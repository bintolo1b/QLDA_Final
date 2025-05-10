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
import { Button, Input } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function createData(id, name, status, SeeMore) {
  return { id, name, status, SeeMore };
}

const rows = [
  createData(84564564, 'Sinh vien A', 2, 40570),
  createData(98764564, 'Sinh vien B', 0, 180139),
  createData(98756325, 'Sinh vien C', 1, 90989),
  createData(98652366, 'Sinh vien D', 1, 10239),
  createData(13286564, 'Sinh vien E', 1, 83348),
  createData(86739658, 'Sinh vien F', 0, 410780),
  createData(13256498, 'Sinh vien G', 2, 70999),
  createData(98753263, 'Sinh vien H', 2, 10570),
  createData(98753275, 'Sinh vien Y', 1, 98063),
  createData(98753291, 'Sinh vien K', 0, 14001)
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
    label: 'Student Name'
  },
  {
    id: 'profile',
    align: 'right',
    disablePadding: false,
    label: 'Profile'
  },
  {
    id: 'status',
    align: 'left',
    disablePadding: false,
    label: 'Status'
  },
  {
    id: 'Upload',
    align: 'right',
    disablePadding: false,
    label: 'Upload Avatar'
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

function StudentStatus({ status }) {
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
    default:
      color = 'error';
      title = 'Need Image';
  }

  return (
    <Stack direction="row" sx={{ gap: 1, alignItems: 'center' }}>
      <Dot color={color} />
      <Typography>{title}</Typography>
    </Stack>
  );
}

// ==============================|| ORDER TABLE ||============================== //

export default function StudentTable() {
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
                  <TableCell align="right" onClick={() => navigate(`/student/${row.id}`)} style={{ cursor: 'pointer' }}>
                    <Button variant='contained'>Profile</Button>
                  </TableCell>
                  <TableCell>
                    <StudentStatus status={row.status} />
                  </TableCell>
                 
                  <TableCell align="right" style={{ cursor: 'pointer' }}>
                    <label htmlFor='upload-file'>
                      <input
                        type="file"
                        id="upload-file"
                        style={{ display: 'none' }} // Ẩn input
                      />
                      <Button variant="contained" component="span">
                        Upload File
                      </Button>
                    </label>
                    
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

StudentStatus.propTypes = { status: PropTypes.number };
