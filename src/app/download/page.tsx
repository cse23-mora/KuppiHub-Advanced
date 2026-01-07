'use client';

import { Container, Paper, Typography, Button, Box, Grid, Card, CardContent, Chip, Skeleton, Alert } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import AndroidIcon from '@mui/icons-material/Android';
import AppleIcon from '@mui/icons-material/Apple';
import WindowsIcon from '@mui/icons-material/Window';
import ComputerIcon from '@mui/icons-material/Computer';
import { useEffect, useState } from 'react';

interface ProcessedAsset {
    platform: string;
    platformName: string;
    fileName: string;
    size: string;
    url: string;
    sha256: string;
    icon: string;
    color: string;
}

interface ReleaseData {
    success: boolean;
    version: string;
    releaseName: string;
    releaseNotes: string;
    publishedAt: string;
    downloads: ProcessedAsset[];
}

interface DownloadLink extends ProcessedAsset {
    name: string;
    iconElement: React.ReactElement;
}

const getIconElement = (iconType: string) => {
    switch (iconType) {
        case 'android':
            return <AndroidIcon sx={{ fontSize: 48 }} />;
        case 'apple':
            return <AppleIcon sx={{ fontSize: 48 }} />;
        case 'windows':
            return <WindowsIcon sx={{ fontSize: 48 }} />;
        default:
            return <ComputerIcon sx={{ fontSize: 48 }} />;
    }
};

