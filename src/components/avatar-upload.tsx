"use client"

import { useState, useRef, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Camera as CameraIcon, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { uploadAvatar } from "@/app/actions/user"
import { cn } from "@/lib/utils"
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'
import { Capacitor } from '@capacitor/core'

interface AvatarUploadProps {
  currentAvatarUrl: string | null
  displayName: string
  onUploadSuccess?: () => void
  className?: string
  size?: "sm" | "md" | "lg"
}

const sizeClasses = {
  sm: "w-12 h-12",
  md: "w-20 h-20",
  lg: "w-32 h-32",
}

const iconSizeClasses = {
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
}

const badgeSizeClasses = {
  sm: "w-6 h-6 bottom-0 right-0",
  md: "w-8 h-8 bottom-0 right-0",
  lg: "w-10 h-10 bottom-1 right-1",
}

export function AvatarUpload({
  currentAvatarUrl,
  displayName,
  onUploadSuccess,
  className,
  size = "md",
}: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [isNative, setIsNative] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // 检测是否在原生环境中运行
    setIsNative(Capacitor.isNativePlatform())
  }, [])

  const handleAvatarClick = async () => {
    // 如果是原生环境，使用 Capacitor Camera
    if (isNative) {
      try {
        const image = await Camera.getPhoto({
          quality: 90,
          allowEditing: true,
          resultType: CameraResultType.Uri,
          source: CameraSource.Prompt, // 让用户选择相机或相册
        })

        if (image.webPath) {
          // 将图片转换为 File 对象
          const response = await fetch(image.webPath)
          const blob = await response.blob()
          const file = new File([blob], 'avatar.jpg', { type: 'image/jpeg' })
          await handleUpload(file)
        }
      } catch (error: any) {
        if (error.message !== 'User cancelled photos app') {
          console.error('Camera error:', error)
          toast.error('无法获取照片')
        }
      }
    } else {
      // Web 环境使用传统的文件选择
      fileInputRef.current?.click()
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    await handleUpload(file)
    // 清空input，允许重复选择同一文件
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleUpload = async (file: File) => {
    // 验证文件类型
    if (!file.type.startsWith("image/")) {
      toast.error("请选择图片文件")
      return
    }

    // 验证文件大小 (限制为 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("图片大小不能超过 2MB")
      return
    }

    setUploading(true)
    try {
      const result = await uploadAvatar(file)
      
      if (!result.success) {
        throw new Error(result.error || "上传失败")
      }

      toast.success("头像更新成功")
      onUploadSuccess?.()
    } catch (error: any) {
      console.error("Upload error:", error)
      toast.error(error.message || "头像上传失败")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className={cn("relative inline-block", className)}>
      <div
        className="relative cursor-pointer group"
        onClick={handleAvatarClick}
      >
        <Avatar
          className={cn(
            sizeClasses[size],
            "border-4 border-white shadow-lg transition-opacity",
            uploading && "opacity-50"
          )}
        >
          <AvatarImage src={currentAvatarUrl || undefined} />
          <AvatarFallback>
            {displayName?.[0]?.toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>

        {/* 悬浮相机图标 */}
        <div
          className={cn(
            "absolute flex items-center justify-center bg-black/70 rounded-full transition-all",
            badgeSizeClasses[size],
            uploading ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          )}
        >
          {uploading ? (
            <Loader2 className={cn(iconSizeClasses[size], "animate-spin text-white")} />
          ) : (
            <CameraIcon className={cn(iconSizeClasses[size], "text-white")} />
          )}
        </div>
      </div>

      {/* 隐藏的文件输入 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        disabled={uploading}
      />
    </div>
  )
}

