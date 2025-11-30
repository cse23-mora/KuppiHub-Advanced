// app/page.tsx
'use client';

import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Paper,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  VideoLibrary as VideoIcon,
  School as SchoolIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import MegaMenu from '@/app/components/MegaMenu';

export default function HomePage() {
  const router = useRouter();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: { xs: 6, md: 10 },
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h2"
            fontWeight={700}
            sx={{ mb: 2, fontSize: { xs: '2rem', md: '3rem' } }}
          >
            Welcome to KuppiHub
          </Typography>
          <Typography
            variant="h6"
            sx={{ mb: 4, opacity: 0.9, fontWeight: 400 }}
          >
            Your one-stop platform for peer-to-peer learning resources.
            <br />
            Find kuppi videos, materials, and more for your modules.
          </Typography>

          {/* Action Buttons */}
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <MegaMenu />
            
            <Button
              variant="outlined"
              size="large"
              startIcon={<DashboardIcon />}
              onClick={() => router.push('/dashboard')}
              sx={{
                borderColor: 'white',
                color: 'white',
                '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' },
              }}
            >
              Dashboard
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4" fontWeight={600} textAlign="center" sx={{ mb: 6 }}>
          How It Works
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
            gap: 4,
          }}
        >
          <Card sx={{ textAlign: 'center', p: 3 }}>
            <SchoolIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" fontWeight={600} gutterBottom>
              1. Select Your Modules
            </Typography>
            <Typography color="text.secondary">
              Use the &quot;Add Modules&quot; button to browse faculties, departments, 
              and semesters. Select the modules you&apos;re studying.
            </Typography>
          </Card>

          <Card sx={{ textAlign: 'center', p: 3 }}>
            <VideoIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" fontWeight={600} gutterBottom>
              2. Access Kuppi Videos
            </Typography>
            <Typography color="text.secondary">
              Find YouTube videos, Telegram links, and study materials 
              shared by tutors and seniors for each module.
            </Typography>
          </Card>

          <Card sx={{ textAlign: 'center', p: 3 }}>
            <DashboardIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" fontWeight={600} gutterBottom>
              3. Build Your Dashboard
            </Typography>
            <Typography color="text.secondary">
              Save modules to your personal dashboard for quick access. 
              Track your learning progress in one place.
            </Typography>
          </Card>
        </Box>
      </Container>

      {/* CTA Section */}
      <Box sx={{ bgcolor: 'grey.100', py: 8 }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            Ready to Get Started?
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 4 }}>
            Browse modules from your faculty and start learning today.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <MegaMenu />
          </Box>
        </Container>
      </Box>

      {/* Stats/Info Section */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            KuppiHub is a community-driven platform where students and tutors share 
            learning resources. Anyone can contribute by uploading kuppi videos and materials.
          </Typography>
          <Button
            variant="text"
            sx={{ mt: 2 }}
            onClick={() => router.push('/about')}
          >
            Learn More About Us →
          </Button>
        </Paper>
      </Container>
    </Box>
  );
}
