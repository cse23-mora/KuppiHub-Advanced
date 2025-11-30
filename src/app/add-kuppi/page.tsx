'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Chip,
  IconButton,
  Grid,
  Paper,
  Divider,
  SelectChangeEvent,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  YouTube as YouTubeIcon,
  Telegram as TelegramIcon,
  AttachFile as FileIcon,
  Save as SaveIcon,
  ArrowBack as BackIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import supabase from '@/lib/supabase';

interface Module {
  id: string;
  code: string;
  name: string;
}

export default function AddKuppiPage() {
  const router = useRouter();
  const { user, userProfile, loading: authLoading } = useAuth();

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedModule, setSelectedModule] = useState('');
  const [languageCode, setLanguageCode] = useState('si');
  const [youtubeLinks, setYoutubeLinks] = useState<string[]>(['']);
  const [telegramLinks, setTelegramLinks] = useState<string[]>(['']);
  const [materialUrls, setMaterialUrls] = useState<string[]>(['']);

  // Data state
  const [modules, setModules] = useState<Module[]>([]);
  const [loadingModules, setLoadingModules] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/add-kuppi');
    }
  }, [user, authLoading, router]);

  // Fetch modules
  useEffect(() => {
    const fetchModules = async () => {
      setLoadingModules(true);
      const { data, error } = await supabase
        .from('modules')
        .select('*')
        .order('code');

      if (!error && data) {
        setModules(data);
      }
      setLoadingModules(false);
    };

    fetchModules();
  }, []);

  // Handle link array updates
  const handleAddLink = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    links: string[]
  ) => {
    setter([...links, '']);
  };

  const handleRemoveLink = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    links: string[],
    index: number
  ) => {
    setter(links.filter((_, i) => i !== index));
  };

  const handleLinkChange = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    links: string[],
    index: number,
    value: string
  ) => {
    const newLinks = [...links];
    newLinks[index] = value;
    setter(newLinks);
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    // Validation
    if (!title.trim()) {
      setError('Title is required');
      setSubmitting(false);
      return;
    }

    if (!selectedModule) {
      setError('Please select a module');
      setSubmitting(false);
      return;
    }

    const filteredYoutubeLinks = youtubeLinks.filter(l => l.trim());
    const filteredTelegramLinks = telegramLinks.filter(l => l.trim());
    const filteredMaterialUrls = materialUrls.filter(l => l.trim());

    if (filteredYoutubeLinks.length === 0 && filteredTelegramLinks.length === 0) {
      setError('Please add at least one YouTube or Telegram link');
      setSubmitting(false);
      return;
    }

    try {
      const { error: insertError } = await supabase.from('kuppis').insert([
        {
          module_id: selectedModule,
          uploader_id: userProfile?.id,
          title: title.trim(),
          description: description.trim() || null,
          youtube_links: filteredYoutubeLinks,
          telegram_links: filteredTelegramLinks,
          material_urls: filteredMaterialUrls,
          language_code: languageCode,
          is_approved: userProfile?.is_verified_tutor || false,
          is_published: true,
          published_at: new Date().toISOString().split('T')[0],
        },
      ]);

      if (insertError) {
        throw insertError;
      }

      setSuccess(true);
      
      // Reset form after success
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (err) {
      console.error('Error submitting kuppi:', err);
      setError('Failed to submit kuppi. Please try again.');
    }

    setSubmitting(false);
  };

  if (authLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
      <Container maxWidth="md">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Button
            startIcon={<BackIcon />}
            onClick={() => router.back()}
            sx={{ mb: 2 }}
          >
            Back
          </Button>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Add a Kuppi
          </Typography>
          <Typography color="text.secondary">
            Share your knowledge with fellow students
          </Typography>
        </Box>

        {/* Verification Notice */}
        {!userProfile?.is_verified_tutor && (
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              <strong>Note:</strong> Your kuppi will be reviewed by admins before it appears to other students.
              Verified tutors&apos; kuppis are published immediately.
            </Typography>
          </Alert>
        )}

        {/* Success Message */}
        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Kuppi submitted successfully! Redirecting to dashboard...
          </Alert>
        )}

        {/* Error Message */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Form */}
        <Card sx={{ boxShadow: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                {/* Title */}
                <Grid size={12}>
                  <TextField
                    fullWidth
                    label="Kuppi Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    placeholder="e.g., Data Structures - Binary Trees Explained"
                  />
                </Grid>

                {/* Module Selection */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <FormControl fullWidth required>
                    <InputLabel>Module</InputLabel>
                    <Select
                      value={selectedModule}
                      label="Module"
                      onChange={(e: SelectChangeEvent) => setSelectedModule(e.target.value)}
                      disabled={loadingModules}
                    >
                      {modules.map((module) => (
                        <MenuItem key={module.id} value={module.id}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Chip label={module.code} size="small" />
                            {module.name}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Language */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <FormControl fullWidth>
                    <InputLabel>Language</InputLabel>
                    <Select
                      value={languageCode}
                      label="Language"
                      onChange={(e: SelectChangeEvent) => setLanguageCode(e.target.value)}
                    >
                      <MenuItem value="si">Sinhala</MenuItem>
                      <MenuItem value="en">English</MenuItem>
                      <MenuItem value="ta">Tamil</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {/* Description */}
                <Grid size={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe what topics are covered in this kuppi..."
                  />
                </Grid>

                <Grid size={12}>
                  <Divider sx={{ my: 2 }} />
                </Grid>

                {/* YouTube Links */}
                <Grid size={12}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <YouTubeIcon color="error" />
                      <Typography variant="h6">YouTube Links</Typography>
                    </Box>
                    {youtubeLinks.map((link, index) => (
                      <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                        <TextField
                          fullWidth
                          size="small"
                          placeholder="https://youtube.com/watch?v=..."
                          value={link}
                          onChange={(e) =>
                            handleLinkChange(setYoutubeLinks, youtubeLinks, index, e.target.value)
                          }
                        />
                        {youtubeLinks.length > 1 && (
                          <IconButton
                            color="error"
                            onClick={() => handleRemoveLink(setYoutubeLinks, youtubeLinks, index)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        )}
                      </Box>
                    ))}
                    <Button
                      size="small"
                      startIcon={<AddIcon />}
                      onClick={() => handleAddLink(setYoutubeLinks, youtubeLinks)}
                    >
                      Add YouTube Link
                    </Button>
                  </Paper>
                </Grid>

                {/* Telegram Links */}
                <Grid size={12}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <TelegramIcon color="primary" />
                      <Typography variant="h6">Telegram Links</Typography>
                    </Box>
                    {telegramLinks.map((link, index) => (
                      <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                        <TextField
                          fullWidth
                          size="small"
                          placeholder="https://t.me/..."
                          value={link}
                          onChange={(e) =>
                            handleLinkChange(setTelegramLinks, telegramLinks, index, e.target.value)
                          }
                        />
                        {telegramLinks.length > 1 && (
                          <IconButton
                            color="error"
                            onClick={() => handleRemoveLink(setTelegramLinks, telegramLinks, index)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        )}
                      </Box>
                    ))}
                    <Button
                      size="small"
                      startIcon={<AddIcon />}
                      onClick={() => handleAddLink(setTelegramLinks, telegramLinks)}
                    >
                      Add Telegram Link
                    </Button>
                  </Paper>
                </Grid>

                {/* Material URLs */}
                <Grid size={12}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <FileIcon color="action" />
                      <Typography variant="h6">Additional Materials</Typography>
                      <Typography variant="caption" color="text.secondary">
                        (PDFs, notes, slides)
                      </Typography>
                    </Box>
                    {materialUrls.map((link, index) => (
                      <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                        <TextField
                          fullWidth
                          size="small"
                          placeholder="https://drive.google.com/..."
                          value={link}
                          onChange={(e) =>
                            handleLinkChange(setMaterialUrls, materialUrls, index, e.target.value)
                          }
                        />
                        {materialUrls.length > 1 && (
                          <IconButton
                            color="error"
                            onClick={() => handleRemoveLink(setMaterialUrls, materialUrls, index)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        )}
                      </Box>
                    ))}
                    <Button
                      size="small"
                      startIcon={<AddIcon />}
                      onClick={() => handleAddLink(setMaterialUrls, materialUrls)}
                    >
                      Add Material Link
                    </Button>
                  </Paper>
                </Grid>

                {/* Submit Button */}
                <Grid size={12}>
                  <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      type="submit"
                      disabled={submitting || success}
                      startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                      sx={{
                        py: 1.5,
                        background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #5a6fd6 30%, #6a4190 90%)',
                        },
                      }}
                    >
                      {submitting ? 'Submitting...' : 'Submit Kuppi'}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
