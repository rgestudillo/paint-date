// src/app/api/generateVector/route.ts
import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

export async function POST(req: NextRequest) {
    try {
        const { imageBuffer, colorPalette } = await req.json();
        const resizedImage = await sharp(Buffer.from(imageBuffer, 'base64')).resize(800).toBuffer();
        const { data, info } = await sharp(resizedImage).raw().toBuffer({ resolveWithObject: true });

        // Convert colorPalette hex codes to RGB
        const paletteRGB: [number, number, number][] = colorPalette.map(hexToRgb);

        // Map each pixel to the closest color in the colorPalette
        const paintByNumberData = new Uint8ClampedArray(data.length);
        for (let i = 0; i < data.length; i += 3) {
            const pixel: [number, number, number] = [data[i], data[i + 1], data[i + 2]];
            const closestColor = findClosestColor(pixel, paletteRGB);
            paintByNumberData[i] = closestColor[0];
            paintByNumberData[i + 1] = closestColor[1];
            paintByNumberData[i + 2] = closestColor[2];
        }

        const outputImage = await sharp(Buffer.from(paintByNumberData), {
            raw: { width: info.width, height: info.height, channels: 3 },
        }).png().toBuffer();

        return NextResponse.json({ image: outputImage.toString('base64') });
    } catch (error) {
        console.error('Error reading form data:', error);
        return NextResponse.json({ error: 'Failed to retrieve form data' }, { status: 500 });
    }
}

// Helper function to convert hex color to RGB
function hexToRgb(hex: string): [number, number, number] {
    const bigint = parseInt(hex.slice(1), 16);
    return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

// Helper function to find the closest color from the palette
function findClosestColor(pixel: [number, number, number], palette: [number, number, number][]) {
    let closestColor = palette[0];
    let minDist = Infinity;

    for (const color of palette) {
        const dist = colorDistance(pixel, color);
        if (dist < minDist) {
            minDist = dist;
            closestColor = color;
        }
    }

    return closestColor;
}

// Helper function to calculate Euclidean distance between two colors
function colorDistance(color1: [number, number, number], color2: [number, number, number]) {
    return Math.sqrt(
        Math.pow(color1[0] - color2[0], 2) +
        Math.pow(color1[1] - color2[1], 2) +
        Math.pow(color1[2] - color2[2], 2)
    );
}
