'use client';

import { useState } from 'react';
import Link from 'next/link';
import HeaderSearch from '../dashboard/components/HeaderSearch';
export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
          </div>
        </div>
      </nav>
    </header>
  );
}