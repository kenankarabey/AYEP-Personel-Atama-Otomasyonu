import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/Profile/ProfilePage';
import Layout from './pages/Layout/Layout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<Layout />}>
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<Navigate to="/profile" />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
