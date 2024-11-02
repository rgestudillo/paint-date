import { NextResponse } from 'next/server';
import { firestore } from '@/lib/firebase'; // Import Firestore instance

// POST Route: Save new form data
export async function POST(request: Request) {
    const formData = await request.json();

    try {
        const newDocRef = await firestore.collection('formData').add({
            ...formData,
            createdAt: new Date().toISOString(),
        });

        return NextResponse.json({ success: true, id: newDocRef.id });
    } catch (error) {
        console.error('Error saving form data:', error);
        return NextResponse.json({ success: false, error: 'Failed to save form data' }, { status: 500 });
    }
}
