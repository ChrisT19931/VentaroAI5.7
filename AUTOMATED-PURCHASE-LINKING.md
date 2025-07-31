# Automated Purchase Linking System

## Overview

This system automatically links purchases to user accounts based on **registered email addresses** rather than payment emails. This ensures that purchases are properly associated with user accounts even when customers use different emails for payment.

## Key Features

### 🔄 Automatic Linking
- **Priority**: Registered user email takes precedence over payment email
- **Smart Matching**: Finds existing users by payment email and links to their registered email
- **Retroactive Linking**: Automatically links existing unlinked purchases when a user is found
- **Dual Email Tracking**: Stores both registered email and original payment email

### 📧 Email Handling
- `customer_email`: The registered user's email (used for account linking)
- `payment_email`: The original email used in Stripe payment (for tracking)

## How It Works

### Webhook Processing Flow

1. **Stripe Webhook Receives Payment**
   ```
   Payment Email: christroiano1993@gmail.com
   ```

2. **User Lookup Process**
   ```
   Step 1: Look for user with payment email
   Step 2: If found, use their registered email
   Step 3: If session has user_id, get registered email from that user
   ```

3. **Purchase Record Creation**
   ```javascript
   {
     user_id: "5383d4eb-8971-41d5-80ca-1798bd23ab7b",
     customer_email: "christrabbit11@outlook.com", // Registered email
     payment_email: "christroiano1993@gmail.com",   // Payment email
     product_name: "AI Tools Mastery Guide 2025",
     // ... other fields
   }
   ```

4. **Auto-Link Existing Purchases**
   - Searches for unlinked purchases with either email
   - Links them to the registered user account
   - Updates customer_email to registered email

## Database Schema

### Purchases Table
```sql
CREATE TABLE public.purchases (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    customer_email TEXT NOT NULL,     -- Registered user email
    payment_email TEXT,               -- Original payment email
    product_id TEXT NOT NULL,
    product_name TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    session_id TEXT,
    download_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Migration Required
Run the migration script to add the `payment_email` column:
```bash
# In Supabase Dashboard → SQL Editor
# Run: add-payment-email-column.sql
```

## Implementation Details

### Enhanced Webhook Handler

The `handleCheckoutSessionCompleted` function now:

1. **Finds Registered User**
   ```javascript
   // Try to find user by payment email
   const { data: existingUser } = await supabase.auth.admin.getUserByEmail(paymentEmail);
   
   // Or use session metadata user_id
   if (session.metadata?.user_id) {
     const { data: sessionUser } = await supabase.auth.admin.getUser(session.metadata.user_id);
   }
   ```

2. **Creates Linked Purchase**
   ```javascript
   const purchaseData = {
     user_id: foundUser.id,
     customer_email: foundUser.email,  // Registered email
     payment_email: paymentEmail,      // Original payment email
     // ... other fields
   };
   ```

3. **Auto-Links Existing Purchases**
   ```javascript
   await linkExistingPurchasesToUser(foundUser.id, foundUser.email, paymentEmail);
   ```

### Helper Function: linkExistingPurchasesToUser

```javascript
async function linkExistingPurchasesToUser(userId, registeredEmail, paymentEmail) {
  // Find unlinked purchases with either email
  const { data: unlinkPurchases } = await supabase
    .from('purchases')
    .select('*')
    .is('user_id', null)
    .or(`customer_email.eq.${registeredEmail},customer_email.eq.${paymentEmail}`);
  
  // Link them to the user
  await supabase
    .from('purchases')
    .update({ 
      user_id: userId,
      customer_email: registeredEmail,
      payment_email: paymentEmail
    })
    .is('user_id', null)
    .or(`customer_email.eq.${registeredEmail},customer_email.eq.${paymentEmail}`);
}
```

## Benefits

### ✅ For Users
- **Seamless Experience**: Purchases automatically appear in their account
- **Email Flexibility**: Can use any email for payment
- **No Manual Linking**: No need to contact support for missing purchases

### ✅ For Administrators
- **Reduced Support**: Fewer "missing purchase" tickets
- **Better Analytics**: Accurate user-purchase relationships
- **Audit Trail**: Both emails tracked for transparency

### ✅ For Developers
- **Backward Compatible**: Existing data remains intact
- **Robust Logic**: Handles edge cases and multiple scenarios
- **Comprehensive Logging**: Detailed console output for debugging

## Testing

Use the test script to verify functionality:
```bash
node test-auto-purchase-linking.js
```

This script will:
- Show current database state
- List registered users
- Test auto-linking logic
- Verify API accessibility
- Provide comprehensive summary

## Monitoring

The webhook now provides detailed logging:
```
🔄 Checking for existing unlinked purchases to link to user...
📦 Found 2 unlinked purchase(s) to link
✅ Successfully linked 2 existing purchase(s) to user
   - AI Prompts Arsenal 2025 (christroiano1993@gmail.com)
   - AI Tools Mastery Guide 2025 (christroiano1993@gmail.com)
```

## Edge Cases Handled

1. **No Registered User**: Purchase remains unlinked until user registers
2. **Multiple Emails**: Uses registered email for linking, tracks payment email
3. **Existing Purchases**: Automatically links when user is found
4. **Session Metadata**: Respects user_id from Stripe session
5. **Email Conflicts**: Prioritizes registered user email

## Security Considerations

- Uses Supabase service role for admin operations
- Maintains RLS policies for user data access
- Validates user existence before linking
- Logs all operations for audit trail

## Future Enhancements

- **Email Verification**: Verify payment email ownership
- **Conflict Resolution**: Handle multiple users with same payment email
- **Batch Processing**: Link purchases in batches for performance
- **Notification System**: Notify users when purchases are auto-linked