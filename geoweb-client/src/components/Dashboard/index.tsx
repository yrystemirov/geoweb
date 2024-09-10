import React, { useEffect } from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { Dashboard as DashboardIcon, Map as MapIcon, Settings as SettingsIcon, Group as GrouprIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useLoading } from '../common/loadingBar/loadingContext';
import { Dictionaries } from './Dictionaries';
import { DictionaryEntries } from './Dictionaries/Entries';

const parentUrl = '/dashboard';

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const { setLoading } = useLoading();

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Menu items configuration
  const menuItems = [
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
    { text: t('dictionaries'), path: '/dictionaries', icon: <DashboardIcon />, component: <Dictionaries /> },
  ];

  const getRecursiveChildrenRoutes = (item: any) => {
    if (item.children) {
      return item.children.map((child: any) => (
        <>
          <Route
            key={child.text}
            path={child.path}
            element={child.element}
          />
          {getRecursiveChildrenRoutes(child)}
        </>
      ));
    }
    return null;
  };

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
        width={'calc(100% - 332px)'}
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
          <Route
            path="/dictionaries/:id"
            element={<DictionaryEntries />}
          />
        </Routes>
      </Box>
    </Box>
  );
};

export default Dashboard;
