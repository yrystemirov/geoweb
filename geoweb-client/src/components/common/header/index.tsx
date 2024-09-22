// src/components/Header.tsx
import { MouseEvent, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
import { Person as UserIcon } from '@mui/icons-material';
import { useAuth } from '../../../hooks/useAuth';
const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthorized, logout } = useAuth();

  const { i18n, t } = useTranslation();

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  const pages = [
    { title: 'About', url: '/about', label: 'About' },
    { title: 'Docs', url: '/documentation', label: 'Documentation' },
  ];

  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const loginBtn = isAuthorized ? (
    <MenuItem onClick={() => logout()}>{t('signOut')}</MenuItem>
  ) : (
    <MenuItem onClick={() => navigate('/login')}>{t('signIn')}</MenuItem>
  );

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
                  alignItems: 'center',
                }}
              >
                {pages.map((page, index) => (
                  <Link
                    key={index}
                    to={page.url}
                    style={{ color: 'inherit', textDecoration: 'none' }}
                    {...(page.url.includes('http')
                      ? {
                          target: '_blank',
                          rel: 'noopener noreferrer',
                        }
                      : {})}
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
                {isAuthorized ? (
                  <>
                    <IconButton onClick={handleOpenUserMenu}>
                      <UserIcon />
                    </IconButton>
                    <Menu
                      id="user-menu"
                      anchorEl={anchorElUser}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                      }}
                      keepMounted
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                      }}
                      open={Boolean(anchorElUser)}
                      onClose={handleCloseUserMenu}
                    >
                      <MenuItem>
                        <Link to="/dashboard/maps" style={{ color: 'inherit', textDecoration: 'none' }}>
                          <Typography textAlign="center">{t('dashboard')}</Typography>
                        </Link>
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          handleCloseUserMenu();
                          logout();
                        }}
                      >
                        {t('signOut')}
                      </MenuItem>
                    </Menu>
                  </>
                ) : (
                  <Link to="/login" style={{ color: 'inherit', textDecoration: 'none' }}>
                    <Button
                      sx={{
                        color: 'black',
                        display: 'block',
                        textTransform: 'none',
                        padding: '0',
                        minWidth: 'none',
                        marginLeft: '24px',
                        fontWeight: location.pathname === '/login' ? 'bold' : 'normal',
                        ':hover': {
                          fontWeight: 'bold',
                          backgroundColor: 'inherit',
                        },
                      }}
                    >
                      {t('signIn')}
                    </Button>
                  </Link>
                )}
              </Box>
              <Box
                sx={{
                  display: { xs: 'flex', md: 'none' },
                }}
              >
                <IconButton onClick={handleOpenNavMenu} color="inherit" sx={{ background: 'rgb(90 78 78)' }}>
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
                      to={page.url}
                      {...(page.url.includes('http')
                        ? {
                            target: '_blank',
                            rel: 'noopener noreferrer',
                          }
                        : {})}
                    >
                      <MenuItem key={index} onClick={handleCloseNavMenu}>
                        <Typography textAlign="center">{page.label}</Typography>
                      </MenuItem>
                    </Link>
                  ))}
                  {loginBtn}
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
