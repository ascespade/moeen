import { useRouter } from "next/navigation";

import { render, screen, fireEvent, waitFor } from "@testing-library/react";

import { useAuth } from "@/hooks/useAuth";
import { useT } from "@/components/providers/I18nProvider";
import LoginPage from "@/app/(auth)/login/page";

// Mock dependencies
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/hooks/useAuth", () => ({
  useAuth: jest.fn(),
}));

jest.mock("@/components/providers/I18nProvider", () => ({
  useT: jest.fn(),
}));

jest.mock("@/lib/router", () => ({
  getDefaultRouteForUser: jest.fn(() => "/dashboard"),
}));

const mockRouter = {
  push: jest.fn(),
};

const mockUseAuth = {
  loginWithCredentials: jest.fn(),
  isLoading: false,
  isAuthenticated: false,
};

const mockUseT = (key: string, fallback: string) => fallback;

describe("LoginPage", () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useAuth as jest.Mock).mockReturnValue(mockUseAuth);
    (useT as jest.Mock).mockImplementation(mockUseT);

    // Reset mocks
    jest.clearAllMocks();
  });

  it("renders login form correctly", () => {
    render(<LoginPage />);

    expect(screen.getByText("مرحباً بعودتك")).toBeInTheDocument();
    expect(
      screen.getByText("سجل دخولك للوصول إلى لوحة التحكم")
    ).toBeInTheDocument();
    expect(screen.getByLabelText("البريد الإلكتروني")).toBeInTheDocument();
    expect(screen.getByLabelText("كلمة المرور")).toBeInTheDocument();
    expect(screen.getByText("تذكرني")).toBeInTheDocument();
    expect(screen.getByText("نسيت كلمة المرور؟")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /تسجيل الدخول/ })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /تسجيل دخول سريع/ })
    ).toBeInTheDocument();
  });

  it("redirects to dashboard if already authenticated", () => {
    (useAuth as jest.Mock).mockReturnValue({
      ...mockUseAuth,
      isAuthenticated: true,
    });

    render(<LoginPage />);

    expect(mockRouter.push).toHaveBeenCalledWith("/dashboard");
  });

  it("handles form input changes", () => {
    render(<LoginPage />);

    const emailInput = screen.getByLabelText("البريد الإلكتروني");
    const passwordInput = screen.getByLabelText("كلمة المرور");
    const rememberMeCheckbox = screen.getByLabelText("تذكرني");

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(rememberMeCheckbox);

    expect(emailInput).toHaveValue("test@example.com");
    expect(passwordInput).toHaveValue("password123");
    expect(rememberMeCheckbox).toBeChecked();
  });

  it("submits form with correct data", async () => {
    const mockLoginWithCredentials = jest
      .fn()
      .mockResolvedValue({ success: true });
    (useAuth as jest.Mock).mockReturnValue({
      ...mockUseAuth,
      loginWithCredentials: mockLoginWithCredentials,
    });

    render(<LoginPage />);

    const emailInput = screen.getByLabelText("البريد الإلكتروني");
    const passwordInput = screen.getByLabelText("كلمة المرور");
    const rememberMeCheckbox = screen.getByLabelText("تذكرني");
    const submitButton = screen.getByRole("button", { name: /تسجيل الدخول/ });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(rememberMeCheckbox);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockLoginWithCredentials).toHaveBeenCalledWith(
        "test@example.com",
        "password123",
        true
      );
    });
  });

  it("displays error message on login failure", async () => {
    const mockLoginWithCredentials = jest
      .fn()
      .mockRejectedValue(new Error("Invalid credentials"));
    (useAuth as jest.Mock).mockReturnValue({
      ...mockUseAuth,
      loginWithCredentials: mockLoginWithCredentials,
    });

    render(<LoginPage />);

    const emailInput = screen.getByLabelText("البريد الإلكتروني");
    const passwordInput = screen.getByLabelText("كلمة المرور");
    const submitButton = screen.getByRole("button", { name: /تسجيل الدخول/ });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("فشل تسجيل الدخول")).toBeInTheDocument();
    });
  });

  it("handles quick test login", async () => {
    const mockLoginWithCredentials = jest
      .fn()
      .mockResolvedValue({ success: true });
    (useAuth as jest.Mock).mockReturnValue({
      ...mockUseAuth,
      loginWithCredentials: mockLoginWithCredentials,
    });

    render(<LoginPage />);

    const quickLoginButton = screen.getByRole("button", {
      name: /تسجيل دخول سريع/,
    });
    fireEvent.click(quickLoginButton);

    await waitFor(() => {
      expect(mockLoginWithCredentials).toHaveBeenCalledWith(
        "test@moeen.com",
        "test123",
        false
      );
    });
  });

  it("shows loading state during submission", async () => {
    const mockLoginWithCredentials = jest
      .fn()
      .mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );
    (useAuth as jest.Mock).mockReturnValue({
      ...mockUseAuth,
      loginWithCredentials: mockLoginWithCredentials,
    });

    render(<LoginPage />);

    const emailInput = screen.getByLabelText("البريد الإلكتروني");
    const passwordInput = screen.getByLabelText("كلمة المرور");
    const submitButton = screen.getByRole("button", { name: /تسجيل الدخول/ });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    expect(screen.getByText("جارٍ تسجيل الدخول...")).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });

  it("validates required fields", async () => {
    render(<LoginPage />);

    const submitButton = screen.getByRole("button", { name: /تسجيل الدخول/ });
    fireEvent.click(submitButton);

    const emailInput = screen.getByLabelText("البريد الإلكتروني");
    const passwordInput = screen.getByLabelText("كلمة المرور");

    expect(emailInput).toBeRequired();
    expect(passwordInput).toBeRequired();
  });

  it("has correct links to other auth pages", () => {
    render(<LoginPage />);

    const forgotPasswordLink = screen.getByText("نسيت كلمة المرور؟");
    const registerLink = screen.getByText("إنشاء حساب جديد");

    expect(forgotPasswordLink.closest("a")).toHaveAttribute(
      "href",
      "/forgot-password"
    );
    expect(registerLink.closest("a")).toHaveAttribute("href", "/register");
  });
});
