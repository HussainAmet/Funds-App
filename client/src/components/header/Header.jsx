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
import { useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';


export default function Header() {
  const admin = true;
  const navigate = useNavigate();

  const [state, setState] = useState(false);

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState(open);
  };

  const list = () => (
    <Box
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {['Members', 'Add Member','Add Saving', 'Give Loan', 'Add Loan Installment'].map((text) => (
          <ListItem key={text}>
            <ListItemButton>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <Box sx={{ flexGrow: 1 }} className="mb-4" >
        <AppBar position="static">
          <Toolbar>
            {admin ?
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
              <Button color="inherit" onClick={() => {navigate("/login")}}>Logout</Button>
          </Toolbar>
        </AppBar>
      </Box>
    </>
  );
}
