import React, { useMemo, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/common/header';
import Footer from './components/common/footer';
///import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './components/Dashboard';
import About from './pages/About';
import Contacts from './pages/Contacts';
import Documentation from './pages/Documentation';
import PrivateRoute from './components/PrivateRoute';
import LoadingBar from './components/common/loadingBar';
import { LoadingProvider, useLoading } from './components/common/loadingBar/loadingContext';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import './App.css';
// import './styles/gis.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NotificationsProvider } from '@toolpad/core/useNotifications';
import { ThemeProvider } from '@mui/material';
import theme from './config/theme';
import { dashboardUrl } from './components/Dashboard/routes';
import { LocalizationProvider, LocalizationProviderProps } from '@mui/x-date-pickers';
import ruLocale from 'dayjs/locale/ru';
import kkLocale from 'dayjs/locale/kk';
import enLocale from 'dayjs/locale/en-gb';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useTranslation } from 'react-i18next';
import { Dayjs } from 'dayjs';

const queryClient = new QueryClient();

export enum FooterType {
  BIG,
  MINI,
}
const App: React.FC = () => {
  const { isLoading } = useLoading(); // Get loading state from context
  const [footerType, setFooterType] = useState<FooterType>(FooterType.BIG);
  return (
    <NotificationsProvider>
      <Router>
        <LoadingBar isLoading={isLoading} />
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
              overflow: 'hidden',
            }}
          >
            {/* Main Content */}
            <Box display="flex" flexDirection="column" flexGrow={1} p={0}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/about" element={<About />} />
                <Route path="/contacts" element={<Contacts />} />
                <Route path="/documentation" element={<Documentation />} />
                <Route
                  path={`${dashboardUrl}*`}
                  element={
                    <PrivateRoute path={dashboardUrl}>
                      <Dashboard />
                    </PrivateRoute>
                  }
                />
              </Routes>
            </Box>
          </Box>

          {/* Common Footer */}
          {footerType === FooterType.MINI && (
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
          )}
          {footerType === FooterType.BIG && <Footer />}
        </Box>
      </Router>
    </NotificationsProvider>
  );
};

export default function AppWrapper() {
  const {
    i18n: { language },
  } = useTranslation();

  const calendarLocale = useMemo(() => {
    switch (language) {
      case 'ru':
        return ruLocale;
      case 'kk':
        return kkLocale;
      case 'en':
        return enLocale;
      default:
        return kkLocale;
    }
  }, [language]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <LocalizationProvider
          dateAdapter={AdapterDayjs}
          adapterLocale={calendarLocale as LocalizationProviderProps<Dayjs, unknown>['adapterLocale']}
        >
          <LoadingProvider>
            <App />
          </LoadingProvider>
        </LocalizationProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

//export default App;