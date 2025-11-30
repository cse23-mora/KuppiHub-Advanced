'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Grid,
  Button,
  Chip,
  Avatar,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from '@mui/material';
import {
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Person as PersonIcon,
  VideoLibrary as VideoIcon,
  YouTube as YouTubeIcon,
  Telegram as TelegramIcon,
  Description as MaterialIcon,
} from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';

interface PendingTutor {
  id: string;
  email: string;
  display_name: string;
  avatar_url: string;
  created_at: string;
}

interface PendingKuppi {
  id: string;
  title: string;
  description: string;
  module_code: string;
  youtube_links: string[];
  telegram_links: string[];
  material_urls: string[];
  language: string;
  created_at: string;
  users: {
    id: string;
    display_name: string;
    email: string;
    avatar_url: string;
  };
  modules: {
    module_code: string;
    module_name: string;
  };
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function AdminDashboard() {
  const { user, userProfile: profile, loading: authLoading } = useAuth();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [pendingTutors, setPendingTutors] = useState<PendingTutor[]>([]);
  const [pendingKuppis, setPendingKuppis] = useState<PendingKuppi[]>([]);
  const [selectedKuppi, setSelectedKuppi] = useState<PendingKuppi | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (profile?.id) {
      checkAdminAndFetchData();
    }
  }, [user, profile, authLoading, router]);

  const checkAdminAndFetchData = async () => {
    try {
      // Check if user is admin - this will fail if not admin
      const [tutorsRes, kuppisRes] = await Promise.all([
        fetch(`/api/admin/pending-tutors?adminId=${profile?.id}`),
        fetch(`/api/admin/pending-kuppis?adminId=${profile?.id}`),
      ]);

      if (tutorsRes.ok && kuppisRes.ok) {
        setIsAdmin(true);
        const tutorsData = await tutorsRes.json();
        const kuppisData = await kuppisRes.json();
        setPendingTutors(tutorsData.pendingTutors || []);
        setPendingKuppis(kuppisData.pendingKuppis || []);
      } else {
        setIsAdmin(false);
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  const handleTutorAction = async (tutorId: string, action: 'approve' | 'reject') => {
    setProcessing(tutorId);
    try {
      const res = await fetch('/api/admin/pending-tutors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminId: profile?.id,
          tutorId,
          action,
        }),
      });

      if (res.ok) {
        setPendingTutors(pendingTutors.filter((t) => t.id !== tutorId));
      }
    } catch (error) {
      console.error('Error processing tutor:', error);
    } finally {
      setProcessing(null);
    }
  };

  const handleKuppiAction = async (kuppiId: string, action: 'approve' | 'reject') => {
    setProcessing(kuppiId);
    try {
      const res = await fetch('/api/admin/pending-kuppis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminId: profile?.id,
          kuppiId,
          action,
        }),
      });

      if (res.ok) {
        setPendingKuppis(pendingKuppis.filter((k) => k.id !== kuppiId));
        setPreviewOpen(false);
        setSelectedKuppi(null);
      }
    } catch (error) {
      console.error('Error processing kuppi:', error);
    } finally {
      setProcessing(null);
    }
  };

  if (authLoading || loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isAdmin) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">
          <Typography variant="h6">Access Denied</Typography>
          <Typography>
            You do not have permission to access the admin dashboard.
          </Typography>
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Admin Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage tutor verifications and content approvals
        </Typography>
      </Box>

      {/* Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <PersonIcon />
                </Avatar>
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Pending Tutors
                  </Typography>
                  <Typography variant="h4">{pendingTutors.length}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'secondary.main' }}>
                  <VideoIcon />
                </Avatar>
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Pending Kuppis
                  </Typography>
                  <Typography variant="h4">{pendingKuppis.length}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Divider sx={{ mb: 3 }} />

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={tabValue}
          onChange={(_, newValue) => setTabValue(newValue)}
        >
          <Tab
            label={`Pending Tutors (${pendingTutors.length})`}
            icon={<PersonIcon />}
            iconPosition="start"
          />
          <Tab
            label={`Pending Kuppis (${pendingKuppis.length})`}
            icon={<VideoIcon />}
            iconPosition="start"
          />
        </Tabs>
      </Box>

      {/* Pending Tutors */}
      <TabPanel value={tabValue} index={0}>
        {pendingTutors.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Typography variant="h6" color="text.secondary">
              No pending tutor verifications
            </Typography>
          </Box>
        ) : (
          <List>
            {pendingTutors.map((tutor) => (
              <Card key={tutor.id} sx={{ mb: 2 }}>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar src={tutor.avatar_url}>
                      {tutor.display_name?.[0]}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={tutor.display_name}
                    secondary={
                      <>
                        {tutor.email}
                        <br />
                        Applied: {new Date(tutor.created_at).toLocaleDateString()}
                      </>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Button
                      variant="contained"
                      color="success"
                      startIcon={<ApproveIcon />}
                      onClick={() => handleTutorAction(tutor.id, 'approve')}
                      disabled={processing === tutor.id}
                      sx={{ mr: 1 }}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<RejectIcon />}
                      onClick={() => handleTutorAction(tutor.id, 'reject')}
                      disabled={processing === tutor.id}
                    >
                      Reject
                    </Button>
                  </ListItemSecondaryAction>
                </ListItem>
              </Card>
            ))}
          </List>
        )}
      </TabPanel>

      {/* Pending Kuppis */}
      <TabPanel value={tabValue} index={1}>
        {pendingKuppis.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Typography variant="h6" color="text.secondary">
              No pending kuppis to review
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {pendingKuppis.map((kuppi) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={kuppi.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" noWrap>
                      {kuppi.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {kuppi.modules?.module_name || kuppi.module_code}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, my: 2 }}>
                      <Avatar
                        src={kuppi.users?.avatar_url}
                        sx={{ width: 24, height: 24 }}
                      >
                        {kuppi.users?.display_name?.[0]}
                      </Avatar>
                      <Typography variant="body2">
                        {kuppi.users?.display_name}
                      </Typography>
                    </Box>

                    <Typography
                      variant="body2"
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        mb: 2,
                      }}
                    >
                      {kuppi.description || 'No description'}
                    </Typography>

                    {/* Content indicators */}
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {kuppi.youtube_links?.length > 0 && (
                        <Chip
                          size="small"
                          icon={<YouTubeIcon />}
                          label={kuppi.youtube_links.length}
                          variant="outlined"
                        />
                      )}
                      {kuppi.telegram_links?.length > 0 && (
                        <Chip
                          size="small"
                          icon={<TelegramIcon />}
                          label={kuppi.telegram_links.length}
                          variant="outlined"
                        />
                      )}
                      {kuppi.material_urls?.length > 0 && (
                        <Chip
                          size="small"
                          icon={<MaterialIcon />}
                          label={kuppi.material_urls.length}
                          variant="outlined"
                        />
                      )}
                      <Chip
                        size="small"
                        label={kuppi.language}
                        variant="outlined"
                      />
                    </Box>
                  </CardContent>

                  <CardActions sx={{ justifyContent: 'space-between' }}>
                    <Button
                      size="small"
                      onClick={() => {
                        setSelectedKuppi(kuppi);
                        setPreviewOpen(true);
                      }}
                    >
                      Preview
                    </Button>
                    <Box>
                      <IconButton
                        color="success"
                        onClick={() => handleKuppiAction(kuppi.id, 'approve')}
                        disabled={processing === kuppi.id}
                      >
                        <ApproveIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleKuppiAction(kuppi.id, 'reject')}
                        disabled={processing === kuppi.id}
                      >
                        <RejectIcon />
                      </IconButton>
                    </Box>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </TabPanel>

      {/* Kuppi Preview Dialog */}
      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{selectedKuppi?.title}</DialogTitle>
        <DialogContent dividers>
          {selectedKuppi && (
            <Box>
              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                {selectedKuppi.modules?.module_name} ({selectedKuppi.module_code})
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, my: 2 }}>
                <Avatar src={selectedKuppi.users?.avatar_url}>
                  {selectedKuppi.users?.display_name?.[0]}
                </Avatar>
                <Box>
                  <Typography variant="body2">
                    {selectedKuppi.users?.display_name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {selectedKuppi.users?.email}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="body1" paragraph>
                {selectedKuppi.description || 'No description provided'}
              </Typography>

              {selectedKuppi.youtube_links?.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    YouTube Links:
                  </Typography>
                  {selectedKuppi.youtube_links.map((link, i) => (
                    <Typography key={i} variant="body2">
                      <a href={link} target="_blank" rel="noopener noreferrer">
                        {link}
                      </a>
                    </Typography>
                  ))}
                </Box>
              )}

              {selectedKuppi.telegram_links?.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Telegram Links:
                  </Typography>
                  {selectedKuppi.telegram_links.map((link, i) => (
                    <Typography key={i} variant="body2">
                      <a href={link} target="_blank" rel="noopener noreferrer">
                        {link}
                      </a>
                    </Typography>
                  ))}
                </Box>
              )}

              {selectedKuppi.material_urls?.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Materials:
                  </Typography>
                  {selectedKuppi.material_urls.map((url, i) => (
                    <Typography key={i} variant="body2">
                      <a href={url} target="_blank" rel="noopener noreferrer">
                        {url}
                      </a>
                    </Typography>
                  ))}
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewOpen(false)}>Close</Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<RejectIcon />}
            onClick={() => selectedKuppi && handleKuppiAction(selectedKuppi.id, 'reject')}
            disabled={processing === selectedKuppi?.id}
          >
            Reject
          </Button>
          <Button
            variant="contained"
            color="success"
            startIcon={<ApproveIcon />}
            onClick={() => selectedKuppi && handleKuppiAction(selectedKuppi.id, 'approve')}
            disabled={processing === selectedKuppi?.id}
          >
            Approve
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
