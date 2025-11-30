'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Divider,
  Alert,
  CircularProgress,
  Link as MuiLink,
} from '@mui/material';
import {
  Google as GoogleIcon,
  Email as EmailIcon,
  Lock as LockIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { user, signInWithGoogle, signInWithEmail } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    
    const result = await signInWithGoogle();
    
    if (result.error) {
      setError(result.error);
    } else {
      router.push('/dashboard');
    }
    
    setLoading(false);
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    if (!email || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }
    
    const result = await signInWithEmail(email, password);
    
    if (result.error) {
      setError(result.error);
    } else {
      router.push('/dashboard');
    }
    
    setLoading(false);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        bgcolor: 'background.default',
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Card sx={{ boxShadow: 4 }}>
          <CardContent sx={{ p: 4 }}>
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1,
                }}
              >
                Welcome to KuppiHub
              </Typography>
              <Typography color="text.secondary">
                Sign in to access your dashboard
              </Typography>
            </Box>

            {/* Error Alert */}
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {/* Google Sign In */}
            <Button
              fullWidth
              variant="outlined"
              size="large"
              startIcon={<GoogleIcon />}
              onClick={handleGoogleSignIn}
              disabled={loading}
              sx={{
                py: 1.5,
                mb: 3,
                borderColor: '#4285f4',
                color: '#4285f4',
                '&:hover': {
                  borderColor: '#4285f4',
                  bgcolor: 'rgba(66, 133, 244, 0.04)',
                },
              }}
            >
              Continue with Google
            </Button>

            <Divider sx={{ mb: 3 }}>
              <Typography color="text.secondary" variant="body2">
                or sign in with email
              </Typography>
            </Divider>

            {/* Email Sign In Form */}
            <Box component="form" onSubmit={handleEmailSignIn}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: <LockIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />

              <Button
                fullWidth
                variant="contained"
                size="large"
                type="submit"
                disabled={loading}
                sx={{
                  py: 1.5,
                  background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #5a6fd6 30%, #6a4190 90%)',
                  },
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
              </Button>
            </Box>

            {/* Footer Links */}
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Don&apos;t have an account?{' '}
                <MuiLink component={Link} href="/register" underline="hover">
                  Sign up
                </MuiLink>
              </Typography>
            </Box>

            {/* Info Alert */}
            <Alert severity="info" sx={{ mt: 3 }}>
              <Typography variant="body2">
                <strong>Note:</strong> You can browse kuppis without logging in. 
                Sign in is only needed to save modules to your dashboard or upload kuppis.
              </Typography>
            </Alert>
          </CardContent>
        </Card>

        {/* Back to Home */}
        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <MuiLink component={Link} href="/" underline="hover" color="text.secondary">
            ← Back to Home
          </MuiLink>
        </Box>
      </Container>
    </Box>
  );
}
