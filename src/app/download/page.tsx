'use client';

import { Container, Paper, Typography, Button, Box, Grid, Card, CardContent, Chip } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import AndroidIcon from '@mui/icons-material/Android';
import AppleIcon from '@mui/icons-material/Apple';
import WindowsIcon from '@mui/icons-material/Window';
import ComputerIcon from '@mui/icons-material/Computer';

interface DownloadLink {
    name: string;
    platform: string;
    icon: React.ReactElement;
    size: string;
    url: string;
    sha256: string;
    version: string;
    color: string;
}

export default function DownloadPage() {
    const downloads: DownloadLink[] = [
        {
            name: 'KuppiHub for Android',
            platform: 'Android',
            icon: <AndroidIcon sx={{ fontSize: 48 }} />,
            size: '2.66 MB',
            url: 'https://github.com/cse23-mora/Kuppihub-APP/releases/download/v1.0.3/composeApp-release.apk',
            sha256: '89883d02a8eb866937945146006d703b0a1e5f80c697a1b41c7a4cdad4a0c5b6',
            version: 'v1.0.3',
            color: '#3DDC84',
        },
        {
            name: 'KuppiHub for macOS',
            platform: 'macOS',
            icon: <AppleIcon sx={{ fontSize: 48 }} />,
            size: '178 MB',
            url: 'https://github.com/cse23-mora/Kuppihub-APP/releases/download/v1.0.3/org.kuppihub.app-1.0.0.dmg',
            sha256: 'eddd28546696cc13e95599680bb4edf7db22649107ee1d7a5a015268855cf467',
            version: 'v1.0.3',
            color: '#000000',
        },
        {
            name: 'KuppiHub for Windows',
            platform: 'Windows',
            icon: <WindowsIcon sx={{ fontSize: 48 }} />,
            size: '167 MB',
            url: 'https://github.com/cse23-mora/Kuppihub-APP/releases/download/v1.0.3/org.kuppihub.app-1.0.0.msi',
            sha256: '90d4b354d8f06628cf043bbdd8ae6285bec45b34c61ba0739f1d5738cd1f4',
            version: 'v1.0.3',
            color: '#0078D4',
        },
        {
            name: 'KuppiHub for Linux',
            platform: 'Linux (Debian/Ubuntu)',
            icon: <ComputerIcon sx={{ fontSize: 48 }} />,
            size: '158 MB',
            url: 'https://github.com/cse23-mora/Kuppihub-APP/releases/download/v1.0.3/org.kuppihub.app_1.0.0_amd64.deb',
            sha256: 'e3d6d6826c82f755316b734cba708565845af8226beae01467164c545ebfabeb',
            version: 'v1.0.3',
            color: '#E95420',
        },
    ];

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
                    <Chip
                        label="Latest Version: v1.0.3"
                        color="primary"
                        sx={{ fontSize: '1rem', py: 2.5, px: 1 }}
                    />
                </Box>

                {/* Download Cards */}
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
                                        {download.icon}
                                    </Box>
                                    <Typography variant="h6" component="h2" gutterBottom fontWeight={600}>
                                        {download.platform}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        {download.name}
                                    </Typography>
                                    <Box sx={{ my: 2 }}>
                                        <Chip label={download.size} size="small" sx={{ mr: 1 }} />
                                        <Chip label={download.version} size="small" color="primary" variant="outlined" />
                                    </Box>
                                    <Button
                                        variant="contained"
                                        startIcon={<DownloadIcon />}
                                        fullWidth
                                        href={download.url}
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
