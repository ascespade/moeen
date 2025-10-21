'use client';

import React from 'react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
  delay?: number;
}

export default function FeatureCard({
  icon,
  title,
  description,
  gradient,
  delay = 0,
}: FeatureCardProps) {
  return (
    <div
      className='group bg-white/80 backdrop-blur-xl rounded-2xl p-8 border border-blue-200/30 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer'
      style={{
        animationDelay: `${delay}ms`,
        animation: 'fadeInUp 0.6s ease-out forwards',
        opacity: 0,
      }}
    >
      <div
        className={`w-16 h-16 ${gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
      >
        <div className='text-white'>{icon}</div>
      </div>
      <h3 className='text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300'>
        {title}
      </h3>
      <p className='text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300'>
        {description}
      </p>
    </div>
  );
}
