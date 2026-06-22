export interface RegistrationFormData {
  username: string
  currency: string
  password: string
  confirmPassword: string
  phoneNumber: string
  countryCode: string
  referrerCode?: string
  agreeToTerms: boolean
}

export interface RegistrationResponse {
  success: boolean
  message: string
  userId?: string
  redirectUrl?: string
}

export interface ValidationErrors {
  [key: string]: string
}

export interface TrackingPixelConfig {
  metaPixelId?: string
  googleSheetUrl?: string
  referralTrackingEnabled?: boolean
}
