import { render, screen, fireEvent } from '@testing-library/react';
import Header from '../Header';
import { useSystemConfig } from '@/lib/config/system-config';

// Mock the configuration hook
jest.mock('@/lib/config/system-config');
const mockUseSystemConfig = useSystemConfig as jest.MockedFunction<typeof useSystemConfig>;

// Mock the i18n provider
jest.mock('@/components/providers/I18nProvider', () => ({
  useT: () => (key: string) => key
}));

// Mock the design system hooks
jest.mock('@/design-system/hooks', () => ({
  useLanguage: () => ({ language: 'en', isLoading: false, direction: 'ltr' }),
  useTheme: () => ({ theme: 'light', isLoading: false })
}));

// Mock the theme and language switchers
jest.mock('@/components/common/ThemeSwitcher', () => {
  return function MockThemeSwitcher() {
    return <div data-testid="theme-switcher">Theme Switcher</div>;
  };
});

jest.mock('@/components/LanguageSwitcher', () => {
  return function MockLanguageSwitcher() {
    return <div data-testid="language-switcher">Language Switcher</div>;
  };
});

describe('Header Component', () => {
  const mockConfig = {
    modules: {
      reception: { enabled: true, features: ['Patient check-in'] },
      doctor: { enabled: true, features: ['View patient list'] }
    },
    ai_features: {
      chatbot: { enabled: true, integrations: ['WhatsApp'], capabilities: ['Create appointments'] },
      voice_bot: { enabled: false, purpose: 'Voice interaction', integrations: [], features: [] },
      emotion_analytics: { enabled: true, purpose: 'Monitor emotions', dashboard_access: ['doctor'], metrics: ['Emotional stability'] },
      early_diagnosis: { enabled: false, purpose: 'Early detection' }
    },
    security: { encryption: true, audit_logs: true, role_based_access: true },
    automation: { cron_jobs: ['Reminders'] },
    translation: { enabled: true, dynamic_update: true, no_hardcoded_text: true },
    reports: { weekly_learning_report_to_admin: true }
  };

  beforeEach(() => {
    mockUseSystemConfig.mockReturnValue({
      config: mockConfig,
      updateConfig: jest.fn(),
      toggleModule: jest.fn(),
      toggleAIFeature: jest.fn()
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the header with all basic elements', () => {
    render(<Header />);
    
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByTestId('theme-switcher')).toBeInTheDocument();
    expect(screen.getByTestId('language-switcher')).toBeInTheDocument();
  });

  it('shows AI features indicator when AI features are enabled', () => {
    render(<Header />);
    
    expect(screen.getByText('AI')).toBeInTheDocument();
  });

  it('does not show AI features indicator when no AI features are enabled', () => {
    const configWithoutAI = {
      ...mockConfig,
      ai_features: {
        chatbot: { enabled: false, integrations: [], capabilities: [] },
        voice_bot: { enabled: false, purpose: '', integrations: [], features: [] },
        emotion_analytics: { enabled: false, purpose: '', dashboard_access: [], metrics: [] },
        early_diagnosis: { enabled: false, purpose: '' }
      }
    };
    
    mockUseSystemConfig.mockReturnValue({
      config: configWithoutAI,
      updateConfig: jest.fn(),
      toggleModule: jest.fn(),
      toggleAIFeature: jest.fn()
    });

    render(<Header />);
    
    expect(screen.queryByText('AI')).not.toBeInTheDocument();
  });

  it('shows AI features dropdown when clicked', () => {
    render(<Header />);
    
    const aiButton = screen.getByText('AI').closest('button');
    fireEvent.click(aiButton!);
    
    expect(screen.getByText('header.aiFeatures')).toBeInTheDocument();
  });

  it('displays enabled AI features in the dropdown', () => {
    render(<Header />);
    
    const aiButton = screen.getByText('AI').closest('button');
    fireEvent.click(aiButton!);
    
    expect(screen.getByText('header.chatbot')).toBeInTheDocument();
    expect(screen.getByText('header.emotionAnalytics')).toBeInTheDocument();
  });

  it('does not display disabled AI features in the dropdown', () => {
    render(<Header />);
    
    const aiButton = screen.getByText('AI').closest('button');
    fireEvent.click(aiButton!);
    
    expect(screen.queryByText('header.voiceBot')).not.toBeInTheDocument();
    expect(screen.queryByText('header.earlyDiagnosis')).not.toBeInTheDocument();
  });

  it('renders search input with proper placeholder', () => {
    render(<Header />);
    
    const searchInput = screen.getByPlaceholderText('common.searchPlaceholder');
    expect(searchInput).toBeInTheDocument();
  });

  it('renders notifications with proper count', () => {
    render(<Header />);
    
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('allows marking notifications as read', () => {
    render(<Header />);
    
    const markAsReadButton = screen.getByText('header.markAsRead');
    fireEvent.click(markAsReadButton);
    
    expect(screen.getByText('header.noNotifications')).toBeInTheDocument();
  });
});
