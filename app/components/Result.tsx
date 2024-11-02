'use client'

import { useState, useEffect } from 'react'
import { useFormContext } from '../context/FormContext'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Copy, Check } from "lucide-react"
import QRCode from "react-qr-code"

export default function Result() {
    const { formData } = useFormContext()
    const [uniqueLink, setUniqueLink] = useState('')
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        // Generate unique link based on form data
        const uniqueId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
        setUniqueLink(`${window.location.origin}/result/${uniqueId}`)
    }, [])

    const copyToClipboard = () => {
        navigator.clipboard.writeText(uniqueLink).then(() => {
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        })
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-4">Your Result</h2>
            <div className="space-y-2">
                <h3 className="text-xl font-semibold">Your Unique Link</h3>
                <div className="flex items-center space-x-2">
                    <Input value={uniqueLink} readOnly aria-label="Unique link" />
                    <Button onClick={copyToClipboard} variant="outline" aria-label={copied ? "Copied" : "Copy to clipboard"}>
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                </div>
            </div>
            <div>
                <h3 className="text-xl font-semibold mb-4">QR Code</h3>
                <div className="bg-white p-4 inline-block rounded-lg shadow-md">
                    <QRCode value={uniqueLink} size={200} />
                </div>
            </div>
            <Button
                className="w-full"
                onClick={() => {
                    console.log(formData);
                    window.open(uniqueLink, '_blank');
                }}
            >
                View Full Result
            </Button>

        </div>
    )
}