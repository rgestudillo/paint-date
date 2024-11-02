'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Loader2 } from "lucide-react"
interface FormData {
    id: string
    image: string
    vectorImage: string
    answers: string[]
    createdAt: string
}

export default function ViewResult() {
    const params = useParams()
    const [formData, setFormData] = useState<FormData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/get-form/${params.id}`)
                if (!response.ok) {
                    throw new Error('Failed to fetch form data')
                }
                const data = await response.json()
                setFormData(data)
            } catch (error) {
                setError('Failed to load form data')
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [params.id])

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    if (error) {
        return <div className="text-center text-red-500">{error}</div>
    }

    if (!formData) {
        return <div className="text-center">No data found</div>
    }

    return (
        <div className="container mx-auto p-4 max-w-2xl">
            <h1 className="text-2xl font-bold mb-4">Form Submission Result</h1>
            <div className="space-y-6">
                <div>
                    <h2 className="text-xl font-semibold mb-2">Uploaded Image</h2>
                    <img src={formData.image} alt="Uploaded" className="max-w-full h-auto rounded-lg shadow-md" />
                </div>
                <div>
                    <h2 className="text-xl font-semibold mb-2">Vector Image</h2>
                    <img src={formData.vectorImage} alt="Vector" className="max-w-full h-auto rounded-lg shadow-md" />
                </div>
                <div>
                    <h2 className="text-xl font-semibold mb-2">Questionnaire Answers</h2>
                    <ul className="space-y-2">
                        {formData.answers.map((answer, index) => (
                            <li key={index} className="bg-gray-100 p-2 rounded">
                                <strong>Question {index + 1}:</strong> {answer}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="text-sm text-gray-500">
                    Submitted on: {new Date(formData.createdAt).toLocaleString()}
                </div>
            </div>
        </div>
    )
}