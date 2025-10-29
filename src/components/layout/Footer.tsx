'use client';

import PrivacyPolicyModal from '@/components/modals/PrivacyPolicyModal';
import TermsOfServiceModal from '@/components/modals/TermsOfServiceModal';
import { ROUTES } from '@/constants/routes';
import { CONTACT_INFO, SOCIAL_LINKS, UI_CONSTANTS } from '@/lib/constants/ui';
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Twitter } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { memo, useState } from 'react';

const Footer = memo(function Footer() {
  const currentYear = new Date().getFullYear();
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);

  return (
    <footer className='bg-gray-900 text-gray-300'>
      <div className='container-app py-12'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
          {/* Company Info */}
          <div className='space-y-4'>
            <div className='flex items-center gap-3'>
              <Image
                src='/logo.png'
                alt='مُعين'
                width={UI_CONSTANTS.AVATAR.MEDIUM}
                height={UI_CONSTANTS.AVATAR.MEDIUM}
                className='rounded-lg'
              />
              <h3 className='text-xl font-bold text-white'>مركز الهمم</h3>
            </div>
            <p className='text-sm leading-relaxed'>
              مركز طبي متخصص في رعاية ذوي الاحتياجات الخاصة، نقدم خدمات شاملة
              تشمل العلاج الطبيعي والوظيفي والنطق والسمع مع أحدث التقنيات الطبية.
            </p>
            <div className='flex gap-3'>
              <a
                href={SOCIAL_LINKS.FACEBOOK}
                className='p-2 rounded-full bg-gray-800 hover:bg-[var(--brand-default)] transition-colors'
                aria-label='Facebook'
                target='_blank'
                rel='noopener noreferrer'
              >
                <Facebook className='w-5 h-5' />
              </a>
              <a
                href={SOCIAL_LINKS.TWITTER}
                className='p-2 rounded-full bg-gray-800 hover:bg-[var(--brand-default)] transition-colors'
                aria-label='Twitter'
                target='_blank'
                rel='noopener noreferrer'
              >
                <Twitter className='w-5 h-5' />
              </a>
              <a
                href={SOCIAL_LINKS.INSTAGRAM}
                className='p-2 rounded-full bg-gray-800 hover:bg-[var(--brand-default)] transition-colors'
                aria-label='Instagram'
                target='_blank'
                rel='noopener noreferrer'
              >
                <Instagram className='w-5 h-5' />
              </a>
              <a
                href={SOCIAL_LINKS.LINKEDIN}
                className='p-2 rounded-full bg-gray-800 hover:bg-[var(--brand-default)] transition-colors'
                aria-label='LinkedIn'
                target='_blank'
                rel='noopener noreferrer'
              >
                <Linkedin className='w-5 h-5' />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className='text-white font-semibold mb-4'>روابط سريعة</h4>
            <ul className='space-y-2'>
              <li>
                <Link
                  href={ROUTES.HOME}
                  className='hover:text-[var(--brand-default)] transition-colors text-sm'
                >
                  الصفحة الرئيسية
                </Link>
              </li>
              <li>
                <Link
                  href={ROUTES.INFO.ABOUT}
                  className='hover:text-[var(--brand-default)] transition-colors text-sm'
                >
                  عن المركز
                </Link>
              </li>
              <li>
                <Link
                  href={ROUTES.MARKETING.FEATURES}
                  className='hover:text-[var(--brand-default)] transition-colors text-sm'
                >
                  الخدمات
                </Link>
              </li>
              <li>
                <Link
                  href={`${ROUTES.HOME}#contact`}
                  className='hover:text-[var(--brand-default)] transition-colors text-sm'
                >
                  تواصل معنا
                </Link>
              </li>
              <li>
                <Link
                  href={ROUTES.MARKETING.FAQ}
                  className='hover:text-[var(--brand-default)] transition-colors text-sm'
                >
                  الأسئلة الشائعة
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className='text-white font-semibold mb-4'>خدماتنا</h4>
            <ul className='space-y-2'>
              <li>
                <Link
                  href={`${ROUTES.HOME}#services`}
                  className='hover:text-[var(--brand-default)] transition-colors text-sm'
                >
                  العلاج الطبيعي
                </Link>
              </li>
              <li>
                <Link
                  href={`${ROUTES.HOME}#services`}
                  className='hover:text-[var(--brand-default)] transition-colors text-sm'
                >
                  العلاج الوظيفي
                </Link>
              </li>
              <li>
                <Link
                  href={`${ROUTES.HOME}#services`}
                  className='hover:text-[var(--brand-default)] transition-colors text-sm'
                >
                  علاج النطق والسمع
                </Link>
              </li>
              <li>
                <Link
                  href={`${ROUTES.HOME}#services`}
                  className='hover:text-[var(--brand-default)] transition-colors text-sm'
                >
                  البرامج التأهيلية
                </Link>
              </li>
              <li>
                <Link
                  href={`${ROUTES.HOME}#services`}
                  className='hover:text-[var(--brand-default)] transition-colors text-sm'
                >
                  الدعم النفسي والاجتماعي
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className='text-white font-semibold mb-4'>معلومات التواصل</h4>
            <ul className='space-y-3'>
              <li className='flex items-start gap-3'>
                <MapPin className='w-5 h-5 text-[var(--brand-default)] mt-0.5 flex-shrink-0' />
                <span className='text-sm leading-relaxed'>{CONTACT_INFO.ADDRESS}</span>
              </li>
              <li className='flex items-start gap-3'>
                <Phone className='w-5 h-5 text-[var(--brand-default)] mt-0.5 flex-shrink-0' />
                <div className='flex flex-col gap-1'>
                  <a
                    href={`tel:+966126173693`}
                    className='text-sm hover:text-[var(--brand-default)] transition-colors'
                  >
                    {CONTACT_INFO.PHONE}
                  </a>
                  <a
                    href={`tel:+966555381558`}
                    className='text-sm hover:text-[var(--brand-default)] transition-colors'
                  >
                    {CONTACT_INFO.MOBILE}
                  </a>
                </div>
              </li>
              <li className='flex items-center gap-3'>
                <Mail className='w-5 h-5 text-[var(--brand-default)] flex-shrink-0' />
                <a
                  href={`mailto:${CONTACT_INFO.EMAIL}`}
                  className='text-sm hover:text-[var(--brand-default)] transition-colors'
                >
                  {CONTACT_INFO.EMAIL}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className='border-t border-gray-800 mt-8 pt-8'>
          <div className='flex flex-col md:flex-row justify-between items-center gap-4'>
            <p className='text-sm text-gray-400'>
              © {currentYear} مركز الهمم. جميع الحقوق محفوظة.
            </p>
            <div className='flex gap-6 items-center'>
              <button
                onClick={() => setIsPrivacyOpen(true)}
                className='text-sm text-gray-400 hover:text-[var(--brand-default)] transition-colors cursor-pointer'
              >
                سياسة الخصوصية
              </button>
              <span className='text-gray-600'>|</span>
              <button
                onClick={() => setIsTermsOpen(true)}
                className='text-sm text-gray-400 hover:text-[var(--brand-default)] transition-colors cursor-pointer'
              >
                شروط الاستخدام
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <PrivacyPolicyModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
      />
      <TermsOfServiceModal
        isOpen={isTermsOpen}
        onClose={() => setIsTermsOpen(false)}
      />
    </footer>
  );
});

Footer.displayName = 'Footer';
export default Footer;
