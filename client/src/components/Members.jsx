import React, { useEffect, useState } from 'react';
import Table from '@mui/joy/Table';
import Sheet from '@mui/joy/Sheet';
import Button from '@mui/joy/Button';
import Divider from '@mui/joy/Divider';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import DialogActions from '@mui/joy/DialogActions';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import { Link, useNavigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AddMember from './AddMember';
import { useDispatch } from 'react-redux';
import { delMember } from '../store/memberDetailsSlice';
import axios from 'axios';
import config from '../config/config';

export default function Members() {
  const [input, setInput] = useState('')
  const [selectedMember, setSelectedMember] = useState([])
  const [memberData, setMemberData] = useState([]);
  const [memberDetails, setMemberDetails] = useState();
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [open, setOpen] = useState(false);
  const [delId, setDelId] = useState('');
  const [delPhone, setDelPhone] = useState('');
  const [delName, setDelName] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const members = useSelector((state) => state.member.allMembersDetails)
  const currentMember = useSelector((state) => state.member.memberDetails)

  const handleChange = (e) => {
    const { value } = e.target
    setInput(value);
    const filteredMembers = memberData.filter(member =>
      member.data.auth.data.name.toLowerCase().includes(value.toLowerCase())
    );
    setSelectedMember(filteredMembers);
  }

  const deleteMember = async (phone, id) => {
    try {
      const response = await axios.delete(`${config.poductionUrl}${config.requestBaseUrl}delete-member/${id}/${phone}`);
      if (response.data.authResponse.acknowledged === true && response.data.memberResponse.acknowledged === true) {
        if (response.data.authResponse.deletedCount === 1 && response.data.memberResponse.deletedCount === 1) {
          dispatch(delMember({phone: phone, saving: response.data.saving}));
          setSuccess("Member Deleted");
          setTimeout(() => {
            setSuccess('');
          }, 5000);
        } else {
          setError("Something went wrong")
        }
      } else {
        setError("Something went wrong")
      }
    } catch (error) {
      console.log(error);
      setError(error.response.data || "Something went wrong")
    }
  }

  const handleAddMemberClick = () => {
    setShowAddMember(true);
    setIsAddMemberOpen(true);
  };

  const handleAddMemberClose = (success) => {
    setShowAddMember(false);
    setIsAddMemberOpen(false);
    if (success === 'success') {
      setSuccess("Member Added")
      setTimeout(() => {
        setSuccess('');
      }, 5000);
    }
  };

  useEffect(() => {
    setSelectedMember([]);
    setInput('')
    setMemberData(members);
    setMemberDetails(currentMember)
  }, [members, currentMember])

  return (
    <>
      {isAddMemberOpen && <div className='position-fixed top-0 start-0 w-100 h-100 z-1'></div>}
      <div className='profile-info'>
        <p className='fs-2 text-center'>Total Balance: {memberDetails?.totalSavings?.totalSavings}</p>
      </div>
      <div className='d-flex w-100 mb-3 d-flex justify-content-around '>
        <input type="text" placeholder='Search Member' className='ms-3 w-50  border-top-0 border-end-0 border-start-0 border-primary' maxLength={50} value={input} onChange={handleChange} />
        <Link to="/host/members/add-member"><Button variant="solid" onClick={handleAddMemberClick}>Add Member</Button></Link>
      </div>
      <Outlet/>
      <div>
        {error && <span className='fw-semibold text-white mt-2 mb-2 p-2 d-block text-center bg-danger'>{error}</span>}
        {success && <span className='fw-semibold text-bg-success mt-2 mb-2 p-2 d-block text-center'>{success}</span>}
        <Sheet sx={{ height: '72vh', overflow: 'auto'}}>
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
              {selectedMember.length !== 0?
                selectedMember.map((member) => (
                  <tr key={member._id}>
                    <td onClick={() => {navigate(`/member-profile/${member._id}/dashboard/profile`)}} className='ps-4 text-left cursor-pointer'>{member.data.auth.data.name}</td>
                    <td className='text-center'>{member.data.saving}</td>
                    {!member.data.auth.data.role.includes('host')?
                      <td className='text-center'><svg xmlns="http://www.w3.org/2000/svg" onClick={() => {
                        setDelId(member._id);
                        setDelName(member.data.auth.data.name);
                        setDelPhone(member.data.auth._id);
                        setOpen(true);
                      }} width="25" height="25" fill="currentColor" className="bi bi-person-dash cursor-pointer" viewBox="0 0 16 16"><path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7M11 12h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1 0-1m0-7a3 3 0 1 1-6 0 3 3 0 0 1 6 0M8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4"/><path d="M8.256 14a4.5 4.5 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10q.39 0 .74.025c.226-.341.496-.65.804-.918Q8.844 9.002 8 9c-5 0-6 3-6 4s1 1 1 1z"/></svg></td>
                    : <td className='text-center'>Host</td>}
                  </tr>
                ))
              :
                memberData.map((member) => (
                  <tr key={member._id}>
                    <td onClick={() => {navigate(`/member-profile/${member._id}/dashboard/profile`)}} className='ps-4 text-left cursor-pointer'>{member.data.auth.data.name}</td>
                    <td className='text-center'>{member.data.saving}</td>
                    {!member.data.auth.data.role.includes('host')?
                      <td className='text-center'><svg xmlns="http://www.w3.org/2000/svg" onClick={() => {
                        setDelId(member._id);
                        setDelName(member.data.auth.data.name);
                        setDelPhone(member.data.auth._id);
                        setOpen(true);
                      }} width="25" height="25" fill="currentColor" className="bi bi-person-dash cursor-pointer" viewBox="0 0 16 16"><path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7M11 12h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1 0-1m0-7a3 3 0 1 1-6 0 3 3 0 0 1 6 0M8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4"/><path d="M8.256 14a4.5 4.5 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10q.39 0 .74.025c.226-.341.496-.65.804-.918Q8.844 9.002 8 9c-5 0-6 3-6 4s1 1 1 1z"/></svg></td>
                    : <td className='text-center'>Host</td>}
                  </tr>
                ))
              }
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3} align='center'>
                Total Members :- {memberData?.length}
                </td>
              </tr>
            </tfoot>
          </Table>
        </Sheet>
      </div>
      {showAddMember && <AddMember onClose={handleAddMemberClose} />}
      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog variant="outlined" role="alertdialog">
          <DialogTitle>
            <WarningRoundedIcon />
            Confirmation
          </DialogTitle>
          <Divider />
          <DialogContent>
            <p>Are you sure you want to delete the member <span className='text-primary fw-bold'>{delName}</span> ?</p>
          </DialogContent>
          <DialogActions>
            <Button variant="solid" color="danger" onClick={() => {deleteMember(delPhone, delId); setOpen(false)}}>
              Delete Member
            </Button>
            <Button variant="plain" color="neutral" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </DialogActions>
        </ModalDialog>
      </Modal>
    </>
  );
}
