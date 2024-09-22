import React, { Fragment, useEffect } from 'react';
import { Link, Route as DashboardRoute, Routes, useLocation } from 'react-router-dom';
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Map as MapIcon,
  Settings as SettingsIcon,
  Group as GrouprIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useLoading } from '../common/loadingBar/loadingContext';
import { Dictionaries } from './Dictionaries';
import { DictionaryEntries } from './Dictionaries/Entries';
import { MapFolders } from './MapFolders';
import { MapFolderCreate } from './MapFolders/MapFolderCreate';
import { MapFolderEdit } from './MapFolders/MapFolderEdit';
import { MapFolderEditLayers } from './MapFolders/MapFolderEditLayers';

const parentUrl = '/dashboard';

type DashboardRoute = {
  text?: string;
  path: string;
  icon?: JSX.Element;
  component: JSX.Element;
  isMenuItem?: boolean;
  children?: DashboardRoute[];
};

const Dashboard: React.FC = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const { setLoading } = useLoading();

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const routes: DashboardRoute[] = [
    { text: t('users'), path: '/users', icon: <GrouprIcon />, component: <>{t('users')}</>, isMenuItem: true },
    { text: t('maps.title'), path: '/maps', icon: <MapIcon />, component: <MapFolders />, isMenuItem: true },
    { path: '/maps/add', component: <MapFolderCreate /> },
    { path: '/maps/:id/edit', component: <MapFolderEdit /> },
    { path: '/maps/:id/edit-layers', component: <MapFolderEditLayers /> },
    {
      text: t('layers'),
      path: '/layers',
      icon: <MapIcon />,
      component: <>{t('layers')}</>,
      isMenuItem: true,
      children: [
        {
          text: t('styleEditor'),
          path: '/edit',
          icon: <SettingsIcon />,
          component: <>{t('styleEditor')}</>,
          isMenuItem: true,
        },
      ],
    },
    {
      text: t('layerAttributes'),
      path: '/layerAttributes',
      icon: <SettingsIcon />,
      component: <>{t('layerAttributes')}</>,
      isMenuItem: true,
    },
    {
      text: t('dictionaries'),
      path: '/dictionaries',
      icon: <DashboardIcon />,
      component: <Dictionaries />,
      isMenuItem: true,
    },
  ];

  const menuItems = routes.filter((item) => item.isMenuItem);

  const getRecursiveChildrenRoutes = (item: DashboardRoute) => {
    if (item.children) {
      return item.children.map((child, idx) => (
        <Fragment key={idx}>
          <DashboardRoute key={child.text} path={child.path} element={child.component} />
          {getRecursiveChildrenRoutes(child)}
        </Fragment>
      ));
    }
    return null;
  };

  return (
    <Box display="flex" flexDirection="row" height="100%" flex={1} border={'1px solid #ddd'}>
      {/* Sidebar */}
      <Box borderRight={'1px solid #ddd'} width={300}>
        <List>
          {menuItems.map((item) => (
            <>
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  component={Link}
                  to={`${parentUrl}${item.path}`}
                  selected={location.pathname === `${parentUrl}${item.path}`}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
              {item.children &&
                item.children.map((child) => (
                  <ListItem key={child.text} disablePadding sx={{ pl: 4 }}>
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

      <Box flex={1} p={2} width={'calc(100% - 332px)'}>
        <Routes>
          {routes.map((item, idx) => (
            <Fragment key={idx}>
              <DashboardRoute path={item.path} element={item.component} />
              {getRecursiveChildrenRoutes(item)}
            </Fragment>
          ))}
          <DashboardRoute path="/dictionaries/:id" element={<DictionaryEntries />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default Dashboard;
