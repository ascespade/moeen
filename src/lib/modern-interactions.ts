/**
 * Modern Interactions - التفاعلات العصرية
 *
 * This file contains modern interaction utilities and animations
 * that enhance user experience and make the interface more engaging.
 */

// Scroll reveal animation
export class ScrollReveal {
  private elements: NodeListOf<Element>;
  private observer: IntersectionObserver;

  constructor(selector: string = '.scroll-reveal') {
    this.elements = document.querySelectorAll(selector);
    this.init();
  }

  private init() {
    const options = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    };

    this.observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, options);

    this.elements.forEach(element => {
      this.observer.observe(element);
    });
  }

  public destroy() {
    this.observer.disconnect();
  }
}

// Smooth scroll to element
export function smoothScrollTo(
  element: string | HTMLElement,
  offset: number = 0
) {
  const target =
    typeof element === 'string' ? document.querySelector(element) : element;

  if (target) {
    const targetPosition =
      target.getBoundingClientRect().top + window.pageYOffset - offset;

    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth',
    });
  }
}

// Parallax scrolling effect
export class ParallaxScroll {
  private elements: NodeListOf<Element>;
  private ticking: boolean = false;

  constructor(selector: string = '.parallax') {
    this.elements = document.querySelectorAll(selector);
    this.init();
  }

  private init() {
    window.addEventListener('scroll', this.handleScroll.bind(this));
  }

  private handleScroll() {
    if (!this.ticking) {
      requestAnimationFrame(this.updateParallax.bind(this));
      this.ticking = true;
    }
  }

  private updateParallax() {
    this.elements.forEach(element => {
      const speed = parseFloat(element.getAttribute('data-speed') || '0.5');
      const yPos = -(window.pageYOffset * speed);
      (element as HTMLElement).style.transform = `translateY(${yPos}px)`;
    });
    this.ticking = false;
  }

  public destroy() {
    window.removeEventListener('scroll', this.handleScroll.bind(this));
  }
}

// Typing animation
export function typeWriter(
  element: HTMLElement,
  text: string,
  speed: number = 100
) {
  let i = 0;
  element.innerHTML = '';

  function type() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }

  type();
}

// Counter animation
export function animateCounter(
  element: HTMLElement,
  target: number,
  duration: number = 2000
) {
  const start = 0;
  const increment = target / (duration / 16);
  let current = start;

  const timer = setInterval(() => {
    current += increment;
    element.textContent = Math.floor(current).toString();

    if (current >= target) {
      element.textContent = target.toString();
      clearInterval(timer);
    }
  }, 16);
}

// Loading animation
export function showLoading(element: HTMLElement) {
  element.innerHTML = `
    <div class="loading-spinner"></div>
  `;
}

export function hideLoading(element: HTMLElement, content: string) {
  element.innerHTML = content;
}

// Modal functionality
export class Modal {
  private modal: HTMLElement | null;
  private overlay: HTMLElement | null;
  private closeButton: HTMLElement | null;

  constructor(modalId: string) {
    this.modal = document.getElementById(modalId);
    this.overlay = this.modal?.querySelector('.modal-overlay') as HTMLElement;
    this.closeButton = this.modal?.querySelector('.modal-close') as HTMLElement;
    this.init();
  }

