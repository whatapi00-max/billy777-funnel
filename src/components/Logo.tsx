import React from 'react'

const Logo: React.FC = () => {
  return (
    <div className="flex justify-center mb-4">
      <div className="text-center">
        <img 
          src="/logo billy777.png" 
          alt="BILLY777 Logo" 
          className="h-12 sm:h-14 w-auto mx-auto"
        />
      </div>
    </div>
  )
}

export default Logo
