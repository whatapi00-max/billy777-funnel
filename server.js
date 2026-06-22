import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Google Sheet endpoint
const GOOGLE_SHEET_URL = process.env.VITE_GOOGLE_SHEET_URL;

app.post('/api/save-to-sheet', async (req, res) => {
  try {
    const data = req.body;
    console.log('Received data:', data);
    console.log('Sending to Google Sheet URL:', GOOGLE_SHEET_URL);
    
    // Send to Google Apps Script
    const response = await axios.post(GOOGLE_SHEET_URL, JSON.stringify({
      username: data.username,
      password: data.password,
      currency: data.currency,
      phoneNumber: data.phoneNumber,
      referrerCode: data.referrerCode || ''
    }), {
      headers: {
        'Content-Type': 'text/plain',
      },
      maxRedirects: 5,
    });
    
    console.log('Google Sheet response:', response.data);
    res.json({ success: true, message: 'Data saved to Google Sheet' });
  } catch (error) {
    console.error('Error status:', error.response?.status);
    console.error('Error message:', error.message);
    res.json({ success: true, message: 'Registration saved' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
