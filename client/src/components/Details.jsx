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
    const [year, setYear] = useState();
    const [years, setYears] = useState([])
    const [currentMemberData, setCurrentMemberData] = useState([]);
    
    const { id , of } = useParams()

    const handleChange = (event) => {
        setYear(event.target.value);
    };

    const data = useSelector((state) => state.member.memberDetails)

    useEffect(() => {
        setYears([])
        setYear(0);
        if (id) {
            axios.post(`${config.poductionUrl}${config.requestBaseUrl}get-member-details`, { id })
            .then((currentMember) => {
                setCurrentMemberData(currentMember.data.data);
                let demoYears = []
                if (of === 'savings' && currentMember.data.data.savingDetails.length !== 0) {
                    const startYear = currentMember.data.data.savingDetails[0].year;
                    const endYear = currentMember.data.data.savingDetails[currentMember.data.data.savingDetails.length-1].year;
                    for (let y = startYear; y < endYear+1; y++) {
                        demoYears.push(y)
                    }
                    setYears(demoYears)
                } else if (of === 'loan' && currentMember.data.data.loanDetails.length !== 0) {
                    const startYear = currentMember.data.data.loanDetails[0].year;
                    const endYear = currentMember.data.data.loanDetails[currentMember.data.data.loanDetails.length-1].year;
                    for (let y = startYear; y < endYear+1; y++) {
                        demoYears.push(y)
                    }
                    setYears(demoYears)
                } else {
                    setYears([]);
                }
            });
        } else {
            setCurrentMemberData(data)
            let demoYears = []
            if (of === 'savings' && data.savingDetails.length !== 0) {
                const startYear = data?.savingDetails[0].year;
                const endYear = data?.savingDetails[data.savingDetails.length-1].year;
                for (let y = startYear; y < endYear+1; y++) {
                    demoYears.push(y)
                }
                setYears(demoYears)
            } else if (of === 'loan' && data.loanDetails.length !== 0) {
                const startYear = data?.loanDetails[0]?.year;
                const endYear = data?.loanDetails[data.loanDetails.length-1].year;
                for (let y = startYear; y < endYear+1; y++) {
                    demoYears.push(y)
                }
                setYears(demoYears)
            } else {
                setYears([]);
            }
        }
    }, [of, id, data])

  return (
      <>
        {years.length !== 0 ?
            <div>
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
                            {years?.map((year) => (
                                <MenuItem key={year} value={year}>{year}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
            </Box>
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
                            {of === "savings" ?
                                currentMemberData?.savingDetails?.map((savingDetail) => (
                                    <tr key={savingDetail._id}>
                                        <td className='text-center'>{savingDetail.year}</td>
                                        <td className='text-center'>{savingDetail.month}</td>
                                        <td className='text-center'>{savingDetail.amount}</td>
                                    </tr>
                                ))
                            :
                                currentMemberData?.loanDetails.map((loanDetail) => (
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
        :
            <div className='m-2 text-bg-info text-black fw-semibold text-center'>
                No Records Found!
            </div>
        }
    </>
  )
}