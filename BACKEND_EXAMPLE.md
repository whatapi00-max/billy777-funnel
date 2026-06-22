# Backend Integration Examples

This document provides example backend implementations for the registration API.

## Node.js/Express Example

### Installation

```bash
npm install express cors dotenv bcryptjs jsonwebtoken
```

### Basic Setup

```javascript
// server.js
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Rate limiting (recommended)
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5 // 5 requests per windowMs
});

// Registration endpoint
app.post('/api/auth/register', limiter, async (req, res) => {
  try {
    const { username, currency, password, phoneNumber, referrerCode } = req.body;

    // Validate input
    if (!username || !currency || !password || !phoneNumber) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Username already taken'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      username,
      currency,
      password: hashedPassword,
      phoneNumber,
      referrerCode,
      createdAt: new Date()
    });

    // Generate token
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Track registration
    await trackRegistration({
      username,
      currency,
      phoneNumber,
      referrerCode,
      timestamp: new Date().toISOString()
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      userId: user._id,
      token,
      redirectUrl: process.env.DASHBOARD_URL || '/dashboard'
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed. Please try again.'
    });
  }
});

// Tracking endpoint
app.post('/api/tracking/registration', async (req, res) => {
  try {
    const { username, currency, phoneNumber, referrerCode, timestamp } = req.body;

    // Log to database or analytics service
    await RegistrationLog.create({
      username,
      currency,
      phoneNumber,
      referrerCode,
      timestamp,
      ipAddress: req.ip
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Tracking error:', error);
    res.status(500).json({ success: false });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### Database Schema (MongoDB)

```javascript
// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    match: /^[a-zA-Z0-9_-]+$/
  },
  currency: {
    type: String,
    required: true,
    enum: ['PKR', 'USD', 'EUR', 'INR', 'AED']
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  phoneNumber: {
    type: String,
    required: true,
    match: /^\+\d{1,3}\d{7,14}$/
  },
  referrerCode: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date,
    default: null
  },
  status: {
    type: String,
    enum: ['active', 'suspended', 'deleted'],
    default: 'active'
  }
});

module.exports = mongoose.model('User', userSchema);
```

### Environment Variables

```env
# .env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/billy777
JWT_SECRET=your-secret-key-here
FRONTEND_URL=http://localhost:5173
DASHBOARD_URL=https://dashboard.example.com
```

---

## Python/Flask Example

```python
# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_bcrypt import Bcrypt
import jwt
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app, origins=[os.getenv('FRONTEND_URL', 'http://localhost:5173')])
bcrypt = Bcrypt(app)

app.config['SECRET_KEY'] = os.getenv('JWT_SECRET')

# Mock database (replace with real database)
users_db = {}

