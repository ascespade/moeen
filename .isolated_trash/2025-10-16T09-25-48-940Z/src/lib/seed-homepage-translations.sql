-- Seed homepage translations
-- This file contains all translations needed for the homepage

-- Clear existing homepage translations
DELETE FROM public.translations WHERE namespace = 'homepage';

-- Insert homepage translations
INSERT INTO public.translations(locale, namespace, key, value) VALUES

-- Hero Slider
('ar', 'homepage', 'hero.slide1.title', 'مرحباً بك في مُعين'),
('ar', 'homepage', 'hero.slide1.subtitle', 'منصة الرعاية الصحية المتخصصة'),
('ar', 'homepage', 'hero.slide1.description', 'نقدم خدمات متكاملة للرعاية الصحية مع أحدث التقنيات والذكاء الاصطناعي'),
('ar', 'homepage', 'hero.slide1.cta', 'اكتشف خدماتنا'),

('en', 'homepage', 'hero.slide1.title', 'Welcome to Mu3een'),
('en', 'homepage', 'hero.slide1.subtitle', 'Specialized Healthcare Platform'),
('en', 'homepage', 'hero.slide1.description', 'We provide comprehensive healthcare services with the latest technologies and artificial intelligence'),
('en', 'homepage', 'hero.slide1.cta', 'Discover Our Services'),

('ar', 'homepage', 'hero.slide2.title', 'إدارة المواعيد الذكية'),
('ar', 'homepage', 'hero.slide2.subtitle', 'نظام تقويم متطور'),
('ar', 'homepage', 'hero.slide2.description', 'احجز مواعيدك بسهولة مع نظام التقويم الذكي وإدارة الجلسات العلاجية'),
('ar', 'homepage', 'hero.slide2.cta', 'احجز موعدك'),

('en', 'homepage', 'hero.slide2.title', 'Smart Appointment Management'),
('en', 'homepage', 'hero.slide2.subtitle', 'Advanced Calendar System'),
('en', 'homepage', 'hero.slide2.description', 'Book your appointments easily with the smart calendar system and therapy session management'),
('en', 'homepage', 'hero.slide2.cta', 'Book Appointment'),

('ar', 'homepage', 'hero.slide3.title', 'شات بوت ذكي'),
('ar', 'homepage', 'hero.slide3.subtitle', 'مساعدك الصحي الشخصي'),
('ar', 'homepage', 'hero.slide3.description', 'احصل على إجابات فورية لاستفساراتك الصحية مع الذكاء الاصطناعي المتقدم'),
('ar', 'homepage', 'hero.slide3.cta', 'جرب الشات بوت'),

('en', 'homepage', 'hero.slide3.title', 'Smart Chatbot'),
('en', 'homepage', 'hero.slide3.subtitle', 'Your Personal Health Assistant'),
('en', 'homepage', 'hero.slide3.description', 'Get instant answers to your health inquiries with advanced artificial intelligence'),
('en', 'homepage', 'hero.slide3.cta', 'Try Chatbot'),

-- Services Section
('ar', 'homepage', 'services.title', 'خدماتنا المتكاملة'),
('ar', 'homepage', 'services.subtitle', 'نقدم مجموعة شاملة من الخدمات التقنية لمراكز الرعاية الصحية'),

('en', 'homepage', 'services.title', 'Our Comprehensive Services'),
('en', 'homepage', 'services.subtitle', 'We provide a comprehensive suite of technical services for healthcare centers'),

-- Service Cards
('ar', 'homepage', 'service.appointments.title', 'إدارة المواعيد'),
('ar', 'homepage', 'service.appointments.description', 'نظام تقويم متطور لإدارة المواعيد والجلسات العلاجية'),

('en', 'homepage', 'service.appointments.title', 'Appointment Management'),
('en', 'homepage', 'service.appointments.description', 'Advanced calendar system for managing appointments and therapy sessions'),

('ar', 'homepage', 'service.patients.title', 'إدارة المرضى'),
('ar', 'homepage', 'service.patients.description', 'ملفات مرضى شاملة مع سجل طبي مفصل'),

('en', 'homepage', 'service.patients.title', 'Patient Management'),
('en', 'homepage', 'service.patients.description', 'Comprehensive patient files with detailed medical records'),

('ar', 'homepage', 'service.insurance.title', 'المطالبات التأمينية'),
('ar', 'homepage', 'service.insurance.description', 'إدارة وتتبع المطالبات التأمينية بسهولة'),

('en', 'homepage', 'service.insurance.title', 'Insurance Claims'),
('en', 'homepage', 'service.insurance.description', 'Easy management and tracking of insurance claims'),

('ar', 'homepage', 'service.chatbot.title', 'الشات بوت الذكي'),
('ar', 'homepage', 'service.chatbot.description', 'مساعد ذكي للرد على استفسارات المرضى'),

('en', 'homepage', 'service.chatbot.title', 'Smart Chatbot'),
('en', 'homepage', 'service.chatbot.description', 'Intelligent assistant to answer patient inquiries'),

('ar', 'homepage', 'service.staff.title', 'إدارة الموظفين'),
('ar', 'homepage', 'service.staff.description', 'تتبع ساعات العمل والأداء للموظفين'),

('en', 'homepage', 'service.staff.title', 'Staff Management'),
('en', 'homepage', 'service.staff.description', 'Track working hours and performance of employees'),

('ar', 'homepage', 'service.reports.title', 'التقارير والتحليلات'),
('ar', 'homepage', 'service.reports.description', 'تقارير شاملة وإحصائيات مفصلة'),

('en', 'homepage', 'service.reports.title', 'Reports & Analytics'),
('en', 'homepage', 'service.reports.description', 'Comprehensive reports and detailed statistics'),

