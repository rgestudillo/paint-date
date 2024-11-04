'use client';

import { useFormContext } from '../context/FormContext';
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from 'react';

export default function StepTwo() {
    const { formData, setFormData, setCurrentStep, updateQuestions } = useFormContext();
    const [loading, setLoading] = useState(false);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [selectedColors, setSelectedColors] = useState<string[]>([]);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        if (formData.image && canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            const image = new Image();
            image.src = formData.image;
            image.onload = () => {
                if (ctx) {
                    canvas.width = image.width;
                    canvas.height = image.height;
                    ctx.drawImage(image, 0, 0, image.width, image.height);
                }
            };
        }
    }, [formData.image]);

    const handleAddColor = (event: React.MouseEvent<HTMLCanvasElement>) => {
        if (canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                const rect = canvas.getBoundingClientRect();
                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;
                const pixel = ctx.getImageData(x, y, 1, 1).data;
                const color = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;

                // Convert RGB to hex format and add to selected colors
                const hexColor = rgbToHex(pixel[0], pixel[1], pixel[2]);
                setSelectedColors((prev) => {
                    const updatedColors = [...prev, hexColor];
                    updateQuestions(updatedColors); // Pass selected colors to updateQuestions
                    return updatedColors;
                });
            }
        }
    };

    const handleGenerateVector = async () => {
        if (formData.image && selectedColors.length > 0) {
            setLoading(true);
            try {
                const response = await fetch(formData.image);
                const imageBuffer = await response.arrayBuffer();
                const base64Image = Buffer.from(imageBuffer).toString('base64');

                const result = await fetch('/api/generateVector', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ imageBuffer: base64Image, colorPalette: selectedColors }),
                });

                if (result.ok) {
                    const data = await result.json();
                    const outputImageUrl = `data:image/png;base64,${data.image}`;

                    setFormData((prev) => ({
                        ...prev,
                        vectorImage: outputImageUrl,
                    }));

                    setGeneratedImage(outputImageUrl);
                } else {
                    console.error('Error generating vector image:', result.statusText);
                }
            } catch (error) {
                console.error('Error processing the image:', error);
            } finally {
                setLoading(false);
            }
        } else {
            alert("Please select at least one color from the image.");
        }
    };

    const handleNextStep = () => {
        setCurrentStep(3);
    };

    const rgbToHex = (r: number, g: number, b: number) => {
        return (
            '#' +
            [r, g, b]
                .map((x) => x.toString(16).padStart(2, '0'))
                .join('')
                .toUpperCase()
        );
    };

    return (
        <div className="space-y-4 relative">
            <h2 className="text-xl font-semibold">Generate Vector Image</h2>
            <div className="flex items-center justify-center space-x-8">
                {formData.image && (
                    <div>
                        <canvas
                            ref={canvasRef}
                            onClick={handleAddColor}
                            className="border rounded-md cursor-crosshair"
                            title="Click to select color"
                        ></canvas>
                        <p className="text-sm text-center mt-2">Click on the image to pick colors.</p>
                    </div>
                )}

                {generatedImage && (
                    <img src={generatedImage} alt="Generated Vector" className="max-w-xs h-auto border rounded-md" />
                )}
            </div>

            <div className="mt-4 text-center">
                <h3 className="text-lg font-medium">Selected Colors for Palette</h3>
                <div className="mt-2 flex space-x-2 justify-center">
                    {selectedColors.map((color, index) => (
                        <div key={index} className="w-8 h-8 rounded-full border" style={{ backgroundColor: color }}></div>
                    ))}
                </div>
            </div>

            <div className="flex space-x-4 justify-center mt-4">
                {!generatedImage && (
                    <Button onClick={handleGenerateVector} disabled={loading}>
                        {loading ? "Generating..." : "Generate Vector Image"}
                    </Button>
                )}
                {generatedImage && (
                    <Button onClick={handleNextStep}>Next</Button>
                )}
            </div>
        </div>
    );
}
