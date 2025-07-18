# Authentication Pages

This document describes the authentication system implemented for the Hamsoya user interface.

## Pages Created

### 1. Signup Page (`/signup`)
- **Route**: `/signup`
- **File**: `src/app/signup/page.tsx`
- **Features**:
  - Full name, email, password, and confirm password fields
  - Real-time form validation
  - Password strength requirements
  - Password visibility toggle
  - Loading states during form submission
  - Error handling and display
  - Responsive design matching the home page aesthetic

### 2. Login Page (`/login`)
- **Route**: `/login`
- **File**: `src/app/login/page.tsx`
- **Features**:
  - Email and password fields
  - Form validation
  - Password visibility toggle
  - Loading states during authentication
  - Error handling and display
  - Link to forgot password page
  - Responsive design with orange/amber gradient theme

### 3. Forgot Password Page (`/forgot-password`)
- **Route**: `/forgot-password`
- **File**: `src/app/forgot-password/page.tsx`
- **Features**:
  - Email input for password reset
  - Two-step flow: form → success confirmation
  - Email validation
  - Loading states
  - Success state with instructions
  - Purple/indigo gradient theme

## Design System Consistency

All authentication pages follow the established design system:

### Visual Elements
- **Gradient Backgrounds**: Each page uses different gradient combinations:
  - Signup: Blue gradient (`from-blue-900 via-blue-800 to-blue-700`)
  - Login: Orange/amber gradient (`from-amber-600 via-orange-600 to-yellow-600`)
  - Forgot Password: Purple/indigo gradient (`from-purple-600 via-indigo-600 to-blue-600`)

- **Pattern Overlays**: Radial gradient patterns for visual depth
- **Backdrop Blur**: Semi-transparent cards with backdrop blur effects
- **Rounded Buttons**: Consistent with hero section styling
- **Typography**: Uses established font families (Sora, Urbanist)

### Component Reuse
- **UI Components**: Utilizes existing Button, Input, Card, and Label components
- **Icons**: Lucide React icons for consistency
- **Styling**: Tailwind CSS classes matching the brand color system

## Form Validation

### Client-Side Validation
- **Email**: Valid email format required
- **Password**: Minimum 8 characters, must contain uppercase, lowercase, and number
- **Name**: Minimum 2 characters, maximum 50 characters
- **Confirm Password**: Must match the password field

### Validation Utilities
- **File**: `src/lib/validation.ts`
- **Functions**: `validateEmail`, `validatePassword`, `validateName`, `validateConfirmPassword`

## Mock Authentication

### Development Testing
The pages include mock authentication for development and testing:

#### Signup Page
- Any email except `test@example.com` will succeed
- `test@example.com` will trigger "user already exists" error

#### Login Page
- **Test Credentials**:
  - Email: `admin@hamsoya.com`
  - Password: `password123`
- Any other combination will show "invalid credentials" error

### API Integration Ready
- **File**: `src/lib/auth-api.ts`
- **Types**: `src/types/auth.ts`
- Ready for integration with the existing auth service at `apps/auth-service`

## Navigation Integration

### Header Updates
- **File**: `src/shared/widgets/header/Header.tsx`
- **Changes**:
  - Logo now links to home page
  - "Sign In" button links to `/login`
  - "Sign Up" button added (hidden on mobile)
  - Proper hover states and transitions

### Inter-page Navigation
- All pages include proper navigation links
- "Back to Home" links on all auth pages
- Cross-linking between login/signup pages
- Forgot password flow integration

## Responsive Design

### Mobile Optimization
- Forms adapt to mobile screen sizes
- Touch-friendly button sizes (h-12)
- Proper spacing and typography scaling
- Hidden elements on mobile (Sign Up button in header)

### Desktop Experience
- Centered layouts with proper max-widths
- Enhanced hover effects and transitions
- Full feature visibility

## Future Integration

### API Integration
1. Replace mock functions in `handleSubmit` methods
2. Use `authAPI` from `src/lib/auth-api.ts`
3. Implement proper token storage and management
4. Add redirect logic after successful authentication

### Additional Features
- Email verification flow
- Password reset completion page
- Social authentication options
- Remember me functionality
- Multi-factor authentication

## Testing

### Manual Testing
1. Visit `/signup` - test form validation and submission
2. Visit `/login` - test with provided credentials
3. Visit `/forgot-password` - test email flow
4. Test navigation between pages
5. Test responsive behavior on different screen sizes

### Test Credentials
- **Login**: `admin@hamsoya.com` / `password123`
- **Signup Error Test**: Use `test@example.com` as email

## File Structure

```
apps/user-ui/src/
├── app/
│   ├── signup/page.tsx
│   ├── login/page.tsx
│   └── forgot-password/page.tsx
├── lib/
│   ├── auth-api.ts
│   └── validation.ts
├── types/
│   └── auth.ts
└── shared/widgets/header/
    └── Header.tsx (updated)
```

This authentication system provides a solid foundation for user management while maintaining design consistency with the existing Hamsoya brand and user interface.
