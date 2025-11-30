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
  Tabs,
  Tab,
  IconButton,
  Alert,
  CircularProgress,
  Paper,
  Divider,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  MenuBook as ModuleIcon,
  VideoLibrary as VideoIcon,
  History as HistoryIcon,
  Favorite as FavoriteIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  PlayArrow as PlayIcon,
  Edit as EditIcon,
  Verified as VerifiedIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import supabase from '@/lib/supabase';

interface Module {
  module_code: string;
  module_name: string;
  faculty: string;
  department: string | null;
  semester: string;
  credits: number | null;
  description: string | null;
}

interface Kuppi {
  id: string;
  title: string;
  description: string | null;
  module_code: string;
  module_name: string;
  youtube_links: string[];
  view_count: number;
  created_at: string;
  is_approved: boolean;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`dashboard-tabpanel-${index}`}
      aria-labelledby={`dashboard-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, userProfile, loading: authLoading } = useAuth();
  
  const [tabValue, setTabValue] = useState(0);
  const [modules, setModules] = useState<Module[]>([]);
  const [myKuppis, setMyKuppis] = useState<Kuppi[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Fetch user's modules and kuppis
  useEffect(() => {
    const fetchData = async () => {
      if (!userProfile) return;
      
      setLoadingData(true);
      
      try {
        // Fetch user's saved modules
        const { data: userModules, error: modulesError } = await supabase
          .from('user_modules')
          .select(`
            module_code,
            modules (
              module_code,
              module_name,
              faculty,
              department,
              semester,
              credits,
              description
            )
          `)
          .eq('user_id', userProfile.id);

        if (!modulesError && userModules) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const formattedModules = userModules
            .map((um: any) => um.modules)
            .filter((m: Module | null): m is Module => m !== null);
          setModules(formattedModules);
        }

        // Fetch user's uploaded kuppis
        const { data: kuppis, error: kuppisError } = await supabase
          .from('kuppis')
          .select(`
            *,
            modules:module_code (
              module_code,
              module_name
            )
          `)
          .eq('tutor_id', userProfile.id)
          .order('created_at', { ascending: false });

        if (!kuppisError && kuppis) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          setMyKuppis(kuppis.map((k: any) => ({
            ...k,
            module_name: k.modules?.module_name || k.module_code
          })));
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
      
      setLoadingData(false);
    };

    if (userProfile) {
      fetchData();
    }
  }, [userProfile]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleRemoveModule = async (moduleCode: string) => {
    if (!userProfile) return;
    
    const { error } = await supabase
      .from('user_modules')
      .delete()
      .eq('user_id', userProfile.id)
      .eq('module_code', moduleCode);

    if (!error) {
      setModules(modules.filter(m => m.module_code !== moduleCode));
    }
  };

  if (authLoading || loadingData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user || !userProfile) {
    return null;
  }

  const filteredModules = modules.filter(
    m => m.module_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
         m.module_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Paper sx={{ p: 4, mb: 4, boxShadow: 3 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid>
              <Avatar
                src={userProfile.photo_url || undefined}
                sx={{ width: 80, height: 80, bgcolor: 'primary.main' }}
              >
                {userProfile.display_name?.[0] || user.email?.[0]?.toUpperCase()}
              </Avatar>
            </Grid>
            <Grid size="grow">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {userProfile.display_name || 'Student'}
                </Typography>
                {userProfile.is_verified_tutor && (
                  <Chip
                    icon={<VerifiedIcon />}
                    label="Verified Tutor"
                    color="success"
                    size="small"
                  />
                )}
              </Box>
              <Typography color="text.secondary">{user.email}</Typography>
              {userProfile.index_number && (
                <Chip label={userProfile.index_number} size="small" sx={{ mt: 1 }} />
              )}
            </Grid>
            <Grid>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => router.push('/add-kuppi')}
                sx={{
                  background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                }}
              >
                Add Kuppi
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Card sx={{ bgcolor: 'primary.main', color: 'white' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <ModuleIcon sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4">{modules.length}</Typography>
                <Typography>Saved Modules</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Card sx={{ bgcolor: 'secondary.main', color: 'white' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <VideoIcon sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4">{myKuppis.length}</Typography>
                <Typography>My Kuppis</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Card sx={{ bgcolor: 'success.main', color: 'white' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <FavoriteIcon sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4">
                  {myKuppis.reduce((sum, k) => sum + (k.view_count || 0), 0)}
                </Typography>
                <Typography>Total Views</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Tabs */}
        <Paper sx={{ boxShadow: 3 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}
          >
            <Tab icon={<ModuleIcon />} label="My Modules" iconPosition="start" />
            <Tab icon={<VideoIcon />} label="My Kuppis" iconPosition="start" />
            <Tab icon={<HistoryIcon />} label="Watch History" iconPosition="start" />
          </Tabs>

          {/* My Modules Tab */}
          <TabPanel value={tabValue} index={0}>
            <Box sx={{ px: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <TextField
                  size="small"
                  placeholder="Search modules..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ minWidth: 300 }}
                />
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={() => router.push('/search')}
                >
                  Add Module
                </Button>
              </Box>

              {filteredModules.length > 0 ? (
                <Grid container spacing={2}>
                  {filteredModules.map((module) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={module.module_code}>
                      <Card
                        sx={{
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          transition: 'all 0.2s',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: 4,
                          },
                        }}
                      >
                        <CardContent sx={{ flexGrow: 1 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Chip label={module.module_code} color="primary" size="small" />
                            <IconButton
                              size="small"
                              onClick={() => handleRemoveModule(module.module_code)}
                              sx={{ color: 'error.main' }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                          <Typography variant="h6" sx={{ mt: 1, mb: 1 }}>
                            {module.module_name}
                          </Typography>
                          <Button
                            size="small"
                            startIcon={<PlayIcon />}
                            onClick={() => router.push(`/module/${module.module_code}`)}
                          >
                            View Kuppis
                          </Button>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Alert severity="info">
                  No modules saved yet. Go to the{' '}
                  <Button size="small" onClick={() => router.push('/')}>
                    home page
                  </Button>{' '}
                  to select your modules.
                </Alert>
              )}
            </Box>
          </TabPanel>

          {/* My Kuppis Tab */}
          <TabPanel value={tabValue} index={1}>
            <Box sx={{ px: 3 }}>
              {myKuppis.length > 0 ? (
                <Grid container spacing={2}>
                  {myKuppis.map((kuppi) => (
                    <Grid size={{ xs: 12, md: 6 }} key={kuppi.id}>
                      <Card>
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Box>
                              <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                                <Chip label={kuppi.module_code} size="small" color="primary" />
                                <Chip
                                  label={kuppi.is_approved ? 'Approved' : 'Pending'}
                                  size="small"
                                  color={kuppi.is_approved ? 'success' : 'warning'}
                                />
                              </Box>
                              <Typography variant="h6">{kuppi.title}</Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                {kuppi.description?.substring(0, 100)}...
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {kuppi.view_count} views • {new Date(kuppi.created_at).toLocaleDateString()}
                              </Typography>
                            </Box>
                            <IconButton onClick={() => router.push(`/edit-kuppi/${kuppi.id}`)}>
                              <EditIcon />
                            </IconButton>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Alert severity="info">
                  You haven&apos;t uploaded any kuppis yet.{' '}
                  <Button size="small" onClick={() => router.push('/add-kuppi')}>
                    Add your first kuppi
                  </Button>
                </Alert>
              )}
            </Box>
          </TabPanel>

          {/* Watch History Tab */}
          <TabPanel value={tabValue} index={2}>
            <Box sx={{ px: 3 }}>
              <Alert severity="info">
                Watch history feature coming soon!
              </Alert>
            </Box>
          </TabPanel>
        </Paper>
      </Container>
    </Box>
  );
}
