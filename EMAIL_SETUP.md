# Email Setup Guide for Contact Form

## Overview

The contact form now sends emails to the business owner using Resend API instead of storing messages in a database.

## Setup Instructions

### 1. Get Resend API Key

1. Go to [https://resend.com](https://resend.com)
2. Sign up for a free account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the API key

### 2. Add API Key to Environment Variables

Add the following to your `.env.local` file:

```bash
RESEND_API_KEY=re_your_api_key_here
```

### 3. Configure Email Settings

#### Update Sender Email (Optional)

In `app/api/contact/route.ts`, line 83, you can change:

```typescript
await sendEmail("onboarding@resend.dev", emailHtml);
```

To use your verified domain:

```typescript
await sendEmail("contact@yourdomain.com", emailHtml);
```

**Note**: For production, you need to verify your domain in Resend.

#### Update Recipient Email

In `lib/resend.ts`, line 8, change the recipient email:

```typescript
to: "officialfd2@gmail.com",  // Change this to your business email
```

### 4. Test the Contact Form

1. Start your development server: `npm run dev`
2. Navigate to `/contact`
3. Fill out the form
4. Submit and check your email inbox

## Email Template Features

- Professional HTML design
- Shows customer name, contact info, and message
- Responsive layout
- Easy to read format

## Free Tier Limits (Resend)

- 100 emails per day
- 3,000 emails per month
- Perfect for getting started

## Troubleshooting

### Email Not Sending?

1. Check if `RESEND_API_KEY` is set correctly
2. Check console for error messages
3. Verify the API key is active in Resend dashboard
4. Make sure you're not exceeding free tier limits

### Email Going to Spam?

- Verify your domain in Resend (for production)
- Add SPF and DKIM records to your domain
- Use a professional sender email address

## Production Recommendations

1. Verify your domain in Resend
2. Use your business email as sender (e.g., `no-reply@yourdomain.com`)
3. Set up proper SPF/DKIM/DMARC records
4. Consider upgrading Resend plan for higher limits
5. Add rate limiting to prevent spam

## Support

For issues with Resend, visit: https://resend.com/docs
