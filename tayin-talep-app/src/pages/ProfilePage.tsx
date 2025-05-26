import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const ProfilePage: React.FC = () => {
  return (
    <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center" bgcolor="#f6f7fa">
      <Paper elevation={4} sx={{ p: 4, minWidth: 340 }}>
        <Typography variant="h5" mb={2} align="center">Hoşgeldiniz, Admin!</Typography>
        <Typography align="center" color="text.secondary">
          Sicil No: admin<br />
          Ad Soyad: Admin Kullanıcı<br />
          Ünvan: Personel
        </Typography>
      </Paper>
    </Box>
  );
};

export default ProfilePage; 