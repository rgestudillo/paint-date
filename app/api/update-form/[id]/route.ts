import { NextResponse } from 'next/server';
import { firestore } from '@/lib/firebase'; // Import Firestore instance

export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    const { id } = params;

    try {
        // Parse the data from the request body
        const body = await request.json();

        // Update specific fields in Firestore based on provided data
        await firestore.collection('formData').doc(id).update(body);

        return NextResponse.json({ message: 'Form data updated successfully' });
    } catch (error) {
        console.error('Error updating form data:', error);
        return NextResponse.json({ error: 'Failed to update form data' }, { status: 500 });
    }
}
