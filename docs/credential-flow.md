# StellarID Credential Flow

## End-to-End Credential Lifecycle

### Phase 1: Credentialing Setup

#### 1.1 Issuer Registration
```
Issuer (Organization/Individual)
        │
        ├─ Creates account on StellarID
        ├─ Receives DID (did:stellar:IIII...)
        ├─ Defines credential schemas
        └─ Sets up issuer verification keys
```

**System Actions:**
- Backend validates issuer identity
- DID registered on Stellar smart contract
- Issuer profile stored in database
- Webhook configuration for credential requests

#### 1.2 Credential Schema Definition
```
Issuer Dashboard
        │
        ├─ Creates schema (e.g., ProofOfMembership)
        ├─ Defines claim properties
        ├─ Sets validation rules
        └─ Publishes schema
```

**Schema Example:**
```json
{
  "type": "ProofOfMembership",
  "issuer": "did:stellar:IIII...",
  "properties": {
    "memberSince": "Date",
    "role": "Enum(member, admin)",
    "organizationName": "String"
  }
}
```

### Phase 2: Credential Issuance

#### 2.1 Holder Request
```
Holder (User)
        │
        ├─ Logs into StellarID
        ├─ Searches for issuer
        ├─ Views credential schema
        └─ Clicks "Request Credential"
```

**Database Transaction:**
- CredentialRequest created with status="pending"
- Notification sent to issuer
- Request timestamp recorded

#### 2.2 Issuer Review & Approval
```
Issuer Dashboard
        │
        ├─ Receives credential request
        ├─ Verifies holder identity
        │  (name, organization, etc.)
        ├─ Reviews request
        └─ Approves or Denies
```

**System Validation:**
- Check holder's identity claims
- Verify against issuer database
- KYC/AML checks (if configured)
- Audit log recorded

#### 2.3 Credential Generation & Signing
```
Backend Service
        │
        ├─ Generates credential object
        │
        ├─ Populates credentialSubject:
        │  {
        │    "id": "did:stellar:HHHH...",
        │    "memberSince": "2024-01-01",
        │    "role": "member"
        │  }
        │
        ├─ Creates proof object
        │
        ├─ Signs with issuer's private key
        │  (via Freighter or backend key management)
        │
        └─ Returns complete credential
```

**Signature Process:**
```
Message = SHA256(credentialData)
Signature = Ed25519Sign(Message, IssuerPrivateKey)
```

#### 2.4 Issuer Commitment
```
Backend Service
        │
        ├─ Invokes Soroban smart contract
        ├─ Registers credential on-chain
        │  Parameters:
        │  - credential ID
        │  - issuer DID
        │  - holder DID
        │  - credential type
        │  - timestamp hash
        │
        ├─ Receives transaction receipt
        └─ Records on-chain reference
```

### Phase 3: Credential Delivery

#### 3.1 Notification & Receipt
```
Holder Notification
        │
        ├─ Email notification sent
        ├─ Dashboard shows new credential
        ├─ In-app notification displayed
        └─ Available for immediate download
```

#### 3.2 Credential Storage
```
Options:
├─ Wallet Backup (holder device)
├─ StellarID Account (backend)
└─ Hardware Wallet (optional)
```

**Database Storage:**
- Encrypted credential data
- Metadata (issuer, type, dates)
- Holder's storage preference
- Access logs

### Phase 4: Credential Presentation & Verification

#### 4.1 Holder Preparation
```
Holder Dashboard
        │
        ├─ Selects credential to share
        ├─ Chooses verification domain
        │  (e.g., "example.com")
        ├─ Specifies expiration time
        │  (short-lived challenge)
        └─ Generates presentation
```

**Presentation Creation:**
```json
{
  "type": "VerifiablePresentation",
  "verificationMethod": "did:stellar:HHHH...#key1",
  "challenge": "random_challenge_123",
  "domain": "verifier.example.com",
  "verifiableCredential": [
    {...full_credential...}
  ],
  "proof": {
    "type": "Ed25519Signature2020",
    "created": "2024-01-02T10:00:00Z",
    "signatureValue": "holder_signature_hex"
  }
}
```

#### 4.2 Transmission to Verifier
```
Holder → Verifier
        │
        ├─ QR Code (blockchain reference)
        ├─ Direct Share (JSON transmission)
        ├─ Email Link (secure token)
        └─ API Request (programmatic)
```

#### 4.3 Verifier Validation
```
Verifier System (Third-party Service)
        │
        ├─ Receives presentation
        │
        ├─ Step 1: Parse & Validate Structure
        │  - Check JSON format
        │  - Validate required fields
        │  - Verify schema compliance
        │
        ├─ Step 2: Verify Holder Signature
        │  - Extract holder's public key from DID
        │  - Verify presentation signature
        │  - Check challenge (prevent replay)
        │  - Validate domain
        │
        ├─ Step 3: Verify Credential Signature
        │  - Extract issuer's public key from DID
        │  - Verify credential signature
        │  - Validate issuer DID format
        │
        ├─ Step 4: Check Credential Status
        │  - Verify not expired
        │  - Check not revoked
        │  - Confirm still active
        │
        ├─ Step 5: On-Chain Verification
        │  - Query Stellar smart contract
        │  - Confirm credential registered
        │  - Verify on-chain metadata matches
        │
        └─ Step 6: Business Logic
           - Check additional requirements
           - Apply custom rules
           - Update access/permissions
```

