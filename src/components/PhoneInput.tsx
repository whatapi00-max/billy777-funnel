import React from 'react'

interface PhoneInputProps {
  label: string
  phoneNumber: string
  countryCode: string
  onPhoneChange: (phone: string, code: string) => void
  error?: string
  required?: boolean
}

const PhoneInput: React.FC<PhoneInputProps> = ({
  label,
  phoneNumber,
  countryCode,
  onPhoneChange,
  error,
  required,
}) => {
  const countryCodes = [
    { code: '+91', country: 'India' },
    { code: '+92', country: 'Pakistan' },
    { code: '+971', country: 'UAE' },
    { code: '+977', country: 'Nepal' },
    { code: '+880', country: 'Bangladesh' },
    { code: '+44', country: 'UK' },
    { code: '+1', country: 'USA/Canada' },
  ]

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '')
    onPhoneChange(value, countryCode)
  }

  const handleCodeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onPhoneChange(phoneNumber, e.target.value)
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      <div className="flex gap-2">
        <select
          value={countryCode}
          onChange={handleCodeChange}
          className="form-select w-24 sm:w-32"
        >
          {countryCodes.map((item) => (
            <option key={item.code} value={item.code}>
              {item.code}
            </option>
          ))}
        </select>
        <input
          type="tel"
          placeholder="Phone number"
          value={phoneNumber}
          onChange={handlePhoneChange}
          className={`form-input flex-1 ${error ? 'border-red-500' : ''}`}
        />
      </div>
      {error && <p className="error-text">{error}</p>}
    </div>
  )
}

export default PhoneInput
