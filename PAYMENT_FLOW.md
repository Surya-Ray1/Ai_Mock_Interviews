# Payment and Free Tier Flow

## Overview
The AI Mock Interview system has a free tier with limitations and paid Pro access. Users can upgrade via Razorpay payment or use admin-provided invite codes.

## Free Tier Limits

**Configuration (backend/.env):**
```env
FREE_MAX_USER_TURNS=5      # Maximum number of user responses
FREE_MAX_SECONDS=60        # Maximum interview duration in seconds
```

**What happens when limits are reached:**
1. User tries to continue interview after 5 turns OR 60 seconds
2. Backend returns `402 Payment Required` status
3. Frontend shows unlock modal with invite code redemption option
4. Interview is paused until user upgrades

## Payment Options

### Option 1: Razorpay Payment

**Setup Requirements:**
1. Razorpay account configured in `backend/.env`:
   ```env
   RAZORPAY_KEY_ID=rzp_test_RMbVobuGrgxMCp
   RAZORPAY_KEY_SECRET=41Rfq9qtTyaQLZvZEPaBbyLb
   PRO_PRICE_PAISE=29900  # ₹299
   ```

2. Enable payments in `frontend/.env`:
   ```env
   VITE_ENABLE_PAYMENTS=true
   ```

**User Flow:**
1. User clicks "Upgrade to PRO" on Interview Setup page
2. Razorpay checkout modal opens (₹299 + convenience fee)
3. User completes payment
4. Backend verifies payment signature
5. User's `plan` column updated to `'pro'`
6. User can now do unlimited interviews

**Implementation:**
- **Frontend:** `frontend/src/pages/InterviewSetup.jsx` - `upgradeToPro()` function
- **Backend:** `backend/app/Http/Controllers/PaymentController.php`
  - `createOrder()` - creates Razorpay order
  - `verify()` - verifies payment signature and updates user plan

### Option 2: Invite Code Redemption

**For Users:**
1. When free limit is reached during interview, modal appears
2. User enters invite code provided by admin
3. Code is validated and user upgraded to Pro
4. Interview continues without interruption

**For Admins:**
To create invite codes, use the admin API:

```bash
curl -X POST http://127.0.0.1:8000/api/access/create \
  -H "X-Admin-Key: super-secret-admin-key" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "WELCOME2025",
    "max_uses": 100,
    "expires_at": "2025-12-31"
  }'
```

**Admin Key Configuration:**
Set in `backend/.env`:
```env
ADMIN_KEY=super-secret-admin-key
```

**Implementation:**
- **Frontend:** `frontend/src/pages/InterviewRoom.jsx` - Unlock modal with redeem form
- **Backend:** `backend/app/Http/Controllers/AccessController.php`
  - `redeem()` - validates and applies invite code
  - `create()` - admin endpoint to create new codes
- **Database:** `backend/app/Models/InviteCode.php` - tracks code usage

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id BIGINT PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  password VARCHAR(255),
  plan VARCHAR(255) DEFAULT 'free',  -- 'free' or 'pro'
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### Invite Codes Table
```sql
CREATE TABLE invite_codes (
  id BIGINT PRIMARY KEY,
  code VARCHAR(255) UNIQUE,
  max_uses INT DEFAULT 1,
  used INT DEFAULT 0,
  expires_at TIMESTAMP NULL,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### Payments Table
```sql
CREATE TABLE payments (
  id BIGINT PRIMARY KEY,
  user_id BIGINT,
  razorpay_order_id VARCHAR(255),
  razorpay_payment_id VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pending',  -- 'pending', 'success', 'failed'
  amount_paise INT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

## Testing the Flow

### Test Free Tier Limits:
1. Register a new account
2. Start an interview
3. Answer 5 questions OR wait 60 seconds
4. Verify that unlock modal appears
5. Try entering an invalid code - should show error

### Test Invite Code:
1. Create an invite code using admin API (see above)
2. Start interview and hit free limit
3. Enter the invite code in modal
4. Verify user upgraded to Pro
5. Check database: `users.plan` should be `'pro'`

### Test Razorpay Payment:
1. Enable payments in frontend/.env: `VITE_ENABLE_PAYMENTS=true`
2. Go to Interview Setup page
3. Click "Upgrade to PRO"
4. Use Razorpay test card: `4111 1111 1111 1111`
5. Complete payment
6. Verify success message and Pro access granted

## How Backend Checks Limits

**Location:** `backend/app/Http/Controllers/AiController.php`

The `checkFreeCaps()` method:
1. Checks if user has `plan = 'pro'` - if yes, no limits
2. For free users, counts:
   - Total user turns in current interview
   - Elapsed time since first transcript
3. Returns `402 Payment Required` if either limit exceeded

**Frontend Handling:**
- `frontend/src/pages/InterviewRoom.jsx` catches 402 error
- Sets `errStatus = 402` and `showUnlock = true`
- Displays modal with invite code input

## Important Notes

1. **Security:** Never commit actual Razorpay keys to GitHub. Use environment variables.
2. **Admin Key:** Keep `ADMIN_KEY` secret. Share only with trusted admins.
3. **Testing:** Use Razorpay test mode keys for development.
4. **Convenience Fee:** 3% or minimum ₹5 added to payment amount.
5. **Invite Codes:** Can be single-use or multi-use. Set `max_uses` accordingly.

## API Endpoints

### Payment Endpoints (Protected - requires auth)
- `POST /api/payments/create` - Create Razorpay order
- `POST /api/payments/verify` - Verify payment and upgrade user

### Access/Invite Code Endpoints
- `POST /api/access/redeem` - Redeem invite code (requires auth)
- `POST /api/access/create` - Create invite code (requires X-Admin-Key header)

### Interview Endpoints
- `POST /api/ai/ask` - Ask AI question (enforces free tier limits, returns 402 if exceeded)

## Troubleshooting

**Payment not working:**
- Verify Razorpay keys in backend/.env
- Check VITE_ENABLE_PAYMENTS=true in frontend/.env
- Restart frontend server after .env changes

**Invite code not working:**
- Check code exists in database: `SELECT * FROM invite_codes WHERE code='...'`
- Verify code not expired: `expires_at IS NULL OR expires_at > NOW()`
- Check usage: `used < max_uses`

**Free tier not enforced:**
- Verify user's `plan` column is 'free' in database
- Check FREE_MAX_USER_TURNS and FREE_MAX_SECONDS in backend/.env
- Look at backend logs for checkFreeCaps() results

## Future Enhancements

1. **Subscription Plans:** Monthly/yearly subscriptions instead of one-time payment
2. **Partial Limits:** Allow more turns for paid users (e.g., 50 turns/month)
3. **Usage Analytics:** Track interview counts, duration by plan type
4. **Referral Codes:** Users generate codes to invite friends
5. **Webhook Integration:** Razorpay webhooks for payment verification