@app.route('/api/auth/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        # Validate input
        required_fields = ['username', 'currency', 'password', 'phoneNumber']
        if not all(field in data for field in required_fields):
            return jsonify({
                'success': False,
                'message': 'Missing required fields'
            }), 400
        
        username = data['username']
        
        # Check if user exists
        if username in users_db:
            return jsonify({
                'success': False,
                'message': 'Username already taken'
            }), 409
        
        # Hash password
        hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
        
        # Create user
        user = {
            'username': username,
            'currency': data['currency'],
            'password': hashed_password,
            'phoneNumber': data['phoneNumber'],
            'referrerCode': data.get('referrerCode'),
            'createdAt': datetime.now().isoformat()
        }
        
        users_db[username] = user
        
        # Generate token
        token = jwt.encode({
            'userId': username,
            'exp': datetime.utcnow() + timedelta(hours=24)
        }, app.config['SECRET_KEY'], algorithm='HS256')
        
        return jsonify({
            'success': True,
            'message': 'Registration successful',
            'userId': username,
            'token': token,
            'redirectUrl': os.getenv('DASHBOARD_URL', '/dashboard')
        }), 201
        
    except Exception as e:
        print(f'Registration error: {e}')
        return jsonify({
            'success': False,
            'message': 'Registration failed. Please try again.'
        }), 500

@app.route('/api/tracking/registration', methods=['POST'])
def track_registration():
    try:
        data = request.get_json()
        # Log to database or analytics service
        print(f'Registration tracked: {data}')
        return jsonify({'success': True}), 200
    except Exception as e:
        print(f'Tracking error: {e}')
        return jsonify({'success': False}), 500

if __name__ == '__main__':
    app.run(debug=True, port=3000)
```

---

## PHP/Laravel Example

```php
// routes/api.php
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/tracking/registration', [TrackingController::class, 'register']);

// app/Http/Controllers/AuthController.php
namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'username' => 'required|string|unique:users|min:3|regex:/^[a-zA-Z0-9_-]+$/',
            'currency' => 'required|in:PKR,USD,EUR,INR,AED',
            'password' => 'required|string|min:6',
            'phoneNumber' => 'required|string|regex:/^\+\d{1,3}\d{7,14}$/',
            'referrerCode' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $user = User::create([
                'username' => $request->username,
                'currency' => $request->currency,
                'password' => Hash::make($request->password),
                'phoneNumber' => $request->phoneNumber,
                'referrerCode' => $request->referrerCode
            ]);

            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'success' => true,
                'message' => 'Registration successful',
                'userId' => $user->id,
                'token' => $token,
                'redirectUrl' => config('app.dashboard_url')
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Registration failed'
            ], 500);
        }
    }
}
```

---

## Database Queries

### Check Username Availability

```javascript
// Node.js/MongoDB
const isAvailable = await User.findOne({ username }) === null;

// SQL
SELECT COUNT(*) FROM users WHERE username = ?;
```

### Get User by Username

```javascript
// Node.js/MongoDB
const user = await User.findOne({ username });

// SQL
SELECT * FROM users WHERE username = ? LIMIT 1;
```

### Update Last Login

```javascript
// Node.js/MongoDB
await User.updateOne({ _id: userId }, { lastLogin: new Date() });

// SQL
UPDATE users SET last_login = NOW() WHERE id = ?;
```

---

## Error Handling

### Common Errors

```javascript
// Missing fields
{
  "success": false,
  "message": "Missing required fields",
  "code": "MISSING_FIELDS"
}

// Username taken
{
  "success": false,
  "message": "Username already taken",
  "code": "USERNAME_EXISTS"
}

// Invalid input
{
  "success": false,
  "message": "Invalid phone number format",
  "code": "INVALID_INPUT"
}

// Server error
{
  "success": false,
  "message": "Registration failed. Please try again.",
  "code": "SERVER_ERROR"
}
```

---

## Security Best Practices

1. **Hash Passwords**: Always use bcrypt or similar
2. **Validate Input**: Check all fields on backend
3. **Rate Limiting**: Prevent brute force attacks
4. **HTTPS Only**: Use SSL/TLS in production
5. **CORS**: Configure properly for your domain
6. **JWT Tokens**: Use secure signing
7. **Database**: Use parameterized queries
8. **Logging**: Log all registration attempts
9. **Email Verification**: Add email confirmation
10. **2FA**: Consider two-factor authentication

---

## Testing the API

### Using cURL

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "currency": "PKR",
    "password": "SecurePass123",
    "phoneNumber": "+374123456789",
    "referrerCode": "REF123"
  }'
```

### Using Postman

1. Create new POST request
2. URL: `http://localhost:3000/api/auth/register`
3. Headers: `Content-Type: application/json`
4. Body (raw JSON):
```json
{
  "username": "testuser",
  "currency": "PKR",
  "password": "SecurePass123",
  "phoneNumber": "+374123456789",
  "referrerCode": "REF123"
}
```

---

## Deployment Checklist

- [ ] Set environment variables
- [ ] Configure CORS properly
- [ ] Enable HTTPS
- [ ] Set up database
- [ ] Configure rate limiting
- [ ] Add logging
- [ ] Test all endpoints
- [ ] Set up monitoring
- [ ] Configure backups
- [ ] Document API

---

## Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [Flask Documentation](https://flask.palletsprojects.com/)
- [Laravel Documentation](https://laravel.com/docs/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc7519)
- [OWASP Security](https://owasp.org/)
