import React, { useEffect } from 'react'
import { RegistrationFormData } from '../types'

interface SuccessModalProps {
  data: RegistrationFormData
  onClose: () => void
}

const SuccessModal: React.FC<SuccessModalProps> = ({ data, onClose }) => {
  const handleRedirect = () => {
    window.location.href = 'https://billy777.com/'
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = 'https://billy777.com/'
    }, 5000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-2xl p-6 sm:p-8 max-w-md w-full scale-in">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Successful!</h2>
          <p className="text-gray-600 mb-6">
            Welcome to BILLY777. Your account has been created successfully.
          </p>

          <div className="bg-gray-50 rounded p-4 mb-6 text-left">
            <div className="mb-3">
              <p className="text-sm text-gray-600">Username</p>
              <p className="font-semibold text-gray-900">{data.username}</p>
            </div>
            <div className="mb-3">
              <p className="text-sm text-gray-600">Currency</p>
              <p className="font-semibold text-gray-900">{data.currency}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Phone</p>
              <p className="font-semibold text-gray-900">
                {data.countryCode} {data.phoneNumber}
              </p>
            </div>
          </div>

          <button
            onClick={handleRedirect}
            className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded transition"
          >
            Continue to Dashboard
          </button>

          <p className="text-xs text-gray-500 mt-4">
            Redirecting automatically in 5 seconds...
          </p>
        </div>
      </div>
    </div>
  )
}

export default SuccessModal
