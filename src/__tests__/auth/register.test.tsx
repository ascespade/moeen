import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import RegisterPage from '@/app/(auth)/register/page';

// Mock dependencies
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

const mockRouter = {
  push: vi.fn(),
};

describe('RegisterPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders registration form correctly', () => {
    render(<RegisterPage />);

    expect(screen.getByText('إنشاء حساب جديد')).toBeInTheDocument();
    expect(
      screen.getByText('انضم إلى منصة الرعاية الصحية المتخصصة')
    ).toBeInTheDocument();
    expect(screen.getByLabelText('الاسم الكامل')).toBeInTheDocument();
    expect(screen.getByLabelText('البريد الإلكتروني')).toBeInTheDocument();
    expect(screen.getByLabelText('كلمة المرور')).toBeInTheDocument();
    expect(screen.getByLabelText('تأكيد كلمة المرور')).toBeInTheDocument();
    expect(screen.getByText('أوافق على')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /إنشاء الحساب/ })
    ).toBeInTheDocument();
  });

  it('handles form input changes', () => {
    render(<RegisterPage />);

    const nameInput = screen.getByLabelText('الاسم الكامل');
    const emailInput = screen.getByLabelText('البريد الإلكتروني');
    const passwordInput = screen.getByLabelText('كلمة المرور');
    const confirmPasswordInput = screen.getByLabelText('تأكيد كلمة المرور');
    const agreeToTermsCheckbox = screen.getByLabelText('أوافق على');

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: 'password123' },
    });
    fireEvent.click(agreeToTermsCheckbox);

    expect(nameInput).toHaveValue('John Doe');
    expect(emailInput).toHaveValue('john@example.com');
    expect(passwordInput).toHaveValue('password123');
    expect(confirmPasswordInput).toHaveValue('password123');
    expect(agreeToTermsCheckbox).toBeChecked();
  });

  it('validates form fields correctly', async () => {
    render(<RegisterPage />);

    const submitButton = screen.getByRole('button', { name: /إنشاء الحساب/ });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('الاسم مطلوب')).toBeInTheDocument();
      expect(screen.getByText('البريد الإلكتروني مطلوب')).toBeInTheDocument();
      expect(screen.getByText('كلمة المرور مطلوبة')).toBeInTheDocument();
      expect(
        screen.getByText('يجب الموافقة على الشروط والأحكام')
      ).toBeInTheDocument();
    });
  });

  it('validates email format', async () => {
    render(<RegisterPage />);

    const emailInput = screen.getByLabelText('البريد الإلكتروني');
    const submitButton = screen.getByRole('button', { name: /إنشاء الحساب/ });

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText('البريد الإلكتروني غير صحيح')
      ).toBeInTheDocument();
    });
  });

  it('validates password length', async () => {
    render(<RegisterPage />);

    const passwordInput = screen.getByLabelText('كلمة المرور');
    const submitButton = screen.getByRole('button', { name: /إنشاء الحساب/ });

    fireEvent.change(passwordInput, { target: { value: '123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText('كلمة المرور يجب أن تكون 6 أحرف على الأقل')
      ).toBeInTheDocument();
    });
  });

  it('validates password confirmation', async () => {
    render(<RegisterPage />);

    const passwordInput = screen.getByLabelText('كلمة المرور');
    const confirmPasswordInput = screen.getByLabelText('تأكيد كلمة المرور');
    const submitButton = screen.getByRole('button', { name: /إنشاء الحساب/ });

    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: 'different123' },
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('كلمة المرور غير متطابقة')).toBeInTheDocument();
    });
  });

  it('shows success message after successful registration', async () => {
    render(<RegisterPage />);

    const nameInput = screen.getByLabelText('الاسم الكامل');
    const emailInput = screen.getByLabelText('البريد الإلكتروني');
    const passwordInput = screen.getByLabelText('كلمة المرور');
    const confirmPasswordInput = screen.getByLabelText('تأكيد كلمة المرور');
    const agreeToTermsCheckbox = screen.getByLabelText('أوافق على');
    const submitButton = screen.getByRole('button', { name: /إنشاء الحساب/ });

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: 'password123' },
    });
    fireEvent.click(agreeToTermsCheckbox);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('تم إنشاء الحساب بنجاح!')).toBeInTheDocument();
      expect(
        screen.getByText(
          'مرحباً بك في مُعين. يمكنك الآن تسجيل الدخول باستخدام بياناتك.'
        )
      ).toBeInTheDocument();
    });
  });

  it('shows loading state during submission', async () => {
    render(<RegisterPage />);

    const nameInput = screen.getByLabelText('الاسم الكامل');
    const emailInput = screen.getByLabelText('البريد الإلكتروني');
    const passwordInput = screen.getByLabelText('كلمة المرور');
    const confirmPasswordInput = screen.getByLabelText('تأكيد كلمة المرور');
    const agreeToTermsCheckbox = screen.getByLabelText('أوافق على');
    const submitButton = screen.getByRole('button', { name: /إنشاء الحساب/ });

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: 'password123' },
    });
    fireEvent.click(agreeToTermsCheckbox);
    fireEvent.click(submitButton);

    expect(screen.getByText('جاري إنشاء الحساب...')).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });

  it('has correct links to terms and privacy', () => {
    render(<RegisterPage />);

    const termsLink = screen.getByText('الشروط والأحكام');
    const privacyLink = screen.getByText('سياسة الخصوصية');

    expect(termsLink.closest('a')).toHaveAttribute('href', '/terms');
    expect(privacyLink.closest('a')).toHaveAttribute('href', '/privacy');
  });

  it('has link to login page', () => {
    render(<RegisterPage />);

    const loginLink = screen.getByText('تسجيل الدخول');
    expect(loginLink.closest('a')).toHaveAttribute('href', '/login');
  });
});
