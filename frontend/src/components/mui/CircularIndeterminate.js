import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export default function CircularIndeterminate({size=100}) {
  return (
    <Box sx={{ display: 'flex' }} className="mui-spinner-box">
      <CircularProgress size={size}/>
    </Box>
  );
}