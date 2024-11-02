'use client'

import { useFormContext } from '../context/FormContext'
import { Button } from "@/components/ui/button"
export default function StepTwo() {
    const { formData, setFormData, setCurrentStep } = useFormContext()

    const handleGenerateVector = () => {
        // Simulating vector generation
        setTimeout(() => {
            setFormData(prev => ({ ...prev, vectorImage: 'https://example.com/vector-image.svg' }))
            setCurrentStep(3)
        }, 2000)
    }

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold">Generate Vector Image</h2>
            {formData.image && <img src={formData.image} alt="Uploaded" className="mt-4 max-w-full h-auto" />}
            <Button onClick={handleGenerateVector}>Generate Vector Image</Button>
        </div>
    )
}