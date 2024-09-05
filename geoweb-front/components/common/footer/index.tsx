import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useCallback, useMemo, useState } from 'react';

// const PortalButton = dynamic(() => impor('./PortalButton'), { ssr: false });
// const SignInButton = dynamic(() => impor('./SignInButton'), { ssr: false });

import Logo from '../logo';

import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

const Footer: React.FC<{}> = () => {
    //const { t } = useTranslation('common');
    const router = useRouter();
    const { pathname, asPath, query } = router;

    const pages = [
        // { title: 'Главная', url: '/' },
        { title: 'О платформе', url: '/about', label: 'common.about_platform' },
    ];

    const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
    const [anchorElServices, setAnchorElServices] = useState<null | HTMLElement>(null);
    const [anchorElUslugi, setAnchorElUslugi] = useState<null | HTMLElement>(null);

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleServicesOpen = useCallback((event: React.MouseEvent<HTMLElement>) => {
        setAnchorElServices(event.currentTarget);
    }, []);
    const handleUslugiOpen = useCallback((event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUslugi(event.currentTarget);
    }, []);

    const handleServicesClose = useCallback(() => {
        setAnchorElServices(null);
    }, []);
    const handleUslugiClose = useCallback(() => {
        setAnchorElUslugi(null);
    }, []);

    const switchLanguage = (locale: string = 'kk') => {
        if (Cookies.get('NEXT_LOCALE') !== locale) {
            Cookies.set('NEXT_LOCALE', locale, { path: '/' });
            router.push({ pathname, query }, asPath, { locale: locale });
        }
    };
    
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
                <Container maxWidth="lg">
                    <Toolbar
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            minHeight: 'min-content',
                            paddingY: '10px',
                        }}
                        disableGutters
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                // alignItems: 'center',
                            }}
                        >
                            <Logo
                                iconStyles={{
                                    display: { xs: 'none', md: 'flex' },
                                    mr: 1,
                                }}
                                textDisplayStyles={{ xs: 'none', md: 'flex' }}
                                textVariant="h6"
                                textFlexGrow={0}
                                isFooter={true}
                            />
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
        </Box>
    );
};

export default Footer;
