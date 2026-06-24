import React, { useState } from 'react'
import { RegistrationFormData, ValidationErrors } from '../types'
import { validateForm } from '../utils/validation'
import { registerUser, sendToGoogleSheet } from '../utils/api'
import FormInput from './FormInput'
import FormSelect from './FormSelect'
import PasswordInput from './PasswordInput'
import PhoneInput from './PhoneInput'
import TermsCheckbox from './TermsCheckbox'
import Logo from './Logo'

interface RegistrationFormProps {
  onSuccess: (data: RegistrationFormData) => void
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState<RegistrationFormData>({
    username: '',
    currency: 'NPR',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    countryCode: '+977',
    referrerCode: '',
    agreeToTerms: false,
  })

  const [errors, setErrors] = useState<ValidationErrors>({})
  const [loading, setLoading] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }))
    }
  }

  const handlePhoneChange = (phone: string, code: string) => {
    setFormData((prev) => ({
      ...prev,
      phoneNumber: phone,
      countryCode: code,
    }))
    if (errors.phoneNumber) {
      setErrors((prev) => ({
        ...prev,
        phoneNumber: '',
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError('')
    setSubmitSuccess(false)

    const validationErrors = validateForm(formData)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setLoading(true)

    try {
      await registerUser(formData)

      await sendToGoogleSheet(formData)

      setSubmitSuccess(true)
      onSuccess(formData)

      setTimeout(() => {
        window.location.href = 'https://billy777.com/'
      }, 2000)
    } catch (error: any) {
      setSubmitError(error.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md scale-in">
      <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg shadow-2xl p-4 sm:p-6">
        <Logo />

        <div className="mt-4 mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-white text-center mb-1">
            Register as New User
          </h2>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1 h-px bg-gray-600"></div>
          <span className="text-gray-500 text-sm font-medium">OR</span>
          <div className="flex-1 h-px bg-gray-600"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <FormInput
            label="Username"
            name="username"
            type="text"
            placeholder="Username"
            value={formData.username}
            onChange={handleInputChange}
            error={errors.username}
            required
          />

          <FormSelect
            label="Currency"
            name="currency"
            value={formData.currency}
            onChange={handleInputChange}
            options={[
              { value: 'NPR', label: 'NPR - Nepal' },
              { value: 'USD', label: 'USD' },
              { value: 'INR', label: 'INR' },
              { value: 'AED', label: 'AED' },
            ]}
            error={errors.currency}
            required
          />

          <PasswordInput
            label="New Password"
            name="password"
            placeholder="New Password"
            value={formData.password}
            onChange={handleInputChange}
            error={errors.password}
            required
          />

          <PasswordInput
            label="Confirm Password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            error={errors.confirmPassword}
            required
          />

          <PhoneInput
            label="Phone Number"
            phoneNumber={formData.phoneNumber}
            countryCode={formData.countryCode}
            onPhoneChange={handlePhoneChange}
            error={errors.phoneNumber}
            required
          />

          <FormInput
            label="Referrer Code"
            name="referrerCode"
            type="text"
            placeholder="Enter Referrer Code"
            value={formData.referrerCode || ''}
            onChange={handleInputChange}
            error={errors.referrerCode}
          />

          <TermsCheckbox
            checked={formData.agreeToTerms}
            onChange={handleInputChange}
            error={errors.agreeToTerms}
          />

          {submitError && (
            <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded text-sm">
              {submitError}
            </div>
          )}

          {submitSuccess && (
            <div className="bg-green-900 border border-green-700 text-green-200 px-4 py-3 rounded text-sm">
              Registration successful! Redirecting...
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary mt-4"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Registering...
              </span>
            ) : (
              'Register'
            )}
          </button>

          <p className="text-center text-sm text-gray-400 mt-4">
            Already have user?{' '}
            <span className="text-blue-400">
              Login here
            </span>
          </p>
        </form>
      </div>
    </div>
  )
}

export default RegistrationForm
