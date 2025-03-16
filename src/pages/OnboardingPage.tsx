import { useState, ChangeEvent } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { logout, updateUserStore } from '../features/auth/authSlice'
import { RootState } from '../store/store'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

// Update the store type to include the name property
interface Store {
  name?: string
  onboarding_procedure: {
    onboarding_status: string
  }
}

const OnboardingPage = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.auth)
  const [currentStep, setCurrentStep] = useState(1)
  
  // Cast the store to our interface that includes the name property
  const store = user?.store as Store | undefined
  const [storeName, setStoreName] = useState(store?.name || '')
  const [storeDescription, setStoreDescription] = useState('')
  const totalSteps = 3
  
  const handleLogout = () => {
    dispatch(logout())
  }
  
  const handleNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    } else {
      // Simulate completing onboarding process
      if (user?.store) {
        const updatedStore: Store = {
          ...user.store as Store,
          name: storeName,
          onboarding_procedure: {
            ...user.store.onboarding_procedure,
            onboarding_status: 'DONE'
          }
        }
        dispatch(updateUserStore(updatedStore))
      }
    }
  }
  
  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }
  
  return (
    <Card className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Complete Your Store Setup</h2>
        <Button 
          variant="secondary"
          size="sm"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>
      
      {/* Progress bar */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-8">
        <div 
          className="bg-primary h-2.5 rounded-full transition-all duration-300" 
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        ></div>
      </div>
      
      {/* Step 1: Basic Information */}
      {currentStep === 1 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Basic Information</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Let's start with some basic information about your store.</p>
          
          <Input
            label="Store Name"
            value={storeName}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setStoreName(e.target.value)}
            placeholder="Enter your store name"
            required
          />
          
          <Input
            label="Store Description"
            value={storeDescription}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setStoreDescription(e.target.value)}
            placeholder="Describe your store in a few words"
            as="textarea"
            rows={4}
          />
        </div>
      )}
      
      {/* Step 2: Branding */}
      {currentStep === 2 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Branding</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Customize your store's appearance.</p>
          
          <div className="border border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">Drag and drop your logo here or click to upload</p>
            <Button variant="outline" className="mt-4">Upload Logo</Button>
          </div>
        </div>
      )}
      
      {/* Step 3: Review */}
      {currentStep === 3 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Review Your Information</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Please review your store information before completing setup.</p>
          
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-300">Store Name: {storeName || 'Your Store'}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">Description: {storeDescription || 'No description provided'}</p>
          </div>
        </div>
      )}
      
      {/* Navigation buttons */}
      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          onClick={handlePreviousStep}
          disabled={currentStep === 1}
        >
          Previous
        </Button>
        
        <Button
          onClick={handleNextStep}
        >
          {currentStep === totalSteps ? 'Complete Setup' : 'Next Step'}
        </Button>
      </div>
    </Card>
  )
}

export default OnboardingPage 