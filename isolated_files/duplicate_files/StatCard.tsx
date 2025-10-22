'use client';

interface StatCardProps {
  value: string | number;
  label: string;
  gradient: string;
  delay?: number;
}

export default function StatCard({
  value,
  label,
  gradient,
  delay = 0,
}: StatCardProps) {
  return (
    <div
      className='text-center group'
      style={{
        animationDelay: `${delay}ms`,
        animation: 'fadeInUp 0.6s ease-out forwards',
        opacity: 0,
      }}
    >
      <div
        className={`text-5xl font-black mb-2 bg-gradient-to-r ${gradient} bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300`}
      >
        {value}
      </div>
      <div className='text-gray-600 font-medium group-hover:text-blue-600 transition-colors duration-300'>
        {label}
      </div>
    </div>
  );
}
