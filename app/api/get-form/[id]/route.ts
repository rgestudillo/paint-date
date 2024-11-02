import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    const id = params.id
    const filePath = path.join(process.cwd(), 'data', `${id}.json`)

    try {
        const fileContents = await fs.readFile(filePath, 'utf8')
        const data = JSON.parse(fileContents)
        return NextResponse.json(data)
    } catch (error) {
        console.error('Error reading form data:', error)
        return NextResponse.json({ error: 'Form data not found' }, { status: 404 })
    }
}