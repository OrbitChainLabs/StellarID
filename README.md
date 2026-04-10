# StellarID - Decentralized Identity on Stellar

A full-stack decentralized identity (DID) and credential verification platform built on the Stellar ecosystem.

## 🎯 Overview

StellarID enables users to:
- Create self-sovereign identities (DIDs)
- Receive and verify credentials
- Share proof of identity without exposing sensitive data
- Integrate with the Stellar blockchain

## 🏗️ Architecture

### Monorepo Structure

```
root/
├── apps/
│   ├── frontend/          # Next.js 14+ web application
│   ├── backend/           # NestJS REST API
│   └── contracts/         # Soroban smart contracts (Rust)
├── packages/
│   ├── ui/                # Shared React components
│   ├── config/            # Configuration schemas
│   ├── types/             # Shared TypeScript types
│   ├── utils/             # Utility functions
│   └── sdk/               # StellarID SDK for integrations
├── infra/
│   ├── docker/            # Docker configurations
│   ├── ci/                # GitHub Actions workflows
│   └── scripts/           # DevOps scripts
└── docs/                  # Project documentation
```

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 14+ (TypeScript, App Router) |
| **Backend** | NestJS (TypeScript) |
| **Smart Contracts** | Rust (Soroban) |
| **Database** | PostgreSQL (Neon preferred) |
| **Monorepo** | Turborepo |
| **Blockchain** | Stellar (Soroban) |
| **Wallet** | Freighter |

## 📋 Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0
- PostgreSQL 14+
- Rust (for contract development)
- Docker & Docker Compose (optional)

## 🚀 Quick Start

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Configure Environment

```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

### 3. Setup Database

```bash
pnpm db:migrate
pnpm db:seed  # Optional: seed with demo data
```

### 4. Start Development Server

```bash
pnpm dev
```

This starts all services in parallel:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Soroban RPC: testnet

## 📦 Packages

### Apps

- **frontend**: Next.js web application with dashboard, identity management, and credential verification
- **backend**: NestJS API with authentication, DID management, credential issuance
- **contracts**: Soroban smart contracts for DID and credential verification

### Shared Packages

- **ui**: Reusable React components (buttons, forms, modals)
- **config**: Configuration schemas and validators
- **types**: TypeScript type definitions
- **utils**: Helper functions (hashing, validation, conversion)
- **sdk**: StellarID SDK for third-party integration

## 🔐 Core Features

### Identity Management
- DID (Decentralized Identifier) creation and management
- Key recovery and rotation
- Identity verification

### Credentials
- Issuer and holder separation
- Verifiable credential issuance
- Credential presentation and verification
- Credential revocation

### Security
- Cryptographic signing with Freighter
- Privacy-preserving credential sharing
- Rate limiting and brute-force protection

## 📚 Documentation

- [Architecture Overview](./docs/architecture.md)
- [API Specification](./docs/api-spec.md)
- [Identity Model](./docs/identity-model.md)
- [Credential Flow](./docs/credential-flow.md)

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Watch mode
pnpm test:watch

# With coverage
pnpm test -- --coverage
```

## 🔨 Building

```bash
# Build all packages
pnpm build

# Build specific package
pnpm build --filter frontend
```

## 📊 Code Quality

```bash
# Lint all code
pnpm lint

# Format code
pnpm format

# Type check
pnpm type-check
```

## 🐳 Docker Support

```bash
# Build Docker image
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f
```

## 🚢 Deployment

### Testnet

```bash
pnpm build
./infra/scripts/deploy-testnet.sh
```

### Mainnet

```bash
# Note: Requires mainnet configuration
pnpm build
./infra/scripts/deploy-mainnet.sh
```

## 📖 Development Guidelines

### Code Style
- Use TypeScript for all new code
- Follow ESLint & Prettier configuration
- Use conventional commits

### Branching
- Feature branches: `feature/description`
- Bug fixes: `fix/description`
- Release branches: `release/x.y.z`

### Pull Requests
- Link to relevant issues
- Include tests for new features
- Update documentation if needed

## 🤝 Contributing

Please read our contributing guidelines before submitting PRs.

## 📝 License

MIT © 2024 OrbitChain Labs

## 📞 Support

- GitHub Issues: [Report bugs](https://github.com/OrbitChainLabs/StellarID/issues)
- Discussions: [Ask questions](https://github.com/OrbitChainLabs/StellarID/discussions)

---

**Built on Stellar | Powered by Soroban**