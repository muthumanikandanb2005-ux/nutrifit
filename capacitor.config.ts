import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.nutrifit.app',
  appName: 'NutriFit',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
