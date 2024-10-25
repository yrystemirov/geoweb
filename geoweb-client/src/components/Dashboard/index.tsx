import React, { Fragment, useEffect } from 'react';
import { Link, Route, Routes, useLocation} from 'react-router-dom';
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { useLoading } from '../common/loadingBar/loadingContext';
import { DashboardRoute, dashboardUrl, routes } from './routes';
import { useTranslation } from 'react-i18next';

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { setLoading } = useLoading();

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const menuItems = routes.filter((item) => item.isMenuItem);

  const getRecursiveChildrenRoutes = (item: DashboardRoute) => {
    if (item.children) {
      return item.children.map((child, idx) => (
        <Fragment key={idx}>
          <Route key={child.text} path={child.path} element={child.component} />
          {getRecursiveChildrenRoutes(child)}
        </Fragment>
      ));
    }
    return null;
  };

  return (
    <Box display="flex" flexDirection="row" height="100%" flex={1} border={'1px solid #ddd'}>
      <Box borderRight={'1px solid #ddd'} width={300}>
        <List>
          {menuItems.map((item) => (
            <Fragment key={item.text}>
              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  to={`${dashboardUrl}${item.path}`}
                  selected={location.pathname === `${dashboardUrl}${item.path}`}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={t(item.text!)} />
                </ListItemButton>
              </ListItem>
              {item.children &&
                item.children.map(
                  (child) =>
                    child.isMenuItem && (
                      <ListItem key={child.text} disablePadding sx={{ pl: 4 }}>
                        <ListItemButton
                          component={Link}
                          to={`${dashboardUrl}${child.path}`}
                          selected={window.location.pathname === `${dashboardUrl}${child.path}`}
                        >
                          <ListItemIcon>{child.icon}</ListItemIcon>
                          <ListItemText primary={t(child.text!)} />
                        </ListItemButton>
                      </ListItem>
                    ),
                )}
            </Fragment>
          ))}
        </List>
      </Box>

      <Box flex={1} p={2} width={'calc(100% - 332px)'}>
        <Routes>
          {routes.map((item, idx) => (
            <Fragment key={idx}>
              <Route path={item.path} element={item.component} />
              {getRecursiveChildrenRoutes(item)}
            </Fragment>
          ))}
        </Routes>
      </Box>
    </Box>
  );
};

export default Dashboard;