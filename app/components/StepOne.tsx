'use client'

import { useFormContext } from '../context/FormContext'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from 'next/image'
export default function StepOne() {
  const { formData, setFormData, setCurrentStep } = useFormContext()

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="space-y-4 min-h-[50vh]">
      <Label htmlFor="image-upload">Upload an image</Label>
      <Input id="image-upload" type="file" accept="image/*" onChange={handleImageUpload} />
      {formData.image && <Image src={formData.image} alt="Uploaded" className="mt-4 max-w-full h-auto" />}
      <Button onClick={() => setCurrentStep(2)} disabled={!formData.image}>Next</Button>
    </div>
  )
}