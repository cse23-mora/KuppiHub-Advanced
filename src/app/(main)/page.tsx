'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  Alert,
  CircularProgress,
  Paper,
  Divider,
  SelectChangeEvent,
} from '@mui/material';
import {
  School as SchoolIcon,
  Business as BusinessIcon,
  CalendarMonth as CalendarIcon,
  MenuBook as ModuleIcon,
  Search as SearchIcon,
  Dashboard as DashboardIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { 
  universityData, 
  FacultyData, 
  DepartmentData, 
  SemesterData,
  ModuleInfo,
  getFacultyById,
  getDepartmentById,
  getModulesForPath,
} from '@/data/universityHierarchy';
import { useAuth } from '@/contexts/AuthContext';

export default function HomePage() {
  const router = useRouter();
  const { user, userProfile } = useAuth();
  
  // Selection state
  const [selectedFaculty, setSelectedFaculty] = useState<string>('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [selectedSemester, setSelectedSemester] = useState<string>('');
  
  // Derived data
  const [departments, setDepartments] = useState<DepartmentData[]>([]);
  const [semesters, setSemesters] = useState<SemesterData[]>([]);
  const [modules, setModules] = useState<ModuleInfo[]>([]);
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [showModules, setShowModules] = useState(false);

  // Get the current faculty data
  const currentFaculty = selectedFaculty ? getFacultyById(selectedFaculty) : null;

  // Handle faculty change
  const handleFacultyChange = (event: SelectChangeEvent) => {
    const facultyId = event.target.value;
    setSelectedFaculty(facultyId);
    setSelectedDepartment('');
    setSelectedSemester('');
    setModules([]);
    setShowModules(false);

    const faculty = getFacultyById(facultyId);
    if (faculty) {
      if (faculty.hasDepartments && faculty.departments) {
        setDepartments(faculty.departments);
        setSemesters([]);
      } else if (faculty.semesters) {
        setDepartments([]);
        setSemesters(faculty.semesters);
      }
    }
  };

  // Handle department change
  const handleDepartmentChange = (event: SelectChangeEvent) => {
    const departmentId = event.target.value;
    setSelectedDepartment(departmentId);
    setSelectedSemester('');
    setModules([]);
    setShowModules(false);

    const department = getDepartmentById(selectedFaculty, departmentId);
    if (department) {
      setSemesters(department.semesters);
    }
  };

  // Handle semester change
  const handleSemesterChange = (event: SelectChangeEvent) => {
    const semesterId = event.target.value;
    setSelectedSemester(semesterId);
    setShowModules(false);
  };

  // Load modules for selected path
  const handleLoadModules = () => {
    setLoading(true);
    
    // Simulate loading
    setTimeout(() => {
      const modulesList = getModulesForPath(
        selectedFaculty,
        selectedSemester,
        currentFaculty?.hasDepartments ? selectedDepartment : undefined
      );
      setModules(modulesList);
      setShowModules(true);
      setLoading(false);
    }, 500);
  };

  // Navigate to module's kuppi page
  const handleModuleClick = (moduleCode: string) => {
    router.push(`/module/${moduleCode}`);
  };

  // Check if can show "Get Modules" button
  const canLoadModules = selectedFaculty && selectedSemester && 
    (!currentFaculty?.hasDepartments || selectedDepartment);

  // Save selection to localStorage
  useEffect(() => {
    if (selectedFaculty && selectedSemester) {
      const selection = {
        facultyId: selectedFaculty,
        departmentId: selectedDepartment || null,
        semesterId: selectedSemester,
      };
      localStorage.setItem('kuppihub_selection', JSON.stringify(selection));
    }
  }, [selectedFaculty, selectedDepartment, selectedSemester]);

  // Load saved selection on mount
  useEffect(() => {
    const saved = localStorage.getItem('kuppihub_selection');
    if (saved) {
      try {
        const selection = JSON.parse(saved);
        if (selection.facultyId) {
          setSelectedFaculty(selection.facultyId);
          const faculty = getFacultyById(selection.facultyId);
          if (faculty) {
            if (faculty.hasDepartments && faculty.departments) {
              setDepartments(faculty.departments);
              if (selection.departmentId) {
                setSelectedDepartment(selection.departmentId);
                const dept = getDepartmentById(selection.facultyId, selection.departmentId);
                if (dept) {
                  setSemesters(dept.semesters);
                }
              }
            } else if (faculty.semesters) {
              setSemesters(faculty.semesters);
            }
            if (selection.semesterId) {
              setSelectedSemester(selection.semesterId);
            }
          }
        }
      } catch (e) {
        console.error('Error loading saved selection:', e);
      }
    }
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2,
            }}
          >
            KuppiHub
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Find the best study resources for your modules
          </Typography>
        </Box>

        {/* User welcome */}
        {user && userProfile && (
          <Alert severity="info" sx={{ mb: 4 }}>
            Welcome back, {userProfile.display_name || user.email}! 
            <Button 
              size="small" 
              sx={{ ml: 2 }}
              onClick={() => router.push('/dashboard')}
              startIcon={<DashboardIcon />}
            >
              Go to Dashboard
            </Button>
          </Alert>
        )}

        {/* Selection Card */}
        <Card sx={{ mb: 4, boxShadow: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <SchoolIcon color="primary" />
              Select Your Program
            </Typography>

            <Grid container spacing={3}>
              {/* Faculty Selection */}
              <Grid size={{ xs: 12, md: 4 }}>
                <FormControl fullWidth>
                  <InputLabel id="faculty-label">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <SchoolIcon fontSize="small" />
                      Faculty
                    </Box>
                  </InputLabel>
                  <Select
                    labelId="faculty-label"
                    value={selectedFaculty}
                    label="Faculty"
                    onChange={handleFacultyChange}
                  >
                    {universityData.map((faculty) => (
                      <MenuItem key={faculty.id} value={faculty.id}>
                        {faculty.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Department Selection (if applicable) */}
              {currentFaculty?.hasDepartments && (
                <Grid size={{ xs: 12, md: 4 }}>
                  <FormControl fullWidth disabled={!selectedFaculty}>
                    <InputLabel id="department-label">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <BusinessIcon fontSize="small" />
                        Department
                      </Box>
                    </InputLabel>
                    <Select
                      labelId="department-label"
                      value={selectedDepartment}
                      label="Department"
                      onChange={handleDepartmentChange}
                    >
                      {departments.map((dept) => (
                        <MenuItem key={dept.id} value={dept.id}>
                          {dept.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              )}

              {/* Semester Selection */}
              <Grid size={{ xs: 12, md: currentFaculty?.hasDepartments ? 4 : 8 }}>
                <FormControl 
                  fullWidth 
                  disabled={!selectedFaculty || (currentFaculty?.hasDepartments && !selectedDepartment)}
                >
                  <InputLabel id="semester-label">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CalendarIcon fontSize="small" />
                      Semester
                    </Box>
                  </InputLabel>
                  <Select
                    labelId="semester-label"
                    value={selectedSemester}
                    label="Semester"
                    onChange={handleSemesterChange}
                  >
                    {semesters.map((sem) => (
                      <MenuItem key={sem.id} value={sem.id}>
                        {sem.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            {/* Get Modules Button */}
            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Button
                variant="contained"
                size="large"
                disabled={!canLoadModules || loading}
                onClick={handleLoadModules}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <ModuleIcon />}
                sx={{
                  px: 6,
                  py: 1.5,
                  borderRadius: 2,
                  background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #5a6fd6 30%, #6a4190 90%)',
                  },
                }}
              >
                {loading ? 'Loading...' : 'Get My Modules'}
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Modules Display */}
        {showModules && (
          <Paper sx={{ p: 4, boxShadow: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ModuleIcon color="primary" />
                Your Modules ({modules.length})
              </Typography>
              <Button
                variant="outlined"
                startIcon={<SearchIcon />}
                onClick={() => router.push('/search')}
              >
                Search More Modules
              </Button>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {modules.length > 0 ? (
              <Grid container spacing={2}>
                {modules.map((module) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={module.code}>
                    <Card
                      sx={{
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: 4,
                        },
                      }}
                      onClick={() => handleModuleClick(module.code)}
                    >
                      <CardContent>
                        <Chip
                          label={module.code}
                          color="primary"
                          size="small"
                          sx={{ mb: 1 }}
                        />
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {module.name}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Alert severity="info">
                No modules found for this selection. Try a different combination or search for modules.
              </Alert>
            )}

            {/* Add to Dashboard Button (for logged in users) */}
            {user && modules.length > 0 && (
              <Box sx={{ mt: 4, textAlign: 'center' }}>
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<DashboardIcon />}
                  onClick={() => {
                    // Save modules to dashboard
                    router.push('/dashboard');
                  }}
                >
                  Save to My Dashboard
                </Button>
              </Box>
            )}
          </Paper>
        )}

        {/* Quick Actions */}
        <Grid container spacing={3} sx={{ mt: 4 }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card
              sx={{
                height: '100%',
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 },
              }}
              onClick={() => router.push('/search')}
            >
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <SearchIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6">Search Modules</Typography>
                <Typography color="text.secondary">
                  Find any module by name or code
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card
              sx={{
                height: '100%',
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 },
              }}
              onClick={() => router.push('/tutors')}
            >
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <SchoolIcon sx={{ fontSize: 48, color: 'secondary.main', mb: 2 }} />
                <Typography variant="h6">Browse Tutors</Typography>
                <Typography color="text.secondary">
                  See top contributors and their kuppis
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card
              sx={{
                height: '100%',
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 },
              }}
              onClick={() => router.push(user ? '/add-kuppi' : '/login')}
            >
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <ModuleIcon sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
                <Typography variant="h6">Add a Kuppi</Typography>
                <Typography color="text.secondary">
                  Share your knowledge with others
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
