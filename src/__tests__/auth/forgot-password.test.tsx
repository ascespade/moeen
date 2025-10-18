import { render, screen, fireEvent, waitFor } from "@testing-library/react";

import ForgotPasswordPage from "@/app/(auth)/forgot-password/page";

describe("ForgotPasswordPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders forgot password form correctly", () => {
    render(<ForgotPasswordPage />);

    expect(screen.getByText("نسيان كلمة المرور")).toBeInTheDocument();
    expect(
      screen.getByText(
        "أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة تعيين كلمة المرور"
      )
    ).toBeInTheDocument();
    expect(screen.getByLabelText("البريد الإلكتروني")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /إرسال رابط إعادة التعيين/ })
    ).toBeInTheDocument();
  });

  it("handles email input change", () => {
    render(<ForgotPasswordPage />);

    const emailInput = screen.getByLabelText("البريد الإلكتروني");
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });

    expect(emailInput).toHaveValue("test@example.com");
  });

  it("validates required email field", async () => {
    render(<ForgotPasswordPage />);

    const submitButton = screen.getByRole("button", {
      name: /إرسال رابط إعادة التعيين/,
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("البريد الإلكتروني مطلوب")).toBeInTheDocument();
    });
  });

  it("validates email format", async () => {
    render(<ForgotPasswordPage />);

    const emailInput = screen.getByLabelText("البريد الإلكتروني");
    const submitButton = screen.getByRole("button", {
      name: /إرسال رابط إعادة التعيين/,
    });

    fireEvent.change(emailInput, { target: { value: "invalid-email" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText("البريد الإلكتروني غير صحيح")
      ).toBeInTheDocument();
    });
  });

  it("shows success message after successful submission", async () => {
    render(<ForgotPasswordPage />);

    const emailInput = screen.getByLabelText("البريد الإلكتروني");
    const submitButton = screen.getByRole("button", {
      name: /إرسال رابط إعادة التعيين/,
    });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("تم إرسال الرابط!")).toBeInTheDocument();
      expect(
        screen.getByText(
          "تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني. تحقق من صندوق الوارد أو مجلد الرسائل المزعجة."
        )
      ).toBeInTheDocument();
    });
  });

  it("shows loading state during submission", async () => {
    render(<ForgotPasswordPage />);

    const emailInput = screen.getByLabelText("البريد الإلكتروني");
    const submitButton = screen.getByRole("button", {
      name: /إرسال رابط إعادة التعيين/,
    });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.click(submitButton);

    expect(screen.getByText("جاري الإرسال...")).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });

  it("has correct link to login page", () => {
    render(<ForgotPasswordPage />);

    const loginLink = screen.getByText("تسجيل الدخول");
    expect(loginLink.closest("a")).toHaveAttribute("href", "/login");
  });

  it("allows sending another email after success", async () => {
    render(<ForgotPasswordPage />);

    const emailInput = screen.getByLabelText("البريد الإلكتروني");
    const submitButton = screen.getByRole("button", {
      name: /إرسال رابط إعادة التعيين/,
    });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("تم إرسال الرابط!")).toBeInTheDocument();
    });

    const sendAnotherButton = screen.getByText("إرسال رابط آخر");
    fireEvent.click(sendAnotherButton);

    expect(screen.getByText("نسيان كلمة المرور")).toBeInTheDocument();
    expect(emailInput).toHaveValue("");
  });

  it("clears error when user starts typing", () => {
    render(<ForgotPasswordPage />);

    const emailInput = screen.getByLabelText("البريد الإلكتروني");
    const submitButton = screen.getByRole("button", {
      name: /إرسال رابط إعادة التعيين/,
    });

    // Trigger error
    fireEvent.click(submitButton);

    // Start typing to clear error
    fireEvent.change(emailInput, { target: { value: "t" } });

    expect(
      screen.queryByText("البريد الإلكتروني مطلوب")
    ).not.toBeInTheDocument();
  });
});
