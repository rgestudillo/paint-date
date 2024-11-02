import { useFormContext } from '../context/FormContext';
import { Button } from "@/components/ui/button";
import { useState } from 'react';

export default function StepTwo() {
    const { formData, setFormData, setCurrentStep } = useFormContext();
    const [loading, setLoading] = useState(false);

    const handleGenerateVector = async () => {
        if (!formData.image) return;

        setLoading(true);

        try {
            // Fetch the image as a Blob
            const response = await fetch(formData.image);
            const arrayBuffer = await response.arrayBuffer();
            const base64Image = Buffer.from(arrayBuffer).toString('base64');

            // Send image data to the server for vectorization
            const vectorResponse = await fetch('/api/vectorize', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ imageBuffer: base64Image }),
            });

            if (!vectorResponse.ok) {
                throw new Error('Failed to generate vector image');
            }

            const { svg } = await vectorResponse.json();

            // Create a Blob from the SVG string and generate a URL for display
            const svgBlob = new Blob([svg], { type: 'image/svg+xml' });
            const svgUrl = URL.createObjectURL(svgBlob);

            // Update form data with the vector image URL
            setFormData(prev => ({ ...prev, vectorImage: svgUrl }));
            setCurrentStep(3);
        } catch (error) {
            console.error('Error generating vector image:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold">Generate Vector Image</h2>
            {formData.image && <img src={formData.image} alt="Uploaded" className="mt-4 max-w-full h-auto" />}
            <Button onClick={handleGenerateVector} disabled={loading}>
                {loading ? 'Generating...' : 'Generate Vector Image'}
            </Button>
        </div>
    );
}
