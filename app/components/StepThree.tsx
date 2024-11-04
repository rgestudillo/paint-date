'use client'

import { useFormContext } from '../context/FormContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function StepThree() {
    const { formData, setFormData, setCurrentStep } = useFormContext();

    const handleQuestionChange = (index: number, value: string) => {
        const newQuestionAnswers = [...formData.questionAnswers];
        newQuestionAnswers[index].question = value;
        setFormData(prev => ({ ...prev, questionAnswers: newQuestionAnswers }));
    };

    const handleAnswerChange = (index: number, value: string) => {
        const newQuestionAnswers = [...formData.questionAnswers];
        newQuestionAnswers[index].answer = value;
        setFormData(prev => ({ ...prev, questionAnswers: newQuestionAnswers }));
    };

    const handleSubmit = () => {
        setCurrentStep(4);
    };


    console
    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold">Questionnaire</h2>
            {formData.questionAnswers.map((item, index) => (
                <div key={index} className="space-y-2">
                    <Input
                        id={`question-${index}`}
                        value={item.question}
                        onChange={(e) => handleQuestionChange(index, e.target.value)}
                        placeholder={`Enter question for color ${index + 1}`}
                    />
                    <Input
                        id={`answer-${index}`}
                        value={item.answer}
                        onChange={(e) => handleAnswerChange(index, e.target.value)}
                        placeholder={`Answer for question ${index + 1}`}
                    />
                </div>
            ))}
            <Button onClick={handleSubmit}>Submit</Button>
        </div>
    );
}
