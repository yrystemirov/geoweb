import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import { useLoading } from '../components/common/loadingBar/loadingContext';
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { Dashboard as DashboardIcon, Map as MapIcon, Settings as SettingsIcon, Group as GrouprIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const parentUrl = '/dashboard';

const Dashboard: React.FC = () => {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const { t } = useTranslation();

  if (!authContext) {
    // Handle the case where context is not available (this should not happen if used correctly)
    throw new Error('AuthContext must be used within an AuthProvider');
  }

  const { logout } = authContext;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const { setLoading } = useLoading(); // Access the loading context

  useEffect(() => {
    // Start loading when the component mounts
    setLoading(true);

    // Simulate an async operation like fetching data
    const timer = setTimeout(() => {
      setLoading(false); // Stop loading after 3 seconds
    }, 3000);

    // Cleanup function to stop loading if the component unmounts
    return () => clearTimeout(timer);
  }, []);

  // Menu items configuration
  const menuItems = [
    { text: t('dictionaries'), path: '/dictionaries', icon: <DashboardIcon />, component: <>{t('dictionaries')}</> },
    { text: t('users'), path: '/users', icon: <GrouprIcon />, component: <>{t('users')}</> },
    { text: t('mapSettings'), path: '/mapSettings', icon: <MapIcon />, component: <>{t('mapSettings')}</> },
    {
      text: t('layers'),
      path: '/layers',
      icon: <MapIcon />,
      component: <>{t('layers')}</>,
      children: [{ text: t('styleEditor'), path: '/edit', icon: <SettingsIcon />, component: <>{t('styleEditor')}</> }],
    },
    { text: t('layerAttributes'), path: '/layerAttributes', icon: <SettingsIcon />, component: <>{t('layerAttributes')}</> },
  ];

  const getRecursiveChildrenRoutes = (item: any) => {
    if (item.children) {
      return item.children.map((child: any) => (
        <>
          <Route key={child.text} path={child.path} element={child.element} />
          {getRecursiveChildrenRoutes(child)}
        </>
      ));
    }
    return null;
  }

  return (
    <Box
      display="flex"
      flexDirection="row"
      height="100%"
      flex={1}
      border={'1px solid #ddd'}
    >
      {/* Sidebar */}
      <Box
        borderRight={'1px solid #ddd'}
        width={300}
      >
        <List>
          {menuItems.map((item) => (
            <>
              <ListItem
                key={item.text}
                disablePadding
              >
                <ListItemButton
                  component={Link}
                  to={`${parentUrl}${item.path}`}
                  selected={window.location.pathname === `${parentUrl}${item.path}`}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
              {item.children &&
                item.children.map((child) => (
                  <ListItem
                    key={child.text}
                    disablePadding
                    sx={{ pl: 4 }}
                  >
                    <ListItemButton
                      component={Link}
                      to={`${parentUrl}${child.path}`}
                      selected={window.location.pathname === `${parentUrl}${child.path}`}
                    >
                      <ListItemIcon>{child.icon}</ListItemIcon>
                      <ListItemText primary={child.text} />
                    </ListItemButton>
                  </ListItem>
                ))}
            </>
          ))}
        </List>
      </Box>

      <Box
        flex={1}
        p={2}
      >
        <Routes>
          {menuItems.map((item) => (
            <>
              <Route
                key={item.text}
                path={item.path}
                element={item.component}
              />
              {getRecursiveChildrenRoutes(item)}
            </>
          ))}
        </Routes>
      </Box>
    </Box>
  );
};

export default Dashboard;
