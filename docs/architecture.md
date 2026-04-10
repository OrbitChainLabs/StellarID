# StellarID Architecture

## Overview

StellarID is a decentralized identity platform built on the Stellar blockchain using Soroban smart contracts. The system enables users to create self-sovereign identities, request verifiable credentials, and prove membership without exposing sensitive personal data.

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Frontend (Next.js)                   │
│  - Dashboard                                              │
│  - Identity Management                                    │
│  - Credential Verification                                │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                 Backend API (NestJS)                      │
│  - Authentication & Authorization                         │
│  - DID Management                                          │
│  - Credential Issuance                                     │
│  - Verification Logic                                      │
└────────────────────┬────────────────────────────────────┘
                     │
      ┌──────────────┼──────────────┐
      │              │              │
      ▼              ▼              ▼
┌──────────┐  ┌──────────┐  ┌─────────────┐
│ Database │  │ Freighter│  │  Soroban    │
│PostgreSQL│  │  Wallet  │  │ Contracts   │
└──────────┘  └──────────┘  └─────────────┘
```

## Core Components

### 1. Frontend (Next.js + TypeScript)
- **Dashboard**: User interface for identity and credential management
- **Authentication**: Integration with Freighter wallet
- **Components**: Reusable React components from @stellarid/ui
- **State Management**: Zustand for client state
- **API Client**: Axios with interceptors for authentication

### 2. Backend API (NestJS + TypeScript)
- **Modules**: Organized by domain (auth, identity, credentials)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT-based with Freighter signature verification
- **Validation**: Class validators for input validation
- **Documentation**: OpenAPI/Swagger

### 3. Smart Contracts (Rust + Soroban)
- **DID Contract**: Manages decentralized identifiers
- **Credential Contract**: Handles credential issuance and verification
- **Stellar Integration**: Uses Stellar SDK for on-chain operations

### 4. Shared Packages
- **@stellarid/types**: Shared TypeScript types
- **@stellarid/utils**: Utility functions (crypto, validation)
- **@stellarid/config**: Configuration schemas
- **@stellarid/ui**: Reusable React components
- **@stellarid/sdk**: Third-party integration SDK

## Data Flow

### Identity Creation Flow
1. User connects Freighter wallet
2. Backend generates DID from public key
3. DID stored in database
4. Contract invoked to register DID on-chain

### Credential Issuance Flow
1. Issuer creates credential template
2. Holder requests credential
3. Issuer verifies and issues credential
4. Credential stored (user custody or database)
5. Contract records credential metadata

### Credential Verification Flow
1. Holder presents credential
2. Verifier checks credential signature
3. Smart contract verifies on-chain record
4. Verification result returned

## Database Schema

Key entities:
- **User**: Account with associated DID
- **DID**: Decentralized identifier entry
- **Credential**: Issued credentials
- **CredentialSchema**: Template definitions
- **VerificationLog**: Audit trail

## Security Considerations

1. **Key Management**: Private keys managed by Freighter wallet
2. **Signature Verification**: All messages signed and verified
3. **Smart Contract**: Formal verification recommended
4. **API Security**: Rate limiting, input validation, CORS
5. **Database**: Encrypted sensitive fields, audit logging

## Deployment Architecture

```
┌──────────────────────────────────────────┐
│  GitHub Actions (CI/CD)                  │
│  - Lint & Type Check                     │
│  - Unit Tests                            │
│  - Integration Tests                     │
│  - Build & Deploy                        │
└──────────────────────────────────────────┘
                    │
      ┌─────────────┼─────────────┐
      │             │             │
      ▼             ▼             ▼
┌──────────┐  ┌──────────┐  ┌──────────┐
│Testnet   │  │Staging   │  │Mainnet   │
│Deployment│  │Deployment│  │Deployment│
└──────────┘  └──────────┘  └──────────┘
```

## Technology Stack Summary

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend | Next.js | 14+ |
| Frontend | React | 18+ |
| Backend | NestJS | 10+ |
| Database | PostgreSQL | 14+ |
| ORM | Prisma | 5+ |
| Blockchain | Stellar | Testnet |
| Contracts | Soroban | Latest |
| Build System | Turborepo | 1.10+ |
| Package Manager | pnpm | 8+ |

## Development Environment

- Node.js 18+
- PostgreSQL 14+
- Docker & Docker Compose
- Rust (for contract development)
- Git with conventional commits
