import { useFormContext } from '../context/FormContext'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function StepOne() {
  const { formData, setFormData, setCurrentStep } = useFormContext()

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const img = new Image()
        img.src = reader.result as string
        img.onload = () => {
          const maxCanvasSize = 500
          let width = img.width
          let height = img.height

          // Calculate the new dimensions while maintaining aspect ratio
          if (width > height) {
            if (width > maxCanvasSize) {
              height = (height * maxCanvasSize) / width
              width = maxCanvasSize
            }
          } else {
            if (height > maxCanvasSize) {
              width = (width * maxCanvasSize) / height
              height = maxCanvasSize
            }
          }

          // Create an offscreen canvas to resize the image
          const canvas = document.createElement('canvas')
          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height)
            const resizedImage = canvas.toDataURL('image/jpeg') // Convert to base64 format

            // Update formData with the resized image
            setFormData(prev => ({ ...prev, image: resizedImage }))
          }
        }
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="space-y-4 min-h-[50vh]">
      <Label htmlFor="image-upload">Upload an image</Label>
      <Input id="image-upload" type="file" accept="image/*" onChange={handleImageUpload} />
      {formData.image && <img src={formData.image} alt="Uploaded" className="mt-4 max-w-full h-auto" />}
      <Button onClick={() => setCurrentStep(2)} disabled={!formData.image}>Next</Button>
    </div>
  )
}
