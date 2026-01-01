'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Alert, IconButton, Slide, Fade } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';

export default function AppDownloadBanner() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Show banner after a small delay for smooth entrance
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 300);

        return () => clearTimeout(timer);
    }, []);

    const handleDismiss = () => {
        setIsVisible(false);
    };

    // Don't render anything if not visible - prevents default height issue
    if (!isVisible) return null;

    return (
        <Slide
            direction="down"
            in={isVisible}
            timeout={{ enter: 800, exit: 500 }}
            easing={{
                enter: 'cubic-bezier(0.4, 0, 0.2, 1)',
                exit: 'cubic-bezier(0.4, 0, 0.2, 1)',
            }}
            mountOnEnter
            unmountOnExit
        >
            <div className="w-full">
                <Fade in={isVisible} timeout={1000}>
                    <div className="w-full bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 shadow-lg animate-gradient">
                        <Alert
                            icon={<DownloadIcon fontSize="inherit" className="text-white animate-pulse" />}
                            severity="info"
                            sx={{
                                backgroundColor: 'transparent',
                                color: 'white',
                                borderRadius: 0,
                                transition: 'all 0.3s ease-in-out',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                '& .MuiAlert-icon': {
                                    color: 'white',
                                },
                                '& .MuiAlert-message': {
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                },
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                },
                            }}
                            action={
                                <IconButton
                                    aria-label="close"
                                    color="inherit"
                                    size="small"
                                    onClick={handleDismiss}
                                    sx={{
                                        color: 'white',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                            transform: 'rotate(90deg)',
                                        },
                                    }}
                                >
                                    <CloseIcon fontSize="inherit" />
                                </IconButton>
                            }
                        >
                            <Link
                                href="/download"
                                className="flex items-center justify-center w-full transition-all duration-300 hover:translate-x-1"
                            >
                                <span className="font-semibold text-sm sm:text-base text-center">
                                    🎉 KuppiHub App is now available! Download for Android, Windows, Mac & Linux →
                                </span>
                            </Link>
                        </Alert>
                    </div>
                </Fade>
            </div>
        </Slide>
    );
}
