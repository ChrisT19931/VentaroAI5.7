# Email Setup Guide - Fix Support Form Auto-Emails

This guide will help you configure email functionality so that support forms and contact forms send auto-emails properly.

## 🚨 Current Issue

The support form is not sending auto-emails because SendGrid is not properly configured. The system is working correctly, but email notifications are disabled due to missing configuration.

## 🔧 Quick Fix Steps

### Step 1: Get SendGrid API Key

1. Go to [SendGrid.com](https://sendgrid.com)
2. Sign up for a free account (100 emails/day free)
3. Navigate to Settings → API Keys
4. Create a new API key with "Full Access" permissions
5. Copy the API key (starts with `SG.`)

### Step 2: Verify Sender Email

1. In SendGrid dashboard, go to Settings → Sender Authentication
2. Click "Verify a Single Sender"
3. Add `chris.t@ventarosales.com` as a verified sender
4. Check the email inbox and click the verification link

### Step 3: Update Environment Variables

1. Open `.env.local` file in your project root
2. Replace the placeholder values:

```env
# Replace this line:
SENDGRID_API_KEY=SG.placeholder_api_key_replace_with_real_key

# With your real API key:
SENDGRID_API_KEY=SG.your_real_api_key_here
```

### Step 4: Test the Configuration

Run the test script to verify everything is working:

```bash
node test-support-form.js
```

## 📧 What's Fixed

The following improvements have been made to the email system:

### Support Form (`/api/support-request`)
- ✅ Better error handling for email failures
- ✅ Detailed logging when SendGrid is not configured
- ✅ Response includes email status information
- ✅ Graceful fallback when emails can't be sent

### Contact Form (`/api/contact`)
- ✅ Enhanced email status reporting
- ✅ Better user feedback about email delivery
- ✅ Consistent error handling

## 🔍 How to Verify It's Working

### Method 1: Check Console Logs
When you submit a support request, check the server console for:
- `✅ Admin notification email sent successfully`
- `✅ Client confirmation email sent successfully`

### Method 2: Use Test Script
```bash
node test-support-form.js
```

### Method 3: Check Email Inboxes
- Admin should receive notification at `chris.t@ventarosales.com`
- User should receive confirmation email

## 🚨 Troubleshooting

### Issue: "SendGrid not configured" message
**Solution:** Make sure your API key is set correctly in `.env.local`

### Issue: "Failed to send email" error
**Solutions:**
1. Verify your sender email in SendGrid dashboard
2. Check API key permissions (should be "Full Access")
3. Ensure you haven't exceeded SendGrid rate limits

### Issue: Emails go to spam
**Solutions:**
1. Set up domain authentication in SendGrid
2. Use a verified domain email address
3. Add SPF/DKIM records to your domain

## 📋 Environment Variables Reference

```env
# Required for email functionality
SENDGRID_API_KEY=SG.your_real_api_key_here
SENDGRID_FROM_EMAIL=chris.t@ventarosales.com
EMAIL_FROM=chris.t@ventarosales.com
```

## 🎯 Expected Behavior After Setup

1. **Support Form Submission:**
   - User fills out support form
   - Admin receives detailed notification email
   - User receives confirmation email
   - Form shows success message

2. **Contact Form Submission:**
   - User fills out contact form
   - Admin receives notification email
   - User receives auto-reply email
   - Form shows success message

## 📞 Need Help?

If you're still having issues:
1. Run `node test-support-form.js` and share the output
2. Check the server console logs when submitting forms
3. Verify your SendGrid account status and limits

---

**Note:** The forms will continue to work and save submissions even without email configuration. Email is an enhancement, not a requirement for basic functionality.