"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { useTheme, THEME_COLORS, ThemeContextType } from "@/components/theme-provider"
import { Card, CardContent } from "@/components/ui/card"
import { Check, Upload, Image as ImageIcon } from "lucide-react"
import { toast } from "sonner"

export function ThemeSelector() {
  const { primaryColor, setPrimaryColor, backgroundImage, setBackgroundImage } = useTheme()
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  // Mock images for now - in real app, could be from Unsplash or user upload
  const backgrounds = [
    { id: "none", url: null, label: "纯色" },
    { id: "mountain", url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80", label: "雪山" },
    { id: "gradient", url: "https://images.unsplash.com/photo-1557683316-973673baf926?w=400&q=80", label: "极光" },
    { id: "abstract", url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80", label: "抽象" },
  ]

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Limit file size to 3MB
    if (file.size > 3 * 1024 * 1024) {
        toast.error("图片大小不能超过 3MB")
        return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
        const result = e.target?.result as string
        if (result) {
            setBackgroundImage(result)
            toast.success("背景图已更新")
        }
    }
    reader.onerror = () => {
        toast.error("图片读取失败")
    }
    reader.readAsDataURL(file)
    
    // Reset input so same file can be selected again
    if (fileInputRef.current) {
        fileInputRef.current.value = ""
    }
  }

  // Determine if current background is a custom one (not in the predefined list)
  const isCustomBackground = backgroundImage && !backgrounds.some(bg => bg.url === backgroundImage)

  return (
    <div className="space-y-6 p-4">
      {/* Color Picker */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-900">主题色</h3>
        <div className="grid grid-cols-6 gap-2">
          {Object.keys(THEME_COLORS).map((color) => (
            <button
              key={color}
              onClick={() => setPrimaryColor(color as any)}
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center shadow-sm transition-transform hover:scale-105",
              )}
            >
               <div className={cn(
                   "w-10 h-10 rounded-full",
                   THEME_COLORS[color as keyof typeof THEME_COLORS]
               )}>
                  {primaryColor === color && <Check className="w-5 h-5 text-white mx-auto mt-2.5" />}
               </div>
            </button>
          ))}
        </div>
      </div>

      {/* Background Picker */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-900">背景图</h3>
            <input 
                type="file" 
                ref={fileInputRef}
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
            />
        </div>
        
        <div className="grid grid-cols-3 gap-3">
           {/* Default Options */}
           {backgrounds.map((bg) => (
             <div 
                key={bg.id} 
                className={cn(
                    "relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer border-2 transition-all",
                    backgroundImage === bg.url ? "border-teal-500 ring-2 ring-teal-500/20" : "border-transparent"
                )}
                onClick={() => setBackgroundImage(bg.url)}
             >
                {bg.url ? (
                    <img src={bg.url} alt={bg.label} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-xs text-gray-400">无</div>
                )}
                {backgroundImage === bg.url && (
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <Check className="w-6 h-6 text-white" />
                    </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-black/40 text-white text-[10px] p-1 text-center backdrop-blur-sm">
                    {bg.label}
                </div>
             </div>
           ))}

           {/* Upload Option */}
           <div 
                className={cn(
                    "relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer border-2 border-dashed border-gray-300 hover:border-gray-400 transition-all bg-gray-50 flex flex-col items-center justify-center gap-2",
                    isCustomBackground ? "border-teal-500 ring-2 ring-teal-500/20 bg-teal-50" : ""
                )}
                onClick={() => fileInputRef.current?.click()}
           >
                {isCustomBackground ? (
                    <>
                        <img src={backgroundImage} alt="Custom" className="absolute inset-0 w-full h-full object-cover opacity-60" />
                        <div className="relative z-10 bg-black/20 p-1 rounded-full">
                             <Check className="w-5 h-5 text-white" />
                        </div>
                        <div className="relative z-10 text-xs font-medium text-white shadow-sm">自定义</div>
                    </>
                ) : (
                    <>
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                            <Upload className="w-4 h-4 text-gray-500" />
                        </div>
                        <span className="text-xs text-gray-500">上传图片</span>
                    </>
                )}
           </div>
        </div>
      </div>
    </div>
  )
}
