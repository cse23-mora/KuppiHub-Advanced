import React, { useEffect, useState } from 'react';
import { Paper, Typography, Box, Chip, Alert, Skeleton } from '@mui/material';
import { ReleaseData } from '@/types/releases';

interface ReleaseInfoProps {
    showReleaseNotes?: boolean;
    compact?: boolean;
}

export const ReleaseInfo: React.FC<ReleaseInfoProps> = ({ 
    showReleaseNotes = true, 
    compact = false 
}) => {
    const [releaseData, setReleaseData] = useState<ReleaseData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/releases/latest');
                const data = await response.json();

                if (!data.success) {
                    throw new Error('Failed to fetch release data');
                }

                setReleaseData(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <Skeleton variant="rectangular" height={compact ? 80 : 150} />;
    }

    if (error || !releaseData) {
        return (
            <Alert severity="warning">
                Unable to fetch release information. Check back later!
            </Alert>
        );
    }

    return (
        <Box>
            {compact ? (
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                    <Chip
                        label={`v${releaseData.version}`}
                        color="primary"
                        size="small"
                    />
                    {releaseData.publishedAt && (
                        <Typography variant="caption" color="text.secondary">
                            {new Date(releaseData.publishedAt).toLocaleDateString()}
                        </Typography>
                    )}
                </Box>
            ) : (
                <Paper elevation={2} sx={{ p: 3, bgcolor: 'rgba(102, 126, 234, 0.05)' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                        <div>
                            <Typography variant="h6" fontWeight={600} color="primary">
                                {releaseData.releaseName || `Release ${releaseData.version}`}
                            </Typography>
                            {releaseData.publishedAt && (
                                <Typography variant="caption" color="text.secondary">
                                    Published on {new Date(releaseData.publishedAt).toLocaleDateString()}
                                </Typography>
                            )}
                        </div>
                        <Chip label={releaseData.version} color="primary" />
                    </Box>

                    {showReleaseNotes && releaseData.releaseNotes && (
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle2" fontWeight={600} color="text.secondary" gutterBottom>
                                Release Notes
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
                                {releaseData.releaseNotes}
                            </Typography>
                        </Box>
                    )}
                </Paper>
            )}
        </Box>
    );
};

export default ReleaseInfo;
