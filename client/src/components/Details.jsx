import Table from '@mui/joy/Table';
import Sheet from '@mui/joy/Sheet';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import CircularProgress from '@mui/joy/CircularProgress';

const Months = {
    1: "January",
    2: "February",
    3: "March",
    4: "April",
    5: "May",
    6: "June",
    7: "July",
    8: "August",
    9: "September",
    10: "October",
    11: "November",
    12: "December"
};

export default function Details() {
    const [year, setYear] = useState(0);
    const [years, setYears] = useState([])
    const [savingDetails, setSavingDetails] = useState([]);
    const [loanDetails, setLoanDetails] = useState([]);
    const [loading, setLoading] = useState(true)

    const allMembers = useSelector((state) => state.member.allMembersDetails)
    
    const { id , of } = useParams()

    const handleChange = (event) => {
        setYear(event.target.value);
        if (event.target.value === 0) {
            getYear();
        } else {
            const detailsData = getYear();
            let details = []
            detailsData?.map((detail) => {
                if (Number(detail.year) === event.target.value) {
                    details.push(detail)
                }
            })
            setSavingDetails(details)
        }
    };

    const data = useSelector((state) => state.member.memberDetails)

    const commanYears = (data) => {
        let yearArr = []
        if (of === "savings") {
            data?.savingDetails?.map((savingDetail) => {
                yearArr = [...yearArr, Number(savingDetail.year)]
            })
            setYears([...new Set(yearArr)]);
        } else {
            data?.loanDetails?.map((loanDetail) => {
                yearArr = [...yearArr, Number(loanDetail.year)]
            })
            setYears([...new Set(yearArr)]);
        }
    }

    const getYear = () => {
        if (id) {
            const currentMember = allMembers.find((member) => member._id === id).data;
            setSavingDetails(currentMember.savingDetails);
            setLoanDetails(currentMember.loanDetails);
            commanYears(currentMember);
            if (of === 'savings') {
                return currentMember.savingDetails;
            } else {
                return currentMember.loanDetails;
            }
        } else {
            setSavingDetails(data.savingDetails);
            setLoanDetails(data.loanDetails);
            commanYears(data);
            if (of === 'savings') {
                return data.savingDetails;
            } else {
                return data.loanDetails;
            }
        }
    }

    useEffect(() => {
        setYear(0)
        getYear();
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
        }, 100)
    }, [of, id, data, allMembers])

    return (
    <>
        {!loading?
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
                                    savingDetails?.map((savingDetail) => (
                                        <tr key={savingDetail._id}>
                                            <td className='text-center'>{savingDetail.year}</td>
                                            <td className='text-center'>{Months[savingDetail.month]}</td>
                                            <td className='text-center'>{savingDetail.amount}</td>
                                        </tr>
                                    ))
                                :
                                    loanDetails.map((loanDetail) => (
                                        <tr key={loanDetail._id}>
                                            <td className='text-center'>{loanDetail.year}</td>
                                            <td className='text-center'>{Months[loanDetail.month]}</td>
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
        :
            <div className='text-center'>
                <CircularProgress
                    color="primary"
                    variant="solid"
                    size="sm"
                />
            </div>
        }
    </>
    )
}