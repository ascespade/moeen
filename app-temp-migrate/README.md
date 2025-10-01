# مُعين (Mu3een)

A modern, real-time communication platform built with Next.js, React, and TypeScript. Mu3een provides multi-channel messaging, user management, and AI-powered features in a beautiful, responsive interface.

## ✨ Features

- 🚀 **Real-time Messaging** - Instant communication across multiple channels
- 👥 **User Management** - Comprehensive user administration and roles
- 🎨 **Modern UI** - Beautiful, responsive design with dark/light themes
- 🔒 **Secure Authentication** - JWT-based authentication with role-based access
- 🤖 **AI Integration** - AI-powered features for enhanced communication
- 📱 **Mobile Responsive** - Optimized for all device sizes
- 🌐 **Multi-language Support** - Arabic and English language support
- ⚡ **Performance Optimized** - Fast loading and smooth user experience

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, CSS Custom Properties
- **State Management**: React Hooks, Context API
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React
- **Testing**: Jest + Testing Library
- **Code Quality**: ESLint, Prettier, TypeScript strict mode

## 🚀 Quick Start

### Prerequisites

- Node.js 18.0.0 or higher
- npm 8.0.0 or higher
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mu3een
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
mu3een/
├── docs/                    # 📚 Documentation
├── public/                  # 🌐 Static assets
├── src/                     # 💻 Source code
│   ├── app/                 # 🚀 Next.js app directory
│   ├── components/          # 🧩 React components
│   ├── hooks/               # 🎣 Custom React hooks
│   ├── utils/               # 🔧 Utility functions
│   ├── types/               # 📝 TypeScript types
│   ├── constants/           # 📋 Application constants
│   ├── styles/              # 🎨 Styling files
│   └── config/              # ⚙️ Configuration files
├── .env.example             # 🔐 Environment variables template
├── jest.config.js           # 🧪 Jest configuration
├── next.config.ts           # ⚡ Next.js configuration
├── tailwind.config.js       # 🎨 Tailwind CSS configuration
└── tsconfig.json            # 📘 TypeScript configuration
```

## 🎯 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint with auto-fix |
| `npm run lint:check` | Check linting without fixing |
| `npm run type-check` | Run TypeScript type checking |
| `npm run format` | Format code with Prettier |
| `npm run test` | Run tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage |
| `npm run clean` | Clean build artifacts |

## 🔧 Configuration

### Environment Variables

Copy `.env.example` to `.env.local` and configure:

```bash
# App Configuration
NEXT_PUBLIC_APP_NAME=Mu3een
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database
DATABASE_URL=your-database-url

# Authentication
JWT_SECRET=your-jwt-secret

# AI Configuration
OPENAI_API_KEY=your-openai-api-key

# Feature Flags
NEXT_PUBLIC_ENABLE_AI=false
NEXT_PUBLIC_ENABLE_DEBUG=true
```

### TypeScript Configuration

The project uses strict TypeScript configuration with:
- Strict type checking
- No implicit any
- Unused variable detection
- Exact optional property types

### ESLint Configuration

ESLint is configured with:
- Next.js recommended rules
- Prettier integration
- TypeScript support
- React hooks rules

## 🧪 Testing

The project includes comprehensive testing setup:

- **Unit Tests**: Jest + Testing Library
- **Component Tests**: React component testing
- **Hook Tests**: Custom hook testing
- **Coverage**: 80% minimum coverage requirement

Run tests:
```bash
npm test                 # Run all tests
npm run test:watch      # Watch mode
npm run test:coverage   # With coverage report
```

## 🎨 Styling

The project uses a modern styling approach:

- **Tailwind CSS**: Utility-first CSS framework
- **CSS Custom Properties**: For theming and variables
- **Component Styles**: Scoped component styling
- **Responsive Design**: Mobile-first approach
- **Dark Mode**: Built-in theme switching

## 📚 Documentation

Comprehensive documentation is available in the `docs/` directory:

- [Development Guide](docs/DEVELOPMENT.md) - Detailed development information
- [API Documentation](docs/API.md) - Complete API reference
- [README](docs/README.md) - Project overview and setup

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables
4. Deploy automatically

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Manual Deployment

```bash
npm run build
npm run start
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📖 [Documentation](docs/README.md)
- 🐛 [Report Issues](https://github.com/your-org/mu3een/issues)
- 💬 [Discussions](https://github.com/your-org/mu3een/discussions)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Lucide React](https://lucide.dev/) - Beautiful icons
- [React Hook Form](https://react-hook-form.com/) - Form handling
- [Zod](https://zod.dev/) - TypeScript-first schema validation

---

Made with ❤️ by the Mu3een Team