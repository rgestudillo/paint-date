'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { Loader2 } from "lucide-react";
import { Button } from '@/components/ui/button';

interface QuestionAnswer {
    question: string;
    answer: string;
    color: string; // Include color property
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
                setFormData(data);
                setUserAnswers(data.questionAnswers.map(() => ""));
                setFeedback(data.questionAnswers.map(() => null));
            } catch (error) {
                setError('Failed to load form data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [params.id]);

    // Load and display the grayscale image initially
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

                    // Save the original image data for color reveals
                    originalImageData.current = ctx.getImageData(0, 0, canvas.width, canvas.height);

                    // Convert to grayscale
                    const grayscaleData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    for (let i = 0; i < grayscaleData.data.length; i += 4) {
                        const avg = 0.3 * grayscaleData.data[i] + 0.59 * grayscaleData.data[i + 1] + 0.11 * grayscaleData.data[i + 2];
                        grayscaleData.data[i] = avg;     // Red
                        grayscaleData.data[i + 1] = avg; // Green
                        grayscaleData.data[i + 2] = avg; // Blue
                    }
                    ctx.putImageData(grayscaleData, 0, 0);
                }
            };
        }
    }, [formData?.vectorImage]);

    // Reveal only the specified color in the image
    const revealColor = (targetColor: string) => {
        if (!canvasRef.current || !originalImageData.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const targetRgb = hexToRgb(targetColor);

        // Loop through each pixel and check if it matches the target color
        for (let i = 0; i < imageData.data.length; i += 4) {
            const r = originalImageData.current.data[i];
            const g = originalImageData.current.data[i + 1];
            const b = originalImageData.current.data[i + 2];

            // If the pixel color matches the target color, reveal it
            if (r === targetRgb[0] && g === targetRgb[1] && b === targetRgb[2]) {
                imageData.data[i] = r;
                imageData.data[i + 1] = g;
                imageData.data[i + 2] = b;
                imageData.data[i + 3] = 255; // Fully opaque
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

        // If the answer is correct, reveal the color
        if (isCorrect) {
            revealColor(formData.questionAnswers[index].color);
        }
    };

    // Helper function to convert hex color to RGB
    const hexToRgb = (hex: string): [number, number, number] => {
        const bigint = parseInt(hex.slice(1), 16);
        return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
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

            {/* Vector Image on Canvas */}
            <div className="mb-8 text-center">
                <h2 className="text-xl font-semibold mb-2">Generated Vector Image</h2>
                <canvas ref={canvasRef} className="w-full max-w-lg h-auto rounded-lg shadow-md mx-auto"></canvas>
            </div>

            {/* Questionnaire */}
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
                                />
                                <Button onClick={() => handleSubmitAnswer(index)}>
                                    Submit
                                </Button>
                            </div>
                            {feedback[index] && (
                                <p className={`mt-2 text-sm font-semibold ${feedback[index] === 'correct' ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                    {feedback[index] === 'correct' ? 'Correct!' : 'Incorrect, try again.'}
                                </p>
                            )}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Submission Date */}
            <div className="text-sm text-gray-500 mt-6 text-center">
                Submitted on: {new Date(formData.createdAt).toLocaleString()}
            </div>
        </div>
    );
}
