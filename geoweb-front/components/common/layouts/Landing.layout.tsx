// components/Layout.tsx
import { ReactNode } from 'react';
import Header from '../header';
import { SxProps } from '@mui/material';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Footer from '../footer';

interface LayoutProps {
  children: ReactNode;
  sx?: SxProps;
}

const LandingLayout: React.FC<LayoutProps> = ({ children,sx = {} }) => {
  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
            <Box display="flex">
                <CssBaseline />
                <Header />
            </Box>

            <Box
                display="flex"
                flexDirection="column"
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 0,
                    ...sx,
                    overflow: 'hidden',
                }}
            >
                {children}
            </Box>
            <a
                style={{
                    position: 'absolute',
                    bottom: '5px',
                    right: '5px',
                    zIndex: 1000,
                }}
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-5 right-5 bg-neutral-700 p-4 rounded-lg"
            >
                <img src="/images/logo_main2.png" alt="GeoWeb" style={{ width: '9rem' }} />
            </a>
            {/* <Footer /> */}
        </Box>

  );

  
};

export default LandingLayout;
