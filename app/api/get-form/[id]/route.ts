import { NextResponse } from 'next/server';
import { firestore } from '@/lib/firebase'; // Import Firestore instance

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    const id = params.id;

    try {
        const doc = await firestore.collection('formData').doc(id).get();

        if (!doc.exists) {
            return NextResponse.json({ error: 'Form data not found' }, { status: 404 });
        }

        return NextResponse.json(doc.data());
    } catch (error) {
        console.error('Error reading form data:', error);
        return NextResponse.json({ error: 'Failed to retrieve form data' }, { status: 500 });
    }
}