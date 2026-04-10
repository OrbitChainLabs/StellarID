# StellarID API Specification

## Base URL

- **Development**: `http://localhost:3001/api`
- **Testnet**: `https://api-testnet.stellarid.io`
- **Mainnet**: `https://api.stellarid.io`

## Authentication

All endpoints require authentication via JWT token obtained during login.

### Login with Wallet

```
POST /auth/login
Content-Type: application/json

{
  "walletAddress": "GXXXXXX...",
  "signature": "signature_hex_string",
  "challenge": "challenge_string"
}

Response:
{
  "accessToken": "jwt_token",
  "refreshToken": "refresh_token",
  "user": {
    "id": "uuid",
    "walletAddress": "GXXXXXX...",
    "did": "did:stellar:GXXXXXX..."
  }
}
```

## Core API Endpoints

### Identity Management

#### GET /identity
Get authenticated user's identity

```
GET /identity
Authorization: Bearer {accessToken}

Response:
{
  "id": "uuid",
  "did": "did:stellar:GXXXXXX...",
  "walletAddress": "GXXXXXX...",
  "createdAt": "2024-01-01T00:00:00Z",
  "verifiers": ["did:stellar:YYYYYY..."],
  "credentials": []
}
```

#### PUT /identity
Update identity metadata

```
PUT /identity
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "metadata": {
    "name": "John Doe",
    "email": "john@example.com"
  }
}

Response:
{
  "id": "uuid",
  "did": "did:stellar:GXXXXXX...",
  "metadata": {...}
}
```

### Credential Management

#### POST /credentials/issue
Issue a credential

```
POST /credentials/issue
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "holder": "did:stellar:HHHH...",
  "credentialType": "ProofOfMembership",
  "claims": {
    "memberSince": "2024-01-01",
    "role": "member"
  }
}

Response:
{
  "id": "uuid",
  "holder": "did:stellar:HHHH...",
  "issuer": "did:stellar:GXXXXXX...",
  "credentialType": "ProofOfMembership",
  "claims": {...},
  "issuedAt": "2024-01-01T00:00:00Z",
  "expiresAt": "2025-01-01T00:00:00Z"
}
```

#### GET /credentials
List credentials for authenticated user

```
GET /credentials
Authorization: Bearer {accessToken}

Response:
[
  {
    "id": "uuid",
    "issuer": "did:stellar:IIII...",
    "credentialType": "ProofOfMembership",
    "issuedAt": "2024-01-01T00:00:00Z",
    "expiresAt": "2025-01-01T00:00:00Z",
    "status": "valid"
  }
]
```

#### GET /credentials/:id
Get credential details

```
GET /credentials/{credentialId}
Authorization: Bearer {accessToken}

Response:
{
  "id": "uuid",
  "issuer": "did:stellar:IIII...",
  "holder": "did:stellar:HHHH...",
  "credentialType": "ProofOfMembership",
  "claims": {...},
  "issuedAt": "2024-01-01T00:00:00Z",
  "expiresAt": "2025-01-01T00:00:00Z",
  "status": "valid",
  "proof": {...}
}
```

#### POST /credentials/:id/revoke
Revoke a credential (issuer only)

```
POST /credentials/{credentialId}/revoke
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "reason": "Requested by holder"
}

Response:
{
  "id": "uuid",
  "status": "revoked",
  "revokedAt": "2024-01-02T00:00:00Z"
}
```

### Verification

#### POST /verify
Verify a credential presentation

```
POST /verify
Content-Type: application/json

{
  "presentation": {
    "credentialId": "uuid",
    "signature": "signature_hex"
  }
}

Response:
{
  "valid": true,
  "credential": {...},
  "verifiedAt": "2024-01-02T00:00:00Z",
  "issuer": "did:stellar:IIII..."
}
```

#### POST /verify/batch
Verify multiple credentials

```
POST /verify/batch
Content-Type: application/json

{
  "presentations": [
    {
      "credentialId": "uuid1",
      "signature": "signature_hex1"
    },
    {
      "credentialId": "uuid2",
      "signature": "signature_hex2"
    }
  ]
}

Response:
[
  {
    "credentialId": "uuid1",
    "valid": true,
    "verifiedAt": "2024-01-02T00:00:00Z"
  },
  {
    "credentialId": "uuid2",
    "valid": true,
    "verifiedAt": "2024-01-02T00:00:00Z"
  }
]
```

## Error Responses

All errors follow standard HTTP status codes with JSON error messages:

```json
{
  "statusCode": 400,
  "message": "Invalid credential",
  "error": "BadRequest"
}
```

Common status codes:
- `200`: Success
- `201`: Created
- `204`: No Content
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `409`: Conflict
- `500`: Internal Server Error

## Rate Limiting

- **Default**: 100 requests per minute
- **Auth Endpoints**: 5 requests per minute
- Headers in response:
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`
  - `X-RateLimit-Reset`
