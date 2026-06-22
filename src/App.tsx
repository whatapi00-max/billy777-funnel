import { useState } from 'react'
import RegistrationForm from './components/RegistrationForm'
import SuccessModal from './components/SuccessModal'

function App() {
  const [showSuccess, setShowSuccess] = useState(false)
  const [successData, setSuccessData] = useState<any>(null)

  const handleRegistrationSuccess = (data: any) => {
    setSuccessData(data)
    setShowSuccess(true)
  }

  const handleCloseSuccess = () => {
    setShowSuccess(false)
    setSuccessData(null)
  }

  return (
    <div className="h-screen flex items-center justify-center p-2 sm:p-4 overflow-hidden">
      <RegistrationForm onSuccess={handleRegistrationSuccess} />
      {showSuccess && (
        <SuccessModal data={successData} onClose={handleCloseSuccess} />
      )}
    </div>
  )
}

export default App
