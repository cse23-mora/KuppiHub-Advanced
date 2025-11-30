'use client';

import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  Typography,
  Chip,
  CircularProgress,
  Alert,
  Snackbar,
  Paper,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Popper,
  ClickAwayListener,
  Fade,
  Badge,
} from '@mui/material';
import {
  Add as AddIcon,
  ChevronRight as ChevronRightIcon,
  School as SchoolIcon,
  Business as DepartmentIcon,
  CalendarMonth as SemesterIcon,
  CheckCircle as CheckIcon,
  MenuBook as ModuleIcon,
} from '@mui/icons-material';
import { universityData, FacultyData, DepartmentData, SemesterData, ModuleInfo } from '@/data/universityHierarchy';
import { useAuth } from '@/contexts/AuthContext';
import supabase from '@/lib/supabase';

interface Module {
  module_code: string;
  module_name: string;
  faculty: string;
  department: string | null;
  semester: string;
}

export default function MegaMenu() {
  const { user, userProfile } = useAuth();
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  // Menu state
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoveredFaculty, setHoveredFaculty] = useState<FacultyData | null>(null);
  const [hoveredDepartment, setHoveredDepartment] = useState<DepartmentData | null>(null);
  const [hoveredSemester, setHoveredSemester] = useState<SemesterData | null>(null);
  
  // Data state
  const [loading, setLoading] = useState(false);
  const [selectedModules, setSelectedModules] = useState<Module[]>([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  // Get modules from static hierarchy data
  const getModulesForSemester = (faculty: FacultyData, department: DepartmentData | null, semester: SemesterData): Module[] => {
    // Get modules from the static data
    const staticModules = semester.modules || [];
    
    // Convert to Module interface format
    return staticModules.map((m: ModuleInfo) => ({
      module_code: m.code,
      module_name: m.name,
      faculty: faculty.id,
      department: department?.id || null,
      semester: semester.id,
    }));
  };

  // Toggle module selection
  const toggleModule = (module: Module) => {
    setSelectedModules(prev => {
      const exists = prev.find(m => m.module_code === module.module_code);
      if (exists) {
        return prev.filter(m => m.module_code !== module.module_code);
      }
      return [...prev, module];
    });
  };

  // Check if module is selected
  const isSelected = (moduleCode: string) => {
    return selectedModules.some(m => m.module_code === moduleCode);
  };

  // Handle semester hover - no need to fetch, data is static
  const handleSemesterHover = (faculty: FacultyData, department: DepartmentData | null, semester: SemesterData) => {
    setHoveredSemester(semester);
  };

  // Add selected modules to dashboard
  const handleAddToDashboard = async () => {
    if (selectedModules.length === 0) {
      setSnackbar({ open: true, message: 'Please select at least one module', severity: 'error' });
      return;
    }

    setLoading(true);
    
    // Save to localStorage (just module_code and module_name)
    const existingModules = JSON.parse(localStorage.getItem('kuppihub_user_modules') || '[]');
    const newModules = selectedModules
      .filter(m => !existingModules.some((em: { module_code: string }) => em.module_code === m.module_code))
      .map(m => ({ module_code: m.module_code, module_name: m.module_name }));
    const allModules = [...existingModules, ...newModules];
    localStorage.setItem('kuppihub_user_modules', JSON.stringify(allModules));

    // If user is logged in, also save to Supabase (just module_code)
    if (user && userProfile) {
      try {
        const entries = selectedModules.map(module => ({
          user_id: userProfile.id,
          module_code: module.module_code,
        }));

        const { error } = await supabase
          .from('user_modules')
          .upsert(entries, { onConflict: 'user_id,module_code', ignoreDuplicates: true });

        if (error) {
          console.warn('Could not save to database, saved locally:', JSON.stringify(error));
        }
      } catch (error) {
        console.warn('Database save failed, modules saved locally:', error);
      }
    }

    setSnackbar({ 
      open: true, 
      message: `Added ${selectedModules.length} module(s) to your dashboard!`, 
      severity: 'success' 
    });
    setSelectedModules([]);
    setMenuOpen(false);
    setLoading(false);
  };

  const handleClose = () => {
    setMenuOpen(false);
    setHoveredFaculty(null);
    setHoveredDepartment(null);
    setHoveredSemester(null);
  };

  // Get current modules from static data
  const currentModules = (hoveredFaculty && hoveredSemester) 
    ? getModulesForSemester(hoveredFaculty, hoveredDepartment, hoveredSemester)
    : [];

  return (
    <>
      {/* Trigger Button */}
      <Badge badgeContent={selectedModules.length} color="error">
        <Button
          ref={buttonRef}
          variant="contained"
          size="small"
          startIcon={<AddIcon />}
          onClick={() => setMenuOpen(!menuOpen)}
          sx={{ 
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
          }}
        >
          Add Modules
        </Button>
      </Badge>

      {/* Mega Menu Popper */}
      <Popper
        open={menuOpen}
        anchorEl={buttonRef.current}
        placement="bottom-start"
        transition
        style={{ zIndex: 1300 }}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={200}>
            <Box>
              <ClickAwayListener onClickAway={handleClose}>
                <Paper 
                  elevation={8}
                  sx={{ 
                    display: 'flex',
                    mt: 1,
                    borderRadius: 2,
                    overflow: 'hidden',
                    maxHeight: '70vh',
                  }}
                >
                  {/* Column 1: Faculties */}
                  <Box
                    sx={{
                      width: 250,
                      borderRight: 1,
                      borderColor: 'divider',
                      bgcolor: 'grey.50',
                    }}
                  >
                    <Box sx={{ p: 1.5, borderBottom: 1, borderColor: 'divider', bgcolor: 'primary.main' }}>
                      <Typography variant="subtitle2" fontWeight={600} color="white">
                        <SchoolIcon sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                        Select Faculty
                      </Typography>
                    </Box>
                    <List dense sx={{ py: 0, maxHeight: 400, overflow: 'auto' }}>
                      {universityData.map((faculty) => (
                        <ListItemButton
                          key={faculty.id}
                          selected={hoveredFaculty?.id === faculty.id}
                          onMouseEnter={() => {
                            setHoveredFaculty(faculty);
                            setHoveredDepartment(null);
                            setHoveredSemester(null);
                          }}
                          sx={{
                            '&:hover': { bgcolor: 'primary.light', color: 'white' },
                            '&.Mui-selected': { bgcolor: 'primary.main', color: 'white' },
                            '&.Mui-selected:hover': { bgcolor: 'primary.dark' },
                          }}
                        >
                          <ListItemText 
                            primary={faculty.name} 
                            primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                          />
                          <ChevronRightIcon fontSize="small" />
                        </ListItemButton>
                      ))}
                    </List>
                  </Box>

                  {/* Column 2: Departments or Semesters */}
                  {hoveredFaculty && (
                    <Box
                      sx={{
                        width: 220,
                        borderRight: 1,
                        borderColor: 'divider',
                      }}
                    >
                      <Box sx={{ p: 1.5, borderBottom: 1, borderColor: 'divider', bgcolor: 'grey.100' }}>
                        <Typography variant="subtitle2" fontWeight={600}>
                          <DepartmentIcon sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                          {hoveredFaculty.hasDepartments ? 'Department' : 'Year/Semester'}
                        </Typography>
                      </Box>
                      <List dense sx={{ py: 0, maxHeight: 400, overflow: 'auto' }}>
                        {hoveredFaculty.hasDepartments && hoveredFaculty.departments ? (
                          hoveredFaculty.departments.map((dept) => (
                            <ListItemButton
                              key={dept.id}
                              selected={hoveredDepartment?.id === dept.id}
                              onMouseEnter={() => {
                                setHoveredDepartment(dept);
                                setHoveredSemester(null);
                              }}
                              sx={{
                                '&:hover': { bgcolor: 'secondary.light', color: 'white' },
                                '&.Mui-selected': { bgcolor: 'secondary.main', color: 'white' },
                                '&.Mui-selected:hover': { bgcolor: 'secondary.dark' },
                              }}
                            >
                              <ListItemText 
                                primary={dept.name} 
                                primaryTypographyProps={{ variant: 'body2' }}
                              />
                              <ChevronRightIcon fontSize="small" />
                            </ListItemButton>
                          ))
                        ) : hoveredFaculty.semesters ? (
                          hoveredFaculty.semesters.map((sem) => (
                            <ListItemButton
                              key={sem.id}
                              selected={hoveredSemester?.id === sem.id}
                              onMouseEnter={() => handleSemesterHover(hoveredFaculty, null, sem)}
                              sx={{
                                '&:hover': { bgcolor: 'success.light', color: 'white' },
                                '&.Mui-selected': { bgcolor: 'success.main', color: 'white' },
                                '&.Mui-selected:hover': { bgcolor: 'success.dark' },
                              }}
                            >
                              <ListItemIcon sx={{ minWidth: 32 }}>
                                <SemesterIcon fontSize="small" />
                              </ListItemIcon>
                              <ListItemText 
                                primary={sem.name} 
                                primaryTypographyProps={{ variant: 'body2' }}
                              />
                              <ChevronRightIcon fontSize="small" />
                            </ListItemButton>
                          ))
                        ) : null}
                      </List>
                    </Box>
                  )}

                  {/* Column 3: Semesters (if faculty has departments) */}
                  {hoveredFaculty?.hasDepartments && hoveredDepartment && (
                    <Box
                      sx={{
                        width: 180,
                        borderRight: 1,
                        borderColor: 'divider',
                      }}
                    >
                      <Box sx={{ p: 1.5, borderBottom: 1, borderColor: 'divider', bgcolor: 'grey.100' }}>
                        <Typography variant="subtitle2" fontWeight={600}>
                          <SemesterIcon sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                          Semester
                        </Typography>
                      </Box>
                      <List dense sx={{ py: 0, maxHeight: 400, overflow: 'auto' }}>
                        {hoveredDepartment.semesters.map((sem) => (
                          <ListItemButton
                            key={sem.id}
                            selected={hoveredSemester?.id === sem.id}
                            onMouseEnter={() => handleSemesterHover(hoveredFaculty, hoveredDepartment, sem)}
                            sx={{
                              '&:hover': { bgcolor: 'success.light', color: 'white' },
                              '&.Mui-selected': { bgcolor: 'success.main', color: 'white' },
                              '&.Mui-selected:hover': { bgcolor: 'success.dark' },
                            }}
                          >
                            <ListItemText 
                              primary={sem.name} 
                              primaryTypographyProps={{ variant: 'body2' }}
                            />
                            <ChevronRightIcon fontSize="small" />
                          </ListItemButton>
                        ))}
                      </List>
                    </Box>
                  )}

                  {/* Column 4: Modules */}
                  {hoveredSemester && (
                    <Box
                      sx={{
                        width: 320,
                        bgcolor: 'white',
                      }}
                    >
                      <Box sx={{ p: 1.5, borderBottom: 1, borderColor: 'divider', bgcolor: 'success.main' }}>
                        <Typography variant="subtitle2" fontWeight={600} color="white">
                          <ModuleIcon sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                          Modules - Click to Select
                        </Typography>
                      </Box>
                      <Box sx={{ p: 2, maxHeight: 400, overflow: 'auto' }}>
                        {currentModules.length > 0 ? (
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            {currentModules.map((module: Module) => (
                              <Chip
                                key={module.module_code}
                                label={
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <strong>{module.module_code}</strong>
                                    <span>-</span>
                                    <span style={{ fontSize: '0.85em' }}>{module.module_name}</span>
                                  </Box>
                                }
                                onClick={() => toggleModule(module)}
                                color={isSelected(module.module_code) ? 'primary' : 'default'}
                                icon={isSelected(module.module_code) ? <CheckIcon /> : undefined}
                                sx={{ 
                                  cursor: 'pointer',
                                  justifyContent: 'flex-start',
                                  height: 'auto',
                                  py: 1,
                                  '& .MuiChip-label': { 
                                    whiteSpace: 'normal',
                                    display: 'block',
                                  },
                                  '&:hover': { 
                                    bgcolor: isSelected(module.module_code) ? 'primary.dark' : 'grey.200',
                                  }
                                }}
                              />
                            ))}
                          </Box>
                        ) : (
                          <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                            No modules available
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  )}
                </Paper>
              </ClickAwayListener>

              {/* Selected Modules Footer */}
              {selectedModules.length > 0 && (
                <Paper 
                  elevation={8}
                  sx={{ 
                    mt: 1, 
                    p: 2, 
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 2,
                  }}
                >
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, flex: 1 }}>
                    <Typography variant="body2" fontWeight={600} sx={{ mr: 1 }}>
                      Selected:
                    </Typography>
                    {selectedModules.map(m => (
                      <Chip 
                        key={m.module_code} 
                        label={m.module_code} 
                        size="small" 
                        onDelete={() => toggleModule(m)}
                        color="primary"
                      />
                    ))}
                  </Box>
                  <Button
                    variant="contained"
                    color="success"
                    size="small"
                    onClick={handleAddToDashboard}
                    disabled={loading || !user}
                    startIcon={loading ? <CircularProgress size={16} /> : <AddIcon />}
                  >
                    {!user ? 'Login First' : `Add (${selectedModules.length})`}
                  </Button>
                </Paper>
              )}
            </Box>
          </Fade>
        )}
      </Popper>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          severity={snackbar.severity} 
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
