import { RegistrationFormData, ValidationErrors } from '../types'

// Country-specific phone number validation patterns
const countryPhonePatterns: { [key: string]: { pattern: RegExp; length: [number, number]; name: string } } = {
  '+91': { pattern: /^[6-9]\d{9}$/, length: [10, 10], name: 'India' },
  '+92': { pattern: /^3\d{9}$/, length: [10, 10], name: 'Pakistan' },
  '+971': { pattern: /^5\d{8}$/, length: [9, 9], name: 'UAE' },
  '+977': { pattern: /^9\d{8}$/, length: [10, 10], name: 'Nepal' },
  '+880': { pattern: /^1\d{9}$/, length: [10, 10], name: 'Bangladesh' },
  '+44': { pattern: /^7\d{9}$/, length: [10, 10], name: 'UK' },
  '+1': { pattern: /^\d{10}$/, length: [10, 10], name: 'USA/Canada' },
}

export const validateForm = (data: RegistrationFormData): ValidationErrors => {
  const errors: ValidationErrors = {}

  if (!data.username.trim()) {
    errors.username = 'Username is required'
  } else if (data.username.length < 3) {
    errors.username = 'Username must be at least 3 characters'
  } else if (!/^[a-zA-Z0-9_-]+$/.test(data.username)) {
    errors.username = 'Username can only contain letters, numbers, underscore, and hyphen'
  }

  if (!data.currency) {
    errors.currency = 'Currency is required'
  }

  if (data.password && data.confirmPassword !== data.password) {
    errors.confirmPassword = 'Passwords do not match'
  }

  if (!data.phoneNumber.trim()) {
    errors.phoneNumber = 'Phone number is required'
  } else {
    const phoneValidation = validatePhoneNumber(data.phoneNumber, data.countryCode)
    if (phoneValidation) {
      errors.phoneNumber = phoneValidation
    }
  }

  if (!data.agreeToTerms) {
    errors.agreeToTerms = 'You must agree to the terms and conditions'
  }

  return errors
}

export const validateUsername = (username: string): string => {
  if (!username.trim()) return 'Username is required'
  if (username.length < 3) return 'Username must be at least 3 characters'
  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    return 'Username can only contain letters, numbers, underscore, and hyphen'
  }
  return ''
}

export const validatePassword = (password: string): string => {
  return ''
}

export const validatePhoneNumber = (phone: string, countryCode: string): string => {
  if (!phone.trim()) return 'Phone number is required'

  const cleanPhone = phone.replace(/\s/g, '')
  const countryRule = countryPhonePatterns[countryCode]

  if (countryRule) {
    if (cleanPhone.length < countryRule.length[0] || cleanPhone.length > countryRule.length[1]) {
      return `Invalid ${countryRule.name} phone number (must be ${countryRule.length[0]} digits)`
    }
    if (!countryRule.pattern.test(cleanPhone)) {
      return `Invalid ${countryRule.name} phone number format`
    }
  } else {
    // Fallback for unknown country codes
    if (!/^\d{7,15}$/.test(cleanPhone)) {
      return 'Invalid phone number format'
    }
  }

  return ''
}
