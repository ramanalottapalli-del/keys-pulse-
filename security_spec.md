# KeysPulse Security Specification (Phase 0 TDD)

## 1. Data Invariants

- **User Profiles (`/users/{userId}`)**:
  - `id` must exactly match the authenticated `request.auth.uid`.
  - `email` must match the authenticated user's email, and we must require verified emails if possible (`request.auth.token.email_verified == true`).
  - `createdAt` must be the actual server timestamp (`request.time`) on creation and is immutable.
  - `updatedAt` must be the actual server timestamp on update.
  
- **Test Sessions (`/sessions/{sessionId}`)**:
  - `userId` must exactly match the authenticated `request.auth.uid`.
  - `totalKeys` must be a positive integer <= 150.
  - `testedKeysCount` must be an integer <= `totalKeys` and >= 0.
  - `percentage` must be a valid percentage (0-100) exactly matching `round(testedKeysCount * 100 / totalKeys)`.
  - `wpm` (if provided) must be a positive number.
  - `accuracy` (if provided) must be between 0 and 100.
  - `createdAt` must be the server timestamp (`request.time`) on creation and is immutable.
  - Sessions are immutable once created (users cannot update sessions; they can only read them, create them, or delete their own sessions).

---

## 2. The "Dirty Dozen" (12 Vulnerability/Attacker Payloads)

### Payload 1: Unauthorized Profile Hijack (Identity)
- **Path**: `/users/legit_user_123`
- **Attempt**: Attacker (UID: `hacker_456`) attempts to write/overwrite `legit_user_123` profile.
- **Expected Outcome**: `PERMISSION_DENIED` (IDs must match UID).

### Payload 2: Spoofed Email Domain / Unverified Admin Claim (Identity)
- **Path**: `/users/hacker_456`
- **Attempt**: Create profile with unverified email pretending to be admin or a verified account (`email_verified` is false).
- **Expected Outcome**: `PERMISSION_DENIED` (Verified email required for standard profiles, or strict email match).

### Payload 3: Spoofed Creator UID on Session (Identity)
- **Path**: `/sessions/session_xyz`
- **Attempt**: User `hacker_456` creates a session with `userId: "legit_user_123"`.
- **Expected Outcome**: `PERMISSION_DENIED` (session.userId must match requesting auth.uid).

### Payload 4: Invalid Relational Owner Update (Identity)
- **Path**: `/sessions/session_xyz`
- **Attempt**: User `hacker_456` tries to read or delete a session owned by `legit_user_123`.
- **Expected Outcome**: `PERMISSION_DENIED`.

### Payload 5: Orphan Profile Creation (Integrity)
- **Path**: `/sessions/session_xyz`
- **Attempt**: Create a session where `userId` is a completely non-existent user UID (without verifying active user).
- **Expected Outcome**: `PERMISSION_DENIED`.

### Payload 6: Key Roller Overflow (Denial of Wallet / Resource Poisoning)
- **Path**: `/sessions/session_overflow`
- **Attempt**: Attacker creates a session where `totalKeys` is set to `999999` or negative.
- **Expected Outcome**: `PERMISSION_DENIED` (size/range validation checks fail).

### Payload 7: Immutability Violation - CreatedAt Backdating (Integrity)
- **Path**: `/sessions/session_xyz`
- **Attempt**: Attacker attempts to update an existing session or set a client-side backdated `createdAt` timestamp (e.g., `2010-01-01`).
- **Expected Outcome**: `PERMISSION_DENIED` (`createdAt` must be `request.time`).

### Payload 8: Session Update Attempt (State Lock)
- **Path**: `/sessions/session_xyz`
- **Attempt**: Attacker attempts to update a finished test session to falsify their typing speed `wpm` or `accuracy`.
- **Expected Outcome**: `PERMISSION_DENIED` (no updates allowed on finished sessions).

### Payload 9: Value Poisoning (Type Safety)
- **Path**: `/sessions/session_xyz`
- **Attempt**: Send `layout` as `12345` (integer) or a 1MB string instead of a valid string layout.
- **Expected Outcome**: `PERMISSION_DENIED`.

### Payload 10: Anonymous Read Scraping (PII / Query Trust)
- **Path**: `/users/legit_user_123`
- **Attempt**: Anonymous / unauthenticated attacker queries all user profile documents or attempts to read emails.
- **Expected Outcome**: `PERMISSION_DENIED`.

### Payload 11: Bulk Session Listing without Filter (Query Trust)
- **Path**: `/sessions`
- **Attempt**: User requests `getDocs(collection(db, 'sessions'))` to fetch all user sessions in the database without filtering by `userId == auth.uid`.
- **Expected Outcome**: `PERMISSION_DENIED` (Rule enforces list query safety by checking resource data).

### Payload 12: Injection String in Document ID (ID Poisoning Guard)
- **Path**: `/sessions/junk_char_$%^&*()_injection`
- **Attempt**: Create session with highly nested or junk-character document ID of length 2048.
- **Expected Outcome**: `PERMISSION_DENIED` (`isValidId` fails regex or size checks).

---

## 3. Test Runner Draft (`firestore.rules.test.ts`)

```typescript
import { assertFails, assertSucceeds, initializeTestEnvironment } from '@firebase/rules-unit-testing';

// Verification suite:
// Run all 12 Dirty Dozen payloads against the local emulator rules to guarantee they fail.
// Verifies that legitimate requests by authenticated and email-verified users succeed.
```
