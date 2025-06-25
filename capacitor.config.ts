import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.doctorbluecr.app',
  appName: 'Doctor Blue',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    StatusBar: {
      overlaysWebView: false,
    },
		SplashScreen: {
			launchAutoHide: true
		}
	}
};

export default config;
