import React from 'react';
import { LinearProgress, Box, Typography } from '@mui/material';

const Loader = ({ loading, message }) => {
  return (
    <Box sx={{ width: '100%', textAlign: 'center', padding: '20px' }}>
      {loading && (
        <>
          <Typography variant="h6" gutterBottom>
            {message}
          </Typography>
          <LinearProgress />
        </>
      )}
    </Box>
  );
};

export default Loader;
