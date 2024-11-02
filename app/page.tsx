'use client'

import { FormProvider, useFormContext } from './context/FormContext'
import StepOne from './components/StepOne'
import StepTwo from './components/StepTwo'
import StepThree from './components/StepThree'
import Result from './components/Result'
import { Button } from "@/components/ui/button"

function StepIndicator({ step, currentStep, onClick }: { step: number; currentStep: number; onClick: () => void }) {
  return (
    <Button
      variant={currentStep === step ? "default" : "outline"}
      className={`rounded-full w-10 h-10 ${currentStep > step ? "bg-primary text-primary-foreground" : ""}`}
      onClick={onClick}
    >
      {step}
    </Button>
  )
}

function FormSteps() {
  const { currentStep, setCurrentStep, formData } = useFormContext()

  const steps = [
    { number: 1, component: <StepOne /> },
    { number: 2, component: <StepTwo /> },
    { number: 3, component: <StepThree /> },
    { number: 4, component: <Result /> },
  ]

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        {steps.slice(0, 3).map((step) => (
          <StepIndicator
            key={step.number}
            step={step.number}
            currentStep={currentStep}
            onClick={() => {
              if (step.number < currentStep) {
                setCurrentStep(step.number)
              }
            }}
          />
        ))}
      </div>
      {steps.find(step => step.number === currentStep)?.component || <div>Invalid step</div>}
    </div>
  )
}

export default function Home() {
  return (
    <FormProvider>
      <div className="container mx-auto p-4 max-w-md">
        <h1 className="text-2xl font-bold mb-8">Multi-step Form</h1>
        <FormSteps />
      </div>
    </FormProvider>
  )
}