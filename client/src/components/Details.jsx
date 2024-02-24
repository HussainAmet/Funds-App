import Table from '@mui/joy/Table';
import Sheet from '@mui/joy/Sheet';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import config from '../config/config';
import { useSelector } from 'react-redux';

export default function Details() {
    const { id , of } = useParams()

    const [year, setYear] = useState('');
    const [currentMemberData, setCurrentMemberData] = useState([]);

    const handleChange = (event) => {
        setYear(event.target.value);
    };

    const data = useSelector((state) => state.member.memberDetails)

    useEffect(() => {
        if (id) {
            axios.post(`${config.poductionUrl}${config.requestBaseUrl}get-member-details`, { id })
            .then((currentMember) => {
                setCurrentMemberData(currentMember.data.data);
                console.log(currentMember.data.data.savingDetails);
            });
        } else {
            setCurrentMemberData(data)
        }
    }, [of, id, data])

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
        <div>
            <Sheet sx={{ height: '67vh', overflow: 'auto'}}>
                <Table
                    aria-label="table with sticky header"
                    stickyHeader
                    hoverRow
                >
                    <thead>
                        <tr>
                            <th className='text-center'>Year</th>
                            <th className='text-center'>Month</th>
                            <th className='text-center'>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {of === "savings"?
                            currentMemberData?.savingDetails?.map((savingDetail) => (
                                <tr key={savingDetail._id}>
                                    <td className='text-center'>{savingDetail.year}</td>
                                    <td className='text-center'>{savingDetail.month}</td>
                                    <td className='text-center'>{savingDetail.amount}</td>
                                </tr>
                            ))
                        :
                            currentMemberData?.loanDetails?.map((loanDetail) => (
                                <tr key={loanDetail._id}>
                                    <td className='text-center'>{loanDetail.year}</td>
                                    <td className='text-center'>{loanDetail.month}</td>
                                    <td className='text-center'>{loanDetail.amount}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan={3} align='center'></td>
                        </tr>
                    </tfoot>
                </Table>
            </Sheet>
        </div>
    </>
  );
}