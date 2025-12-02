const phone = "9999+1770-200-5531";

// Check if phone starts with "9999" for OTP bypass (testing mode)
const shouldBypassOTP = phone.replace(/[^0-9+]/g, '').startsWith('9999');

console.log('Original phone:', phone);
console.log('After removing non-digits:', phone.replace(/[^0-9+]/g, ''));
console.log('Should bypass OTP:', shouldBypassOTP);

// Strip "9999" prefix for database lookup if present
const lookupPhone = shouldBypassOTP 
  ? phone.replace(/^9999/, '') 
  : phone;

console.log('Lookup phone:', lookupPhone);
console.log('Expected in DB: +1770-200-5531');
console.log('Match:', lookupPhone === '+1770-200-5531');
