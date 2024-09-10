// src/components/Header.tsx
import React, { useState } from 'react';
import { Link, useNavigate,useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
import { getStoredToken } from '../../../utils/auth/tokenStorage';
import { Person as UserIcon } from '@mui/icons-material';
//import Cookies from 'js-cookie';
//import { useRouter } from 'next/router';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthorized = Boolean(getStoredToken())

  const { i18n, t } = useTranslation();

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  const pages = [
    // { title: 'Главная', url: '/' },
    { title: 'About', url: '/about', label: 'About' },
    { title: 'Docs', url: '/documentation', label: 'Documentation' },
    isAuthorized
      ? { title: 'Alrady Authorized', disabled: true, url: '#', label: <UserIcon /> }
      : { title: t('signIn'), url: '/login', label: 'Sign In' },
  ];

  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
    
    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };


  // return (
  //   <header style={{ padding: '1rem', backgroundColor: '#f5f5f5', borderBottom: '1px solid #ddd' }}>
  //     <nav>
  //       <Link to="/" style={{ marginRight: '1rem' }}>{t('welcome')}</Link>
  //       <Link to="/dashboard" style={{ marginRight: '1rem' }}>{t('dashboard')}</Link>
  //       <Link to="/login">{t('login')}</Link>

  //       {/* Language Dropdown */}
  //       <select onChange={(e) => changeLanguage(e.target.value)} style={{ marginLeft: '1rem' }}>
  //         <option value="en">English</option>
  //         <option value="fr">Français</option>
  //         <option value="es">Español</option>
  //       </select>
  //     </nav>
  //   </header>
  // );

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
                    marginLeft: '10px',
                    borderRight: '1px solid black',
                    ':hover': {
                      color: '#5dbb67',
                    },
                    cursor: 'pointer',
                    color: i18n.language === 'kk' ? '#5dbb67' : 'black',
                  }}
                  onClick={() => changeLanguage('kk')}
                >
                  Қаз
                </Typography>
                <Typography
                  sx={{
                    paddingRight: '10px',
                    lineHeight: 0.9,
                    // TODO: translate
                    //color: router.locale === 'kk' ? 'white' : 'black',
                    marginLeft: '10px',
                    borderRight: '1px solid black',
                    ':hover': {
                      color: '#5dbb67',
                    },
                    cursor: 'pointer',
                    color: i18n.language === 'ru' ? '#5dbb67' : 'black',
                  }}
                  onClick={() => changeLanguage('ru')}
                >
                  Рус
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
                    aria-disabled={page.disabled}
                    key={index}
                    to={page.url}
                    {...(page.url.includes('http')
                      ? {
                          target: '_blank',
                          rel: 'noopener noreferrer',
                        }
                      : {})}
                  >
                    <Button
                      disabled={page.disabled}
                      onClick={handleCloseNavMenu}
                      sx={{
                        color: 'black',
                        display: 'block',
                        textTransform: 'none',
                        padding: '0',
                        minWidth: 'none',
                        marginLeft: '24px',
                        fontWeight: location.pathname === page.url ? 'bold' : 'normal',
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
                <IconButton
                  onClick={handleOpenNavMenu}
                  color="inherit"
                  sx={{ background: 'rgb(90 78 78)' }}
                >
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
                      aria-disabled={page.disabled}
                      key={index}
                      to={page.url}
                      {...(page.url.includes('http')
                        ? {
                            target: '_blank',
                            rel: 'noopener noreferrer',
                          }
                        : {})}
                    >
                      <MenuItem
                        disabled={page.disabled}
                        key={index}
                        onClick={handleCloseNavMenu}
                      >
                        <Typography textAlign="center">{page.label}</Typography>
                      </MenuItem>
                    </Link>
                  ))}
                </Menu>
              </Box>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </Box>
  );
};

export default Header;
