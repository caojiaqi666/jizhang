"use client"

import { useEffect } from 'react'
import { StatusBar, Style } from '@capacitor/status-bar'
import { SplashScreen } from '@capacitor/splash-screen'
import { Capacitor } from '@capacitor/core'

export function CapacitorInit() {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return

    const initCapacitor = async () => {
      try {
        // 配置状态栏
        await StatusBar.setStyle({ style: Style.Light })
        await StatusBar.setBackgroundColor({ color: '#ffffff' })
        
        // 隐藏启动画面
        await SplashScreen.hide()
      } catch (error) {
        console.error('Capacitor init error:', error)
      }
    }

    initCapacitor()
  }, [])

  return null
}

