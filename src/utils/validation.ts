/**
 * Validates an email address
 * @param email The email address to validate
 * @returns Boolean indicating if the email is valid
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates a password based on strength requirements
 * @param password The password to validate
 * @returns Object with validity and feedback
 */
export function validatePassword(password: string): {
  isValid: boolean;
  feedback: string;
} {
  if (password.length < 8) {
    return {
      isValid: false,
      feedback: 'Password must be at least 8 characters long',
    };
  }
  
  // Check for at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return {
      isValid: false,
      feedback: 'Password must contain at least one uppercase letter',
    };
  }
  
  // Check for at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    return {
      isValid: false,
      feedback: 'Password must contain at least one lowercase letter',
    };
  }
  
  // Check for at least one number
  if (!/\d/.test(password)) {
    return {
      isValid: false,
      feedback: 'Password must contain at least one number',
    };
  }
  
  // Check for at least one special character
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return {
      isValid: false,
      feedback: 'Password must contain at least one special character',
    };
  }
  
  return {
    isValid: true,
    feedback: 'Password meets all requirements',
  };
}

/**
 * Validates a credit card number using the Luhn algorithm
 * @param cardNumber The credit card number to validate
 * @returns Boolean indicating if the card number is valid
 */
export function isValidCreditCard(cardNumber: string): boolean {
  // Remove spaces and dashes
  const sanitizedNumber = cardNumber.replace(/[\s-]/g, '');
  
  // Check if the number contains only digits
  if (!/^\d+$/.test(sanitizedNumber)) {
    return false;
  }
  
  // Luhn algorithm
  let sum = 0;
  let shouldDouble = false;
  
  // Loop through the digits in reverse order
  for (let i = sanitizedNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(sanitizedNumber.charAt(i));
    
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  
  return sum % 10 === 0;
}

/**
 * Validates a phone number
 * @param phoneNumber The phone number to validate
 * @returns Boolean indicating if the phone number is valid
 */
export function isValidPhoneNumber(phoneNumber: string): boolean {
  // Basic phone number validation (allows various formats)
  const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  return phoneRegex.test(phoneNumber);
}

/**
 * Validates a URL
 * @param url The URL to validate
 * @returns Boolean indicating if the URL is valid
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Validates a postal/zip code (supports US and common international formats)
 * @param postalCode The postal code to validate
 * @param countryCode The ISO country code (default: 'US')
 * @returns Boolean indicating if the postal code is valid
 */
export function isValidPostalCode(postalCode: string, countryCode: string = 'US'): boolean {
  // Different regex patterns for different countries
  const patterns: Record<string, RegExp> = {
    US: /^\d{5}(-\d{4})?$/,
    CA: /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/,
    UK: /^[A-Za-z]{1,2}[0-9][A-Za-z0-9]?[ ]?[0-9][A-Za-z]{2}$/,
    // Add more country patterns as needed
  };
  
  // Default to a generic pattern if country not found
  const pattern = patterns[countryCode] || /^[A-Za-z0-9\s-]{3,10}$/;
  
  return pattern.test(postalCode);
}

/**
 * Checks if a string contains only alphanumeric characters
 * @param str The string to check
 * @returns Boolean indicating if the string is alphanumeric
 */
export function isAlphanumeric(str: string): boolean {
  return /^[a-zA-Z0-9]+$/.test(str);
}

/**
 * Validates a date string format (YYYY-MM-DD)
 * @param dateStr The date string to validate
 * @returns Boolean indicating if the date format is valid
 */
export function isValidDateFormat(dateStr: string): boolean {
  // Check format
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return false;
  }
  
  // Check if it's a valid date
  const date = new Date(dateStr);
  return !isNaN(date.getTime());
}