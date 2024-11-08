'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface QuestionAnswer {
    question: string;
    answer: string;
    color: string;  // Color field for reference
    isAnswered: boolean; // Add isAnswered field
}

interface FormData {
    image: string | null;
    vectorImage: string | null;
    questionAnswers: QuestionAnswer[];
}

interface FormContextType {
    formData: FormData;
    setFormData: React.Dispatch<React.SetStateAction<FormData>>;
    currentStep: number;
    setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
    updateQuestions: (colors: string[]) => void;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export const FormProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [formData, setFormData] = useState<FormData>({
        image: null,
        vectorImage: null,
        questionAnswers: [],
    });
    const [currentStep, setCurrentStep] = useState(1);

    const updateQuestions = (colors: string[]) => {
        setFormData((prev) => ({
            ...prev,
            questionAnswers: colors.map((color) => ({
                question: '',
                answer: '',
                color,          // Store the selected color
                isAnswered: false, // Default isAnswered to false
            })),
        }));
    };

    return (
        <FormContext.Provider value={{ formData, setFormData, currentStep, setCurrentStep, updateQuestions }}>
            {children}
        </FormContext.Provider>
    );
};

export const useFormContext = () => {
    const context = useContext(FormContext);
    if (context === undefined) {
        throw new Error('useFormContext must be used within a FormProvider');
    }
    return context;
};
