const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(bodyParser.json());

// Storage
const otpStore = {};

function generateOTP() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

// Aadhar Verification Endpoint
app.post('/api/verify/aadhar', (req, res) => {
  const { aadharNumber, name, phoneNumber } = req.body;
  
  // Validation
  if (!aadharNumber || !name || !phoneNumber) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  
  if (aadharNumber.length !== 12) {
    return res.status(400).json({ error: 'Aadhar must be 12 digits' });
  }

  const otp = generateOTP();
  otpStore[phoneNumber] = otp;
  
  // Print OTP to console (for testing)
  console.log(`OTP for ${phoneNumber}: ${otp}`);
  
  res.json({ 
    success: true,
    message: 'OTP generated',
    otp // Send OTP back to frontend
  });
});

// OTP Verification Endpoint
app.post('/api/verify/otp', (req, res) => {
  const { phoneNumber, otp } = req.body;
  
  if (otpStore[phoneNumber] === otp) {
    delete otpStore[phoneNumber];
    res.json({ success: true, message: 'OTP verified' });
  } else {
    res.status(400).json({ error: 'Invalid OTP' });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
