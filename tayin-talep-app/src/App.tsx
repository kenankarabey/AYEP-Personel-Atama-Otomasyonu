import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/Profile/ProfilePage';
import Layout from './pages/Layout/Layout';
import TalepPage from './pages/Talep/TalepPage';
import TaleplerimPage from './pages/Taleplerim/TaleplerimPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<Layout />}>
          <Route path="/taleplerim" element={<TaleplerimPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/talep-olustur" element={<TalepPage />} />
          <Route path="*" element={<Navigate to="/talep-olustur" />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
