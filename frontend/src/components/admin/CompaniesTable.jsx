import React from 'react'

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import Paper from '@mui/material/Paper';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Edit2, Eye, MoreHorizontal } from 'lucide-react';
import { useSelector } from 'react-redux';
import { Avatar, AvatarImage } from '../ui/avatar';
import { useNavigate } from 'react-router-dom';






const CompaniesTable = () => {


 const { companies} = useSelector(store => store.company);

const navigate = useNavigate();
 return (
    <div>
      <TableContainer component={Paper} sx={{ borderRadius: 3, mt: 3 }}>
        <Table>
          <caption style={{ captionSide: 'top', fontWeight: 'bold', fontSize: '1.1rem', padding: '10px' }}>
            List of Companies
          </caption>
          
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Logo</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Company Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }} className="text-right">Action</TableCell>
            </TableRow>
          </TableHead>
          
          <TableBody>
            {/* Check if companies exist and has length */}
            {companies && companies.length > 0 ? (
              companies.map((company) => (
                <TableRow key={company._id} hover>
                  <TableCell>
                    <Avatar>
                      <AvatarImage src={company.logo} />
                    </Avatar>
                  </TableCell>
                  <TableCell>{company.name}</TableCell>
                  <TableCell>{company.createdAt?.split("T")[0]}</TableCell>
                  <TableCell className="text-right cursor-pointer">
                    <Popover>
                      <PopoverTrigger>
                        <MoreHorizontal className="text-black" />
                      </PopoverTrigger>
                      <PopoverContent className="w-32">
                        <div
                          className='flex items-center gap-2 cursor-pointer'
                          onClick={() => navigate(`/admin/companies/${company._id}`)}
                        >
                          <Edit2 className='w-4' />
                          <span>Edit</span>
                        </div>
                        <div 
                          className='flex items-center gap-2 cursor-pointer mt-2 hover:bg-gray-100 p-2 rounded'
                          onClick={() => navigate(`/admin/companies/${company._id}/jobs`)}
                        >
                          <Eye className='w-4' />
                          <span>View Jobs</span>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No companies registered yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};


export default CompaniesTable

//  <div onClick={()=> navigate(`/admin/companies/${job._id}`)} className='flex items-center gap-2 w-fit cursor-pointer'>

//  <div onClick={()=> navigate(`/admin/jobs/${job._id}/applicants`)} className='flex items-center w-fit gap-2 cursor-pointer mt-2'>