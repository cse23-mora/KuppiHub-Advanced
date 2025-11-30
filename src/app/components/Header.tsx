'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import HeaderSearch from '../dashboard/components/HeaderSearch';
import { useAuth } from '@/contexts/AuthContext';
import {
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  Button,
  IconButton,
  CircularProgress,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  Login as LoginIcon,
} from '@mui/icons-material';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const router = useRouter();
  const { user, userProfile, loading, logOut } = useAuth();

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleClose();
    await logOut();
    router.push('/');
  };

  return (
    <header className="bg-gradient-to-r from-blue-100 via-purple-200 to-blue-500 text-white">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <svg
                className="h-8 w-8 text-blue-600 group-hover:scale-110 transition-transform duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              <span className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                Kuppi <span className="text-blue-600">Hub</span>
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden sm:flex items-center space-x-4">
            <Link 
              href="/" 
              className="px-4 py-2 rounded-full font-bold text-blue-800 bg-white border border-blue-300 shadow-sm 
                         hover:bg-blue-700 hover:text-white hover:shadow-md hover:border-blue-700
                         transition-all duration-500 ease-in-out transform hover:scale-105"
            >
              Home
            </Link>
            <Link 
              href="/search"
              className="px-4 py-2 rounded-full font-bold text-blue-800 bg-white border border-blue-300 shadow-sm 
                         hover:bg-blue-700 hover:text-white hover:shadow-md hover:border-blue-700
                         transition-all duration-500 ease-in-out transform hover:scale-105"
            >
              Search
            </Link>
            <Link 
              href="/tutors"
              className="px-4 py-2 rounded-full font-bold text-blue-800 bg-white border border-blue-300 shadow-sm 
                         hover:bg-blue-700 hover:text-white hover:shadow-md hover:border-blue-700
                         transition-all duration-500 ease-in-out transform hover:scale-105"
            >
              Tutors
            </Link>
            <Link 
              href="/about" 
              className="px-4 py-2 rounded-full font-bold text-blue-800 bg-white border border-blue-300 shadow-sm 
                         hover:bg-blue-700 hover:text-white hover:shadow-md hover:border-blue-700
                         transition-all duration-500 ease-in-out transform hover:scale-105"
            >
              About
            </Link>

            {/* Auth Section */}
            {loading ? (
              <CircularProgress size={24} />
            ) : user ? (
              <>
                <Link 
                  href="/add-kuppi" 
                  className="px-4 py-2 rounded-full font-bold text-white bg-gradient-to-r from-purple-600 to-blue-600 
                             hover:from-purple-700 hover:to-blue-700 shadow-md
                             transition-all duration-500 ease-in-out transform hover:scale-105"
                >
                  Add Kuppi
                </Link>
                <IconButton onClick={handleProfileClick} sx={{ p: 0, ml: 1 }}>
                  <Avatar 
                    src={userProfile?.photo_url || undefined}
                    sx={{ width: 36, height: 36, bgcolor: 'primary.main' }}
                  >
                    {userProfile?.display_name?.[0] || user.email?.[0]?.toUpperCase()}
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  onClick={handleClose}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  <MenuItem onClick={() => router.push('/dashboard')}>
                    <ListItemIcon>
                      <DashboardIcon fontSize="small" />
                    </ListItemIcon>
                    Dashboard
                  </MenuItem>
                  <MenuItem onClick={() => router.push('/profile')}>
                    <ListItemIcon>
                      <PersonIcon fontSize="small" />
                    </ListItemIcon>
                    Profile
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                      <LogoutIcon fontSize="small" />
                    </ListItemIcon>
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Link 
                href="/login" 
                className="px-4 py-2 rounded-full font-bold text-white bg-gradient-to-r from-purple-600 to-blue-600 
                           hover:from-purple-700 hover:to-blue-700 shadow-md flex items-center gap-2
                           transition-all duration-500 ease-in-out transform hover:scale-105"
              >
                <LoginIcon fontSize="small" />
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="sm:hidden p-2 rounded-md text-blue-800 hover:text-white hover:bg-blue-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`sm:hidden bg-white border-t border-gray-500 shadow-xl overflow-hidden transform ease-in-out 
                      transition-all duration-1000
                      ${isMenuOpen ? 'max-h-[1000px] opacity-100 scale-100 delay-0' : 'max-h-0 opacity-0 scale-95 delay-0'}`}
        >
          
          <div className="p-4 space-y-4 transition-opacity duration-500">
            {['Home', 'Search', 'Tutors', 'About'].map((item, i) => (
              <Link
                key={i}
                href={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                onClick={() => setIsMenuOpen(false)}
                className="block text-blue-800 font-semibold border border-blue-200 rounded-lg px-4 py-2 
                           hover:bg-blue-600 hover:text-white transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                {item}
              </Link>
            ))}

            {user ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-blue-800 font-semibold border border-blue-200 rounded-lg px-4 py-2 
                             hover:bg-blue-600 hover:text-white transition-all duration-300 ease-in-out transform hover:scale-105"
                >
                  Dashboard
                </Link>
                <Link
                  href="/add-kuppi"
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-white font-semibold bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg px-4 py-2 
                             hover:from-purple-700 hover:to-blue-700 transition-all duration-300 ease-in-out transform hover:scale-105"
                >
                  Add Kuppi
                </Link>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-left text-red-600 font-semibold border border-red-200 rounded-lg px-4 py-2 
                             hover:bg-red-600 hover:text-white transition-all duration-300 ease-in-out"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsMenuOpen(false)}
                className="block text-white font-semibold bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg px-4 py-2 
                           hover:from-purple-700 hover:to-blue-700 transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}