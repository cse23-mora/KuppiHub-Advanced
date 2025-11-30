'use client';

import { useState } from 'react';
import Link from 'next/link';
import HeaderSearch from './HeaderSearch';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, loading, signInWithGoogle, signOut } = useAuth();

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
          <div className="hidden sm:flex items-center space-x-6">
            <Link 
              href="/" 
              className="px-5 py-2 rounded-full font-bold text-blue-800 bg-white border border-blue-300 shadow-sm 
                         hover:bg-blue-700 hover:text-white hover:shadow-md hover:border-blue-700
                         transition-all duration-500 ease-in-out transform hover:scale-105"
            >
              Home
            </Link>
            {/* <Link 
              href="/semesters" 
              className="px-5 py-2 rounded-full font-bold text-blue-800 bg-white border border-blue-300 shadow-sm 
                         hover:bg-blue-700 hover:text-white hover:shadow-md hover:border-blue-700
                         transition-all duration-500 ease-in-out transform hover:scale-105"
            >
              Semesters
            </Link> */}
            <Link 
              href="/tutors"
              className="px-5 py-2 rounded-full font-bold text-blue-800 bg-white border border-blue-300 shadow-sm 
                         hover:bg-blue-700 hover:text-white hover:shadow-md hover:border-blue-700
                         transition-all duration-500 ease-in-out transform hover:scale-105"
            >
              Tutors
            </Link>
            <Link 
              href="/dashboard"
              className="px-5 py-2 rounded-full font-bold text-blue-800 bg-white border border-blue-300 shadow-sm 
                         hover:bg-blue-700 hover:text-white hover:shadow-md hover:border-blue-700
                         transition-all duration-500 ease-in-out transform hover:scale-105"
            >
              Dashboard
            </Link>
            <Link 
              href="/about" 
              className="px-5 py-2 rounded-full font-bold text-blue-800 bg-white border border-blue-300 shadow-sm 
                         hover:bg-blue-700 hover:text-white hover:shadow-md hover:border-blue-700
                         transition-all duration-500 ease-in-out transform hover:scale-105"
            >
              About
            </Link>
               <Link 
              href="/add-kuppi" 
              className="px-5 py-2 rounded-full font-bold text-blue-800 bg-white border border-blue-300 shadow-sm 
                         hover:bg-blue-700 hover:text-white hover:shadow-md hover:border-blue-700
                         transition-all duration-500 ease-in-out transform hover:scale-105"
            >
              Add Kuppi
            </Link>
          </div>

          {/* Placeholder for search (can be added later) */}
         
       
             
              <HeaderSearch />
             
           
            {/* Search component will be added here later */}
         
          {/* Auth Button */}
          <div className="hidden sm:flex items-center ml-4">
            {loading ? (
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
            ) : user ? (
              <div className="flex items-center space-x-3">
                {user.photoURL && (
                  <Image
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    width={32}
                    height={32}
                    className="rounded-full border-2 border-white shadow-sm"
                  />
                )}
                <button
                  onClick={signOut}
                  className="px-4 py-2 rounded-full font-bold text-red-600 bg-white border border-red-300 shadow-sm 
                             hover:bg-red-600 hover:text-white hover:shadow-md hover:border-red-600
                             transition-all duration-500 ease-in-out transform hover:scale-105 text-sm"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={signInWithGoogle}
                className="px-4 py-2 rounded-full font-bold text-green-700 bg-white border border-green-300 shadow-sm 
                           hover:bg-green-600 hover:text-white hover:shadow-md hover:border-green-600
                           transition-all duration-500 ease-in-out transform hover:scale-105 flex items-center space-x-2 text-sm"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span>Login</span>
              </button>
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
            {['Home',  'Tutors', 'About', 'Add-Kuppi'].map((item, i) => (
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

            {/* Placeholder for mobile search (can be added later) */}
               
            <div className="mt-2">
             
              {/* Mobile search component will be added here later */}
            </div>

            {/* Mobile Auth Button */}
            {loading ? (
              <div className="w-full h-10 rounded-lg bg-gray-200 animate-pulse"></div>
            ) : user ? (
              <div className="flex items-center justify-between border border-red-200 rounded-lg px-4 py-2">
                <div className="flex items-center space-x-3">
                  {user.photoURL && (
                    <Image
                      src={user.photoURL}
                      alt={user.displayName || 'User'}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  )}
                  <span className="text-gray-700 text-sm truncate max-w-[150px]">{user.displayName || user.email}</span>
                </div>
                <button
                  onClick={() => { signOut(); setIsMenuOpen(false); }}
                  className="text-red-600 font-semibold text-sm hover:text-red-800"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => { signInWithGoogle(); setIsMenuOpen(false); }}
                className="w-full flex items-center justify-center space-x-2 text-green-700 font-semibold border border-green-200 rounded-lg px-4 py-2 
                           hover:bg-green-600 hover:text-white transition-all duration-300"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Login with Google</span>
              </button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}