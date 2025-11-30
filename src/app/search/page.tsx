'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  InputAdornment,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  CircularProgress,
  Paper,
  Alert,
} from '@mui/material';
import {
  Search as SearchIcon,
  MenuBook as ModuleIcon,
  Add as AddIcon,
  ArrowBack as BackIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import supabase from '@/lib/supabase';

interface Module {
  id: string;
  code: string;
  name: string;
  description: string | null;
  kuppi_count?: number;
}

export default function SearchPage() {
  const router = useRouter();
  const { userProfile } = useAuth();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [userModuleIds, setUserModuleIds] = useState<Set<string>>(new Set());
  const [addingModule, setAddingModule] = useState<string | null>(null);

  // Fetch user's saved modules
  useEffect(() => {
    const fetchUserModules = async () => {
      if (!userProfile) return;

      const { data } = await supabase
        .from('user_modules')
        .select('module_id')
        .eq('user_id', userProfile.id);

      if (data) {
        setUserModuleIds(new Set(data.map(m => m.module_id)));
      }
    };

    fetchUserModules();
  }, [userProfile]);

  // Search modules
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setHasSearched(true);

    const { data, error } = await supabase
      .from('modules')
      .select('*')
      .or(`code.ilike.%${searchQuery}%,name.ilike.%${searchQuery}%`)
      .order('code')
      .limit(50);

    if (!error && data) {
      setModules(data);
    }

    setLoading(false);
  };

  // Add module to user's dashboard
  const handleAddModule = async (moduleId: string) => {
    if (!userProfile) {
      router.push('/login?redirect=/search');
      return;
    }

    setAddingModule(moduleId);

    const { error } = await supabase.from('user_modules').insert([
      {
        user_id: userProfile.id,
        module_id: moduleId,
        is_default: false,
      },
    ]);

    if (!error) {
      setUserModuleIds(prev => new Set([...prev, moduleId]));
    }

    setAddingModule(null);
  };

  // Remove module from user's dashboard
  const handleRemoveModule = async (moduleId: string) => {
    if (!userProfile) return;

    const { error } = await supabase
      .from('user_modules')
      .delete()
      .eq('user_id', userProfile.id)
      .eq('module_id', moduleId);

    if (!error) {
      setUserModuleIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(moduleId);
        return newSet;
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
      <Container maxWidth="lg">
        {/* Back Button */}
        <Button startIcon={<BackIcon />} onClick={() => router.back()} sx={{ mb: 3 }}>
          Back
        </Button>

        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2,
            }}
          >
            Search Modules
          </Typography>
          <Typography color="text.secondary">
            Find any module by code or name
          </Typography>
        </Box>

        {/* Search Box */}
        <Paper sx={{ p: 3, mb: 4, boxShadow: 3 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              fullWidth
              placeholder="Search by module code (e.g., CS2023) or name (e.g., Data Structures)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="contained"
              onClick={handleSearch}
              disabled={loading || !searchQuery.trim()}
              sx={{
                px: 4,
                background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Search'}
            </Button>
          </Box>
        </Paper>

        {/* Results */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : hasSearched ? (
          modules.length > 0 ? (
            <Grid container spacing={2}>
              {modules.map((module) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={module.id}>
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
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Chip label={module.code} color="primary" size="small" />
                        {userModuleIds.has(module.id) && (
                          <Chip label="Saved" color="success" size="small" variant="outlined" />
                        )}
                      </Box>
                      <Typography variant="h6" sx={{ mt: 1, mb: 1 }}>
                        {module.name}
                      </Typography>
                      {module.description && (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {module.description.length > 100
                            ? `${module.description.substring(0, 100)}...`
                            : module.description}
                        </Typography>
                      )}
                    </CardContent>
                    <Box sx={{ p: 2, pt: 0, display: 'flex', gap: 1 }}>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => router.push(`/module/${module.code}`)}
                        startIcon={<ModuleIcon />}
                      >
                        View Kuppis
                      </Button>
                      {userModuleIds.has(module.id) ? (
                        <Button
                          size="small"
                          color="error"
                          onClick={() => handleRemoveModule(module.id)}
                        >
                          Remove
                        </Button>
                      ) : (
                        <Button
                          size="small"
                          variant="contained"
                          onClick={() => handleAddModule(module.id)}
                          disabled={addingModule === module.id}
                          startIcon={
                            addingModule === module.id ? (
                              <CircularProgress size={16} color="inherit" />
                            ) : (
                              <AddIcon />
                            )
                          }
                        >
                          {addingModule === module.id ? 'Adding...' : 'Add'}
                        </Button>
                      )}
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Alert severity="info">
                No modules found for &quot;{searchQuery}&quot;. Try a different search term.
              </Alert>
            </Paper>
          )
        ) : (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <ModuleIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              Search for modules to get started
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Enter a module code like &quot;CS2023&quot; or a name like &quot;Data Structures&quot;
            </Typography>
          </Paper>
        )}
      </Container>
    </Box>
  );
}
