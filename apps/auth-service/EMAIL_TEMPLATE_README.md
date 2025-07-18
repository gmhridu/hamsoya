# Email Template Implementation

## Overview

This document describes the professional user activation email template implementation for the Hamsoya auth-service. The template is designed to be modern, responsive, and compatible with major email clients.

## Features

### Design Elements
- **Professional gradient backgrounds** using the specified color scheme:
  - Primary gradient: `linear-gradient(180deg, #FF6925 0%, #FFF 46.48%)` with `blur(50px)` filter
  - Secondary gradient: `linear-gradient(180deg, #4D5DE9 11.31%, rgba(255, 255, 255, 0.00) 46.48%)` with `blur(50px)` filter
  - Main background color: `#ECECEC`
- **Layer.jpg background image** with subtle opacity overlay
- **Responsive design** that works on mobile and desktop
- **Dark mode support** for compatible email clients
- **Accessibility features** with proper contrast and semantic HTML

### Email Client Compatibility
- **HTML version** with modern CSS and fallbacks
- **Plain text version** for maximum compatibility
- **Microsoft Outlook specific styles** using MSO properties
- **Fallback table layout** for older email clients

### Security Features
- **OTP code prominence** with gradient background and large, readable font
- **Expiration notice** clearly displayed (5 minutes)
- **Security warning** about unauthorized requests
- **Professional branding** with Hamsoya logo and colors

## File Structure

```
apps/auth-service/src/
├── utils/
│   ├── email-templates/
│   │   ├── user-activation-mail.ejs    # HTML email template
│   │   └── user-activation-mail.txt    # Plain text email template
│   └── sendMail/
│       └── index.ts                    # Email sending utility
├── public/
│   └── layer.jpg                       # Background image asset
└── test-email.ts                       # Email template test utility
```

## Template Variables

The email templates use the following EJS variables:

- `name` - User's name for personalization
- `otp` - 6-digit verification code
- `process.env.BASE_URL` - Base URL for serving static assets (defaults to http://localhost:5001)

## Usage

### Sending an OTP Email

```typescript
import { sendOtp } from './utils/auth.helper';

// Send activation email with OTP
await sendOtp('John Doe', 'user@example.com', 'user-activation-mail');
```

### Direct Email Sending

```typescript
import { sendEmail } from './utils/sendMail';

await sendEmail(
  'user@example.com',
  'Verify Your Email',
  'user-activation-mail',
  { name: 'John Doe', otp: '1234' }
);
```

## Configuration

### Environment Variables

Ensure the following environment variables are set:

```env
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_SERVICE=your-smtp-service
SMTP_USER=your-smtp-username
SMTP_PASSWORD=your-smtp-password
BASE_URL=https://your-domain.com  # Optional, defaults to localhost:5001
```

### Static Asset Serving

The auth-service automatically serves static files from the `src/public` directory. The `layer.jpg` image is accessible at:
- Development: `http://localhost:5001/layer.jpg`
- Production: `https://your-domain.com/layer.jpg`

## Testing

### Manual Testing

Run the test utility to verify email template functionality:

```bash
cd apps/auth-service
npx ts-node src/test-email.ts
```

### API Testing

Test the registration endpoint that triggers the email:

```bash
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "test@example.com",
    "password": "securepassword123"
  }'
```

## Customization

### Styling

To modify the email appearance, edit the CSS in `user-activation-mail.ejs`:
- Colors can be changed in the CSS variables section
- Layout modifications should maintain email client compatibility
- Test changes across different email clients

### Content

To modify the email content:
1. Update the HTML template in `user-activation-mail.ejs`
2. Update the corresponding plain text template in `user-activation-mail.txt`
3. Ensure both versions contain the same information

### Branding

To customize branding elements:
- Replace `layer.jpg` with your background image
- Update the logo text in the template
- Modify color schemes in the CSS
- Update footer links and contact information

## Troubleshooting

### Common Issues

1. **Images not loading**: Ensure static file serving is configured and BASE_URL is correct
2. **Template not found**: Verify file paths in the sendMail utility
3. **SMTP errors**: Check environment variables and SMTP configuration
4. **Styling issues**: Test in multiple email clients as CSS support varies

### Debug Mode

Enable debug logging by setting:
```env
DEBUG=nodemailer*
```

## Best Practices

1. **Always test** email templates in multiple email clients
2. **Keep file sizes small** for faster loading
3. **Use web-safe fonts** with fallbacks
4. **Include alt text** for images
5. **Test both HTML and plain text** versions
6. **Monitor delivery rates** and spam scores
7. **Keep security notices prominent** and clear

## Browser Testing

For visual testing, you can open the HTML template directly in a browser by temporarily removing EJS variables or replacing them with sample data.
