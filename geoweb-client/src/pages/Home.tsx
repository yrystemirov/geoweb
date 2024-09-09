import React from 'react';
import Box from '@mui/material/Box';
import MapComponent from '../components/publicMap/map';
const Home: React.FC = () => {
  return (
    <Box
      width="100%"
      height="100%"
      display="flex"
      justifyContent="center"
      alignItems="top"
      flexDirection="row"
      flex={1}
      position="relative"
      p={0}
    >
      <MapComponent />
    </Box>
  );
};

export default Home;
