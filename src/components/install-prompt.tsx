'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Download, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // 检测是否已安装
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
      return
    }

    // 检测 iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    setIsIOS(iOS)

    // 监听安装提示事件（仅 Android Chrome）
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      
      // 延迟显示提示，避免打扰用户
      setTimeout(() => {
        const dismissed = localStorage.getItem('pwa-install-dismissed')
        if (!dismissed || Date.now() - parseInt(dismissed) > 7 * 24 * 60 * 60 * 1000) {
          setShowPrompt(true)
        }
      }, 3000)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // iOS 用户在首次访问后显示提示
    if (iOS) {
      const dismissed = localStorage.getItem('pwa-install-dismissed-ios')
      const visitCount = parseInt(localStorage.getItem('visit-count') || '0')
      localStorage.setItem('visit-count', String(visitCount + 1))
      
      if (!dismissed && visitCount >= 2) {
        setTimeout(() => setShowPrompt(true), 3000)
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    
    if (outcome === 'accepted') {
      console.log('用户接受安装')
    } else {
      console.log('用户拒绝安装')
      localStorage.setItem('pwa-install-dismissed', String(Date.now()))
    }
    
    setDeferredPrompt(null)
    setShowPrompt(false)
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    if (isIOS) {
      localStorage.setItem('pwa-install-dismissed-ios', 'true')
    } else {
      localStorage.setItem('pwa-install-dismissed', String(Date.now()))
    }
  }

  // 如果已安装或不显示提示，不渲染
  if (isInstalled || !showPrompt) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-20 left-4 right-4 z-50"
      >
        <div className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-2xl shadow-2xl p-4">
          <button
            onClick={handleDismiss}
            className="absolute top-2 right-2 p-1 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-start gap-3 pr-6">
            <div className="flex-shrink-0 w-12 h-12 bg-white rounded-xl flex items-center justify-center">
              <span className="text-2xl">🍡</span>
            </div>
            
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-1">
                {isIOS ? '添加到主屏幕' : '安装应用'}
              </h3>
              <p className="text-sm text-white/90 mb-3">
                {isIOS 
                  ? '点击分享按钮，选择"添加到主屏幕"，即可像原生应用一样使用' 
                  : '将麻薯记账添加到主屏幕，获得更好的使用体验'}
              </p>

              {!isIOS && deferredPrompt && (
                <Button
                  onClick={handleInstall}
                  size="sm"
                  className="bg-white text-teal-600 hover:bg-white/90"
                >
                  <Download className="w-4 h-4 mr-2" />
                  立即安装
                </Button>
              )}

              {isIOS && (
                <div className="flex items-center gap-2 text-sm">
                  <span>点击</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l-1 1v7H4l-2 2 2 2h7v7l1 1 1-1v-7h7l2-2-2-2h-7V3l-1-1z"/>
                  </svg>
                  <span>然后选择"添加到主屏幕"</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}




