
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from './components/common/header';
import Footer from './components/common/footer';
///import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import Contacts from './pages/Contacts';
import Documentation from './pages/Documentation';
import PrivateRoute from './components/PrivateRoute';
import Container from '@mui/material/Container';
import LoadingBar from './components/common/loadingBar';
import { LoadingProvider, useLoading } from './components/common/loadingBar/loadingContext';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
export enum FooterType{
  BIG,
  MINI
}
const App: React.FC = () => {
  const { t } = useTranslation();
  const { isLoading } = useLoading(); // Get loading state from context
  const [footerType,setFooterType] = useState<FooterType>(FooterType.BIG);
  return (
    
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
              <Container maxWidth={false}>
                <main>
                  <Routes>
                  
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contacts" element={<Contacts />} />
                    <Route path="/documentation" element={<Documentation />} />
                    <Route
                      path="/dashboard"
                      element={
                        <PrivateRoute path="/dashboard">
                          <Dashboard />
                        </PrivateRoute>
                      }
                    />
                  </Routes>
                </main>
              </Container>
            </Box>
      
       
        {/* Common Footer */}
        {footerType===FooterType.MINI &&<a
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
            </a>}
            {footerType===FooterType.BIG &&<Footer /> }
            </Box>  
    </Router>
    
  );
};

export default function AppWrapper() {
  return (
    <LoadingProvider>
      <App />
    </LoadingProvider>
  );
}

//export default App;



