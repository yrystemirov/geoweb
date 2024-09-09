// src/components/Footer.tsx
import React from 'react';


import { useCallback, useState } from 'react';

// const PortalButton = dynamic(() => impor('./PortalButton'), { ssr: false });
// const SignInButton = dynamic(() => impor('./SignInButton'), { ssr: false });

import Logo from '../logo';

import AppBar from '@mui/material/AppBar';
import { Toolbar, Typography, Box } from '@mui/material';
import Container from '@mui/material/Container';
//import Cookies from 'js-cookie';

const Footer: React.FC<{}> = () => {
    //const { t } = useTranslation('common');

    
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                fontSize: '16px',
            }}
        >
            <AppBar
                sx={{
                    backgroundColor: '#fff',
                    boxShadow: 'none',
                }}
                position="static"
            >
                <Container maxWidth={false}>
                  <Toolbar>
                    {/* Centered Text */}
                    <Typography
                      variant="body1"
                      sx={{ flexGrow: 1, textAlign: 'center', color: 'black' }}
                    >
                      © 2024 Your Company. All Rights Reserved.
                    </Typography>

                    {/* Right-Side Logo */}
                    <Logo
                          iconStyles={{
                              display: { xs: 'none', md: 'flex' },
                              mr: 1,
                          }}
                          textDisplayStyles={{ xs: 'none', md: 'flex' }}
                          textVariant="h6"
                          textFlexGrow={0}
                          isFooter={true} ></Logo>
                  </Toolbar>
                </Container>
            </AppBar>
        </Box>
    );
};

export default Footer;


// import './Footer.css'; // Import the CSS file

// const Footer: React.FC = () => {
//   return (
    
//       <Box component="footer" sx={{ backgroundColor: '#333', padding: '20px' }}>
//       <Toolbar>
//         {/* Centered Text */}
//         <Typography
//           variant="body1"
//           sx={{ flexGrow: 1, textAlign: 'center', color: 'white' }}
//         >
//           © 2024 Your Company. All Rights Reserved.
//         </Typography>

//         {/* Right-Side Logo */}
//         <Logo
//               iconStyles={{
//                   display: { xs: 'none', md: 'flex' },
//                   mr: 1,
//               }}
//               textDisplayStyles={{ xs: 'none', md: 'flex' }}
//               textVariant="h6"
//               textFlexGrow={0}
//               isFooter={true} ></Logo>
//       </Toolbar>
//     </Box>
//   );
// };