export default function DownloadPage() {
    const [downloads, setDownloads] = useState<DownloadLink[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [version, setVersion] = useState('');
    const [releaseName, setReleaseName] = useState('');
    const [releaseNotes, setReleaseNotes] = useState('');
    const [publishedAt, setPublishedAt] = useState('');

    useEffect(() => {
        const fetchReleaseData = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/releases/latest');
                const data: ReleaseData = await response.json();

                if (!data.success) {
                    throw new Error(data.downloads ? 'Failed to fetch release data' : 'API error');
                }

                // Transform downloaded data to include icon elements
                const downloadsWithIcons = data.downloads.map((download) => ({
                    ...download,
                    name: `KuppiHub for ${download.platform}`,
                    iconElement: getIconElement(download.icon),
                }));

                setDownloads(downloadsWithIcons);
                setVersion(data.version);
                setReleaseName(data.releaseName);
                setReleaseNotes(data.releaseNotes);
                setPublishedAt(data.publishedAt);
                setError(null);
            } catch (err) {
                console.error('Error fetching releases:', err);
                setError(err instanceof Error ? err.message : 'Failed to load releases');
                setDownloads([]);
            } finally {
                setLoading(false);
            }
        };

        fetchReleaseData();
    }, []);

    return (
        <div className="min-h-screen py-8 bg-gradient-to-br from-blue-50 to-indigo-100">
            <Container maxWidth="lg">
                {/* Hero Section */}
                <Box textAlign="center" mb={6}>
                    <Typography
                        variant="h2"
                        component="h1"
                        gutterBottom
                        sx={{
                            fontWeight: 800,
                            color: '#667eea',
                            mb: 2
                        }}
                    >
                        Download KuppiHub
                    </Typography>
                    <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
                        Get the KuppiHub app on your favorite platform. Study smarter, together!
                    </Typography>
                    {loading ? (
                        <Skeleton variant="rectangular" width={200} height={40} sx={{ mx: 'auto' }} />
                    ) : (
                        <Box>
                            <Chip
                                label={`Latest Version: ${version}`}
                                color="primary"
                                sx={{ fontSize: '1rem', py: 2.5, px: 1, mr: 1 }}
                            />
                            {releaseName && (
                                <Chip
                                    label={releaseName}
                                    color="secondary"
                                    variant="outlined"
                                    sx={{ fontSize: '0.9rem', py: 2.5, px: 1 }}
                                />
                            )}
                        </Box>
                    )}
                    {publishedAt && (
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
                            Published on {new Date(publishedAt).toLocaleDateString()}
                        </Typography>
                    )}
                </Box>

                {/* Error Alert */}
                {error && (
                    <Alert severity="warning" sx={{ mb: 4 }}>
                        {error}. Please check back later or visit our GitHub releases page.
                    </Alert>
                )}

                {/* Release Notes */}
                {releaseNotes && (
                    <Paper elevation={2} sx={{ mb: 6, p: 3, bgcolor: 'rgba(102, 126, 234, 0.05)', borderLeft: '4px solid #667eea' }}>
                        <Typography variant="h6" gutterBottom fontWeight={600} color="primary">
                            Release Notes
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
                            {releaseNotes || 'No release notes available.'}
                        </Typography>
                    </Paper>
                )}

                {/* Download Cards */}
                {loading ? (
                    <Grid container spacing={3} sx={{ mb: 6 }}>
                        {[1, 2, 3, 4].map((index) => (
                            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                                <Card elevation={3}>
                                    <CardContent sx={{ p: 3 }}>
                                        <Skeleton variant="rectangular" height={48} sx={{ mb: 2 }} />
                                        <Skeleton variant="text" />
                                        <Skeleton variant="text" />
                                        <Skeleton variant="rectangular" height={40} sx={{ mt: 2 }} />
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                ) : downloads.length > 0 ? (
                    <Grid container spacing={3}>
                        {downloads.map((download, index) => (
                            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                                <Card
                                    elevation={3}
                                    sx={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-8px)',
                                            boxShadow: 6,
                                        }
                                    }}
                                >
                                    <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 3 }}>
                                        <Box sx={{ color: download.color, mb: 2 }}>
                                            {download.iconElement}
                                        </Box>
                                        <Typography variant="h6" component="h2" gutterBottom fontWeight={600}>
                                            {download.platform}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                            {download.name}
                                        </Typography>
                                        <Box sx={{ my: 2 }}>
                                            <Chip label={download.size} size="small" sx={{ mr: 1 }} />
                                            <Chip label={version} size="small" color="primary" variant="outlined" />
                                        </Box>
                                        {download.sha256 && (
                                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1, wordBreak: 'break-all', maxWidth: '100%', fontSize: '0.75rem' }}>
                                                SHA256: {download.sha256.substring(0, 16)}...
                                            </Typography>
                                        )}
                                        <Button
                                            variant="contained"
                                            startIcon={<DownloadIcon />}
                                            fullWidth
                                            href={download.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            sx={{
                                                mt: 2,
                                                py: 1.5,
                                                background: `linear-gradient(45deg, ${download.color} 30%, ${download.color}dd 90%)`,
                                                fontWeight: 600,
                                                '&:hover': {
                                                    background: `linear-gradient(45deg, ${download.color}dd 30%, ${download.color}aa 90%)`,
                                                }
                                            }}
                                        >
                                            Download
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Alert severity="error">
                        No downloads available. Please try again later.
                    </Alert>
                )}

                {/* Installation Instructions */}
                <Paper elevation={2} sx={{ mt: 6, p: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                    <Typography variant="h5" gutterBottom fontWeight={700} color="white">
                        📱 Installation Instructions
                    </Typography>
                    <Grid container spacing={3} sx={{ mt: 1 }}>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Box sx={{ bgcolor: 'rgba(255,255,255,0.9)', p: 3, borderRadius: 2 }}>
                                <Typography variant="h6" gutterBottom fontWeight={600} color="primary">
                                    Android
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    1. Download the APK file<br />
                                    2. Enable "Install from unknown sources" in Settings<br />
                                    3. Open the APK and install<br />
                                    4. Launch KuppiHub!
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Box sx={{ bgcolor: 'rgba(255,255,255,0.9)', p: 3, borderRadius: 2 }}>
                                <Typography variant="h6" gutterBottom fontWeight={600} color="primary">
                                    macOS / Windows
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    1. Download the installer (.dmg or .msi)<br />
                                    2. Open the downloaded file<br />
                                    3. Follow the installation wizard<br />
                                    4. Launch KuppiHub from Applications!
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Box sx={{ bgcolor: 'rgba(255,255,255,0.9)', p: 3, borderRadius: 2 }}>
                                <Typography variant="h6" gutterBottom fontWeight={600} color="primary">
                                    Linux
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    1. Download the .deb file<br />
                                    2. Run: <code>sudo dpkg -i filename.deb</code><br />
                                    3. Or double-click to install via Software Center<br />
                                    4. Launch from your app menu!
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>
            </Container>
        </div>
    );
}
