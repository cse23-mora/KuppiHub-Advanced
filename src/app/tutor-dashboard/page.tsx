'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  YouTube as YouTubeIcon,
  Telegram as TelegramIcon,
  Description as MaterialIcon,
  CheckCircle as ApprovedIcon,
  HourglassEmpty as PendingIcon,
} from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';

interface Kuppi {
  id: string;
  title: string;
  description: string;
  module_code: string;
  youtube_links: string[];
  telegram_links: string[];
  material_urls: string[];
  thumbnail_url: string;
  language: string;
  is_approved: boolean;
  created_at: string;
  modules?: {
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
    <div
      role="tabpanel"
      hidden={value !== index}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function TutorDashboard() {
  const { user, userProfile: profile, loading: authLoading } = useAuth();
  const router = useRouter();
  const [kuppis, setKuppis] = useState<Kuppi[]>([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedKuppi, setSelectedKuppi] = useState<Kuppi | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (profile && profile.role !== 'tutor') {
      router.push('/dashboard');
      return;
    }

    if (profile?.id) {
      fetchKuppis();
    }
  }, [user, profile, authLoading, router]);

  const fetchKuppis = async () => {
    try {
      const res = await fetch(`/api/kuppis/new?tutorId=${profile?.id}`);
      const data = await res.json();
      setKuppis(data.kuppis || []);
    } catch (error) {
      console.error('Error fetching kuppis:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (kuppi: Kuppi) => {
    setSelectedKuppi(kuppi);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedKuppi || !profile) return;

    setDeleting(true);
    try {
      const res = await fetch('/api/kuppis/new', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedKuppi.id,
          tutorId: profile.id,
        }),
      });

      if (res.ok) {
        setKuppis(kuppis.filter((k) => k.id !== selectedKuppi.id));
        setDeleteDialogOpen(false);
        setSelectedKuppi(null);
      }
    } catch (error) {
      console.error('Error deleting kuppi:', error);
    } finally {
      setDeleting(false);
    }
  };

  const approvedKuppis = kuppis.filter((k) => k.is_approved);
  const pendingKuppis = kuppis.filter((k) => !k.is_approved);

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

  if (!profile?.is_verified_tutor) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Account Pending Verification
          </Typography>
          <Typography>
            Your tutor account is pending verification by an administrator.
            You&apos;ll be able to publish kuppis once your account is verified.
          </Typography>
        </Alert>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              What happens next?
            </Typography>
            <Typography paragraph>
              1. An administrator will review your account
            </Typography>
            <Typography paragraph>
              2. Once verified, you can create and publish kuppis
            </Typography>
            <Typography paragraph>
              3. Your kuppis will be immediately visible to students
            </Typography>
          </CardContent>
        </Card>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            src={profile?.photo_url || undefined}
            sx={{ width: 56, height: 56 }}
          >
            {profile?.display_name?.[0]}
          </Avatar>
          <Box>
            <Typography variant="h4">Tutor Dashboard</Typography>
            <Typography variant="body2" color="text.secondary">
              Welcome back, {profile?.display_name}
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          component={Link}
          href="/add-kuppi"
        >
          Add New Kuppi
        </Button>
      </Box>

      {/* Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Kuppis
              </Typography>
              <Typography variant="h3">{kuppis.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Published
              </Typography>
              <Typography variant="h3" color="success.main">
                {approvedKuppis.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Pending Approval
              </Typography>
              <Typography variant="h3" color="warning.main">
                {pendingKuppis.length}
              </Typography>
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
            label={`All (${kuppis.length})`}
            icon={<ViewIcon />}
            iconPosition="start"
          />
          <Tab
            label={`Published (${approvedKuppis.length})`}
            icon={<ApprovedIcon />}
            iconPosition="start"
          />
          <Tab
            label={`Pending (${pendingKuppis.length})`}
            icon={<PendingIcon />}
            iconPosition="start"
          />
        </Tabs>
      </Box>

      {/* All Kuppis */}
      <TabPanel value={tabValue} index={0}>
        <KuppiGrid
          kuppis={kuppis}
          onDelete={handleDeleteClick}
        />
      </TabPanel>

      {/* Published Kuppis */}
      <TabPanel value={tabValue} index={1}>
        <KuppiGrid
          kuppis={approvedKuppis}
          onDelete={handleDeleteClick}
        />
      </TabPanel>

      {/* Pending Kuppis */}
      <TabPanel value={tabValue} index={2}>
        <KuppiGrid
          kuppis={pendingKuppis}
          onDelete={handleDeleteClick}
        />
      </TabPanel>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Kuppi</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete &quot;{selectedKuppi?.title}&quot;? This
            action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            disabled={deleting}
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

interface KuppiGridProps {
  kuppis: Kuppi[];
  onDelete: (kuppi: Kuppi) => void;
}

function KuppiGrid({ kuppis, onDelete }: KuppiGridProps) {
  if (kuppis.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 6 }}>
        <Typography variant="h6" color="text.secondary">
          No kuppis found
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          component={Link}
          href="/add-kuppi"
          sx={{ mt: 2 }}
        >
          Create Your First Kuppi
        </Button>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {kuppis.map((kuppi) => (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={kuppi.id}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  mb: 1,
                }}
              >
                <Typography variant="h6" noWrap sx={{ maxWidth: '70%' }}>
                  {kuppi.title}
                </Typography>
                <Chip
                  size="small"
                  label={kuppi.is_approved ? 'Published' : 'Pending'}
                  color={kuppi.is_approved ? 'success' : 'warning'}
                />
              </Box>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 2 }}
              >
                {kuppi.modules?.module_name || kuppi.module_code}
              </Typography>

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
                    label={`${kuppi.youtube_links.length} video${kuppi.youtube_links.length > 1 ? 's' : ''}`}
                    variant="outlined"
                  />
                )}
                {kuppi.telegram_links?.length > 0 && (
                  <Chip
                    size="small"
                    icon={<TelegramIcon />}
                    label={`${kuppi.telegram_links.length} link${kuppi.telegram_links.length > 1 ? 's' : ''}`}
                    variant="outlined"
                  />
                )}
                {kuppi.material_urls?.length > 0 && (
                  <Chip
                    size="small"
                    icon={<MaterialIcon />}
                    label={`${kuppi.material_urls.length} file${kuppi.material_urls.length > 1 ? 's' : ''}`}
                    variant="outlined"
                  />
                )}
              </Box>
            </CardContent>

            <CardActions sx={{ justifyContent: 'flex-end' }}>
              <IconButton
                component={Link}
                href={`/module/${kuppi.module_code}`}
                title="View"
              >
                <ViewIcon />
              </IconButton>
              <IconButton
                component={Link}
                href={`/edit-kuppi/${kuppi.id}`}
                title="Edit"
              >
                <EditIcon />
              </IconButton>
              <IconButton
                onClick={() => onDelete(kuppi)}
                color="error"
                title="Delete"
              >
                <DeleteIcon />
              </IconButton>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
