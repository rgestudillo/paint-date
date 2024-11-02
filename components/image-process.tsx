'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Copy, Check } from "lucide-react"
import QRCode from "react-qr-code";

export function ImageProcess() {
  const [step, setStep] = useState(1)
  const [image, setImage] = useState<string | null>(null)
  const [answers, setAnswers] = useState(Array(10).fill(''))
  const [loading, setLoading] = useState(false)
  const [uniqueLink, setUniqueLink] = useState('')
  const [copied, setCopied] = useState(false)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...answers]
    newAnswers[index] = value
    setAnswers(newAnswers)
  }

  const handleSubmit = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      generateUniqueLink()
      setStep(4)
    }, 10000)
  }

  const generateUniqueLink = () => {
    const uniqueId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    const link = `${window.location.origin}/result/${uniqueId}`
    setUniqueLink(link)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(uniqueLink).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        setLoading(false)
        generateUniqueLink()
      }, 10000)
      return () => clearTimeout(timer)
    }
  }, [loading])

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-4">Image Processing Wizard</h1>

      {step === 1 && (
        <div className="space-y-4">
          <Label htmlFor="image-upload">Upload an image</Label>
          <Input id="image-upload" type="file" accept="image/*" onChange={handleImageUpload} />
          {image && <img src={image} alt="Uploaded" className="mt-4 max-w-full h-auto" />}
          <Button onClick={() => setStep(2)} disabled={!image}>Next</Button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Generate Vector Image</h2>
          <Button onClick={() => setStep(3)}>Generate Vector Image</Button>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Questionnaire</h2>
          {answers.map((answer, index) => (
            <div key={index} className="space-y-2">
              <Label htmlFor={`question-${index}`}>Question {index + 1}</Label>
              <Input
                id={`question-${index}`}
                value={answer}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
                placeholder={`Answer to question ${index + 1}`}
              />
            </div>
          ))}
          <Button onClick={handleSubmit}>Done</Button>
        </div>
      )}

      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <Loader2 className="animate-spin h-8 w-8 mx-auto mb-4" />
            <p className="text-lg font-semibold">Generating...</p>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Your Unique Link</h2>
          <div className="flex items-center space-x-2">
            <Input value={uniqueLink} readOnly aria-label="Unique link" />
            <Button onClick={copyToClipboard} variant="outline" aria-label={copied ? "Copied" : "Copy to clipboard"}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">QR Code</h3>
            <div className="bg-white p-4 inline-block rounded-lg shadow-md">
              <QRCode value={uniqueLink} size={200} />
            </div>
          </div>
          <Button onClick={() => window.open(uniqueLink, '_blank')} className="w-full">View Result</Button>
        </div>
      )}
    </div>
  )
}