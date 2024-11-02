'use client'

import { useFormContext } from '../context/FormContext'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function StepThree() {
    const { formData, setFormData, setCurrentStep } = useFormContext()

    const handleAnswerChange = (index: number, value: string) => {
        const newAnswers = [...formData.answers]
        newAnswers[index] = value
        setFormData(prev => ({ ...prev, answers: newAnswers }))
    }

    const handleSubmit = () => {
        setCurrentStep(4)
    }

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold">Questionnaire</h2>
            {formData.answers.map((answer, index) => (
                <div key={index} className="space-y-2">
                    <Label htmlFor={`question-${index}`}>Question {index + 1}</Label>
                    <Input
                        id={`question-${index}`}
                        value={answer}
                        onChange={(e) => handleAnswerChange(index, e.target.value)}
                        placeholder={`Answer to question ${index + 1}`}
                    />
                </div>
            ))}
            <Button onClick={handleSubmit}>Submit</Button>
        </div>
    )
}