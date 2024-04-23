import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { useEffect, useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/memberDetailsSlice';

export default function Header() {
  const navigate = useNavigate();
  const [state, setState] = useState(false);
  const [memberData, setMemberData] = useState()

  const data = useSelector((state) => state.member.memberDetails)
  const dispatch = useDispatch();

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setState(open);
  };

  const logo = () => {
    dispatch(logout());
    localStorage.removeItem('phone')
    navigate('/login')
  }

  useEffect(() => {
    setMemberData(data);
  }, [data])

  const list = () => (
    <Box
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        <Link className='text-decoration-none text-body-secondary' to="/admin/profile">
          <ListItem>
            <ListItemButton>
              <ListItemText>Home</ListItemText>
            </ListItemButton>
          </ListItem>
        </Link>
        <Link className='text-decoration-none text-body-secondary' to="/admin/members">
          <ListItem>
            <ListItemButton>
              <ListItemText>All Members</ListItemText>
            </ListItemButton>
          </ListItem>
        </Link>
        <Link className='text-decoration-none text-body-secondary' to="/admin/update/add-savings">
          <ListItem>
            <ListItemButton>
              <ListItemText>Add Saving</ListItemText>
            </ListItemButton>
          </ListItem>
        </Link>
        <Link className='text-decoration-none text-body-secondary' to="/admin/update/give-loan">
          <ListItem>
            <ListItemButton>
              <ListItemText>Give Loan</ListItemText>
            </ListItemButton>
          </ListItem>
        </Link>
        <Link className='text-decoration-none text-body-secondary' to="/admin/update/add-loan-installment">
          <ListItem>
            <ListItemButton>
              <ListItemText>Add Loan Installment</ListItemText>
            </ListItemButton>
          </ListItem>
        </Link>
      </List>
    </Box>
  );

  return (
    <>
      <Box sx={{ flexGrow: 1 }} className="mb-4" >
        <AppBar position="static">
          <Toolbar>
            {memberData?.auth?.data?.role.includes('host') ?
              <div>
                    <Button onClick={toggleDrawer(true)} sx={{color: 'white', minWidth: 0}}><MenuIcon /></Button>
                    <Drawer
                      open={state}
                      onClose={toggleDrawer(false)}
                    >
                      {list()}
                    </Drawer>
              </div>
            :
              ''
            }
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Association Funds
              </Typography>
              {memberData?.auth?.data?.role? <Button color="inherit" onClick={logo}>Logout</Button> : ''}
          </Toolbar>
        </AppBar>
      </Box>
    </>
  );
}