**Verification Algorithm:**

```typescript
async function verifyPresentation(presentation) {
  // 1. Parse and validate structure
  const parsed = JSON.parse(presentation);
  validateSchema(parsed); // ✓
  
  // 2. Verify holder signature
  const holderKey = getPublicKey(parsed.verificationMethod);
  const isHolderValid = Ed25519Verify(
    parsed.proof.signatureValue,
    computeHash(parsed),
    holderKey
  ); // ✓
  
  // 3. Verify credential signature
  const credential = parsed.verifiableCredential[0];
  const issuerKey = getPublicKey(credential.proof.verificationMethod);
  const isIssuerValid = Ed25519Verify(
    credential.proof.signatureValue,
    computeHash(credential),
    issuerKey
  ); // ✓
  
  // 4. Check status
  const isNotExpired = new Date() < new Date(credential.expirationDate); // ✓
  const isNotRevoked = !isRevoked(credential.id); // ✓
  
  // 5. Query on-chain
  const onChainRecord = await queryContractRegistry(credential.id);
  const matchesOnChain = onChainRecord.issuer === credential.issuer; // ✓
  
  // Return result
  return {
    valid: isHolderValid && isIssuerValid && isNotExpired && 
           isNotRevoked && matchesOnChain,
    credential,
    verifiedAt: new Date(),
    issuer: credential.issuer
  };
}
```

#### 4.4 Verification Result
```
Verifier → Holder (Status Update)
        │
        ├─ ✓ Verified (Success)
        │   - Access granted
        │   - Verification logged
        │   - Holder notified
        │
        └─ ✗ Failed (Rejected)
            - Access denied
            - Reason provided
            - Holder notified
```

**Verification Log Entry:**
```json
{
  "id": "log_uuid",
  "credentialId": "cred_uuid",
  "holder": "did:stellar:HHHH...",
  "issuer": "did:stellar:IIII...",
  "verifier": "did:stellar:VVVV...",
  "status": "verified",
  "verifiedAt": "2024-01-02T10:05:00Z",
  "expiresAt": "2024-01-02T10:10:00Z",
  "metadata": {...}
}
```

### Phase 5: Credential Revocation

#### 5.1 Revocation Trigger
```
Issuer or Holder Initiates Revocation
        │
        ├─ Reason: "Membership ended"
        ├─ Reason: "Credential compromise"
        ├─ Reason: "User requested"
        └─ Reason: "Expired policy"
```

#### 5.2 Revocation Process
```
Backend Service
        │
        ├─ Update credential status to "revoked"
        │
        ├─ Invoke Soroban contract
        │  - Add credential ID to revocation list
        │  - Record revocation timestamp
        │  - Reason stored on-chain
        │
        ├─ Invalidate existing presentations
        │
        ├─ Notify all parties:
        │  - Issuers
        │  - Blockchain verifiers
        │  - Credential registry
        │
        └─ Return confirmation
```

#### 5.3 Post-Revocation
```
Future Verification Attempts
        │
        ├─ Verifier queries contract
        ├─ Contract returns "revoked" status
        ├─ Verification fails
        └─ Access denied
```

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│ ISSUER SIDE                                                  │
├─────────────────────────────────────────────────────────────┤
│ 1. Define Schema                                              │
│ 2. Receive Request                                            │
│ 3. Approve Request                                            │
│ 4. Backend generates & signs credential                       │
│ 5. Call Smart Contract to register                            │
│ 6. Send to holder                                             │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ Credential Created
                       │
┌──────────────────────▼──────────────────────────────────────┐
│ HOLDER SIDE                                                  │
├─────────────────────────────────────────────────────────────┤
│ 7. Receive Credential                                         │
│ 8. Store locally or on platform                              │
│ 9. Create Presentation (frontend)                             │
│ 10. Sign presentation with Freighter                         │
│ 11. Send to Verifier                                         │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ Presentation Submitted
                       │
┌──────────────────────▼──────────────────────────────────────┐
│ VERIFIER SIDE                                                │
├─────────────────────────────────────────────────────────────┤
│ 12. Receive Presentation                                      │
│ 13. Validate signatures (holder + issuer)                     │
│ 14. Check credential status (expiry, revocation)              │
│ 15. Query Stellar smart contract                             │
│ 16. Grant/Deny access                                         │
│ 17. Log verification event                                    │
└─────────────────────────────────────────────────────────────┘
```

## Security Checkpoints

| Step | Security Check | Failure Action |
|------|---|---|
| Credential Generation | Issuer authorization | Reject request |
| Signature Creation | Key accessibility | Require re-auth |
| On-Chain Registration | Contract validation | Rollback transaction |
| Holder Signature | Valid key & challenge | Reject presentation |
| Issuer Signature | Valid key & data integrity | Invalid credential |
| Status Check | Not revoked/expired | Deny access |
| On-Chain Verification | Registry match | Suspicious activity |

## Error Handling

```
Verification Failure Reasons:
├─ invalid_signature: Signature verification failed
├─ invalid_holder: Holder DID not recognized
├─ invalid_issuer: Issuer DID not trusted
├─ credential_expired: Credential past expiration
├─ credential_revoked: Credential in revocation list
├─ not_on_chain: No on-chain registry entry
├─ challenge_failed: Challenge validation failed
├─ domain_mismatch: Domain verification failed
└─ schema_invalid: Credential doesn't match schema
```
