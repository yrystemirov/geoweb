import { Box } from '@mui/material';
import React from 'react';
import './about.css';

//import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const About: React.FC = () => {
  return (
    <>
      <Box
        width="100%"
        display="flex"
        justifyContent="center"
        alignItems="top"
        flexDirection="row"
        flex={1}
        position="relative"
        p={0}
      >
        <div className="about-container">
          <h2 className="our-product-heading">GeoWeb</h2>
          {/* <h2 className="our-product-heading">Тараз қаласының жасыл желектерінің дерекқоры</h2> */}
          <div className="description">
          </div>
        </div>
      </Box>
    </>
  );
};

export default About;