-- Testimonials Section
('ar', 'homepage', 'testimonials.title', 'آراء عملائنا'),
('ar', 'homepage', 'testimonials.subtitle', 'ما يقوله عنا أطباؤنا وموظفونا'),

('en', 'homepage', 'testimonials.title', 'Client Testimonials'),
('en', 'homepage', 'testimonials.subtitle', 'What our doctors and staff say about us'),

-- Gallery Section
('ar', 'homepage', 'gallery.title', 'معرض الصور'),
('ar', 'homepage', 'gallery.subtitle', 'استكشف مرافقنا وبيئة العمل المريحة'),

('en', 'homepage', 'gallery.title', 'Photo Gallery'),
('en', 'homepage', 'gallery.subtitle', 'Explore our facilities and comfortable work environment'),

-- About Section
('ar', 'homepage', 'about.title', 'عن مُعين'),
('ar', 'homepage', 'about.description1', 'منصة مُعين هي الحل التقني الشامل لمراكز الرعاية الصحية المتخصصة. نقدم نظاماً متكاملاً يجمع بين إدارة المواعيد، ملفات المرضى، المطالبات التأمينية، والشات بوت الذكي.'),
('ar', 'homepage', 'about.description2', 'هدفنا هو تبسيط العمليات الطبية ورفع كفاءة الخدمات المقدمة للمرضى من خلال التقنيات الحديثة والذكاء الاصطناعي.'),

('en', 'homepage', 'about.title', 'About Mu3een'),
('en', 'homepage', 'about.description1', 'Mu3een platform is a comprehensive technical solution for specialized healthcare centers. We provide an integrated system that combines appointment management, patient files, insurance claims, and smart chatbot.'),
('en', 'homepage', 'about.description2', 'Our goal is to simplify medical operations and improve the efficiency of services provided to patients through modern technologies and artificial intelligence.'),

-- FAQ Section
('ar', 'homepage', 'faq.title', 'الأسئلة الشائعة'),
('ar', 'homepage', 'faq.subtitle', 'إجابات على أكثر الأسئلة شيوعاً'),

('en', 'homepage', 'faq.title', 'Frequently Asked Questions'),
('en', 'homepage', 'faq.subtitle', 'Answers to the most common questions'),

('ar', 'homepage', 'faq.q1.question', 'كيف يمكنني حجز موعد؟'),
('ar', 'homepage', 'faq.q1.answer', 'يمكنك حجز موعد بسهولة من خلال صفحة المواعيد أو الاتصال بنا مباشرة'),

('en', 'homepage', 'faq.q1.question', 'How can I book an appointment?'),
('en', 'homepage', 'faq.q1.answer', 'You can book an appointment easily through the appointments page or contact us directly'),

('ar', 'homepage', 'faq.q2.question', 'هل النظام يدعم التأمين الصحي؟'),
('ar', 'homepage', 'faq.q2.answer', 'نعم، النظام يدعم جميع شركات التأمين الصحي ويمكن إدارة المطالبات بسهولة'),

('en', 'homepage', 'faq.q2.question', 'Does the system support health insurance?'),
('en', 'homepage', 'faq.q2.answer', 'Yes, the system supports all health insurance companies and claims can be managed easily'),

('ar', 'homepage', 'faq.q3.question', 'كيف يعمل الشات بوت الذكي؟'),
('ar', 'homepage', 'faq.q3.answer', 'الشات بوت يستخدم الذكاء الاصطناعي للرد على استفسارات المرضى بشكل فوري ودقيق'),

('en', 'homepage', 'faq.q3.question', 'How does the smart chatbot work?'),
('en', 'homepage', 'faq.q3.answer', 'The chatbot uses artificial intelligence to respond to patient inquiries instantly and accurately'),

-- Contact Section
('ar', 'homepage', 'contact.title', 'تواصل معنا'),
('ar', 'homepage', 'contact.subtitle', 'نحن هنا لمساعدتك في أي وقت'),

('en', 'homepage', 'contact.title', 'Contact Us'),
('en', 'homepage', 'contact.subtitle', 'We are here to help you anytime'),

-- Footer
('ar', 'homepage', 'footer.description', 'منصة الرعاية الصحية المتخصصة التي تجمع بين التقنيات الحديثة والذكاء الاصطناعي لخدمة المرضى والعاملين في القطاع الصحي.'),
('ar', 'homepage', 'footer.copyright', '© 2024 مُعين. جميع الحقوق محفوظة.'),

('en', 'homepage', 'footer.description', 'A specialized healthcare platform that combines modern technologies and artificial intelligence to serve patients and healthcare workers.'),
('en', 'homepage', 'footer.copyright', '© 2024 Mu3een. All rights reserved.'),

-- Navigation
('ar', 'homepage', 'nav.services', 'الخدمات'),
('ar', 'homepage', 'nav.about', 'عن معين'),
('ar', 'homepage', 'nav.gallery', 'المعرض'),
('ar', 'homepage', 'nav.contact', 'اتصل بنا'),
('ar', 'homepage', 'nav.login', 'تسجيل الدخول'),
('ar', 'homepage', 'nav.register', 'إنشاء حساب'),

('en', 'homepage', 'nav.services', 'Services'),
('en', 'homepage', 'nav.about', 'About'),
('en', 'homepage', 'nav.gallery', 'Gallery'),
('en', 'homepage', 'nav.contact', 'Contact'),
('en', 'homepage', 'nav.login', 'Login'),
('en', 'homepage', 'nav.register', 'Register'),

-- Theme and Language
('ar', 'homepage', 'theme.label', 'الثيم'),
('ar', 'homepage', 'language.label', 'اللغة'),

('en', 'homepage', 'theme.label', 'Theme'),
('en', 'homepage', 'language.label', 'Language');

