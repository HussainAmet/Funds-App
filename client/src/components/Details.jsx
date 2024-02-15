import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useState } from 'react';

const columns = [
  { id: 'year', label: 'Year', minWidth: 120,},
  { id: 'month', label: 'Month', minWidth: 60,},
  { id: 'amount', label: 'Amount', align: 'right', format: (value) => value.toLocaleString('en-US'),},
];

function createData(year, month, amount, code) {
  return { year, month, amount, code };
}

const rows = [
    { year: 2023, month: 'January', amount: 6000, code: 0 },
    createData(2024, 'January', 4000, 1),
    createData(2024, 'February', 5000,2),
    createData(2024, 'March', 6000, 3),
    createData(2024, 'April', 7000, 4),
    createData(2024, 'May', 8000, 5),
    createData(2024, 'June', 9000, 6),
    createData(2024, 'July', 8000, 7),
    createData(2024, 'August', 7000, 8),
    createData(2024, 'September', 6000, 9),
    createData(2024, 'October', 5000, 10),
    createData(2024, 'November', 4000, 11),
    createData(2024, 'December', 3000, 12),
];

export default function Details() {

    const [year, setYear] = useState('');

    const handleChange = (event) => {
        setYear(event.target.value);
    };

  return (

    <>
        <Box sx={{ minWidth: 130 }}>
        <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Select Year</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={year}
                label="Select Year"
                onChange={handleChange}
            >
            <MenuItem value={0}>All</MenuItem>
            <MenuItem value={2017}>2017</MenuItem>
            <MenuItem value={2018}>2018</MenuItem>
            <MenuItem value={2019}>2019</MenuItem>
            <MenuItem value={2020}>2020</MenuItem>
            <MenuItem value={2021}>2021</MenuItem>
            <MenuItem value={2022}>2022</MenuItem>
            <MenuItem value={2023}>2023</MenuItem>
            <MenuItem value={2024}>2024</MenuItem>
            </Select>
        </FormControl>
        </Box>

        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 370 }}>
            <Table stickyHeader aria-label="sticky table">
            <TableHead>
                <TableRow>
                {columns.map((column) => (
                    <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                    >
                    {column.label}
                    </TableCell>
                ))}
                </TableRow>
            </TableHead>
            <TableBody>
                {rows.map((row) => {
                    return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                        {columns.map((column) => {
                        const value = row[column.id];
                        return (
                            <TableCell key={column.id} align={column.align}>
                            {column.format && typeof value === 'number'
                                ? column.format(value)
                                : value}
                            </TableCell>
                        );
                        })}
                    </TableRow>
                    );
                })}
            </TableBody>
            </Table>
        </TableContainer>
        </Paper>
    </>
  );
}