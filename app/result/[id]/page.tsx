'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

export default function Result() {
    const { id } = useParams()
    const [data, setData] = useState<{ image: string; answers: string[] } | null>(null)

    useEffect(() => {
        // In a real application, you would fetch the data from a database or API
        // For this example, we'll simulate fetching data
        const fetchData = async () => {
            // Simulating an API call
            await new Promise(resolve => setTimeout(resolve, 1000))
            setData({
                image: '/placeholder.svg?height=300&width=300',
                answers: Array(10).fill('Sample answer')
            })
        }

        fetchData()
    }, [id])

    if (!data) {
        return <div className="container mx-auto p-4">Loading...</div>
    }

    return (
        <div className="container mx-auto p-4 max-w-2xl">
            <h1 className="text-2xl font-bold mb-4">Result for ID: {id}</h1>
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-2">Generated Image</h2>
                <img src={data.image} alt="Generated" className="max-w-full h-auto" />
            </div>
            <div>
                <h2 className="text-xl font-semibold mb-2">Questionnaire Answers</h2>
                <ul className="space-y-2">
                    {data.answers.map((answer, index) => (
                        <li key={index}>
                            <strong>Question {index + 1}:</strong> {answer}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}