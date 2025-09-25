# Dvizhenie Life Admin Frontend

Manager admin panel for Dvizhenie Life project.

## Tech Stack

- **Build Tool**: [Vite](https://vitejs.dev/) - Fast build tool and dev server
- **Framework**: [React](https://react.dev/) - JavaScript library for building user interfaces
- **Language**: [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- **Routing**: [React Router](https://reactrouter.com/) - Client-side routing
- **UI Library**: [Ant Design](https://ant.design/) - Enterprise UI components
- **Icons**: [Ant Design Icons](https://ant.design/components/icon) - Icon library
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

The application will be available at `http://localhost:5173`

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

## Commit Standards

This project uses [Conventional Commits](https://www.conventionalcommits.org/). Examples:

- `feat: add user authentication`
- `fix: resolve navigation issue`
- `docs: update README`

## CI/CD

GitHub Actions automatically runs on every pull request:

- Linting (ESLint, Stylelint, Prettier)
- Type checking
- Testing
- Build verification

## Deployment

The application is deployed using Docker containers with Nginx as the web server.
