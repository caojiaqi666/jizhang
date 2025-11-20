import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.flowmoney.app',
  appName: 'FlowMoney',
  webDir: 'out',
  server: {
    // 开发环境：指向本地服务器
    // 生产环境：指向部署的服务器 (如 https://your-app.vercel.app)
    // 如果不设置 url，则使用打包后的静态文件
    androidScheme: 'https',
    url: 'http://localhost:3000', // 开发时取消注释
    // url: 'https://your-app.vercel.app', // 生产环境取消注释并替换为实际域名
    cleartext: true, // 开发时允许 HTTP
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      launchFadeOutDuration: 300,
      backgroundColor: "#ffffff",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      androidSpinnerStyle: "large",
      iosSpinnerStyle: "small",
      spinnerColor: "#999999",
      splashFullScreen: true,
      splashImmersive: true,
      layoutName: "launch_screen",
      useDialog: true,
    },
    LocalNotifications: {
      smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#488AFF",
      sound: "beep.wav",
    },
  },
};

export default config;

