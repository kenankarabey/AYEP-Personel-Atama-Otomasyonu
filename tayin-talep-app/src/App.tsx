import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/Profile/ProfilePage';
import Layout from './pages/Layout/Layout';
import TalepPage from './pages/Talep/TalepPage';
import TaleplerimPage from './pages/Taleplerim/TaleplerimPage';
import HomePage from './pages/Anasayfa/HomePage';
import HomePageAdmin from './pages/Anasayfa/HomePageAdmin';
import GelenTaleplerAdminPage from './pages/GelenTaleplerAdmin/GelenTaleplerAdminPage';
import DuyuruYayinlaAdminPage from './pages/DuyuruYayinlaAdmin/DuyuruYayinlaAdminPage';
import { AlertProvider } from './components/AlertContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AlertProvider>
      <Router>
        <Routes>
          {/* Personel Routes */}
          <Route path="/" element={
            <ProtectedRoute allowedRoles={['personel']}>
              <HomePage />
            </ProtectedRoute>
          } />
          <Route path="/login" element={<LoginPage />} />
          <Route element={<Layout />}>
            <Route path="/taleplerim" element={
              <ProtectedRoute allowedRoles={['personel']}>
                <TaleplerimPage />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute allowedRoles={['personel']}>
                <ProfilePage />
              </ProtectedRoute>
            } />
            <Route path="/talep-olustur" element={
              <ProtectedRoute allowedRoles={['personel']}>
                <TalepPage />
              </ProtectedRoute>
            } />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <HomePageAdmin />
            </ProtectedRoute>
          } />
          <Route element={<Layout admin={true} />}>
            <Route path="/admin/profile" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ProfilePage />
              </ProtectedRoute>
            } />
          </Route>
          <Route path="/admin/gelen-talepler" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <GelenTaleplerAdminPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/duyuru-yayinla" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <DuyuruYayinlaAdminPage />
            </ProtectedRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AlertProvider>
  );
}

export default App;
