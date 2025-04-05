import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = { 
  appId: 'com.tazdani.app',
  appName: 'Tazdani',
  webDir: 'out',
  bundledWebRuntime: false,
  server: {
  url: 'https://tazdani.bitdash.app',
    cleartext: true
  }
};

export default config;
