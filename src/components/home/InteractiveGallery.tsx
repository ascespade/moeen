'use client';

import { Maximize2, X } from 'lucide-react';
import Image from 'next/image';
import { memo, useState } from 'react';

const galleryImages = [
  { id: 1, src: '/gallery-1.jpg', title: 'قاعة العلاج الطبيعي', category: 'العلاج الطبيعي' },
  { id: 2, src: '/gallery-2.jpg', title: 'جلسة علاج وظيفي', category: 'العلاج الوظيفي' },
  { id: 3, src: '/gallery-3.jpg', title: 'عيادة النطق والسمع', category: 'النطق والسمع' },
  { id: 4, src: '/gallery-4.jpg', title: 'قاعة التأهيل', category: 'التأهيل' },
  { id: 5, src: '/gallery-5.jpg', title: 'جلسة دعم نفسي', category: 'الدعم النفسي' },
  { id: 6, src: '/gallery-6.jpg', title: 'أحدث الأجهزة', category: 'التقنيات' },
];

const InteractiveGallery = memo(function InteractiveGallery() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  return (
    <section id='gallery' className='py-20 bg-gradient-to-b from-white to-[var(--brand-surface)]'>
      <div className='container-app'>
        <div className='text-center mb-16'>
          <h2 className='text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4'>
            جولة في مركزنا
          </h2>
          <p className='text-xl text-[var(--text-secondary)] max-w-3xl mx-auto'>
            استكشف مرافقنا الحديثة والمجهزة بأحدث التقنيات الطبية
          </p>
        </div>

        <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
          {galleryImages.map((image, index) => (
            <div
              key={image.id}
              className={`relative group cursor-pointer overflow-hidden rounded-2xl ${
                index === 0 ? 'md:col-span-2 md:row-span-2' : ''
              } ${index === 4 ? 'md:col-span-2' : ''}`}
              onClick={() => setSelectedImage(image.id)}
            >
              <div className='relative aspect-square'>
                <Image
                  src={image.src}
                  alt={image.title}
                  fill
                  className='object-cover transition-transform duration-500 group-hover:scale-110'
                  sizes='(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw'
                />
                
                {/* Overlay */}
                <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
                
                {/* Content */}
                <div className='absolute inset-0 flex items-end p-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                  <div>
                    <div className='text-xs uppercase mb-1 text-white/80'>
                      {image.category}
                    </div>
                    <h3 className='text-lg font-bold'>{image.title}</h3>
                  </div>
                </div>

                {/* Icon */}
                <div className='absolute top-4 left-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'>
                  <Maximize2 className='w-5 h-5 text-white' />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Full Screen Modal */}
      {selectedImage && (
        <div
          className='fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4'
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className='absolute top-4 left-4 text-white bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors z-10'
            aria-label='إغلاق'
          >
            <X className='w-6 h-6' />
          </button>
          
          <div
            className='relative max-w-6xl max-h-[90vh]'
            onClick={(e) => e.stopPropagation()}
          >
            {galleryImages
              .filter((img) => img.id === selectedImage)
              .map((img) => (
                <div key={img.id} className='relative w-full h-full'>
                  <Image
                    src={img.src}
                    alt={img.title}
                    width={1200}
                    height={800}
                    className='object-contain max-h-[90vh] rounded-lg'
                  />
                  <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white rounded-b-lg'>
                    <div className='text-sm text-white/80 mb-1'>{img.category}</div>
                    <h3 className='text-2xl font-bold'>{img.title}</h3>
                  </div>
                </div>
              ))}
          </div>

          {/* Navigation */}
          <div className='absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2'>
            {galleryImages.map((img) => (
              <button
                key={img.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage(img.id);
                }}
                className={`w-2 h-2 rounded-full transition-all ${
                  selectedImage === img.id ? 'bg-white w-8' : 'bg-white/40'
                }`}
                aria-label={img.title}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
});

InteractiveGallery.displayName = 'InteractiveGallery';
export default InteractiveGallery;

