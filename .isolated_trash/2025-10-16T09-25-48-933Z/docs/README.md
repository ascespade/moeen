# Mu3een Documentation

Welcome to the Mu3een project documentation. This document provides comprehensive information about the project structure, development setup, and usage guidelines.

## Table of Contents

- [Project Overview](#project-overview)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Development Guidelines](#development-guidelines)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Contributing](#contributing)

## Project Overview

Mu3een is a modern communication platform built with Next.js, React, and TypeScript. It provides real-time messaging, channel management, and user administration features.

### Key Features

- Real-time messaging
- Channel management
- User administration
- AI-powered features
- Responsive design
- Dark/Light theme support

### Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React
- **Testing**: Jest + Testing Library

## Getting Started

### Prerequisites

- Node.js 18+
- npm 8+
- Git

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd mu3een
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:check` - Check linting without fixing
- `npm run type-check` - Run TypeScript type checking
- `npm run format` - Format code with Prettier
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage
- `npm run clean` - Clean build artifacts

## Project Structure

```
mu3een/
├── docs/                    # Documentation
├── public/                  # Static assets
├── src/                     # Source code
│   ├── app/                 # Next.js app directory
│   │   ├── (admin)/         # Admin routes
│   │   ├── (auth)/          # Authentication routes
│   │   ├── api/             # API routes
│   │   └── globals.css      # Global styles
│   ├── components/          # React components
│   │   ├── common/          # Common components
│   │   ├── dashboard/       # Dashboard components
│   │   ├── providers/       # Context providers
│   │   ├── settings/        # Settings components
│   │   └── shell/           # Layout components
│   ├── config/              # Configuration files
│   │   └── env.ts           # Environment configuration
│   ├── constants/           # Application constants
│   │   ├── api.ts           # API endpoints
│   │   ├── routes.ts        # Route definitions
│   │   ├── ui.ts            # UI constants
│   │   └── validation.ts    # Validation rules
│   ├── hooks/               # Custom React hooks
│   │   ├── useApi.ts        # API hooks
│   │   ├── useAuth.ts       # Authentication hooks
│   │   └── useForm.ts       # Form hooks
│   ├── lib/                 # Library code
│   │   ├── auth/            # Authentication utilities
│   │   └── supabase/        # Supabase configuration
│   ├── styles/              # Styling files
│   │   ├── base.css         # Base styles
│   │   ├── components.css   # Component styles
│   │   ├── themes.css       # Theme styles
│   │   └── utilities.css    # Utility classes
│   ├── types/               # TypeScript type definitions
│   │   ├── index.ts         # Main types
│   │   └── api.ts           # API types
│   └── utils/               # Utility functions
│       ├── api.ts           # API utilities
│       ├── format.ts        # Formatting utilities
│       ├── storage.ts       # Storage utilities
│       └── validation.ts    # Validation utilities
├── .env.example             # Environment variables example
├── .gitignore              # Git ignore rules
├── .prettierrc             # Prettier configuration
├── .prettierignore         # Prettier ignore rules
├── eslint.config.mjs       # ESLint configuration
├── jest.config.js          # Jest configuration
├── jest.setup.js           # Jest setup
├── next.config.ts          # Next.js configuration
├── package.json            # Package configuration
├── postcss.config.js       # PostCSS configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

## Development Guidelines

### Code Style

- Use TypeScript for all new code
- Follow ESLint and Prettier configurations
- Use meaningful variable and function names
- Write JSDoc comments for complex functions
- Keep components small and focused

### Component Guidelines

- Use functional components with hooks
- Extract reusable logic into custom hooks
- Use TypeScript interfaces for props
- Follow the single responsibility principle
- Use proper error boundaries

### File Naming

- Use PascalCase for components: `UserProfile.tsx`
- Use camelCase for utilities: `formatDate.ts`
- Use kebab-case for pages: `user-settings.tsx`
- Use UPPER_CASE for constants: `API_ENDPOINTS.ts`

### Import Organization

1. React and Next.js imports
2. Third-party library imports
3. Internal imports (components, utils, etc.)
4. Type imports
5. Relative imports

### Git Workflow

1. Create feature branches from `main`
2. Use descriptive commit messages
3. Run tests before committing
4. Create pull requests for code review
5. Merge to `main` after approval

## API Documentation

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh token

### Users

- `GET /api/users` - Get users list
- `POST /api/users` - Create user
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Channels

- `GET /api/channels` - Get channels list
- `POST /api/channels` - Create channel
- `GET /api/channels/:id` - Get channel by ID
- `PUT /api/channels/:id` - Update channel
- `DELETE /api/channels/:id` - Delete channel

## Deployment

### Environment Variables

Set the following environment variables in your production environment:

```bash
NEXT_PUBLIC_APP_NAME=Mu3een
NEXT_PUBLIC_APP_URL=https://your-domain.com
DATABASE_URL=your-database-url
JWT_SECRET=your-jwt-secret
# ... other variables from .env.example
```

### Build and Deploy

1. Build the application:

```bash
npm run build
```

2. Start the production server:

```bash
npm run start
```

### Docker Deployment

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

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Run the test suite
6. Submit a pull request

### Pull Request Guidelines

- Provide a clear description of changes
- Include screenshots for UI changes
- Ensure all tests pass
- Update documentation if needed
- Follow the coding standards

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions, please contact the development team or create an issue in the repository.
