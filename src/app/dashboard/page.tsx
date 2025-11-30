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
  IconButton,
  Alert,
  CircularProgress,
  Paper,
  TextField,
  InputAdornment,
  Autocomplete,
  Snackbar,
} from '@mui/material';
import {
  MenuBook as ModuleIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  PlayArrow as PlayIcon,
  Home as HomeIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import supabase from '@/lib/supabase';
import { allModules, ModuleData } from '@/data/modules';

interface SavedModule {
  module_code: string;
  module_name: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, userProfile, loading: authLoading } = useAuth();
  
  const [modules, setModules] = useState<SavedModule[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModule, setSelectedModule] = useState<ModuleData | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  // Load modules from localStorage and optionally Supabase
  useEffect(() => {
    const fetchData = async () => {
      setLoadingData(true);
      
      try {
        // Load from localStorage first
        const localModules = JSON.parse(localStorage.getItem('kuppihub_user_modules') || '[]');
        if (localModules.length > 0) {
          setModules(localModules);
        }

        // If logged in, try Supabase sync
        if (userProfile) {
          const { data: userModules, error: modulesError } = await supabase
            .from('user_modules')
            .select('module_code')
            .eq('user_id', userProfile.id);

          if (!modulesError && userModules && userModules.length > 0) {
            // Get module names from our static data
            const savedModules: SavedModule[] = userModules
              .map((um: { module_code: string }) => {
                const moduleInfo = allModules.find(m => m.module_code === um.module_code);
                return moduleInfo ? { module_code: um.module_code, module_name: moduleInfo.module_name } : null;
              })
              .filter((m): m is SavedModule => m !== null);
            
            if (savedModules.length > 0) {
              setModules(savedModules);
              localStorage.setItem('kuppihub_user_modules', JSON.stringify(savedModules));
            }
          }
        }
      } catch (error) {
        console.error('Error fetching modules:', error);
      }
      
      setLoadingData(false);
    };

    if (!authLoading) {
      fetchData();
    }
  }, [userProfile, authLoading]);

  const handleAddModule = async () => {
    if (!selectedModule) return;

    // Check if already added
    if (modules.some(m => m.module_code === selectedModule.module_code)) {
      setSnackbar({ open: true, message: 'Module already added!', severity: 'error' });
      setSelectedModule(null);
      return;
    }

    const newModule: SavedModule = {
      module_code: selectedModule.module_code,
      module_name: selectedModule.module_name,
    };
    const newModules = [...modules, newModule];
    setModules(newModules);
    localStorage.setItem('kuppihub_user_modules', JSON.stringify(newModules));

    // If logged in, sync to Supabase (just module_code)
    if (userProfile) {
      try {
        await supabase.from('user_modules').upsert({
          user_id: userProfile.id,
          module_code: selectedModule.module_code,
        }, { onConflict: 'user_id,module_code' });
      } catch (error) {
        console.warn('Could not sync to database:', error);
      }
    }

    setSnackbar({ open: true, message: `Added ${selectedModule.module_name}!`, severity: 'success' });
    setSelectedModule(null);
  };

  const handleRemoveModule = async (moduleCode: string) => {
    const updatedModules = modules.filter(m => m.module_code !== moduleCode);
    setModules(updatedModules);
    localStorage.setItem('kuppihub_user_modules', JSON.stringify(updatedModules));

    if (userProfile) {
      await supabase
        .from('user_modules')
        .delete()
        .eq('user_id', userProfile.id)
        .eq('module_code', moduleCode);
    }

    setSnackbar({ open: true, message: 'Module removed', severity: 'success' });
  };

  // Filter modules based on search
  const filteredModules = modules.filter(
    m => m.module_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
         m.module_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter available modules (exclude already added ones)
  const availableModules = allModules.filter(
    m => !modules.some(existing => existing.module_code === m.module_code)
  );

  if (authLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Paper sx={{ p: 3, mb: 4, boxShadow: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="h4" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ModuleIcon color="primary" /> My Modules
              </Typography>
              <Typography color="text.secondary">
                {modules.length} module{modules.length !== 1 ? 's' : ''} saved
              </Typography>
            </Box>
            <Button
              variant="outlined"
              startIcon={<HomeIcon />}
              onClick={() => router.push('/')}
            >
              Back to Home
            </Button>
          </Box>
        </Paper>

        {/* Add Module Section */}
        <Paper sx={{ p: 3, mb: 4, boxShadow: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <AddIcon color="primary" /> Add New Module
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Autocomplete
              options={availableModules}
              getOptionLabel={(option) => `${option.module_code} - ${option.module_name}`}
              value={selectedModule}
              onChange={(_, newValue) => setSelectedModule(newValue)}
              sx={{ flexGrow: 1, minWidth: 300 }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Search for a module..."
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <>
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                        {params.InputProps.startAdornment}
                      </>
                    ),
                  }}
                />
              )}
              renderOption={(props, option) => {
                const { key, ...restProps } = props;
                return (
                  <li key={key} {...restProps}>
                    <Box>
                      <Typography variant="body1">
                        <strong>{option.module_code}</strong> - {option.module_name}
                      </Typography>
                    </Box>
                  </li>
                );
              }}
            />
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddModule}
              disabled={!selectedModule}
              sx={{
                background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                minWidth: 120,
              }}
            >
              Add
            </Button>
          </Box>
        </Paper>

        {/* Search Saved Modules */}
        {modules.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <TextField
              size="small"
              placeholder="Search your modules..."
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
          </Box>
        )}

        {/* Modules Grid */}
        {loadingData ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : filteredModules.length > 0 ? (
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
                    <Typography variant="h6" sx={{ mt: 1, mb: 2, lineHeight: 1.3 }}>
                      {module.module_name}
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<PlayIcon />}
                      onClick={() => router.push(`/module/${module.module_code}`)}
                      fullWidth
                    >
                      View Kuppis
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Alert severity="info" sx={{ mt: 2 }}>
            {modules.length === 0 ? (
              <>
                No modules added yet. Use the search above or go to the{' '}
                <Button size="small" onClick={() => router.push('/')}>
                  home page
                </Button>{' '}
                to select modules from the mega menu.
              </>
            ) : (
              'No modules match your search.'
            )}
          </Alert>
        )}

        {/* Sign in prompt for non-logged users */}
        {!user && modules.length > 0 && (
          <Alert severity="info" sx={{ mt: 3 }}>
            <Button size="small" onClick={() => router.push('/login')}>
              Sign in
            </Button>{' '}
            to sync your modules across devices.
          </Alert>
        )}
      </Container>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />
    </Box>
  );
}
