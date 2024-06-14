import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './dashboardcomponents/Dashboard';
import NewLogin from './page/NewLogin';
import Register from './page/Register';
import Patient from './dashboardcomponents/Patient';
import Staff from './dashboardcomponents/Staff';
import Wards from './dashboardcomponents/Wards';
import Supply from './dashboardcomponents/Supply';
import Prescription from './dashboardcomponents/Prescription';
import Other from './dashboardcomponents/Other';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<NewLogin />} />
        <Route path="/login" element={<NewLogin />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="patient" element={<Patient />} />
          <Route path="staff" element={<Staff />} />
          <Route path="wards" element={<Wards />} />
          <Route path="supply" element={<Supply />} />
          <Route path="prescription" element={<Prescription />} />
          <Route path="other" element={<Other />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
