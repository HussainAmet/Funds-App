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
import Tooltip from '@mui/material/Tooltip';
import InfoIcon from '@mui/icons-material/Info';
import Zoom from '@mui/material/Zoom';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import './header.css'

export default function Header() {
  const navigate = useNavigate();
  const [state, setState] = useState(false);
  const [memberData, setMemberData] = useState()

  const data = useSelector((state) => state.member.memberDetails)
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);

  const handleTooltipClose = () => {
    setOpen(false);
  };

  const handleTooltipOpen = () => {
    setOpen(true);
  };

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
        <Link className='text-decoration-none text-body-secondary' to="host/dashboard/profile">
          <ListItem>
            <ListItemButton>
              <ListItemText>Home</ListItemText>
            </ListItemButton>
          </ListItem>
        </Link>
        <Link className='text-decoration-none text-body-secondary' to="host/members">
          <ListItem>
            <ListItemButton>
              <ListItemText>All Members</ListItemText>
            </ListItemButton>
          </ListItem>
        </Link>
        <Link className='text-decoration-none text-body-secondary' to="host/update/add-savings">
          <ListItem>
            <ListItemButton>
              <ListItemText>Add Saving</ListItemText>
            </ListItemButton>
          </ListItem>
        </Link>
        <Link className='text-decoration-none text-body-secondary' to="host/update/give-loan">
          <ListItem>
            <ListItemButton>
              <ListItemText>Give Loan</ListItemText>
            </ListItemButton>
          </ListItem>
        </Link>
        <Link className='text-decoration-none text-body-secondary' to="host/update/add-loan-installment">
          <ListItem>
            <ListItemButton>
              <ListItemText>Add Loan Installment</ListItemText>
            </ListItemButton>
          </ListItem>
        </Link>
        <ListItem className='text-decoration-none position-absolute info'>
            <ListItemText>Developer: Hussain Amet (8739975253)</ListItemText>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      {/* <Footer /> */}
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
              <div className='d-flex'>
                {!memberData?.auth?.data?.role.includes('host') ?
                  <ClickAwayListener onClickAway={handleTooltipClose}>
                      <Tooltip
                        PopperProps={{
                            disablePortal: true,
                        }}
                        onClose={handleTooltipClose}
                        TransitionComponent={Zoom}
                        open={open}
                        disableFocusListener
                        disableHoverListener
                        disableTouchListener
                        title="Developer: Hussain Amet (8739975253)"
                      >
                        <button onClick={handleTooltipOpen} className='border-0 bg-transparent me-3' ><InfoIcon className='text-white' /></button>
                      </Tooltip>
                  </ClickAwayListener>
                :
                  ''
                }
                {memberData?.auth?.data?.role? <Button color="inherit" onClick={logo}>Logout</Button> : ''}
              </div>
          </Toolbar>
        </AppBar>
      </Box>
    </>
  );
}
