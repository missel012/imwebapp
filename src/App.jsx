import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './dashboardcomponents/Dashboard';
import NewLogin from './page/NewLogin';  // Correct path to NewLogin
import Register from './page/Register';  // Correct path to Register
import Patient from './dashboardcomponents/Patient';
import Staff from './dashboardcomponents/Staff';
import Wards from './dashboardcomponents/Wards';
import Supply from './dashboardcomponents/Supply';
import Prescription from './dashboardcomponents/Prescription';
import Other from './dashboardcomponents/Other';
import WelcomePage from './dashboardcomponents/WelcomePage';
import { AuthProvider } from './contexts/AuthContext';  // Verify the path to AuthContext
import PrivateRoute from './components/PrivateRoute';  // Assuming correct path
import PublicRoute from './components/PublicRoute';  // Assuming correct path

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<PublicRoute><NewLogin /></PublicRoute>} />
          <Route path="/login" element={<PublicRoute><NewLogin /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
          <Route path="/welcome" element={<WelcomePage />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>}>
            <Route path="patient" element={<Patient />} />
            <Route path="staff" element={<Staff />} />
            <Route path="wards" element={<Wards />} />
            <Route path="supply" element={<Supply />} />
            <Route path="prescription" element={<Prescription />} />
            <Route path="other" element={<Other />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
