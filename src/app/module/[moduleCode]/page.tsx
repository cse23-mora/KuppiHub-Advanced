'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  Avatar,
  Alert,
  CircularProgress,
  Paper,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  SelectChangeEvent,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Visibility as ViewIcon,
  Favorite as LikeIcon,
  FavoriteBorder as LikeOutlineIcon,
  Share as ShareIcon,
  ArrowBack as BackIcon,
  YouTube as YouTubeIcon,
  Telegram as TelegramIcon,
  AttachFile as FileIcon,
  Translate as LanguageIcon,
} from '@mui/icons-material';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import supabase from '@/lib/supabase';

interface Kuppi {
  id: string;
  title: string;
  description: string | null;
  youtube_links: string[];
  telegram_links: string[];
  material_urls: string[];
  language_code: string;
  view_count: number;
  like_count: number;
  created_at: string;
  uploader_name: string;
  uploader_photo: string | null;
  uploader_index: string | null;
}

interface Module {
  id: string;
  code: string;
  name: string;
  description: string | null;
}

const LANGUAGE_NAMES: Record<string, string> = {
  si: 'සිංහල',
  en: 'English',
  ta: 'தமிழ்',
};

export default function ModulePage() {
  const router = useRouter();
  const params = useParams();
  const moduleCode = params?.moduleCode as string;
  const { user, userProfile } = useAuth();

  const [module, setModule] = useState<Module | null>(null);
  const [kuppis, setKuppis] = useState<Kuppi[]>([]);
  const [loading, setLoading] = useState(true);
  const [languageFilter, setLanguageFilter] = useState('all');
  const [likedKuppis, setLikedKuppis] = useState<Set<string>>(new Set());

  // Fetch module and kuppis
  useEffect(() => {
    const fetchData = async () => {
      if (!moduleCode) return;

      setLoading(true);

      try {
        // Fetch module info
        const { data: moduleData, error: moduleError } = await supabase
          .from('modules')
          .select('*')
          .eq('code', moduleCode)
          .single();

        if (moduleError) {
          console.error('Error fetching module:', moduleError);
        } else {
          setModule(moduleData);
        }

        // Fetch kuppis for this module
        if (moduleData) {
          const { data: kuppisData, error: kuppisError } = await supabase
            .from('kuppis_with_details')
            .select('*')
            .eq('module_id', moduleData.id)
            .order('created_at', { ascending: false });

          if (!kuppisError && kuppisData) {
            setKuppis(kuppisData);
          }
        }

        // Fetch user's liked kuppis
        if (userProfile) {
          const { data: likesData } = await supabase
            .from('kuppi_likes')
            .select('kuppi_id')
            .eq('user_id', userProfile.id);

          if (likesData) {
            setLikedKuppis(new Set(likesData.map(l => l.kuppi_id)));
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }

      setLoading(false);
    };

    fetchData();
  }, [moduleCode, userProfile]);

  const handleLike = async (kuppiId: string) => {
    if (!userProfile) {
      router.push('/login');
      return;
    }

    const isLiked = likedKuppis.has(kuppiId);

    if (isLiked) {
      // Unlike
      await supabase
        .from('kuppi_likes')
        .delete()
        .eq('user_id', userProfile.id)
        .eq('kuppi_id', kuppiId);

      setLikedKuppis(prev => {
        const newSet = new Set(prev);
        newSet.delete(kuppiId);
        return newSet;
      });
    } else {
      // Like
      await supabase
        .from('kuppi_likes')
        .insert([{ user_id: userProfile.id, kuppi_id: kuppiId }]);

      setLikedKuppis(prev => new Set([...prev, kuppiId]));
    }
  };

  const handleShare = (kuppi: Kuppi) => {
    if (navigator.share) {
      navigator.share({
        title: kuppi.title,
        text: `Check out this kuppi for ${module?.code}: ${kuppi.title}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const incrementViewCount = async (kuppiId: string) => {
    await supabase.rpc('increment_view_count', { kuppi_uuid: kuppiId });
  };

  const filteredKuppis = kuppis.filter(
    k => languageFilter === 'all' || k.language_code === languageFilter
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!module) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          Module not found. <Button onClick={() => router.push('/')}>Go Home</Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
      <Container maxWidth="lg">
        {/* Back Button */}
        <Button startIcon={<BackIcon />} onClick={() => router.back()} sx={{ mb: 3 }}>
          Back
        </Button>

        {/* Module Header */}
        <Paper sx={{ p: 4, mb: 4, boxShadow: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Chip label={module.code} color="primary" sx={{ mb: 1 }} />
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                {module.name}
              </Typography>
              {module.description && (
                <Typography color="text.secondary">{module.description}</Typography>
              )}
              <Typography variant="body2" sx={{ mt: 2 }}>
                <strong>{kuppis.length}</strong> kuppis available
              </Typography>
            </Box>
            <Box>
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>
                  <LanguageIcon fontSize="small" sx={{ mr: 0.5 }} />
                  Language
                </InputLabel>
                <Select
                  value={languageFilter}
                  label="Language"
                  onChange={(e: SelectChangeEvent) => setLanguageFilter(e.target.value)}
                >
                  <MenuItem value="all">All Languages</MenuItem>
                  <MenuItem value="si">සිංහල</MenuItem>
                  <MenuItem value="en">English</MenuItem>
                  <MenuItem value="ta">தமிழ்</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
        </Paper>

        {/* Kuppis List */}
        {filteredKuppis.length > 0 ? (
          <Grid container spacing={3}>
            {filteredKuppis.map((kuppi) => (
              <Grid size={{ xs: 12, md: 6 }} key={kuppi.id}>
                <Card
                  sx={{
                    height: '100%',
                    transition: 'all 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4,
                    },
                  }}
                >
                  <CardContent>
                    {/* Header */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar
                          src={kuppi.uploader_photo || undefined}
                          sx={{ width: 32, height: 32 }}
                        >
                          {kuppi.uploader_name?.[0]}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {kuppi.uploader_name || 'Anonymous'}
                          </Typography>
                          {kuppi.uploader_index && (
                            <Typography variant="caption" color="text.secondary">
                              {kuppi.uploader_index}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                      <Chip
                        label={LANGUAGE_NAMES[kuppi.language_code] || kuppi.language_code}
                        size="small"
                        variant="outlined"
                      />
                    </Box>

                    {/* Title */}
                    <Typography variant="h6" sx={{ mb: 1 }}>
                      {kuppi.title}
                    </Typography>

                    {/* Description */}
                    {kuppi.description && (
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {kuppi.description.length > 150
                          ? `${kuppi.description.substring(0, 150)}...`
                          : kuppi.description}
                      </Typography>
                    )}

                    {/* Stats */}
                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <ViewIcon fontSize="small" /> {kuppi.view_count} views
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <LikeIcon fontSize="small" /> {kuppi.like_count} likes
                      </Typography>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    {/* Links */}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                      {kuppi.youtube_links?.length > 0 && (
                        <Button
                          size="small"
                          variant="contained"
                          color="error"
                          startIcon={<YouTubeIcon />}
                          onClick={() => {
                            incrementViewCount(kuppi.id);
                            window.open(kuppi.youtube_links[0], '_blank');
                          }}
                        >
                          YouTube ({kuppi.youtube_links.length})
                        </Button>
                      )}
                      {kuppi.telegram_links?.length > 0 && (
                        <Button
                          size="small"
                          variant="contained"
                          color="info"
                          startIcon={<TelegramIcon />}
                          onClick={() => {
                            incrementViewCount(kuppi.id);
                            window.open(kuppi.telegram_links[0], '_blank');
                          }}
                        >
                          Telegram ({kuppi.telegram_links.length})
                        </Button>
                      )}
                      {kuppi.material_urls?.length > 0 && (
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<FileIcon />}
                          onClick={() => window.open(kuppi.material_urls[0], '_blank')}
                        >
                          Materials ({kuppi.material_urls.length})
                        </Button>
                      )}
                    </Box>

                    {/* Actions */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(kuppi.created_at).toLocaleDateString()}
                      </Typography>
                      <Box>
                        <IconButton onClick={() => handleLike(kuppi.id)}>
                          {likedKuppis.has(kuppi.id) ? (
                            <LikeIcon color="error" />
                          ) : (
                            <LikeOutlineIcon />
                          )}
                        </IconButton>
                        <IconButton onClick={() => handleShare(kuppi)}>
                          <ShareIcon />
                        </IconButton>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
              No kuppis available for this module yet
            </Typography>
            <Button
              variant="contained"
              onClick={() => router.push('/add-kuppi')}
              sx={{
                background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
              }}
            >
              Be the first to add a kuppi!
            </Button>
          </Paper>
        )}
      </Container>
    </Box>
  );
}