  private init() {
    if (this.closeButton) {
      this.closeButton.addEventListener('click', () => this.close());
    }

    if (this.overlay) {
      this.overlay.addEventListener('click', () => this.close());
    }

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        this.close();
      }
    });
  }

  public open() {
    if (this.modal) {
      this.modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  public close() {
    if (this.modal) {
      this.modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }
}

// Tooltip functionality
export class Tooltip {
  private tooltip: HTMLElement;
  private target: HTMLElement;
  private position: 'top' | 'bottom' | 'left' | 'right' = 'top';

  constructor(
    target: HTMLElement,
    text: string,
    position: 'top' | 'bottom' | 'left' | 'right' = 'top'
  ) {
    this.target = target;
    this.position = position;
    this.tooltip = this.createTooltip(text);
    this.init();
  }

  private createTooltip(text: string): HTMLElement {
    const tooltip = document.createElement('div');
    tooltip.className = `tooltip tooltip-${this.position}`;
    tooltip.textContent = text;
    tooltip.style.cssText = `
      position: absolute;
      background: #333;
      color: white;
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 14px;
      z-index: 1000;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s ease;
    `;
    return tooltip;
  }

  private init() {
    document.body.appendChild(this.tooltip);

    this.target.addEventListener('mouseenter', () => this.show());
    this.target.addEventListener('mouseleave', () => this.hide());
    this.target.addEventListener('mousemove', e => this.updatePosition(e));
  }

  private show() {
    this.tooltip.style.opacity = '1';
  }

  private hide() {
    this.tooltip.style.opacity = '0';
  }

  private updatePosition(e: MouseEvent) {
    const rect = this.target.getBoundingClientRect();
    const tooltipRect = this.tooltip.getBoundingClientRect();

    let x = 0;
    let y = 0;

    switch (this.position) {
      case 'top':
        x = rect.left + rect.width / 2 - tooltipRect.width / 2;
        y = rect.top - tooltipRect.height - 8;
        break;
      case 'bottom':
        x = rect.left + rect.width / 2 - tooltipRect.width / 2;
        y = rect.bottom + 8;
        break;
      case 'left':
        x = rect.left - tooltipRect.width - 8;
        y = rect.top + rect.height / 2 - tooltipRect.height / 2;
        break;
      case 'right':
        x = rect.right + 8;
        y = rect.top + rect.height / 2 - tooltipRect.height / 2;
        break;
    }

    this.tooltip.style.left = `${x}px`;
    this.tooltip.style.top = `${y}px`;
  }

  public destroy() {
    this.tooltip.remove();
  }
}

// Lazy loading for images
export class LazyLoader {
  private images: NodeListOf<HTMLImageElement>;
  private observer: IntersectionObserver;

  constructor(selector: string = 'img[data-src]') {
    this.images = document.querySelectorAll(selector);
    this.init();
  }

  private init() {
    const options = {
      threshold: 0.1,
      rootMargin: '50px 0px',
    };

    this.observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          this.loadImage(img);
        }
      });
    }, options);

    this.images.forEach(img => {
      this.observer.observe(img);
    });
  }

  private loadImage(img: HTMLImageElement) {
    const src = img.getAttribute('data-src');
    if (src) {
      img.src = src;
      img.classList.add('loaded');
      this.observer.unobserve(img);
    }
  }

  public destroy() {
    this.observer.disconnect();
  }
}

// Form validation with modern feedback
class FormValidator {
  private form: HTMLFormElement;
  private inputs: NodeListOf<HTMLInputElement>;

  constructor(formSelector: string) {
    this.form = document.querySelector(formSelector) as HTMLFormElement;
    this.inputs = this.form?.querySelectorAll(
      'input, textarea, select'
    ) as NodeListOf<HTMLInputElement>;
    this.init();
  }

  private init() {
    if (this.form) {
      this.form.addEventListener('submit', e => this.handleSubmit(e));

      this.inputs.forEach(input => {
        input.addEventListener('blur', () => this.validateField(input));
        input.addEventListener('input', () => this.clearError(input));
      });
    }
  }

  private validateField(input: HTMLInputElement) {
    const value = input.value.trim();
    const type = input.type;
    const required = input.hasAttribute('required');

    let isValid = true;
    let message = '';

    if (required && !value) {
      isValid = false;
      message = 'هذا الحقل مطلوب';
    } else if (value) {
      switch (type) {
        case 'email':
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            isValid = false;
            message = 'يرجى إدخال بريد إلكتروني صحيح';
          }
          break;
        case 'tel':
          const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
          if (!phoneRegex.test(value)) {
            isValid = false;
            message = 'يرجى إدخال رقم هاتف صحيح';
          }
          break;
      }
    }

    this.showFieldValidation(input, isValid, message);
    return isValid;
  }

  private showFieldValidation(
    input: HTMLInputElement,
    isValid: boolean,
    message: string
  ) {
    const field = input.closest('.form-field');
    if (field) {
      field.classList.toggle('error', !isValid);
      field.classList.toggle('success', Boolean(isValid && input.value));

      let feedback = field.querySelector('.field-feedback');
      if (!feedback) {
        feedback = document.createElement('div');
        feedback.className = 'field-feedback';
        field.appendChild(feedback);
      }

      feedback.textContent = message;
      feedback.className = `field-feedback ${isValid ? 'success' : 'error'}`;
    }
  }

  private clearError(input: HTMLInputElement) {
    const field = input.closest('.form-field');
    if (field) {
      field.classList.remove('error');
      const feedback = field.querySelector('.field-feedback');
      if (feedback) {
        feedback.textContent = '';
      }
    }
  }

  private handleSubmit(e: Event) {
    e.preventDefault();

    let isFormValid = true;
    this.inputs.forEach(input => {
      if (!this.validateField(input)) {
        isFormValid = false;
      }
    });

    if (isFormValid) {
      this.form.submit();
    }
  }
}

// Initialize all modern interactions
export function initModernInteractions() {
  // Initialize scroll reveal
  new ScrollReveal();

  // Initialize parallax scrolling
  new ParallaxScroll();

  // Initialize lazy loading
  new LazyLoader();

  // Initialize form validation
  new FormValidator('form');

  // Add smooth scrolling to all anchor links
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = link.getAttribute('href');
      if (target) {
        smoothScrollTo(target, 80);
      }
    });
  });
}

// Export all utilities
export { FormValidator };
