import React from 'react'

interface TermsCheckboxProps {
  checked: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: string
}

const TermsCheckbox: React.FC<TermsCheckboxProps> = ({ checked, onChange, error }) => {
  return (
    <div>
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          name="agreeToTerms"
          checked={checked}
          onChange={onChange}
          className="checkbox-custom mt-1"
        />
        <label className="text-xs sm:text-sm text-gray-400 leading-relaxed">
          I am at least{' '}
          <span className="text-yellow-400 font-semibold">18 years of age</span> and I have read,
          enough and agreed to the{' '}
          <span className="text-blue-400">
            terms and conditions
          </span>{' '}
          and{' '}
          <span className="text-blue-400">
            privacy policy
          </span>
        </label>
      </div>
      {error && <p className="error-text ml-7">{error}</p>}
    </div>
  )
}

export default TermsCheckbox
