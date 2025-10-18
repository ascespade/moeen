import React from 'react';

const Footer = () => {
  return (
    <footer className='bg-gray-800 p-4 text-white'>
      <div className='container mx-auto'>
        <p>&copy; 2024 My App. All rights reserved.</p>
        <div className='mt-2'>
          <a href='/privacy' className='mr-4'>
            Privacy Policy
          </a>
          <a href='/terms'>Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
