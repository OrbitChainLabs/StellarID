# StellarID Identity Model

## Decentralized Identifier (DID)

StellarID uses DID (Decentralized Identifier) as specified by the W3C DID Core specification, with Stellar as the method.

### DID Format

```
did:stellar:GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

- **Scheme**: `did`
- **Method**: `stellar`
- **Method-specific identifier**: Stellar public key (56 characters)

### DID Document

A DID document contains:
- **@context**: JSON-LD context references
- **id**: The DID itself
- **publicKey**: Array of cryptographic public keys
- **authentication**: Methods for authenticating as the DID subject
- **assertionMethod**: Methods for asserting statements

Example DID Document:
```json
{
  "@context": "https://www.w3.org/ns/did/v1",
  "id": "did:stellar:GXXXXXX...",
  "publicKey": [
    {
      "id": "did:stellar:GXXXXXX...#key1",
      "type": "Ed25519VerificationKey2020",
      "publicKeyBase58": "..."
    }
  ],
  "authentication": [
    "did:stellar:GXXXXXX...#key1"
  ],
  "assertionMethod": [
    "did:stellar:GXXXXXX...#key1"
  ]
}
```

## User Identity

A User entity contains:
- **id**: UUID primary key
- **did**: Associated DID
- **walletAddress**: Stellar public key (G-address)
- **email**: Optional contact email
- **metadata**: Custom JSON metadata
- **createdAt**: Account creation timestamp
- **updatedAt**: Last update timestamp
- **status**: Active/Inactive/Suspended

## Credential Model

### Credential Structure

Following W3C Verifiable Credentials standard:

```json
{
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://www.w3.org/2018/credentials/examples/v1"
  ],
  "type": [
    "VerifiableCredential",
    "ProofOfMembership"
  ],
  "issuer": "did:stellar:IIII...",
  "holder": "did:stellar:HHHH...",
  "issuanceDate": "2024-01-01T00:00:00Z",
  "expirationDate": "2025-01-01T00:00:00Z",
  "credentialSubject": {
    "id": "did:stellar:HHHH...",
    "memberSince": "2024-01-01",
    "role": "member",
    "organizationName": "OrgName"
  },
  "proof": {
    "type": "Ed25519Signature2020",
    "created": "2024-01-01T00:00:00Z",
    "verificationMethod": "did:stellar:IIII...#key1",
    "signatureValue": "..."
  }
}
```

### Credential Types

#### ProofOfMembership
- **Issuer**: Organization or membership body
- **Claims**: memberSince, role, organizationName
- **Typical Lifespan**: 1 year

#### ProofOfAttestation
- **Issuer**: Verifier authority
- **Claims**: attestationType, attestedFacts
- **Typical Lifespan**: 2 years

#### EducationCredential
- **Issuer**: Educational institution
- **Claims**: degree, field, graduationDate
- **Typical Lifespan**: Lifetime

#### ProfessionalCertification
- **Issuer**: Certification body
- **Claims**: certificationName, issuingBody, expiryDate
- **Typical Lifespan**: 2-5 years

### Credential Status

- **pending**: Not yet issued
- **valid**: Currently active
- **revoked**: Revoked by issuer or holder
- **expired**: Past expiration date

## Credential Schema

A CredentialSchema defines the structure and validation rules:

```json
{
  "id": "did:stellar:schema:ProofOfMembership",
  "type": "JsonSchema",
  "jsonSchema": {
    "type": "object",
    "properties": {
      "memberSince": {
        "type": "string",
        "format": "date"
      },
      "role": {
        "type": "string",
        "enum": ["member", "admin", "moderator"]
      },
      "organizationName": {
        "type": "string"
      }
    },
    "required": ["memberSince", "role", "organizationName"]
  }
}
```

## Key Rotation

When a user rotates their Stellar key:

1. New public key added to DID document
2. New key marked as primary
3. Old key marked as deprecated
4. Credentials remain valid if signed by active keys
5. Historical verification records maintained

## Privacy Considerations

### Zero-Knowledge Proofs

For enhanced privacy, credentials can be selectively disclosed:
- **Holder** can present specific claims without revealing entire credential
- **Prover** uses zero-knowledge proofs for sensitive facts
- **Verifier** can confirm facts without learning unnecessary details

### Credential Presentation

A presentation bundles credentials for verification:

```json
{
  "@context": "https://www.w3.org/2018/credentials/v1",
  "type": "VerifiablePresentation",
  "verificationMethod": "did:stellar:HHHH...#key1",
  "verifiableCredential": [
    {...credential...}
  ],
  "proof": {
    "type": "Ed25519Signature2020",
    "challenge": "challenge_value",
    "domain": "example.com",
    "signatureValue": "..."
  }
}
```

## Verification Process

1. **Credential Validation**
   - Check issuer DID exists
   - Verify issuer signature
   - Validate against schema
   - Check expiration and revocation

2. **Holder Verification**
   - Verify holder DID
   - Check holder signature on presentation
   - Verify presentation timestamp

3. **On-Chain Verification**
   - Query Stellar ledger for credential registry
   - Confirm credential metadata
   - Check revocation on-chain

## Security Best Practices

1. **Key Management**
   - Use hardware wallet for high-value credentials
   - Rotate keys regularly
   - Maintain key revocation records

2. **Credential Handling**
   - Verify issuer before accepting credential
   - Check expiration dates
   - Validate signatures

3. **Presentation**
   - Use short-lived challenges
   - Include domain in presentations
   - Sign with holder's key
