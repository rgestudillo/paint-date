'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

interface FormData {
    image: string | null
    vectorImage: string | null
    answers: string[]
}

interface FormContextType {
    formData: FormData
    setFormData: React.Dispatch<React.SetStateAction<FormData>>
    currentStep: number
    setCurrentStep: React.Dispatch<React.SetStateAction<number>>
}

const FormContext = createContext<FormContextType | undefined>(undefined)

export const FormProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [formData, setFormData] = useState<FormData>({
        image: null,
        vectorImage: null,
        answers: Array(10).fill(''),
    })
    const [currentStep, setCurrentStep] = useState(1)

    return (
        <FormContext.Provider value={{ formData, setFormData, currentStep, setCurrentStep }}>
            {children}
        </FormContext.Provider>
    )
}

export const useFormContext = () => {
    const context = useContext(FormContext)
    if (context === undefined) {
        throw new Error('useFormContext must be used within a FormProvider')
    }
    return context
}