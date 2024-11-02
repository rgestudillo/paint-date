'use client'

import { useFormContext } from '../context/FormContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function StepThree() {
    const { formData, setFormData, setCurrentStep } = useFormContext();

    const handleQuestionChange = (index: number, value: string) => {
        const newQuestionAnswers = [...formData.questionAnswers];
        newQuestionAnswers[index].question = value; // Update the question for the specific index
        setFormData(prev => ({ ...prev, questionAnswers: newQuestionAnswers }));
    };

    const handleAnswerChange = (index: number, value: string) => {
        const newQuestionAnswers = [...formData.questionAnswers];
        newQuestionAnswers[index].answer = value; // Update the answer for the specific question
        setFormData(prev => ({ ...prev, questionAnswers: newQuestionAnswers }));
    };

    const handleSubmit = () => {
        setCurrentStep(4);
    };

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold">Questionnaire</h2>
            {formData.questionAnswers.map((item, index) => (
                <div key={index} className="space-y-2">
                    <Input
                        id={`question-${index}`}
                        value={item.question}
                        onChange={(e) => handleQuestionChange(index, e.target.value)}
                        placeholder={`Enter question ${index + 1}`}
                    />

                    <Input
                        id={`answer-${index}`}
                        value={item.answer}
                        onChange={(e) => handleAnswerChange(index, e.target.value)}
                        placeholder={`Answer to ${item.question}`}
                    />
                </div>
            ))}
            <Button onClick={handleSubmit}>Submit</Button>
        </div>
    );
}
