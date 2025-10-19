'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className='bg-white/95 backdrop-blur-md border-b border-blue-200/30 sticky top-0 z-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center py-4'>
          {/* Logo */}
          <div className='flex items-center space-x-3'>
            <div className='w-12 h-12 relative'>
              <Image
                src='/logo.png'
                alt='Ultimate E2E Logo'
                width={48}
                height={48}
                className='rounded-xl'
                priority
              />
            </div>
            <div>
              <h1 className='text-xl font-bold text-gray-900'>Ultimate E2E</h1>
              <p className='text-xs text-blue-600 font-medium'>
                Self-Healing Runner
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className='hidden md:flex items-center space-x-8'>
            <Link
              href='/'
              className='text-gray-700 hover:text-blue-600 font-medium transition-colors'
            >
              Home
            </Link>
            <Link
              href='/dashboard'
              className='text-gray-700 hover:text-blue-600 font-medium transition-colors'
            >
              Dashboard
            </Link>
            <Link
              href='/features'
              className='text-gray-700 hover:text-blue-600 font-medium transition-colors'
            >
              Features
            </Link>
            <Link
              href='/docs'
              className='text-gray-700 hover:text-blue-600 font-medium transition-colors'
            >
              Documentation
            </Link>
            <Link
              href='/contact'
              className='text-gray-700 hover:text-blue-600 font-medium transition-colors'
            >
              Contact
            </Link>
          </nav>

          {/* CTA Buttons */}
          <div className='hidden md:flex items-center space-x-4'>
            <Link
              href='/login'
              className='text-gray-700 hover:text-blue-600 font-medium transition-colors'
            >
              Sign In
            </Link>
            <Link
              href='/register'
              className='bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl'
            >
              Get Started
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className='md:hidden p-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors'
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className='w-6 h-6'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M6 18L18 6M6 6l12 12'
                />
              ) : (
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M4 6h16M4 12h16M4 18h16'
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className='md:hidden py-4 border-t border-blue-200/30'>
            <nav className='flex flex-col space-y-4'>
              <Link
                href='/'
                className='text-gray-700 hover:text-blue-600 font-medium transition-colors py-2'
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href='/dashboard'
                className='text-gray-700 hover:text-blue-600 font-medium transition-colors py-2'
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                href='/features'
                className='text-gray-700 hover:text-blue-600 font-medium transition-colors py-2'
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                href='/docs'
                className='text-gray-700 hover:text-blue-600 font-medium transition-colors py-2'
                onClick={() => setIsMenuOpen(false)}
              >
                Documentation
              </Link>
              <Link
                href='/contact'
                className='text-gray-700 hover:text-blue-600 font-medium transition-colors py-2'
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <div className='pt-4 border-t border-blue-200/30 flex flex-col space-y-3'>
                <Link
                  href='/login'
                  className='text-gray-700 hover:text-blue-600 font-medium transition-colors py-2'
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href='/register'
                  className='bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 text-center'
                  onClick={() => setIsMenuOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
