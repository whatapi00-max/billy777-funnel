# BILLY777 Registration Landing Page

A professional, fully responsive iGaming registration page built with React, TypeScript, and Tailwind CSS.

## Features

- ✅ **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- ✅ **Form Validation** - Real-time validation with helpful error messages
- ✅ **Password Strength** - Requires uppercase, lowercase, and numbers
- ✅ **Phone Input** - Country code selector with 10+ countries pre-configured
- ✅ **Loading States** - Visual feedback during form submission
- ✅ **Success Modal** - Confirmation screen after successful registration
- ✅ **API Integration** - Ready for backend connection
- ✅ **Tracking Ready** - Meta Pixel, Google Analytics, and Google Sheets integration hooks
- ✅ **Production Ready** - Clean, maintainable, TypeScript code

## Project Structure

```
src/
├── components/
│   ├── RegistrationForm.tsx    # Main form component
│   ├── FormInput.tsx           # Reusable text input
│   ├── FormSelect.tsx          # Reusable select dropdown
│   ├── PasswordInput.tsx        # Password field with toggle
│   ├── PhoneInput.tsx          # Phone with country code
│   ├── TermsCheckbox.tsx       # Terms agreement checkbox
│   ├── Logo.tsx                # BILLY777 logo
│   └── SuccessModal.tsx        # Success confirmation modal
├── utils/
│   ├── validation.ts           # Form validation logic
│   └── api.ts                  # API calls and tracking
├── types/
│   └── index.ts                # TypeScript interfaces
├── App.tsx                     # Main app component
├── main.tsx                    # React entry point
└── index.css                   # Global styles with Tailwind
```

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

The app will open at `http://localhost:5173`

## Build

```bash
npm run build
```

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
REACT_APP_API_URL=http://localhost:3000/api
REACT_APP_GOOGLE_SHEET_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/usercontent
```

### Meta Pixel Setup

1. Open `index.html`
2. Replace `YOUR_PIXEL_ID_HERE` with your Meta Pixel ID
3. The pixel will automatically track:
   - Page views
   - Lead events on registration

### Google Analytics Setup

1. Open `index.html`
2. Replace `YOUR_GA_ID_HERE` with your Google Analytics ID

### Google Sheets Integration

1. Create a Google Apps Script that accepts POST requests
2. Set `REACT_APP_GOOGLE_SHEET_URL` to your script endpoint
3. The form will automatically send registration data

## Form Fields

| Field | Type | Validation |
|-------|------|-----------|
| Username | Text | 3+ chars, alphanumeric + underscore/hyphen |
| Currency | Select | Default: PKR (USD, EUR, INR, AED available) |
| New Password | Password | 6+ chars, must include uppercase, lowercase, numbers |
| Confirm Password | Password | Must match password field |
| Phone Number | Tel | 7-15 digits with country code |
| Referrer Code | Text | Optional |
| Terms Agreement | Checkbox | Required |

## API Integration

### Registration Endpoint

**POST** `/api/auth/register`

Request body:
```json
{
  "username": "user123",
  "currency": "PKR",
  "password": "SecurePass123",
  "phoneNumber": "+374123456789",
  "referrerCode": "REF123"
}
```

Response:
```json
{
  "success": true,
  "message": "Registration successful",
  "userId": "user_id_123",
  "redirectUrl": "https://dashboard.example.com"
}
```

### Tracking Endpoints

**POST** `/api/tracking/registration`

Sends registration data for internal tracking.

## Customization

### Colors & Styling

Edit `tailwind.config.js` to customize:
- Dark background colors
- Accent colors (green, orange)
- Font families

### Form Fields

To add/remove fields, modify:
1. `src/types/index.ts` - Add field to `RegistrationFormData`
2. `src/utils/validation.ts` - Add validation rules
3. `src/components/RegistrationForm.tsx` - Add form input

### Country Codes

Edit `src/components/PhoneInput.tsx` to add more countries:

```typescript
const countryCodes = [
  { code: '+1', country: 'USA/Canada' },
  { code: '+44', country: 'UK' },
  // Add more...
]
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- Optimized bundle size (~50KB gzipped)
- Fast form validation
- Lazy loading ready
- SEO friendly

## Security

- Password validation enforced
- HTTPS recommended for production
- CSRF protection ready (add tokens in API calls)
- Input sanitization in validation

## License

Proprietary - BILLY777

## Support

For issues or questions, contact the development team.
