'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { Loader2 } from "lucide-react";
import { Button } from '@/components/ui/button';

interface QuestionAnswer {
    question: string;
    answer: string;
    color: string;
    isAnswered?: boolean;
}

interface FormData {
    id: string;
    vectorImage: string;
    questionAnswers: QuestionAnswer[];
    createdAt: string;
}

export default function ViewResult() {
    const params = useParams();
    const [formData, setFormData] = useState<FormData | null>(null);
    const [userAnswers, setUserAnswers] = useState<string[]>([]);
    const [feedback, setFeedback] = useState<(string | null)[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const originalImageData = useRef<ImageData | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/get-form/${params.id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch form data');
                }
                const data = await response.json();

                const questionAnswersWithDefaults = data.questionAnswers.map((qa: QuestionAnswer) => ({
                    ...qa,
                    isAnswered: qa.isAnswered ?? false,
                }));

                setFormData({
                    ...data,
                    questionAnswers: questionAnswersWithDefaults,
                });

                setUserAnswers(questionAnswersWithDefaults.map(() => ""));
                setFeedback(
                    questionAnswersWithDefaults.map((qa: QuestionAnswer) => (qa.isAnswered ? 'correct' : null))
                );


                // Reveal colors for already answered questions
                questionAnswersWithDefaults.forEach((qa: QuestionAnswer) => {
                    if (qa.isAnswered) revealColor(qa.color);
                });

            } catch (error) {
                setError('Failed to load form data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [params.id]);

    const updateFormData = async (updatedAnswers: QuestionAnswer[]) => {
        try {
            const response = await fetch(`/api/update-form/${params.id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ questionAnswers: updatedAnswers }),
            });
            if (!response.ok) throw new Error('Failed to update form data');
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (formData?.vectorImage && canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            const image = new Image();
            image.src = formData.vectorImage;

            image.onload = () => {
                if (ctx) {
                    canvas.width = image.width;
                    canvas.height = image.height;
                    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
                    originalImageData.current = ctx.getImageData(0, 0, canvas.width, canvas.height);

                    const grayscaleData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    for (let i = 0; i < grayscaleData.data.length; i += 4) {
                        const avg = 0.3 * grayscaleData.data[i] + 0.59 * grayscaleData.data[i + 1] + 0.11 * grayscaleData.data[i + 2];
                        grayscaleData.data[i] = avg;
                        grayscaleData.data[i + 1] = avg;
                        grayscaleData.data[i + 2] = avg;
                    }
                    ctx.putImageData(grayscaleData, 0, 0);
                }
            };
        }
    }, [formData?.vectorImage]);

    const revealColor = (targetColor: string) => {
        if (!canvasRef.current || !originalImageData.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const targetRgb = hexToRgb(targetColor);

        for (let i = 0; i < imageData.data.length; i += 4) {
            const r = originalImageData.current.data[i];
            const g = originalImageData.current.data[i + 1];
            const b = originalImageData.current.data[i + 2];

            if (r === targetRgb[0] && g === targetRgb[1] && b === targetRgb[2]) {
                imageData.data[i] = r;
                imageData.data[i + 1] = g;
                imageData.data[i + 2] = b;
                imageData.data[i + 3] = 255;
            }
        }
        ctx.putImageData(imageData, 0, 0);
    };

    const handleAnswerChange = (index: number, value: string) => {
        setUserAnswers(prev => {
            const newAnswers = [...prev];
            newAnswers[index] = value;
            return newAnswers;
        });
    };

    const handleSubmitAnswer = (index: number) => {
        const isCorrect = formData?.questionAnswers[index].answer.trim().toLowerCase() === userAnswers[index].trim().toLowerCase();
        setFeedback(prev => {
            const newFeedback = [...prev];
            newFeedback[index] = isCorrect ? 'correct' : 'incorrect';
            return newFeedback;
        });

        if (isCorrect) {
            revealColor(formData.questionAnswers[index].color);
            setFormData((prevFormData) => {
                if (!prevFormData) return prevFormData;
                const updatedQuestionAnswers = prevFormData.questionAnswers.map((qa, idx) =>
                    idx === index ? { ...qa, isAnswered: true } : qa
                );
                updateFormData(updatedQuestionAnswers);
                return { ...prevFormData, questionAnswers: updatedQuestionAnswers };
            });
        }
    };

    const hexToRgb = (hex: string): [number, number, number] => {
        const bigint = parseInt(hex.slice(1), 16);
        return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
    };

    const handleDownloadImage = () => {
        if (!canvasRef.current) return;

        const canvas = canvasRef.current;
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'paint_date_result.png';
        link.click();
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (error) {
        return <div className="text-center text-red-500">{error}</div>;
    }

    if (!formData) {
        return <div className="text-center">No data found</div>;
    }

    return (
        <div className="container mx-auto p-4 max-w-3xl">
            <h1 className="text-2xl font-bold mb-6 text-center">Form Submission Result</h1>
            <div className="mb-8 text-center">
                <h2 className="text-xl font-semibold mb-2">Generated Vector Image</h2>
                <canvas ref={canvasRef} className="w-full max-w-lg h-auto rounded-lg shadow-md mx-auto"></canvas>
            </div>

            <div className="text-center mb-6">
                <Button onClick={handleDownloadImage}>Download Image</Button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Questionnaire</h2>
                <ul className="space-y-6">
                    {formData.questionAnswers.map((item, index) => (
                        <li key={index} className="p-4 rounded-lg border border-gray-200 shadow-sm bg-gray-50">
                            <p className="font-semibold mb-2">{item.question}</p>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="text"
                                    value={userAnswers[index]}
                                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                                    className={`p-2 w-full rounded border ${feedback[index] === 'correct' ? 'border-green-500 bg-green-50' :
                                        feedback[index] === 'incorrect' ? 'border-red-500 bg-red-50' :
                                            'border-gray-300'
                                        }`}
                                    placeholder="Your answer"
                                    disabled={item.isAnswered}
                                />
                                <Button onClick={() => handleSubmitAnswer(index)} disabled={item.isAnswered}>
                                    {item.isAnswered ? "Answered" : "Submit"}
                                </Button>
                            </div>
                            {feedback[index] && (
                                <p className={`mt-1 text-sm ${feedback[index] === 'correct' ? 'text-green-500' : 'text-red-500'}`}>
                                    {feedback[index] === 'correct' ? 'Correct!' : 'Incorrect!'}
                                </p>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
