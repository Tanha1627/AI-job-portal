import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCaption from '@mui/material/Table'; // optional, we’ll use native <caption> below
import Paper from '@mui/material/Paper';

// Sample data
const rows = [
  { date: '2025-11-01', jobRole: 'Frontend Developer', company: 'Google', status: 'Pending' },
  { date: '2025-11-02', jobRole: 'Backend Engineer', company: 'Amazon', status: 'Accepted' },
  { date: '2025-11-03', jobRole: 'Full Stack Developer', company: 'Microsoft', status: 'Rejected' },
];

function AppliedJobTable() {
  return (
    <TableContainer component={Paper} sx={{ borderRadius: 3, mt: 3 }}>
      <Table>
        {/* Table caption */}
        <caption style={{ captionSide: 'top', fontWeight: 'bold', fontSize: '1.1rem', padding: '10px' }}>
          List of applied jobs
        </caption>

        {/* Table Head */}
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Job Role</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Company</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
          </TableRow>
        </TableHead>

        {/* Table Body */}
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={index} hover>
              <TableCell>{row.date}</TableCell>
              <TableCell>{row.jobRole}</TableCell>
              <TableCell>{row.company}</TableCell>
              <TableCell>{row.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default AppliedJobTable;

