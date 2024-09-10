import Typography from '@mui/material/Typography';
import { SxProps } from '@mui/system';
import Box from '@mui/material/Box';
import { Link } from 'react-router-dom';
import React from 'react';

interface ILogo {
    iconStyles: SxProps;
    textDisplayStyles: {
        xs?: 'none' | 'flex';
        md?: 'none' | 'flex';
        lg?: 'none' | 'flex';
    };
    textVariant: 'h5' | 'h6';
    textFlexGrow: 0 | 1;
    isFooter:boolean
}

const Logo: React.FC<ILogo> = ({ iconStyles, textDisplayStyles, textVariant, textFlexGrow, isFooter=false }) => {
    return (
        <Link to="/" className="">
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    colorScheme: 'white'
                }}
            >
                <img src={isFooter?"/images/logo_main2.png":"/images/logo_main.png"} alt="/" width={120} height={30} />
            </Box>
        </Link>
    );
};

export default Logo;
