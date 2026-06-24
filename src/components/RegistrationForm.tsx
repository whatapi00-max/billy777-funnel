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
          <p className="text-xs sm:text-sm text-gray-400 text-center">
            Get your instant ID from whatsapp
          </p>
        </div>

        <a href="https://wa.link/billy247_am" target="_blank" rel="noopener noreferrer" className="rounded mb-4 overflow-hidden flex no-underline">
          <div className="bg-green-700 flex items-center justify-center px-3">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-8 h-8 fill-white">
              <path d="M16 0C7.163 0 0 7.163 0 16c0 2.822.736 5.472 2.027 7.774L0 32l8.437-2.01A15.93 15.93 0 0016 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.333a13.27 13.27 0 01-6.77-1.853l-.485-.288-5.01 1.194 1.234-4.874-.317-.5A13.267 13.267 0 012.667 16C2.667 8.636 8.636 2.667 16 2.667S29.333 8.636 29.333 16 23.364 29.333 16 29.333zm7.27-9.862c-.398-.199-2.354-1.162-2.719-1.294-.365-.133-.631-.199-.897.199-.265.398-1.029 1.294-1.261 1.56-.232.265-.465.298-.863.1-.398-.2-1.681-.62-3.203-1.977-1.184-1.056-1.983-2.36-2.215-2.758-.232-.398-.025-.613.174-.811.179-.178.398-.465.597-.697.2-.232.266-.398.398-.664.133-.265.067-.498-.033-.697-.1-.199-.897-2.162-1.229-2.96-.324-.778-.653-.672-.897-.685l-.764-.013c-.265 0-.697.1-.1063.498-.365.398-1.396 1.362-1.396 3.324s1.429 3.857 1.628 4.122c.2.265 2.813 4.295 6.815 6.025.952.411 1.695.657 2.274.841.955.304 1.825.261 2.512.158.766-.114 2.354-.962 2.686-1.891.332-.93.332-1.727.232-1.891-.099-.166-.365-.265-.763-.464z"/>
            </svg>
          </div>
          <div className="flex-1 bg-green-500 hover:bg-green-600 transition py-3 px-4 text-white font-bold text-sm tracking-wider flex items-center justify-center">
            CLICK HERE
          </div>
        </a>

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
