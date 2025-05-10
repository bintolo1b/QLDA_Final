import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box } from '@mui/material';

function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
  }
  
  const rows = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
    createData('Gingerbread2', 356, 16.0, 49, 3.9),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
    createData('Gingerbread2', 356, 16.0, 49, 3.9),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
    createData('Gingerbread2', 356, 16.0, 49, 3.9),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
    createData('Gingerbread2', 356, 16.0, 49, 3.9),
    createData('Gingerbread2', 356, 16.0, 49, 3.9),
    createData('Gingerbread2', 356, 16.0, 49, 3.9),
    createData('Gingerbread2', 356, 16.0, 49, 3.9),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
  ];

function GradleClass() {
    return (
        <Box sx={styles.container}>
            <TableContainer component={Paper} sx={{ boxShadow: "none", overflow: "hidden" }}>
                <Table size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={styles.tableCell}>Due date</TableCell>
                            <TableCell sx={styles.tableCell} align="right">Assignment</TableCell>
                            <TableCell sx={styles.tableCell} align="right">Status</TableCell>
                            <TableCell sx={styles.tableCell} align="right">Feedback</TableCell>
                            <TableCell sx={styles.tableCell} align="right">Grade</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {rows.map((row) => (
                        <TableRow
                        key={row.name}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                        <TableCell component="th" scope="row" sx={styles.tableCell}>
                            {row.name}
                        </TableCell>
                        <TableCell sx={styles.tableCell} align="right">{row.calories}</TableCell>
                        <TableCell sx={styles.tableCell} align="right">{row.fat}</TableCell>
                        <TableCell sx={styles.tableCell} align="right">{row.carbs}</TableCell>
                        <TableCell sx={styles.tableCell} align="right">{row.protein}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    )
}
  

export default GradleClass;

const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px 0px"
    },
    tableContent: {
        width: "100%",
    },
    tableCell: {
        padding: "15px 50px",
    }
}