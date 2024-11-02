import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

export async function POST(request: Request) {
    const formData = await request.json()
    const uniqueId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)

    const data = {
        id: uniqueId,
        ...formData,
        createdAt: new Date().toISOString()
    }

    const filePath = path.join(process.cwd(), 'data', `${uniqueId}.json`)

    try {
        await fs.writeFile(filePath, JSON.stringify(data, null, 2))
        return NextResponse.json({ success: true, uniqueId })
    } catch (error) {
        console.error('Error saving form data:', error)
        return NextResponse.json({ success: false, error: 'Failed to save form data' }, { status: 500 })
    }
}