import { render, screen, fireEvent, waitFor } from "@testing-library/react";

import ResetPasswordPage from "@/app/(auth)/reset-password/page";

describe("ResetPasswordPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders reset password form correctly", () => {
    render(<ResetPasswordPage />);

    expect(screen.getByText("إعادة تعيين كلمة المرور")).toBeInTheDocument();
    expect(screen.getByText("أدخل كلمة المرور الجديدة")).toBeInTheDocument();
    expect(screen.getByLabelText("كلمة المرور الجديدة")).toBeInTheDocument();
    expect(screen.getByLabelText("تأكيد كلمة المرور")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /تغيير كلمة المرور/ })
    ).toBeInTheDocument();
  });

  it("handles form input changes", () => {
    render(<ResetPasswordPage />);

    const passwordInput = screen.getByLabelText("كلمة المرور الجديدة");
    const confirmPasswordInput = screen.getByLabelText("تأكيد كلمة المرور");

    fireEvent.change(passwordInput, { target: { value: "newpassword123" } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "newpassword123" },
    });

    expect(passwordInput).toHaveValue("newpassword123");
    expect(confirmPasswordInput).toHaveValue("newpassword123");
  });

  it("validates required password field", async () => {
    render(<ResetPasswordPage />);

    const submitButton = screen.getByRole("button", {
      name: /تغيير كلمة المرور/,
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("كلمة المرور مطلوبة")).toBeInTheDocument();
    });
  });

  it("validates password length", async () => {
    render(<ResetPasswordPage />);

    const passwordInput = screen.getByLabelText("كلمة المرور الجديدة");
    const submitButton = screen.getByRole("button", {
      name: /تغيير كلمة المرور/,
    });

    fireEvent.change(passwordInput, { target: { value: "123" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText("كلمة المرور يجب أن تكون 6 أحرف على الأقل")
      ).toBeInTheDocument();
    });
  });

  it("validates password confirmation", async () => {
    render(<ResetPasswordPage />);

    const passwordInput = screen.getByLabelText("كلمة المرور الجديدة");
    const confirmPasswordInput = screen.getByLabelText("تأكيد كلمة المرور");
    const submitButton = screen.getByRole("button", {
      name: /تغيير كلمة المرور/,
    });

    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "different123" },
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("كلمة المرور غير متطابقة")).toBeInTheDocument();
    });
  });

  it("shows success message after successful reset", async () => {
    render(<ResetPasswordPage />);

    const passwordInput = screen.getByLabelText("كلمة المرور الجديدة");
    const confirmPasswordInput = screen.getByLabelText("تأكيد كلمة المرور");
    const submitButton = screen.getByRole("button", {
      name: /تغيير كلمة المرور/,
    });

    fireEvent.change(passwordInput, { target: { value: "newpassword123" } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "newpassword123" },
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("تم تغيير كلمة المرور!")).toBeInTheDocument();
      expect(
        screen.getByText(
          "تم تغيير كلمة المرور بنجاح. يمكنك الآن تسجيل الدخول باستخدام كلمة المرور الجديدة."
        )
      ).toBeInTheDocument();
    });
  });

  it("shows loading state during submission", async () => {
    render(<ResetPasswordPage />);

    const passwordInput = screen.getByLabelText("كلمة المرور الجديدة");
    const confirmPasswordInput = screen.getByLabelText("تأكيد كلمة المرور");
    const submitButton = screen.getByRole("button", {
      name: /تغيير كلمة المرور/,
    });

    fireEvent.change(passwordInput, { target: { value: "newpassword123" } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "newpassword123" },
    });
    fireEvent.click(submitButton);

    expect(screen.getByText("جاري الحفظ...")).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });

  it("has correct link to login page", () => {
    render(<ResetPasswordPage />);

    const loginLink = screen.getByText("تسجيل الدخول");
    expect(loginLink.closest("a")).toHaveAttribute("href", "/login");
  });

  it("shows password requirements", () => {
    render(<ResetPasswordPage />);

    expect(screen.getByText("متطلبات كلمة المرور:")).toBeInTheDocument();
    expect(
      screen.getByText("• يجب أن تكون 6 أحرف على الأقل")
    ).toBeInTheDocument();
    expect(
      screen.getByText("• يُفضل أن تحتوي على أرقام ورموز")
    ).toBeInTheDocument();
    expect(
      screen.getByText("• تجنب استخدام كلمات مرور سهلة التخمين")
    ).toBeInTheDocument();
  });

  it("clears error when user starts typing", () => {
    render(<ResetPasswordPage />);

    const passwordInput = screen.getByLabelText("كلمة المرور الجديدة");
    const submitButton = screen.getByRole("button", {
      name: /تغيير كلمة المرور/,
    });

    // Trigger error
    fireEvent.click(submitButton);

    // Start typing to clear error
    fireEvent.change(passwordInput, { target: { value: "t" } });

    expect(screen.queryByText("كلمة المرور مطلوبة")).not.toBeInTheDocument();
  });

  it("validates both password fields are required", async () => {
    render(<ResetPasswordPage />);

    const passwordInput = screen.getByLabelText("كلمة المرور الجديدة");
    const confirmPasswordInput = screen.getByLabelText("تأكيد كلمة المرور");
    const submitButton = screen.getByRole("button", {
      name: /تغيير كلمة المرور/,
    });

    fireEvent.change(passwordInput, { target: { value: "password123" } });
    // Don't fill confirm password
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("تأكيد كلمة المرور مطلوب")).toBeInTheDocument();
    });
  });
});
