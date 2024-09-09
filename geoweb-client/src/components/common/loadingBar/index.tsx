// src/components/LoadingBar.tsx
import React from 'react';
import { Box, LinearProgress } from '@mui/material';

interface LoadingBarProps {
  isLoading: boolean;  // To control when the loading bar is shown
}

const LoadingBar: React.FC<LoadingBarProps> = ({ isLoading }) => {
  return (
    <>
      {isLoading && (
        <Box sx={{ width: '100%', position: 'fixed', top: 0, left: 0, zIndex: 1000 }}>
          <LinearProgress />
        </Box>
      )}
    </>
  );
};

export default LoadingBar;
