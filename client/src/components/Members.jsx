import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import { Link, useLocation } from 'react-router-dom';
import Table from '@mui/joy/Table';
import Sheet from '@mui/joy/Sheet';
import { useSelector } from 'react-redux';
import AddMember from './AddMember';

export default function Members() {
  const [memberData, setMemberData] = useState([]);
  const [currentMemberData, setCurrentMemberData] = useState([]);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);

  const data = useSelector((state) => state.member.allMembersDetails)
  const currentMember = useSelector((state) => state.member.memberDetails)

  const deleteMember = (phone) => {
    setMemberData(memberData.filter((member) => member.data.auth.data.phone !== phone))
  }

  const handleAddMemberClick = () => {
    setShowAddMember(true);
    setIsAddMemberOpen(true);
  };

  const handleAddMemberClose = () => {
    setShowAddMember(false);
    setIsAddMemberOpen(false);
  };

  useEffect(() => {
    setCurrentMemberData(currentMember);
    setMemberData(data);
  }, [data, currentMember])

  return (
    <>
      {isAddMemberOpen && <div className='position-fixed top-0 start-0 w-100 h-100 z-1'></div>}
      <div className='profile-info'>
        <p className='fs-2 text-center'>Total Savings: {currentMemberData.totalSavings?.totalSavings}</p>
      </div>
      <div className='d-flex w-100 mb-3 d-flex justify-content-around '>
        <input type="text" placeholder='Search Member' className='ms-3 w-50  border-top-0 border-end-0 border-start-0 border-primary' maxLength={50}/>
        <Link to="/admin/members/add-member"><Button variant="contained" className=' ps-3' onClick={handleAddMemberClick}>Add Member</Button></Link>
      </div>
      <div>
        <Sheet sx={{ height: '67vh', overflow: 'auto'}}>
          <Table
            aria-label="table with sticky header"
            stickyHeader
            stickyFooter
            hoverRow
          >
            <thead>
              <tr>
                <th className='text-center w-50'>Name</th>
                <th className='text-center'>Saving</th>
                <th className='text-center'>Action</th>
              </tr>
            </thead>
            <tbody>
              {memberData.map((member) => (
                <tr key={member._id}>
                  <td className='ps-4 text-left'>{member.data.auth.data.name}</td>
                  <td className='text-center'>{member.data.saving}</td>
                  <td className='text-center'><svg xmlns="http://www.w3.org/2000/svg" onClick={() => {deleteMember(member.data.auth.data.phone)}} width="25" height="25" fill="currentColor" className="bi bi-person-dash cursor-pointer" viewBox="0 0 16 16"><path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7M11 12h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1 0-1m0-7a3 3 0 1 1-6 0 3 3 0 0 1 6 0M8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4"/><path d="M8.256 14a4.5 4.5 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10q.39 0 .74.025c.226-.341.496-.65.804-.918Q8.844 9.002 8 9c-5 0-6 3-6 4s1 1 1 1z"/></svg></td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3} align='center'>
                Total Members :- {memberData.length}
                </td>
              </tr>
            </tfoot>
          </Table>
        </Sheet>
      </div>
      {showAddMember && <AddMember onClose={handleAddMemberClose} />}
    </>
  );
}