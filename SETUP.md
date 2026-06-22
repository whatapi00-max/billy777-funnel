# Setup Guide - BILLY777 Registration Page

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

The application will open at `http://localhost:5173`

### 3. Build for Production

```bash
npm run build
```

Output will be in the `dist/` folder.

---

## Configuration

### Environment Variables

Copy `.env.example` to `.env` and update values:

```bash
cp .env.example .env
```

Edit `.env`:
```env
REACT_APP_API_URL=http://your-api.com/api
REACT_APP_GOOGLE_SHEET_URL=https://your-google-sheet-endpoint
```

---

## Integration Setup

### 1. Meta Pixel (Facebook Ads Tracking)

**Steps:**

1. Get your Pixel ID from Meta Business Manager
2. Open `index.html`
3. Find the Meta Pixel code section
4. Replace `YOUR_PIXEL_ID_HERE` with your actual Pixel ID

**What gets tracked:**
- Page views (automatic)
- Lead events (on form submission)

**Example:**
```html
fbq('init', '123456789');
```

### 2. Google Analytics

**Steps:**

1. Get your GA4 Measurement ID from Google Analytics
2. Open `index.html`
3. Find the Google Analytics section
4. Replace `YOUR_GA_ID_HERE` with your Measurement ID

**What gets tracked:**
- Page views (automatic)
- Form submissions (can be added)

**Example:**
```html
gtag('config', 'G-XXXXXXXXXX');
```

### 3. Google Sheets Integration

**Setup Google Apps Script:**

1. Go to [script.google.com](https://script.google.com)
2. Create a new project
3. Paste this code:

```javascript
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSheet();
  const data = JSON.parse(e.postData.contents);
  
  sheet.appendRow([
    new Date(),
    data.username,
    data.currency,
    data.phoneNumber,
    data.referrerCode || '',
    data.timestamp
  ]);
  
  return ContentService.createTextOutput(JSON.stringify({success: true}))
    .setMimeType(ContentService.MimeType.JSON);
}
```

4. Deploy as web app:
   - Click "Deploy" → "New deployment"
   - Type: "Web app"
   - Execute as: Your account
   - Who has access: "Anyone"
   - Copy the deployment URL

5. Update `.env`:
```env
REACT_APP_GOOGLE_SHEET_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/usercontent
```

### 4. Backend API Setup

**Expected endpoints:**

**POST** `/api/auth/register`
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

**POST** `/api/tracking/registration`
```json
{
  "username": "user123",
  "currency": "PKR",
  "phoneNumber": "+374123456789",
  "referrerCode": "REF123",
  "timestamp": "2024-01-01T12:00:00Z"
}
```

---

## Customization

### Change Form Fields

**To add a new field:**

1. **Update types** (`src/types/index.ts`):
```typescript
export interface RegistrationFormData {
  // ... existing fields
  newField: string;
}
```

2. **Add validation** (`src/utils/validation.ts`):
```typescript
if (!data.newField) {
  errors.newField = 'This field is required'
}
```

3. **Add to form** (`src/components/RegistrationForm.tsx`):
```typescript
<FormInput
  label="New Field"
  name="newField"
  type="text"
  placeholder="Enter value"
  value={formData.newField}
  onChange={handleInputChange}
  error={errors.newField}
  required
/>
```

### Change Colors

Edit `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      'dark-bg': '#2a2f3a',      // Background
      'accent-orange': '#ff6b35', // Orange accent
      'accent-green': '#2ecc71',  // Green accent
    },
  },
},
```

### Add More Country Codes

Edit `src/components/PhoneInput.tsx`:

```typescript
const countryCodes = [
  { code: '+1', country: 'USA/Canada' },
  { code: '+44', country: 'UK' },
  { code: '+91', country: 'India' },
  { code: '+92', country: 'Pakistan' },
  // Add more...
]
```

### Change Currency Options

Edit `src/components/RegistrationForm.tsx`:

```typescript
options={[
  { value: 'PKR', label: 'PKR' },
  { value: 'USD', label: 'USD' },
  { value: 'EUR', label: 'EUR' },
  // Add more...
]}
```

---

## Deployment

### Deploy to Netlify

1. Push code to GitHub
2. Connect repository to Netlify
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Add environment variables in Netlify dashboard

### Deploy to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Deploy to Traditional Hosting

1. Run `npm run build`
2. Upload `dist/` folder to your server
3. Configure web server to serve `index.html` for all routes

---

## Testing

### Test Form Validation

1. Try submitting empty form - should show errors
2. Enter weak password - should show error
3. Mismatched passwords - should show error
4. Invalid phone - should show error
5. All valid - should submit

### Test Responsive Design

Use browser DevTools to test:
- Mobile (375px width)
- Tablet (768px width)
- Desktop (1024px+ width)

### Test API Integration

1. Mock API responses in `src/utils/api.ts`
2. Use browser DevTools Network tab to inspect requests
3. Check console for any errors

---

## Troubleshooting

### Port Already in Use

```bash
# Kill process on port 5173
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5173
kill -9 <PID>
```

### Dependencies Not Installing

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Build Errors

```bash
# Clear dist folder
rm -rf dist

# Rebuild
npm run build
```

### API Calls Failing

1. Check `.env` file has correct API URL
2. Verify backend is running
3. Check browser console for CORS errors
4. Enable CORS on backend if needed

---

## Security Checklist

- [ ] Update Meta Pixel ID
- [ ] Update Google Analytics ID
- [ ] Configure backend API URL
- [ ] Enable HTTPS in production
- [ ] Add CSRF tokens to API calls
- [ ] Validate all inputs on backend
- [ ] Hash passwords on backend
- [ ] Use environment variables for secrets
- [ ] Enable rate limiting on API
- [ ] Add reCAPTCHA if needed

---

## Performance Tips

1. **Lazy load images** - Use React.lazy() for components
2. **Optimize bundle** - Use code splitting
3. **Cache API responses** - Implement caching strategy
4. **Minify CSS/JS** - Vite does this automatically
5. **Use CDN** - Serve static assets from CDN
6. **Monitor performance** - Use Lighthouse/WebPageTest

---

## Support

For issues or questions:
1. Check the README.md
2. Review error messages in console
3. Check browser DevTools Network tab
4. Verify all environment variables are set

---

## Next Steps

1. ✅ Install dependencies
2. ✅ Configure environment variables
3. ✅ Set up Meta Pixel
4. ✅ Set up Google Analytics
5. ✅ Set up Google Sheets
6. ✅ Connect backend API
7. ✅ Test all features
8. ✅ Deploy to production
