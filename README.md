# Dvizhenie Life Admin Frontend

Manager admin panel for Dvizhenie Life project.

## Tech Stack

- **Build Tool**: [Vite](https://vitejs.dev/) - Fast build tool and dev server
- **Framework**: [React](https://react.dev/) - JavaScript library for building user interfaces
- **Language**: [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- **Routing**: [React Router](https://reactrouter.com/) - Client-side routing
- **UI Library**: [shadcn/ui](https://ui.shadcn.com/) - Modern, accessible component library
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- **Icons**: [Lucide React](https://lucide.dev/) - Beautiful & consistent icon toolkit
- **Font**: [Inter](https://fonts.google.com/specimen/Inter) - Modern, readable font family
- **HTTP Client**: [Axios](https://axios-http.com/) - HTTP requests
- **Data Fetching**: [TanStack Query](https://tanstack.com/query) - Server state management
- **Linting**: [ESLint](https://eslint.org/) - Code linting
- **Formatting**: [Prettier](https://prettier.io/) - Code formatting
- **CSS Linting**: [Stylelint](https://stylelint.io/) - CSS linting
- **Testing**: [Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) - Testing framework
- **Git Hooks**: [Husky](https://typicode.github.io/husky/) + [lint-staged](https://github.com/okonet/lint-staged) - Pre-commit hooks
- **Commit Standards**: [Commitlint](https://commitlint.js.org/) - Commit message linting
- **CI/CD**: [GitHub Actions](https://github.com/features/actions) - Automated testing and deployment
- **Containerization**: [Docker](https://www.docker.com/) - Application containerization

## Prerequisites

- Node.js 20.9.0+
- npm 10.1.0+

## Development

### Install Dependencies

```bash
npm ci
```

### Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or next available port)

## Production

### Build and Start Production Server

```bash
npm ci
npm run build
npm run start
```

The production build will be available at `http://localhost:3000`

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up --build

# Or build Docker image manually
docker build -t dvizhenie-life-frontend .
docker run -p 8080:80 dvizhenie-life-frontend
```

The application will be available at `http://localhost:8080`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run typecheck` - Type checking
- `npm run lint` / `npm run lint:fix` - ESLint
- `npm run stylelint` / `npm run stylelint:fix` - Stylelint
- `npm run format` / `npm run format:fix` - Prettier
- `npm run test` / `npm run test:watch` / `npm run test:coverage` - Testing

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── ApplicationForm.tsx
│   ├── ApplicationList.tsx
│   ├── BotScenario.tsx
│   ├── LoginForm.tsx
│   ├── NavigationHeader.tsx
│   └── UserList.tsx
├── layout/             # Layout components
│   ├── Layout.tsx     # Main layout with navigation
│   └── LoginLayout.tsx # Login page layout
├── pages/              # Page components
│   ├── AdminPage.tsx
│   ├── ApplicationPage.tsx
│   ├── ApplicationsPage.tsx
│   ├── LoginPage.tsx
│   ├── NotFoundPage.tsx
│   └── ServerErrorPage.tsx
├── routes/             # Routing configuration
│   └── AppRoutes.tsx
├── lib/                # Utility functions
│   └── utils.ts
└── index.css          # Global styles and Tailwind CSS
```

## Features

### Authentication

- Login page with form validation
- Protected routes with layout management

### Application Management

- **Applications List**: View all applications with search and filtering
- **Application Details**: View and edit individual applications
- **Status Management**: Track application status (completed, in progress, pending)

### Admin Panel

- **User Management**: Manage system users
- **Bot Scenario**: Configure bot messaging

### UI/UX Features

- **Responsive Design**: Mobile-first approach
- **Modern Typography**: Inter font family
- **Consistent Styling**: shadcn/ui components with Tailwind CSS
- **Accessibility**: ARIA-compliant components
- **Dark/Light Theme**: CSS variables for theme switching

## UI Components

This project uses [shadcn/ui](https://ui.shadcn.com/) components built on top of:

- **Radix UI** - Low-level UI primitives
- **Tailwind CSS** - Utility-first CSS framework
- **Class Variance Authority** - Component variant management
- **Lucide React** - Icon library

### Available Components

- **Form Components**: Button, Input, Label, Textarea
- **Layout Components**: Card, Table, Badge
- **Navigation Components**: NavigationHeader
- **Error Components**: Error handling components

### Design System

- **Color Palette**: Black and gray theme with CSS variables
- **Typography**: Inter font with improved readability
- **Spacing**: Consistent spacing using Tailwind utilities
- **Components**: Unified styling across all components

## Code Quality

### Linting & Formatting

- **ESLint**: JavaScript/TypeScript linting with React rules
- **Stylelint**: CSS linting with Tailwind CSS support
- **Prettier**: Code formatting
- **TypeScript**: Strict type checking

### Testing

- **Vitest**: Fast unit testing
- **React Testing Library**: Component testing
- **Coverage**: Test coverage reporting

## Commit Standards

This project uses [Conventional Commits](https://www.conventionalcommits.org/). Examples:

- `feat: add user authentication`
- `fix: resolve navigation issue`
- `docs: update README`
- `style: update color scheme`
- `refactor: migrate to shadcn/ui`

## CI/CD

GitHub Actions automatically runs on every pull request:

- Linting (ESLint, Stylelint, Prettier)
- Type checking
- Testing
- Build verification

## Deployment

The application is deployed using Docker containers with Nginx as the web server.

## Recent Updates

- ✅ Migrated from Ant Design to shadcn/ui
- ✅ Implemented modern black/gray color scheme
- ✅ Added Inter font for improved typography
- ✅ Enhanced form components with consistent styling
- ✅ Improved navigation with better UX
- ✅ Added comprehensive linting and formatting
- ✅ Optimized component structure and performance
