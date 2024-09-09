import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useLoading } from '../components/common/loadingBar/loadingContext';

const Dashboard: React.FC = () => {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

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
  }, [setLoading]);


  return (
    <div>
      <h1>Dashboard</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Dashboard;
