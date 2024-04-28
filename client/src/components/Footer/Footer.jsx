import React from 'react'
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';

function Footer() {
  return (
    <Box >
        <AppBar position="static" sx={{ display: 'flex', flexDirection: 'row', gap: 5, justifyContent: 'center', background: '#999', boxShadow: 'none' }}>
            <Typography variant="h6" component="div" >Developed by: Hussain Amet</Typography>
            <Typography variant="h6" component="div" >Phone no.: 8739975253</Typography>
        </AppBar>
    </Box>
  )
}

export default Footer
