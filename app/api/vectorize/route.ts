// /app/api/vectorize/route.ts

import { NextResponse } from 'next/server';
import { vectorize, ColorMode, Hierarchical, PathSimplifyMode } from '@neplex/vectorizer';

export async function POST(req: Request) {
    try {
        const { imageBuffer } = await req.json();

        // Convert the base64 string back to a buffer
        const buffer = Buffer.from(imageBuffer, 'base64');

        // Vectorize the image
        const svg = await vectorize(buffer, {
            colorMode: ColorMode.Color,
            colorPrecision: 6,
            filterSpeckle: 4,
            spliceThreshold: 45,
            cornerThreshold: 60,
            hierarchical: Hierarchical.Stacked,
            mode: PathSimplifyMode.Spline,
            layerDifference: 5,
            lengthThreshold: 5,
            maxIterations: 2,
            pathPrecision: 5,
        });

        return NextResponse.json({ svg });
    } catch (error) {
        console.error('Error generating vector image:', error);
        return NextResponse.json({ message: 'Error generating vector image' }, { status: 500 });
    }
}
