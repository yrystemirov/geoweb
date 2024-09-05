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
import SignInButton from './signInButton';

// header
const Header: React.FC<{}> = () => {
    //const { t } = useTranslation('common');
    const router = useRouter();
    const { pathname, asPath, query } = router;

    const pages = [
        // { title: 'Главная', url: '/' },
        { title: 'About', url: '/about', label: 'About' },
        { title: 'Docs', url: '/documentation', label: 'Documentation' },
        { title: 'Conacts', url: '/contacts', label: 'Contacts' },
    ];

    const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
    
    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

   
    const switchLanguage = (locale: string = 'kk') => {
        //TODO
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
                            // alignItems: 'center',
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
                                isFooter={false}
                            />
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    color: 'black',
                                }}
                            >
                                <Typography
                                    sx={{
                                        paddingRight: '10px',
                                        lineHeight: 0.9,
                                        // TODO: translate
                                        //color: router.locale === 'kk' ? 'white' : 'black',
                                        marginLeft:'10px',    
                                        borderRight: '1px solid black',
                                        ':hover': {
                                            color: '#5dbb67',
                                        },
                                        cursor: 'pointer',
                                    }}
                                    onClick={() => switchLanguage('kk')}
                                >Қаз
                                </Typography>
                            </Box>
                        </Box>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                            }}
                        >
                            <Box
                                sx={{
                                    display: { xs: 'none', md: 'flex' },
                                }}
                            >
                                {pages.map((page, index) => (
                                    <Link
                                        key={index}
                                        href={page.url}
                                        {...(page.url.includes('http')
                                            ? {
                                                  target: '_blank',
                                                  rel: 'noopener noreferrer',
                                              }
                                            : {})}
                                        passHref
                                    >
                                        <Button
                                            onClick={handleCloseNavMenu}
                                            sx={{
                                                color: 'black',
                                                display: 'block',
                                                textTransform: 'none',
                                                padding: '0',
                                                minWidth: 'none',
                                                marginLeft: '24px',
                                                fontWeight: router.route === page.url ? 'bold' : 'normal',
                                                ':hover': {
                                                    fontWeight: 'bold',
                                                    backgroundColor: 'inherit',
                                                },
                                            }}
                                        >
                                            {page.label}
                                        </Button>
                                    </Link>
                                ))}
                            </Box>
                            <Box
                                sx={{
                                    display: { xs: 'flex', md: 'none' },
                                }}
                            >
                                <IconButton onClick={handleOpenNavMenu} color="inherit" sx={{background:'rgb(90 78 78)'}}>
                                    <MenuIcon />
                                </IconButton>
                                <Menu
                                    id="menu-appbar"
                                    anchorEl={anchorElNav}
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'left',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'left',
                                    }}
                                    open={Boolean(anchorElNav)}
                                    onClose={handleCloseNavMenu}
                                    sx={{
                                        display: { xs: 'block', md: 'none' },
                                    }}
                                >
                                    {pages.map((page, index) => (
                                        <Link
                                            key={index}
                                            href={page.url}
                                            {...(page.url.includes('http')
                                                ? {
                                                      target: '_blank',
                                                      rel: 'noopener noreferrer',
                                                  }
                                                : {})}
                                            passHref
                                        >
                                            <MenuItem key={index} onClick={handleCloseNavMenu}>
                                                <Typography textAlign="center">{page.label}</Typography>
                                            </MenuItem>
                                        </Link>
                                    ))}
                                </Menu>
                            </Box>
                            <SignInButton />
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
        </Box>
    );
};

export default Header;
